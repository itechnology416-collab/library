import {
  AdvisoryMessage,
  Book,
  Certificate,
  Course,
  CourseMaterial,
  QuizAttempt,
  ResourceItem,
  ServiceRequest,
  StudentScholarProfile,
} from '../types';

export const OFFICIAL_BRAND = {
  name: 'Wirtuu Kompiitaraa Ilillii',
  fullName: 'Wirtuu Kompiitaraa Ilillii Publishing Services',
  tagline: 'Your Ideas. Our Skills. Professional Results.',
  founder: 'Mr. Feysal Hussein',
  affiliation: 'Haramaya University',
  phone1: '+251 927 650 724',
  phone2: '+251 961 189 074',
  telegramHandle: '@FEYSAL_8',
  telegramUrl: 'https://t.me/FEYSAL_8',
  logoUrl:
    'https://lh3.googleusercontent.com/aida/AEtjO1Ucu5cuSnCrgWLKQFj4WuwTZI4pG6apOAcjopaO-H1R0Cz6APmipO-CzHzI-dGZ2CSdjhqtyH0xNt8sSJ83bpm8BUFizrgLRPBuDGmoqfkZRIyUiVg9JnWNV0T38oEHYqRVLbVEV-H4dHnCs9J4MW4oSNE-IpM42ZFbIiXxyNMD1bPM3yUJJyXV_qjzjuDFuoOzqgPX3V_vgTdydlcaAOEy5G3jYaYnyTKhg3xHgCg',
};

