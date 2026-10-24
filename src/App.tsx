import React, { useState, useEffect } from 'react';
import { PageId, UserAccount } from './types';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { SeoGuideModal } from './components/SeoGuideModal';
import { AuthModal } from './components/AuthModal';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { CampaignsPage } from './pages/CampaignsPage';
import { GalleryPage } from './pages/GalleryPage';
import { NarmadaPrahariPage } from './pages/NarmadaPrahariPage';
import { VolunteerPage } from './pages/VolunteerPage';
import { VolunteerProfilePage } from './pages/VolunteerProfilePage';
import { TrackApplicationPage } from './pages/TrackApplicationPage';
import { CertificateVerifyPage } from './pages/CertificateVerifyPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { OfficerLoginPage } from './pages/OfficerLoginPage';
import { OfficerDashboardPage } from './pages/OfficerDashboardPage';
import { ContactPage } from './pages/ContactPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { FOUNDATION_INFO } from './data/foundationData';
import { LanguageCode } from './data/translations';
import {
  getPermanentLogo,
  savePermanentLogo,
  getCurrentUser,
  setCurrentUser,
} from './services/volunteerService';
import {
  subscribeToAuthChanges,
  FirebaseUserProfile,
  logoutFirebase,
} from './services/firebaseAuthService';
import { Search, Image as ImageIcon } from 'lucide-react';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageId>('home');
  const [seoModalOpen, setSeoModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState<LanguageCode>(() => {
    try {
      const saved = localStorage.getItem('narmada_preferred_language');
      if (saved) return saved as LanguageCode;
    } catch (_) {}
    return 'hi';
  });
  const [currentUser, setCurrentUserState] = useState<UserAccount | null>(() => getCurrentUser());
  const [officerProfile, setOfficerProfile] = useState<FirebaseUserProfile | null>(null);
  const [customLogoUrl, setCustomLogoUrl] = useState<string | null>(() => getPermanentLogo());

  // Customizable contact placeholders in state (can be edited interactively by user)
  const [customPhone, setCustomPhone] = useState('');
  const [customEmail, setCustomEmail] = useState('');
  const [customAddress, setCustomAddress] = useState('');

  // Synchronize permanent logo updates across components
  useEffect(() => {
    const handleLogoStorage = () => {
      setCustomLogoUrl(getPermanentLogo());
    };
    window.addEventListener('storage', handleLogoStorage);
    window.addEventListener('sanghiya-permanent-logo-changed', handleLogoStorage);
    return () => {
      window.removeEventListener('storage', handleLogoStorage);
      window.removeEventListener('sanghiya-permanent-logo-changed', handleLogoStorage);
    };
  }, []);

  // Handle Hash routing from URL for seamless navigation and deep link sharing
  useEffect(() => {
    const handleHashChange = () => {
      const hashStr = window.location.hash.replace('#', '');
      const cleanHash = hashStr.split('?')[0] as PageId;
      const validPages: PageId[] = [
        'home',
        'about',
        'campaigns',
        'gallery',
        'narmada-prahari',
        'volunteer',
        'volunteer-profile',
        'track-application',
        'verify-certificate',
        'officer-login',
        'officer-dashboard',
        'admin',
        'contact',
        'privacy',
      ];
      if (validPages.includes(cleanHash)) {
        setCurrentPage(cleanHash);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Update document title dynamically based on current page
  useEffect(() => {
    const titles: Record<PageId, string> = {
      home: `${FOUNDATION_INFO.hindiName} | ${FOUNDATION_INFO.englishName}`,
      about: `हमारे बारे में (मिशन व विज़न) | ${FOUNDATION_INFO.hindiName}`,
      campaigns: `हमारे अभियान (घाट सफाई, वृक्षारोपण) | ${FOUNDATION_INFO.hindiName}`,
      gallery: `गतिविधियों की गैलरी | ${FOUNDATION_INFO.hindiName}`,
      'narmada-prahari': `नर्मदा प्रहरी मोबाइल ऐप | ${FOUNDATION_INFO.hindiName}`,
      volunteer: `स्वयंसेवक बनें (पंजीकरण) | ${FOUNDATION_INFO.hindiName}`,
      'volunteer-profile': `मेरी वॉलंटियर प्रोफाइल व प्रमाणपत्र | ${FOUNDATION_INFO.hindiName}`,
      'track-application': `आवेदन की स्थिति ट्रैक करें | ${FOUNDATION_INFO.hindiName}`,
      'verify-certificate': `प्रमाणपत्र QR सत्यापन | ${FOUNDATION_INFO.hindiName}`,
      'officer-login': `अधिकारी लॉगिन (Officer Portal) | ${FOUNDATION_INFO.hindiName}`,
      'officer-dashboard': `अधिकारी डैशबोर्ड (Officer Dashboard) | ${FOUNDATION_INFO.hindiName}`,
      admin: `प्रशासनिक नियंत्रण कक्ष (Admin) | ${FOUNDATION_INFO.hindiName}`,
      contact: `संपर्क करें (सुझाव व जानकारी) | ${FOUNDATION_INFO.hindiName}`,
      privacy: `गोपनीयता नीति | ${FOUNDATION_INFO.hindiName}`,
    };

    document.title = titles[currentPage] || FOUNDATION_INFO.hindiName;
  }, [currentPage]);

  // Handle multi-language persistence and RTL layout for Urdu/Kashmiri
  useEffect(() => {
    try {
      localStorage.setItem('narmada_preferred_language', currentLang);
    } catch (_) {}

    if (currentLang === 'ur' || currentLang === 'ks') {
      document.documentElement.dir = 'rtl';
      document.documentElement.lang = currentLang;
    } else {
      document.documentElement.dir = 'ltr';
      document.documentElement.lang = currentLang;
    }
  }, [currentLang]);

  const navigateTo = (page: PageId) => {
    setCurrentPage(page);
    window.location.hash = page === 'home' ? '' : `#${page}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle custom logo upload preview and permanent storage
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setCustomLogoUrl(dataUrl);
      savePermanentLogo(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans selection:bg-emerald-600 selection:text-white">
      {/* 1. Header & Navigation */}
      <Navbar
        currentPage={currentPage}
        onNavigate={navigateTo}
        onOpenSeoGuide={() => setSeoModalOpen(true)}
        customLogoUrl={customLogoUrl}
        currentLang={currentLang}
        onLanguageChange={setCurrentLang}
        onOpenAuthModal={() => setAuthModalOpen(true)}
        currentUser={currentUser}
        onLogoutUser={() => {
          setCurrentUser(null);
          setCurrentUserState(null);
        }}
      />

      {/* 2. Main Page Render */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <HomePage onNavigate={navigateTo} customLogoUrl={customLogoUrl} />
        )}
        {currentPage === 'about' && (
          <AboutPage onNavigate={navigateTo} customLogoUrl={customLogoUrl} />
        )}
        {currentPage === 'campaigns' && <CampaignsPage onNavigate={navigateTo} />}
        {currentPage === 'gallery' && <GalleryPage />}
        {currentPage === 'narmada-prahari' && <NarmadaPrahariPage />}
        {currentPage === 'volunteer' && (
          <VolunteerPage
            onNavigateToProfile={() => navigateTo('volunteer-profile')}
            onNavigateToVerify={() => navigateTo('verify-certificate')}
            onNavigateToTrack={() => navigateTo('track-application')}
          />
        )}
        {currentPage === 'volunteer-profile' && <VolunteerProfilePage />}
        {currentPage === 'track-application' && (
          <TrackApplicationPage onNavigate={navigateTo} />
        )}
        {currentPage === 'verify-certificate' && <CertificateVerifyPage />}
        {currentPage === 'officer-login' && (
          <OfficerLoginPage
            onNavigate={navigateTo}
            onLoginSuccess={(prof) => setOfficerProfile(prof)}
            customLogoUrl={customLogoUrl}
          />
        )}
        {currentPage === 'officer-dashboard' && (
          <OfficerDashboardPage
            onNavigate={navigateTo}
            officerProfile={officerProfile}
            onLogout={() => setOfficerProfile(null)}
            customLogoUrl={customLogoUrl}
          />
        )}
        {currentPage === 'admin' && <AdminDashboardPage />}
        {currentPage === 'contact' && (
          <ContactPage
            customPhone={customPhone}
            setCustomPhone={setCustomPhone}
            customEmail={customEmail}
            setCustomEmail={setCustomEmail}
            customAddress={customAddress}
            setCustomAddress={setCustomAddress}
          />
        )}
        {currentPage === 'privacy' && <PrivacyPolicyPage />}
      </main>

      {/* 3. Floating Quick Assist Utility Toolbar (bottom right) */}
      <aside aria-label="त्वरित सहायक टूलबार" className="fixed bottom-4 right-4 z-40 flex flex-col gap-2 items-end no-print">
        {/* Custom Logo Upload Helper Button */}
        <label
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-white/95 backdrop-blur-md hover:bg-white text-slate-700 text-xs font-semibold shadow-lg border border-slate-200 cursor-pointer transition-all hover:scale-105"
          title="यदि आपके पास फाउंडेशन का वास्तविक लोगो है तो यहाँ अपलोड करें (स्थायी रूप से सुरक्षित रहेगा)"
        >
          <ImageIcon className="w-3.5 h-3.5 text-emerald-600" />
          <span className="hidden sm:inline">
            {customLogoUrl ? 'लोगो बदला गया' : 'लोगो अपलोड'}
          </span>
          <input
            type="file"
            accept="image/*"
            onChange={handleLogoUpload}
            className="hidden"
          />
        </label>

        {/* SEO Guide Floating Trigger */}
        <button
          onClick={() => setSeoModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-emerald-800 to-sky-900 text-white text-xs font-semibold shadow-xl hover:shadow-2xl hover:scale-105 transition-all cursor-pointer border border-emerald-500/40"
          title="Google Search Console, sitemap और मुफ्त होस्टिंग निर्देश देखें"
        >
          <Search className="w-4 h-4 text-amber-300" />
          <span>गूगल सर्च व होस्टिंग गाइड</span>
        </button>
      </aside>

      {/* 4. Footer */}
      <Footer
        onNavigate={navigateTo}
        onOpenSeoGuide={() => setSeoModalOpen(true)}
        customLogoUrl={customLogoUrl}
      />

      {/* 5. User Authentication Modal (Login / Sign-up) */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onAuthSuccess={(user) => {
          setCurrentUser(user);
          setCurrentUserState(user);
        }}
      />

      {/* 6. SEO & Google Search Guide Modal */}
      <SeoGuideModal isOpen={seoModalOpen} onClose={() => setSeoModalOpen(false)} />
    </div>
  );
}
