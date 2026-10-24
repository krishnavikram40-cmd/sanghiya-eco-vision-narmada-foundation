import React, { useState, useEffect } from 'react';
import { PageId, UserAccount, InAppNotification } from '../types';
import { CustomEmblem } from './CustomEmblem';
import {
  LanguageCode,
  SUPPORTED_LANGUAGES,
  getTranslations,
} from '../data/translations';
import {
  getInAppNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
  setActiveMemberId,
} from '../services/volunteerService';
import {
  Menu,
  X,
  HeartHandshake,
  Search,
  Compass,
  Users,
  Smartphone,
  PhoneCall,
  Image,
  Info,
  ShieldAlert,
  Award,
  QrCode,
  ShieldCheck,
  Lock,
  Globe,
  FileCheck2,
  LogIn,
  LogOut,
  User,
  ChevronDown,
  Bell,
  BellRing,
  CheckCircle2,
} from 'lucide-react';

interface NavbarProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
  onOpenSeoGuide: () => void;
  customLogoUrl: string | null;
  currentLang: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  onOpenAuthModal: () => void;
  currentUser: UserAccount | null;
  onLogoutUser: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  onOpenSeoGuide,
  customLogoUrl,
  currentLang,
  onLanguageChange,
  onOpenAuthModal,
  currentUser,
  onLogoutUser,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState<InAppNotification[]>([]);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const t = getTranslations(currentLang);

  useEffect(() => {
    const refreshNotifications = () => {
      setNotifications(getInAppNotifications());
    };
    refreshNotifications();

    window.addEventListener('sanghiya-notifications-changed', refreshNotifications);
    return () => {
      window.removeEventListener('sanghiya-notifications-changed', refreshNotifications);
    };
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleNotificationClick = (notif: InAppNotification) => {
    markNotificationAsRead(notif.id);
    const targetId = notif.volunteerId || notif.targetVolunteerId;
    if (targetId) {
      setActiveMemberId(targetId);
      onNavigate('volunteer-profile');
    }
    setNotificationsOpen(false);
  };

  const handleMarkAllRead = () => {
    markAllNotificationsAsRead();
  };

  const navLinks: { id: PageId; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: t.navHome, icon: <Compass className="w-4 h-4" /> },
    { id: 'about', label: t.navAbout, icon: <Info className="w-4 h-4" /> },
    { id: 'campaigns', label: t.navCampaigns, icon: <HeartHandshake className="w-4 h-4" /> },
    { id: 'gallery', label: t.navGallery, icon: <Image className="w-4 h-4" /> },
    { id: 'narmada-prahari', label: t.navPrahari, icon: <Smartphone className="w-4 h-4" /> },
    { id: 'volunteer', label: t.navVolunteer, icon: <Users className="w-4 h-4" /> },
    {
      id: 'track-application',
      label: t.navTrack,
      icon: <FileCheck2 className="w-4 h-4 text-emerald-600" />,
    },
    {
      id: 'volunteer-profile',
      label: t.navProfile,
      icon: <Award className="w-4 h-4 text-amber-500" />,
    },
    {
      id: 'admin',
      label: t.navAdmin,
      icon: <ShieldCheck className="w-4 h-4 text-emerald-700" />,
    },
    { id: 'contact', label: t.navContact, icon: <PhoneCall className="w-4 h-4" /> },
  ];

  const handleLinkClick = (id: PageId) => {
    onNavigate(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentLangInfo =
    SUPPORTED_LANGUAGES.find((l) => l.code === currentLang) || SUPPORTED_LANGUAGES[0];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-xs">
      {/* Top Notice Bar */}
      <div className="bg-gradient-to-r from-emerald-900 via-sky-900 to-emerald-950 text-emerald-100 px-4 py-1.5 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            <span className="font-medium text-amber-200">{t.foundationName}</span>
            <span className="hidden md:inline text-emerald-300/60">|</span>
            <span className="hidden md:inline text-emerald-200/90 text-[11px]">
              {t.tagline}
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Language Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold border border-white/20 transition cursor-pointer"
                title="भाषा बदलें (Change Language)"
              >
                <Globe className="w-3 h-3 text-amber-300" />
                <span>{currentLangInfo.nativeName}</span>
                <ChevronDown className="w-3 h-3 text-slate-300" />
              </button>

              {langDropdownOpen && (
                <div
                  role="menu"
                  className="absolute right-0 mt-1 w-48 bg-white rounded-xl shadow-xl border border-slate-200 py-1 z-50 max-h-80 overflow-y-auto text-slate-800 text-xs animate-in fade-in zoom-in-95"
                >
                  <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                    भाषा चुनें (22 भारतीय भाषाएँ)
                  </div>
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        onLanguageChange(lang.code);
                        setLangDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-emerald-50 transition cursor-pointer ${
                        currentLang === lang.code
                          ? 'bg-emerald-50 text-emerald-900 font-bold'
                          : 'text-slate-700'
                      }`}
                    >
                      <span className="font-medium">{lang.nativeName}</span>
                      <span className="text-[10px] text-slate-400">{lang.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Certificate QR Verify Link */}
            <button
              onClick={() => handleLinkClick('verify-certificate')}
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-sky-500/20 hover:bg-sky-500/30 text-sky-200 border border-sky-400/40 text-[11px] font-medium transition-colors cursor-pointer"
              title="प्रमाणपत्र QR सत्यापन"
            >
              <QrCode className="w-3 h-3 text-sky-300" />
              <span>QR सत्यापन</span>
            </button>

            {/* Track Application Link */}
            <button
              onClick={() => handleLinkClick('track-application')}
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 border border-emerald-400/40 text-[11px] font-bold transition-colors cursor-pointer"
              title="आवेदन की स्थिति ट्रैक करें"
            >
              <FileCheck2 className="w-3 h-3 text-emerald-300" />
              <span>ट्रैक स्थिति</span>
            </button>

            {/* In-App Notifications Bell */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-400/20 hover:bg-amber-400/30 text-amber-200 border border-amber-400/40 text-[11px] font-bold transition cursor-pointer"
                title="संस्थागत सूचनाएं (Notifications)"
              >
                {unreadCount > 0 ? (
                  <BellRing className="w-3.5 h-3.5 text-amber-300 animate-bounce" />
                ) : (
                  <Bell className="w-3.5 h-3.5 text-amber-300" />
                )}
                <span>सूचना</span>
                {unreadCount > 0 && (
                  <span className="ml-0.5 px-1.5 py-0.2 rounded-full bg-amber-400 text-slate-950 font-black text-[10px] leading-tight shadow-xs">
                    {unreadCount}
                  </span>
                )}
              </button>

              {notificationsOpen && (
                <div
                  role="dialog"
                  className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 z-50 text-slate-800 text-xs animate-in fade-in zoom-in-95"
                >
                  <div className="px-4 py-2.5 flex items-center justify-between border-b border-slate-100 bg-slate-50/70 rounded-t-xl">
                    <div className="flex items-center gap-1.5 font-heading font-black text-slate-900 text-xs sm:text-sm">
                      <Bell className="w-4 h-4 text-emerald-700" />
                      <span>संस्थागत सूचनाएं ({notifications.length})</span>
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkAllRead}
                        className="text-[11px] font-bold text-emerald-700 hover:underline cursor-pointer"
                      >
                        सभी पढ़े गए चिह्नित करें
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center text-slate-400">
                        <Bell className="w-8 h-8 mx-auto text-slate-300 mb-2 opacity-50" />
                        <p className="text-xs">कोई नई सूचना उपलब्ध नहीं है।</p>
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => handleNotificationClick(notif)}
                          className={`p-3.5 hover:bg-slate-50 transition cursor-pointer flex gap-3 ${
                            !notif.isRead ? 'bg-amber-50/70' : ''
                          }`}
                        >
                          <div className="shrink-0 mt-0.5">
                            {notif.type === 'approval' ? (
                              <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                                <CheckCircle2 className="w-4 h-4" />
                              </div>
                            ) : (
                              <div className="w-7 h-7 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center">
                                <Info className="w-4 h-4" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-bold text-slate-900 text-xs">{notif.title}</span>
                              {!notif.isRead && (
                                <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0"></span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-600 leading-relaxed font-normal">
                              {notif.message}
                            </p>
                            {notif.memberId && (
                              <span className="inline-block px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 font-mono text-[10px] font-bold">
                                सदस्य ID: {notif.memberId}
                              </span>
                            )}
                            <div className="text-[10px] text-slate-400 font-mono pt-0.5">
                              {new Date(notif.createdAt).toLocaleDateString('hi-IN', {
                                day: 'numeric',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="px-4 py-2 border-t border-slate-100 bg-slate-50 rounded-b-xl flex items-center justify-between text-[11px]">
                    <button
                      onClick={() => {
                        onNavigate('volunteer-profile');
                        setNotificationsOpen(false);
                      }}
                      className="text-emerald-800 font-bold hover:underline cursor-pointer"
                    >
                      सदस्य प्रोफाइल खोलें →
                    </button>
                    <button
                      onClick={() => setNotificationsOpen(false)}
                      className="text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      बंद करें
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand Identity */}
          <button
            onClick={() => handleLinkClick('home')}
            className="flex items-center gap-3 text-left group cursor-pointer focus:outline-hidden"
          >
            <CustomEmblem customLogoUrl={customLogoUrl} size="md" />
            <div>
              <span className="block font-heading text-lg sm:text-xl font-bold text-emerald-950 leading-tight group-hover:text-emerald-700 transition-colors">
                {t.foundationName}
              </span>
              <span className="block text-[11px] sm:text-xs font-medium text-sky-800 tracking-wide">
                Sanghiya Eco-Vision Narmada Foundation
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden 2xl:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = currentPage === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleLinkClick(link.id)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-emerald-800 text-white shadow-xs font-semibold'
                      : 'text-slate-700 hover:text-emerald-800 hover:bg-emerald-50'
                  }`}
                >
                  {link.icon}
                  <span>{link.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Compact Desktop Navigation Links for xl screens */}
          <nav className="hidden xl:flex 2xl:hidden items-center gap-1">
            {navLinks.slice(0, 7).map((link) => {
              const isActive = currentPage === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleLinkClick(link.id)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1 ${
                    isActive
                      ? 'bg-emerald-800 text-white shadow-xs font-semibold'
                      : 'text-slate-700 hover:text-emerald-800 hover:bg-emerald-50'
                  }`}
                >
                  <span>{link.label}</span>
                </button>
              );
            })}
            <button
              onClick={() => handleLinkClick('officer-login')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1 ${
                currentPage === 'officer-login' || currentPage === 'officer-dashboard'
                  ? 'bg-sky-800 text-white shadow-xs font-semibold'
                  : 'text-slate-700 hover:text-sky-800 hover:bg-sky-50'
              }`}
              title="फाउंडेशन अधिकारी पोर्टल"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
              <span>अधिकारी</span>
            </button>
            <button
              onClick={() => handleLinkClick('admin')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1 ${
                currentPage === 'admin'
                  ? 'bg-emerald-800 text-white shadow-xs font-semibold'
                  : 'text-slate-700 hover:text-emerald-800 hover:bg-emerald-50'
              }`}
            >
              <Lock className="w-3.5 h-3.5 text-emerald-600" />
              <span>एडमिन</span>
            </button>
          </nav>

          {/* Action CTAs & Auth */}
          <div className="flex items-center gap-2">
            {/* Member Auth Button */}
            {currentUser ? (
              <div className="hidden sm:flex items-center gap-2">
                <span className="px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs font-bold flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{currentUser.fullName}</span>
                </span>
                <button
                  onClick={onLogoutUser}
                  className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800 cursor-pointer"
                  title="लॉगआउट"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-full border border-emerald-300 hover:bg-emerald-50 text-emerald-900 font-semibold text-xs cursor-pointer transition shadow-2xs"
                title="सदस्य लॉगिन अथवा खाता बनाएँ"
              >
                <LogIn className="w-3.5 h-3.5 text-emerald-700" />
                <span>{t.navLogin}</span>
              </button>
            )}

            <button
              onClick={() => handleLinkClick('volunteer')}
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-600 to-sky-600 hover:from-emerald-700 hover:to-sky-700 text-white font-medium text-xs shadow-sm transition-all hover:shadow-md cursor-pointer border border-emerald-400/30"
            >
              <Users className="w-4 h-4" />
              <span>{t.navVolunteer}</span>
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-lg text-slate-700 hover:text-emerald-800 hover:bg-emerald-50 cursor-pointer focus:outline-hidden"
              aria-label="नेविगेशन मेनू खोलें या बंद करें"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-emerald-100 bg-white px-4 pt-3 pb-6 shadow-lg animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="space-y-1 mb-4">
            {navLinks.map((link) => {
              const isActive = currentPage === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleLinkClick(link.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer text-left ${
                    isActive
                      ? 'bg-emerald-800 text-white font-semibold'
                      : 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-800'
                  }`}
                >
                  <span className={isActive ? 'text-white' : 'text-emerald-600'}>
                    {link.icon}
                  </span>
                  <span>{link.label}</span>
                </button>
              );
            })}

            {/* Mobile Member Login */}
            {!currentUser && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuthModal();
                }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer text-left text-slate-700 hover:bg-emerald-50 hover:text-emerald-800"
              >
                <LogIn className="w-4 h-4 text-emerald-600" />
                <span>{t.navLogin}</span>
              </button>
            )}

            {/* Mobile Officer Login */}
            <button
              onClick={() => handleLinkClick('officer-login')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer text-left ${
                currentPage === 'officer-login' || currentPage === 'officer-dashboard'
                  ? 'bg-sky-800 text-white font-semibold'
                  : 'text-sky-800 hover:bg-sky-50'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-sky-600" />
              <span>अधिकारी लॉगिन (Officer Portal)</span>
            </button>
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={() => handleLinkClick('volunteer')}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-emerald-700 to-sky-700 text-white font-semibold shadow-xs cursor-pointer text-sm"
            >
              <Users className="w-4 h-4" />
              <span>{t.navVolunteer}</span>
            </button>

            <button
              onClick={() => handleLinkClick('track-application')}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-300 font-semibold shadow-2xs cursor-pointer text-xs"
            >
              <FileCheck2 className="w-4 h-4 text-emerald-700" />
              <span>{t.navTrack}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