export const INITIAL_BOOKS: Book[] = [
  {
    id: 'eng-phrasal-verbs',
    title: 'Mastering English Phrasal Verbs & Idioms',
    titleLocalized: {
      en: 'Mastering English Phrasal Verbs & Idioms',
      or: 'Ogummaa Jechoota Ingiliffaa fi Mammaaksota Qorannoo',
      am: 'የእንግሊዝኛ ፈሊጦች እና የንግግር ዘይቤዎች ጥናት',
      ar: 'إتقان الأفعال المركبة والمصطلحات في اللغة الإنجليزية',
    },
    category: 'Linguistics Monograph',
    categoryLabel: {
      en: 'Linguistics Monograph',
      or: 'Qorannoo Afaanii',
      am: 'የቋንቋ ጥናት',
      ar: 'دراسات لغوية',
    },
    author: 'Mr. Feysal Hussein & Academic Associates',
    affiliation: 'Haramaya University Press Collaboration',
    coverUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDdsvpKMEfjIl--dLsmJDQP4wpyjc2M3ZysuRIPkUygRxOV1dudnHnHp40bYxzab_yhEIS3JgvtmfYEB30fPwwxWobRSMPyDe2Ni_GTb5ff-W318Dw_81V5CVFGTawbwlfSxA4l88FTMC7NAXddmsq4XTrn-Wrs7NdmJ4-DORigoJIXbZ2JtRygH_HbuCKB5A0jxLqf2FPeaZ6bO2hFWqyEeqTd6uRdnFhkm46Ev2c',
    language: 'en',
    langTag: 'ENG',
    description:
      'Curated academic reference with 1,200+ contextual sentences, exam-focused drills, doctoral discourse markers, and conversational usage rules.',
    descriptionLocalized: {
      en: 'Curated reference with 1,200+ contextual sentences, exam-focused drills, and conversational usage rules.',
      or: 'Qajeelfama qorannoo himoota 1,200 ol of keessaa qabu, shaakala qormaataa fi seerota haasaa qulqulluu.',
      am: 'ከ1,200 በላይ ምሳሌያዊ ዓረፍተ ነገሮችን እና የፈተና ልምምዶችን የያዘ አጠቃላይ የማጣቀሻ መጽሐፍ።',
      ar: 'مرجع أكاديمي محكم يضم أكثر من 1200 جملة سياقية، وتدريبات تطبيقية لطلاب الدراسات العليا.',
    },
    pages: 184,
    publishedYear: '2024',
    downloadAllowed: true,
    chapters: [
      {
        id: 1,
        title: 'Chapter 1: The Anatomy of Academic Phrasal Verbs',
        content: `A phrasal verb combines a base verb with one or more particles (prepositions or adverbs), yielding a distinct semantic meaning that cannot be directly deduced from its individual constituents.

In academic and scientific discourse, precision is paramount. While colloquial communication frequently favors phrasal verbs, academic publications utilize specialized combinations:

• Bring about: To cause something to happen (e.g., "The innovative agricultural methodology brought about a 40% increase in crop yield at the Haramaya experimental station").
• Carry out: To execute or conduct a study (e.g., "The research team carried out a longitudinal randomized trial across five regional woredas").
• Account for: To explain the rationale or comprise a portion (e.g., "Climatic shifts account for nearly 65% of the variance observed in seasonal harvests").
• Set forth: To articulate principles or hypotheses formally.

Rule of Inseparability:
Transitive phrasal verbs with multiple particles (such as 'come up with', 'look forward to', 'put up with') are strictly inseparable. You cannot place the object between the verb and the particles:
- Correct: "The researchers came up with an alternative hypothesis."
- Incorrect: "The researchers came an alternative hypothesis up with."`,
      },
      {
        id: 2,
        title: 'Chapter 2: Essential Idiomatic Expressions in Academic Debates',
        content: `Scholarly debates require nuance, tempered rhetoric, and clear argumentative transitions. Key academic idioms include:

1. 'At the cutting edge': Operating at the most advanced stage of a scientific discipline.
2. 'To shed light on': To clarify previously opaque phenomena or empirical anomalies.
3. 'A double-edged sword': An intervention or technology that confers notable benefits while carrying non-trivial risks.
4. 'To bridge the gap': Connecting theoretical frameworks with field applications.

Example in Thesis Defense:
"While synthetic nitrogen fertilizers have bridged the gap in immediate food security, their prolonged runoff represents a double-edged sword for regional aquatic ecosystems."`,
      },
      {
        id: 3,
        title: 'Chapter 3: Exercises & Practical Sentence Transformations',
        content: `Exercise 1: Replace the formal verb in brackets with an appropriate academic phrasal verb:
1. The committee decided to [postpone] the departmental symposium. -> 'put off'
2. We must [investigate] the discrepancies in the statistical dataset. -> 'look into'
3. The university aims to [establish] a center for computational publishing. -> 'set up'

Self-Assessment Answer Key:
1. put off | 2. look into | 3. set up`,
      },
    ],
  },
  {
    id: 'or-seenaa-aadaa',
    title: 'Qajeelfama Seenaa fi Aadaa Oromoo',
    titleLocalized: {
      en: 'Guide to Oromo History, Culture & Customary Wisdom',
      or: 'Qajeelfama Seenaa fi Aadaa Oromoo',
      am: 'የኦሮሞ ታሪክ እና ባሕል አጠቃላይ መመሪያ',
      ar: 'دليل تاريخ وثقافة الأورومو والتقاليد الأصيلة',
    },
    category: 'Aadaa fi Seenaa',
    categoryLabel: {
      en: 'Oromo Culture & Heritage',
      or: 'Aadaa fi Seenaa',
      am: 'ባህልና ታሪክ',
      ar: 'التراث والتاريخ',
    },
    author: 'Obbo Feysal Huseen',
    affiliation: 'Yuunivarsitii Haramayaa',
    coverUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDOEE5UsafxLJ06x5gSBARBN0VlzL6ojl6kp8PGKfcQbpV0OByv7_UYg31P8ZcyPchT3Iz5XJ-9y6gSmnwInxHWcmw-8C4HdCrA4hNNRc8oZ5zJ5YIOI7M_qdSrAkssjL-APsC_f3uTDJrS14ZQg7NXpsH15XvkIaMztWksX8k7o5ITUCwhb-tB5VaVmpiMmmaFreY_hA9EFpcKaXIkMemNnP12mh8EGsz1ay99s3E',
    language: 'or',
    langTag: 'OR',
    description:
      'Qorannoo aadaa, safuu, seenaa goototaa fi qooda Oromummaa damee barnoota olaanoo keessatti. Sirna Gadaa fi duudhaalee ganamaa.',
    descriptionLocalized: {
      en: 'Explores Oromo customary ethics, Safuu, Sirna Gadaa, proverbs, and historical leadership models for university curricula.',
      or: 'Qorannoo aadaa, safuu, seenaa goototaa fi qooda Oromummaa damee barnoota olaanoo keessatti.',
      am: 'የገዳ ሥርዓትን፣ የኦሮሞ ማኅበራዊ ሥነ-ምግባር (ሰፉ) እና ታሪካዊ ቅርሶችን የሚያትት መጽሐፍ።',
      ar: 'دراسة محكمة في نظام الجدا، والأخلاقيات العرفية، والأمثال الشعبية والتاريخ الأورومي الأصيل.',
    },
    pages: 216,
    publishedYear: '2023',
    downloadAllowed: true,
    chapters: [
      {
        id: 1,
        title: 'Boqonnaa 1: Sirna Gadaa fi Heera Dimokraasii Ganamaa',
        content: `Sirni Gadaa sirna dimokiraatawaa, siyaasaa, dinagdee fi hawaasummaa uummata Oromooti. Sirni kun jaarraa dheeraaf nagaa, qajeelummaa fi walqixxummaa mirkaneessaa tureera.

Gadaan waggoota saddeet saddeetiin bakka bu’iinsa hogganummaa kan gaggeessu yoo ta’u, sadarkaalee Gadaa shanan ijoo kanneen akka:
1. Dabballee (waggaa 0 - 8): Yeroo daa’imman kunuunsa maatii fi hawaasaa argatan.
2. Foollee (waggaa 8 - 16): Yeroo leenjii gootummaa fi naannoo ofii baruu.
3. Qondaala (waggaa 16 - 24): Yeroo seera fi aadaa itti baratamu.
4. Kuusa (waggaa 24 - 32): Yeroo itti gaafatamummaa waraanaa fi qorannoo seeraa.
5. Raaba Doorii (waggaa 32 - 40): Yeroo qophii hoggansa olaanaaf qophaa’an.
6. Gadaa (waggaa 40 - 48): Sadarkaa Abbaan Gadaa biyya itti bulchu.

Gadaan UNESCO irratti Dhaabbata Dhaala Aadaa Addunyaa ta’ee galmaa’eera.`,
      },
      {
        id: 2,
        title: 'Boqonnaa 2: Safuu fi Duudhaa Hawaasummaa',
        content: `Safuun bu’uura amala fi jireenya uummata Oromootti. Safuu jechuun daangaa Uumaa fi Uumama gidduu jiru eeguudha.
Namaa fi nama gidduu, namaa fi bineensota gidduu, akkasumas namaa fi qabeenya uumamaa (mukkeen, laggeen, bishaan) gidduutti safuun ni kabajama.

Mammaaksota Oromoo Aadaa fi Ogummaa:
• "Bara baraan dhufe, namni mana isaatti hafa."
• "Kan qotuuf kan sooru Waaqa."
• "Dhugaan yoo dhabamte malee hin baddu."`,
      },
    ],
  },
  {
    id: 'am-writing-skills',
    title: 'መሰረታዊ የጽሑፍ እና የንግግር ክህሎት',
    titleLocalized: {
      en: 'Foundations of Academic Writing & Public Discourse in Amharic',
      or: 'Bu’uuraalee Barreeffama fi Haasaa Afaan Amaaraa',
      am: 'መሰረታዊ የጽሑፍ እና የንግግር ክህሎት',
      ar: 'أصول الكتابة الأكاديمية ومهارات الإلقاء باللغة الأمهرية',
    },
    category: 'የቋንቋ ጥናት',
    categoryLabel: {
      en: 'Language & Academic Composition',
      or: 'Qorannoo Afaanii',
      am: 'የቋንቋ ጥናት',
      ar: 'دراسات اللغة والإنشاء',
    },
    author: 'አቶ ፈይሰል ሁሴን እና የቋንቋ ምሁራን',
    affiliation: 'Haramaya University Educational Department',
    coverUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBY_gWhYtPMDZHQYvE7hZ6WRODzF-lAdWF_oqxzY7SgBIyQZc1pSJJFYud39UqiXHImAMPCBI5rrj_VAqiJDLhzJN94NYA9QfMrmAKI52d4eBO85IQq621CkdONeM2_WV0BW7q2oDKKpOIOwE5SaptBPc3lLnI8Ul3DFguDSSw8RwTJVk2vZliz1-QHZy0e0KP-DxZI7af-D2O4-84jREWUJ6x9ee5ezDMrjcKPYK0',
    language: 'am',
    langTag: 'አማ',
    description:
      'ለከፍተኛ ትምህርት ተማሪዎች የተዘጋጀ የፅሁፍ ማሻሻያ እና የንግግር ስልጠና መመሪያ መጽሐፍ። የጥናት ጽሑፍ፣ የትንታኔ መጣጥፍና የሰዋሰው ትክክለኛነት።',
    descriptionLocalized: {
      en: 'University textbook on Amharic rhetoric, scholarly monographs, research abstract composition, and formal speech presentation.',
      or: 'Kitaaba barumsaa sadarkaa olaanaa barreeffama saayinsawaa fi qophii haasaa Afaan Amaaraa barsiisu.',
      am: 'ለከፍተኛ ትምህርት ተማሪዎች የተዘጋጀ የፅሁፍ ማሻሻያ እና የንግግር ስልጠና መመሪያ መጽሐፍ።',
      ar: 'دليل شامل لطلبة الجامعات حول مهارات الصياغة الأكاديمية بالأمهرية وإعداد البحوث العلمية والخطابة.',
    },
    pages: 198,
    publishedYear: '2024',
    downloadAllowed: true,
    chapters: [
      {
        id: 1,
        title: 'ምዕራፍ 1፡ የጥናት ጽሑፍ መዋቅርና የአንቀጽ አደረጃጀት',
        content: `የአካዳሚክ ጽሑፍ ዋና ዓላማ እውቀትን በግልጽ፣ በተጨባጭ ማስረጃ እና በሳይንሳዊ አመክንዮ ማስተላለፍ ነው። በከፍተኛ ትምህርት ተቋማት የሚዘጋጁ የምርምር ሥራዎች፣ የዲግሪ ማሟያ ጽሑፎችና ሞኖግራፎች ደረጃቸውን የጠበቀ የአጻጻፍ ስልት ይጠይቃሉ።

የአንቀጽ መዋቅር ዋና ዋና ክፍሎች፡
1. መሪ ዓረፍተ ነገር (Topic Sentence)፡ የአንቀጹን ዋና ሃሳብ የሚያስተዋውቅ ክፍል ነው።
2. አብራሪ ዝርዝሮች (Supporting Details)፡ ለመሪው ሃሳብ ማብራሪያ፣ ማስረጃ ወይም ምሳሌ የሚሰጡ ናቸው።
3. ማጠቃለያ ዓረፍተ ነገር (Concluding Sentence)፡ ሃሳቡን ጠቅልሎ ወደሚቀጥለው ርዕሰ ጉዳይ የሚያሸጋግር ነው።

በአማርኛ የጽሑፍ ዝግጅት ወቅት የስርዓተ ነጥቦች አጠቃቀም (ሁለት ነጥብ፣ አራት ነጥብ፣ ድርብ ሰረዝ) ትክክለኛነት ለጽሑፉ ጥራት ወሳኝ ነው።`,
      },
      {
        id: 2,
        title: 'ምዕራፍ 2፡ የንግግር ክህሎት እና የጥናት ጽሑፍ አቀራረብ (Defense)',
        content: `የምርምር ሥራን በተመልካች እና በፈታኝ ኮሚቴ ፊት ማቅረብ ከፍተኛ ዝግጅት የሚሻ ተግባር ነው።

ዋና ዋና መርሆች፡
• የጊዜ አጠቃቀምን መቆጣጠር
• የስላይድ ይዘትን በቁልፍ ቃላት ብቻ መወሰን (ሙሉ አንቀጽ አለመጫን)
• ጥያቄዎችን በትዕግሥት ማዳመጥ እና በማስረጃ መመለስ
• የሰውነት ቋንቋ (Body Language) እና የድምጽ ጥራት ተገቢውን ሚዛን እንዲጠብቅ ማድረግ።`,
      },
    ],
  },
  {
    id: 'ar-tajweed-rules',
    title: 'قواعد التجويد الميسرة والترتيل',
    titleLocalized: {
      en: 'Simplified Rules of Tajweed & Quranic Phonetics',
      or: 'Seerota Tajwiidaa Salphifamanii fi Qiraatii',
      am: 'ቀለል ያሉ የተጅዊድ እና የቁርኣን ንባብ ደንቦች',
      ar: 'قواعد التجويد الميسرة والترتيل',
    },
    category: 'علوم القرآن واللغة',
    categoryLabel: {
      en: 'Quranic Sciences & Arabic',
      or: 'Saayinsii Quraanaa fi Arabaa',
      am: 'የቁርኣን እና የዓረብኛ ጥናት',
      ar: 'علوم القرآن واللغة',
    },
    author: 'أ. فيصل حسين ونخبة من معلمي القراءات',
    affiliation: 'مركز ويرتو للنشر والتعليم الأكاديمي',
    coverUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBztgz-cQxJR0DL--gPVh-3slOXPOylPhTmiNAtjdf1Ve26aD1ch5209wDIMQYuMApoCo5SXyQlPWVi4kidyn41T1fMEo43q2Tpi9VEiVNFmK_dW7GZHmlNUfqenU0cIZ06lexdVQNcw1xG3V-CaZuPtcji8wwgJV-BM8AqQw7TfxNg4WnaJWnkpSwRc1-4PEOxJ-aU2_P0msbs5UdR-joeH4KlWK7yYlCpOou-7TQ',
    language: 'ar',
    langTag: 'عربي',
    description:
      'منهج متكامل لضبط مخارج الحروف وأحكام التلاوة مع شروح تطبيقية وجداول توضيحية للمتعلمين والباحثين وطلاب الدراسات الإسلامية.',
    descriptionLocalized: {
      en: 'Integrated pedagogical manual for Arabic phonetics, articulation points (Makharij), and Tajweed rulings for students and scholars.',
      or: 'Qajeelfama seerota qiraatii, makhrajoota qubeewwanii fi tajwiidaa afaan Arabaatiin qophaa’e.',
      am: 'የፊደላት አወጣጥ (መኻሪጅ) እና የተጅዊድ ህጎችን የሚያብራራ የዓረብኛ ቋንቋ የትምህርት መጽሐፍ።',
      ar: 'منهج متكامل لضبط مخارج الحروف وأحكام التلاوة مع شروح تطبيقية وجداول توضيحية للمتعلمين والباحثين.',
    },
    pages: 160,
    publishedYear: '2024',
    downloadAllowed: true,
    chapters: [
      {
        id: 1,
        title: 'الباب الأول: مخارج الحروف العربية وضبط النطق',
        content: `إن علم التجويد من أشرف العلوم لتعلقه بكتاب الله تعالى، وغايته صون اللسان عن الخطأ واللحن في تلاوة القرآن الكريم.

تنقسم مخارج الحروف العامة إلى خمسة مخارج رئيسية:
1. الجوف: وفيه مخرج واحد لحروف المد الثلاثة (الألف الساكنة المفتوح ما قبلها، والواو الساكنة المضموم ما قبلها، والياء الساكنة المكسور ما قبلها).
2. الحلق: وفيه ثلاثة مخارج لستة أحرف (أقصى الحلق: الهمزة والهاء، وسط الحلق: العين والحاء، أدنى الحلق: الغين والخاء).
3. اللسان: وهو أعظم المخارج وفيه عشرة مخارج لثمانية عشر حرفاً.
4. الشفتان: وفيهما مخرجان لأربعة أحرف (الفاء، والباء، والميم، والواو غير المدية).
5. الخيشوم: وفيه مخرج الغنة المركبة في جسم النون والميم.`,
      },
      {
        id: 2,
        title: 'الباب الثاني: أحكام النون الساكنة والتنوين',
        content: `للنون الساكنة والتنوين عند ملاقاة حروف الهجاء أربعة أحكام:

أولاً - الإظهار الحلقي: وحروفه ستة مجموعة في أوائل الكلمات (أخي هاك علماً حازه غير خاسر).
ثانياً - الإدغام: وحروفه ستة مجموعة في لفظ (يرملون)، وينقسم إلى إدغام بغنة (ينمو) وإدغام بغير غنة (اللام والراء).
ثالثاً - الإقلاب: وله حرف واحد وهو الباء مع بقاء الغنة.
رابعاً - الإخفاء الحقيقي: وله خمسة عشر حرفاً جمعها صاحب التحفة في أوائل كلم البيت:
(صف ذا ثنا كم جاد شخص قد سما ... دم طيباً زد في تقى ضع ظالماً).`,
      },
    ],
  },
];

