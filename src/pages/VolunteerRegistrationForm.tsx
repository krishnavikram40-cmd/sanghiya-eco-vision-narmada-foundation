import React, { useState, useEffect, useId } from 'react';
import {
  registerVolunteer,
  getLocations,
  setActiveMemberId,
} from '../services/volunteerService';
import { apiSubmitApplication } from '../services/apiClient';
import { ApplicationReceiptModal } from '../components/ApplicationReceiptModal';
import {
  LocationState,
  LocationDistrict,
  LocationTehsil,
  LocationVillage,
  LocationGhat,
  VolunteerProfile,
  ApplicationReceipt,
  ApplicationType,
} from '../types';
import {
  Users,
  Camera,
  Upload,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  FileText,
  User,
  MapPin,
  Sparkles,
  Info,
  Lock,
  Download,
  Compass,
  Navigation,
  Waves,
  Map as MapIcon,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';

interface VolunteerRegistrationFormProps {
  onSuccessNavigate?: (volunteerId: string) => void;
  customLogoUrl?: string | null;
}

export const VolunteerRegistrationForm: React.FC<VolunteerRegistrationFormProps> = ({
  onSuccessNavigate,
  customLogoUrl,
}) => {
  const photoInputId = useId();
  // Form Fields - Section A: Personal
  const [fullName, setFullName] = useState('');
  const [fatherOrGuardianName, setFatherOrGuardianName] = useState('');
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [phone, setPhone] = useState('');
  const [alternatePhone, setAlternatePhone] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState<'पुरुष' | 'महिला' | 'अन्य' | 'उल्लेख नहीं करना चाहते' | ''>('');
  const [applicationType, setApplicationType] = useState<ApplicationType>('पर्यावरण स्वयंसेवक');
  const [activeReceipt, setActiveReceipt] = useState<ApplicationReceipt | null>(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form Fields - Section B: Location Hierarchy
  const [locations, setLocations] = useState<LocationState[]>([]);
  const [selectedStateId, setSelectedStateId] = useState('mp');
  const [selectedDistrictId, setSelectedDistrictId] = useState('');
  const [selectedTehsilId, setSelectedTehsilId] = useState('');
  const [selectedVillageId, setSelectedVillageId] = useState('');
  const [customVillageName, setCustomVillageName] = useState('');
  const [isCustomVillage, setIsCustomVillage] = useState(false);
  const [pincode, setPincode] = useState('');
  const [fullAddress, setFullAddress] = useState('');

  // Form Fields - Section C: Service Interests
  const [reasonForJoining, setReasonForJoining] = useState('');
  const [interestTreePlantation, setInterestTreePlantation] = useState(true);
  const [interestGhatSafai, setInterestGhatSafai] = useState(true);
  const [interestEcoAwareness, setInterestEcoAwareness] = useState(true);
  const [interestPlasticControl, setInterestPlasticControl] = useState(true);
  const [availableTime, setAvailableTime] = useState('सप्ताहांत (शनिवार / रविवार)');
  const [pastExperience, setPastExperience] = useState('');

  // Consent
  const [consentDataUsage, setConsentDataUsage] = useState(false);
  const [consentPhotoUsage, setConsentPhotoUsage] = useState(false);

  // Flow States
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [photoError, setPhotoError] = useState('');
  const [submittedVolunteer, setSubmittedVolunteer] = useState<VolunteerProfile | null>(null);

  // Load cascading locations
  useEffect(() => {
    const locs = getLocations();
    setLocations(locs);
    if (locs.length > 0) {
      const defaultState = locs.find((s) => s.id === 'mp') || locs[0];
      setSelectedStateId(defaultState.id);
      if (defaultState.districts && defaultState.districts.length > 0) {
        setSelectedDistrictId(defaultState.districts[0].id);
        if (defaultState.districts[0].tehsils && defaultState.districts[0].tehsils.length > 0) {
          setSelectedTehsilId(defaultState.districts[0].tehsils[0].id);
        }
      }
    }
  }, []);

  // Cascading helpers
  const currentState = locations.find((s) => s.id === selectedStateId);
  const currentDistricts = currentState?.districts?.filter((d) => d.isActive) || [];
  const currentDistrict = currentDistricts.find((d) => d.id === selectedDistrictId);
  const currentTehsils = currentDistrict?.tehsils?.filter((t) => t.isActive) || [];
  const currentTehsil = currentTehsils.find((t) => t.id === selectedTehsilId);
  const currentVillages = currentTehsil?.villages?.filter((v) => v.isActive) || [];

  const handleStateChange = (stateId: string) => {
    setSelectedStateId(stateId);
    const st = locations.find((s) => s.id === stateId);
    const dList = st?.districts?.filter((d) => d.isActive) || [];
    if (dList.length > 0) {
      setSelectedDistrictId(dList[0].id);
      const tList = dList[0].tehsils?.filter((t) => t.isActive) || [];
      if (tList.length > 0) {
        setSelectedTehsilId(tList[0].id);
        setSelectedVillageId('');
      } else {
        setSelectedTehsilId('');
        setSelectedVillageId('');
      }
    } else {
      setSelectedDistrictId('');
      setSelectedTehsilId('');
      setSelectedVillageId('');
    }
  };

  const handleDistrictChange = (distId: string) => {
    setSelectedDistrictId(distId);
    const d = currentDistricts.find((dist) => dist.id === distId);
    const tList = d?.tehsils?.filter((t) => t.isActive) || [];
    if (tList.length > 0) {
      setSelectedTehsilId(tList[0].id);
      setSelectedVillageId('');
    } else {
      setSelectedTehsilId('');
      setSelectedVillageId('');
    }
  };

  const handleTehsilChange = (tehId: string) => {
    setSelectedTehsilId(tehId);
    setSelectedVillageId('');
  };

  // Photo Upload Handler with Format & Size Validation
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhotoError('');
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setPhotoError('कृपया केवल मान्य फोटो (JPG, JPEG, PNG अथवा WebP) अपलोड करें।');
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      setPhotoError('फोटो का आकार 20 MB से कम होना चाहिए।');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setPhotoUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Validate and open review modal
  const handleInitiateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!fullName.trim()) {
      setErrorMsg('कृपया अपना पूरा नाम दर्ज करें।');
      return;
    }
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      setErrorMsg('कृपया एक मान्य 10 अंकों का मोबाइल नंबर दर्ज करें।');
      return;
    }
    if (!pincode.trim() || pincode.trim().length !== 6) {
      setErrorMsg('कृपया 6 अंकों का सही पिन कोड दर्ज करें।');
      return;
    }
    if (isCustomVillage && !customVillageName.trim()) {
      setErrorMsg('कृपया अपने गाँव का नाम दर्ज करें।');
      return;
    }
    if (!reasonForJoining.trim()) {
      setErrorMsg('कृपया फाउंडेशन से जुड़ने का उद्देश्य/कारण दर्ज करें।');
      return;
    }
    if (!consentDataUsage || !consentPhotoUsage) {
      setErrorMsg('कृपया व्यक्तिगत जानकारी व फोटो उपयोग की सहमति बॉक्स पर टिक करें।');
      return;
    }

    // Open Pre-submission Review Step
    setReviewModalOpen(true);
  };

  // Final Confirmation Submission via Real API with Local Fallback
  const handleFinalConfirmSubmit = async () => {
    setReviewModalOpen(false);
    setIsSubmitting(true);
    setErrorMsg('');

    // Build service interests array
    const serviceInterests: string[] = [];
    if (interestGhatSafai) serviceInterests.push('नर्मदा घाट सफाई');
    if (interestPlasticControl) serviceInterests.push('प्लास्टिक प्रदूषण नियंत्रण');
    if (interestTreePlantation) serviceInterests.push('वृक्षारोपण व हरित तट');
    if (interestEcoAwareness) serviceInterests.push('पर्यावरण जन-जागरूकता');

    const stateName = currentState?.name || selectedStateId;
    const districtName = currentDistrict?.name || selectedDistrictId;
    const tehsilName = currentTehsil?.name || selectedTehsilId;
    const villageName = isCustomVillage
      ? customVillageName.trim()
      : currentVillages.find((v) => v.id === selectedVillageId)?.name || 'स्थानीय क्षेत्र';

    const payload = {
      fullName: fullName.trim(),
      fatherOrGuardianName: fatherOrGuardianName.trim() || undefined,
      photoUrl: photoUrl || undefined,
      phone: phone.trim(),
      alternatePhone: alternatePhone.trim() || undefined,
      email: email.trim() || undefined,
      dob: dob || undefined,
      gender: gender || undefined,
      country: 'भारत (India)',
      state: stateName,
      district: districtName,
      tehsil: tehsilName,
      village: villageName,
      isCustomVillage,
      customVillageName: isCustomVillage ? customVillageName.trim() : undefined,
      pincode: pincode.trim(),
      fullAddress: fullAddress.trim() || undefined,
      applicationType,
      reasonForJoining: reasonForJoining.trim(),
      serviceInterests,
      interestTreePlantation,
      interestGhatSafai,
      interestEcoAwareness,
      interestPlasticControl,
      availableTime,
      pastExperience: pastExperience.trim() || undefined,
      consentDataUsage,
      consentPhotoUsage,
    };

    const res = await apiSubmitApplication(payload);
    setIsSubmitting(false);

    if (res.success) {
      const vol: VolunteerProfile = {
        ...payload,
        id: res.applicationReference,
        applicationReference: res.applicationReference,
        receiptNumber: res.receipt.receiptNumber,
        certificateNumber: `CERT-SEVNF-2026-${res.applicationReference.slice(-6)}`,
        verificationStatus: 'आवेदन प्राप्त',
        registeredAt: res.receipt.submittedAt,
      };
      setSubmittedVolunteer(vol);
      setActiveReceipt(res.receipt);
      setIsReceiptModalOpen(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setErrorMsg(res.error || 'आवेदन जमा करने में विफलता। कृपया पुनः प्रयास करें।');
    }
  };

  return (
    <div className="space-y-12">
      {/* If registration successful, show confirmation card */}
      {submittedVolunteer ? (
        <section className="bg-white p-6 sm:p-10 rounded-3xl border-2 border-emerald-400 shadow-xl space-y-6 text-center animate-in zoom-in-95">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
              आवेदन सफलतापूर्वक प्राप्त हुआ
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900">
              स्वागत है, {submittedVolunteer.fullName}!
            </h2>
            <p className="text-sm text-slate-600 max-w-lg mx-auto">
              माँ नर्मदा संरक्षण महा-अभियान में आपकी सहभागिता का आवेदन सुरक्षित दर्ज कर लिया गया है।
            </p>
          </div>

          {/* Reference Card Display */}
          <div className="max-w-md mx-auto p-6 rounded-2xl bg-gradient-to-br from-emerald-900 via-sky-950 to-slate-900 text-white shadow-lg space-y-3 border-2 border-amber-400">
            <div className="flex items-center justify-between border-b border-emerald-700/60 pb-2">
              <span className="text-xs text-amber-300 font-semibold">आवेदन संदर्भ विवरण (Application Details)</span>
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-200 border border-amber-400/40 font-bold">
                {submittedVolunteer.verificationStatus}
              </span>
            </div>
            <div className="flex items-center gap-4 text-left">
              <div className="w-16 h-16 rounded-xl bg-slate-800 border-2 border-white/40 overflow-hidden shrink-0 flex items-center justify-center">
                {submittedVolunteer.photoUrl ? (
                  <img src={submittedVolunteer.photoUrl} alt="फोटो" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-8 h-8 text-slate-400" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-heading font-bold text-lg text-white">{submittedVolunteer.fullName}</h3>
                <div className="text-xs text-slate-300">आवेदन संख्या (Ref No):</div>
                <div className="font-mono text-base text-amber-300 font-black tracking-wider">
                  {submittedVolunteer.applicationReference || submittedVolunteer.id}
                </div>
                <div className="text-xs text-slate-300 mt-0.5">
                  {submittedVolunteer.district}, {submittedVolunteer.state}
                </div>
              </div>
            </div>
          </div>

          {/* Verification Notice */}
          <div className="max-w-lg mx-auto p-4 bg-amber-50/90 border border-amber-200 text-amber-950 text-xs sm:text-sm rounded-2xl text-left space-y-1.5">
            <div className="font-bold flex items-center gap-1.5 text-amber-900">
              <Info className="w-4 h-4 text-amber-700" />
              <span>आवेदन पावती व सत्यापन सूचना:</span>
            </div>
            <p className="leading-relaxed">
              "यह पावती आवेदन प्राप्त होने का प्रमाण है। फाउंडेशन के अधिकृत मुख्य एडमिन द्वारा समीक्षा और अनुमोदन के पश्चात ही आपको स्थायी सदस्य आईडी व सदस्यता प्रमाणपत्र जारी किया जाएगा।"
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            {activeReceipt && (
              <button
                type="button"
                onClick={() => setIsReceiptModalOpen(true)}
                className="px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>डिजिटल पावती डाउनलोड करें (PDF)</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                window.location.hash = `#track-application?ref=${submittedVolunteer.applicationReference || submittedVolunteer.id}`;
              }}
              className="px-5 py-3 rounded-xl bg-sky-800 hover:bg-sky-900 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center gap-2"
            >
              <span>आवेदन स्थिति ट्रैक करें</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => {
                if (onSuccessNavigate) {
                  onSuccessNavigate(submittedVolunteer.id);
                } else {
                  window.location.hash = '#volunteer-profile';
                }
              }}
              className="px-5 py-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center gap-2"
            >
              <span>मेरी प्रोफाइल देखें</span>
            </button>
            <button
              type="button"
              onClick={() => setSubmittedVolunteer(null)}
              className="px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs border border-slate-300 cursor-pointer"
            >
              नया फॉर्म भरें
            </button>
          </div>
        </section>
      ) : (
        /* ================= REGISTRATION FORM ================= */
        <form onSubmit={handleInitiateSubmit} className="space-y-8">
          {errorMsg && (
            <div className="p-4 bg-red-50 border-2 border-red-200 text-red-800 text-xs sm:text-sm rounded-2xl flex items-center gap-2.5">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* SECTION A: व्यक्तिगत जानकारी */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <div className="w-8 h-8 rounded-full bg-emerald-800 text-white font-bold text-sm flex items-center justify-center">
                A
              </div>
              <div>
                <h3 className="font-heading font-bold text-lg text-slate-900">
                  व्यक्तिगत जानकारी (Personal Information)
                </h3>
                <p className="text-xs text-slate-500">सभी आवश्यक (*) फील्ड अनिवार्य हैं।</p>
              </div>
            </div>

            {/* Photo Upload Area */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                प्रोफाइल फोटो (Profile Photo) <span className="text-slate-400 font-normal">(प्रमाणपत्र हेतु)</span>
              </label>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="w-24 h-28 rounded-xl border-2 border-dashed border-slate-300 bg-white flex items-center justify-center overflow-hidden shrink-0 shadow-2xs">
                  {photoUrl ? (
                    <img src={photoUrl} alt="प्रीव्यू" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center p-2 text-slate-400">
                      <User className="w-8 h-8 mx-auto mb-1" />
                      <span className="text-[10px] block">फोटो प्रीव्यू</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2 flex-1 text-xs">
                  <div className="flex flex-wrap items-center gap-2">
                    <label
                      htmlFor={photoInputId}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-semibold cursor-pointer shadow-xs transition-colors"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{photoUrl ? 'फोटो बदलें' : 'फोटो अपलोड करें'}</span>
                    </label>
                    <input
                      id={photoInputId}
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      onChange={handlePhotoUpload}
                      className="sr-only"
                    />

                    {photoUrl && (
                      <button
                        type="button"
                        onClick={() => setPhotoUrl('')}
                        className="inline-flex items-center gap-1 px-3 py-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>हटाएं</span>
                      </button>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-500">
                    * समर्थित प्रारूप: JPG, JPEG, PNG, WebP (अधिकतम 5MB)। मोबाइल कैमरे से भी फोटो ली जा सकती है।
                  </p>
                  <p className="text-[11px] text-amber-700 italic">
                    * नोट: केवल फोटो अपलोड करने से कोई सदस्य स्वतः सत्यापित नहीं होता; एडमिन समीक्षा अनिवार्य है।
                  </p>
                  {photoError && <div className="text-red-600 text-xs">{photoError}</div>}
                </div>
              </div>
            </div>

            {/* Inputs: Full Name & Father/Guardian */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  पूरा नाम (Full Name) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="उदा. राहुल शर्मा"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  पिता या अभिभावक का नाम <span className="text-slate-400 font-normal">(वैकल्पिक)</span>
                </label>
                <input
                  type="text"
                  value={fatherOrGuardianName}
                  onChange={(e) => setFatherOrGuardianName(e.target.value)}
                  placeholder="उदा. श्री रामेश्वर शर्मा"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:border-emerald-600"
                />
              </div>
            </div>

            {/* Inputs: Mobile, Alternate Mobile & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  मोबाइल नंबर (Mobile) <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="10 अंकों का मोबाइल नंबर"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-mono focus:outline-hidden focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  वैकल्पिक संपर्क नंबर <span className="text-slate-400 font-normal">(वैकल्पिक)</span>
                </label>
                <input
                  type="tel"
                  maxLength={10}
                  value={alternatePhone}
                  onChange={(e) => setAlternatePhone(e.target.value)}
                  placeholder="दूसरा संपर्क नंबर"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-mono focus:outline-hidden focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  ईमेल पता (Email) <span className="text-slate-400 font-normal">(वैकल्पिक)</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="rahul@example.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:border-emerald-600"
                />
              </div>
            </div>

            {/* Application Category */}
            <div className="text-xs sm:text-sm">
              <label className="block font-semibold text-slate-700 mb-1">
                आवेदन का प्रकार (Application Category) <span className="text-red-500">*</span>
              </label>
              <select
                value={applicationType}
                onChange={(e) => setApplicationType(e.target.value as ApplicationType)}
                className="w-full px-4 py-2.5 rounded-xl border-2 border-emerald-600/40 bg-emerald-50/30 text-emerald-950 font-bold focus:outline-hidden focus:border-emerald-700"
              >
                <option value="पर्यावरण स्वयंसेवक">पर्यावरण स्वयंसेवक (Eco Volunteer - घाट सफाई, वृक्षारोपण, जन-जागरूकता)</option>
                <option value="नर्मदा प्रहरी">नर्मदा प्रहरी (Narmada Prahari - घाट निगरानी व प्रदूषण नियंत्रण)</option>
                <option value="सक्रिय सदस्य">सक्रिय सदस्य (Active Foundation Member - सामाजिक नेतृत्व)</option>
              </select>
            </div>

            {/* Inputs: DOB & Gender */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  जन्मतिथि (Date of Birth) <span className="text-slate-400 font-normal">(वैकल्पिक)</span>
                </label>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white focus:outline-hidden focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  लिंग (Gender) <span className="text-slate-400 font-normal">(वैकल्पिक)</span>
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as any)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white focus:outline-hidden focus:border-emerald-600"
                >
                  <option value="">चयन करें</option>
                  <option value="पुरुष">पुरुष (Male)</option>
                  <option value="महिला">महिला (Female)</option>
                  <option value="अन्य">अन्य (Other)</option>
                  <option value="उल्लेख नहीं करना चाहते">उल्लेख नहीं करना चाहते</option>
                </select>
              </div>
            </div>
          </div>

          {/* SECTION B: पता संबंधी जानकारी (CASCADING LOCATION HIERARCHY) */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <div className="w-8 h-8 rounded-full bg-sky-800 text-white font-bold text-sm flex items-center justify-center">
                B
              </div>
              <div>
                <h3 className="font-heading font-bold text-lg text-slate-900">
                  पता एवं क्षेत्रीय स्थान चयन (Location Hierarchy)
                </h3>
                <p className="text-xs text-slate-500">
                  राज्य चुनने के बाद जिले, जिले के बाद तहसील, और तहसील के बाद गाँव स्वतः दिखेंगे।
                </p>
              </div>
            </div>

            {/* Cascading Selectors: State, District */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  राज्य (State) <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedStateId}
                  onChange={(e) => handleStateChange(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white focus:outline-hidden focus:border-sky-600"
                >
                  {locations.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  जिला (District) <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedDistrictId}
                  onChange={(e) => handleDistrictChange(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white focus:outline-hidden focus:border-sky-600"
                >
                  {currentDistricts.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Cascading Selectors: Tehsil & Village */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  तहसील / विकासखंड (Tehsil / Block) <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedTehsilId}
                  onChange={(e) => handleTehsilChange(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white focus:outline-hidden focus:border-sky-600"
                >
                  {currentTehsils.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold text-slate-700">
                    गाँव या शहर (Village / Town) <span className="text-red-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setIsCustomVillage(!isCustomVillage);
                      setSelectedVillageId('');
                    }}
                    className="text-[11px] text-sky-700 font-semibold hover:underline cursor-pointer"
                  >
                    {isCustomVillage ? 'सूची से चुनें' : 'गाँव सूची में नहीं है? लिखें'}
                  </button>
                </div>

                {isCustomVillage ? (
                  <input
                    type="text"
                    required
                    value={customVillageName}
                    onChange={(e) => setCustomVillageName(e.target.value)}
                    placeholder="अपने गाँव अथवा मोहल्ले का नाम लिखें"
                    className="w-full px-4 py-2.5 rounded-xl border border-sky-400 bg-sky-50/50 focus:outline-hidden focus:border-sky-600"
                  />
                ) : (
                  <select
                    value={selectedVillageId}
                    onChange={(e) => setSelectedVillageId(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white focus:outline-hidden focus:border-sky-600"
                  >
                    <option value="">गाँव/वार्ड का चयन करें</option>
                    {currentVillages.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            {/* Pincode & Full Address */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm">
              <div className="sm:col-span-1">
                <label className="block font-semibold text-slate-700 mb-1">
                  पिन कोड (Pincode) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="6 अंकों का पिन कोड"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-mono focus:outline-hidden focus:border-sky-600"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">
                  पूरा पता (Full Address) <span className="text-slate-400 font-normal">(वैकल्पिक)</span>
                </label>
                <input
                  type="text"
                  value={fullAddress}
                  onChange={(e) => setFullAddress(e.target.value)}
                  placeholder="मकान नं., वार्ड, सड़क का नाम..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:border-sky-600"
                />
              </div>
            </div>
          </div>

          {/* SECTION C: सेवा संबंधी जानकारी */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <div className="w-8 h-8 rounded-full bg-amber-600 text-white font-bold text-sm flex items-center justify-center">
                C
              </div>
              <div>
                <h3 className="font-heading font-bold text-lg text-slate-900">
                  सेवा व सहभागिता विवरण (Service Interests)
                </h3>
                <p className="text-xs text-slate-500">माँ नर्मदा संरक्षण में आपकी रुचि व समय।</p>
              </div>
            </div>

            {/* Service Interests Checkboxes */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                सेवा के रुचि क्षेत्र (चयन करें):
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                <label className="p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-emerald-50/50 flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={interestGhatSafai}
                    onChange={(e) => setInterestGhatSafai(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                  <span className="font-medium text-slate-800">नर्मदा घाट सफाई एवं श्रमदान</span>
                </label>

                <label className="p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-emerald-50/50 flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={interestPlasticControl}
                    onChange={(e) => setInterestPlasticControl(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                  <span className="font-medium text-slate-800">प्लास्टिक प्रदूषण नियंत्रण अभियान</span>
                </label>

                <label className="p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-emerald-50/50 flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={interestTreePlantation}
                    onChange={(e) => setInterestTreePlantation(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                  <span className="font-medium text-slate-800">वृक्षारोपण एवं हरित तट संवर्धन</span>
                </label>

                <label className="p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-emerald-50/50 flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={interestEcoAwareness}
                    onChange={(e) => setInterestEcoAwareness(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                  <span className="font-medium text-slate-800">पर्यावरण संरक्षण जन-जागरूकता</span>
                </label>
              </div>
            </div>

            {/* Why Join */}
            <div>
              <label className="block font-semibold text-slate-700 text-xs sm:text-sm mb-1">
                फाउंडेशन से क्यों जुड़ना चाहते हैं? (उद्देश्य) <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={3}
                value={reasonForJoining}
                onChange={(e) => setReasonForJoining(e.target.value)}
                placeholder="उदा. माँ नर्मदा की सेवा, स्वच्छता श्रमदान और पर्यावरण को प्लास्टिक मुक्त बनाने के संकल्प के साथ।"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-hidden focus:border-emerald-600"
              />
            </div>

            {/* Available Time & Past Experience */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  उपलब्ध समय (Availability)
                </label>
                <select
                  value={availableTime}
                  onChange={(e) => setAvailableTime(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white focus:outline-hidden focus:border-emerald-600"
                >
                  <option value="सप्ताहांत (शनिवार / रविवार)">सप्ताहांत (शनिवार / रविवार)</option>
                  <option value="प्रतिदिन सुबह 2 घंटे">प्रतिदिन सुबह 2 घंटे</option>
                  <option value="मासिक 1-2 बार श्रमदान">मासिक 1-2 बार श्रमदान</option>
                  <option value="विशेष पर्वों व नर्मदा जयंती पर">विशेष पर्वों व नर्मदा जयंती पर</option>
                  <option value="ऑनलाइन जागरूकता / प्रचार">ऑनलाइन जागरूकता / प्रचार</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  पूर्व सामाजिक कार्य अनुभव <span className="text-slate-400 font-normal">(वैकल्पिक)</span>
                </label>
                <input
                  type="text"
                  value={pastExperience}
                  onChange={(e) => setPastExperience(e.target.value)}
                  placeholder="उदा. पूर्व में घाट सफाई, पौधरोपण, NSS आदि"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:border-emerald-600"
                />
              </div>
            </div>
          </div>

          {/* CONSENT & AGREEMENT CHECKBOXES */}
          <div className="bg-emerald-50/70 p-6 rounded-3xl border-2 border-emerald-200 space-y-3 text-xs sm:text-sm text-emerald-950">
            <h4 className="font-bold text-emerald-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-700" />
              <span>सहमति एवं घोषणा (Consent & Agreement):</span>
            </h4>

            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                required
                checked={consentDataUsage}
                onChange={(e) => setConsentDataUsage(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded mt-0.5"
              />
              <span className="leading-relaxed">
                मैं प्रमाणित करता/करती हूँ कि दी गई जानकारी सत्य है। मैं फाउंडेशन द्वारा केवल नर्मदा
                संरक्षण व स्वयंसेवक समन्वय हेतु मेरे विवरण के उपयोग की सहमति देता/देती हूँ।
              </span>
            </label>

            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                required
                checked={consentPhotoUsage}
                onChange={(e) => setConsentPhotoUsage(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded mt-0.5"
              />
              <span className="leading-relaxed">
                मैं अपनी प्रोफाइल फोटो को केवल स्वयंसेवक पहचान पत्र और सदस्यता प्रमाणपत्र पर मुद्रित
                करने की सहमति देता/देती हूँ।
              </span>
            </label>
          </div>

          {/* SUBMIT BUTTON -> OPENS REVIEW MODAL */}
          <div className="text-center">
            <button
              type="submit"
              className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-gradient-to-r from-emerald-700 via-sky-800 to-emerald-900 hover:from-emerald-800 hover:to-sky-900 text-white font-bold text-base shadow-lg hover:shadow-xl transition-all cursor-pointer inline-flex items-center justify-center gap-2"
            >
              <FileText className="w-5 h-5 text-amber-300" />
              <span>आवेदन की समीक्षा करें व आगे बढ़ें →</span>
            </button>
            <p className="text-xs text-slate-500 mt-2">
              * जमा करने से पहले आपको अपनी सभी जानकारियों की दोबारा जांच करने का अवसर मिलेगा।
            </p>
          </div>
        </form>
      )}

      {/* ================= PRE-SUBMISSION REVIEW MODAL ================= */}
      {reviewModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-emerald-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-gradient-to-r from-emerald-900 to-sky-900 text-white p-5 flex items-center justify-between">
              <div>
                <h3 className="font-heading font-bold text-lg">
                  आवेदन विवरण की पुष्टि (Review & Confirm)
                </h3>
                <p className="text-xs text-emerald-200">
                  कृपया सुनिश्चित करें कि आपकी सभी जानकारियां सही हैं।
                </p>
              </div>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-700">
              {/* Photo & Name Snapshot */}
              <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="w-16 h-16 rounded-xl bg-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
                  {photoUrl ? (
                    <img src={photoUrl} alt="फोटो" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-8 h-8 text-slate-400" />
                  )}
                </div>
                <div>
                  <div className="font-bold text-base text-slate-900">{fullName}</div>
                  {fatherOrGuardianName && (
                    <div className="text-xs text-slate-600">अभिभावक: {fatherOrGuardianName}</div>
                  )}
                  <div className="text-xs text-emerald-800 font-semibold">फोन: {phone}</div>
                </div>
              </div>

              {/* Location Summary */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                <div className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                  स्थान एवं पता:
                </div>
                <div>
                  <strong>राज्य:</strong> {currentState?.name} • <strong>जिला:</strong>{' '}
                  {currentDistrict?.name} • <strong>तहसील:</strong> {currentTehsil?.name}
                </div>
                <div>
                  <strong>गाँव/शहर:</strong>{' '}
                  {isCustomVillage
                    ? customVillageName
                    : currentVillages.find((v) => v.id === selectedVillageId)?.name || 'स्थानीय क्षेत्र'}{' '}
                  • <strong>पिन कोड:</strong> {pincode}
                </div>
                {fullAddress && <div><strong>पता:</strong> {fullAddress}</div>}
              </div>

              {/* Service & Purpose */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                <div className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                  उद्देश्य एवं सेवा रुचि:
                </div>
                <p className="italic">"{reasonForJoining}"</p>
                <div>
                  <strong>उपलब्धता:</strong> {availableTime}
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setReviewModalOpen(false)}
                className="px-5 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs cursor-pointer flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>संशोधन करें (Edit)</span>
              </button>

              <button
                type="button"
                onClick={handleFinalConfirmSubmit}
                className="px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-md transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4 text-amber-300" />
                <span>पुष्टि करें व आवेदन जमा करें</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Application Acknowledgement Receipt Modal */}
      <ApplicationReceiptModal
        receipt={activeReceipt}
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
        customLogoUrl={customLogoUrl}
        onTrackNow={(ref) => {
          window.location.hash = `#track-application?ref=${ref}`;
        }}
      />
    </div>
  );
};
