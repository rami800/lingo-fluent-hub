import { Language, Level, Scenario, ScenarioTranslation, Lesson, LessonItem, LessonItemTranslation, LessonTranslation } from '@/types';

export const languages: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', direction: 'ltr', flag: '🇬🇧' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', direction: 'rtl', flag: '🇸🇦' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', direction: 'ltr', flag: '🇹🇷' },
  { code: 'uk', name: 'Ukrainian', nativeName: 'Українська', direction: 'ltr', flag: '🇺🇦' },
];

export const levels: Level[] = [
  { id: 'A1', name: 'A1', description: 'Beginner', color: 'level-a1', icon: '🌱', totalLessons: 20 },
  { id: 'A2', name: 'A2', description: 'Elementary', color: 'level-a2', icon: '🌿', totalLessons: 25 },
  { id: 'B1', name: 'B1', description: 'Intermediate', color: 'level-b1', icon: '🌳', totalLessons: 30 },
];

export const scenarios: Scenario[] = [
  { id: 'introduction', levelId: 'A1', icon: '👋', order: 1, totalLessons: 3 },
  { id: 'transport', levelId: 'A1', icon: '🚇', order: 2, totalLessons: 4 },
  { id: 'shopping', levelId: 'A1', icon: '🛒', order: 3, totalLessons: 3 },
  { id: 'restaurant', levelId: 'A1', icon: '🍽️', order: 4, totalLessons: 4 },
  { id: 'directions', levelId: 'A2', icon: '🗺️', order: 1, totalLessons: 3 },
  { id: 'doctor', levelId: 'A2', icon: '🏥', order: 2, totalLessons: 4 },
  { id: 'bank', levelId: 'A2', icon: '🏦', order: 3, totalLessons: 3 },
  { id: 'housing', levelId: 'B1', icon: '🏠', order: 1, totalLessons: 5 },
  { id: 'work', levelId: 'B1', icon: '💼', order: 2, totalLessons: 5 },
  { id: 'emergency', levelId: 'B1', icon: '🚨', order: 3, totalLessons: 4 },
];

