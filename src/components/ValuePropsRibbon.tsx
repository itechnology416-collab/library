import React from 'react';
import { Language } from '../types';

interface ValuePropsRibbonProps {
  currentLanguage: Language;
}

export const ValuePropsRibbon: React.FC<ValuePropsRibbonProps> = ({ currentLanguage }) => {
  const content = {
    en: [
      {
        icon: 'verified',
        title: 'Professional Quality',
        desc: 'High standards in every academic project',
        badgeColor: 'text-amber-600 bg-amber-500/10 border-amber-500/20',
      },
      {
        icon: 'translate',
        title: 'Multilingual Support',
        desc: 'English, Afaan Oromoo, Amharic, Arabic',
        badgeColor: 'text-blue-600 bg-blue-500/10 border-blue-500/20',
      },
      {
        icon: 'devices',
        title: 'Modern Technology',
        desc: 'Secure, digital and efficient solutions',
        badgeColor: 'text-emerald-600 bg-emerald-500/10 border-emerald-500/20',
      },
      {
        icon: 'support_agent',
        title: 'Customer Focused',
        desc: 'Clear communication & continuous support',
        badgeColor: 'text-purple-600 bg-purple-500/10 border-purple-500/20',
      },
    ],
    or: [
      {
        icon: 'verified',
        title: 'Qulqullina Ogummaa',
        desc: 'Ulaagaa olaanaa pirojektoota hundarratti',
        badgeColor: 'text-amber-600 bg-amber-500/10 border-amber-500/20',
      },
      {
        icon: 'translate',
        title: 'Tajaajila Afaan Hedduu',
        desc: 'Ingiliffaa, Afaan Oromoo, Amaaraa, Arabaa',
        badgeColor: 'text-blue-600 bg-blue-500/10 border-blue-500/20',
      },
      {
        icon: 'devices',
        title: 'Teeknolojii Ammayyaa',
        desc: 'Furmaata ammayyaa, amansiisaa fi saffisaa',
        badgeColor: 'text-emerald-600 bg-emerald-500/10 border-emerald-500/20',
      },
      {
        icon: 'support_agent',
        title: 'Xiyyeeffannaa Maamilaa',
        desc: 'Qunnamtii ifa fi deeggarsa walirraa hin cinne',
        badgeColor: 'text-purple-600 bg-purple-500/10 border-purple-500/20',
      },
    ],
    am: [
      {
        icon: 'verified',
        title: 'ሙያዊ ጥራት',
        desc: 'በእያንዳንዱ አካዳሚክ ፕሮጀክት ከፍተኛ ደረጃ',
        badgeColor: 'text-amber-600 bg-amber-500/10 border-amber-500/20',
      },
      {
        icon: 'translate',
        title: 'የብዙ ቋንቋዎች ድጋፍ',
        desc: 'እንግሊዝኛ፣ ኦሮምኛ፣ አማርኛ እና ዓረብኛ',
        badgeColor: 'text-blue-600 bg-blue-500/10 border-blue-500/20',
      },
      {
        icon: 'devices',
        title: 'ዘመናዊ ቴክኖሎጂ',
        desc: 'ፈጣን፣ አስተማማኝ እና ዲጂታል መፍትሄዎች',
        badgeColor: 'text-emerald-600 bg-emerald-500/10 border-emerald-500/20',
      },
      {
        icon: 'support_agent',
        title: 'ደንበኛ ተኮር አገልግሎት',
        desc: 'ግልጽ ግንኙነት እና ተከታታይ ሙያዊ ድጋፍ',
        badgeColor: 'text-purple-600 bg-purple-500/10 border-purple-500/20',
      },
    ],
    ar: [
      {
        icon: 'verified',
        title: 'جودة واحترافية عالية',
        desc: 'معايير علمية دقيقة في كل مشروع أكاديمي',
        badgeColor: 'text-amber-600 bg-amber-500/10 border-amber-500/20',
      },
      {
        icon: 'translate',
        title: 'دعم متعدد اللغات',
        desc: 'الإنجليزية، الأورومية، الأمهرية، العربية',
        badgeColor: 'text-blue-600 bg-blue-500/10 border-blue-500/20',
      },
      {
        icon: 'devices',
        title: 'تقنيات رقمية حديثة',
        desc: 'حلول نشر وتنسيق سريعة وموثوقة',
        badgeColor: 'text-emerald-600 bg-emerald-500/10 border-emerald-500/20',
      },
      {
        icon: 'support_agent',
        title: 'التركيز على رضا الباحث',
        desc: 'تواصل شفاف ومتابعة مستمرة حتى التسليم',
        badgeColor: 'text-purple-600 bg-purple-500/10 border-purple-500/20',
      },
    ],
  };

  const items = content[currentLanguage] || content.en;

  return (
    <section className="px-gutter-mobile py-2 bg-surface">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-surface-container-lowest border border-outline-variant/20 shadow-xs flex items-center gap-3.5 hover:border-secondary/40 transition-all"
            >
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center border shrink-0 ${item.badgeColor}`}
              >
                <span className="material-symbols-outlined text-[24px]">{item.icon}</span>
              </div>
              <div className="min-w-0">
                <h4 className="font-title-sm text-title-sm font-bold text-on-surface truncate">
                  {item.title}
                </h4>
                <p className="font-body-sm text-[12px] text-on-surface-variant truncate mt-0.5">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
