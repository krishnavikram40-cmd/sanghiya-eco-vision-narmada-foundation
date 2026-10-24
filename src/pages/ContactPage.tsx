import React, { useState } from 'react';
import { FOUNDATION_INFO } from '../data/foundationData';
import { ContactMessage } from '../types';
import {
  MapPin,
  Mail,
  Phone,
  Send,
  CheckCircle2,
  Share2,
  Clock,
  Sparkles,
  Info,
  ShieldCheck,
  Edit3,
  Globe,
} from 'lucide-react';

interface ContactPageProps {
  customPhone: string;
  setCustomPhone: (val: string) => void;
  customEmail: string;
  setCustomEmail: (val: string) => void;
  customAddress: string;
  setCustomAddress: (val: string) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({
  customPhone,
  setCustomPhone,
  customEmail,
  setCustomEmail,
  customAddress,
  setCustomAddress,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sentSuccess, setSentSuccess] = useState(false);
  const [showEditor, setShowEditor] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    const newMsg: ContactMessage = {
      id: `MSG-${Date.now().toString().slice(-5)}`,
      name: name.trim(),
      phone: phone.trim() || 'अनुपलब्ध',
      email: email.trim() || 'अनुपलब्ध',
      subject: subject.trim() || 'सामान्य सुझाव/पूछताछ',
      message: message.trim(),
      sentAt: new Date().toLocaleString('hi-IN'),
    };

    // Save inquiry locally
    const existing = JSON.parse(localStorage.getItem('sanghiya_narmada_inquiries') || '[]');
    existing.unshift(newMsg);
    localStorage.setItem('sanghiya_narmada_inquiries', JSON.stringify(existing));

    setSentSuccess(true);
    setName('');
    setPhone('');
    setEmail('');
    setSubject('');
    setMessage('');
    setTimeout(() => setSentSuccess(false), 5000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16">
      {/* 1. Header */}
      <section className="text-center max-w-4xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-900 text-xs sm:text-sm font-semibold">
          <Mail className="w-4 h-4 text-emerald-700" />
          <span>संवाद व संपर्क केंद्र</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading text-slate-900 leading-tight">
          संपर्क करें — संघीय इको-विजन नर्मदा फाउंडेशन
        </h1>
        <p className="text-sm sm:text-base font-medium text-sky-800">
          {FOUNDATION_INFO.englishName}
        </p>
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
          माँ नर्मदा संरक्षण, घाट सफाई अभियानों, नर्मदा प्रहरी ऐप या सहयोग के संबंध में अपने विचार,
          सुझाव या प्रश्न हमें भेजें।
        </p>
      </section>

      {/* 2. Transparency Notice on Contact Details */}
      <section className="p-4 sm:p-5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 flex flex-col sm:flex-row items-start justify-between gap-4">
        <div className="space-y-1 text-xs sm:text-sm">
          <span className="font-bold text-amber-900 block">संपर्क विवरण नीति:</span>
          <span className="text-amber-800">
            आपके निर्देशानुसार हमने कोई भी काल्पनिक फोन नंबर, ईमेल या पता नहीं बनाया है। नीचे दिए गए
            कार्डों में वास्तविक विवरण जोड़ने हेतु स्थान (Placeholders) निर्धारित हैं। आप "विवरण संपादित करें" बटन से अभी अपनी वास्तविक जानकारी जोड़कर देख सकते हैं।
          </span>
        </div>
        <button
          onClick={() => setShowEditor(!showEditor)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-800 hover:bg-amber-900 text-white text-xs font-semibold shrink-0 cursor-pointer transition-colors"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>{showEditor ? 'संपादक बंद करें' : 'विवरण संपादित करें'}</span>
        </button>
      </section>

      {/* Interactive Editor Drawer (if opened) */}
      {showEditor && (
        <section className="p-6 rounded-2xl bg-white border-2 border-emerald-500 shadow-md space-y-4 animate-in fade-in">
          <h3 className="font-bold text-base text-slate-900">
            फाउंडेशन के संपर्क विवरण भरें (लाइव पूर्वावलोकन)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">आधिकारिक फोन / हेल्पलाइन:</label>
              <input
                type="text"
                value={customPhone}
                onChange={(e) => setCustomPhone(e.target.value)}
                placeholder="+91-XXXXXXXXXX"
                className="w-full px-3 py-2 rounded-lg border border-slate-300"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">आधिकारिक ईमेल आईडी:</label>
              <input
                type="email"
                value={customEmail}
                onChange={(e) => setCustomEmail(e.target.value)}
                placeholder="contact@narmadafoundation.org"
                className="w-full px-3 py-2 rounded-lg border border-slate-300"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">आधिकारिक पता / कार्यक्षेत्र:</label>
              <input
                type="text"
                value={customAddress}
                onChange={(e) => setCustomAddress(e.target.value)}
                placeholder="नर्मदा तट, मध्य प्रदेश, भारत"
                className="w-full px-3 py-2 rounded-lg border border-slate-300"
              />
            </div>
          </div>
          <p className="text-[11px] text-slate-500">
            * यह जानकारी तुरंत नीचे दिए गए संपर्क कार्डों में दिखने लगेगी।
          </p>
        </section>
      )}

      {/* 3. Contact Info Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Address Card */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
            <MapPin className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg text-slate-900">कार्यालय व कार्यक्षेत्र</h3>
          <div className="text-xs sm:text-sm text-slate-600 leading-relaxed min-h-[48px]">
            {customAddress ? (
              <span className="font-medium text-slate-900">{customAddress}</span>
            ) : (
              <span className="text-slate-400 italic">
                [आधिकारिक कार्यालय का पता यहां जोड़ा जाएगा — नर्मदा तटवर्ती क्षेत्र, मध्य प्रदेश]
              </span>
            )}
          </div>
          <div className="pt-2 text-[11px] text-emerald-700 font-medium">
            कार्यक्षेत्र: अमरकंटक से भरूच तक संपूर्ण नर्मदा घाटी
          </div>
        </div>

        {/* Email Card */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center">
            <Mail className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg text-slate-900">ईमेल पता</h3>
          <div className="text-xs sm:text-sm text-slate-600 min-h-[48px]">
            {customEmail ? (
              <a href={`mailto:${customEmail}`} className="font-medium text-sky-700 hover:underline">
                {customEmail}
              </a>
            ) : (
              <span className="text-slate-400 italic">
                [आधिकारिक ईमेल पता यहां जोड़ा जाएगा]
              </span>
            )}
          </div>
          <div className="pt-2 text-[11px] text-sky-700 font-medium">
            अभियानों एवं स्वयंसेवक पूछताछ हेतु
          </div>
        </div>

        {/* Phone Card */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
            <Phone className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg text-slate-900">फोन / हेल्पलाइन</h3>
          <div className="text-xs sm:text-sm text-slate-600 min-h-[48px]">
            {customPhone ? (
              <span className="font-medium text-slate-900">{customPhone}</span>
            ) : (
              <span className="text-slate-400 italic">
                [आधिकारिक फोन नंबर यहां जोड़ा जाएगा]
              </span>
            )}
          </div>
          <div className="pt-2 text-[11px] text-amber-700 font-medium">
            सोमवार से शनिवार: प्रातः 09:00 से सायं 06:00
          </div>
        </div>
      </section>

      {/* 4. Contact Inquiry Form */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-xl font-bold font-heading text-slate-900">
              हमें संदेश या सुझाव भेजें
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              नर्मदा संरक्षण के संबंध में आपके सुझाव हमारे लिए अत्यंत मूल्यवान हैं।
            </p>
          </div>

          {sentSuccess && (
            <div className="p-4 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
              <span>आपका संदेश सफलतापूर्वक स्थानीय रूप से दर्ज कर लिया गया है। धन्यवाद!</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  आपका नाम <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="उदा. अमित पटेल"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  मोबाइल नंबर
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="10 अंकों का फोन नंबर"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:border-emerald-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">ईमेल पता</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="yourname@domain.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">विषय (Subject)</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="उदा. घाट सफाई अभियान / सुझाव"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:border-emerald-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                संदेश (Message) <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="यहाँ अपना संदेश या विचार लिखें..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:border-emerald-600"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>संदेश भेजें</span>
            </button>
          </form>
        </div>

        {/* Social Media Slots & Geographic Reach */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-4">
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <Share2 className="w-5 h-5 text-sky-600" />
              <span>सोशल मीडिया संपर्क लिंक (स्थान)</span>
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              फाउंडेशन के आधिकारिक सोशल मीडिया पेज स्थापित होने पर उनके वास्तविक लिंक यहां जोड़े जाएंगे:
            </p>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-lg bg-white border border-slate-200 flex justify-between items-center">
                <span className="font-semibold text-slate-800">Facebook Page:</span>
                <span className="text-slate-400 italic text-[11px]">[पेज लिंक स्थान]</span>
              </div>
              <div className="p-2.5 rounded-lg bg-white border border-slate-200 flex justify-between items-center">
                <span className="font-semibold text-slate-800">YouTube Channel:</span>
                <span className="text-slate-400 italic text-[11px]">[चैनल लिंक स्थान]</span>
              </div>
              <div className="p-2.5 rounded-lg bg-white border border-slate-200 flex justify-between items-center">
                <span className="font-semibold text-slate-800">Instagram Handle:</span>
                <span className="text-slate-400 italic text-[11px]">[प्रोफाइल लिंक स्थान]</span>
              </div>
              <div className="p-2.5 rounded-lg bg-white border border-slate-200 flex justify-between items-center">
                <span className="font-semibold text-slate-800">X (Twitter):</span>
                <span className="text-slate-400 italic text-[11px]">[हैंडल लिंक स्थान]</span>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-emerald-950 text-white space-y-3">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <Globe className="w-4 h-4" />
              <span>नर्मदा घाटी भौगोलिक कवरेज</span>
            </div>
            <h4 className="font-bold text-base font-heading">
              उद्गम से सागर संगम तक का विस्तार
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              हमारा लक्ष्य माँ नर्मदा के 1,312 किलोमीटर लंबे प्रवाह के प्रमुख घाटों— अमरकंटक, डिंडोरी,
              मंडला, जबलपुर (भेड़ाघाट/गौरीघाट), नरसिंहपुर (बरमान घाट), नर्मदापुरम (सेठानी घाट), हरदा
              (हंडिया), ओंकारेश्वर, महेश्वर, बड़वानी, और भरूच तक पर्यावरण संरक्षण दलों को सक्रिय करना है।
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