export const scenarioTranslations: ScenarioTranslation[] = [
  // English
  { scenarioId: 'introduction', languageCode: 'en', name: 'Introducing Yourself', description: 'Learn to greet and introduce yourself in German' },
  { scenarioId: 'transport', languageCode: 'en', name: 'Public Transport', description: 'Navigate trains, buses, and taxis with confidence' },
  { scenarioId: 'shopping', languageCode: 'en', name: 'Shopping', description: 'Buy groceries and everyday items' },
  { scenarioId: 'restaurant', languageCode: 'en', name: 'At the Restaurant', description: 'Order food and drinks like a local' },
  { scenarioId: 'directions', languageCode: 'en', name: 'Asking for Directions', description: 'Find your way around the city' },
  { scenarioId: 'doctor', languageCode: 'en', name: 'At the Doctor', description: 'Describe symptoms and understand medical advice' },
  { scenarioId: 'bank', languageCode: 'en', name: 'At the Bank', description: 'Open accounts and handle financial matters' },
  { scenarioId: 'housing', languageCode: 'en', name: 'Finding Housing', description: 'Search for apartments and communicate with landlords' },
  { scenarioId: 'work', languageCode: 'en', name: 'At Work', description: 'Professional communication in German workplaces' },
  { scenarioId: 'emergency', languageCode: 'en', name: 'Emergencies', description: 'Handle urgent situations and get help' },
  // Arabic
  { scenarioId: 'introduction', languageCode: 'ar', name: 'تقديم نفسك', description: 'تعلم التحية وتقديم نفسك بالألمانية' },
  { scenarioId: 'transport', languageCode: 'ar', name: 'وسائل النقل العام', description: 'استخدام القطارات والحافلات وسيارات الأجرة بثقة' },
  { scenarioId: 'shopping', languageCode: 'ar', name: 'التسوق', description: 'شراء البقالة والمستلزمات اليومية' },
  { scenarioId: 'restaurant', languageCode: 'ar', name: 'في المطعم', description: 'طلب الطعام والمشروبات كالسكان المحليين' },
  { scenarioId: 'directions', languageCode: 'ar', name: 'السؤال عن الاتجاهات', description: 'إيجاد طريقك في المدينة' },
  { scenarioId: 'doctor', languageCode: 'ar', name: 'عند الطبيب', description: 'وصف الأعراض وفهم النصائح الطبية' },
  { scenarioId: 'bank', languageCode: 'ar', name: 'في البنك', description: 'فتح حسابات والتعامل مع الأمور المالية' },
  { scenarioId: 'housing', languageCode: 'ar', name: 'البحث عن سكن', description: 'البحث عن شقق والتواصل مع الملاك' },
  { scenarioId: 'work', languageCode: 'ar', name: 'في العمل', description: 'التواصل المهني في أماكن العمل الألمانية' },
  { scenarioId: 'emergency', languageCode: 'ar', name: 'حالات الطوارئ', description: 'التعامل مع المواقف العاجلة والحصول على المساعدة' },
  // Turkish
  { scenarioId: 'introduction', languageCode: 'tr', name: 'Kendini Tanıtma', description: 'Almanca selamlama ve kendinizi tanıtma' },
  { scenarioId: 'transport', languageCode: 'tr', name: 'Toplu Taşıma', description: 'Tren, otobüs ve taksi kullanımı' },
  { scenarioId: 'shopping', languageCode: 'tr', name: 'Alışveriş', description: 'Market ve günlük alışveriş' },
  { scenarioId: 'restaurant', languageCode: 'tr', name: 'Restoranda', description: 'Yemek ve içecek siparişi' },
  { scenarioId: 'directions', languageCode: 'tr', name: 'Yol Sorma', description: 'Şehirde yolunuzu bulun' },
  { scenarioId: 'doctor', languageCode: 'tr', name: 'Doktorda', description: 'Belirtileri açıklama ve tıbbi tavsiyeleri anlama' },
  { scenarioId: 'bank', languageCode: 'tr', name: 'Bankada', description: 'Hesap açma ve finansal işlemler' },
  { scenarioId: 'housing', languageCode: 'tr', name: 'Ev Arama', description: 'Daire arama ve ev sahipleriyle iletişim' },
  { scenarioId: 'work', languageCode: 'tr', name: 'İş Yerinde', description: 'Alman iş yerlerinde profesyonel iletişim' },
  { scenarioId: 'emergency', languageCode: 'tr', name: 'Acil Durumlar', description: 'Acil durumları yönetme ve yardım alma' },
  // Ukrainian
  { scenarioId: 'introduction', languageCode: 'uk', name: 'Представлення себе', description: 'Навчіться вітатися та представляти себе німецькою' },
  { scenarioId: 'transport', languageCode: 'uk', name: 'Громадський транспорт', description: 'Користуйтеся поїздами, автобусами та таксі впевнено' },
  { scenarioId: 'shopping', languageCode: 'uk', name: 'Покупки', description: 'Купуйте продукти та повсякденні товари' },
  { scenarioId: 'restaurant', languageCode: 'uk', name: 'У ресторані', description: 'Замовляйте їжу та напої як місцевий' },
  { scenarioId: 'directions', languageCode: 'uk', name: 'Запитання дороги', description: 'Знайдіть шлях у місті' },
  { scenarioId: 'doctor', languageCode: 'uk', name: 'У лікаря', description: 'Описуйте симптоми та розумійте медичні поради' },
  { scenarioId: 'bank', languageCode: 'uk', name: 'У банку', description: 'Відкривайте рахунки та вирішуйте фінансові питання' },
  { scenarioId: 'housing', languageCode: 'uk', name: 'Пошук житла', description: 'Шукайте квартири та спілкуйтеся з орендодавцями' },
  { scenarioId: 'work', languageCode: 'uk', name: 'На роботі', description: 'Професійне спілкування на німецьких робочих місцях' },
  { scenarioId: 'emergency', languageCode: 'uk', name: 'Надзвичайні ситуації', description: 'Справляйтеся з терміновими ситуаціями та отримуйте допомогу' },
];