export const INITIAL_COURSES: Course[] = [
  {
    id: 'course-ppt-defense',
    title: 'Academic PowerPoint & Scientific Defense Masterclass',
    instructor: 'Mr. Feysal Hussein',
    language: 'en',
    category: 'Presentation Skills',
    level: 'Masterclass',
    duration: '6 Modules • 18 Video & Slide Guides',
    enrolled: true,
    progress: 65,
    certificateEligible: true,
    image:
      'https://images.unsplash.com/photo-1542744094-3a31727201ec?auto=format&fit=crop&w=800&q=80',
    description:
      'Master the visual and structural secrets of doctoral and master’s thesis defense presentations. Learn 3-second cognitive slide hierarchy, scientific data chart redesign, and presentation defense Q&A tactics.',
    lessons: [
      {
        id: 'ppt-1',
        title: '1. The 3-Second Cognitive Rule for Academic Slides',
        duration: '12 min',
        type: 'video',
        completed: true,
        content: `In a thesis defense or conference presentation, professors and examiners must digest the core insight of every slide within 3 seconds. 
Key rules:
• Avoid walls of prose; convert paragraphs into structured conceptual nodes.
• Bold the operative variable or finding directly in the slide headline.
• Never place raw unformatted Excel tables; extract the key trend or delta.`,
      },
      {
        id: 'ppt-2',
        title: '2. Scientific Chart & Infographic Redesign',
        duration: '18 min',
        type: 'presentation',
        completed: true,
        content: `How to convert complex statistical data into clean, publishable graphs:
• Highlighting the control vs. experimental treatment in contrasting hues.
• Eliminating visual clutter: remove excessive gridlines and 3D effects.
• Direct data labeling rather than detached legends across long distances.`,
      },
      {
        id: 'ppt-3',
        title: '3. Master Slide Typography & Color Contrast Standards',
        duration: '15 min',
        type: 'text',
        completed: false,
        content: `Guidelines for Haramaya University & International Thesis Defense:
• Minimum slide body size: 24pt.
• Title size: 36pt to 44pt with high-contrast neutral backgrounds.
• Ratio of positive visual element to negative breathing room: 60/40.`,
      },
      {
        id: 'ppt-4',
        title: '4. Handling Tough Committee Questions & Slide Jump Navigation',
        duration: '22 min',
        type: 'video',
        completed: false,
        content: `Mastering slide index hyperlinks to jump immediately to backup calculation slides when committee members ask probing methodological questions.`,
      },
    ],
    quiz: [
      {
        question: 'What is the optimal maximum time an examiner should take to grasp the primary finding of a presentation slide?',
        options: ['3 seconds', '30 seconds', '1 minute', 'Whenever the speaker explains it'],
        correctIndex: 0,
        explanation: 'The 3-second rule ensures high visual cognitive fluency during academic examinations.',
      },
      {
        question: 'Which font size is considered the minimum acceptable baseline for slide body copy in a conference auditorium?',
        options: ['12pt', '16pt', '24pt', '48pt'],
        correctIndex: 2,
        explanation: '24pt guarantees readability from the back of the lecture hall or defense room.',
      },
      {
        question: 'What is the recommended practice for displaying statistical results on defense slides?',
        options: [
          'Paste the raw unformatted SPSS or Excel sheet',
          'Extract the core delta with high-contrast trend highlighting and clean labels',
          'Use 3D exploded pie charts',
          'Read every decimal digit aloud',
        ],
        correctIndex: 1,
        explanation: 'Clean trend highlighting prevents cognitive overload and keeps the committee focused on the conclusion.',
      },
    ],
  },
  {
    id: 'course-oromoo-writing',
    title: 'Qajeelfama Barreeffama Saayinsawaa Afaan Oromootiin',
    instructor: 'Obbo Feysal Huseen',
    language: 'or',
    category: 'Writing Skills',
    level: 'Advanced',
    duration: '4 Modules • Qorannoo fi Shaakala',
    enrolled: false,
    progress: 0,
    certificateEligible: true,
    image:
      'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80',
    description:
      'Qophii barreeffama saayinsawaa, qubeessuu sirrii, jechoota teeknikaa fi sirna qorannoo barnoota olaanoo Afaan Oromootiin.',
    lessons: [
      {
        id: 'or-1',
        title: '1. Qubee fi Sagalee Afaan Oromoo Barreeffama Keessatti',
        duration: '15 min',
        type: 'text',
        completed: false,
        content: 'Itti fayyadama hudhaa, qubee dachaa fi dheerina sagaleelee seerlugaa fi saayinsii keessatti.',
      },
      {
        id: 'or-2',
        title: '2. Jechoota Teeknikaa fi Saayinsii Uumuu',
        duration: '20 min',
        type: 'video',
        completed: false,
        content: 'Malawwan jechoota teeknolojii fi saayinsii Afaan Oromootiin galmeessuu fi dhimma itti bahuu.',
      },
    ],
  },
  {
    id: 'course-tajweed-calligraphy',
    title: 'قواعد التجويد والتنضيد الرقمي باللغة العربية',
    instructor: 'أ. فيصل حسين',
    language: 'ar',
    category: 'Arabic Studies',
    level: 'Intermediate',
    duration: '5 وحدات • شروح تفاعلية',
    enrolled: false,
    progress: 0,
    certificateEligible: true,
    image:
      'https://images.unsplash.com/photo-1584286595398-a59f21d313f5?auto=format&fit=crop&w=800&q=80',
    description:
      'إتقان أحكام التجويد العملية، مخارج الحروف، وضبط الخطوط والطباعة العربية الرقمية المتوافقة مع معايير النشر الحديثة.',
    lessons: [
      {
        id: 'ar-1',
        title: '1. مخارج الحروف والصفات اللازمة والعارضة',
        duration: '25 min',
        type: 'video',
        completed: false,
        content: 'شرح عملي لمخارج الحروف مع تدريبات صوتية ونماذج ترتيلية واضحة.',
      },
    ],
  },
];

