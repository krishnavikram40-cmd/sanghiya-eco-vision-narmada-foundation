import React, { useState, useEffect } from 'react';
import {
  getVolunteers,
  findVolunteer,
  getActiveMemberId,
  setActiveMemberId,
  checkCertificateEligibility,
  updateVolunteerProfilePermitted,
} from '../services/volunteerService';
import { VolunteerProfile } from '../types';
import { CertificateView } from '../components/CertificateView';
import {
  User,
  ShieldCheck,
  Calendar,
  MapPin,
  Award,
  Download,
  Search,
  CheckCircle2,
  AlertCircle,
  Eye,
  LogOut,
  Sparkles,
  Phone,
  Mail,
  Heart,
  FileText,
  Camera,
  Edit3,
  X,
  Check,
  UploadCloud,
} from 'lucide-react';

export const VolunteerProfilePage: React.FC = () => {
  const [searchInput, setSearchInput] = useState('');
  const [currentVolunteer, setCurrentVolunteer] = useState<VolunteerProfile | null>(null);
  const [certificateModalOpen, setCertificateModalOpen] = useState(false);
  const [eligibilityMessage, setEligibilityMessage] = useState<string | null>(null);
  const [loginError, setLoginError] = useState('');

  // Profile Editing States
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editSuccessMsg, setEditSuccessMsg] = useState<string | null>(null);
  const [editErrorMsg, setEditErrorMsg] = useState<string | null>(null);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  const [editAlternatePhone, setEditAlternatePhone] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editDob, setEditDob] = useState('');
  const [editGender, setEditGender] = useState<'पुरुष' | 'महिला' | 'अन्य' | 'उल्लेख नहीं करना चाहते' | ''>('');
  const [editPhotoUrl, setEditPhotoUrl] = useState('');
  const [editVillage, setEditVillage] = useState('');
  const [editFullAddress, setEditFullAddress] = useState('');
  const [editPincode, setEditPincode] = useState('');
  const [editAvailableTime, setEditAvailableTime] = useState('');
  const [editPastExperience, setEditPastExperience] = useState('');
  const [editReasonForJoining, setEditReasonForJoining] = useState('');
  const [editServiceInterests, setEditServiceInterests] = useState<string[]>([]);

  // Auto-load if active member ID exists
  useEffect(() => {
    const activeId = getActiveMemberId();
    if (activeId) {
      const vol = findVolunteer(activeId);
      if (vol) {
        setCurrentVolunteer(vol);
      }
    }
  }, []);

  const handleOpenEditModal = () => {
    if (!currentVolunteer) return;
    setEditAlternatePhone(currentVolunteer.alternatePhone || '');
    setEditEmail(currentVolunteer.email || '');
    setEditDob(currentVolunteer.dob || '');
    setEditGender(currentVolunteer.gender || '');
    setEditPhotoUrl(currentVolunteer.photoUrl || '');
    setEditVillage(currentVolunteer.village || '');
    setEditFullAddress(currentVolunteer.fullAddress || '');
    setEditPincode(currentVolunteer.pincode || '');
    setEditAvailableTime(currentVolunteer.availableTime || '');
    setEditPastExperience(currentVolunteer.pastExperience || '');
    setEditReasonForJoining(currentVolunteer.reasonForJoining || '');
    setEditServiceInterests(currentVolunteer.serviceInterests || []);
    setEditSuccessMsg(null);
    setEditErrorMsg(null);
    setIsEditModalOpen(true);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 20 * 1024 * 1024) {
      setEditErrorMsg('फोटो का आकार 20MB से अधिक नहीं होना चाहिए।');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const b64 = reader.result as string;
      setEditPhotoUrl(b64);
      setEditErrorMsg(null);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentVolunteer) return;

    setIsSavingProfile(true);
    setEditErrorMsg(null);

    const res = updateVolunteerProfilePermitted(currentVolunteer.id, {
      alternatePhone: editAlternatePhone.trim(),
      email: editEmail.trim(),
      dob: editDob,
      gender: editGender,
      photoUrl: editPhotoUrl,
      village: editVillage.trim(),
      fullAddress: editFullAddress.trim(),
      pincode: editPincode.trim(),
      availableTime: editAvailableTime.trim(),
      pastExperience: editPastExperience.trim(),
      reasonForJoining: editReasonForJoining.trim(),
      serviceInterests: editServiceInterests,
    });

    setIsSavingProfile(false);

    if (res.success && res.volunteer) {
      setCurrentVolunteer(res.volunteer);
      setEditSuccessMsg('आपकी वॉलंटियर प्रोफाइल सफलतापूर्वक अद्यतन (अपडेट) कर दी गई है!');
      setTimeout(() => {
        setIsEditModalOpen(false);
        setEditSuccessMsg(null);
      }, 1500);
    } else {
      setEditErrorMsg(res.error || 'प्रोफाइल सहेजने में त्रुटि आई। कृपया पुनः प्रयास करें।');
    }
  };

  const toggleInterest = (interest: string) => {
    setEditServiceInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!searchInput.trim()) return;

    const vol = findVolunteer(searchInput.trim());
    if (vol) {
      setCurrentVolunteer(vol);
      setActiveMemberId(vol.id);
      setSearchInput('');
    } else {
      setLoginError(
        'दर्ज की गई वॉलंटियर ID या मोबाइल नंबर से कोई रिकॉर्ड नहीं मिला। कृपया सही विवरण जांचें।'
      );
    }
  };

  const handleLogout = () => {
    setCurrentVolunteer(null);
    setActiveMemberId(null);
    setCertificateModalOpen(false);
  };

  const handleViewCertificate = () => {
    if (!currentVolunteer) return;
    const { eligible, message } = checkCertificateEligibility(currentVolunteer);
    if (eligible) {
      setCertificateModalOpen(true);
    } else {
      setEligibilityMessage(message);
    }
  };

  const isVerified = currentVolunteer?.verificationStatus === 'सत्यापित';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      {/* Page Header */}
      <section className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-900 text-xs sm:text-sm font-semibold">
          <User className="w-4 h-4 text-emerald-700" />
          <span>स्वयंसेवक सदस्य पोर्टल (Volunteer Member Portal)</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-slate-900 leading-tight">
          मेरी वॉलंटियर प्रोफाइल एवं डिजिटल प्रमाणपत्र
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
          अपनी पंजीकरण स्थिति की जांच करें, सदस्यता विवरण देखें और सत्यापन उपरांत अपना आधिकारिक
          प्रमाणपत्र सीधे वेबसाइट से डाउनलोड करें।
        </p>
      </section>

      {/* If Not Logged In -> Show ID / Phone Login Card */}
      {!currentVolunteer ? (
        <section className="max-w-md mx-auto bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md space-y-5">
          <div className="text-center space-y-1 border-b border-slate-100 pb-3">
            <h2 className="font-heading font-bold text-lg text-slate-900">
              अपनी प्रोफाइल में प्रवेश करें
            </h2>
            <p className="text-xs text-slate-500">
              अपनी वॉलंटियर ID (उदा. SEVNF-VOL-000101) या पंजीकृत मोबाइल नंबर दर्ज करें:
            </p>
          </div>

          {loginError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                वॉलंटियर ID या 10 अंकों का मोबाइल नंबर:
              </label>
              <input
                type="text"
                required
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="SEVNF-VOL-000101 अथवा 9826012345"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-mono text-sm focus:outline-hidden focus:border-emerald-600"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>प्रोफाइल खोलें</span>
            </button>
          </form>

          <div className="text-center pt-2 border-t border-slate-100">
            <span className="text-xs text-slate-500">अभी तक पंजीकरण नहीं कराया? </span>
            <button
              onClick={() => (window.location.hash = '#volunteer')}
              className="text-xs font-bold text-emerald-800 hover:underline cursor-pointer"
            >
              यहाँ नया रजिस्ट्रेशन करें →
            </button>
          </div>
        </section>
      ) : (
        /* If Logged In -> Show Full Profile Dashboard */
        <section className="space-y-8 animate-in fade-in">
          {/* Top Session Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center gap-2 text-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span className="font-semibold text-slate-800">सक्रिय सत्र: {currentVolunteer.fullName}</span>
              <span className="text-slate-400 font-mono">({currentVolunteer.id})</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleOpenEditModal}
                className="px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>प्रोफाइल संपादित करें</span>
              </button>
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>लॉग आउट</span>
              </button>
            </div>
          </div>

          {/* Main Profile Card */}
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-emerald-900 via-sky-900 to-emerald-950 text-white p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
                {/* Photo Frame with Direct Change Button */}
                <div className="relative w-28 h-32 rounded-2xl bg-slate-800 border-3 border-amber-400 overflow-hidden shrink-0 shadow-md flex items-center justify-center group">
                  {currentVolunteer.photoUrl ? (
                    <img
                      src={currentVolunteer.photoUrl}
                      alt={currentVolunteer.fullName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-14 h-14 text-slate-400" />
                  )}
                  <button
                    type="button"
                    onClick={handleOpenEditModal}
                    title="फोटो बदलें / संपादन"
                    className="absolute bottom-1 right-1 p-1.5 rounded-full bg-emerald-800 hover:bg-emerald-700 text-amber-300 shadow-md cursor-pointer border border-white/40"
                  >
                    <Camera className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    {isVerified && currentVolunteer.memberId ? (
                      <span className="font-mono text-xs px-2.5 py-1 rounded-md bg-amber-400 text-slate-950 font-black border border-amber-300 shadow-xs">
                        सदस्य ID: {currentVolunteer.memberId}
                      </span>
                    ) : (
                      <span className="font-mono text-xs px-2.5 py-0.5 rounded-md bg-white/10 text-amber-300 font-bold border border-white/20">
                        आवेदन Ref: {currentVolunteer.applicationReference || currentVolunteer.id}
                      </span>
                    )}
                    <span
                      className={`text-xs px-3 py-0.5 rounded-full font-bold ${
                        isVerified
                          ? 'bg-emerald-500 text-white'
                          : 'bg-amber-400 text-slate-950'
                      }`}
                    >
                      {currentVolunteer.verificationStatus}
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-heading font-black text-white">
                    {currentVolunteer.fullName}
                  </h2>

                  <p className="text-xs sm:text-sm text-emerald-200 flex items-center justify-center sm:justify-start gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>
                      {currentVolunteer.village}, {currentVolunteer.tehsil}, {currentVolunteer.district} (
                      {currentVolunteer.state})
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Profile Information Body */}
            <div className="p-6 sm:p-8 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs sm:text-sm">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-xs text-slate-500 block mb-0.5">पंजीकृत मोबाइल:</span>
                  <span className="font-mono font-bold text-slate-900">{currentVolunteer.phone}</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-xs text-slate-500 block mb-0.5">ईमेल पता:</span>
                  <span className="font-semibold text-slate-900">
                    {currentVolunteer.email || 'उपलब्ध नहीं'}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-xs text-slate-500 block mb-0.5">पंजीकरण तिथि:</span>
                  <span className="font-medium text-slate-700">{currentVolunteer.registeredAt}</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-xs text-slate-500 block mb-0.5">प्रमाणपत्र क्रमांक:</span>
                  <span className="font-mono font-bold text-emerald-800">
                    {currentVolunteer.certificateNumber}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-xs text-slate-500 block mb-0.5">सत्यापन तिथि:</span>
                  <span className="font-medium text-emerald-800">
                    {currentVolunteer.verifiedAt || 'समीक्षाधीन (Under Review)'}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-xs text-slate-500 block mb-0.5">समय उपलब्धता:</span>
                  <span className="font-medium text-slate-800">{currentVolunteer.availableTime}</span>
                </div>
              </div>

              {/* Service Areas */}
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
                <span className="font-bold text-emerald-950 text-xs uppercase tracking-wider block">
                  चयनित सेवा व रुचि क्षेत्र:
                </span>
                <div className="flex flex-wrap gap-2">
                  {currentVolunteer.serviceInterests && currentVolunteer.serviceInterests.length > 0 ? (
                    currentVolunteer.serviceInterests.map((interest, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-full bg-white text-emerald-900 border border-emerald-300 font-semibold text-xs"
                      >
                        ✓ {interest}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-600">माँ नर्मदा संरक्षण</span>
                  )}
                </div>
              </div>

              {/* Purpose */}
              {currentVolunteer.reasonForJoining && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm">
                  <span className="font-bold text-slate-900 block mb-1">
                    फाउंडेशन से जुड़ने का संकल्प:
                  </span>
                  <p className="italic text-slate-700">"{currentVolunteer.reasonForJoining}"</p>
                </div>
              )}

              {/* =======================================================
                  CERTIFICATE ACCESS & DOWNLOAD ACTION AREA
                  ======================================================= */}
              <div className="pt-4 border-t border-slate-200 space-y-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h3 className="font-heading font-bold text-lg text-slate-900">
                      आधिकारिक डिजिटल सदस्यता प्रमाणपत्र
                    </h3>
                    <p className="text-xs text-slate-500">
                      फाउंडेशन के असली लोगो, यूनिक ID व QR कोड युक्त सदस्यता प्रमाणपत्र।
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {isVerified ? (
                      <button
                        onClick={handleViewCertificate}
                        className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-700 to-sky-800 hover:from-emerald-800 hover:to-sky-900 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
                      >
                        <Award className="w-4 h-4 text-amber-300" />
                        <span>मेरा प्रमाणपत्र देखें व PDF डाउनलोड करें</span>
                      </button>
                    ) : (
                      <button
                        onClick={handleViewCertificate}
                        className="px-5 py-3 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold text-xs transition-colors flex items-center gap-2 cursor-pointer"
                      >
                        <Eye className="w-4 h-4 text-slate-500" />
                        <span>प्रमाणपत्र की पात्रता जांचें</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Eligibility Notice Box when not verified */}
                {!isVerified && (
                  <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-950 text-xs sm:text-sm space-y-1">
                    <div className="font-bold flex items-center gap-1.5 text-amber-900">
                      <AlertCircle className="w-4 h-4 text-amber-700" />
                      <span>प्रमाणपत्र डाउनलोड पात्रता:</span>
                    </div>
                    <p className="leading-relaxed">
                      "आपका आवेदन अभी <strong>समीक्षा में</strong> है। सत्यापन पूरा होने के बाद आप अपना
                      प्रमाणपत्र वेबसाइट से डाउनलोड कर सकेंगे।"
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Certificate Modal Dialog */}
          {certificateModalOpen && (
            <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-in fade-in">
              <div className="relative w-full max-w-6xl bg-white rounded-3xl shadow-2xl p-4 sm:p-6 max-h-[95vh] overflow-y-auto">
                <CertificateView
                  volunteer={currentVolunteer}
                  onClose={() => setCertificateModalOpen(false)}
                  isModal={true}
                />
              </div>
            </div>
          )}

          {/* Edit Profile Modal Dialog */}
          {isEditModalOpen && (
            <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
              <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-emerald-200 overflow-hidden flex flex-col max-h-[92vh]">
                {/* Modal Header */}
                <div className="bg-gradient-to-r from-emerald-900 via-sky-900 to-emerald-950 text-white p-5 sm:p-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                      <Edit3 className="w-5 h-5 text-amber-300" />
                    </div>
                    <div>
                      <h3 className="font-heading font-black text-lg sm:text-xl text-white">
                        वॉलंटियर प्रोफाइल संपादन (Edit Profile)
                      </h3>
                      <p className="text-xs text-emerald-200">
                        {currentVolunteer.fullName} • Ref: {currentVolunteer.applicationReference || currentVolunteer.id}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="p-1.5 rounded-xl hover:bg-white/10 text-white cursor-pointer transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Modal Form Body */}
                <form onSubmit={handleSaveProfile} className="p-6 overflow-y-auto space-y-6 text-xs sm:text-sm">
                  {/* Notice Banners */}
                  {editSuccessMsg && (
                    <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 font-bold flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      <span>{editSuccessMsg}</span>
                    </div>
                  )}

                  {editErrorMsg && (
                    <div className="p-4 rounded-2xl bg-rose-50 border border-rose-300 text-rose-900 font-bold flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                      <span>{editErrorMsg}</span>
                    </div>
                  )}

                  {/* Non-Editable Protected Identity Block */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                      🔒 संस्थागत सुरक्षा: गैर-संपादन योग्य विवरण (Locked Fields)
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                      <div>
                        <span className="text-slate-400 block text-[10px]">पूरा नाम:</span>
                        <strong className="text-slate-800">{currentVolunteer.fullName}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">मुख्य पंजीकृत फोन:</span>
                        <strong className="text-slate-800 font-mono">{currentVolunteer.phone}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">वॉलंटियर ID:</span>
                        <strong className="text-emerald-800 font-mono">{currentVolunteer.id}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">सदस्य ID:</span>
                        <strong className="text-amber-800 font-mono">{currentVolunteer.memberId || 'अनुमोदन उपरांत'}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">प्रमाणपत्र क्रमांक:</span>
                        <strong className="text-slate-700 font-mono">{currentVolunteer.certificateNumber}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">सत्यापन स्थिति:</span>
                        <strong className="text-emerald-700">{currentVolunteer.verificationStatus}</strong>
                      </div>
                    </div>
                  </div>

                  {/* 1. Photo Section */}
                  <div className="space-y-3 p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200">
                    <label className="block font-bold text-emerald-950 text-xs sm:text-sm">
                      1. वॉलंटियर प्रोफाइल फोटो (Photo Upload / Replace):
                    </label>
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      <div className="w-24 h-28 rounded-xl bg-slate-200 border-2 border-emerald-600 overflow-hidden shrink-0 flex items-center justify-center shadow-xs">
                        {editPhotoUrl ? (
                          <img
                            src={editPhotoUrl}
                            alt="वॉलंटियर फोटो पूर्वावलोकन"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="w-10 h-10 text-slate-400" />
                        )}
                      </div>

                      <div className="space-y-2 flex-1 text-center sm:text-left">
                        <div className="flex flex-wrap items-center gap-2.5">
                          <label className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer shadow-xs transition">
                            <UploadCloud className="w-4 h-4 text-amber-300" />
                            <span>नया फोटो अपलोड करें</span>
                            <input
                              type="file"
                              accept="image/jpeg,image/png,image/webp"
                              onChange={handlePhotoUpload}
                              className="hidden"
                            />
                          </label>
                          {editPhotoUrl && (
                            <button
                              type="button"
                              onClick={() => setEditPhotoUrl('')}
                              className="px-3 py-2 rounded-xl border border-rose-300 text-rose-700 hover:bg-rose-50 font-semibold text-xs cursor-pointer transition"
                            >
                              फोटो हटाएं
                            </button>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500">
                          * पासपोर्ट साइज फोटो (JPEG, PNG, WebP) अधिकतम 20MB। यह फोटो आपके डिजिटल प्रमाणपत्र पर भी मुद्रित होगी।
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 2. Contact Details: Alternate Phone & Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        वैकल्पिक मोबाइल नंबर (Alternate Phone):
                      </label>
                      <input
                        type="tel"
                        maxLength={10}
                        value={editAlternatePhone}
                        onChange={(e) => setEditAlternatePhone(e.target.value)}
                        placeholder="10 अंकों का वैकल्पिक मोबाइल"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono text-xs sm:text-sm focus:border-emerald-600 focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        ईमेल आईडी (Email Address):
                      </label>
                      <input
                        type="email"
                        value={editEmail}
                        onChange={(e) => setEditEmail(e.target.value)}
                        placeholder="example@mail.com"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:border-emerald-600 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  {/* 3. Personal: DOB & Gender */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        जन्म तिथि (Date of Birth):
                      </label>
                      <input
                        type="date"
                        value={editDob}
                        onChange={(e) => setEditDob(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:border-emerald-600 focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        लिंग (Gender):
                      </label>
                      <select
                        value={editGender}
                        onChange={(e) =>
                          setEditGender(
                            e.target.value as 'पुरुष' | 'महिला' | 'अन्य' | 'उल्लेख नहीं करना चाहते' | ''
                          )
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm bg-white focus:border-emerald-600 focus:outline-hidden"
                      >
                        <option value="">-- चुनें --</option>
                        <option value="पुरुष">पुरुष (Male)</option>
                        <option value="महिला">महिला (Female)</option>
                        <option value="अन्य">अन्य (Other)</option>
                        <option value="उल्लेख नहीं करना चाहते">उल्लेख नहीं करना चाहते</option>
                      </select>
                    </div>
                  </div>

                  {/* 4. Address Details: Village, Full Address, Pincode */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-1">
                      <label className="block font-bold text-slate-700 mb-1">
                        गाँव / वार्ड / कस्बा:
                      </label>
                      <input
                        type="text"
                        value={editVillage}
                        onChange={(e) => setEditVillage(e.target.value)}
                        placeholder="गाँव या मोहल्ला"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:border-emerald-600 focus:outline-hidden"
                      />
                    </div>

                    <div className="sm:col-span-1">
                      <label className="block font-bold text-slate-700 mb-1">
                        पिनकोड (Pincode):
                      </label>
                      <input
                        type="text"
                        maxLength={6}
                        value={editPincode}
                        onChange={(e) => setEditPincode(e.target.value)}
                        placeholder="उदा. 464665"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono text-xs sm:text-sm focus:border-emerald-600 focus:outline-hidden"
                      />
                    </div>

                    <div className="sm:col-span-1">
                      <label className="block font-bold text-slate-700 mb-1">
                        समय उपलब्धता:
                      </label>
                      <input
                        type="text"
                        value={editAvailableTime}
                        onChange={(e) => setEditAvailableTime(e.target.value)}
                        placeholder="उदा. 4-5 घंटे प्रति सप्ताह"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:border-emerald-600 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      पूरा आवासीय पता (Full Residential Address):
                    </label>
                    <textarea
                      rows={2}
                      value={editFullAddress}
                      onChange={(e) => setEditFullAddress(e.target.value)}
                      placeholder="मकान क्रमांक, गली / मार्ग, लैंडमार्क..."
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:border-emerald-600 focus:outline-hidden"
                    />
                  </div>

                  {/* 5. Service Interests */}
                  <div className="space-y-2">
                    <label className="block font-bold text-slate-700">
                      सेवा एवं रुचि क्षेत्र (Service Interests):
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {[
                        'नर्मदा परिक्रमा सेवा',
                        'पर्यावरण एवं स्वच्छता',
                        'वृक्षारोपण एवं नर्सरी',
                        'जल संरक्षण एवं शोधन',
                        'गौ सेवा एवं संवर्धन',
                        'जैविक कृषि प्रोत्साहन',
                        'युवा एवं सांस्कृतिक चेतना',
                        'चिकित्सा एवं प्राथमिक सहायता',
                      ].map((item) => (
                        <label
                          key={item}
                          className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs cursor-pointer transition ${
                            editServiceInterests.includes(item)
                              ? 'bg-emerald-50 border-emerald-400 text-emerald-950 font-bold'
                              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={editServiceInterests.includes(item)}
                            onChange={() => toggleInterest(item)}
                            className="w-4 h-4 text-emerald-600 rounded-sm focus:ring-emerald-500"
                          />
                          <span>{item}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* 6. Reason / Sankalp */}
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      फाउंडेशन से जुड़ने का उद्देश्य व संकल्प:
                    </label>
                    <textarea
                      rows={2}
                      value={editReasonForJoining}
                      onChange={(e) => setEditReasonForJoining(e.target.value)}
                      placeholder="माँ नर्मदा सेवा व संरक्षण संकल्प..."
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:border-emerald-600 focus:outline-hidden"
                    />
                  </div>

                  {/* Modal Action Buttons */}
                  <div className="pt-4 flex flex-wrap items-center justify-end gap-3 border-t border-slate-200">
                    <button
                      type="button"
                      onClick={() => setIsEditModalOpen(false)}
                      className="px-5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold text-xs sm:text-sm cursor-pointer transition"
                    >
                      रद्द करें
                    </button>
                    <button
                      type="submit"
                      disabled={isSavingProfile}
                      className="px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center gap-2 disabled:opacity-60"
                    >
                      <Check className="w-4 h-4 text-amber-300" />
                      <span>{isSavingProfile ? 'सहेजा जा रहा है...' : 'परिवर्तन सहेजें (Save Changes)'}</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
};
