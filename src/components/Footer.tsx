import React from 'react';
import { PageId } from '../types';
import { CustomEmblem } from './CustomEmblem';
import { FOUNDATION_INFO } from '../data/foundationData';
import { OfficerApplicationModal } from './OfficerApplicationModal';
import {
  Heart,
  Search,
  ExternalLink,
  ShieldCheck,
  Mail,
  MapPin,
  Phone,
  ArrowUp,
  Sparkles,
} from 'lucide-react';

interface FooterProps {
  onNavigate: (page: PageId) => void;
  onOpenSeoGuide: () => void;
  customLogoUrl: string | null;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onOpenSeoGuide,
  customLogoUrl,
}) => {
  const [showOfficerModal, setShowOfficerModal] = React.useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNav = (page: PageId) => {
    onNavigate(page);
    scrollToTop();
  };

  return (
    <footer className="bg-gradient-to-b from-slate-900 via-emerald-950 to-slate-950 text-slate-300 border-t-4 border-emerald-600">
      {/* Top Banner inside Footer */}
      <div className="bg-emerald-900/60 border-b border-emerald-800/50 py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-amber-400 shrink-0" />
            <div>
              <p className="font-semibold text-white text-base">
                "त्वदीय पाद पंकजम नमामि देवि नर्मदे"
              </p>
              <p className="text-xs text-emerald-200">
                माँ नर्मदा के पावन जल और हरित तटों की रक्षा हम सभी का पुनीत कर्तव्य है।
              </p>
            </div>
          </div>
          <button
            onClick={() => handleNav('volunteer')}
            className="px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-semibold text-sm shadow-md transition-all cursor-pointer"
          >
            अभियान में हाथ बटाएं — स्वयंसेवक बनें
          </button>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Col 1: Identity & Bio */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <CustomEmblem customLogoUrl={customLogoUrl} size="md" />
              <div>
                <h3 className="font-heading font-bold text-lg text-white leading-tight">
                  {FOUNDATION_INFO.hindiName}
                </h3>
                <p className="text-xs text-sky-400 font-medium">
                  {FOUNDATION_INFO.englishName}
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              माँ नर्मदा नदी के संरक्षण, घाटों की सफाई, प्लास्टिक मुक्ति, वृक्षारोपण और पर्यावरण
              जागरूकता हेतु समर्पित एक गैर-व्यावसायिक जन-अभियान।
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/60 border border-emerald-700/60 text-emerald-300 text-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>100% निस्वार्थ जन-सहभागिता</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-amber-300 uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
              महत्वपूर्ण पेज
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => handleNav('home')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer text-left"
                >
                  होम पेज (मुख्य पृष्ठ)
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('about')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer text-left"
                >
                  हमारे बारे में (मिशन व विज़न)
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('campaigns')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer text-left"
                >
                  हमारे अभियान (घाट सफाई, वृक्षारोपण)
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('gallery')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer text-left"
                >
                  गतिविधियों की गैलरी
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('narmada-prahari')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer text-left flex items-center gap-1.5"
                >
                  <span>नर्मदा प्रहरी मोबाइल ऐप</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-sky-900 text-sky-200 border border-sky-700">
                    आगामी
                  </span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('volunteer')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer text-left"
                >
                  स्वयंसेवक बनें (पंजीकरण)
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('contact')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer text-left"
                >
                  संपर्क करें (सुझाव व जानकारी)
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('privacy')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer text-left"
                >
                  गोपनीयता नीति (Privacy Policy)
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact Placeholders */}
          <div>
            <h4 className="text-sm font-semibold text-amber-300 uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
              संपर्क विवरण (स्थान)
            </h4>
            <div className="space-y-3 text-xs text-slate-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white block">मुख्य संपर्क कार्यालय:</span>
                  <span className="text-slate-400 italic">
                    [फाउंडेशन का आधिकारिक पता यहां जोड़ें — उदा. नर्मदा तटवर्ती क्षेत्र, मध्य प्रदेश]
                  </span>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white block">ईमेल पता:</span>
                  <span className="text-slate-400 italic">[आधिकारिक ईमेल यहां जोड़ें]</span>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white block">हेल्पलाइन / फोन:</span>
                  <span className="text-slate-400 italic">[आधिकारिक फोन नंबर यहां जोड़ें]</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 pt-1">
                * नोट: फाउंडेशन के वास्तविक संपर्क विवरण प्राप्त होने पर वेबसाइट में आसानी से अपडेट किए जा सकते हैं।
              </p>
            </div>
          </div>

          {/* Col 4: SEO & Webmaster Assistance */}
          <div>
            <h4 className="text-sm font-semibold text-amber-300 uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
              वेबसाइट व गूगल सर्च स्थिति
            </h4>
            <p className="text-xs text-slate-300 mb-3 leading-relaxed">
              Google Search पर "संघीय इको-विजन नर्मदा फाउंडेशन" को पहली बार इंडेक्स कराने के लिए
              सर्च कंसोल सेटअप और मुफ्त होस्टिंग निर्देश तैयार हैं।
            </p>
            <button
              onClick={onOpenSeoGuide}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors cursor-pointer border border-emerald-600 mb-3"
            >
              <Search className="w-3.5 h-3.5" />
              <span>गूगल सर्च व होस्टिंग गाइड खोलें</span>
            </button>
            <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700 text-[11px] text-slate-300 space-y-1">
              <div className="flex justify-between">
                <span>robots.txt:</span>
                <span className="text-emerald-400 font-mono">/robots.txt (तैयार)</span>
              </div>
              <div className="flex justify-between">
                <span>sitemap.xml:</span>
                <span className="text-emerald-400 font-mono">/sitemap.xml (तैयार)</span>
              </div>
              <div className="flex justify-between">
                <span>Schema.org JSON-LD:</span>
                <span className="text-emerald-400 font-mono">सक्रिय (Active)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Natural SEO Keyword Bar for Search Bots */}
        <div className="mt-12 pt-6 border-t border-slate-800/80 text-[11px] text-slate-400 leading-relaxed">
          <p className="mb-2 font-medium text-slate-300">
            मुख्य विषय एवं खोज शब्द (Search Index Keywords):
          </p>
          <p className="space-x-2 text-slate-400">
            <span className="text-slate-300 font-semibold">संघीय इको-विजन नर्मदा फाउंडेशन</span> •{' '}
            <span>Sanghiya Eco-Vision Narmada Foundation</span> •{' '}
            <span>माँ नर्मदा नदी संरक्षण</span> •{' '}
            <span>नर्मदा घाट सफाई अभियान</span> •{' '}
            <span>प्लास्टिक मुक्त नर्मदा</span> •{' '}
            <span>नर्मदा तट वृक्षारोपण</span> •{' '}
            <span>नर्मदा प्रहरी मोबाइल ऐप</span> •{' '}
            <span>नर्मदा परिक्रमा पर्यावरण रक्षा</span> •{' '}
            <span>नर्मदापुरम, ओंकारेश्वर, महेश्वर, अमरकंटक, जबलपुर घाट शुचिता</span> •{' '}
            <span>नदी प्रदूषण रोकथाम जन-सहभागिता</span>
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-1">
            <span>© {new Date().getFullYear()}</span>
            <span className="text-white font-medium">संघीय इको-विजन नर्मदा फाउंडेशन</span>
            <span className="hidden sm:inline">(Sanghiya Eco-Vision Narmada Foundation)</span>
            <span>। सर्वाधिकार सुरक्षित।</span>
          </div>

          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <button
              onClick={() => handleNav('privacy')}
              className="hover:text-emerald-400 transition-colors cursor-pointer"
            >
              गोपनीयता नीति
            </button>
            <span>•</span>
            <button
              onClick={() => handleNav('officer-login')}
              className="hover:text-sky-400 transition-colors cursor-pointer text-slate-400"
            >
              अधिकारी लॉगिन
            </button>
            <span>•</span>
            <button
              onClick={() => setShowOfficerModal(true)}
              className="hover:text-amber-300 transition-colors cursor-pointer text-slate-400"
              title="फाउंडेशन में समन्वय व पदाधिकारी बनने हेतु आवेदन करें"
            >
              पदाधिकारी समन्वय आवेदन
            </button>
            <span>•</span>
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1 hover:text-emerald-400 transition-colors cursor-pointer"
            >
              <span>ऊपर जाएं</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Discreet Officer Application Modal */}
      <OfficerApplicationModal
        isOpen={showOfficerModal}
        onClose={() => setShowOfficerModal(false)}
        customLogoUrl={customLogoUrl}
      />
    </footer>
  );
};
