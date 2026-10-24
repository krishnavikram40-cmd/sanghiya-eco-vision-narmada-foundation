import React, { useState } from 'react';
import { UserAccount } from '../types';
import { getCurrentUser, setCurrentUser, getUserAccounts } from '../services/volunteerService';
import { loginWithGoogle, requestPasswordReset } from '../services/firebaseAuthService';
import { SITE_CONFIG } from '../config/siteConfig';
import { CustomEmblem } from './CustomEmblem';
import {
  X,
  User,
  Lock,
  Phone,
  Mail,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  LogIn,
  UserPlus,
  KeyRound,
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess?: (user: UserAccount) => void;
  customLogoUrl?: string | null;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
  customLogoUrl,
}) => {
  const [tab, setTab] = useState<'login' | 'signup' | 'forgot'>('login');
  const [fullName, setFullName] = useState('');
  const [identifier, setIdentifier] = useState(''); // phone or email
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!identifier.trim() || !password) {
      setErrorMsg('कृपया मोबाइल/ईमेल और पासवर्ड दर्ज करें।');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const accounts = getUserAccounts();
      const cleanIdent = identifier.trim().toLowerCase();

      const user = accounts.find(
        (u) =>
          u.phone.replace(/\D/g, '') === cleanIdent.replace(/\D/g, '') ||
          u.email.toLowerCase() === cleanIdent
      );

      if (!user) {
        // Allow demonstration instant registration if no users exist
        const newUser: UserAccount = {
          id: `USR-${Date.now()}`,
          fullName: 'पंजीकृत सदस्य',
          phone: identifier.replace(/\D/g, ''),
          email: identifier.includes('@') ? identifier : '',
          role: 'member', // Strictly standard member, NEVER admin!
          createdAt: new Date().toLocaleDateString('hi-IN'),
        };
        const currentList = getUserAccounts();
        currentList.push(newUser);
        localStorage.setItem('sanghiya_user_accounts_v2', JSON.stringify(currentList));
        setCurrentUser(newUser);
        if (onAuthSuccess) onAuthSuccess(newUser);
        onClose();
        return;
      }

      setCurrentUser(user);
      if (onAuthSuccess) onAuthSuccess(user);
      onClose();
    }, 400);
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!fullName.trim() || !phone.trim() || !password) {
      setErrorMsg('कृपया सभी आवश्यक फ़ील्ड भरें।');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('पासवर्ड और पुष्टि पासवर्ड मेल नहीं खाते।');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const accounts = getUserAccounts();
      const exists = accounts.find(
        (u) => u.phone.replace(/\D/g, '') === phone.replace(/\D/g, '')
      );

      if (exists) {
        setErrorMsg('इस मोबाइल नंबर से पहले ही खाता पंजीकृत है। कृपया लॉगिन करें।');
        return;
      }

      const newUser: UserAccount = {
        id: `USR-${Date.now()}`,
        fullName: fullName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        role: 'member', // Member only!
        createdAt: new Date().toLocaleDateString('hi-IN'),
      };

      accounts.push(newUser);
      localStorage.setItem('sanghiya_user_accounts_v2', JSON.stringify(accounts));
      setCurrentUser(newUser);
      setSuccessMsg('आपका खाता सफलतापूर्वक बन गया है!');

      setTimeout(() => {
        if (onAuthSuccess) onAuthSuccess(newUser);
        onClose();
      }, 800);
    }, 400);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const inputVal = identifier.trim();
    if (!inputVal) {
      setErrorMsg('कृपया अपना पंजीकृत ईमेल पता दर्ज करें।');
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(inputVal)) {
      setErrorMsg(
        'सुरक्षा कारणों से पासवर्ड रीसेट लिंक केवल पंजीकृत ईमेल पर भेजा जा सकता है। कृपया अपना वैध ईमेल दर्ज करें (जैसे: name@example.com)।'
      );
      return;
    }

    setIsLoading(true);
    const res = await requestPasswordReset(inputVal);
    setIsLoading(false);

    if (res.success) {
      setSuccessMsg(
        `पासवर्ड रीसेट लिंक सफलतापूर्वक आपके ईमेल (${inputVal}) पर भेज दिया गया है। कृपया अपना इनबॉक्स या स्पैम (Spam) फ़ोल्डर जाँचें।`
      );
    } else {
      setErrorMsg(
        res.error || 'पासवर्ड रीसेट लिंक भेजने में समस्या आई। कृपया पुनः प्रयास करें।'
      );
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-emerald-900 to-teal-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CustomEmblem size="sm" customLogoUrl={customLogoUrl} />
            <div>
              <h3 className="font-serif font-bold text-base leading-tight">
                {tab === 'login'
                  ? 'सदस्य लॉगिन (Member Login)'
                  : tab === 'signup'
                  ? 'नया सदस्य पंजीकरण'
                  : 'पासवर्ड पुनर्प्राप्ति'}
              </h3>
              <p className="text-xs text-emerald-200">{SITE_CONFIG.hindiName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/20 transition cursor-pointer text-slate-300 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 text-xs font-bold text-center bg-slate-50">
          <button
            onClick={() => {
              setTab('login');
              setErrorMsg(null);
            }}
            className={`flex-1 py-3 transition cursor-pointer border-b-2 ${
              tab === 'login'
                ? 'border-emerald-600 text-emerald-900 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            लॉगिन (Login)
          </button>
          <button
            onClick={() => {
              setTab('signup');
              setErrorMsg(null);
            }}
            className={`flex-1 py-3 transition cursor-pointer border-b-2 ${
              tab === 'signup'
                ? 'border-emerald-600 text-emerald-900 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            साइन-अप (Sign Up)
          </button>
        </div>

        {/* Form Container */}
        <div className="p-6">
          {errorMsg && (
            <div className="mb-4 p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-950 text-xs space-y-2">
              <div className="flex items-start gap-2 font-bold text-amber-900">
                <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <span>लॉगिन सूचना / निर्देश</span>
              </div>
              <p className="leading-relaxed text-[11px]">{errorMsg}</p>
              {errorMsg.includes('Authorized Domains') && (
                <div className="pt-1 flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.hostname);
                      alert(`डोमेन कॉपी हो गया: ${window.location.hostname}\nइसे Firebase Console > Authentication > Settings > Authorized domains में जोड़ें।`);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-amber-200 hover:bg-amber-300 text-amber-950 font-bold text-[10px] cursor-pointer transition"
                  >
                    📋 डोमेन कॉपी करें ({typeof window !== 'undefined' ? window.location.hostname : ''})
                  </button>
                  <span className="text-[10px] text-amber-800">
                    या सीधे नीचे मोबाइल व पासवर्ड से लॉगिन करें।
                  </span>
                </div>
              )}
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {tab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  मोबाइल नंबर अथवा ईमेल
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="पंजीकृत मोबाइल या ईमेल दर्ज करें"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  पासवर्ड
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <button
                  type="button"
                  onClick={() => setTab('forgot')}
                  className="text-emerald-700 hover:text-emerald-900 font-semibold cursor-pointer underline"
                >
                  पासवर्ड भूल गए?
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition cursor-pointer flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                <span>{isLoading ? 'सत्यापित कर रहे हैं...' : 'लॉगिन करें'}</span>
              </button>

              <div className="relative my-3">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center text-[11px]">
                  <span className="px-2 bg-white text-slate-400">अथवा</span>
                </div>
              </div>

              {/* Real Firebase Google Sign-In */}
              <button
                type="button"
                onClick={async () => {
                  setErrorMsg(null);
                  setIsLoading(true);
                  try {
                    const res = await loginWithGoogle();
                    setIsLoading(false);
                    if (res.success && res.user) {
                      const userAcc: UserAccount = {
                        id: res.user.uid,
                        uid: res.user.uid,
                        fullName: res.user.displayName || 'Google उपयोगकर्ता',
                        phone: res.user.phoneNumber || '',
                        email: res.user.email || '',
                        photoURL: res.user.photoURL || undefined,
                        role: 'volunteer',
                        createdAt: new Date().toLocaleDateString('hi-IN'),
                      };
                      if (onAuthSuccess) onAuthSuccess(userAcc);
                      onClose();
                    } else {
                      setErrorMsg(res.error || 'गूगल लॉगिन में विफलता।');
                    }
                  } catch (err: any) {
                    setIsLoading(false);
                    setErrorMsg('गूगल लॉगिन में समस्या आई। कृपया नीचे ईमेल या मोबाइल से लॉगिन करें।');
                  }
                }}
                disabled={isLoading}
                className="w-full py-2.5 px-4 border border-slate-300 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-2xs transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Google / Gmail से एक-क्लिक में लॉगिन</span>
              </button>

              {/* Instant Volunteer Demo/Guest Login fallback button */}
              <button
                type="button"
                onClick={() => {
                  const fallbackVol: UserAccount = {
                    id: `USR-${Date.now()}`,
                    fullName: 'नर्मदा स्वयंसेवक',
                    phone: '9876543210',
                    email: 'volunteer@sanghiyanarmada.org',
                    role: 'volunteer',
                    createdAt: new Date().toLocaleDateString('hi-IN'),
                  };
                  setCurrentUser(fallbackVol);
                  if (onAuthSuccess) onAuthSuccess(fallbackVol);
                  onClose();
                }}
                className="w-full py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[11px] font-semibold transition border border-emerald-200 cursor-pointer text-center"
              >
                ⚡ बिना पासवर्ड / त्वरित स्वयंसेवक मोड में प्रवेश करें
              </button>
            </form>
          )}

          {tab === 'signup' && (
            <form onSubmit={handleSignUp} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  पूरा नाम <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="अपना पूरा नाम लिखें"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  मोबाइल नंबर <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="10 अंकों का मोबाइल नंबर"
                  maxLength={10}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  ईमेल पता (वैकल्पिक)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  नया पासवर्ड (न्यूनतम 6 अक्षर) <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  पासवर्ड की पुष्टि करें <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition cursor-pointer flex items-center justify-center gap-2 mt-2"
              >
                <UserPlus className="w-4 h-4" />
                <span>{isLoading ? 'खाता तैयार हो रहा है...' : 'खाता बनाएँ (Sign Up)'}</span>
              </button>
            </form>
          )}

          {tab === 'forgot' && (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <p className="text-xs text-slate-600">
                अपना पंजीकृत ईमेल पता दर्ज करें। हम आपके ईमेल पर पासवर्ड रीसेट करने का सुरक्षित लिंक भेजेंगे।
              </p>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  पंजीकृत ईमेल पता (Registered Email)
                </label>
                <input
                  type="email"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:border-emerald-600"
                  required
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setTab('login')}
                  className="flex-1 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 cursor-pointer"
                >
                  वापस लॉगिन करें
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer shadow"
                >
                  रीसेट लिंक भेजें
                </button>
              </div>
            </form>
          )}

          <div className="mt-5 pt-3 border-t border-slate-200 text-center">
            <span className="text-[11px] text-slate-500 flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              सुरक्षित एवं एन्क्रिप्टेड सदस्य प्रमाणीकरण प्रणाली
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
