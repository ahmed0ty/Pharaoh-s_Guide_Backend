import Place from "../../DB/models/places.model.js";
import {
  getCache,
  setCache,
  clearCacheByPrefix,
} from "../../utils/cache.util.js";

export const getAllPlacesService = async ({
  page,
  limit,
  category,
  search,
}) => {
  const cacheKey = `places:all:${page}:${limit}:${category}:${search}`;
  const cached = await getCache(cacheKey);
  if (cached) return cached;

  page = Math.max(Number(page), 1);
  limit = Math.max(Number(limit), 1);

  const query = {};

  if (category && category !== "All") query.category = category;

  if (search?.trim()) {
    query.$or = [
      { "name.en": { $regex: search.trim(), $options: "i" } },
      { "name.ar": { $regex: search.trim(), $options: "i" } },
      { "location.city": { $regex: search.trim(), $options: "i" } },
    ];
  }

  const skip = (page - 1) * limit;

  const [places, total] = await Promise.all([
    Place.find(query)
      .sort({ isFeatured: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Place.countDocuments(query),
  ]);

  const pages = Math.ceil(total / limit);

  const result = {
    places,
    pagination: {
      total,
      page,
      pages,
      hasNextPage: page < pages,
      hasPrevPage: page > 1,
    },
  };

  await setCache(cacheKey, result, 300);
  return result;
};

export const getPlaceByIdService = async (id) => {
  const cacheKey = `places:${id}`;
  const cached = await getCache(cacheKey);
  if (cached) return cached;

  const place = await Place.findById(id).lean();
  if (!place) throw new Error("Place not found");

  await setCache(cacheKey, place, 300);
  return place;
};

export const getFeaturedPlacesService = async () => {
  const cacheKey = "places:featured";
  const cached = await getCache(cacheKey);
  if (cached) return cached;

  const places = await Place.find({ isFeatured: true })
    .sort({ rating: -1 })
    .limit(6)
    .lean();

  await setCache(cacheKey, places, 300);
  return places;
};

export const createPlaceService = async (data) => {
  const place = await Place.create(data);
  await clearCacheByPrefix("places:");
  return place;
};

export const seedPlacesService = async () => {
  const count = await Place.countDocuments();
  if (count > 0) return { message: "Places already seeded" };

  const places = [
    {
      name: { en: "The Great Pyramids", ar: "الأهرامات الكبرى" },
      description: {
        en: "One of the Seven Wonders of the Ancient World, built for Pharaoh Khufu.",
        ar: "إحدى عجائب الدنيا السبع، بُنيت للفرعون خوفو.",
      },
      story: {
        en: "You are now standing before the last surviving wonder of the ancient world. Built over 4,500 years ago, these massive structures were tombs for the pharaohs...",
        ar: "أنت الآن تقف أمام آخر عجائب العالم القديم الباقية. بُنيت منذ أكثر من 4500 عام كمقابر للفراعنة...",
      },
      location: {
        city: "Giza",
        governorate: "Cairo",
        coordinates: { lat: 29.9792, lng: 31.1342 },
      },
      category: "Pyramids",
      images: [
        "https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=800",
      ],
      bestTimeToVisit: "October to April",
      entryFee: { egyptian: 40, foreign: 200 },
      openingHours: "8:00 AM - 5:00 PM",
      rating: 5,
      isFeatured: true,
    },
    {
      name: { en: "Karnak Temple", ar: "معبد الكرنك" },
      description: {
        en: "The largest ancient religious site in the world, dedicated to the god Amun.",
        ar: "أكبر موقع ديني قديم في العالم، مكرس للإله آمون.",
      },
      story: {
        en: "You are entering a sacred city of temples. Built over 2,000 years by successive pharaohs, Karnak was the most important religious complex in ancient Egypt...",
        ar: "أنت تدخل مدينة مقدسة من المعابد. بُنيت على مدى 2000 عام من قِبل الفراعنة المتعاقبين...",
      },
      location: {
        city: "Luxor",
        governorate: "Luxor",
        coordinates: { lat: 25.7188, lng: 32.6573 },
      },
      category: "Temples",
      images: [
        "https://images.unsplash.com/photo-1600093112070-9d91c3e2e762?w=800",
      ],
      bestTimeToVisit: "November to February",
      entryFee: { egyptian: 50, foreign: 220 },
      openingHours: "6:00 AM - 5:30 PM",
      rating: 4.9,
      isFeatured: true,
    },
    {
      name: { en: "Valley of the Kings", ar: "وادي الملوك" },
      description: {
        en: "Royal tombs of pharaohs from the New Kingdom era, including Tutankhamun.",
        ar: "مقابر ملكية للفراعنة من عصر الدولة الحديثة، بما فيها توت عنخ آمون.",
      },
      story: {
        en: "You stand at the entrance of a valley that held Egypt's greatest secrets for thousands of years. Here, 63 tombs were carved into the rock for pharaohs and nobles...",
        ar: "تقف عند مدخل وادٍ احتضن أعظم أسرار مصر لآلاف السنين...",
      },
      location: {
        city: "Luxor",
        governorate: "Luxor",
        coordinates: { lat: 25.7402, lng: 32.6014 },
      },
      category: "Tombs",
      images: [
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
      ],
      bestTimeToVisit: "October to March",
      entryFee: { egyptian: 60, foreign: 240 },
      openingHours: "6:00 AM - 5:00 PM",
      rating: 4.8,
      isFeatured: true,
    },
    {
      name: { en: "Egyptian Museum", ar: "المتحف المصري" },
      description: {
        en: "Home to the world's largest collection of ancient Egyptian artifacts.",
        ar: "يضم أكبر مجموعة من الآثار المصرية القديمة في العالم.",
      },
      story: {
        en: "Step inside a treasure house of human history. Over 120,000 artifacts span Egypt's entire history, including the golden mask of Tutankhamun...",
        ar: "ادخل إلى كنز من كنوز التاريخ البشري. أكثر من 120,000 قطعة أثرية تمتد عبر تاريخ مصر كله...",
      },
      location: {
        city: "Cairo",
        governorate: "Cairo",
        coordinates: { lat: 30.0478, lng: 31.2336 },
      },
      category: "Museums",
      images: [
        "https://images.unsplash.com/photo-1572252009286-268acec5ca0a?w=800",
      ],
      bestTimeToVisit: "Year round",
      entryFee: { egyptian: 30, foreign: 180 },
      openingHours: "9:00 AM - 5:00 PM",
      rating: 4.7,
      isFeatured: true,
    },
    {
      name: { en: "Abu Simbel", ar: "أبو سمبل" },
      description: {
        en: "Magnificent rock temples built by Ramesses II, relocated to save them from floods.",
        ar: "معابد صخرية رائعة بناها رمسيس الثاني، تم نقلها لإنقاذها من الفيضانات.",
      },
      story: {
        en: "You are witnessing one of the greatest engineering feats of both ancient and modern times. Ramesses II carved these temples into a cliff face over 3,000 years ago...",
        ar: "أنت تشهد واحداً من أعظم الإنجازات الهندسية في العصور القديمة والحديثة...",
      },
      location: {
        city: "Abu Simbel",
        governorate: "Aswan",
        coordinates: { lat: 22.3372, lng: 31.6258 },
      },
      category: "Temples",
      images: [
        "https://images.unsplash.com/photo-1568322445389-f64ac2515020?w=800",
      ],
      bestTimeToVisit: "October to February",
      entryFee: { egyptian: 80, foreign: 300 },
      openingHours: "5:00 AM - 6:00 PM",
      rating: 4.9,
      isFeatured: true,
    },
    {
      name: { en: "The Great Sphinx", ar: "أبو الهول" },
      description: {
        en: "The legendary guardian of the Giza plateau, carved from a single limestone block.",
        ar: "حارس هضبة الجيزة الأسطوري، منحوت من كتلة حجر جيري واحدة.",
      },
      story: {
        en: "Before you stands the oldest monumental sculpture on Earth. The Sphinx has watched over the pyramids for over 4,500 years, its origin and purpose still debated by scholars...",
        ar: "أمامك يقف أقدم نصب تذكاري ضخم على وجه الأرض. أبو الهول يحرس الأهرامات منذ أكثر من 4500 عام...",
      },
      location: {
        city: "Giza",
        governorate: "Cairo",
        coordinates: { lat: 29.9753, lng: 31.1376 },
      },
      category: "Monuments",
      images: [
        "https://images.unsplash.com/photo-1562679299-8f38d5b13a49?w=800",
      ],
      bestTimeToVisit: "October to April",
      entryFee: { egyptian: 40, foreign: 200 },
      openingHours: "8:00 AM - 5:00 PM",
      rating: 4.8,
      isFeatured: false,
    },
  ];

  await Place.insertMany(places);
  await clearCacheByPrefix("places:");
  return { message: "Places seeded successfully", count: places.length };
};
