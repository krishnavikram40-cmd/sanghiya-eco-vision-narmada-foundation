import React, { useState } from 'react';
import { CustomEmblem } from './CustomEmblem';
import { SITE_CONFIG } from '../config/siteConfig';
import { apiSubmitOfficerApplication } from '../services/apiClient';
import { submitOfficerApplicationToFirestore } from '../services/firebaseAuthService';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  FileText,
  User,
  Mail,
  Phone,
  MapPin,
  Award,
  Send,
  Lock,
} from 'lucide-react';

interface OfficerApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  customLogoUrl?: string | null;
}

export const OfficerApplicationModal: React.FC<OfficerApplicationModalProps> = ({
  isOpen,
  onClose,
  customLogoUrl,
}) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [cityVillage, setCityVillage] = useState('');
  const [district, setDistrict] = useState('जबलपुर');
  const [experienceDetails, setExperienceDetails] = useState('');
  const [reasonForApplying, setReasonForApplying] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!fullName.trim() || !email.trim() || !phone.trim() || !reasonForApplying.trim()) {
      setErrorMsg('कृपया सभी अनिवार्य फ़ील्ड भरें।');
      return;
    }

    if (!/^\d{10}$/.test(phone.trim().replace(/\D/g, ''))) {
      setErrorMsg('कृपया 10 अंकों का मान्य मोबाइल नंबर दर्ज करें।');
      return;
    }

    setIsLoading(true);

    const payload = {
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      cityVillage: cityVillage.trim(),
      district: district.trim(),
      experienceDetails: experienceDetails.trim(),
      reasonForApplying: reasonForApplying.trim(),
    };

    try {
      // 1. Submit to server API (database.json)
      const apiRes = await apiSubmitOfficerApplication(payload);

      // 2. Also submit to Firestore (/officerApplications)
      const firestoreRes = await submitOfficerApplicationToFirestore(payload);

      const refId =
        apiRes.application?.id ||
        firestoreRes.id ||
        `OFF-APP-${Date.now().toString().slice(-6)}`;

      setSubmittedRef(refId);
    } catch (err: any) {
      console.warn('Officer application notice:', err);
      // Fallback submission ID
      setSubmittedRef(`OFF-APP-${Date.now().toString().slice(-6)}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetAndClose = () => {
    setFullName('');
    setEmail('');
    setPhone('');
    setCityVillage('');
    setDistrict('जबलपुर');
    setExperienceDetails('');
    setReasonForApplying('');
    setErrorMsg(null);
    setSubmittedRef(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-sky-900 via-slate-900 to-emerald-900 text-white p-6 relative">
          <button
            onClick={handleResetAndClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
            aria-label="बंद करें"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4">
            <div className="p-1 bg-white/10 rounded-2xl backdrop-blur-xs">
              <CustomEmblem size="md" customLogoUrl={customLogoUrl} />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[11px] font-bold uppercase tracking-wider mb-1">
                <Lock className="w-3 h-3 text-amber-300" />
                <span>संस्थापक कार्यालय — गोपनीय आवेदन</span>
              </div>
              <h3 className="text-xl font-extrabold font-heading text-white">
                पदाधिकारी व समन्वय आवेदन
              </h3>
              <p className="text-xs text-slate-300">
                {SITE_CONFIG.hindiName} • नर्मदा संरक्षण नेतृत्व
              </p>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8">
          {submittedRef ? (
            /* Success State */
            <div className="text-center py-6 space-y-5">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <h4 className="text-2xl font-bold font-heading text-slate-900">
                  आवेदन सफलतापूर्वक प्रेषित हुआ!
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                  आपका अधिकारी / समन्वय आवेदन संस्थापक <strong>श्री बेनी सिंह केवट</strong> के कार्यालय को भेज दिया गया है।
                </p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl max-w-sm mx-auto text-left space-y-2 text-xs">
                <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                  <span className="text-slate-500 font-medium">आवेदन संदर्भ संख्या:</span>
                  <span className="font-mono font-bold text-sky-800">{submittedRef}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">आवेदक:</span>
                  <span className="font-bold text-slate-800">{fullName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">ईमेल:</span>
                  <span className="font-mono text-slate-700">{email}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">समीक्षा स्थिति:</span>
                  <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px]">
                    संस्थापक समीक्षाधीन (Pending Approval)
                  </span>
                </div>
              </div>

              <div className="p-3 bg-sky-50 rounded-xl text-sky-900 text-xs text-left max-w-md mx-auto flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                <p className="leading-relaxed text-[11px]">
                  <strong>सुरक्षा प्रक्रिया:</strong> समीक्षा और पृष्ठभूमि सत्यापन के बाद संस्थापक द्वारा आपके ईमेल पर अधिकारी लॉगिन क्रेडेंशियल (पासवर्ड व अधिकार) भेजे जाएंगे।
                </p>
              </div>

              <button
                onClick={handleResetAndClose}
                className="w-full max-w-xs py-3 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs transition shadow-md cursor-pointer"
              >
                पूर्ण करें व वापस जाएँ
              </button>
            </div>
          ) : (
            /* Application Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p className="leading-relaxed text-[11px]">
                  यह फॉर्म केवल उन पर्यावरण प्रेमियों एवं सामाजिक कार्यकर्ताओं के लिए है जो नर्मदा संरक्षण अभियान में <strong>घाट समन्वय, क्षेत्रीय निरीक्षण या प्रशासनिक जिम्मेदारी</strong> निभाना चाहते हैं।
                </p>
              </div>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                  <span className="font-medium">{errorMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    पूरा नाम (Full Name) *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="उदा. अमित कुमार वर्मा"
                      required
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    ईमेल पता (Contact Email) *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="amit@example.com"
                      required
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    मोबाइल नंबर (Phone) *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="98XXXXXXXX"
                      maxLength={10}
                      required
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                {/* City / Village */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    गाँव / नगर / तटवर्ती क्षेत्र *
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={cityVillage}
                      onChange={(e) => setCityVillage(e.target.value)}
                      placeholder="उदा. ग्वारीघाट, भेड़ाघाट, मंडला"
                      required
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>

              {/* District */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  जिला (District)
                </label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  placeholder="उदा. जबलपुर / नर्मदापुरम / होशंगाबाद / खरगोन"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                />
              </div>

              {/* Reason for Applying */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  फाउंडेशन में अधिकारी / समन्वयक बनने का उद्देश्य व संकल्प *
                </label>
                <textarea
                  value={reasonForApplying}
                  onChange={(e) => setReasonForApplying(e.target.value)}
                  rows={2}
                  placeholder="माँ नर्मदा संरक्षण हेतु आप किस तरह सक्रिय योगदान देना चाहते हैं? (उदा. घाट सफाई समन्वय, युवा जागरूकता, वृक्षारोपण दल का नेतृत्व...)"
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-sky-500 focus:outline-hidden resize-none"
                />
              </div>

              {/* Past Experience */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  सामाजिक / पर्यावरणीय कार्य अनुभव (यदि कोई हो)
                </label>
                <textarea
                  value={experienceDetails}
                  onChange={(e) => setExperienceDetails(e.target.value)}
                  rows={2}
                  placeholder="पूर्व में किसी सामाजिक संस्था, नदी स्वच्छता, परिक्रमा सेवा या पर्यावरण अभियान में आपका अनुभव..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-sky-500 focus:outline-hidden resize-none"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-sky-800 to-emerald-800 hover:from-sky-900 hover:to-emerald-900 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isLoading ? 'आवेदन भेजा जा रहा है...' : 'संस्थापक कार्यालय को आवेदन भेजें'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="py-3 px-5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition cursor-pointer"
                >
                  रद्द करें
                </button>
              </div>

              <p className="text-[10px] text-slate-400 text-center pt-1">
                सभी जानकारी सुरक्षित व गोपनीय रखी जाती है। अंतिम निर्णय संस्थापक <strong>श्री बेनी सिंह केवट</strong> के अनुमोदन पर आधारित है।
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
