import { AcademicGlossaryTerm, ServiceCategory } from '../types';

export const OFFICIAL_PAYMENT_INFO = {
  directorName: 'Mr. Feysal Hussein',
  directorRole: 'Managing Director & Senior Academic Editor',
  institution: 'Haramaya University & Wirtuu Kompiitaraa Ilillii',
  cbeAccount: '1000 2849 5721 4',
  cbeAccountName: 'Feysal Hussein / Wirtuu Kompiitaraa Ilillii',
  awashAccount: '0132 0482 9102 00',
  awashAccountName: 'Feysal Hussein',
  telebirrNumber: '+251 91 585 0838',
  phoneDirect: '+251 91 585 0838',
  telegramHandle: '@feysal_ilillii',
  telegramChannel: 'https://t.me/WirtuuKompiitaraallillii',
  officeLocation: 'Academic Complex, Haramaya University Main Campus, Oromia, Ethiopia',
  email: 'feysal.hussein@haramaya.edu.et',
};

export const PRICING_BASE_RATES: Record<ServiceCategory, { etbPerPage: number; usdPerPage: number; label: string }> = {
  ppt: { etbPerPage: 45, usdPerPage: 1.2, label: 'Doctoral / MSc Defense Slides' },
  english_book: { etbPerPage: 35, usdPerPage: 0.9, label: 'English Academic Textbook' },
  oromoo_book: { etbPerPage: 38, usdPerPage: 1.0, label: 'Afaan Oromoo Scholarly Monograph' },
  arabic_book: { etbPerPage: 50, usdPerPage: 1.3, label: 'Arabic & Tajweed Typography (RTL)' },
  amharic_book: { etbPerPage: 40, usdPerPage: 1.0, label: 'Amharic Typesetting & Fidel Layout' },
  translation: { etbPerPage: 65, usdPerPage: 1.8, label: '4-Way Academic Translation & Harmonization' },
  editing: { etbPerPage: 30, usdPerPage: 0.8, label: 'Linguistic Copyediting & APA 7th Styling' },
  formatting: { etbPerPage: 25, usdPerPage: 0.7, label: 'Thesis Formatting & PDF/X-1a Packaging' },
  elearning: { etbPerPage: 40, usdPerPage: 1.1, label: 'Digital Course Module Packaging' },
  other: { etbPerPage: 35, usdPerPage: 1.0, label: 'Custom Academic Editorial Project' },
};

export const OPTIONAL_ADDONS = [
  {
    id: 'defense_notes',
    name: 'Defense Speaker Notes & Animated Transitions',
    description: 'Bilingual speaker rehearsal cue cards & calibrated reveal animations',
    etbFixed: 450,
    usdFixed: 12,
  },
  {
    id: 'citation_audit',
    name: 'Citation & Bibliography Cross-Verification',
    description: 'Cross-checking APA 7th / IEEE references against Google Scholar & DOAJ',
    etbFixed: 600,
    usdFixed: 15,
  },
  {
    id: 'isbn_consultation',
    name: 'ISBN, Legal Deposit & CIP Cataloging Consultation',
    description: 'National Archives & Library of Ethiopia registration guidance',
    etbFixed: 750,
    usdFixed: 20,
  },
  {
    id: 'cover_vector',
    name: 'Bespoke Academic Vector Cover Art (Front, Spine, Back)',
    description: 'High-DPI CMYK cover wrap designed to printer press specifications',
    etbFixed: 850,
    usdFixed: 22,
  },
];

