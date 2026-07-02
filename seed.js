import db from './db.js'

// Mahsulotlar — public/assets ichidagi barcha rasmlar asosida.
// r=ramen, d=drink(ichimlik), s=snack. Narx — so'm.
const R = (kr, name, label, img, price, spicy, desc) => ({ cat: 'ramen', kr, name, label, desc: desc || label, img, price, spicy, tone: spicy >= 1 ? 'spicy' : '', badge: spicy >= 2 ? '🔥 Spicy' : 'Ramen', available: true })
const D = (kr, name, label, img, price, desc) => ({ cat: 'drink', kr, name, label, desc: desc || label, img, price, spicy: 0, tone: 'drink', badge: 'Ichimlik', available: true })
const S = (kr, name, label, img, price, spicy, desc) => ({ cat: 'snack', kr, name, label, desc: desc || label, img, price, spicy: spicy || 0, tone: 'snack', badge: 'Snek', available: true })

const products = [
  // ===== RAMEN =====
  R('김치 라면', 'Kimchi Ramen', "Achchiq-nordon kimchi ta'mi", 'kimchi', 22000, 2, "Yangi pishirilgan kimchi ramen — achchiq-nordon bulonda, joyida tayyorlanadi."),
  R('김치 라면', 'Kimchi Ramen', 'Klassik kimchi ramen', 'kimchi1', 22000, 2),
  R('김치 라면', 'Kimchi Ramyun (kosa)', 'Kosada kimchi ramen', 'kimchi2', 24000, 2),
  R('신라면 블랙', 'Shin Ramyun Black', "Premium suyak buloni bilan", 'shin', 28000, 2, "Shin Ramyun Black — boy suyak buloni va mol go'shti ta'mi bilan premium ramen."),
  R('신라면', 'Shin Ramyun', 'Eng mashhur achchiq ramen', 'shin1', 20000, 2, "Dunyodagi eng mashhur koreys rameni — boy, achchiq bulonda."),
  R('신라면 볶음면', 'Shin Ramyun Stir-Fry', 'Quruq achchiq qovurma ramen', 'shin2', 24000, 2),
  R('신라면 블랙', 'Shin Ramyun Black', "Boyitilgan premium ta'm", 'shin3', 28000, 2),
  R('신라면 컵', 'Shin Ramyun (stakan)', 'Tez tayyor stakan ramen', 'shin4', 22000, 2),
  R('신라면 볶음면', 'Shin Ramyun Stir-Fry', 'Achchiq qovurma ramen', 'shin5', 24000, 2),
  R('신라면', 'Shin Ramyun', 'Klassik achchiq ramen', 'shin6', 20000, 2),
  R('신라면 작은컵', 'Shin Ramyun (kichik stakan)', 'Kichik stakan ramen', 'shin7', 18000, 2),
  R('엄청 매운', 'Super Spicy', "O'ta achchiq ramen", 'super', 26000, 3, "Haqiqiy achchiq sevuvchilar uchun — o'ta achchiq olovli ramen."),
  R('삼양 불닭볶음면', 'Samyang Buldak', "Olovli tovuq ta'mi", 'samyang', 26000, 3, "Mashhur Samyang Buldak — olovli tovuq ta'mi, juda achchiq."),
  R('불닭볶음면', 'Buldak Original', 'Klassik olovli buldak', 'buldak1', 26000, 3),
  R('불닭볶음면 까르보', 'Buldak Carbonara', 'Yumshoq karbonara buldak', 'buldak2', 27000, 2),
  R('불닭볶음면 치즈', 'Buldak Cheese', 'Pishloqli buldak', 'buldak3', 27000, 2),
  R('핵불닭볶음면', 'Hek Buldak 2x', '2 barobar achchiq buldak', 'buldak4', 29000, 3),
  R('불닭볶음면 까르보 컵', 'Buldak Carbonara (stakan)', 'Stakan karbonara buldak', 'buldak5', 30000, 2),
  R('치즈 라면', 'Cheese Ramen', 'Pishloqli ramen', 'cheesy1', 23000, 2),
  R('매운 치즈 라면', 'Spicy Cheese Ramen', 'Achchiq pishloqli ramen', 'cheesy2', 24000, 2),
  R('치즈 라면', 'Cheese Ramen', 'Yumshoq pishloqli ramen', 'cheesy3', 23000, 1),
  R('치즈 라면 컵', 'Cheese Ramen (stakan)', 'Stakan pishloqli ramen', 'cheesy4', 24000, 1),
  R('진라면 순한맛', 'Jin Ramen Mild', 'Yumshoq Jin ramen', 'djin1', 18000, 1),
  R('진라면 매운맛', 'Jin Ramen Spicy', 'Achchiq Jin ramen', 'djin2', 18000, 2),
  R('짜파게티', 'Chapagetti', 'Klassik qora loviya noodle', 'chapagetti', 18000, 0, "Klassik koreys jjajang noodle'i — uyda tez tayyorlanadi."),
  R('짜짜로니', 'Chacharoni', 'Yumshoq jjajang noodle', 'chacharoni', 18000, 0),
  R('짜장면', 'Jjajangmyeon', 'Qora loviya sousli noodle', 'jjajang', 24000, 0, "Koreyaning sevimli qora loviya sousli noodle taomi."),

  // ===== ICHIMLIK =====
  D('알로에', 'Aloe Vera', 'Salqin aloe ichimligi', 'aloe', 15000, "Aloe bo'laklari bilan salqin ichimlik — chanqoqni bosadi."),
  D('블루베리', 'Lead Blueberry', "Ko'k mevali ichimlik", 'blueberry', 15000),
  D('밀키스', 'Milkis Soda', 'Sutli gazli ichimlik', 'milkis', 13000, "Sutli-gazli noyob koreys ichimligi Milkis."),
  D('웰치스', "Welch's", 'Uzum mevali gazak', 'welchs', 14000),
  D('과일 주스', 'Fruit Juice', 'Mevali (nok) ichimlik', 'fruit-drink', 12000),

  // ===== SNACK =====
  S('스낵 모음', 'Korean Snacks', 'Sevimli koreys snekleri', 'snacks', 12000, 0),
  S('나쵸', 'Nacho Chips', 'Achchiq nacho chiplari', 'chips', 16000, 1),
  S('나쵸 사워크림', 'Nacho Sour Cream', 'Sour cream nacho chiplari', 'nacho-sourcream', 16000, 0),
  S('나쵸', 'Nacho Chips', 'Xrustki nacho chiplari', 'nacho-open', 16000, 1),
  S('새우깡', 'Saewookkang', "Krevetka ta'mli kraker", 'saewookkang', 14000, 1),
  S('꼬깔콘 군옥수수', 'Kkokkalcorn Grilled', "Qovurilgan makkajo'xori konus", 'kkokkalcorn-grill', 15000, 0),
  S('오잉', 'Oing Squid Snack', "Kalmar ta'mli snek", 'oing-squid', 15000, 0),
  S('꼬깔콘 매콤달콤', 'Kkokkalcorn Sweet & Spicy', 'Achchiq-shirin konus snek', 'kkokkalcorn-spicy', 15000, 1),
  S('꼬깔콘 오리지널', 'Kkokkalcorn Original', "Klassik makkajo'xori konus", 'kkokkalcorn-original', 15000, 0),
  S('비비고 김스낵', 'bibigo Seaweed Chips', 'Original seaweed chiplari', 'bibigo-seaweed-original', 18000, 0),
  S('비비고 김스낵', 'bibigo Sweet Corn Seaweed', "Shirin makkajo'xorili seaweed", 'bibigo-seaweed-corn', 18000, 0),
  S('올리브유 김', 'Olive Seaweed', 'Zaytun moyli quritilgan seaweed', 'olive-seaweed1', 12000, 0),
  S('올리브유 김', 'Olive Seaweed (mini)', 'Zaytun moyli seaweed (mini)', 'olive-seaweed2', 12000, 0),
  S('코코마 김', 'Kokoma Seaweed', 'Bolalar uchun seaweed snek', 'kokoma-seaweed1', 11000, 0),
  S('코코마 김', 'Kokoma Seaweed', 'Kokoma quritilgan seaweed', 'kokoma-seaweed2', 11000, 0),
  S('비비고 김스낵', 'bibigo Crispy Seaweed', 'Xrustki seaweed snek', 'bibigo-crispy-seaweed', 18000, 0),
  S('비비고 조미김', 'bibigo Seasoned Seaweed', 'Ziravorli quritilgan seaweed', 'bibigo-seasoned-seaweed', 17000, 0),
  S('비비고 와사비 김스낵', 'bibigo Wasabi Seaweed', "Wasabi ta'mli seaweed chips", 'bibigo-wasabi-seaweed', 19000, 1),
  S('게맛살', 'Crab Stick', "Krab ta'mli pastki (salat uchun)", 'crab-stick', 20000, 0),
  S('고기 꼬치', 'Meat Skewer', "Go'shtli kabob snek", 'meat-skewer', 13000, 1),
  S('맛살', 'Fish & Crab Stick', 'Baliq-krab pastki', 'shark-stick', 18000, 0),
  S('어포', 'Dried Fish Snack', 'Quritilgan baliq snek', 'dried-fish', 22000, 0),
  S('칸쵸', 'Kancho Choco Biscuit', "Shokolad to'ldirilgan pechenye", 'kancho', 16000, 0),
  S('빠다코코낫', 'Lotte Butter Cracker', "Sariyog'li kokos krakeri", 'lotte-cracker', 15000, 0),
  S('마가렛트', 'Margaret Cookies', "Yumshoq sariyog'li pechenye", 'margaret-cookies', 17000, 0),
  S('요구르트 젤리', 'Yogurt Jelly Peach', 'Shaftoli yogurt jeli', 'yogurt-jelly', 10000, 0),
  S('비비고 떡볶이', 'bibigo Tteokbokki', 'Achchiq guruch kek (tteokbokki)', 'bibigo1', 30000, 2),
  S('비비고 떡볶이 컵', 'bibigo Tteokbokki (stakan)', 'Stakan tteokbokki', 'bibigo2', 32000, 2),
  S('비비고 로제 떡볶이', 'bibigo Rose Tteokbokki', 'Rose sousli tteokbokki', 'bibigo3', 33000, 1),
  S('비비고 떡볶이', 'bibigo Tteokbokki (oilaviy)', "Oilaviy tteokbokki to'plami", 'bibigo4', 35000, 2),
  S('요뽀끼', 'Yopokki Sweet & Spicy', 'Achchiq-shirin topokki stakan', 'yopokki1', 28000, 2),
  S('요뽀끼 치즈', 'Yopokki Cheese', 'Pishloqli topokki stakan', 'yopokki2', 29000, 1),
  S('김치', 'Kimchi', 'An\'anaviy koreys kimchisi', 'kimchi-side1', 35000, 2),
  S('김치', 'Kimchi', 'Yangi tayyorlangan kimchi', 'kimchi-side2', 35000, 2),
  S('즉석밥 백미', 'Instant White Rice', 'Tez tayyor oq guruch', 'Rice1', 16000, 0),
  S('즉석밥', 'Instant Rice', 'Mikroto\'lqinli tez guruch', 'Rice2', 16000, 0),
  S('즉석밥', 'Instant Rice', 'Tez tayyor guruch kosasi', 'Rice3', 16000, 0),
].map((p, i) => ({ ...p, sort: i }))

