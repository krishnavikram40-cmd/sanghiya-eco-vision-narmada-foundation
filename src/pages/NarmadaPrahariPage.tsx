import React, { useState } from 'react';
import { PRAHARI_APP_FEATURES } from '../data/foundationData';
import {
  Smartphone,
  AlertTriangle,
  MapPin,
  Camera,
  Users,
  CheckCircle2,
  Clock,
  Send,
  BellRing,
  Download,
  Info,
  ShieldCheck,
  Check,
} from 'lucide-react';

export const NarmadaPrahariPage: React.FC = () => {
  const [notifyContact, setNotifyContact] = useState('');
  const [notifySuccess, setNotifySuccess] = useState(false);

  // Prototype Simulator States
  const [simReportType, setSimReportType] = useState('प्लास्टिक कचरा जमाव');
  const [simLocation, setSimLocation] = useState('तिलवारा घाट, जबलपुर');
  const [simSubmitted, setSimSubmitted] = useState(false);

  const handleNotifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifyContact.trim()) return;

    // Save interest locally
    const existing = JSON.parse(localStorage.getItem('narmada_prahari_waitlist') || '[]');
    existing.push({ contact: notifyContact, date: new Date().toISOString() });
    localStorage.setItem('narmada_prahari_waitlist', JSON.stringify(existing));

    setNotifySuccess(true);
    setNotifyContact('');
    setTimeout(() => setNotifySuccess(false), 5000);
  };

  const handleSimSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSimSubmitted(true);
    setTimeout(() => setSimSubmitted(false), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16">
      {/* 1. Header & App Intro */}
      <section className="text-center max-w-4xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-100 text-sky-900 text-xs sm:text-sm font-semibold">
          <Smartphone className="w-4 h-4 text-sky-700" />
          <span>डिजिटल नदी संरक्षण पहल • माँ नर्मदा के सजग प्रहरी</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading text-slate-900 leading-tight">
          "नर्मदा प्रहरी" मोबाइल ऐप
        </h1>
        <p className="text-sm sm:text-base font-semibold text-emerald-800">
          Narmada Prahari Mobile Application — आगामी डिजिटल समाधान
        </p>
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl mx-auto">
          माँ नर्मदा के घाटों और नदी तटवर्ती क्षेत्रों में स्वच्छता की निगरानी, प्रदूषण की त्वरित
          रिपोर्टिंग और स्वयंसेवक प्रबंधन को एक आधुनिक, पारदर्शी मोबाइल ऐप से जोड़ने की हमारी योजना।
        </p>
      </section>

      {/* 2. Official Honest Status Box */}
      <section className="p-5 sm:p-6 rounded-2xl bg-sky-50 border-2 border-sky-200 text-sky-950 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-sky-200 text-sky-800 shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base text-sky-950">
                ऐप की वर्तमान स्थिति: विकास की प्रक्रिया में (Under Active Development)
              </span>
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-200 text-amber-900">
                शीघ्र उपलब्ध
              </span>
            </div>
            <p className="text-xs sm:text-sm text-sky-800 mt-1 leading-relaxed">
              * पारदर्शिता सूचना: ऐप का सार्वजनिक डाउनलोड लिंक अभी उपलब्ध नहीं है। अतः कोई भ्रामक या
              नकली डाउनलोड लिंक नहीं दिया गया है। जैसे ही ऐप Google Play Store पर उपलब्ध होगा, वास्तविक
              लिंक यहां सक्रिय कर दिया जाएगा।
            </p>
          </div>
        </div>

        {/* Buttons ready for future real links */}
        <div className="flex flex-col sm:flex-row gap-2 shrink-0">
          <button
            disabled
            className="px-4 py-2 rounded-xl bg-slate-200 text-slate-500 font-semibold text-xs border border-slate-300 cursor-not-allowed flex items-center justify-center gap-1.5"
            title="ऐप शीघ्र ही Google Play Store पर उपलब्ध होगा"
          >
            <span>Google Play Store</span>
            <span className="text-[10px] text-amber-700 font-normal">(शीघ्र)</span>
          </button>
          <button
            disabled
            className="px-4 py-2 rounded-xl bg-slate-200 text-slate-500 font-semibold text-xs border border-slate-300 cursor-not-allowed flex items-center justify-center gap-1.5"
            title="ऐप शीघ्र ही Apple App Store पर उपलब्ध होगा"
          >
            <span>Apple App Store</span>
            <span className="text-[10px] text-amber-700 font-normal">(शीघ्र)</span>
          </button>
        </div>
      </section>

      {/* 3. Core App Objectives */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
            प्रमुख विशेषताएं
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900">
            "नर्मदा प्रहरी" ऐप के मुख्य उद्देश्य एवं कार्यप्रणाली
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PRAHARI_APP_FEATURES.map((feat, index) => (
            <div
              key={index}
              className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-sky-400 hover:shadow-md transition-all space-y-3"
            >
              <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center font-bold text-sm">
                0{index + 1}
              </div>
              <h3 className="font-bold text-lg text-slate-900">{feat.title}</h3>
              <p className="text-xs font-semibold text-sky-700">{feat.english}</p>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {feat.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Interactive Prototype Simulator */}
      <section className="p-6 sm:p-10 rounded-3xl bg-slate-900 text-white shadow-xl space-y-8">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-medium">
            <CheckCircle2 className="w-4 h-4" />
            <span>इंटरएक्टिव प्रोटोटाइप डेमो (Simulator)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-heading">
            देखें नर्मदा प्रहरी ऐप कैसे कार्य करेगा
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            नीचे दिए गए सिमुलेटर में आप जांच सकते हैं कि एक नागरिक या स्वयंसेवक किस प्रकार नर्मदा नदी के प्रदूषण की रिपोर्ट दर्ज कर सकेगा:
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Simulation Form */}
          <div className="lg:col-span-7 bg-slate-800/90 p-6 rounded-2xl border border-slate-700 space-y-4">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <span>प्रदूषण रिपोर्टिंग का पूर्वाभ्यास</span>
            </h3>

            {simSubmitted ? (
              <div className="p-4 rounded-xl bg-emerald-900/80 border border-emerald-500 text-emerald-200 text-xs sm:text-sm space-y-2 animate-in fade-in">
                <div className="flex items-center gap-2 font-bold text-white">
                  <Check className="w-5 h-5 text-emerald-400" />
                  <span>रिपोर्ट सफलतापूर्वक सिमुलेट हो गई!</span>
                </div>
                <p>
                  रिपोर्ट आईडी: <strong>NP-DEMO-{Math.floor(1000 + Math.random() * 9000)}</strong>
                </p>
                <p className="text-slate-300 text-xs">
                  सत्यापन: जीपीएस अक्षांश-देशांतर दर्ज किए गए। स्वच्छता दल को सूचना प्रेषित।
                </p>
              </div>
            ) : (
              <form onSubmit={handleSimSubmit} className="space-y-4 text-xs sm:text-sm">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    प्रदूषण की श्रेणी चुनें:
                  </label>
                  <select
                    value={simReportType}
                    onChange={(e) => setSimReportType(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-hidden focus:border-sky-500"
                  >
                    <option value="प्लास्टिक कचरा जमाव">प्लास्टिक कचरा व पॉलीथीन जमाव</option>
                    <option value="अस्वच्छ घाट व पूजन अपशिष्ट">अस्वच्छ घाट व अनुपयोगी पूजन अपशिष्ट</option>
                    <option value="गंदे नाले या सीवेज का रिसाव">गंदे नाले या सीवेज का नदी में रिसाव</option>
                    <option value="तट पर अवैध कचरा डंपिंग">तट पर अवैध कचरा डंपिंग</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    संभावित घाट / तटवर्ती स्थान:
                  </label>
                  <input
                    type="text"
                    value={simLocation}
                    onChange={(e) => setSimLocation(e.target.value)}
                    placeholder="उदा. तिलवारा घाट, भेड़ाघाट, सेठानी घाट..."
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-hidden focus:border-sky-500"
                  />
                </div>

                <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-700 text-[11px] text-slate-400 flex items-center gap-2">
                  <Camera className="w-4 h-4 text-sky-400 shrink-0" />
                  <span>वास्तविक ऐप में: कैमरा फोटो व जीपीएस लोकेशन स्वतः संलग्न होगी।</span>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-sky-600 hover:from-emerald-700 hover:to-sky-700 text-white font-bold text-xs sm:text-sm transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>सिमुलेशन टेस्ट रिपोर्ट भेजें</span>
                </button>
              </form>
            )}
          </div>

          {/* Smartphone Visual Preview */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-64 sm:w-72 bg-slate-950 rounded-3xl p-4 border-4 border-slate-700 shadow-2xl space-y-3">
              <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800 pb-2">
                <span className="font-semibold text-emerald-400">नर्मदा प्रहरी</span>
                <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded">v0.1 प्रोटोटाइप</span>
              </div>
              <div className="p-3 rounded-xl bg-emerald-950/70 border border-emerald-600 text-xs space-y-1">
                <span className="text-[10px] text-emerald-300 font-bold uppercase">लाइव स्थिति</span>
                <div className="text-white font-semibold">घाट स्वच्छता सूचकांक: 92%</div>
                <div className="text-[11px] text-emerald-200">सफाई अभियान प्रगति पर है</div>
              </div>
              <div className="p-3 rounded-xl bg-sky-950/70 border border-sky-600 text-xs space-y-1">
                <span className="text-[10px] text-sky-300 font-bold uppercase">सक्रिय अलर्ट</span>
                <div className="text-white font-semibold">आगामी श्रमदान: शनिवार</div>
                <div className="text-[11px] text-sky-200">सुबह 07:00 बजे घाट पर</div>
              </div>
              <div className="p-2.5 text-center text-[10px] text-slate-500">
                माँ नर्मदा संरक्षण • स्वच्छ भारत
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Launch Notification Form */}
      <section className="p-8 rounded-3xl bg-emerald-50 border border-emerald-200 text-center max-w-3xl mx-auto space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-emerald-800 text-white flex items-center justify-center mx-auto">
          <BellRing className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold font-heading text-emerald-950">
          ऐप लॉन्च होते ही सबसे पहले सूचना प्राप्त करें
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
          अपना मोबाइल नंबर या ईमेल दर्ज करें। जैसे ही ऐप Google Play Store पर लाइव होगा, आपको सूचित कर दिया जाएगा।
        </p>

        {notifySuccess ? (
          <div className="p-3 bg-emerald-200/80 border border-emerald-400 text-emerald-900 rounded-xl text-xs sm:text-sm font-semibold max-w-md mx-auto">
            धन्यवाद! आपकी रुचि सुरक्षित रूप से दर्ज कर ली गई है।
          </div>
        ) : (
          <form
            onSubmit={handleNotifySubmit}
            className="flex flex-col sm:flex-row items-center gap-2 max-w-md mx-auto"
          >
            <input
              type="text"
              required
              value={notifyContact}
              onChange={(e) => setNotifyContact(e.target.value)}
              placeholder="आपका मोबाइल नंबर या ईमेल"
              className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs sm:text-sm focus:outline-hidden focus:border-emerald-600"
            />
            <button
              type="submit"
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs sm:text-sm whitespace-nowrap cursor-pointer transition-colors shadow-xs"
            >
              सूचित करें
            </button>
          </form>
        )}
      </section>
    </div>
  );
};
