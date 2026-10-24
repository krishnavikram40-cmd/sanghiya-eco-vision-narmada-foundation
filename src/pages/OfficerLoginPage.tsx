import React, { useState } from 'react';
import { PageId } from '../types';
import { CustomEmblem } from '../components/CustomEmblem';
import { OfficerApplicationModal } from '../components/OfficerApplicationModal';
import { SITE_CONFIG } from '../config/siteConfig';
import {
  loginOfficerWithEmail,
  requestPasswordReset,
  FirebaseUserProfile,
} from '../services/firebaseAuthService';
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  Mail,
  KeyRound,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  FileText,
} from 'lucide-react';

interface OfficerLoginPageProps {
  onNavigate: (page: PageId) => void;
  onLoginSuccess: (profile: FirebaseUserProfile) => void;
  customLogoUrl: string | null;
}

export const OfficerLoginPage: React.FC<OfficerLoginPageProps> = ({
  onNavigate,
  onLoginSuccess,
  customLogoUrl,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [forgotSent, setForgotSent] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');

  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email.trim() || !password) {
      setErrorMsg('कृपया आधिकारिक ईमेल और पासवर्ड दर्ज करें।');
      return;
    }

    setIsLoading(true);
    const res = await loginOfficerWithEmail(email, password);
    setIsLoading(false);

    if (res.success && res.profile) {
      onLoginSuccess(res.profile);
      onNavigate('officer-dashboard');
    } else {
      setErrorMsg(res.error || 'अधिकारी लॉगिन में विफलता।');
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) {
      setErrorMsg('कृपया अपना ईमेल दर्ज करें।');
      return;
    }
    setIsLoading(true);
    const res = await requestPasswordReset(forgotEmail);
    setIsLoading(false);
    if (res.success) {
      setForgotSent(true);
    } else {
      setErrorMsg(res.error || 'पासवर्ड रीसेट लिंक नहीं भेजा जा सका।');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-100 via-slate-50 to-white">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl shadow-xl border border-slate-200">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <CustomEmblem size="lg" customLogoUrl={customLogoUrl} />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 text-sky-900 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5 text-sky-700" />
            <span>फाउंडेशन अधिकारी पोर्टल (Officer Portal)</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900">
            अधिकारी लॉगिन (Officer Login)
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            {SITE_CONFIG.hindiName} • अधिकृत समीक्षा व अनुमोदन नियंत्रण
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <span className="flex-1 font-medium">{errorMsg}</span>
          </div>
        )}

        {/* Forgot Password Confirmation */}
        {forgotSent ? (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>पासवर्ड रीसेट लिंक भेजा गया</span>
            </div>
            <p>
              आपके ईमेल पर पासवर्ड रीसेट का लिंक भेज दिया गया है। कृपया अपना इनबॉक्स जांचें।
            </p>
            <button
              onClick={() => {
                setForgotSent(false);
                setShowForgot(false);
              }}
              className="text-emerald-700 underline font-bold mt-2 cursor-pointer"
            >
              लॉगिन पर वापस जाएँ
            </button>
          </div>
        ) : showForgot ? (
          /* Forgot Password Form */
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                आधिकारिक ईमेल (Registered Officer Email)
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="officer@sanghiyanarmada.org"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded-xl bg-sky-700 text-white font-bold text-xs hover:bg-sky-800 transition shadow-md cursor-pointer disabled:opacity-50"
            >
              {isLoading ? 'भेज रहे हैं...' : 'रीसेट लिंक भेजें'}
            </button>

            <button
              type="button"
              onClick={() => setShowForgot(false)}
              className="w-full text-center text-xs text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              लॉगिन स्क्रीन पर वापस जाएँ
            </button>
          </form>
        ) : (
          /* Standard Login Form */
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                आधिकारिक ईमेल (Officer Email)
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="officer@sanghiyanarmada.org"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-bold text-slate-700">
                  पासवर्ड (Password)
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgot(true)}
                  className="text-[11px] font-semibold text-sky-700 hover:underline cursor-pointer"
                >
                  पासवर्ड भूल गए?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-700 to-emerald-800 text-white font-bold text-sm hover:from-sky-800 hover:to-emerald-900 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{isLoading ? 'सत्यापन हो रहा है...' : 'अधिकारी लॉगिन करें'}</span>
            </button>
          </form>
        )}

        {/* Discreet Officer Application Invitation */}
        <div className="pt-4 border-t border-slate-100 text-center space-y-2">
          <p className="text-[11px] text-slate-500">
            सुरक्षा सूचना: केवल संस्थापक/सुपर एडमिन द्वारा अधिकृत व नियुक्त अधिकारी ही इस पोर्टल का उपयोग कर सकते हैं।
          </p>
          <div className="p-3 bg-sky-50/70 border border-sky-100 rounded-xl text-center">
            <p className="text-xs text-sky-900 font-medium">
              क्या आप नर्मदा संरक्षण हेतु पदाधिकारी / समन्वय पद के लिए आवेदन करना चाहते हैं?
            </p>
            <button
              type="button"
              onClick={() => setIsApplyModalOpen(true)}
              className="mt-1.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-sky-700 hover:bg-sky-800 text-white text-[11px] font-bold shadow-xs transition cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>संस्थापक कार्यालय को आवेदन भेजें</span>
            </button>
          </div>

          <div className="flex justify-center gap-4 text-xs font-semibold pt-2">
            <button
              onClick={() => onNavigate('home')}
              className="text-emerald-800 hover:underline cursor-pointer"
            >
              मुख्य पृष्ठ
            </button>
            <span className="text-slate-300">•</span>
            <button
              onClick={() => onNavigate('admin')}
              className="text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              मुख्य एडमिन पैनल
            </button>
          </div>
        </div>

        {/* Restricted Officer Application Modal */}
        <OfficerApplicationModal
          isOpen={isApplyModalOpen}
          onClose={() => setIsApplyModalOpen(false)}
          customLogoUrl={customLogoUrl}
        />
      </div>
    </div>
  );
};