const gallery = ['ig1', 'ig2', 'ig3', 'ig4', 'ig5', 'ig6', 'ig7', 'ig8'].map((img, i) => ({ img, caption: '', sort: i }))

const settings = {
  brand_name: 'HiMart',
  tagline: "Shinam kafe-do'kon · Рамен · Корейские снеки и напитки",
  address: "Abdulla Qodiriy ko'chasi 21, Toshkent, O'zbekiston 100128",
  hours_weekday: '10:00 – 22:00',
  hours_weekend: '11:00 – 23:00',
  instagram: 'https://instagram.com/himart.uz',
  instagram_handle: '@himart.uz',
  phone: '+998 90 123 45 67',
  telegram: 'https://t.me/himart',
  website: 'https://himart.uz',
  map_embed: 'https://yandex.com/map-widget/v1/?ll=69.24815438801856%2C41.32732108170748&z=17&pt=69.24815438801856%2C41.32732108170748%2Cpm2rdm',
  map_directions: 'https://yandex.com/maps/?rtext=~41.32732108170748%2C69.24815438801856&rtt=auto&z=17',
}

console.log('Seeding database...')
db.reset({
  products: products.map((p, i) => ({ id: i + 1, ...p })),
  gallery: gallery.map((g, i) => ({ id: i + 1, ...g })),
  settings,
  _seq: { products: products.length, gallery: gallery.length },
})
console.log(`Done — ${products.length} products, ${gallery.length} gallery images, ${Object.keys(settings).length} settings.`)
