import React, { useState } from 'react';
import {
  X,
  Search,
  Globe,
  UploadCloud,
  FileCode,
  Download,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ExternalLink,
  Copy,
  Check,
} from 'lucide-react';

interface SeoGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SeoGuideModal: React.FC<SeoGuideModalProps> = ({ isOpen, onClose }) => {
  const [copiedRobots, setCopiedRobots] = useState(false);
  const [copiedSitemap, setCopiedSitemap] = useState(false);
  const [activeTab, setActiveTab] = useState<'google' | 'hosting' | 'files' | 'tips'>('google');

  if (!isOpen) return null;

  const robotsContent = `# robots.txt for संघीय इको-विजन नर्मदा फाउंडेशन
User-agent: *
Allow: /

Sitemap: https://yourdomain.org/sitemap.xml`;

  const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://yourdomain.org/#home</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://yourdomain.org/#about</loc>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://yourdomain.org/#campaigns</loc>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://yourdomain.org/#narmada-prahari</loc>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://yourdomain.org/#volunteer</loc>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
</urlset>`;

  const copyToClipboard = (text: string, type: 'robots' | 'sitemap') => {
    navigator.clipboard.writeText(text);
    if (type === 'robots') {
      setCopiedRobots(true);
      setTimeout(() => setCopiedRobots(false), 2000);
    } else {
      setCopiedSitemap(true);
      setTimeout(() => setCopiedSitemap(false), 2000);
    }
  };

  const downloadFile = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-emerald-200 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-900 via-sky-900 to-emerald-950 text-white p-5 sm:p-6 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-300">
              <Search className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold font-heading leading-tight">
                Google Search व मुफ्त ऑनलाइन पब्लिशिंग मार्गदर्शिका
              </h2>
              <p className="text-xs sm:text-sm text-emerald-200 mt-1">
                संघीय इको-विजन नर्मदा फाउंडेशन (Sanghiya Eco-Vision Narmada Foundation) के लिए
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="बंद करें"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-4 sm:px-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('google')}
            className={`py-3 px-4 font-semibold text-sm border-b-2 cursor-pointer transition-colors whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'google'
                ? 'border-emerald-600 text-emerald-800 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Search className="w-4 h-4 text-emerald-600" />
            <span>1. Google Search Console गाइड</span>
          </button>
          <button
            onClick={() => setActiveTab('hosting')}
            className={`py-3 px-4 font-semibold text-sm border-b-2 cursor-pointer transition-colors whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'hosting'
                ? 'border-emerald-600 text-emerald-800 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <UploadCloud className="w-4 h-4 text-sky-600" />
            <span>2. 100% मुफ्त होस्टिंग (Live करना)</span>
          </button>
          <button
            onClick={() => setActiveTab('tips')}
            className={`py-3 px-4 font-semibold text-sm border-b-2 cursor-pointer transition-colors whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'tips'
                ? 'border-emerald-600 text-emerald-800 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 text-amber-600" />
            <span>3. Google पर नाम दिखने के उपाय</span>
          </button>
          <button
            onClick={() => setActiveTab('files')}
            className={`py-3 px-4 font-semibold text-sm border-b-2 cursor-pointer transition-colors whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'files'
                ? 'border-emerald-600 text-emerald-800 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileCode className="w-4 h-4 text-emerald-600" />
            <span>4. robots & sitemap डाउनलोड</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-slate-700 text-sm leading-relaxed">
          {/* TAB 1: Google Search Console */}
          {activeTab === 'google' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm">महत्वपूर्ण वास्तविकता (SEO यथार्थ):</h4>
                  <p className="text-xs text-amber-800 mt-0.5">
                    गूगल किसी भी नई वेबसाइट को तुरंत पहले दिन सर्च में नहीं दिखाता है। गूगल के बॉट
                    (Googlebot) वेबसाइट को क्रॉल करते हैं, इंडेक्स करते हैं और उसमें आमतौर पर कुछ दिन से
                    लेकर 2-4 सप्ताह तक का समय लग सकता है। कोई भी वैध डेवलपर तुरंत रैंक कराने की झूठी गारंटी नहीं दे सकता।
                  </p>
                </div>
              </div>

              <h3 className="font-bold text-base text-slate-900 border-b pb-2">
                Google Search Console में वेबसाइट जोड़ने के 4 सरल चरण:
              </h3>

              <ol className="space-y-3 list-decimal list-inside text-sm">
                <li className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <strong className="text-emerald-900">चरण 1: सर्च कंसोल खोलें:</strong>
                  <p className="text-xs text-slate-600 mt-1">
                    अपने गूगल खाते से <strong>search.google.com/search-console</strong> पर जाएं और
                    "Start Now" पर क्लिक करें।
                  </p>
                </li>
                <li className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <strong className="text-emerald-900">चरण 2: अपनी वेबसाइट का URL जोड़ें:</strong>
                  <p className="text-xs text-slate-600 mt-1">
                    "URL Prefix" विकल्प चुनें और अपनी लाइव वेबसाइट का पूरा पता दर्ज करें (जैसे:{' '}
                    <code>https://sanghiyaecovision.org</code> या आपका मुफ्त होस्टिंग पता)।
                  </p>
                </li>
                <li className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <strong className="text-emerald-900">चरण 3: स्वामित्व सत्यापित करें (Verification):</strong>
                  <p className="text-xs text-slate-600 mt-1">
                    गूगल आपको एक HTML टैग या HTML फ़ाइल देगा। HTML टैग को <code>index.html</code> के{' '}
                    <code>&lt;head&gt;</code> में चिपकाएं या अपने डोमेन प्रोवाइडर पर TXT रिकॉर्ड जोड़ें।
                  </p>
                </li>
                <li className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <strong className="text-emerald-900">चरण 4: Sitemap सबमिट करें:</strong>
                  <p className="text-xs text-slate-600 mt-1">
                    बाएं मेनू में <strong>Sitemaps</strong> पर जाएं और वहां{' '}
                    <code className="bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-mono">
                      sitemap.xml
                    </code>{' '}
                    लिखकर "Submit" दबाएं।
                  </p>
                </li>
              </ol>
            </div>
          )}

          {/* TAB 2: Free Hosting */}
          {activeTab === 'hosting' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900">
                <h4 className="font-bold text-sm">बजट शून्य होने पर भी 100% मुफ्त लाइव होस्टिंग:</h4>
                <p className="text-xs text-emerald-800 mt-1">
                  इस वेबसाइट को ऑनलाइन चलाने के लिए किसी भी पेड सर्वर की आवश्यकता नहीं है। नीचे दिए गए
                  सभी विकल्प हमेशा के लिए मुफ्त हैं (Free Tier with SSL):
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-xl border border-slate-200 bg-white hover:border-emerald-500 transition-colors">
                  <div className="font-bold text-slate-900 text-base">Vercel (सर्वश्रेष्ठ)</div>
                  <span className="inline-block px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] rounded font-semibold mt-1">
                    अनुशंसित • 2 मिनट में लाइव
                  </span>
                  <p className="text-xs text-slate-600 mt-2">
                    GitHub खाते से लॉगिन करें, रिपॉजिटरी चुनें और 1-क्लिक में लाइव करें। मुफ्त SSL और कस्टम डोमेन सपोर्ट मिलता है।
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-white hover:border-emerald-500 transition-colors">
                  <div className="font-bold text-slate-900 text-base">Netlify</div>
                  <span className="inline-block px-2 py-0.5 bg-sky-100 text-sky-800 text-[10px] rounded font-semibold mt-1">
                    मुफ्त ड्रैग-एंड-ड्रॉप
                  </span>
                  <p className="text-xs text-slate-600 mt-2">
                    <code>npm run build</code> चलाकर बने <code>dist</code> फोल्डर को सीधे Netlify पर खींचकर छोड़ें और तुरंत लाइव पाएं।
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-white hover:border-emerald-500 transition-colors">
                  <div className="font-bold text-slate-900 text-base">GitHub Pages</div>
                  <span className="inline-block px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] rounded font-semibold mt-1">
                    गिटहब पर स्थायी
                  </span>
                  <p className="text-xs text-slate-600 mt-2">
                    बिना किसी अतिरिक्त सर्वर के आपके GitHub कोड से सीधे मुफ्त वेबसाइट होस्ट करता है।
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-900 text-sm">प्रोजेक्ट कोड को अपने कंप्यूटर पर कैसे लें?</h4>
                <p className="text-xs text-slate-600">
                  Google AI Studio इंटरफ़ेस में ऊपर दिए गए 'Download Code / Export' बटन से आप पूरे प्रोजेक्ट की ZIP फ़ाइल डाउनलोड कर सकते हैं। इसके बाद अपने कंप्यूटर पर <code>npm install</code> और <code>npm run build</code> चला सकते हैं।
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: Tips to Rank */}
          {activeTab === 'tips' && (
            <div className="space-y-4">
              <h3 className="font-bold text-base text-slate-900 border-b pb-2">
                गूगल पर "संघीय इको-विजन नर्मदा फाउंडेशन" सर्च में आने की संभावना कैसे बढ़ाएं?
              </h3>

              <div className="space-y-3">
                <div className="p-3.5 rounded-lg bg-emerald-50/70 border border-emerald-100 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 text-sm block">1. हमने वेबसाइट में पूरा ऑन-पेज एसईओ कर दिया है:</strong>
                    <span className="text-xs text-slate-600">
                      सभी शीर्षकों (H1, H2), मेटा टैग, Schema.org NGO JSON-LD और ओपन-ग्राफ में आपका सटीक हिंदी नाम "संघीय इको-विजन नर्मदा फाउंडेशन" और अंग्रेजी नाम "Sanghiya Eco-Vision Narmada Foundation" समाहित है।
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-lg bg-sky-50/70 border border-sky-100 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 text-sm block">2. Google Business Profile बनाएं (बिल्कुल मुफ्त):</strong>
                    <span className="text-xs text-slate-600">
                      Google Maps / Google Business पर अपनी फाउंडेशन की मुफ्त प्रोफाइल बनाएं। उसमें यही हिंदी और अंग्रेजी नाम तथा वेबसाइट लिंक डालें। इससे स्थानीय सर्च में नाम तेजी से ऊपर आता है।
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-lg bg-amber-50/70 border border-amber-100 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 text-sm block">3. सोशल मीडिया पर एक समान नाम का उपयोग करें:</strong>
                    <span className="text-xs text-slate-600">
                      Facebook, YouTube या Instagram पर फाउंडेशन के पेज बनाते समय शीर्षक में "संघीय इको-विजन नर्मदा फाउंडेशन" ही रखें और बायो में वेबसाइट लिंक दें। गूगल जब विभिन्न स्थानों पर एक ही नाम देखता है, तो विश्वसनीयता बढ़ती है।
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-slate-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 text-sm block">4. स्थानीय समाचार या ब्लॉग में उल्लेख:</strong>
                    <span className="text-xs text-slate-600">
                      जब भी आप कोई घाट सफाई या वृक्षारोपण करें, स्थानीय प्रेस नोट में वेबसाइट लिंक और फाउंडेशन का पूरा नाम दें।
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Files */}
          {activeTab === 'files' && (
            <div className="space-y-4">
              <h3 className="font-bold text-base text-slate-900 border-b pb-2">
                सर्च इंजन फ़ाइलें (robots.txt व sitemap.xml)
              </h3>
              <p className="text-xs text-slate-600">
                ये दोनों फाइलें आपकी वेबसाइट के <code>public/</code> फोल्डर में पहले से ही तैयार कर दी गई हैं। आप चाहें तो इन्हें यहाँ से भी कॉपी या डाउनलोड कर सकते हैं:
              </p>

              {/* robots.txt box */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-900 text-slate-100">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-700">
                  <span className="text-xs font-mono text-emerald-400">robots.txt</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => copyToClipboard(robotsContent, 'robots')}
                      className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs flex items-center gap-1 cursor-pointer"
                    >
                      {copiedRobots ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedRobots ? 'कॉपी हो गया' : 'कॉपी करें'}</span>
                    </button>
                    <button
                      onClick={() => downloadFile('robots.txt', robotsContent)}
                      className="px-2 py-1 rounded bg-emerald-700 hover:bg-emerald-600 text-white text-xs flex items-center gap-1 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>डाउनलोड</span>
                    </button>
                  </div>
                </div>
                <pre className="text-xs font-mono overflow-x-auto text-slate-300 p-2 bg-slate-950 rounded">
                  {robotsContent}
                </pre>
              </div>

              {/* sitemap.xml box */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-900 text-slate-100">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-700">
                  <span className="text-xs font-mono text-sky-400">sitemap.xml</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => copyToClipboard(sitemapContent, 'sitemap')}
                      className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs flex items-center gap-1 cursor-pointer"
                    >
                      {copiedSitemap ? <Check className="w-3.5 h-3.5 text-sky-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedSitemap ? 'कॉपी हो गया' : 'कॉपी करें'}</span>
                    </button>
                    <button
                      onClick={() => downloadFile('sitemap.xml', sitemapContent)}
                      className="px-2 py-1 rounded bg-sky-700 hover:bg-sky-600 text-white text-xs flex items-center gap-1 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>डाउनलोड</span>
                    </button>
                  </div>
                </div>
                <pre className="text-xs font-mono overflow-x-auto text-slate-300 p-2 bg-slate-950 rounded max-h-40">
                  {sitemapContent}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-100 p-4 border-t border-slate-200 flex items-center justify-between">
          <p className="text-xs text-slate-500">
            * यह मार्गदर्शिका आपके अनुरोध के अनुसार पूर्णतः निशुल्क व पारदर्शी रखी गई है।
          </p>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors cursor-pointer"
          >
            समझ गया / बंद करें
          </button>
        </div>
      </div>
    </div>
  );
};
