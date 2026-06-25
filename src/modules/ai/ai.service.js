import axios from "axios";
import Place from "../../DB/models/places.model.js";
import { getCache, setCache } from "../../utils/cache.util.js";
import logger from '../../utils/logger.js';

const FREE_MODELS = [
  "openai/gpt-oss-20b:free",
  "google/gemma-3-27b-it:free",
  "meta-llama/llama-3.2-3b-instruct:free",
  "microsoft/phi-3-mini-128k-instruct:free",
  "huggingfaceh4/zephyr-7b-beta:free",
];

const callAI = async (prompt, { maxTokens = 1500, retries = 2 } = {}) => {
  let lastError;

  for (let attempt = 0; attempt <= retries; attempt++) {
    for (const model of FREE_MODELS) {
      try {
        const response = await axios.post(
          "https://openrouter.ai/api/v1/chat/completions",
          {
            model,
            messages: [{ role: "user", content: prompt }],
            max_tokens: maxTokens,
          },
          {
            headers: {
              Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
              "Content-Type": "application/json",
              "HTTP-Referer": "http://localhost:3000",
              "X-Title": "Egyptian Tourist App",
            },
            timeout: 45000,
          },
        );

        const content = response.data?.choices?.[0]?.message?.content;
        if (!content) {
          logger.warn(`⚠️ Model ${model} returned empty content, skipping...`);
          continue;
        }

        const finishReason = response.data?.choices?.[0]?.finish_reason;
        logger.log(
          `✅ Used model: ${model} (attempt ${attempt + 1}) | length: ${content.length} chars | finish_reason: ${finishReason}`
        );

        return { content, finishReason, model };

      } catch (error) {
        const code = error.response?.data?.error?.code;
        const status = error.response?.status;
        lastError = error;

        logger.warn(`⚠️ Model ${model} failed (code: ${code}, status: ${status}), trying next...`);
        if (code === 429 || status === 429) {
          await new Promise((res) => setTimeout(res, 2000));
        }
        if (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT") {
          await new Promise((res) => setTimeout(res, 1000));
        }
      }
    }

    if (attempt < retries) {
      logger.warn(`🔄 All models failed on attempt ${attempt + 1}, retrying in 3s...`);
      await new Promise((res) => setTimeout(res, 3000));
    }
  }

  throw new Error("All AI models are currently unavailable, please try again later");
};

/**
 * يحاول يستخرج JSON صحيح من نص، وإذا كان ناقص (متقطع) يحاول يصلحه
 * بإغلاق الأقواس/الأكواليد المفتوحة الناقصة.
 */
const extractAndRepairJSON = (rawText) => {
  const clean = rawText.replace(/```json|```/g, "").trim();

  const startIndex = clean.indexOf("{");
  if (startIndex === -1) {
    throw new Error("No JSON object found in AI response");
  }

  let candidate = clean.slice(startIndex);

  // محاولة مباشرة أولاً
  try {
    return JSON.parse(candidate);
  } catch {
    // فشلت - يبقى الرد ناقص/متقطع، نحاول نصلحه
  }

  // نحاول نلاقي آخر نقطة "آمنة" نقدر نقطع عندها (آخر } أو ] مكتمل)
  // ونقفل أي أقواس متبقية مفتوحة
  let repaired = candidate;

  // نشيل أي فاصلة معلقة في الآخر أو نص ناقص بعد آخر فاصلة صحيحة
  // (مثال: ...,\n    {\n      "day": )
  const lastCompleteCommaIndex = repaired.lastIndexOf(",");
  const lastCompleteBraceIndex = Math.max(
    repaired.lastIndexOf("}"),
    repaired.lastIndexOf("]")
  );

  if (lastCompleteBraceIndex > -1 && lastCompleteBraceIndex > lastCompleteCommaIndex - 50) {
    // في الغالب اتقطع بعد آخر } أو ] مكتمل، نقطع هناك
    repaired = repaired.slice(0, lastCompleteBraceIndex + 1);
  }

  // نحسب الأقواس المفتوحة الناقصة ونقفلها بالترتيب الصحيح
  const stack = [];
  let inString = false;
  let escapeNext = false;

  for (let i = 0; i < repaired.length; i++) {
    const ch = repaired[i];

    if (escapeNext) {
      escapeNext = false;
      continue;
    }
    if (ch === "\\") {
      escapeNext = true;
      continue;
    }
    if (ch === '"') {
      inString = !inString;
      continue;
    }
    if (inString) continue;

    if (ch === "{" || ch === "[") {
      stack.push(ch);
    } else if (ch === "}" || ch === "]") {
      stack.pop();
    }
  }

  // نقفل أي string مفتوح ناقص
  if (inString) {
    repaired += '"';
  }

  // نقفل الأقواس المتبقية بالعكس
  while (stack.length > 0) {
    const open = stack.pop();
    repaired += open === "{" ? "}" : "]";
  }

  try {
    const parsed = JSON.parse(repaired);
    logger.warn("⚠️ AI response was truncated, successfully auto-repaired JSON.");
    return parsed;
  } catch (err) {
    throw new Error("AI returned invalid JSON format (unrepairable)");
  }
};