// Sample lessons for the introduction scenario
export const lessons: Lesson[] = [
  { id: 'intro-1', scenarioId: 'introduction', order: 1, totalItems: 5 },
  { id: 'intro-2', scenarioId: 'introduction', order: 2, totalItems: 6 },
  { id: 'intro-3', scenarioId: 'introduction', order: 3, totalItems: 5 },
  { id: 'transport-1', scenarioId: 'transport', order: 1, totalItems: 6 },
];

export const lessonTranslations: LessonTranslation[] = [
  { lessonId: 'intro-1', languageCode: 'en', title: 'Basic Greetings', description: 'Learn how to say hello and goodbye' },
  { lessonId: 'intro-2', languageCode: 'en', title: 'Saying Your Name', description: 'Introduce yourself with confidence' },
  { lessonId: 'intro-3', languageCode: 'en', title: 'Where Are You From?', description: 'Talk about your origin and nationality' },
  { lessonId: 'transport-1', languageCode: 'en', title: 'Buying a Ticket', description: 'Purchase tickets at the station' },
  // Arabic
  { lessonId: 'intro-1', languageCode: 'ar', title: 'التحيات الأساسية', description: 'تعلم كيف تقول مرحباً ووداعاً' },
  { lessonId: 'intro-2', languageCode: 'ar', title: 'قول اسمك', description: 'قدم نفسك بثقة' },
  { lessonId: 'intro-3', languageCode: 'ar', title: 'من أين أنت؟', description: 'تحدث عن أصلك وجنسيتك' },
  { lessonId: 'transport-1', languageCode: 'ar', title: 'شراء تذكرة', description: 'شراء التذاكر في المحطة' },
  // Turkish
  { lessonId: 'intro-1', languageCode: 'tr', title: 'Temel Selamlaşmalar', description: 'Merhaba ve hoşçakal demeyi öğrenin' },
  { lessonId: 'intro-2', languageCode: 'tr', title: 'Adınızı Söyleme', description: 'Kendinizi güvenle tanıtın' },
  { lessonId: 'intro-3', languageCode: 'tr', title: 'Nerelisiniz?', description: 'Kökeniniz ve milliyetiniz hakkında konuşun' },
  { lessonId: 'transport-1', languageCode: 'tr', title: 'Bilet Alma', description: 'İstasyonda bilet satın alın' },
  // Ukrainian
  { lessonId: 'intro-1', languageCode: 'uk', title: 'Основні привітання', description: 'Навчіться говорити привіт і до побачення' },
  { lessonId: 'intro-2', languageCode: 'uk', title: 'Називання імені', description: 'Представте себе впевнено' },
  { lessonId: 'intro-3', languageCode: 'uk', title: 'Звідки ви?', description: 'Розкажіть про своє походження та національність' },
  { lessonId: 'transport-1', languageCode: 'uk', title: 'Купівля квитка', description: 'Придбайте квитки на станції' },
];

