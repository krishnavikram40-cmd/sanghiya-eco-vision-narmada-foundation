import React from 'react';
import { PageId } from '../types';
import { CAMPAIGNS_DATA } from '../data/foundationData';
import {
  Waves,
  Recycle,
  Megaphone,
  Trees,
  Users,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Image as ImageIcon,
  ArrowRight,
  Sparkles,
  HelpCircle,
} from 'lucide-react';

interface CampaignsPageProps {
  onNavigate: (page: PageId) => void;
}

export const CampaignsPage: React.FC<CampaignsPageProps> = ({ onNavigate }) => {
  const getIcon = (name: string) => {
    switch (name) {
      case 'Waves':
        return <Waves className="w-6 h-6 text-sky-600" />;
      case 'Recycle':
        return <Recycle className="w-6 h-6 text-emerald-600" />;
      case 'Megaphone':
        return <Megaphone className="w-6 h-6 text-amber-600" />;
      case 'Trees':
        return <Trees className="w-6 h-6 text-emerald-700" />;
      case 'Users':
        return <Users className="w-6 h-6 text-teal-600" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-6 h-6 text-sky-700" />;
      default:
        return <Sparkles className="w-6 h-6 text-emerald-600" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16">
      {/* 1. Header */}
      <section className="text-center max-w-4xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-900 text-xs sm:text-sm font-semibold">
          <Waves className="w-4 h-4 text-emerald-700" />
          <span>धरातल पर क्रियान्वित जन-अभियान</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading text-slate-900 leading-tight">
          हमारे प्रमुख अभियान — माँ नर्मदा सेवा व पर्यावरण रक्षा
        </h1>
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
          प्रत्येक अभियान का उद्देश्य माँ नर्मदा नदी के प्रवाह, तटों, जैव-विविधता और जन-जीवन को
          स्वच्छ व सुरक्षित बनाना है। नीचे दिए गए सभी 6 अभियानों में कोई भी नागरिक सक्रिय भागीदारी कर सकता है।
        </p>
      </section>

      {/* 2. List of 6 Campaigns */}
      <section className="space-y-12">
        {CAMPAIGNS_DATA.map((campaign, index) => (
          <div
            key={campaign.id}
            id={campaign.id}
            className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow space-y-6"
          >
            {/* Top Bar of the Campaign */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-slate-100 border border-slate-200">
                  {getIcon(campaign.iconName)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-400 font-mono">
                      अभियान #0{index + 1}
                    </span>
                    <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
                      {campaign.statusBadge}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold font-heading text-slate-900 mt-0.5">
                    {campaign.title}
                  </h2>
                </div>
              </div>

              <button
                onClick={() => onNavigate('volunteer')}
                className="self-start sm:self-auto inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                <span>इस अभियान से जुड़ें</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Campaign Subtitle & Objective */}
            <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-100 text-emerald-950">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 block mb-1">
                मूल उद्देश्य:
              </span>
              <p className="text-sm sm:text-base font-medium">{campaign.objective}</p>
            </div>

            {/* Grid: Description & Photo Placeholder */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Details */}
              <div className="lg:col-span-7 space-y-4 text-slate-700 text-sm leading-relaxed">
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">अभियान का विस्तृत परिचय:</h3>
                  <p>{campaign.description}</p>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 mb-2">प्रमुख गतिविधियां व कार्ययोजना:</h3>
                  <ul className="space-y-1.5">
                    {campaign.keyActions.map((action, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-3.5 rounded-xl bg-sky-50 border border-sky-100 text-sky-950">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-sky-900 mb-1">
                    आप कैसे जुड़ सकते हैं:
                  </h4>
                  <p className="text-xs sm:text-sm">{campaign.howToJoin}</p>
                </div>
              </div>

              {/* Right Image Slot Placeholder */}
              <div className="lg:col-span-5 flex flex-col justify-center">
                <div className="w-full aspect-16/10 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 border-2 border-dashed border-slate-300 p-6 flex flex-col items-center justify-center text-center space-y-3 relative overflow-hidden group">
                  <div className="w-12 h-12 rounded-full bg-white shadow-xs flex items-center justify-center text-slate-400 group-hover:text-emerald-600 transition-colors">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-slate-700">
                      {campaign.imagePlaceholderText}
                    </p>
                    <p className="text-[11px] text-slate-500 max-w-xs">
                      [फाउंडेशन के वास्तविक अभियान की असली तस्वीर जोड़ने हेतु निर्धारित स्थान]
                    </p>
                  </div>
                  <div className="px-2.5 py-1 rounded-md bg-amber-100 text-amber-800 text-[10px] font-medium border border-amber-200">
                    पारदर्शिता: कोई नकली तस्वीर नहीं दर्शाई गई है
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* 3. Bottom CTA */}
      <section className="text-center p-8 rounded-3xl bg-gradient-to-r from-emerald-900 to-sky-900 text-white space-y-4">
        <h2 className="text-2xl sm:text-3xl font-bold font-heading">
          माँ नर्मदा के संरक्षण में अपना श्रमदान दें
        </h2>
        <p className="text-sm sm:text-base text-slate-200 max-w-2xl mx-auto">
          अपने क्षेत्र या नजदीकी नर्मदा घाट पर हमारे स्वयंसेवक दल से जुड़ें और स्वच्छता का दीप जलाएं।
        </p>
        <button
          onClick={() => onNavigate('volunteer')}
          className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm transition-all shadow-md cursor-pointer"
        >
          स्वयंसेवक फॉर्म भरें (पंजीकरण)
        </button>
      </section>
    </div>
  );
};