export const generateTripPlanService = async ({
  days,
  interests,
  budget,
  language = "en",
}) => {
  const cacheKey = `ai:trip:${days}:${interests.join(",")}:${budget}:${language}`;
  const cached = await getCache(cacheKey);
  if (cached) return cached;

  const places = await Place.find({
    category: { $in: interests },
  }).lean();

  const placesInfo = places.map((p) => ({
    name: language === "ar" ? p.name.ar : p.name.en,
    category: p.category,
    city: p.location.city,
    entryFee: p.entryFee.foreign,
  }));

  const buildPrompt = (compact = false) => {
    const lengthInstruction = compact
      ? (language === "ar"
          ? "كن مختصراً جداً: الوصف والنصائح في جملة واحدة قصيرة لكل منهما فقط."
          : "Be very concise: keep 'description' and 'tips' to ONE short sentence each.")
      : (language === "ar"
          ? "اجعل الوصف والنصائح مختصرين (جملتين كحد أقصى لكل منهما)."
          : "Keep 'description' and 'tips' brief (max 2 sentences each).");

    return language === "ar"
      ? `أنت مرشد سياحي خبير في مصر القديمة. قم بإنشاء خطة رحلة مفصلة.
       عدد الأيام: ${days}
       الاهتمامات: ${interests.join(", ")}
       الميزانية: ${budget} دولار
       الأماكن المتاحة: ${JSON.stringify(placesInfo)}
       ${lengthInstruction}
       مهم جداً: أرجع فقط JSON صحيح ومكتمل بالكامل (لا تتركه ناقصاً)، بدون أي نص إضافي قبله أو بعده، بهذا الشكل:
       {
         "title": "عنوان الرحلة",
         "overview": "نظرة عامة",
         "days": [{"day": 1, "title": "عنوان اليوم", "places": ["اسم المكان"], "description": "وصف", "tips": "نصائح"}],
         "totalBudget": "التكلفة التقريبية",
         "bestSeason": "أفضل موسم"
       }`
      : `You are an expert tour guide specializing in Ancient Egypt. Create a detailed trip plan.
       Days: ${days}, Interests: ${interests.join(", ")}, Budget: $${budget}
       Available places: ${JSON.stringify(placesInfo)}
       ${lengthInstruction}
       IMPORTANT: Return ONLY complete, valid JSON (never cut it off), no extra text before or after it, in this exact shape:
       {
         "title": "Trip title",
         "overview": "Trip overview",
         "days": [{"day": 1, "title": "Day title", "places": ["place name"], "description": "Description", "tips": "Tips"}],
         "totalBudget": "Estimated cost",
         "bestSeason": "Best season"
       }`;
  };

  const MAX_JSON_ATTEMPTS = 3;
  let lastErr;

  for (let i = 0; i < MAX_JSON_ATTEMPTS; i++) {
    // من المحاولة الثانية، نطلب نسخة مختصرة أكتر ونزود التوكنز
    const compact = i > 0;
    const prompt = buildPrompt(compact);
    const maxTokens = 4000 + i * 1000; // 4000, 5000, 6000

    const { content } = await callAI(prompt, { maxTokens, retries: 2 });

    try {
      const tripPlan = extractAndRepairJSON(content);
      await setCache(cacheKey, tripPlan, 3600);
      return tripPlan;
    } catch (err) {
      lastErr = err;
      logger.error(
        `❌ Attempt ${i + 1}/${MAX_JSON_ATTEMPTS} failed to produce valid JSON. Raw length: ${content.length}`
      );
      logger.error("Raw AI response (truncated to 1000 chars):", content.slice(0, 1000));
    }
  }

  throw new Error(`AI returned invalid JSON format after ${MAX_JSON_ATTEMPTS} attempts: ${lastErr?.message}`);
};

export const getPlaceStoryService = async ({ placeId, language = "en" }) => {
  const cacheKey = `ai:story:${placeId}:${language}`;
  const cached = await getCache(cacheKey);
  if (cached) return cached;

  const place = await Place.findById(placeId).lean();
  if (!place) throw new Error("Place not found");

  const placeName = language === "ar" ? place.name.ar : place.name.en;
  const placeDesc =
    language === "ar" ? place.description.ar : place.description.en;

  const prompt =
    language === "ar"
      ? `أنت راوٍ تاريخي خبير. اكتب قصة درامية عن ${placeName}.
       المعلومات: ${placeDesc}
       اكتب بضمير المخاطب "أنت" كأن الزائر يعيش اللحظة.
       150-200 كلمة فقط، بدون تنسيق إضافي.`
      : `You are a historical storyteller. Write a dramatic story about ${placeName}.
       Info: ${placeDesc}
       Write in second person "you" as if the visitor is there.
       150-200 words only, no extra formatting.`;

  const { content: story } = await callAI(prompt, { maxTokens: 1000, retries: 2 });

  await setCache(cacheKey, { story, placeName }, 86400);
  return { story, placeName };
};

export const chatWithGuideService = async ({ message, language = "en" }) => {
  const cacheKey = `ai:chat:${language}:${message.slice(0, 50)}`;
  const cached = await getCache(cacheKey);
  if (cached) return cached;

  const prompt =
    language === "ar"
      ? `أنت مرشد سياحي ذكي متخصص في الحضارة المصرية القديمة.
      أجب بنص عادي فقط، بدون أي تنسيق، بدون عناوين، بدون نقاط أو رموز خاصة.
       السؤال: ${message}`
      : `You are an intelligent tour guide specializing in Ancient Egyptian civilization.
       Answer in plain text only, NO Markdown, NO headers (#), NO bullet points (*, -), NO bold (**). Just plain conversational text.
       Question: ${message}`;

  const { content: reply } = await callAI(prompt, { maxTokens: 1000, retries: 2 });
  await setCache(cacheKey, { reply }, 3600);
  return { reply };
};