export const INITIAL_REQUESTS: ServiceRequest[] = [
  {
    id: 'REQ-2024-0891',
    clientName: 'Dr. Getachew Tadesse',
    affiliation: 'Haramaya University • College of Agriculture',
    phone: '+251 911 234 567',
    telegram: '@Dr_Getachew',
    serviceCategory: 'ppt',
    targetLanguage: 'en',
    projectTitle: 'Doctoral Defense: Soil Microbiome Analysis Presentation',
    description:
      'Require scientific slide redesign for 42 defense slides, high-impact data graphics, and master slide typography.',
    estimatedPages: 42,
    expectedDeadline: '2026-09-20',
    status: 'In Progress',
    createdAt: '2026-09-10',
    fileName: 'soil_microbiome_draft_v2.pptx',
    adminNotes:
      'Assigned to Mr. Feysal Hussein. Slide charts completed; currently formatting defense appendix and question-jump triggers.',
    deliverables: [
      {
        id: 'del-1',
        title: 'Thesis_Defense_Deck_Draft_v1.pptx',
        fileType: 'PPTX',
        fileSize: '18.4 MB',
        version: 'v1.2',
        uploadedAt: '2026-09-11',
      },
      {
        id: 'del-2',
        title: 'Soil_Microbiome_HighRes_Charts.pdf',
        fileType: 'PDF',
        fileSize: '6.2 MB',
        version: 'v1.0',
        uploadedAt: '2026-09-12',
      },
    ],
    messages: [
      {
        id: 'msg-1',
        sender: 'Dr. Getachew Tadesse',
        senderRole: 'client',
        message:
          'Hello Mr. Feysal, I have uploaded the draft slides with our latest experimental charts. Please ensure the statistical deltas stand out clearly for the defense committee.',
        timestamp: '2026-09-10 14:30',
      },
      {
        id: 'msg-2',
        sender: 'Mr. Feysal Hussein (Editor)',
        senderRole: 'editor',
        message:
          'Received Dr. Getachew. We have restructured the slide hierarchy according to the 3-second cognitive rule and applied Haramaya defense typography. Check the draft uploaded in Deliverables.',
        timestamp: '2026-09-11 10:15',
      },
    ],
    revisions: [
      {
        id: 'rev-1',
        requestedAt: '2026-09-11 16:45',
        notes:
          'Please increase font size on Slide 18 data table and adjust color for Control Group to dark navy.',
        status: 'In Progress',
      },
    ],
    estimatedCostETB: 2730,
    paymentProof: {
      transactionRef: 'TB-982173491',
      bankName: 'Telebirr',
      amountETB: 2730,
      status: 'Verified',
      receiptFileName: 'telebirr_receipt_2730_etb.pdf',
      submittedAt: '2026-09-10 15:00',
      verifiedAt: '2026-09-10 16:20',
      payerName: 'Dr. Getachew Tadesse',
      verifiedBy: 'Mr. Feysal Hussein (Director, WKI)',
    },
    supplementaryFiles: [
      {
        id: 'sup-1',
        name: 'raw_microbial_counts.xlsx',
        fileSize: '1.2 MB',
        uploadedAt: '2026-09-10',
        version: 'v1.0',
        category: 'Raw Dataset',
      },
      {
        id: 'sup-2',
        name: 'highres_soil_chromatogram.png',
        fileSize: '4.5 MB',
        uploadedAt: '2026-09-11',
        version: 'v1.1',
        category: 'High-Res Figure',
      },
      {
        id: 'sup-3',
        name: 'Haramaya_Defense_Guidelines_2026.pdf',
        fileSize: '850 KB',
        uploadedAt: '2026-09-10',
        version: 'v1.0',
        category: 'Faculty Guidelines',
      },
    ],
    milestones: [
      {
        id: 'mil-1',
        title: 'Intake Diagnostics & Thesis Abstract Ingestion',
        dayTarget: 1,
        status: 'completed',
        description: 'Manuscript pre-flight audit completed; slide structural density calculated.',
        completedDate: '2026-09-10',
      },
      {
        id: 'mil-2',
        title: 'Slide Cognitive Hierarchy & 3-Second Rule Restructuring',
        dayTarget: 2,
        status: 'completed',
        description: '42 master slides re-designed with high-contrast Hararghe agronomy palette.',
        completedDate: '2026-09-11',
      },
      {
        id: 'mil-3',
        title: 'Statistical Regression Curves & High-Res Vectorization',
        dayTarget: 3,
        status: 'completed',
        description: 'ANOVA p-value tables and root morphology micrographs vectorized.',
        completedDate: '2026-09-12',
      },
      {
        id: 'mil-4',
        title: 'Author Interactive Proof Inspection & Revision Annotations',
        dayTarget: 5,
        status: 'in_progress',
        description: 'Author inspecting draft deck via online studio and logging specific slide notes.',
      },
      {
        id: 'mil-5',
        title: 'Committee Rehearsal Verification & Final PPTX Export',
        dayTarget: 7,
        status: 'pending',
        description: 'Final sign-off certificate generation and print-ready release packaging.',
      },
    ],
  },
  {
    id: 'REQ-2024-0902',
    clientName: 'Scholar Abebe K.',
    affiliation: 'Haramaya University • Postgraduate Directorate',
    phone: '+251 927 650 724',
    telegram: '@FEYSAL_8',
    serviceCategory: 'editing',
    targetLanguage: 'en',
    projectTitle: 'Peer-Reviewed Journal Manuscript Formatting',
    description:
      'Comprehensive editing, IEEE citation verification, and typographic structuring for a 28-page multidisciplinary manuscript.',
    estimatedPages: 28,
    expectedDeadline: '2026-09-25',
    status: 'Client Review',
    createdAt: '2026-09-08',
    fileName: 'multidisciplinary_paper_proofed.docx',
    adminNotes:
      'First review completed by editor desk. Ready for client inspection before journal submission.',
    estimatedCostETB: 1820,
    paymentProof: {
      transactionRef: 'FT242548J9L1',
      bankName: 'Commercial Bank of Ethiopia (CBE)',
      amountETB: 1820,
      status: 'Verified',
      receiptFileName: 'cbe_slip_deposit_1820_etb.pdf',
      submittedAt: '2026-09-08 14:15',
      verifiedAt: '2026-09-08 15:30',
      payerName: 'Scholar Abebe K.',
      verifiedBy: 'Mr. Feysal Hussein (Director, WKI)',
    },
    deliverables: [
      {
        id: 'del-3',
        title: 'Manuscript_TrackChanges_Final.docx',
        fileType: 'DOCX',
        fileSize: '4.8 MB',
        version: 'v2.0',
        uploadedAt: '2026-09-11',
      },
      {
        id: 'del-4',
        title: 'IEEE_Formatted_Print_Ready.pdf',
        fileType: 'PDF',
        fileSize: '3.1 MB',
        version: 'v2.0',
        uploadedAt: '2026-09-11',
      },
    ],
    messages: [
      {
        id: 'msg-3',
        sender: 'Mr. Feysal Hussein (Editor)',
        senderRole: 'editor',
        message:
          'Your manuscript has been formatted to strict IEEE journal specifications with verified bibliography cross-references.',
        timestamp: '2026-09-11 11:20',
      },
    ],
    revisions: [],
    milestones: [
      {
        id: 'mil-201',
        title: 'Citation Audit & Cross-Ref Resolution',
        dayTarget: 1,
        status: 'completed',
        description: 'Verified 46 references against Crossref and IEEE Xplore indices.',
        completedDate: '2026-09-09',
      },
      {
        id: 'mil-202',
        title: 'Mathematical Typography & Equation Numbering',
        dayTarget: 2,
        status: 'completed',
        description: 'Formatted multi-line matrices and Greek symbols.',
        completedDate: '2026-09-10',
      },
      {
        id: 'mil-203',
        title: 'Author Sign-off & Final Proof Approval',
        dayTarget: 4,
        status: 'in_progress',
        description: 'Awaiting author electronic signature and release certificate.',
      },
    ],
  },
  {
    id: 'REQ-2024-0875',
    clientName: 'W/ro Chaltu Tolosa',
    affiliation: 'Oromia Education Bureau',
    phone: '+251 922 876 543',
    telegram: '@Chaltu_T',
    serviceCategory: 'oromoo_book',
    targetLanguage: 'or',
    projectTitle: 'Seenaa Oromoo fi Aadaa Barnoota Sadarkaa 2ffaa',
    description:
      'Typesetting, copy editing, and proofreading for 85-page educational workbook.',
    estimatedPages: 85,
    expectedDeadline: '2026-09-15',
    status: 'Completed',
    createdAt: '2026-09-02',
    fileName: 'seenaa_oromoo_final_proof.pdf',
    adminNotes: 'Delivered print-ready PDF and source document to author.',
    estimatedCostETB: 5525,
    paymentProof: {
      transactionRef: 'AW-098214710',
      bankName: 'Awash Bank',
      amountETB: 5525,
      status: 'Verified',
      receiptFileName: 'awash_bank_advice_slip.pdf',
      submittedAt: '2026-09-03 09:40',
      verifiedAt: '2026-09-03 11:00',
      payerName: 'Oromia Education Bureau (W/ro Chaltu)',
      verifiedBy: 'Mr. Feysal Hussein',
    },
    approvalCertificate: {
      certificateNumber: 'WKI-APPR-2024-8750',
      clientName: 'W/ro Chaltu Tolosa',
      affiliation: 'Oromia Education Bureau',
      projectTitle: 'Seenaa Oromoo fi Aadaa Barnoota Sadarkaa 2ffaa',
      serviceCategory: 'oromoo_book',
      approvedDate: 'September 6, 2024',
      pagesApproved: 85,
      digitalChecksum: 'SHA256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
      directorSignature: 'Feysal Hussein (Director & Senior Typographer)',
      clientSignature: 'Chaltu Tolosa',
      status: 'Official Approved',
    },
    deliverables: [
      {
        id: 'del-5',
        title: 'Seenaa_Oromoo_PrintReady_Final.pdf',
        fileType: 'PDF',
        fileSize: '24.5 MB',
        version: 'Final Release',
        uploadedAt: '2026-09-06',
      },
    ],
    messages: [
      {
        id: 'msg-4',
        sender: 'W/ro Chaltu Tolosa',
        senderRole: 'client',
        message:
          'Ulfaadhaa Obbo Feysal, kitaabni qulqullina olaanaadhaan nuuf maxxanfamee qaqqabeera.',
        timestamp: '2026-09-06 17:10',
      },
    ],
    revisions: [],
  },
];

