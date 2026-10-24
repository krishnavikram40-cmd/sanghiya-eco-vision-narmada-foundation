import React from 'react';
import { FOUNDATION_INFO } from '../data/foundationData';
import {
  ShieldCheck,
  Lock,
  EyeOff,
  Database,
  UserCheck,
  FileText,
  AlertCircle,
} from 'lucide-react';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      {/* 1. Header */}
      <section className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-900 text-xs sm:text-sm font-semibold">
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          <span>सत्यनिष्ठा एवं डेटा सुरक्षा</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-slate-900 leading-tight">
          गोपनीयता नीति (Privacy Policy)
        </h1>
        <p className="text-sm font-medium text-sky-800">
          {FOUNDATION_INFO.hindiName} ({FOUNDATION_INFO.englishName})
        </p>
        <p className="text-xs text-slate-500">
          अंतिम अद्यतन (Last Updated): अक्टूबर 2026 • संस्करण: 1.0 (पारदर्शी जन-अभियान)
        </p>
      </section>

      {/* 2. Core Promise */}
      <section className="p-6 rounded-2xl bg-emerald-50 border-2 border-emerald-300 text-emerald-950 space-y-2">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <Lock className="w-5 h-5 text-emerald-800" />
          <span>हमारा मूल वचन — आपका डेटा पूर्णतः सुरक्षित और निजी है</span>
        </h2>
        <p className="text-xs sm:text-sm text-emerald-900/90 leading-relaxed">
          संघीय इको-विजन नर्मदा फाउंडेशन आपकी निजता (Privacy) का अत्यंत सम्मान करता है। हम किसी भी
          प्रकार के व्यावसायिक लाभ, डेटा बिक्री, अनधिकृत ट्रैकिंग या विज्ञापन के लिए उपयोगकर्ता का
          डेटा एकत्र नहीं करते। आपकी सहमति के बिना आपकी कोई भी व्यक्तिगत जानकारी किसी भी बाहरी तीसरे पक्ष
          (Third Party) को नहीं भेजी जाती।
        </p>
      </section>

      {/* 3. Detailed Clauses */}
      <div className="space-y-8 text-slate-700 text-sm leading-relaxed">
        {/* Clause 1 */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-2">
          <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs flex items-center justify-center font-bold">
              1
            </span>
            <span>हम कौन-सी जानकारी एकत्र करते हैं?</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-600">
            हम केवल वही जानकारी प्राप्त करते हैं जो आप स्वेच्छा से हमारे <strong>"स्वयंसेवक बनें"</strong> अथवा{' '}
            <strong>"संपर्क करें"</strong> फॉर्म में भरते हैं:
          </p>
          <ul className="list-disc list-inside space-y-1 text-xs text-slate-600 pt-1">
            <li>आपका नाम (स्वयंसेवक पहचान हेतु)</li>
            <li>मोबाइल नंबर (अभियान व समन्वय हेतु)</li>
            <li>ईमेल पता (यदि आपने स्वेच्छा से दिया हो)</li>
            <li>शहर/स्थान (घाट सफाई और क्षेत्रीय दल समन्वय हेतु)</li>
            <li>आपके द्वारा भेजा गया संदेश अथवा कौशल विवरण</li>
          </ul>
        </div>

        {/* Clause 2 */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-2">
          <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs flex items-center justify-center font-bold">
              2
            </span>
            <span>एकत्रित जानकारी का उपयोग किसलिए किया जाता है?</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-600">
            आपकी जानकारी का उपयोग केवल निम्नलिखित गैर-व्यावसायिक उद्देश्यों के लिए किया जाता है:
          </p>
          <ul className="list-disc list-inside space-y-1 text-xs text-slate-600 pt-1">
            <li>नर्मदा घाट सफाई और वृक्षारोपण श्रमदान की सूचना साझा करने के लिए।</li>
            <li>आपके द्वारा भेजे गए प्रश्नों या सुझावों का उत्तर देने के लिए।</li>
            <li>"नर्मदा प्रहरी" ऐप के विकास व परीक्षण से संबंधित महत्वपूर्ण अपडेट देने के लिए।</li>
          </ul>
        </div>

        {/* Clause 3 */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-2">
          <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs flex items-center justify-center font-bold">
              3
            </span>
            <span>स्थानीय भंडारण (Local Storage) की व्यवस्था</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-600">
            वर्तमान में वेबसाइट पर भरे गए फॉर्म का डेटा आपके अपने ब्राउज़र के <strong>Local Storage</strong> में
            सुरक्षित सहेजा जाता है। इसका अर्थ यह है कि जब तक कोई आधिकारिक सुरक्षित बैकएंड सक्रिय नहीं किया
            जाता, यह डेटा इंटरनेट पर किसी अनजान सर्वर पर प्रवाहित नहीं होता। आप जब चाहें अपने ब्राउज़र का डेटा
            साफ़ (Clear Cache) करके इसे हटा सकते हैं।
          </p>
        </div>

        {/* Clause 4 */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-2">
          <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs flex items-center justify-center font-bold">
              4
            </span>
            <span>कुकीज एवं ट्रैकिंग (Cookies & Tracking)</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-600">
            हमारी वेबसाइट पर कोई भी इनवेसिव (आक्रामक) ट्रैकर, फेसबुक पिक्सेल या विज्ञापन कुकीज सक्रिय नहीं हैं।
            वेबसाइट का उपयोग करते समय आपकी कोई भी गुप्त प्रोफाइलिंग नहीं की जाती है।
          </p>
        </div>

        {/* Clause 5 */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-2">
          <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs flex items-center justify-center font-bold">
              5
            </span>
            <span>उपयोगकर्ता के अधिकार (Your Rights)</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-600">
            प्रत्येक स्वयंसेवक और नागरिक को यह अधिकार है कि वह अपने द्वारा दर्ज की गई जानकारी को देख
            सके, उसमें सुधार का अनुरोध कर सके अथवा उसे पूर्णतः हटाने के लिए कह सके। हम आपके अधिकारों का
            पूर्ण सम्मान करते हैं।
          </p>
        </div>
      </div>

      {/* 4. Bottom Integrity Note */}
      <section className="p-4 rounded-xl bg-slate-100 text-center text-xs text-slate-500">
        माँ नर्मदा नदी का संरक्षण • सत्य, पारदर्शिता और निष्ठा के साथ
      </section>
    </div>
  );
};
