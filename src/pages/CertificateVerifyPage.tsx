import React, { useState, useEffect } from 'react';
import { getPublicVerificationDetails } from '../services/volunteerService';
import { CustomEmblem } from '../components/CustomEmblem';
import { FOUNDATION_INFO } from '../data/foundationData';
import {
  ShieldCheck,
  Search,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  QrCode,
  Calendar,
  MapPin,
  Lock,
  ArrowRight,
  Info,
} from 'lucide-react';

export const CertificateVerifyPage: React.FC = () => {
  const [certInput, setCertInput] = useState('');
  const [searchResult, setSearchResult] = useState<ReturnType<typeof getPublicVerificationDetails> | null>(
    null
  );
  const [hasSearched, setHasSearched] = useState(false);

  // Auto-lookup if URL contains cert param
  useEffect(() => {
    const parseHashParam = () => {
      const hash = window.location.hash;
      if (hash.includes('cert=')) {
        const match = hash.match(/cert=([^&]+)/);
        if (match && match[1]) {
          const certVal = decodeURIComponent(match[1]);
          setCertInput(certVal);
          const res = getPublicVerificationDetails(certVal);
          setSearchResult(res);
          setHasSearched(true);
        }
      }
    };

    parseHashParam();
    window.addEventListener('hashchange', parseHashParam);
    return () => window.removeEventListener('hashchange', parseHashParam);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!certInput.trim()) return;

    const res = getPublicVerificationDetails(certInput.trim());
    setSearchResult(res);
    setHasSearched(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      {/* Header */}
      <section className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-900 text-xs sm:text-sm font-semibold">
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          <span>सार्वजनिक डिजिटल प्रमाणपत्र सत्यापन पोर्टल</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-slate-900 leading-tight">
          प्रमाणपत्र वैधता सत्यापन (QR Certificate Verification)
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
          संघिया इको-विजन नर्मदा फाउंडेशन द्वारा जारी किए गए स्वयंसेवक सदस्यता प्रमाणपत्रों की
          सत्यता की पुष्टि करें।
        </p>
      </section>

      {/* Search Input Box */}
      <section className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <form onSubmit={handleSearch} className="space-y-4">
          <label className="block text-sm font-semibold text-slate-800">
            प्रमाणपत्र क्रमांक या वॉलंटियर ID दर्ज करें:
          </label>
          <div className="flex flex-col sm:flex-row gap-2.5">
            <input
              type="text"
              required
              value={certInput}
              onChange={(e) => setCertInput(e.target.value)}
              placeholder="उदा. CERT-SEVNF-2026-000101 अथवा SEVNF-VOL-000101"
              className="flex-1 px-4 py-3 rounded-xl border border-slate-300 font-mono text-sm focus:outline-hidden focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>सत्यापित करें</span>
            </button>
          </div>
          <p className="text-xs text-slate-500">
            * प्रमाणपत्र पर छपे QR कोड को मोबाइल कैमरे से स्कैन करने पर यह पेज स्वतः सत्यापित विवरण दिखाता है।
          </p>
        </form>
      </section>

      {/* Result Display */}
      {hasSearched && (
        <section className="animate-in fade-in duration-200">
          {searchResult && searchResult.found ? (
            <div className="bg-white rounded-3xl border-2 border-emerald-300 p-6 sm:p-8 shadow-lg space-y-6">
              {/* Status Banner */}
              <div
                className={`p-4 rounded-2xl flex items-center justify-between gap-4 ${
                  searchResult.isEligibleAndValid
                    ? 'bg-emerald-50 border border-emerald-200 text-emerald-950'
                    : 'bg-amber-50 border border-amber-200 text-amber-950'
                }`}
              >
                <div className="flex items-center gap-3">
                  {searchResult.isEligibleAndValid ? (
                    <CheckCircle2 className="w-8 h-8 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-8 h-8 text-amber-600 shrink-0" />
                  )}
                  <div>
                    <h3 className="font-bold text-base sm:text-lg">
                      {searchResult.isEligibleAndValid
                        ? 'प्रमाणपत्र आधिकारिक रूप से सत्यापित एवं मान्य है'
                        : `प्रमाणपत्र स्थिति: ${searchResult.verificationStatus}`}
                    </h3>
                    <p className="text-xs text-slate-600">
                      फाउंडेशन रिकॉर्ड में प्रविष्टि उपलब्ध है।
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      searchResult.isEligibleAndValid
                        ? 'bg-emerald-800 text-white'
                        : 'bg-amber-800 text-white'
                    }`}
                  >
                    {searchResult.verificationStatus}
                  </span>
                </div>
              </div>

              {/* Public-Safe Details Grid (Excluding Phone, Email, Full Home Address) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-xs text-slate-500 block">सदस्य का नाम:</span>
                  <span className="font-bold text-slate-900 text-base">{searchResult.fullName}</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-xs text-slate-500 block">वॉलंटियर ID:</span>
                  <span className="font-mono font-bold text-emerald-800 text-base">
                    {searchResult.volunteerId}
                  </span>
                </div>

                {searchResult.memberId && (
                  <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-300 space-y-1">
                    <span className="text-xs text-amber-800 font-bold block">आधिकारिक सदस्य ID:</span>
                    <span className="font-mono font-black text-amber-950 text-base">
                      {searchResult.memberId}
                    </span>
                  </div>
                )}

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-xs text-slate-500 block">प्रमाणपत्र क्रमांक:</span>
                  <span className="font-mono font-bold text-slate-800">
                    {searchResult.certificateNumber}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-xs text-slate-500 block">क्षेत्र / जिला व राज्य:</span>
                  <span className="font-semibold text-slate-800">
                    {searchResult.tehsil}, {searchResult.district} ({searchResult.state})
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-xs text-slate-500 block">पंजीकरण तिथि:</span>
                  <span className="font-medium text-slate-700">{searchResult.registeredAt}</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-xs text-slate-500 block">सत्यापन तिथि:</span>
                  <span className="font-medium text-emerald-800">
                    {searchResult.verifiedAt || 'समीक्षाधीन (Under Review)'}
                  </span>
                </div>
              </div>

              {/* Privacy Protection Notice */}
              <div className="p-3.5 rounded-xl bg-sky-50 border border-sky-200 text-sky-950 text-xs flex items-start gap-2.5">
                <Lock className="w-4 h-4 text-sky-700 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <strong>निजता सुरक्षा घोषणा:</strong> वॉलंटियर की सुरक्षा और डेटा गोपनीयता नीति के
                  तहत सदस्य का व्यक्तिगत मोबाइल नंबर, ईमेल और पूरा आवासीय पता सार्वजनिक सत्यापन पेज पर
                  प्रदर्शित नहीं किया जाता है।
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border-2 border-red-200 p-8 text-center space-y-3">
              <XCircle className="w-12 h-12 text-red-500 mx-auto" />
              <h3 className="font-bold text-lg text-slate-900">
                कोई सत्यापन रिकॉर्ड नहीं मिला
              </h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                दर्ज किया गया प्रमाणपत्र क्रमांक अथवा वॉलंटियर ID <strong>"{certInput}"</strong> फाउंडेशन
                के सक्रिय डेटाबेस में उपलब्ध नहीं है। कृपया स्पेलिंग व नंबर की पुनः जाँच करें।
              </p>
            </div>
          )}
        </section>
      )}

      {/* Guidelines Box */}
      <section className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-2">
        <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
          <Info className="w-4 h-4 text-sky-600" />
          <span>प्रमाणपत्र सत्यापन प्रक्रिया की जानकारी:</span>
        </h3>
        <p>
          प्रत्येक आधिकारिक प्रमाणपत्र पर एक यूनिक QR कोड मुद्रित होता है। यह वेब पेज सीधे फाउंडेशन के
          डेटाबेस से रीयल-टाइम रिकॉर्ड की जाँच कर पुष्टि करता है कि प्रमाणपत्र वैध है अथवा नहीं। यदि किसी
          सदस्य का प्रमाणपत्र किसी कारणवश निरस्त या निष्क्रिय किया जाता है, तो सत्यापन स्थिति तत्काल यहाँ
          परिलक्षित हो जाती है।
        </p>
      </section>
    </div>
  );
};