export const lessonItems: LessonItem[] = [
  { id: 'item-1', lessonId: 'intro-1', order: 1, germanText: 'Guten Tag!', type: 'phrase' },
  { id: 'item-2', lessonId: 'intro-1', order: 2, germanText: 'Hallo!', type: 'phrase' },
  { id: 'item-3', lessonId: 'intro-1', order: 3, germanText: 'Guten Morgen!', type: 'phrase' },
  { id: 'item-4', lessonId: 'intro-1', order: 4, germanText: 'Guten Abend!', type: 'phrase' },
  { id: 'item-5', lessonId: 'intro-1', order: 5, germanText: 'Auf Wiedersehen!', type: 'phrase' },
  { id: 'item-6', lessonId: 'intro-2', order: 1, germanText: 'Ich heiße...', type: 'phrase' },
  { id: 'item-7', lessonId: 'intro-2', order: 2, germanText: 'Mein Name ist...', type: 'phrase' },
  { id: 'item-8', lessonId: 'intro-2', order: 3, germanText: 'Wie heißen Sie?', type: 'sentence' },
  { id: 'item-9', lessonId: 'intro-2', order: 4, germanText: 'Freut mich!', type: 'phrase' },
  { id: 'item-10', lessonId: 'intro-2', order: 5, germanText: 'Sehr angenehm!', type: 'phrase' },
  { id: 'item-11', lessonId: 'intro-2', order: 6, germanText: 'Wie geht es Ihnen?', type: 'sentence' },
];