export const SAMPLE_MANUSCRIPTS = [
  {
    id: 'phd_defense_en',
    title: 'PhD Dissertation Abstract: Sustainable Agricultural Systems (English)',
    language: 'en',
    text: `TITLE: INTEGRATED CLIMATE-SMART AGRO-ECOLOGICAL PRACTICES IN EASTERN HARARGHE HIGHLANDS: ASSESSING SOIL ORGANIC CARBON SEQUESTRATION AND SMALLHOLDER RESILIENCE

ABSTRACT:
Smallholder agricultural productivity in eastern Ethiopia faces escalating vulnerability stemming from precipitation erraticism, land fragmentation, and topsoil degradation. This investigation assesses the socio-ecological efficacy of integrated agroforestry and conservation agriculture across 420 smallholder plots in Kersa and Haramaya woredas (Hussein & Tadesse, 2023). 

Utilizing a randomized complete block design stratified across three agro-ecological zones, soil organic carbon (SOC) dynamics were quantified over a 36-month monitoring continuum. Empirical findings demonstrate that Faidherbia albida parklands augmented SOC by 28.4% (p < 0.01) relative to conventional mono-cropping systems. Furthermore, multi-criteria econometric modeling revealed an annualized net household income accretion of 34.6%. 

The investigation concludes that localized indigenous conservation regimes constitute pivotal leverage points for regional climate mitigation policies. Recommendations are posited for institutional scaling through agricultural extension directorates.

Keywords: Agroforestry, Soil Organic Carbon, Climate Resilience, Eastern Hararghe, Smallholder Productivity. (APA 7th Reference: Hussein, F., & Tadesse, M. (2023). Journal of Agricultural Systems, 45(2), 112-129.)`,
  },
  {
    id: 'oromoo_thesis',
    title: 'Qorannoo Akkaadaamii: Seenaa fi Aadaa Oromoo (Afaan Oromoo)',
    language: 'or',
    text: `MATADUREE: GAHEE SIRNA GADAA BULCHIINSA NAANNOO FI NAGEENYA DIINAGDEE HAROO HARAMAYAA KEESSATTI

CUUNFAA:
Sirni Gadaa qabeenya aadaa, siyaasaa, fi hawaasummaa Oromoo isa bu'uuraati. Qorannoon kun gahee gumiiwwan Gadaa qorannoo walitti-dhufeenya hawaasaa fi kunuunsa bishaanii irratti qaban xiinxala. Malli qorannoo kun dhimmoota adda addaa irratti xiyyeeffachuun ragaalee afaanii fi barreeffamaa walitti qabee jira. 

Bu'aan qorannoo kanaa akka mul'isutti, seerri aadaa 'Seera Safuu fi Laguu' jedhamu manca'iinsa daangaa haroo ittisuu keessatti bu'aa guddaa qaba (Hussein, 2022). Kanaafuu, dhimmoota eegumsa naannoo ammayyaa keessatti ogummaa aadaa Oromoo fayyadamuun furmaata waaraa akka ta'e mirkanaa'eera.

Jechoota Ijoo: Sirna Gadaa, Seera Safuu, Haroo Haramayaa, Kunuunsa Qabeenya Uumamaa, Afaan Oromoo.`,
  },
  {
    id: 'arabic_tajweed',
    title: 'بحوث الدراسات الإسلامية وعلم التجويد (Arabic & Tajweed)',
    language: 'ar',
    text: `العنوان: أحكام النون الساكنة والتنوين وتطبيقاتها الصوتية في التلاوة الصحيحة

المقدمة والمستخلص:
إن علم التجويد من أشرف العلوم الشرعية لاتصاله الوثيق بكتاب الله تبارك وتعالى. يهدف هذا البحث إلى بيان أحكام النون الساكنة والتنوين الأربعة: الإظهار الحلقي، والإدغام بقسميه، والإقلاب، والإخفاء الحقيقي، مع دراسة الخصائص الصوتية ومخارج الحروف.

وقد اعتمد الباحث المنهج الوصفي التحليلي لمقارنة الروايات وتوضيح علامات الضبط المصحفي في رواية حفص عن عاصم. وتوصلت الدراسة إلى أن مراعاة صفة الغنة بمقدار حركتين وضبط مراتب التفخيم والترقيق يمنع اللحن الجلي والخفي، مما يعين طلاب العلم والباحثين على الأداء القرآني المتقن.

الكلمات المفتاحية: التجويد، النون الساكنة، الغنة، مخارج الحروف، جامعة هرمايا، الدراسات العربية والإسلامية.`,
  },
  {
    id: 'amharic_research',
    title: 'የግብርና ምርምር እና የኢኮኖሚ ጥናት አህፅሮት (Amharic)',
    language: 'am',
    text: `ርዕስ፡ በምስራቅ ሐረርጌ ዞን የገበሬዎች የገበያ ተጠቃሚነት እና የቴክኖሎጂ አጠቃቀም ዳሰሳ ጥናት

አህፅሮት፡
ይህ ጥናት በምስራቅ ሐረርጌ ዞን በሚገኙ ሦስት ወረዳዎች ውስጥ የአነስተኛ ገበሬዎችን የሰብል ምርታማነት እና የገበያ ትስስር ይገመግማል (ታደሰ እና ሁሴን፣ 2023)። 

በጥናቱ የተካተቱት 350 አባወራዎች መረጃ በስታቲስቲክሳዊ ሞዴሎች ተተንትኗል። የጥናቱ ውጤት እንደሚያሳየው ዘመናዊ የመስኖ ቴክኖሎጂዎችን እና የተሻሻሉ ዘሮችን የተጠቀሙ አርሶ አደሮች ዓመታዊ ገቢያቸው በ42 በመቶ እድገት አሳይቷል። ይሁን እንጂ የትራንስፖርት እና የማከማቻ እጦት ዋነኛ ተግዳሮት ሆኖ ተመዝግቧል።

ዋና ቃላት፡ ምስራቅ ሐረርጌ፣ የግብርና ገበያ፣ የመስኖ ቴክኖሎጂ፣ የሐረማያ ዩኒቨርሲቲ፣ የገጠር ኢኮኖሚ።`,
  },
];