export const INITIAL_RESOURCES: ResourceItem[] = [
  {
    id: 'res-1',
    title: 'Top 100 Academic Phrasal Verbs Quick Reference Guide',
    category: 'English Grammar',
    language: 'en',
    fileType: 'PDF',
    pages: 14,
    description:
      'Printable pocket guide with formal synonyms, preposition collocations, and contextual citations.',
  },
  {
    id: 'res-2',
    title: 'Haramaya Thesis Presentation Slide Template & Grid (16:9)',
    category: 'Presentation Design',
    language: 'en',
    fileType: 'PPTX',
    pages: 25,
    description:
      'Master slides formatted with strict academic contrast standards and modular data placeholders.',
  },
  {
    id: 'res-3',
    title: 'Qajeelfama Qubee fi Sirna Barreeffama Afaan Oromoo',
    category: 'Afaan Oromoo',
    language: 'or',
    fileType: 'PDF',
    pages: 22,
    description:
      'Qajeelfama qulqullina barreeffamaa, sirna tuqaalee fi seerluga ogeessotaaf.',
  },
  {
    id: 'res-4',
    title: 'جدول مخارج الحروف وأحكام النون والتنوين للطباعة',
    category: 'علوم القرآن',
    language: 'ar',
    fileType: 'PDF',
    pages: 8,
    description:
      'مخطط لوني عالي الدقة يوضح مخارج الحروف السبعة عشر وأحكام التجويد الأساسية.',
  },
  {
    id: 'res-5',
    title: 'Academic Writing & Paraphrasing Handbook',
    category: 'Academic Writing',
    language: 'en',
    fileType: 'PDF',
    pages: 36,
    description:
      'Techniques for doctoral literature reviews, synthesis matrices, and anti-plagiarism writing.',
  },
  {
    id: 'res-6',
    title: 'Amharic Academic Punctuation & Rhetoric Guide',
    category: 'Amharic Language',
    language: 'am',
    fileType: 'PDF',
    pages: 18,
    description:
      'የአካዳሚክ ሥርዓተ ነጥቦች፣ የጥናት ጽሑፍ አንቀጾች አደረጃጀት እና የቋንቋ ጥራት መመሪያ።',
  },
];

