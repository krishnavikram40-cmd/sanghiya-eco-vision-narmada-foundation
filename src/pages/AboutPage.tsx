import React from 'react';
import { PageId } from '../types';
import { FOUNDATION_INFO, CORE_OBJECTIVES } from '../data/foundationData';
import { CustomEmblem } from '../components/CustomEmblem';
import {
  Heart,
  Target,
  Eye,
  CheckCircle2,
  ShieldCheck,
  Trees,
  Waves,
  Sparkles,
  Users,
  Compass,
  ArrowRight,
  Info,
} from 'lucide-react';

interface AboutPageProps {
  onNavigate: (page: PageId) => void;
  customLogoUrl: string | null;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate, customLogoUrl }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16">
      {/* 1. Header Introduction */}
      <section className="text-center max-w-4xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-900 text-xs sm:text-sm font-semibold">
          <Info className="w-4 h-4 text-emerald-700" />
          <span>संगठन का परिचय एवं विचार दर्शन</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading text-slate-900 leading-tight">
          हमारे बारे में — संघीय इको-विजन नर्मदा फाउंडेशन
        </h1>
        <p className="text-sm sm:text-base font-medium text-sky-800">
          {FOUNDATION_INFO.englishName}
        </p>
        <p className="text-base sm:text-lg text-slate-700 leading-relaxed pt-2">
          माँ नर्मदा नदी के पवित्र प्रवाह, पावन घाटों की शुचिता और तटवर्ती पर्यावरण के संरक्षण हेतु
          समर्पित एक निस्वार्थ नागरिक जन-अभियान।
        </p>
      </section>

      {/* 2. Transparent Integrity Notice */}
      <section className="p-4 sm:p-5 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-950 flex flex-col sm:flex-row items-start gap-4">
        <div className="p-2.5 rounded-xl bg-amber-200/80 text-amber-900 shrink-0">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div className="space-y-1 text-xs sm:text-sm leading-relaxed">
          <strong className="font-bold text-amber-900 block text-sm sm:text-base">
            पारदर्शिता एवं सत्यनिष्ठा की घोषणा:
          </strong>
          <p className="text-amber-900/90">
            संघीय इको-विजन नर्मदा फाउंडेशन एक जन-सहभागिता आधारित पर्यावरणीय पहल है। हमारी वेबसाइट
            पर किसी भी प्रकार की अप्रमाणित सरकारी मान्यता, गैर-सत्यापित पंजीकरण संख्या, अथवा काल्पनिक
            पुरस्कारों का दावा नहीं किया जाता। हमारा एकमात्र ध्येय ज़मीनी स्तर पर माँ नर्मदा की सेवा,
            घाटों की सफाई और पर्यावरण के प्रति जागरूकता फैलाना है।
          </p>
        </div>
      </section>

      {/* 3. Detailed Foundation Profile */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-4 flex flex-col items-center justify-center p-8 bg-gradient-to-br from-emerald-900 via-sky-900 to-emerald-950 rounded-3xl text-white text-center shadow-lg">
          <CustomEmblem customLogoUrl={customLogoUrl} size="xl" className="mb-4" />
          <h2 className="font-heading text-xl font-bold">{FOUNDATION_INFO.hindiName}</h2>
          <p className="text-xs text-sky-300 mt-1">{FOUNDATION_INFO.englishName}</p>
          <div className="mt-4 pt-4 border-t border-emerald-700/60 w-full text-xs text-emerald-200 space-y-1">
            <p>• पर्यावरण संरक्षण पहल</p>
            <p>• नदी तट शुचिता अभियान</p>
            <p>• नर्मदा प्रहरी डिजिटल नवाचार</p>
          </div>
        </div>

        <div className="lg:col-span-8 space-y-4 text-slate-700 text-sm sm:text-base leading-relaxed">
          <h2 className="text-2xl font-bold font-heading text-slate-900">
            हमारा संकल्प और पृष्ठभूमि
          </h2>
          <p>
            नर्मदा नदी भारत की सबसे पवित्र और प्राचीन नदियों में से एक है। युगों-युगों से नर्मदा जी ने
            करोड़ों लोगों को जीवन, अध्यात्म और जल सुरक्षा प्रदान की है। परंतु आज बढ़ते नगरीकरण,
            प्लास्टिक कचरे के अनियंत्रित उपयोग और घाटों पर असंगत अपशिष्ट विसर्जन के कारण यह पवित्र
            धारा प्रदूषण का शिकार हो रही है।
          </p>
          <p>
            इसी चिंता और माँ नर्मदा के प्रति अटूट श्रद्धा से प्रेरित होकर{' '}
            <strong>"संघीय इको-विजन नर्मदा फाउंडेशन"</strong> की परिकल्पना की गई है। हमारा उद्देश्य
            केवल औपचारिकता निभाना नहीं, बल्कि तटवर्ती निवासियों, परिक्रमावासियों, युवाओं और श्रद्धालुओं
            के मन में यह भाव जगाना है कि{' '}
            <em>"नर्मदा की रक्षा ही हमारे पर्यावरण और भविष्य की रक्षा है।"</em>
          </p>
        </div>
      </section>

      {/* 4. Mission & Vision Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Mission */}
        <div className="p-8 rounded-3xl bg-emerald-50/70 border-2 border-emerald-200 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-800 text-white flex items-center justify-center shadow-xs">
            <Target className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold font-heading text-emerald-950">हमारा मिशन (Mission)</h2>
          <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
            माँ नर्मदा नदी के प्रवाह और उसके समस्त तटवर्ती घाटों को प्लास्टिक मुक्त, कचरा मुक्त और
            प्रदूषण मुक्त बनाने के लिए एक व्यापक, निरंतर और समावेशी जन-आंदोलन खड़ा करना। स्थानीय समाज,
            युवाओं और तकनीक को जोड़कर नदी संरक्षण को जन-संस्कृति का अंग बनाना।
          </p>
          <ul className="space-y-2 text-xs sm:text-sm text-slate-700 pt-2">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>नियमित घाट स्वच्छता श्रमदान संचालित करना।</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>एकल-उपयोग प्लास्टिक पर पूर्ण रोक हेतु जन-जागरूकता।</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>तटवर्ती क्षेत्रों में देशी प्रजातियों के पौधों का सघन रोपण।</span>
            </li>
          </ul>
        </div>

        {/* Vision */}
        <div className="p-8 rounded-3xl bg-sky-50/70 border-2 border-sky-200 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-sky-800 text-white flex items-center justify-center shadow-xs">
            <Eye className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold font-heading text-sky-950">हमारा विज़न (Vision)</h2>
          <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
            एक ऐसा भविष्य जहां माँ नर्मदा का संपूर्ण प्रवाह उद्गम अमरकंटक से लेकर संगम तक स्वच्छ,
            अविरल और जैव-विविधता से परिपूर्ण हो; जहां प्रत्येक श्रद्धालु और नागरिक नदी को अपनी माता मानकर
            उसके संरक्षण का उत्तरदायित्व स्वयं उठाए; और जहां "नर्मदा प्रहरी" आधुनिक तकनीक के माध्यम से
            प्रदूषण की निगरानी में देश का अनुकरणीय मॉडल बने।
          </p>
          <ul className="space-y-2 text-xs sm:text-sm text-slate-700 pt-2">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-sky-700 shrink-0" />
              <span>अविरल और निर्मल जलधारा की पुनर्स्थापना।</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-sky-700 shrink-0" />
              <span>पर्यावरण संवेदनशील तटवर्ती समुदायों का निर्माण।</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-sky-700 shrink-0" />
              <span>पारदर्शी, तकनीक-सक्षम और जवाबदेह नदी निगरानी तंत्र।</span>
            </li>
          </ul>
        </div>
      </section>

      {/* 5. 7 Core Objectives */}
      <section className="space-y-8">
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
            मार्गदर्शक सिद्धांत
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900">
            हमारे 7 प्रमुख संगठनात्मक उद्देश्य
          </h2>
          <p className="text-sm text-slate-600">
            इन 7 उद्देश्यों को केंद्र में रखकर फाउंडेशन अपनी सभी योजनाएं व गतिविधियां संचालित करता है:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CORE_OBJECTIVES.map((obj) => (
            <div
              key={obj.id}
              className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-emerald-400 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="w-8 h-8 rounded-full bg-emerald-800 text-white font-bold text-sm flex items-center justify-center">
                    0{obj.id}
                  </span>
                  <Sparkles className="w-4 h-4 text-amber-500" />
                </div>
                <h3 className="font-bold text-base text-slate-900">{obj.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {obj.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Environmental Commitment */}
      <section className="p-8 sm:p-10 rounded-3xl bg-slate-900 text-white space-y-6">
        <div className="max-w-3xl space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
            हमारा वचन
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-heading">
            पर्यावरण और नदी संरक्षण के प्रति हमारी दृढ़ प्रतिबद्धता
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            हम वचनबद्ध हैं कि नर्मदा नदी के संरक्षण को किसी भी व्यक्तिगत लाभ, राजनीति या संकीर्ण हितों
            से दूर रखेंगे। हमारा हर कदम पारदर्शी होगा, हर श्रमदान माँ नर्मदा को समर्पित होगा, और हर
            स्वयंसेवक का सम्मान हमारी प्राथमिकता होगी।
          </p>
        </div>

        <div className="pt-4 flex flex-wrap gap-4">
          <button
            onClick={() => onNavigate('volunteer')}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-sky-600 hover:from-emerald-700 hover:to-sky-700 text-white font-semibold text-sm transition-all shadow-md cursor-pointer flex items-center gap-2"
          >
            <span>इस संकल्प का हिस्सा बनें — स्वयंसेवक बनें</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => onNavigate('campaigns')}
            className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm transition-all border border-white/20 cursor-pointer"
          >
            हमारे अभियान देखें
          </button>
        </div>
      </section>
    </div>
  );
};
