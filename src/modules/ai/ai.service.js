
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

const callAI = async (prompt, retries = 2) => {
  let lastError;

  for (let attempt = 0; attempt <= retries; attempt++) {
    for (const model of FREE_MODELS) {
      try {
        const response = await axios.post(
          "https://openrouter.ai/api/v1/chat/completions",
          {
            model,
            messages: [{ role: "user", content: prompt }],
            max_tokens: 1500,
          },
          {
            headers: {
              Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
              "Content-Type": "application/json",
              "HTTP-Referer": "http://localhost:3000",
              "X-Title": "Egyptian Tourist App",
            },
            timeout: 30000,
          },
        );

        const content = response.data?.choices?.[0]?.message?.content;
        if (!content) {
          logger.warn(`⚠️ Model ${model} returned empty content, skipping...`);
          continue;
        }

        logger.log(`✅ Used model: ${model} (attempt ${attempt + 1})`);
        return content;

      } catch (error) {
        const code = error.response?.data?.error?.code;
        const status = error.response?.status;
        lastError = error;

logger.warn(`⚠️ Model ${model} failed (code: ${code}, status: ${status}), trying next...`)
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

  const prompt =
    language === "ar"
      ? `أنت مرشد سياحي خبير في مصر القديمة. قم بإنشاء خطة رحلة مفصلة.
       عدد الأيام: ${days}
       الاهتمامات: ${interests.join(", ")}
       الميزانية: ${budget} دولار
       الأماكن المتاحة: ${JSON.stringify(placesInfo)}
       أرجع JSON فقط بدون أي نص إضافي بهذا الشكل:
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
       Return ONLY valid JSON, no extra text:
       {
         "title": "Trip title",
         "overview": "Trip overview",
         "days": [{"day": 1, "title": "Day title", "places": ["place name"], "description": "Description", "tips": "Tips"}],
         "totalBudget": "Estimated cost",
         "bestSeason": "Best season"
       }`;

  const content = await callAI(prompt);
  const clean = content.replace(/```json|```/g, "").trim();

  let tripPlan;
  try {
    const jsonMatch = clean.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON found");
    tripPlan = JSON.parse(jsonMatch[0]);
  } catch {
    logger.error("Raw AI response:", clean);
    throw new Error("AI returned invalid JSON format");
  }

  await setCache(cacheKey, tripPlan, 3600);
  return tripPlan;
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

  const story = await callAI(prompt);

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

  const reply = await callAI(prompt);
  await setCache(cacheKey, { reply }, 3600);
  return { reply };
};