export const INITIAL_FAQS: { question: string; answer: string; category: string }[] = [
  {
    category: 'Publishing',
    question: 'What types of books do you write?',
    answer:
      'We write, develop, and publish linguistic monographs, grammar reference books, phrasal verbs & idioms compendiums, cultural and historical treatises (Seenaa fi Aadaa Oromoo), Arabic educational manuscripts & Tajweed texts, Amharic academic publications, and educational workbooks from beginner to advanced levels.',
  },
  {
    category: 'Languages',
    question: 'Which languages do you support?',
    answer:
      'We provide full multilingual writing, proofreading, typesetting, editing, and translation across four core languages: English, Afaan Oromoo, Amharic, and Arabic (with certified right-to-left RTL typographic composition).',
  },
  {
    category: 'PowerPoint',
    question: 'Do you design PowerPoint presentations?',
    answer:
      'Yes. Our professional PowerPoint presentation service specializes in Academic, Business, Seminar, Research, Thesis/Defense, Project, Training, and Conference presentations with custom animations, transitions, charts, diagrams, infographics, and fully editable PPTX files.',
  },
  {
    category: 'Editing',
    question: 'Can you edit an existing book?',
    answer:
      'Yes. We provide comprehensive developmental editing, copyediting, proofreading, rewriting, text formatting, language polishing, and academic formatting for existing book manuscripts and research papers.',
  },
  {
    category: 'Translation',
    question: 'Do you provide translation?',
    answer:
      'Yes. We specialize in six major bidirectional translation combinations: English ↔ Afaan Oromoo, English ↔ Amharic, English ↔ Arabic, Afaan Oromoo ↔ Amharic, Afaan Oromoo ↔ Arabic, and Amharic ↔ Arabic with grammar correction and terminology consistency.',
  },
  {
    category: 'Arabic & RTL',
    question: 'Can Arabic books be formatted RTL?',
    answer:
      'Yes. We possess specialized right-to-left (RTL) Arabic typography and page direction systems, supporting Quranic/Islamic text formatting, Tajweed diacritics, Salat and Du’a publications, and Arabic educational books.',
  },
  {
    category: 'Afaan Oromoo',
    question: 'Can I request Afaan Oromoo educational materials?',
    answer:
      'Yes. We develop Afaan Oromoo educational books, Seenaa Dhuunfaa (biographies/histories), Aadaa Oromoo (cultural heritage) materials, stories, proverbs (Mammaaksa), curriculum workbooks, and academic translations.',
  },
  {
    category: 'Submission',
    question: 'Can I submit my project online?',
    answer:
      'Yes. You can submit your project requirements, title, description, deadlines, and file uploads directly through our online "Request a Service" form, or contact Mr. Feysal Hussein via phone (+251 927 650 724 / +251 961 189 074) or Telegram (@FEYSAL_8).',
  },
  {
    category: 'Portal & Tracking',
    question: 'Can I track my project?',
    answer:
      'Yes. Through the Customer / Client Account portal, you can track your project status across five structured stages: Submitted → Reviewing → In Progress → Client Review (Review) → Completed, view files, exchange messages, and submit revision requests.',
  },
  {
    category: 'E-Learning',
    question: 'Do you provide e-learning materials?',
    answer:
      'Yes. Our E-Learning Platform features comprehensive courses, video & text lessons, downloadable PDF resources, interactive quizzes, progress tracking, and verified certificates of completion for eligible courses.',
  },
];

