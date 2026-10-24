import React, { useState, useEffect } from 'react';
import { VerificationStatus, ApplicationType, PageId } from '../types';
import { apiTrackApplication } from '../services/apiClient';
import { SITE_CONFIG } from '../config/siteConfig';
import { CustomEmblem } from '../components/CustomEmblem';
import {
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  Shield,
  FileCheck,
  Award,
  ArrowRight,
  ExternalLink,
  MapPin,
  Calendar,
  UserCheck,
} from 'lucide-react';

interface TrackApplicationPageProps {
  onNavigate?: (page: PageId) => void;
  onNavigateToCertificate?: (certNumber: string) => void;
  onNavigateToVolunteer?: () => void;
  customLogoUrl?: string | null;
}

export const TrackApplicationPage: React.FC<TrackApplicationPageProps> = ({
  onNavigate,
  onNavigateToCertificate,
  onNavigateToVolunteer,
  customLogoUrl,
}) => {
  const [appRef, setAppRef] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [result, setResult] = useState<{
    applicationReference: string;
    maskedName: string;
    maskedPhone: string;
    status: VerificationStatus;
    submittedAt: string;
    reviewedAt?: string;
    reviewedBy?: string;
    memberId?: string;
    certificateNumber?: string;
    reviewComment?: string;
    rejectionReason?: string;
    state: string;
    district: string;
    applicationType: ApplicationType;
  } | null>(null);

  // Auto-populate from URL hash if query param exists: #track-application?ref=...
  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes('?')) {
      const queryParams = new URLSearchParams(hash.split('?')[1]);
      const refParam = queryParams.get('ref');
      if (refParam) {
        setAppRef(refParam);
      }
    }
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!appRef.trim()) {
      setErrorMsg('कृपया अपनी आवेदन संख्या (Application Reference Number) दर्ज करें।');
      return;
    }
    if (!phone.trim() || phone.replace(/\D/g, '').length < 10) {
      setErrorMsg('कृपया अपना 10 अंकों का पंजीकृत मोबाइल नंबर दर्ज करें।');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    setResult(null);

    const res = await apiTrackApplication(appRef.trim(), phone.trim());
    setIsLoading(false);

    if (res.success && res.data) {
      setResult(res.data);
    } else {
      setErrorMsg(res.error || 'दर्ज विवरण के अनुसार कोई आवेदन नहीं मिला। कृपया पुनः जाँचें।');
    }
  };

  return (
    <div className="min-h-[80vh] py-10 px-4 sm:px-6 max-w-4xl mx-auto">
      {/* Page Title & Intro */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center mb-3">
          <CustomEmblem size="md" customLogoUrl={customLogoUrl} />
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-emerald-950">
          अपने आवेदन की स्थिति जाँचें (Track Application)
        </h1>
        <p className="text-slate-600 text-sm mt-1 max-w-xl mx-auto">
          {SITE_CONFIG.hindiName} — सदस्यता, स्वयंसेवक अथवा नर्मदा प्रहरी आवेदन की अद्यतन स्थिति यहाँ देखें।
        </p>
      </div>

      {/* Search Box Card */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 sm:p-8 mb-8">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                आवेदन संख्या (Application Ref No) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={appRef}
                onChange={(e) => setAppRef(e.target.value)}
                placeholder="उदा. SEVNF-APP-2026-000101"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 text-sm font-mono uppercase transition"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                पंजीकृत मोबाइल नंबर (Registered Mobile) <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="10 अंकों का मोबाइल नंबर"
                maxLength={10}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 text-sm transition"
                required
              />
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs text-slate-500 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-emerald-700" />
              व्यक्तिगत सुरक्षा: केवल आवश्यक और सुरक्षित स्थिति ही सार्वजनिक प्रदर्शित होती है।
            </span>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-800 to-teal-800 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              <Search className="w-4 h-4" />
              <span>{isLoading ? 'खोज रहे हैं...' : 'स्थिति देखें'}</span>
            </button>
          </div>
        </form>

        {errorMsg && (
          <div className="mt-5 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs sm:text-sm flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">आवेदन नहीं मिला</p>
              <p className="mt-0.5">{errorMsg}</p>
            </div>
          </div>
        )}
      </div>

      {/* Result Display */}
      {result && (
        <div className="bg-white rounded-2xl shadow-xl border-2 border-emerald-800/30 overflow-hidden">
          {/* Status Top Banner */}
          <div
            className={`px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
              result.status === 'सत्यापित'
                ? 'bg-gradient-to-r from-emerald-800 to-teal-900 text-white'
                : result.status === 'अस्वीकृत'
                ? 'bg-gradient-to-r from-rose-900 to-red-950 text-white'
                : 'bg-gradient-to-r from-amber-600 to-orange-700 text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              {result.status === 'सत्यापित' && <CheckCircle2 className="w-6 h-6 text-emerald-300" />}
              {result.status === 'अस्वीकृत' && <XCircle className="w-6 h-6 text-rose-300" />}
              {result.status !== 'सत्यापित' && result.status !== 'अस्वीकृत' && (
                <Clock className="w-6 h-6 text-amber-200" />
              )}
              <div>
                <p className="text-xs uppercase tracking-wider font-semibold opacity-90">
                  वर्तमान स्थिति (Current Status)
                </p>
                <h2 className="text-xl font-bold">{result.status}</h2>
              </div>
            </div>

            <div className="sm:text-right">
              <span className="text-xs opacity-90 block">आवेदन संदर्भ संख्या:</span>
              <span className="font-mono text-base font-black tracking-wider">
                {result.applicationReference}
              </span>
            </div>
          </div>

          {/* Details Body */}
          <div className="p-6 sm:p-8 space-y-6">
            {/* Step Progress Bar */}
            <div className="border-b border-slate-200 pb-6">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
                आवेदन प्रगति चक्र (Application Progress Timeline)
              </p>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                {/* Step 1 */}
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold mb-1 shadow">
                    ✓
                  </div>
                  <span className="font-bold text-slate-800">1. आवेदन प्राप्त</span>
                  <span className="text-[11px] text-slate-500">{result.submittedAt}</span>
                </div>

                {/* Step 2 */}
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold mb-1 shadow ${
                      result.status === 'सत्यापित' || result.status === 'अस्वीकृत'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-amber-500 text-white'
                    }`}
                  >
                    {result.status === 'सत्यापित' || result.status === 'अस्वीकृत' ? '✓' : '...'}
                  </div>
                  <span className="font-bold text-slate-800">2. एडमिन समीक्षा</span>
                  <span className="text-[11px] text-slate-500">
                    {result.reviewedAt ? result.reviewedAt : 'प्रक्रियाधीन'}
                  </span>
                </div>

                {/* Step 3 */}
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold mb-1 shadow ${
                      result.status === 'सत्यापित'
                        ? 'bg-emerald-600 text-white'
                        : result.status === 'अस्वीकृत'
                        ? 'bg-red-600 text-white'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {result.status === 'सत्यापित' ? '✓' : result.status === 'अस्वीकृत' ? '✗' : '3'}
                  </div>
                  <span className="font-bold text-slate-800">3. अंतिम निर्णय</span>
                  <span className="text-[11px] text-slate-500">
                    {result.status === 'सत्यापित'
                      ? 'स्वीकृत'
                      : result.status === 'अस्वीकृत'
                      ? 'अस्वीकृत'
                      : 'लंबित'}
                  </span>
                </div>
              </div>
            </div>

            {/* Application Data Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block text-xs">आवेदक का नाम (सुरक्षित रूप):</span>
                <span className="font-bold text-slate-900 text-base">{result.maskedName}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block text-xs">पंजीकृत मोबाइल (मास्क्ड):</span>
                <span className="font-mono font-bold text-slate-900 text-base">{result.maskedPhone}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block text-xs">आवेदन का प्रकार:</span>
                <span className="font-bold text-emerald-900">{result.applicationType}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block text-xs">राज्य व जिला:</span>
                <span className="font-semibold text-slate-800">
                  {result.state}, {result.district}
                </span>
              </div>
            </div>

            {/* Status-Specific Action Banners */}
            {result.status === 'सत्यापित' && (
              <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-300">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 mb-1">
                      अधिकृत सदस्यता अनुमोदित
                    </span>
                    <p className="text-xs text-slate-600">आपकी स्थायी सदस्य आईडी (Member ID):</p>
                    <p className="font-mono text-xl sm:text-2xl font-black text-emerald-950 mt-0.5">
                      {result.memberId}
                    </p>
                    {result.reviewComment && (
                      <p className="text-xs text-emerald-900 mt-1 italic">
                        एडमिन टिप्पणी: "{result.reviewComment}"
                      </p>
                    )}
                  </div>

                  {result.certificateNumber && (
                    <button
                      onClick={() => {
                        window.location.hash = `#volunteer-profile?id=${result.applicationReference}`;
                      }}
                      className="px-5 py-3 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer shrink-0"
                    >
                      <Award className="w-4 h-4 text-amber-300" />
                      <span>प्रमाणपत्र देखें व PDF डाउनलोड करें</span>
                    </button>
                  )}
                </div>
              </div>
            )}

            {result.status === 'अस्वीकृत' && (
              <div className="p-5 rounded-2xl bg-red-50 border border-red-200 text-red-950">
                <h4 className="font-bold text-sm text-red-900 mb-1">आवेदन अस्वीकृति सूचना</h4>
                <p className="text-xs text-slate-700 leading-relaxed">
                  फाउंडेशन की सत्यापन समिति द्वारा आपके आवेदन की समीक्षा के पश्चात इसे अस्वीकृत किया गया है।
                </p>
                {result.rejectionReason && (
                  <p className="mt-2 text-xs font-semibold text-red-800 bg-white p-2.5 rounded-lg border border-red-200">
                    कारण: {result.rejectionReason}
                  </p>
                )}
                <p className="mt-3 text-xs text-slate-600">
                  यदि आपके पास कोई अतिरिक्त दस्तावेज या प्रश्न है, तो कृपया 'संपर्क करें' पेज से हमसे संपर्क करें।
                </p>
              </div>
            )}

            {result.status !== 'सत्यापित' && result.status !== 'अस्वीकृत' && (
              <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950">
                <h4 className="font-bold text-sm text-amber-900 mb-1 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-700" />
                  आवेदन समीक्षाधीन है
                </h4>
                <p className="text-xs text-amber-900 leading-relaxed">
                  "आपका आवेदन प्राप्त हो गया है। फाउंडेशन के अधिकृत एडमिन द्वारा समीक्षा किए जाने के बाद आपको आवेदन की अंतिम स्थिति दिखाई देगी।"
                </p>
                {result.reviewComment && (
                  <p className="mt-2 text-xs font-semibold text-amber-900 bg-white p-2.5 rounded-lg border border-amber-200">
                    एडमिन सूचना / टिप्पणी: {result.reviewComment}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
