import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import dns from 'dns';
import Place from './DB/models/places.model.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '.env') });

dns.setServers(['1.1.1.1', '8.8.8.8']);
const places = [
  // ==================== PYRAMIDS ====================
  {
    name: { en: 'Great Pyramid of Giza', ar: 'هرم خوفو الأكبر' },
    description: {
      en: 'The oldest and largest of the three pyramids in the Giza pyramid complex. Built for Pharaoh Khufu around 2560 BC, it is the oldest of the Seven Wonders of the Ancient World.',
      ar: 'أكبر وأقدم الأهرامات الثلاثة في مجمع أهرامات الجيزة. بُني للفرعون خوفو حوالي 2560 قبل الميلاد.',
    },
    location: { city: 'Giza', governorate: 'Giza', coordinates: { lat: 29.9792, lng: 31.1342 } },
    category: 'Pyramids',
    images: ['https://res.cloudinary.com/dwtqabq1g/image/upload/v1779905492/_128835531_9a614faf-00d9-42b1-8ee7-7ec9a07e4c02_qkpcwp.jpg'],
    entryFee: { egyptian: 40, foreign: 360 },
    openingHours: '8:00 AM - 5:00 PM',
    bestTimeToVisit: 'October to April',
    rating: 4.9,
    isFeatured: true,
  },
  {
    name: { en: 'Pyramid of Khafre', ar: 'هرم خفرع' },
    description: {
      en: 'The second-largest pyramid at Giza, built for Pharaoh Khafre. It retains some of its original casing stones at the top.',
      ar: 'ثاني أكبر الأهرامات في الجيزة، بُني للفرعون خفرع.',
    },
    location: { city: 'Giza', governorate: 'Giza', coordinates: { lat: 29.9761, lng: 31.1309 } },
    category: 'Pyramids',
    images: ['https://res.cloudinary.com/dwtqabq1g/image/upload/v1776404999/%D9%87%D8%B1%D9%85_%D8%AE%D9%81%D8%B1%D8%B9_fbfu92.webp'],
    entryFee: { egyptian: 40, foreign: 360 },
    openingHours: '8:00 AM - 5:00 PM',
    bestTimeToVisit: 'October to April',
    rating: 4.8,
    isFeatured: true,
  },
  {
    name: { en: 'Step Pyramid of Djoser', ar: 'هرم زوسر المدرج' },
    description: {
      en: 'The oldest pyramid in Egypt, built around 2630 BC. It was the first large-scale stone structure in history.',
      ar: 'أقدم هرم في مصر، بُني حوالي 2630 قبل الميلاد. كان أول منشأة ضخمة مبنية من الحجارة في التاريخ.',
    },
    location: { city: 'Saqqara', governorate: 'Giza', coordinates: { lat: 29.8713, lng: 31.2165 } },
    category: 'Pyramids',
    images: ['https://res.cloudinary.com/dwtqabq1g/image/upload/v1776405258/330px-Saqqara_pyramid_yi8d6q.jpg'],
    entryFee: { egyptian: 30, foreign: 180 },
    openingHours: '8:00 AM - 5:00 PM',
    bestTimeToVisit: 'October to April',
    rating: 4.7,
    isFeatured: true,
  },
  {
    name: { en: 'Red Pyramid', ar: 'الهرم الأحمر' },
    description: {
      en: 'The world\'s first true smooth-sided pyramid, built by Pharaoh Sneferu at Dahshur.',
      ar: 'أول هرم حقيقي ذو جوانب ملساء في العالم، بناه الفرعون سنفرو في دهشور.',
    },
    location: { city: 'Dahshur', governorate: 'Giza', coordinates: { lat: 29.8086, lng: 31.2056 } },
    category: 'Pyramids',
    images: ['https://res.cloudinary.com/dwtqabq1g/image/upload/v1776406182/g75a3113_nqwna0.jpg'],
    entryFee: { egyptian: 20, foreign: 100 },
    openingHours: '8:00 AM - 4:00 PM',
    bestTimeToVisit: 'October to April',
    rating: 4.5,
    isFeatured: false,
  },

  // ==================== TEMPLES ====================
  {
    name: { en: 'Karnak Temple', ar: 'معبد الكرنك' },
    description: {
      en: 'The largest ancient religious site in the world, located in Luxor. A vast complex of temples, pylons, and obelisks dedicated to the Theban gods.',
      ar: 'أكبر موقع ديني قديم في العالم، يقع في الأقصر. مجمع ضخم من المعابد والأبراج والمسلات مخصص للآلهة الطيبية.',
    },
    location: { city: 'Luxor', governorate: 'Luxor', coordinates: { lat: 25.7188, lng: 32.6573 } },
    category: 'Temples',
    images: ['https://res.cloudinary.com/dwtqabq1g/image/upload/v1776406503/large_Templo_de_Karnak__Luxor__Egipto_e7mwa5.webp'],
    entryFee: { egyptian: 50, foreign: 340 },
    openingHours: '6:00 AM - 5:30 PM',
    bestTimeToVisit: 'October to February',
    rating: 4.9,
    isFeatured: true,
  },
  {
    name: { en: 'Luxor Temple', ar: 'معبد الأقصر' },
    description: {
      en: 'A large ancient Egyptian temple complex located on the east bank of the Nile. Built largely by Amenhotep III and Ramesses II.',
      ar: 'مجمع معبد مصري قديم كبير يقع على الضفة الشرقية للنيل. بُني في معظمه بواسطة أمنحوتب الثالث ورمسيس الثاني.',
    },
    location: { city: 'Luxor', governorate: 'Luxor', coordinates: { lat: 25.6997, lng: 32.6392 } },
    category: 'Temples',
    images: ['https://res.cloudinary.com/dwtqabq1g/image/upload/v1776406374/D9_85_D8_B9_D8_A8_D8_AF-_D8_A7_D9_84_D8_A7_D9_82_D8_B5_D8_B1_rkvvwy.jpg'],
    entryFee: { egyptian: 40, foreign: 260 },
    openingHours: '6:00 AM - 9:00 PM',
    bestTimeToVisit: 'October to February',
    rating: 4.8,
    isFeatured: true,
  },
  {
    name: { en: 'Abu Simbel Temples', ar: 'معابد أبو سمبل' },
    description: {
      en: 'Two massive rock temples carved by Ramesses II. The temples were relocated in 1968 to avoid submersion from the Aswan Dam.',
      ar: 'معبدان ضخمان منحوتان في الصخر بواسطة رمسيس الثاني. تم نقل المعابد عام 1968 لتجنب الغمر بسبب سد أسوان.',
    },
    location: { city: 'Abu Simbel', governorate: 'Aswan', coordinates: { lat: 22.3372, lng: 31.6258 } },
    category: 'Temples',
    images: ['https://res.cloudinary.com/dwtqabq1g/image/upload/v1776406252/Luxor-Temple-of-Karnak-1-2_vcjjhz.jpg'],
    entryFee: { egyptian: 50, foreign: 360 },
    openingHours: '5:00 AM - 6:00 PM',
    bestTimeToVisit: 'October to February',
    rating: 4.9,
    isFeatured: true,
  },
  {
    name: { en: 'Philae Temple', ar: 'معبد فيلة' },
    description: {
      en: 'An island temple complex dedicated to the goddess Isis, relocated to Agilkia Island after the construction of the Aswan Dam.',
      ar: 'مجمع معبد جزيري مخصص للإلهة إيزيس، تم نقله إلى جزيرة أجيلكيا بعد بناء سد أسوان.',
    },
    location: { city: 'Aswan', governorate: 'Aswan', coordinates: { lat: 24.0253, lng: 32.8847 } },
    category: 'Temples',
    images: ['https://res.cloudinary.com/dwtqabq1g/image/upload/v1776406683/178268_vfmpuc.jpg'],
    entryFee: { egyptian: 40, foreign: 220 },
    openingHours: '7:00 AM - 4:00 PM',
    bestTimeToVisit: 'October to February',
    rating: 4.8,
    isFeatured: true,
  },
  {
    name: { en: 'Edfu Temple', ar: 'معبد إدفو' },
    description: {
      en: 'One of the best-preserved temples in Egypt, dedicated to the falcon god Horus. Built during the Ptolemaic period.',
      ar: 'أحد أفضل المعابد المحفوظة في مصر، مخصص للإله حورس ذو رأس الصقر. بُني خلال العصر البطلمي.',
    },
    location: { city: 'Edfu', governorate: 'Aswan', coordinates: { lat: 24.9779, lng: 32.8734 } },
    category: 'Temples',
    images: ['https://res.cloudinary.com/dwtqabq1g/image/upload/v1776406085/dsc_1871c.jpg_digetq.jpg'],
    entryFee: { egyptian: 30, foreign: 180 },
    openingHours: '7:00 AM - 4:00 PM',
    bestTimeToVisit: 'October to March',
    rating: 4.7,
    isFeatured: false,
  },
  {
    name: { en: 'Kom Ombo Temple', ar: 'معبد كوم أمبو' },
    description: {
      en: 'An unusual double temple dedicated to Sobek the crocodile god and Horus the falcon god, located on the Nile.',
      ar: 'معبد مزدوج فريد من نوعه مخصص لسوبك إله التمساح وحورس إله الصقر، يقع على النيل.',
    },
    location: { city: 'Kom Ombo', governorate: 'Aswan', coordinates: { lat: 24.4522, lng: 32.9286 } },
    category: 'Temples',
    images: ['https://res.cloudinary.com/dwtqabq1g/image/upload/v1776406731/D9_85_D8_B9_D8_A8_D8_AF-_D9_83_D9_88_D9_85-_D8_A3_D9_85_D8_A8_D9_88.jpg_lllep5.jpg'],
    entryFee: { egyptian: 20, foreign: 140 },
    openingHours: '7:00 AM - 5:00 PM',
    bestTimeToVisit: 'October to March',
    rating: 4.6,
    isFeatured: false,
  },
  {
    name: { en: 'Hatshepsut Temple', ar: 'معبد حتشبسوت' },
    description: {
      en: 'The mortuary temple of Pharaoh Hatshepsut, one of Egypt\'s few female pharaohs. Built into the cliffs at Deir el-Bahari.',
      ar: 'المعبد الجنائزي للفرعون حتشبسوت، إحدى الفراعنة الإناث النادرين في مصر. بُني في صخور الدير البحري.',
    },
    location: { city: 'Luxor', governorate: 'Luxor', coordinates: { lat: 25.7379, lng: 32.6067 } },
    category: 'Temples',
    images: ['https://res.cloudinary.com/dwtqabq1g/image/upload/v1776406802/D9_85_D8_B9_D8_A8_D8_AF-_D8_AD_D8_AA_D8_B4_D8_A8_D8_B3_D9_88_D8_AA-_D8_A7_D9_84_D9_85_D9_88_D9_82_D8_B9-_D9_88_D8_A7_D9_84_D8_A3_D9_87_D9_85_D9_8A_D8_A9-_D8_A7_D9_84_D8_AA_D8_A7_D8_B1_D9_8A_D8_AE_D9_8A_D8_A9_jabxdy.jpg'],
    entryFee: { egyptian: 40, foreign: 240 },
    openingHours: '6:00 AM - 5:00 PM',
    bestTimeToVisit: 'October to February',
    rating: 4.8,
    isFeatured: true,
  },
  {
    name: { en: 'Dendera Temple', ar: 'معبد دندرة' },
    description: {
      en: 'One of the best-preserved temple complexes in Egypt, dedicated to the goddess Hathor. Famous for the Dendera Zodiac.',
      ar: 'أحد أفضل مجمعات المعابد المحفوظة في مصر، مخصص للإلهة حتحور. يشتهر ببروج دندرة.',
    },
    location: { city: 'Dendera', governorate: 'Qena', coordinates: { lat: 26.1417, lng: 32.6700 } },
    category: 'Temples',
    images: ['https://res.cloudinary.com/dwtqabq1g/image/upload/v1776406847/5df82dd3-e073-490e-9732-8cabdd3a1f14_16x9_1200x676_wip03v.jpg'],
    entryFee: { egyptian: 30, foreign: 180 },
    openingHours: '7:00 AM - 5:00 PM',
    bestTimeToVisit: 'October to March',
    rating: 4.7,
    isFeatured: false,
  },
  {
    name: { en: 'Abydos Temple', ar: 'معبد أبيدوس' },
    description: {
      en: 'One of the oldest cities of ancient Egypt, containing the Temple of Seti I with remarkable reliefs and the Abydos King List.',
      ar: 'إحدى أقدم مدن مصر القديمة، تحتوي على معبد سيتي الأول بنقوشه الرائعة وقائمة ملوك أبيدوس.',
    },
    location: { city: 'Abydos', governorate: 'Sohag', coordinates: { lat: 26.1844, lng: 31.9194 } },
    category: 'Temples',
    images: ['https://res.cloudinary.com/dwtqabq1g/image/upload/v1776406903/897891-1076608723_o0lozx.jpg'],
    entryFee: { egyptian: 20, foreign: 140 },
    openingHours: '7:00 AM - 5:00 PM',
    bestTimeToVisit: 'October to March',
    rating: 4.6,
    isFeatured: false,
  },

  // ==================== MUSEUMS ====================
  {
    name: { en: 'Egyptian Museum Cairo', ar: 'المتحف المصري بالقاهرة' },
    description: {
      en: 'Home to the most extensive collection of ancient Egyptian antiquities in the world, including Tutankhamun\'s treasures.',
      ar: 'يضم أوسع مجموعة من الآثار المصرية القديمة في العالم، بما في ذلك كنوز توتنخامون.',
    },
    location: { city: 'Cairo', governorate: 'Cairo', coordinates: { lat: 30.0478, lng: 31.2336 } },
    category: 'Museums',
    images: ['https://res.cloudinary.com/dwtqabq1g/image/upload/v1776406991/330px-The_Egyptian_Museum_e1dso0.jpg'],
    entryFee: { egyptian: 30, foreign: 300 },
    openingHours: '9:00 AM - 5:00 PM',
    bestTimeToVisit: 'Year round',
    rating: 4.8,
    isFeatured: true,
  },
  {
    name: { en: 'Grand Egyptian Museum', ar: 'المتحف المصري الكبير' },
    description: {
      en: 'The largest archaeological museum in the world, located near the Giza pyramids. Houses over 100,000 artifacts including the complete Tutankhamun collection.',
      ar: 'أكبر متحف أثري في العالم، يقع بالقرب من أهرامات الجيزة. يضم أكثر من 100,000 قطعة أثرية بما في ذلك مجموعة توتنخامون الكاملة.',
    },
    location: { city: 'Giza', governorate: 'Giza', coordinates: { lat: 29.9875, lng: 31.1097 } },
    category: 'Museums',
    images: ['https://res.cloudinary.com/dwtqabq1g/image/upload/v1776407063/D8_A7_D9_84_D9_85_D8_AA_D8_AD_D9_81-_D8_A7_D9_84_D9_85_D8_B5_D8_B1_D9_8A-_D8_A7_D9_84_D9_83_D8_A8_D9_8A_D8_B1_xted7p.png'],
    entryFee: { egyptian: 100, foreign: 500 },
    openingHours: '9:00 AM - 9:00 PM',
    bestTimeToVisit: 'Year round',
    rating: 4.9,
    isFeatured: true,
  },
  {
    name: { en: 'Luxor Museum', ar: 'متحف الأقصر' },
    description: {
      en: 'A small but excellent museum on the east bank of the Nile in Luxor, featuring a well-displayed collection of artifacts from the Theban temples.',
      ar: 'متحف صغير لكن ممتاز على الضفة الشرقية للنيل في الأقصر، يضم مجموعة معروضة بشكل جيد من القطع الأثرية من معابد طيبة.',
    },
    location: { city: 'Luxor', governorate: 'Luxor', coordinates: { lat: 25.7044, lng: 32.6425 } },
    category: 'Museums',
    images: ['https://res.cloudinary.com/dwtqabq1g/image/upload/v1776407132/BDeIeEA_egrsjw.jpg'],
    entryFee: { egyptian: 20, foreign: 160 },
    openingHours: '9:00 AM - 5:00 PM',
    bestTimeToVisit: 'Year round',
    rating: 4.6,
    isFeatured: false,
  },
  {
    name: { en: 'Nubian Museum', ar: 'المتحف النوبي' },
    description: {
      en: 'Located in Aswan, this museum showcases the history and culture of the Nubian people from prehistoric times to the present.',
      ar: 'يقع في أسوان، يعرض هذا المتحف تاريخ وثقافة الشعب النوبي من عصور ما قبل التاريخ حتى الوقت الحاضر.',
    },
    location: { city: 'Aswan', governorate: 'Aswan', coordinates: { lat: 24.0826, lng: 32.9006 } },
    category: 'Museums',
    images: ['https://res.cloudinary.com/dwtqabq1g/image/upload/v1776407185/60-162631-nubianmusuem_700x400.jpeg_ci9jdn.jpg'],
    entryFee: { egyptian: 20, foreign: 150 },
    openingHours: '9:00 AM - 6:00 PM',
    bestTimeToVisit: 'Year round',
    rating: 4.7,
    isFeatured: false,
  },

  // ==================== TOMBS ====================
  {
    name: { en: 'Valley of the Kings', ar: 'وادي الملوك' },
    description: {
      en: 'A valley where rock-cut tombs were excavated for pharaohs of the New Kingdom. Home to over 60 tombs including Tutankhamun\'s.',
      ar: 'وادٍ حيث نُحتت مقابر في الصخور لفراعنة الدولة الحديثة. يضم أكثر من 60 مقبرة بما في ذلك مقبرة توتنخامون.',
    },
    location: { city: 'Luxor', governorate: 'Luxor', coordinates: { lat: 25.7402, lng: 32.6014 } },
    category: 'Tombs',
    images: ['https://res.cloudinary.com/dwtqabq1g/image/upload/v1776407237/e0b84928-7ded-4ba2-8982-d6bb6cab7d9a_olb9zl.jpg'],
    entryFee: { egyptian: 50, foreign: 340 },
    openingHours: '6:00 AM - 5:00 PM',
    bestTimeToVisit: 'October to February',
    rating: 4.9,
    isFeatured: true,
  },
  {
    name: { en: 'Valley of the Queens', ar: 'وادي الملكات' },
    description: {
      en: 'The site where wives of pharaohs were buried. Contains over 90 tombs including the famous tomb of Queen Nefertari.',
      ar: 'الموقع الذي دُفنت فيه زوجات الفراعنة. يحتوي على أكثر من 90 مقبرة بما في ذلك المقبرة الشهيرة للملكة نفرتاري.',
    },
    location: { city: 'Luxor', governorate: 'Luxor', coordinates: { lat: 25.7268, lng: 32.5990 } },
    category: 'Tombs',
    images: ['https://res.cloudinary.com/dwtqabq1g/image/upload/v1776407327/caption_mijalp.jpg'],
    entryFee: { egyptian: 40, foreign: 240 },
    openingHours: '6:00 AM - 5:00 PM',
    bestTimeToVisit: 'October to February',
    rating: 4.7,
    isFeatured: false,
  },
  {
    name: { en: 'Tomb of Tutankhamun', ar: 'مقبرة توتنخامون' },
    description: {
      en: 'The nearly intact tomb of the boy pharaoh Tutankhamun, discovered in 1922 by Howard Carter. One of the greatest archaeological discoveries ever made.',
      ar: 'مقبرة الفرعون الصبي توتنخامون السليمة تقريباً، اكتُشفت عام 1922 بواسطة هوارد كارتر. واحدة من أعظم الاكتشافات الأثرية على الإطلاق.',
    },
    location: { city: 'Luxor', governorate: 'Luxor', coordinates: { lat: 25.7402, lng: 32.6014 } },
    category: 'Tombs',
    images: ['https://res.cloudinary.com/dwtqabq1g/image/upload/v1776407417/c9429c4f-40dc-4913-8f55-c64d753908f1_lzg3tt.jpg'],
    entryFee: { egyptian: 100, foreign: 500 },
    openingHours: '6:00 AM - 5:00 PM',
    bestTimeToVisit: 'October to February',
    rating: 4.9,
    isFeatured: true,
  },
  {
    name: { en: 'Tombs of the Nobles', ar: 'مقابر النبلاء' },
    description: {
      en: 'A group of tombs in Luxor belonging to high officials of ancient Egypt. Known for their vivid paintings depicting daily life.',
      ar: 'مجموعة من المقابر في الأقصر تعود لكبار مسؤولي مصر القديمة. تشتهر برسوماتها الزاهية التي تصور الحياة اليومية.',
    },
    location: { city: 'Luxor', governorate: 'Luxor', coordinates: { lat: 25.7317, lng: 32.6067 } },
    category: 'Tombs',
    images: ['https://res.cloudinary.com/dwtqabq1g/image/upload/v1776407519/D8_A7_D9_84_D9_87_D9_88_D8_A7-74_xs8cqs.jpg'],
    entryFee: { egyptian: 20, foreign: 140 },
    openingHours: '6:00 AM - 5:00 PM',
    bestTimeToVisit: 'October to February',
    rating: 4.5,
    isFeatured: false,
  },
  {
    name: { en: 'Saqqara Necropolis', ar: 'جبانة سقارة' },
    description: {
      en: 'A vast ancient burial ground serving as the necropolis for Memphis, containing numerous pyramids and tombs spanning 3,000 years of Egyptian history.',
      ar: 'مقبرة قديمة شاسعة تعمل كمدفن لمنف، تحتوي على أهرامات ومقابر عديدة تمتد عبر 3000 عام من التاريخ المصري.',
    },
    location: { city: 'Saqqara', governorate: 'Giza', coordinates: { lat: 29.8713, lng: 31.2165 } },
    category: 'Tombs',
    images: ['https://res.cloudinary.com/dwtqabq1g/image/upload/v1776407562/dsc_0046.jpg_kyjihp.jpg'],
    entryFee: { egyptian: 30, foreign: 180 },
    openingHours: '8:00 AM - 5:00 PM',
    bestTimeToVisit: 'October to April',
    rating: 4.7,
    isFeatured: true,
  },

  // ==================== MONUMENTS ====================
  {
    name: { en: 'The Great Sphinx', ar: 'أبو الهول' },
    description: {
      en: 'A limestone statue of a reclining sphinx with a human head and lion body. The largest monolith statue in the world, built during the reign of Pharaoh Khafre.',
      ar: 'تمثال حجري جيري لأبو الهول مستلقٍ برأس إنسان وجسم أسد. أكبر تمثال منحوت من قطعة واحدة في العالم، بُني في عهد الفرعون خفرع.',
    },
    location: { city: 'Giza', governorate: 'Giza', coordinates: { lat: 29.9753, lng: 31.1376 } },
    category: 'Monuments',
    images: ['https://res.cloudinary.com/dwtqabq1g/image/upload/v1776407613/79cae5b6-f2e3-454e-baf5-feab77796e20_16x9_1200x676_jzflvm.jpg'],
    entryFee: { egyptian: 40, foreign: 360 },
    openingHours: '8:00 AM - 5:00 PM',
    bestTimeToVisit: 'October to April',
    rating: 4.9,
    isFeatured: true,
  },
  {
    name: { en: 'Luxor Obelisk', ar: 'مسلة الأقصر' },
    description: {
      en: 'Originally one of a pair of obelisks at Luxor Temple, erected by Ramesses II. One was gifted to France and now stands in Paris.',
      ar: 'كانت في الأصل إحدى مسلتين في معبد الأقصر، أقامهما رمسيس الثاني. أُهديت إحداهما لفرنسا وتقف الآن في باريس.',
    },
    location: { city: 'Luxor', governorate: 'Luxor', coordinates: { lat: 25.6997, lng: 32.6392 } },
    category: 'Monuments',
    images: ['https://res.cloudinary.com/dwtqabq1g/image/upload/v1776407667/obelisk-in-front-of-the_pwkyt7.jpg'],
    entryFee: { egyptian: 40, foreign: 260 },
    openingHours: '6:00 AM - 9:00 PM',
    bestTimeToVisit: 'October to February',
    rating: 4.7,
    isFeatured: false,
  },
  {
    name: { en: 'Colossi of Memnon', ar: 'تمثالا ممنون' },
    description: {
      en: 'Two massive stone statues of Pharaoh Amenhotep III, standing 18 meters tall, guarding the entrance to his mortuary temple.',
      ar: 'تمثالان حجريان ضخمان للفرعون أمنحوتب الثالث، يبلغ ارتفاعهما 18 متراً، يحرسان مدخل معبده الجنائزي.',
    },
    location: { city: 'Luxor', governorate: 'Luxor', coordinates: { lat: 25.7203, lng: 32.6100 } },
    category: 'Monuments',
    images: ['https://res.cloudinary.com/dwtqabq1g/image/upload/v1776407765/250px-AmenhotepIII_South_Colossus_v4gc8u.jpg'],
    entryFee: { egyptian: 0, foreign: 0 },
    openingHours: 'Open 24 hours',
    bestTimeToVisit: 'October to February',
    rating: 4.6,
    isFeatured: false,
  },
  {
    name: { en: 'Unfinished Obelisk', ar: 'المسلة الناقصة' },
    description: {
      en: 'The largest known ancient obelisk, located in a quarry in Aswan. It was abandoned due to cracks and gives insight into ancient stone-cutting techniques.',
      ar: 'أكبر مسلة قديمة معروفة، تقع في محجر في أسوان. تُركت بسبب الشقوق وتوفر نظرة ثاقبة على تقنيات نحت الحجارة القديمة.',
    },
    location: { city: 'Aswan', governorate: 'Aswan', coordinates: { lat: 24.0878, lng: 32.8936 } },
    category: 'Monuments',
    images: ['https://res.cloudinary.com/dwtqabq1g/image/upload/v1776407818/a1b8c3fd-c274-457c-96c9-84ead0fd2ee2_16x9_600x338_eqkoyr.jpg'],
    entryFee: { egyptian: 20, foreign: 100 },
    openingHours: '7:00 AM - 5:00 PM',
    bestTimeToVisit: 'October to March',
    rating: 4.4,
    isFeatured: false,
  },
  {
    name: { en: 'Avenue of Sphinxes', ar: 'طريق الكباش' },
    description: {
      en: 'A 2.7 km ancient road lined with sphinx statues connecting Karnak and Luxor temples, recently restored and opened to visitors.',
      ar: 'طريق قديم بطول 2.7 كم مصطف بتماثيل الكباش يربط بين معبدي الكرنك والأقصر، تم ترميمه مؤخراً وافتُتح للزوار.',
    },
    location: { city: 'Luxor', governorate: 'Luxor', coordinates: { lat: 25.7100, lng: 32.6400 } },
    category: 'Monuments',
    images: ['https://res.cloudinary.com/dwtqabq1g/image/upload/v1776407928/D8_B7_D8_B1_D9_8A_D9_82__D8_A7_D9_84_D9_83_D8_A8_D8_A7_D8_B4__D8_A8_D8_A7_D9_84_D8_A3_D9_82_D8_B5_D8_B1_fjoyjj.jpg'],
    entryFee: { egyptian: 20, foreign: 100 },
    openingHours: '6:00 AM - 10:00 PM',
    bestTimeToVisit: 'October to February',
    rating: 4.8,
    isFeatured: true,
  },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected');

    await Place.deleteMany({});
    console.log('🗑️ Old data cleared');

    await Place.insertMany(places);
    console.log(`✅ ${places.length} places inserted successfully!`);

    await mongoose.disconnect();
    console.log('✅ Done!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
};

seed();