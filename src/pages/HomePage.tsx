import React from 'react';
import { PageId } from '../types';
import { FOUNDATION_INFO, CAMPAIGNS_DATA, CORE_OBJECTIVES } from '../data/foundationData';
import { RiverHeroIllustration } from '../components/RiverHeroIllustration';
import { CustomEmblem } from '../components/CustomEmblem';
import {
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Waves,
  Trees,
  Recycle,
  Megaphone,
  Smartphone,
  Users,
  CheckCircle2,
  Heart,
  Droplets,
  Compass,
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: PageId) => void;
  customLogoUrl: string | null;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, customLogoUrl }) => {
  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50/70 via-sky-50/50 to-white pt-8 sm:pt-14 pb-12 border-b border-emerald-100/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Trust Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-300 text-emerald-900 text-xs sm:text-sm font-medium shadow-2xs">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>निस्वार्थ जन-सहभागिता आधारित नदी व पर्यावरण संरक्षण अभियान</span>
              </div>

              {/* Organization Identification & Official Logo */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
                <CustomEmblem customLogoUrl={customLogoUrl} size="lg" className="shadow-lg shrink-0" />
                <div className="space-y-2">
                  <span className="text-xs sm:text-sm font-semibold tracking-wider text-sky-800 uppercase block">
                    {FOUNDATION_INFO.englishName}
                  </span>
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading text-emerald-950 tracking-tight leading-tight">
                    {FOUNDATION_INFO.tagline}
                  </h1>
                </div>
              </div>

              {/* Subtitle */}
              <p className="text-base sm:text-lg md:text-xl text-slate-700 font-medium leading-relaxed max-w-2xl mx-auto lg:mx-0">
                {FOUNDATION_INFO.subtitle}
              </p>

              {/* Organization Short Bio */}
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                माँ नर्मदा केवल एक नदी नहीं, बल्कि मध्य भारत की जीवनदायिनी संस्कृति है। हमारा
                फाउंडेशन पवित्र तटों की स्वच्छता, प्लास्टिक प्रदूषण मुक्ति, तटवर्ती सघन वृक्षारोपण और
                डिजिटल तकनीक द्वारा नदी के प्राकृतिक स्वरूप को संवारने के लिए कृतसंकल्पित है।
              </p>

              {/* CTA Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <button
                  onClick={() => onNavigate('campaigns')}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-base shadow-md hover:shadow-lg transition-all cursor-pointer border border-emerald-700"
                >
                  <span>हमारे अभियान देखें</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onNavigate('volunteer')}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-sky-50 text-sky-900 font-semibold text-base shadow-sm hover:shadow-md transition-all cursor-pointer border-2 border-sky-600"
                >
                  <Users className="w-4 h-4 text-sky-600" />
                  <span>हमसे जुड़ें (स्वयंसेवक बनें)</span>
                </button>
              </div>

              {/* Highlights Pill Badges */}
              <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                <div className="p-2.5 rounded-lg bg-white border border-emerald-100 shadow-2xs">
                  <div className="font-bold text-emerald-800 text-sm">100% निस्वार्थ</div>
                  <div className="text-slate-500 text-[11px]">जन-सहभागिता</div>
                </div>
                <div className="p-2.5 rounded-lg bg-white border border-sky-100 shadow-2xs">
                  <div className="font-bold text-sky-800 text-sm">निर्मल घाट</div>
                  <div className="text-slate-500 text-[11px]">स्वच्छता श्रमदान</div>
                </div>
                <div className="p-2.5 rounded-lg bg-white border border-emerald-100 shadow-2xs">
                  <div className="font-bold text-emerald-800 text-sm">हरित तट</div>
                  <div className="text-slate-500 text-[11px]">देशी वृक्षारोपण</div>
                </div>
                <div className="p-2.5 rounded-lg bg-white border border-amber-100 shadow-2xs">
                  <div className="font-bold text-amber-800 text-sm">नर्मदा प्रहरी</div>
                  <div className="text-slate-500 text-[11px]">डिजिटल निगरानी</div>
                </div>
              </div>
            </div>

            {/* Right Visual Artwork */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <RiverHeroIllustration className="w-full" />
              <div className="mt-3 text-center">
                <p className="text-xs text-slate-500 italic">
                  * सांकेतिक कलाकृति: पवित्र नर्मदा जल, पावन घाट व हरित तट संरक्षण का संकल्प
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SANKALP & VALUES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
            हमारा मूल संकल्प
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900">
            माँ नर्मदा के पवित्र प्रवाह व तटों की रक्षा क्यों आवश्यक है?
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            अमरकंटक से लेकर खंभात की खाड़ी तक, नर्मदा नदी न केवल करोड़ों लोगों की प्यास बुझाती है,
            बल्कि हमारी संस्कृति, आध्यात्म और जैव विविधता का आधार है।
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          <div className="p-6 rounded-2xl bg-white border border-emerald-100 shadow-sm hover:shadow-md transition-shadow space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Waves className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">पावन जल व घाट शुचिता</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              लाखों श्रद्धालुओं की श्रद्धा के केंद्र माँ नर्मदा के घाटों पर कचरे और पूजा-सामग्री के
              वैज्ञानिक निस्तारण द्वारा जल की शुद्धता बनाए रखना।
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-sky-100 shadow-sm hover:shadow-md transition-shadow space-y-3">
            <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center">
              <Recycle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">प्लास्टिक प्रदूषण मुक्ति</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              एकल-उपयोग प्लास्टिक और थर्माकोल के विरुद्ध जन-चेतना जगाकर नर्मदा को प्लास्टिक मुक्त
              बनाना, ताकि जलीय जीव और पर्यावरण सुरक्षित रहें।
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-amber-100 shadow-sm hover:shadow-md transition-shadow space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <Trees className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">हरित तट व वृक्षारोपण</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              तटवर्ती क्षेत्रों में देशी प्रजाति के पेड़ों का रोपण कर मिट्टी के कटाव को रोकना और भूजल
              स्तर को समृद्ध बनाए रखना।
            </p>
          </div>
        </div>
      </section>

      {/* 3. KEY CAMPAIGNS PREVIEW */}
      <section className="bg-slate-50 py-16 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-sky-800 bg-sky-100 px-3 py-1 rounded-full">
                प्रमुख जन-अभियान
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900 mt-2">
                धरातल पर संचालित हमारे 6 मुख्य अभियान
              </h2>
            </div>
            <button
              onClick={() => onNavigate('campaigns')}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-800 hover:text-emerald-950 transition-colors cursor-pointer"
            >
              <span>सभी 6 अभियानों का विस्तृत विवरण देखें</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CAMPAIGNS_DATA.slice(0, 3).map((camp) => (
              <div
                key={camp.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div className="p-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
                      {camp.statusBadge}
                    </span>
                    <Waves className="w-5 h-5 text-sky-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">{camp.title}</h3>
                  <p className="text-xs font-medium text-emerald-700">{camp.subtitle}</p>
                  <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed">
                    {camp.objective}
                  </p>
                </div>
                <div className="p-4 bg-slate-50 border-t border-slate-100">
                  <button
                    onClick={() => onNavigate('campaigns')}
                    className="w-full text-center text-xs font-semibold text-emerald-800 hover:text-emerald-950 py-1.5 cursor-pointer"
                  >
                    अभियान विवरण व जुड़ने का तरीका →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. NARMADA PRAHARI APP SPOTLIGHT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-br from-emerald-900 via-sky-950 to-emerald-950 text-white p-8 sm:p-12 overflow-hidden shadow-xl border border-emerald-700/50">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-medium">
                <Smartphone className="w-4 h-4" />
                <span>डिजिटल संरक्षण नवाचार • विकास की प्रक्रिया में</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-bold font-heading">
                "नर्मदा प्रहरी" मोबाइल ऐप
              </h2>
              <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed">
                नर्मदा तटों पर सफाई गतिविधियों की निगरानी, प्रदूषण की तुरंत फोटो व जीपीएस लोकेशन
                आधारित रिपोर्टिंग और स्वयंसेवकों के समन्वय के लिए हमारा आगामी तकनीकी मंच।
              </p>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-200">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>प्रदूषण व कचरा जमाव की त्वरित फोटो रिपोर्टिंग</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>स्वयंसेवक सफाई श्रमदान गतिविधियों की ट्रैकिंग</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>तटवर्ती नागरिकों व श्रद्धालुओं के लिए पर्यावरण अलर्ट</span>
                </li>
              </ul>
              <div className="pt-2 flex flex-wrap gap-3">
                <button
                  onClick={() => onNavigate('narmada-prahari')}
                  className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm transition-all cursor-pointer shadow-md"
                >
                  नर्मदा प्रहरी ऐप का परिचय व प्रोटोटाइप देखें
                </button>
                <div className="inline-flex items-center px-3 py-2 rounded-xl bg-white/10 text-emerald-200 text-xs border border-white/15">
                  शीघ्र ही उपलब्ध होगा (Coming Soon)
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 flex justify-center">
              <div className="w-64 sm:w-72 bg-slate-900 rounded-3xl p-4 border-4 border-slate-700 shadow-2xl space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-[11px] text-slate-400">
                  <span>नर्मदा प्रहरी</span>
                  <span className="text-emerald-400">लाइव डेमो</span>
                </div>
                <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-700/60 text-xs space-y-1">
                  <span className="text-[10px] uppercase text-emerald-300 font-bold">स्थिति</span>
                  <div className="text-white font-semibold">घाट सफाई अभियान सक्रिय</div>
                  <div className="text-[11px] text-emerald-200">स्थान: पवित्र नर्मदा घाट</div>
                </div>
                <div className="p-3 rounded-xl bg-sky-950/80 border border-sky-700/60 text-xs space-y-1">
                  <span className="text-[10px] uppercase text-sky-300 font-bold">नागरिक रिपोर्ट</span>
                  <div className="text-white font-semibold">फोटो व जीपीएस संलग्न</div>
                  <div className="text-[11px] text-sky-200">स्वच्छता टीम को प्रेषित</div>
                </div>
                <div className="text-center py-2">
                  <span className="text-[10px] text-slate-400">
                    * वास्तविक ऐप रिलीज होने पर असली डाउनलोड लिंक जोड़ा जाएगा।
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. VOLUNTEER & CONTACT QUICK CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-emerald-100 via-sky-50 to-emerald-50 border-2 border-emerald-200 p-8 sm:p-12 text-center space-y-4">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-800 text-white shadow-md mx-auto">
            <Users className="w-7 h-7" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-heading text-emerald-950">
            आप भी बन सकते हैं माँ नर्मदा के सजग प्रहरी
          </h2>
          <p className="text-sm sm:text-base text-slate-700 max-w-2xl mx-auto leading-relaxed">
            चाहे आप युवा हों, विद्यार्थी हों, गृहणी हों, या पर्यावरण प्रेमी — आपका थोड़ा सा समय और
            श्रमदान माँ नर्मदा की पवित्र धारा को स्वच्छ और अविरल बनाए रखने में अमूल्य योगदान देगा।
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('volunteer')}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-sm transition-all shadow-md cursor-pointer"
            >
              स्वयंसेवक पंजीकरण फॉर्म भरें
            </button>
            <button
              onClick={() => onNavigate('contact')}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-semibold text-sm transition-all border border-slate-300 shadow-2xs cursor-pointer"
            >
              फाउंडेशन से संपर्क करें
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