export const INITIAL_CERTIFICATES: Certificate[] = [
  {
    certificateId: 'WKI-CERT-2024-8842',
    studentName: 'Scholar Abebe K.',
    courseTitle: 'Academic PowerPoint & Scientific Defense Masterclass',
    issuedDate: 'September 10, 2024',
    instructor: 'Mr. Feysal Hussein',
    organization: 'Wirtuu Kompiitaraa Ilillii Publishing Services • Haramaya University',
    grade: 'Distinction (100%)',
    verified: true,
  },
  {
    certificateId: 'WKI-CERT-2024-5109',
    studentName: 'Fatima Mohammed',
    courseTitle: 'قواعد التجويد والتنضيد الرقمي باللغة العربية',
    issuedDate: 'August 24, 2024',
    instructor: 'أ. فيصل حسين',
    organization: 'Wirtuu Kompiitaraa Ilillii Publishing Services • Haramaya University',
    grade: 'Excellence (95%)',
    verified: true,
  },
  {
    certificateId: 'WKI-CERT-2024-3321',
    studentName: 'Chaltu Tolosa',
    courseTitle: 'Qajeelfama Barreeffama Saayinsawaa Afaan Oromootiin',
    issuedDate: 'July 18, 2024',
    instructor: 'Obbo Feysal Huseen',
    organization: 'Wirtuu Kompiitaraa Ilillii Publishing Services • Haramaya University',
    grade: 'Honors (92%)',
    verified: true,
  },
];