export const lessonItemTranslations: LessonItemTranslation[] = [
  // English
  { itemId: 'item-1', languageCode: 'en', translation: 'Good day!', explanation: 'A formal greeting used throughout the day' },
  { itemId: 'item-2', languageCode: 'en', translation: 'Hello!', explanation: 'An informal greeting for any time' },
  { itemId: 'item-3', languageCode: 'en', translation: 'Good morning!', explanation: 'Used until around noon' },
  { itemId: 'item-4', languageCode: 'en', translation: 'Good evening!', explanation: 'Used from late afternoon onwards' },
  { itemId: 'item-5', languageCode: 'en', translation: 'Goodbye!', explanation: 'A formal way to say goodbye' },
  { itemId: 'item-6', languageCode: 'en', translation: 'My name is...', explanation: 'Informal way to introduce yourself' },
  { itemId: 'item-7', languageCode: 'en', translation: 'My name is...', explanation: 'More formal way to state your name' },
  { itemId: 'item-8', languageCode: 'en', translation: 'What is your name?', explanation: 'Formal way to ask someone\'s name' },
  { itemId: 'item-9', languageCode: 'en', translation: 'Nice to meet you!', explanation: 'Said when meeting someone for the first time' },
  { itemId: 'item-10', languageCode: 'en', translation: 'Very pleased!', explanation: 'A more formal expression of pleasure at meeting' },
  { itemId: 'item-11', languageCode: 'en', translation: 'How are you?', explanation: 'Formal way to ask how someone is doing' },
  // Arabic
  { itemId: 'item-1', languageCode: 'ar', translation: 'يوم سعيد!', explanation: 'تحية رسمية تستخدم طوال اليوم' },
  { itemId: 'item-2', languageCode: 'ar', translation: 'مرحباً!', explanation: 'تحية غير رسمية لأي وقت' },
  { itemId: 'item-3', languageCode: 'ar', translation: 'صباح الخير!', explanation: 'تستخدم حتى وقت الظهيرة تقريباً' },
  { itemId: 'item-4', languageCode: 'ar', translation: 'مساء الخير!', explanation: 'تستخدم من بعد الظهر وما بعده' },
  { itemId: 'item-5', languageCode: 'ar', translation: 'مع السلامة!', explanation: 'طريقة رسمية لقول وداعاً' },
  { itemId: 'item-6', languageCode: 'ar', translation: 'اسمي...', explanation: 'طريقة غير رسمية لتقديم نفسك' },
  { itemId: 'item-7', languageCode: 'ar', translation: 'اسمي هو...', explanation: 'طريقة أكثر رسمية لذكر اسمك' },
  { itemId: 'item-8', languageCode: 'ar', translation: 'ما اسمك؟', explanation: 'طريقة رسمية لسؤال شخص عن اسمه' },
  { itemId: 'item-9', languageCode: 'ar', translation: 'سررت بلقائك!', explanation: 'تقال عند مقابلة شخص لأول مرة' },
  { itemId: 'item-10', languageCode: 'ar', translation: 'سعيد جداً!', explanation: 'تعبير أكثر رسمية عن السرور باللقاء' },
  { itemId: 'item-11', languageCode: 'ar', translation: 'كيف حالك؟', explanation: 'طريقة رسمية للسؤال عن حال شخص' },
  // Turkish
  { itemId: 'item-1', languageCode: 'tr', translation: 'İyi günler!', explanation: 'Gün boyunca kullanılan resmi bir selamlama' },
  { itemId: 'item-2', languageCode: 'tr', translation: 'Merhaba!', explanation: 'Her zaman için gayri resmi selamlama' },
  { itemId: 'item-3', languageCode: 'tr', translation: 'Günaydın!', explanation: 'Öğlene kadar kullanılır' },
  { itemId: 'item-4', languageCode: 'tr', translation: 'İyi akşamlar!', explanation: 'Öğleden sonra geç saatlerden itibaren kullanılır' },
  { itemId: 'item-5', languageCode: 'tr', translation: 'Hoşça kalın!', explanation: 'Resmi veda şekli' },
  { itemId: 'item-6', languageCode: 'tr', translation: 'Benim adım...', explanation: 'Kendinizi tanıtmanın gayri resmi yolu' },
  { itemId: 'item-7', languageCode: 'tr', translation: 'Adım...', explanation: 'Adınızı söylemenin daha resmi yolu' },
  { itemId: 'item-8', languageCode: 'tr', translation: 'Adınız nedir?', explanation: 'Birinin adını sormanın resmi yolu' },
  { itemId: 'item-9', languageCode: 'tr', translation: 'Tanıştığıma memnun oldum!', explanation: 'Biriyle ilk kez tanışırken söylenir' },
  { itemId: 'item-10', languageCode: 'tr', translation: 'Çok memnun oldum!', explanation: 'Tanışmaktan duyulan memnuniyetin daha resmi ifadesi' },
  { itemId: 'item-11', languageCode: 'tr', translation: 'Nasılsınız?', explanation: 'Birinin nasıl olduğunu sormanın resmi yolu' },
  // Ukrainian
  { itemId: 'item-1', languageCode: 'uk', translation: 'Добрий день!', explanation: 'Формальне привітання, що використовується протягом дня' },
  { itemId: 'item-2', languageCode: 'uk', translation: 'Привіт!', explanation: 'Неформальне привітання на будь-який час' },
  { itemId: 'item-3', languageCode: 'uk', translation: 'Доброго ранку!', explanation: 'Використовується приблизно до полудня' },
  { itemId: 'item-4', languageCode: 'uk', translation: 'Добрий вечір!', explanation: 'Використовується з пізнього полудня' },
  { itemId: 'item-5', languageCode: 'uk', translation: 'До побачення!', explanation: 'Формальний спосіб попрощатися' },
  { itemId: 'item-6', languageCode: 'uk', translation: 'Мене звати...', explanation: 'Неформальний спосіб представитися' },
  { itemId: 'item-7', languageCode: 'uk', translation: 'Моє ім\'я...', explanation: 'Більш формальний спосіб назвати своє ім\'я' },
  { itemId: 'item-8', languageCode: 'uk', translation: 'Як вас звати?', explanation: 'Формальний спосіб запитати чиєсь ім\'я' },
  { itemId: 'item-9', languageCode: 'uk', translation: 'Приємно познайомитись!', explanation: 'Говориться при першій зустрічі з кимось' },
  { itemId: 'item-10', languageCode: 'uk', translation: 'Дуже приємно!', explanation: 'Більш формальний вираз задоволення від знайомства' },
  { itemId: 'item-11', languageCode: 'uk', translation: 'Як у вас справи?', explanation: 'Формальний спосіб запитати як справи' },
];