export const ACADEMIC_GLOSSARY_TERMS: AcademicGlossaryTerm[] = [
  {
    id: 'term-1',
    category: 'research',
    en: 'Abstract',
    or: 'Cuunfaa',
    am: 'አህፅሮት',
    ar: 'ملخص البحث',
    definition: 'A concise summary of a research paper, thesis, or scholarly presentation outlining objectives, methods, results, and conclusions.',
    example: 'The doctoral committee reviewed the abstract prior to the defense scheduling.',
  },
  {
    id: 'term-2',
    category: 'research',
    en: 'Methodology',
    or: 'Akkaataa Qorannoo (Tooftaa)',
    am: 'የጥናት ዘዴ / የአሰራር ቅደም-ተከተል',
    ar: 'منهجية البحث',
    definition: 'The systematic, theoretical analysis of the methods applied to a field of study or dissertation.',
    example: 'A mixed-methods methodology was adopted combining econometric surveys with qualitative focus groups.',
  },
  {
    id: 'term-3',
    category: 'research',
    en: 'Dissertation / Thesis',
    or: 'Waraqaa Eebbaa (Doktoreetii / Maastarsi)',
    am: 'የምርምር ጥናት ፅሁፍ (ቴሲስ / ዲስርቴሽን)',
    ar: 'أطروحة علمية / رسالة دكتوراه',
    definition: 'A long essay on a particular subject, written as a requirement for the doctor of philosophy (PhD) or master’s degree.',
    example: 'The candidate defended her dissertation successfully before the faculty board.',
  },
  {
    id: 'term-4',
    category: 'publishing',
    en: 'Peer Review',
    or: 'Gamaaggama Hiriyootaa (Hayyootaa)',
    am: 'የአቻ ምሁራን ግምገማ',
    ar: 'مراجعة الأقران / التحكيم العلمي',
    definition: 'Evaluation of scientific, academic, or professional work by others working in the same field prior to formal journal publication.',
    example: 'Both independent peer reviewers endorsed the manuscript following minor revisions.',
  },
  {
    id: 'term-5',
    category: 'publishing',
    en: 'Typesetting & Pagination',
    or: 'Qindaa’ina Barruu fi Fuul-Lakkoofsaa',
    am: 'የፅሁፍ አቀማመጥ እና የገፅ ቅንብር',
    ar: 'التنضيد والترقيم الطباعي',
    definition: 'The composition of text by means of arranging types and organizing margin grids, running headers, and folio numbers.',
    example: 'Wirtuu Kompiitaraa Ilillii completed the dual-direction Arabic-English book typesetting.',
  },
  {
    id: 'term-6',
    category: 'publishing',
    en: 'Bibliography / References',
    or: 'Wabiilee fi Wabiiwwan Barreeffamaa',
    am: 'የዋቢ መጻሕፍት ዝርዝር',
    ar: 'قائمة المصادر والمراجع',
    definition: 'A list of the books, academic journals, and sources referred to in a scholarly work, arranged according to APA, IEEE, or Chicago format.',
    example: 'Ensure all cited in-text authors correspond exactly to the finalized bibliography.',
  },
  {
    id: 'term-7',
    category: 'computing',
    en: 'Slide Deck & Speaker Notes',
    or: 'Slaayidii Agarsiisaa fi Yaadannoo Dubbataa',
    am: 'የስላይድ አቀራረብ እና የአቅራቢው ማስታወሻ',
    ar: 'شرائح العرض وملاحظات المتحدث',
    definition: 'A collection of slides formatted for academic presentation with synchronized explanatory prompt cues for the speaker.',
    example: 'The doctoral defense slide deck utilized high-contrast typography and dynamic charts.',
  },
  {
    id: 'term-8',
    category: 'islamic_arabic',
    en: 'Tajweed (Phonetic Articulation)',
    or: 'Qiraa’atii Tajwiidaa (Sirna Sagalee)',
    am: 'የተጅዊድ ህጎች (ትክክለኛ የቁርዓን አነባበብ)',
    ar: 'علم التجويد ومخارج الحروف',
    definition: 'The set of rules governing how the words of the Holy Quran should be pronounced during recitation, including Madd and Ghunnah.',
    example: 'Proper typesetting of Tajweed literature requires OpenType fonts with vocalization diacritic anchors.',
  },
  {
    id: 'term-9',
    category: 'publishing',
    en: 'Proofreading & Copyediting',
    or: 'Sirreeffama Qubee fi Loogaa',
    am: 'የፊደላት እና የቋንቋ እርማት',
    ar: 'التدقيق اللغوي والتحرير',
    definition: 'The thorough checking and linguistic refining of a printed or digital text to eliminate grammatical, typographical, and structural errors.',
    example: 'Mr. Feysal Hussein conducted the four-stage academic proofreading.',
  },
  {
    id: 'term-10',
    category: 'research',
    en: 'Hypothesis Formulation',
    or: 'Tilmaama Yaada Qorannoo',
    am: 'የምርምር መላ-ምት',
    ar: 'صياغة الفرضيات العلمية',
    definition: 'A proposed explanation or tentative assumption made on the basis of limited evidence as a starting point for scientific investigation.',
    example: 'The statistical analysis supported the null hypothesis at the 5% significance threshold.',
  },
];