export const INITIAL_STUDENT_PROFILE: StudentScholarProfile = {
  name: 'Scholar Abebe K.',
  email: 'scholar.abebe@haramaya.edu.et',
  phone: '+251 911 482 910',
  university: 'Haramaya University',
  department: 'College of Computing & Informatics',
  academicDegree: 'MSc Scholar',
  thesisTitle: 'Deep Learning Approaches for Multilingual Scholarly Layout Optimization in Low-Resource Languages',
  advisorName: 'Prof. Tadesse G. & Dr. Al-Mansoor',
  defenseDateTarget: 'November 28, 2024',
  preferredLanguage: 'en',
};

export const INITIAL_ADVISORY_MESSAGES: AdvisoryMessage[] = [
  {
    id: 'msg-1',
    senderName: 'Scholar Abebe K.',
    senderRole: 'scholar',
    avatar: 'AK',
    text: 'Good morning Mr. Feysal! I have restructured my 18 thesis defense slides following the 3-Second Cognitive Rule from your Masterclass. Could you review the methodology section slide where I present the ANOVA two-way factorial design?',
    timestamp: 'Yesterday at 10:15 AM',
    topic: 'Thesis Defense Slide Structure',
    attachmentName: 'Abebe_MSc_Defense_Methodology_v2.pptx',
  },
  {
    id: 'msg-2',
    senderName: 'Mr. Feysal Hussein',
    senderRole: 'director',
    avatar: 'FH',
    text: 'Greetings Scholar Abebe! I examined your methodology slide. Excellent improvement on replacing the prose block with 3 key delta nodes. However, your ANOVA table currently has 12 numbers in 12pt font. Convert the F-statistics and P-values into a high-contrast delta chart with the p < 0.01 threshold highlighted in gold. That will prevent committee fatigue immediately.',
    timestamp: 'Yesterday at 11:42 AM',
    topic: 'Thesis Defense Slide Structure',
  },
  {
    id: 'msg-3',
    senderName: 'Scholar Abebe K.',
    senderRole: 'scholar',
    avatar: 'AK',
    text: 'Understood! I will use the scientific vector chart template from module 2. Also, does our university require APA 7th or IEEE for the reference bibliography on backup slides?',
    timestamp: 'Today at 09:20 AM',
    topic: 'Citation Standards & Defense Prep',
  },
  {
    id: 'msg-4',
    senderName: 'Mr. Feysal Hussein',
    senderRole: 'director',
    avatar: 'FH',
    text: 'For the College of Computing and Informatics at Haramaya, IEEE format is mandatory for computational papers, while Postgraduate Directorate accepts APA 7th if interdisciplinary. For your defense slides, display simplified IEEE bracketed anchors [1, 2] on the corner, with full citations on your hidden slide index.',
    timestamp: 'Today at 10:05 AM',
    topic: 'Citation Standards & Defense Prep',
  },
];

export const INITIAL_COURSE_MATERIALS: CourseMaterial[] = [
  {
    id: 'mat-1',
    courseId: 'course-ppt-defense',
    courseTitle: 'Academic PowerPoint & Scientific Defense Masterclass',
    title: '3-Second Rule Master Defense Slide Template Deck',
    fileType: 'PPTX',
    fileSize: '14.2 MB',
    downloadCount: 342,
    category: 'Lecture Slides',
    description: '16:9 widescreen master layout with pre-configured typographic hierarchy, contrast guidelines, and backup slide jump hyperlinks.',
  },
  {
    id: 'mat-2',
    courseId: 'course-ppt-defense',
    courseTitle: 'Academic PowerPoint & Scientific Defense Masterclass',
    title: 'Statistical ANOVA & Delta Chart Redesign Vector Kit',
    fileType: 'PPTX',
    fileSize: '8.7 MB',
    downloadCount: 289,
    category: 'Handout',
    description: 'Pre-styled vectors for presenting ANOVA, regression curves, and multi-variable matrices without visual clutter.',
  },
  {
    id: 'mat-3',
    courseId: 'course-ppt-defense',
    courseTitle: 'Academic PowerPoint & Scientific Defense Masterclass',
    title: 'Haramaya University Defense Examination Syllabus & Rubric',
    fileType: 'PDF',
    fileSize: '2.4 MB',
    downloadCount: 415,
    category: 'Syllabus',
    description: 'Official postgraduate assessment rubric used by internal and external examiners during master’s and PhD oral defenses.',
  },
  {
    id: 'mat-4',
    courseId: 'course-oromoo-writing',
    courseTitle: 'Qajeelfama Barreeffama Saayinsawaa Afaan Oromootiin',
    title: 'Seerota Qubee fi Caasluga Barreeffama Saayinsawaa Qajeelfama',
    fileType: 'DOCX',
    fileSize: '3.8 MB',
    downloadCount: 198,
    category: 'Handout',
    description: 'Qajeelfama qophii barreeffama digirii fi barruulee qorannoo Afaan Oromootiin qophaa’an qajeelchu.',
  },
  {
    id: 'mat-5',
    courseId: 'course-arabic-typesetting',
    courseTitle: 'قواعد التجويد والتنضيد الرقمي باللغة العربية',
    title: 'Makharij Al-Huroof High-Fidelity Phonetic Audio Stems',
    fileType: 'MP3',
    fileSize: '24.5 MB',
    downloadCount: 312,
    category: 'Phonetic Audio',
    description: 'Audio articulation examples for 28 Arabic consonants with Tashkeel and Tajweed modulation by certified Qaris.',
  },
  {
    id: 'mat-6',
    courseId: 'course-english-grammar',
    courseTitle: 'English Grammar & Academic Writing for Higher Education',
    title: 'APA 7th & IEEE Citation Comparison Matrix & Cheatsheet',
    fileType: 'PDF',
    fileSize: '1.9 MB',
    downloadCount: 520,
    category: 'Citation Template',
    description: 'Fast-reference tables covering parenthetical citations, multi-author et al. guidelines, DOI formatting, and preprint rules.',
  },
];

export const INITIAL_QUIZ_ATTEMPTS: QuizAttempt[] = [
  {
    id: 'qa-1',
    courseId: 'course-ppt-defense',
    courseTitle: 'Academic PowerPoint & Scientific Defense Masterclass',
    scorePct: 100,
    totalQuestions: 3,
    correctAnswers: 3,
    takenAt: 'Sep 10, 2024',
    passed: true,
  },
  {
    id: 'qa-2',
    courseId: 'course-english-grammar',
    courseTitle: 'English Grammar & Academic Writing for Higher Education',
    scorePct: 85,
    totalQuestions: 4,
    correctAnswers: 3,
    takenAt: 'Sep 05, 2024',
    passed: true,
  },
];

