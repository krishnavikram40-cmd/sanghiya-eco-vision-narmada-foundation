import React, { useState, useEffect } from 'react';
import {
  getVolunteers,
  getLocations,
  saveLocations,
  isAdminAuthenticated,
  getAdminSessionInfo,
  setAdminAuthenticated,
  exportDatabaseBackup,
  importDatabaseBackup,
  getAuditLogs,
  getPermanentLogo,
  savePermanentLogo,
  resetPermanentLogo,
  approveApplication,
  rejectApplication,
  updateApplicationStatus,
  getFounderSignatureConfig,
  saveFounderSignatureConfig,
  resetFounderSignatureConfig,
} from '../services/volunteerService';
import {
  apiAdminLogin,
  apiAdminApprove,
  apiAdminReject,
  apiAdminUpdateStatus,
} from '../services/apiClient';
import {
  VolunteerProfile,
  VerificationStatus,
  LocationState,
  LocationDistrict,
  LocationTehsil,
  LocationVillage,
  AuditLogEntry,
  OfficerApplication,
  OfficerApplicationStatus,
  FounderSignatureConfig,
} from '../types';
import { CertificateView } from '../components/CertificateView';
import { CustomEmblem } from '../components/CustomEmblem';
import { SITE_CONFIG } from '../config/siteConfig';
import {
  fetchAllOfficers,
  setOfficerRoleInFirestore,
  revokeOfficerAccess,
  FirebaseUserProfile,
  fetchOfficerApplications,
  updateOfficerApplicationStatus,
  appointOfficerFromApplication,
  loginSuperAdminWithEmail,
  setupFounderFirstTimeAccount,
  requestPasswordReset,
} from '../services/firebaseAuthService';
import {
  ShieldAlert,
  ShieldCheck,
  Users,
  Search,
  Filter,
  Download,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Eye,
  Edit,
  Plus,
  Trash2,
  FileSpreadsheet,
  Lock,
  LogOut,
  MapPin,
  Sparkles,
  BarChart3,
  Calendar,
  Layers,
  ChevronDown,
  X,
  Database,
  UploadCloud,
  HardDrive,
  FileCode,
  History,
  Image as ImageIcon,
  KeyRound,
  RotateCcw,
  Check,
  Award,
  AlertCircle,
  UserCheck,
  UserX,
  UserPlus,
  FileText,
  PenTool,
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [adminIdInput, setAdminIdInput] = useState('SEVNF-ADMIN-01');
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [adminInfo, setAdminInfo] = useState<{
    adminId: string;
    name: string;
    role: string;
    email?: string;
    isSuperAdmin?: boolean;
  }>({
    adminId: 'SEVNF-ADMIN-01',
    name: 'मुख्य अधिकृत एडमिन',
    role: 'Chief Administrator',
  });

  // Founder / Super Admin Login States
  const [loginMode, setLoginMode] = useState<'founder' | 'passcode'>('founder');
  const [founderEmail, setFounderEmail] = useState('vikramstar864@gmail.com');
  const [founderPassword, setFounderPassword] = useState('');
  const [founderResetNotice, setFounderResetNotice] = useState<string | null>(null);
  const [showFounderFirstTimeModal, setShowFounderFirstTimeModal] = useState(false);
  const [founderFirstTimePass, setFounderFirstTimePass] = useState('');
  const [founderFirstTimeConfirmPass, setFounderFirstTimeConfirmPass] = useState('');

  // Main Data States
  const [volunteers, setVolunteers] = useState<VolunteerProfile[]>([]);
  const [locations, setLocations] = useState<LocationState[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [officersList, setOfficersList] = useState<FirebaseUserProfile[]>([]);
  const [activeTab, setActiveTab] = useState<
    'volunteers' | 'officers' | 'analytics' | 'auditLogs' | 'locations' | 'logo' | 'backup' | 'certificateSettings'
  >('volunteers');

  // Founder Signature Management State
  const [signatureConfig, setSignatureConfig] = useState<FounderSignatureConfig>(getFounderSignatureConfig());
  const [signatureSaveNotice, setSignatureSaveNotice] = useState<string | null>(null);

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('सभी');
  const [filterDistrict, setFilterDistrict] = useState<string>('सभी');
  const [filterService, setFilterService] = useState<string>('सभी');

  // Selected Volunteer Modal & Verification Editor
  const [selectedVolunteer, setSelectedVolunteer] = useState<VolunteerProfile | null>(null);
  const [certificatePreviewModal, setCertificatePreviewModal] = useState<VolunteerProfile | null>(null);
  const [rejectionReasonInput, setRejectionReasonInput] = useState('');
  const [showRejectBox, setShowRejectBox] = useState(false);
  const [adminCommentInput, setAdminCommentInput] = useState('');
  const [actionSuccessNotice, setActionSuccessNotice] = useState<string | null>(null);

  // Logo Management State
  const [customLogoUrlInput, setCustomLogoUrlInput] = useState(getPermanentLogo());
  const [logoSaveNotice, setLogoSaveNotice] = useState<string | null>(null);

  // Authorized CSV Download confirmation
  const [csvConsentModal, setCsvConsentModal] = useState(false);

  // Location Management State
  const [selectedLocState, setSelectedLocState] = useState<string>('mp');
  const [newDistrictName, setNewDistrictName] = useState('');
  const [newTehsilName, setNewTehsilName] = useState('');
  const [newVillageName, setNewVillageName] = useState('');
  const [locTargetDistrictId, setLocTargetDistrictId] = useState('');
  const [locTargetTehsilId, setLocTargetTehsilId] = useState('');
  const [locSuccessMessage, setLocSuccessMessage] = useState('');

  // Backup & Safety State
  const [backupNotice, setBackupNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Officer Management State
  const [newOfficerUid, setNewOfficerUid] = useState('');
  const [newOfficerEmail, setNewOfficerEmail] = useState('');
  const [newOfficerName, setNewOfficerName] = useState('');
  const [newOfficerRole, setNewOfficerRole] = useState<'officer' | 'superadmin'>('officer');
  const [newOfficerZone, setNewOfficerZone] = useState('रायसेन व नर्मदा तट परिक्षेत्र');
  const [officerActionNotice, setOfficerActionNotice] = useState<string | null>(null);
  const [isSavingOfficer, setIsSavingOfficer] = useState(false);

  // Confidential Officer Application Workflow State
  const [officerApps, setOfficerApps] = useState<OfficerApplication[]>([]);
  const [selectedOfficerApp, setSelectedOfficerApp] = useState<OfficerApplication | null>(null);
  const [officerAppFilter, setOfficerAppFilter] = useState<'all' | 'Pending' | 'Under Review' | 'Approved' | 'Rejected'>('all');
  const [officerSubTab, setOfficerSubTab] = useState<'applications' | 'officers' | 'manualAdd'>('applications');
  const [appointZoneInput, setAppointZoneInput] = useState('रायसेन व बाड़ी परिक्षेत्र (मध्य प्रदेश)');
  const [appRejectReasonInput, setAppRejectReasonInput] = useState('');
  const [showRejectAppBox, setShowRejectAppBox] = useState(false);
  const [isProcessingApp, setIsProcessingApp] = useState(false);

  // Check existing session on load
  useEffect(() => {
    if (isAdminAuthenticated()) {
      setIsAuthenticated(true);
      setAdminInfo(getAdminSessionInfo());
      loadData();
    }
  }, []);

  const loadData = async () => {
    setVolunteers(getVolunteers());
    setLocations(getLocations());
    setAuditLogs(getAuditLogs());

    try {
      const officers = await fetchAllOfficers();
      setOfficersList(officers);
    } catch {
      // ignore
    }

    try {
      const apps = await fetchOfficerApplications();
      setOfficerApps(apps);
    } catch {
      // ignore
    }
  };

  const handleFounderLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setFounderResetNotice(null);

    if (!founderPassword) {
      setAuthError('कृपया अपना सुपर एडमिन पासवर्ड दर्ज करें।');
      return;
    }

    setIsLoggingIn(true);
    const res = await loginSuperAdminWithEmail(founderEmail.trim(), founderPassword);
    setIsLoggingIn(false);

    if (res.success && res.profile) {
      setIsAuthenticated(true);
      setAdminAuthenticated(true);
      const superAdminInfo = {
        adminId: 'SEVNF-FOUNDER-01',
        name: 'बेनी सिंह केवट (संस्थापक)',
        role: 'संस्थापक एवं मुख्य संरक्षक (Super Admin)',
        email: 'vikramstar864@gmail.com',
        isSuperAdmin: true,
      };
      setAdminInfo(superAdminInfo);
      setFounderPassword('');
      loadData();
    } else {
      setAuthError(res.error || 'सुपर एडमिन लॉगिन में विफलता।');
    }
  };

  const handleFounderSendReset = async () => {
    setAuthError('');
    setFounderResetNotice(null);
    setIsLoggingIn(true);
    const res = await requestPasswordReset(founderEmail.trim());
    setIsLoggingIn(false);
    if (res.success) {
      setFounderResetNotice(
        `संस्थापक ईमेल (${founderEmail}) पर पासवर्ड रीसेट का आधिकारिक Google/Firebase लिंक भेज दिया गया है। कृपया अपना इनबॉक्स / स्पैम फोल्डर देखें।`
      );
    } else {
      setAuthError(res.error || 'पासवर्ड रीसेट लिंक नहीं भेजा जा सका।');
    }
  };

  const handleFounderFirstTimeSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    if (!founderFirstTimePass || founderFirstTimePass.length < 6) {
      setAuthError('पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।');
      return;
    }
    if (founderFirstTimePass !== founderFirstTimeConfirmPass) {
      setAuthError('दोनों पासवर्ड मेल नहीं खाते। कृपया पुनः जांचें।');
      return;
    }

    setIsLoggingIn(true);
    const res = await setupFounderFirstTimeAccount(founderFirstTimePass);
    setIsLoggingIn(false);

    if (res.success && res.profile) {
      setShowFounderFirstTimeModal(false);
      setIsAuthenticated(true);
      setAdminAuthenticated(true);
      const superAdminInfo = {
        adminId: 'SEVNF-FOUNDER-01',
        name: 'बेनी सिंह केवट (संस्थापक)',
        role: 'संस्थापक एवं मुख्य संरक्षक (Super Admin)',
        email: 'vikramstar864@gmail.com',
        isSuperAdmin: true,
      };
      setAdminInfo(superAdminInfo);
      setFounderFirstTimePass('');
      setFounderFirstTimeConfirmPass('');
      loadData();
    } else {
      setAuthError(res.error || 'खाता सेटअप में विफलता।');
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsLoggingIn(true);

    const res = await apiAdminLogin(adminIdInput.trim(), adminPasswordInput);
    setIsLoggingIn(false);

    if (res.success && res.admin) {
      setIsAuthenticated(true);
      setAdminInfo(res.admin);
      setAdminPasswordInput('');
      loadData();
    } else {
      setAuthError(res.error || 'अमान्य एडमिन क्रेडेंशियल। कृपया सही पासकोड दर्ज करें (डिफ़ॉल्ट: narmada2026)');
    }
  };

  const handleAdminLogout = () => {
    setAdminAuthenticated(false);
    setIsAuthenticated(false);
    setSelectedVolunteer(null);
  };

  // Filter Logic
  const filteredVolunteers = volunteers.filter((v) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      v.fullName.toLowerCase().includes(q) ||
      v.id.toLowerCase().includes(q) ||
      (v.applicationReference && v.applicationReference.toLowerCase().includes(q)) ||
      (v.memberId && v.memberId.toLowerCase().includes(q)) ||
      v.phone.includes(q) ||
      v.district.toLowerCase().includes(q) ||
      v.tehsil.toLowerCase().includes(q) ||
      v.village.toLowerCase().includes(q);

    const matchesStatus =
      filterStatus === 'सभी' ||
      (filterStatus === 'लंबित' &&
        (v.verificationStatus === 'आवेदन प्राप्त' || v.verificationStatus === 'समीक्षा में')) ||
      v.verificationStatus === filterStatus;

    const matchesDistrict = filterDistrict === 'सभी' || v.district === filterDistrict;
    const matchesService =
      filterService === 'सभी' ||
      v.serviceInterests?.some((s) => s.includes(filterService));

    return matchesSearch && matchesStatus && matchesDistrict && matchesService;
  });

  // Analytics Metrics Calculations
  const totalCount = volunteers.length;
  const verifiedCount = volunteers.filter((v) => v.verificationStatus === 'सत्यापित').length;
  const reviewCount = volunteers.filter(
    (v) => v.verificationStatus === 'समीक्षा में' || v.verificationStatus === 'आवेदन प्राप्त'
  ).length;
  const moreInfoCount = volunteers.filter((v) => v.verificationStatus === 'अतिरिक्त जानकारी आवश्यक').length;
  const rejectedCount = volunteers.filter((v) => v.verificationStatus === 'अस्वीकृत').length;

  // Breakdown by District
  const districtCounts = volunteers.reduce((acc, v) => {
    acc[v.district] = (acc[v.district] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Breakdown by Service Interests
  const serviceCounts = volunteers.reduce((acc, v) => {
    v.serviceInterests?.forEach((s) => {
      acc[s] = (acc[s] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  // Approve Application Handler (Generates Member ID!)
  const handleApproveApplication = async (vol: VolunteerProfile) => {
    const res = await apiAdminApprove(vol.id, adminCommentInput);
    if (res.success && res.application) {
      setSelectedVolunteer(res.application);
      loadData();
      setActionSuccessNotice(`आवेदन स्वीकृत हुआ! सदस्य आईडी जारी: ${res.application.memberId}`);
      setTimeout(() => setActionSuccessNotice(null), 4000);
    }
  };

  // Reject Application Handler
  const handleRejectApplication = async (vol: VolunteerProfile) => {
    if (!rejectionReasonInput.trim()) {
      alert('कृपया अस्वीकृति का कारण लिखें।');
      return;
    }

    const res = await apiAdminReject(vol.id, rejectionReasonInput.trim());
    if (res.success && res.application) {
      setSelectedVolunteer(res.application);
      setShowRejectBox(false);
      setRejectionReasonInput('');
      loadData();
      setActionSuccessNotice('आवेदन अस्वीकृत किया गया।');
      setTimeout(() => setActionSuccessNotice(null), 4000);
    }
  };

  // Request Info Handler
  const handleRequestInfo = async (vol: VolunteerProfile) => {
    const note = prompt('कृपया आवेदक से मांगी जाने वाली अतिरिक्त जानकारी का विवरण दर्ज करें:');
    if (!note) return;

    const res = await apiAdminUpdateStatus(vol.id, 'अतिरिक्त जानकारी आवश्यक', note);
    if (res.success && res.application) {
      setSelectedVolunteer(res.application);
      loadData();
      setActionSuccessNotice('स्थिति "अतिरिक्त जानकारी आवश्यक" में अद्यतन की गई।');
      setTimeout(() => setActionSuccessNotice(null), 4000);
    }
  };

  // Permanent Logo Handlers
  const handleSaveLogo = () => {
    if (!customLogoUrlInput.trim()) return;
    savePermanentLogo(customLogoUrlInput.trim());
    fetch('/api/config/logo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${sessionStorage.getItem('sanghiya_admin_jwt_token')}`,
      },
      body: JSON.stringify({ logoUrl: customLogoUrlInput.trim() }),
    }).catch(() => {});

    setLogoSaveNotice('लोगो स्थायी रूप से सुरक्षित कर दिया गया है!');
    setTimeout(() => setLogoSaveNotice(null), 3000);
  };

  const handleResetLogo = () => {
    resetPermanentLogo();
    setCustomLogoUrlInput('/file_00000000306082118bbb5f0c42339ad4.png');
    setLogoSaveNotice('आधिकारिक डिफ़ॉल्ट लोगो पुनर्स्थापित किया गया!');
    setTimeout(() => setLogoSaveNotice(null), 3000);
  };

  const handleUploadLogoFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const b64 = reader.result as string;
      setCustomLogoUrlInput(b64);
      savePermanentLogo(b64);
      setLogoSaveNotice('अपलोड किया गया लोगो स्थायी रूप से सुरक्षित हो गया!');
      setTimeout(() => setLogoSaveNotice(null), 3000);
    };
    reader.readAsDataURL(file);
  };

  // Founder Signature Management Handlers
  const handleUploadSignatureFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('हस्ताक्षर छवि का आकार 5MB से कम होना चाहिए।');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const b64 = reader.result as string;
      setSignatureConfig((prev) => ({ ...prev, imageUrl: b64 }));
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleSaveSignature = () => {
    const updated = saveFounderSignatureConfig({
      ...signatureConfig,
      updatedBy: adminInfo.name || 'श्री बेनी सिंह केवट (संस्थापक)',
    });
    setSignatureConfig(updated);
    setSignatureSaveNotice('संस्थापक डिजिटल हस्ताक्षर सेटिंग्स सफलतापूर्वक सहेजी गईं!');
    setTimeout(() => setSignatureSaveNotice(null), 3500);
  };

  const handleResetSignature = () => {
    if (confirm('क्या आप डिफ़ॉल्ट अधिकृत हस्ताक्षर पुनर्स्थापित करना चाहते हैं?')) {
      const res = resetFounderSignatureConfig();
      setSignatureConfig(res);
      setSignatureSaveNotice('डिफ़ॉल्ट अधिकृत हस्ताक्षर बहाल किया गया!');
      setTimeout(() => setSignatureSaveNotice(null), 3500);
    }
  };

  const handlePreviewCertificateWithSignature = () => {
    const sample = volunteers.find((v) => v.verificationStatus === 'सत्यापित') || volunteers[0] || {
      id: 'SEVNF-VOL-SAMPLE',
      memberId: 'MP-RAI-2026-0001',
      certificateNumber: 'SEVNF/CERT/2026/0001',
      fullName: 'श्री बेनी सिंह केवट (नमूना)',
      fatherOrGuardianName: 'श्री रामचरण केवट',
      phone: '9826012345',
      email: 'founder@sanghiyanarmada.org',
      gender: 'पुरुष',
      dob: '1980-01-01',
      state: 'मध्य प्रदेश',
      district: 'रायसेन',
      tehsil: 'बाड़ी',
      village: 'बकतरा',
      pincode: '464665',
      verificationStatus: 'सत्यापित' as VerificationStatus,
      registeredAt: '01/01/2026',
      verifiedAt: '02/01/2026',
      verifiedBy: 'संस्थापक व मुख्य संरक्षक',
      applicationType: 'पर्यावरण स्वयंसेवक',
      serviceInterests: ['नर्मदा परिक्रमा सेवा', 'पर्यावरण एवं स्वच्छता', 'वृक्षारोपण'],
      reasonForJoining: 'माँ नर्मदा सेवा, परिक्रमा पथ संवर्धन व पर्यावरण संरक्षण संकल्प।',
    };
    setCertificatePreviewModal(sample);
  };

  // Location Handlers
  const handleAddDistrict = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDistrictName.trim()) return;

    const locs = [...locations];
    const st = locs.find((s) => s.id === selectedLocState);
    if (st) {
      if (!st.districts) st.districts = [];
      const newD: LocationDistrict = {
        id: `${selectedLocState}-${Date.now().toString().slice(-4)}`,
        name: newDistrictName.trim(),
        stateId: selectedLocState,
        isActive: true,
        tehsils: [],
      };
      st.districts.push(newD);
      saveLocations(locs);
      setLocations(locs);
      setNewDistrictName('');
      setLocSuccessMessage('नया जिला सफलतापूर्वक जोड़ दिया गया!');
      setTimeout(() => setLocSuccessMessage(''), 3000);
    }
  };

  const handleAddTehsil = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTehsilName.trim() || !locTargetDistrictId) return;

    const locs = [...locations];
    let dist: LocationDistrict | undefined;
    for (const s of locs) {
      dist = s.districts?.find((d) => d.id === locTargetDistrictId);
      if (dist) break;
    }

    if (dist) {
      if (!dist.tehsils) dist.tehsils = [];
      const newT: LocationTehsil = {
        id: `${locTargetDistrictId}-${Date.now().toString().slice(-4)}`,
        name: newTehsilName.trim(),
        districtId: locTargetDistrictId,
        isActive: true,
        villages: [],
      };
      dist.tehsils.push(newT);
      saveLocations(locs);
      setLocations(locs);
      setNewTehsilName('');
      setLocSuccessMessage('नई तहसील सफलतापूर्वक जोड़ दी गई!');
      setTimeout(() => setLocSuccessMessage(''), 3000);
    }
  };

  const handleAddVillage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVillageName.trim() || !locTargetTehsilId) return;

    const locs = [...locations];
    for (const st of locs) {
      for (const dist of st.districts || []) {
        const teh = dist.tehsils?.find((t) => t.id === locTargetTehsilId);
        if (teh) {
          if (!teh.villages) teh.villages = [];
          const newV: LocationVillage = {
            id: `v-${Date.now().toString().slice(-5)}`,
            name: newVillageName.trim(),
            tehsilId: locTargetTehsilId,
            isActive: true,
          };
          teh.villages.push(newV);
          saveLocations(locs);
          setLocations(locs);
          setNewVillageName('');
          setLocSuccessMessage('नया गाँव सफलतापूर्वक जोड़ दिया गया!');
          setTimeout(() => setLocSuccessMessage(''), 3000);
          return;
        }
      }
    }
  };

  // Backup Handlers
  const handleExportBackup = () => {
    try {
      const jsonStr = exportDatabaseBackup();
      const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Sanghiya_Narmada_Database_Backup_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setBackupNotice({
        type: 'success',
        message: 'डेटाबेस बैकअप (JSON) सफलतापूर्वक डाउनलोड हो गया है!',
      });
      setTimeout(() => setBackupNotice(null), 4000);
    } catch {
      setBackupNotice({
        type: 'error',
        message: 'बैकअप तैयार करने में समस्या आई।',
      });
    }
  };

  const handleImportBackupFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (!content) return;

      const result = importDatabaseBackup(content);
      if (result.success) {
        loadData();
        setBackupNotice({
          type: 'success',
          message: result.message,
        });
      } else {
        setBackupNotice({
          type: 'error',
          message: result.message,
        });
      }
      setTimeout(() => setBackupNotice(null), 5000);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Authorized CSV Export
  const executeAuthorizedCsvExport = () => {
    setCsvConsentModal(false);

    const headers =
      'आवेदन_संख्या,सदस्य_ID,प्रमाणपत्र_क्रमांक,पूरा_नाम,पिता_अभिभावक,मोबाइल,वैकल्पिक_फोन,ईमेल,लिंग,जन्मदिनांक,राज्य,जिला,तहसील,गाँव,पिनकोड,सत्यापन_स्थिति,पंजीकरण_तिथि,सत्यापन_तिथि,सत्यापनकर्ता,सेवा_रुचि\n';
    const rows = filteredVolunteers
      .map(
        (v) =>
          `"${v.applicationReference || v.id}","${v.memberId || ''}","${v.certificateNumber}","${v.fullName}","${v.fatherOrGuardianName || ''}","${v.phone}","${v.alternatePhone || ''}","${v.email || ''}","${v.gender || ''}","${v.dob || ''}","${v.state}","${v.district}","${v.tehsil}","${v.village}","${v.pincode}","${v.verificationStatus}","${v.registeredAt}","${v.verifiedAt || ''}","${v.verifiedBy || ''}","${(v.serviceInterests || []).join('; ')}"`
      )
      .join('\n');

    const blob = new Blob(['\uFEFF' + headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Narmada_Volunteers_Authorized_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // IF NOT AUTHENTICATED -> SHOW OFFICIAL SECURE ADMIN / SUPER ADMIN LOGIN
  if (!isAuthenticated) {
    return (
      <div className="max-w-lg mx-auto px-4 py-12 sm:py-20">
        <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-emerald-500 shadow-2xl space-y-6 text-center">
          <div className="flex justify-center">
            <CustomEmblem size="lg" />
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 mb-2 border border-amber-300">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
              <span>संस्थापक व प्रशासनिक सुरक्षा द्वार • Super Admin Gateway</span>
            </div>
            <h1 className="font-heading font-black text-2xl text-slate-900">
              संस्थापक एवं मुख्य एडमिन पोर्टल
            </h1>
            <p className="text-xs text-slate-600 mt-1">
              {SITE_CONFIG.hindiName} — संस्थापक: श्री बेनी सिंह केवट
            </p>
          </div>

          {/* Login Tabs */}
          <div className="flex p-1 bg-slate-100 rounded-2xl border border-slate-200">
            <button
              type="button"
              onClick={() => {
                setLoginMode('founder');
                setAuthError('');
                setFounderResetNotice(null);
              }}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                loginMode === 'founder'
                  ? 'bg-white text-emerald-900 shadow-xs border border-emerald-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>संस्थापक (Super Admin)</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setLoginMode('passcode');
                setAuthError('');
                setFounderResetNotice(null);
              }}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                loginMode === 'passcode'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-300'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5 text-slate-500" />
              <span>मास्टर पासकोड (वैकल्पिक)</span>
            </button>
          </div>

          {/* Error Notice */}
          {authError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs rounded-xl flex items-start gap-2 text-left animate-in fade-in">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{authError}</span>
            </div>
          )}

          {/* Reset Link Success Notice */}
          {founderResetNotice && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs rounded-xl flex items-start gap-2 text-left animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{founderResetNotice}</span>
            </div>
          )}

          {/* MODE 1: FOUNDER SUPER ADMIN LOGIN */}
          {loginMode === 'founder' ? (
            <form onSubmit={handleFounderLogin} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  संस्थापक आधिकारिक ईमेल (Founder Super Admin Email):
                </label>
                <input
                  type="email"
                  required
                  value={founderEmail}
                  onChange={(e) => setFounderEmail(e.target.value)}
                  placeholder="vikramstar864@gmail.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-medium focus:border-emerald-600 focus:ring-2 focus:ring-emerald-200 focus:outline-hidden"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    सुपर एडमिन पासवर्ड (Password):
                  </label>
                  <button
                    type="button"
                    onClick={handleFounderSendReset}
                    disabled={isLoggingIn}
                    className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 hover:underline cursor-pointer disabled:opacity-50"
                  >
                    पासवर्ड भूल गए? / रीसेट लिंक भेजें
                  </button>
                </div>
                <input
                  type="password"
                  required
                  value={founderPassword}
                  onChange={(e) => setFounderPassword(e.target.value)}
                  placeholder="अपना सुरक्षित पासवर्ड दर्ज करें..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-emerald-600 focus:ring-2 focus:ring-emerald-200 focus:outline-hidden"
                />
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-800 via-teal-800 to-sky-900 hover:from-emerald-900 hover:to-sky-950 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
              >
                <ShieldCheck className="w-4 h-4 text-amber-300" />
                <span>{isLoggingIn ? 'सत्यापन हो रहा है...' : 'Super Admin लॉगिन करें'}</span>
              </button>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 text-center">
                <p className="text-[11px] text-slate-600">
                  क्या आप पहली बार पासवर्ड बना रहे हैं या ईमेल का नया पासवर्ड सेट करना चाहते हैं?
                </p>
                <div className="flex justify-center gap-3 text-xs font-bold">
                  <button
                    type="button"
                    onClick={handleFounderSendReset}
                    className="text-emerald-800 hover:underline cursor-pointer"
                  >
                    📧 ईमेल पर रीसेट लिंक प्राप्त करें
                  </button>
                  <span className="text-slate-300">|</span>
                  <button
                    type="button"
                    onClick={() => setShowFounderFirstTimeModal(true)}
                    className="text-sky-800 hover:underline cursor-pointer"
                  >
                    ✨ नया पासवर्ड बनाएं
                  </button>
                </div>
              </div>
            </form>
          ) : (
            /* MODE 2: EMERGENCY MASTER PASSCODE */
            <form onSubmit={handleAdminLogin} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  आधिकारिक एडमिन आईडी (Admin ID):
                </label>
                <input
                  type="text"
                  required
                  value={adminIdInput}
                  onChange={(e) => setAdminIdInput(e.target.value)}
                  placeholder="SEVNF-ADMIN-01"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-mono uppercase focus:border-emerald-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  एडमिन पासवर्ड (Password):
                </label>
                <input
                  type="password"
                  required
                  value={adminPasswordInput}
                  onChange={(e) => setAdminPasswordInput(e.target.value)}
                  placeholder="पासवर्ड दर्ज करें..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-mono focus:border-emerald-600 focus:outline-hidden"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  * आपातकालीन पासकोड: <code className="text-emerald-700 font-bold">narmada2026</code>
                </span>
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
              >
                <KeyRound className="w-4 h-4 text-amber-300" />
                <span>{isLoggingIn ? 'प्रमाणीकरण हो रहा है...' : 'पासकोड से लॉगिन करें'}</span>
              </button>
            </form>
          )}

          <p className="text-[11px] text-slate-500 pt-2 border-t border-slate-100">
            * सर्वर-साइड व डेटाबेस आरबीएसी (RBAC): संस्थापक (Super Admin) के पास अधिकारी नियुक्ति, समीक्षा, निलंबन एवं पूर्ण संस्था नियंत्रण के अनन्य अधिकार सुरक्षित हैं।
          </p>
        </div>

        {/* First Time Founder Password Setup Modal */}
        {showFounderFirstTimeModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 text-left space-y-4 animate-in zoom-in-95">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-heading font-black text-lg text-slate-900">
                    संस्थापक खाता सक्रियण व पासवर्ड निर्धारण
                  </h3>
                  <p className="text-xs text-slate-600">
                    ईमेल: <strong>vikramstar864@gmail.com</strong> (श्री बेनी सिंह केवट)
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowFounderFirstTimeModal(false)}
                  className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs text-slate-600 bg-sky-50 border border-sky-100 p-3 rounded-xl leading-relaxed">
                यह सुविधा केवल संस्थापक के लिए है। अपना नया पासवर्ड निर्धारित करें (न्यूनतम 6 अक्षर)। यह पासवर्ड सुरक्षित रूप से सीधे आपके Firebase प्रोजेक्ट में दर्ज होगा।
              </p>

              <form onSubmit={handleFounderFirstTimeSetup} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    नया पासवर्ड (New Password):
                  </label>
                  <input
                    type="password"
                    required
                    value={founderFirstTimePass}
                    onChange={(e) => setFounderFirstTimePass(e.target.value)}
                    placeholder="कम से कम 6 अक्षर..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    पासवर्ड पुनः दर्ज करें (Confirm Password):
                  </label>
                  <input
                    type="password"
                    required
                    value={founderFirstTimeConfirmPass}
                    onChange={(e) => setFounderFirstTimeConfirmPass(e.target.value)}
                    placeholder="वही पासवर्ड दोबारा लिखें..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    type="submit"
                    disabled={isLoggingIn}
                    className="flex-1 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-md transition cursor-pointer disabled:opacity-50"
                  >
                    {isLoggingIn ? 'सक्रियण हो रहा है...' : 'पासवर्ड सहेजें व लॉगिन करें'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowFounderFirstTimeModal(false)}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold cursor-pointer"
                  >
                    रद्द करें
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // AUTHENTICATED ADMIN DASHBOARD
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Top Header & Admin Profile */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <CustomEmblem size="sm" />
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-heading font-black text-xl text-slate-900">
                प्रशासनिक नियंत्रण कक्ष (Admin Control Room)
              </h1>
              {adminInfo.isSuperAdmin ? (
                <span className="px-3 py-1 rounded-full text-xs font-black bg-gradient-to-r from-amber-200 via-amber-300 to-yellow-400 text-amber-950 border border-amber-400 shadow-xs flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-900" />
                  <span>संस्थापक एवं Super Admin (सर्वोच्च अधिकार)</span>
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  सक्रिय सत्र: {adminInfo.adminId}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-600">
              {adminInfo.name} • {SITE_CONFIG.hindiName}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setCsvConsentModal(true)}
            className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            title="अधिकृत CSV रिकॉर्ड डाउनलोड करें"
          >
            <FileSpreadsheet className="w-4 h-4 text-amber-300" />
            <span>CSV निर्यात (Export)</span>
          </button>
          <button
            onClick={handleAdminLogout}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer border border-slate-300"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>लॉग आउट</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap border-b border-slate-200 bg-white rounded-2xl p-1.5 shadow-2xs gap-1">
        <button
          onClick={() => setActiveTab('volunteers')}
          className={`py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm cursor-pointer transition-all flex items-center gap-1.5 ${
            activeTab === 'volunteers'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>आवेदन व सदस्य ({totalCount})</span>
        </button>

        <button
          onClick={() => setActiveTab('officers')}
          className={`py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm cursor-pointer transition-all flex items-center gap-1.5 ${
            activeTab === 'officers'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <UserCheck className="w-4 h-4 text-amber-300" />
          <span>अधिकारी प्रबंधन (Officers)</span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm cursor-pointer transition-all flex items-center gap-1.5 ${
            activeTab === 'analytics'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>सांख्यिकी व रिपोर्ट</span>
        </button>

        <button
          onClick={() => setActiveTab('auditLogs')}
          className={`py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm cursor-pointer transition-all flex items-center gap-1.5 ${
            activeTab === 'auditLogs'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <History className="w-4 h-4" />
          <span>ऑडिट लॉग्स ({auditLogs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('locations')}
          className={`py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm cursor-pointer transition-all flex items-center gap-1.5 ${
            activeTab === 'locations'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>स्थान प्रबंधन</span>
        </button>

        <button
          onClick={() => setActiveTab('logo')}
          className={`py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm cursor-pointer transition-all flex items-center gap-1.5 ${
            activeTab === 'logo'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>लोगो प्रबंधन</span>
        </button>

        <button
          onClick={() => setActiveTab('backup')}
          className={`py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm cursor-pointer transition-all flex items-center gap-1.5 ${
            activeTab === 'backup'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>डेटा बैकअप</span>
        </button>

        <button
          onClick={() => setActiveTab('certificateSettings')}
          className={`py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm cursor-pointer transition-all flex items-center gap-1.5 ${
            activeTab === 'certificateSettings'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <PenTool className="w-4 h-4 text-amber-300" />
          <span>प्रमाणपत्र व हस्ताक्षर</span>
        </button>
      </div>

      {actionSuccessNotice && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-sm font-bold flex items-center gap-2 shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>{actionSuccessNotice}</span>
        </div>
      )}

      {/* ================= TAB 1: APPLICATIONS & VOLUNTEERS ================= */}
      {activeTab === 'volunteers' && (
        <div className="space-y-6">
          {/* Quick Filter Status Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <button
              onClick={() => setFilterStatus('सभी')}
              className={`p-3.5 rounded-2xl border text-left transition cursor-pointer ${
                filterStatus === 'सभी'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span className="text-[11px] block font-semibold opacity-80">सभी आवेदन</span>
              <span className="text-xl font-black">{totalCount}</span>
            </button>

            <button
              onClick={() => setFilterStatus('लंबित')}
              className={`p-3.5 rounded-2xl border text-left transition cursor-pointer ${
                filterStatus === 'लंबित'
                  ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-md font-bold'
                  : 'bg-white text-amber-700 border-amber-200 hover:bg-amber-50'
              }`}
            >
              <span className="text-[11px] block font-semibold">समीक्षा लंबित (Pending)</span>
              <span className="text-xl font-black">{reviewCount}</span>
            </button>

            <button
              onClick={() => setFilterStatus('सत्यापित')}
              className={`p-3.5 rounded-2xl border text-left transition cursor-pointer ${
                filterStatus === 'सत्यापित'
                  ? 'bg-emerald-700 text-white border-emerald-700 shadow-md'
                  : 'bg-white text-emerald-700 border-emerald-200 hover:bg-emerald-50'
              }`}
            >
              <span className="text-[11px] block font-semibold">स्वीकृत सदस्य (Approved)</span>
              <span className="text-xl font-black">{verifiedCount}</span>
            </button>

            <button
              onClick={() => setFilterStatus('अतिरिक्त जानकारी आवश्यक')}
              className={`p-3.5 rounded-2xl border text-left transition cursor-pointer ${
                filterStatus === 'अतिरिक्त जानकारी आवश्यक'
                  ? 'bg-sky-700 text-white border-sky-700 shadow-md'
                  : 'bg-white text-sky-700 border-sky-200 hover:bg-sky-50'
              }`}
            >
              <span className="text-[11px] block font-semibold">जानकारी आवश्यक</span>
              <span className="text-xl font-black">{moreInfoCount}</span>
            </button>

            <button
              onClick={() => setFilterStatus('अस्वीकृत')}
              className={`p-3.5 rounded-2xl border text-left transition cursor-pointer ${
                filterStatus === 'अस्वीकृत'
                  ? 'bg-rose-700 text-white border-rose-700 shadow-md'
                  : 'bg-white text-rose-700 border-rose-200 hover:bg-rose-50'
              }`}
            >
              <span className="text-[11px] block font-semibold">अस्वीकृत (Rejected)</span>
              <span className="text-xl font-black">{rejectedCount}</span>
            </button>
          </div>

          {/* Search Bar & Secondary Filters */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="नाम, आवेदन संख्या, सदस्य ID, मोबाइल नंबर या गाँव खोजें..."
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:border-emerald-600 focus:outline-hidden"
              />
            </div>

            <div className="flex gap-2">
              <select
                value={filterDistrict}
                onChange={(e) => setFilterDistrict(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white text-slate-700"
              >
                <option value="सभी">सभी जिले</option>
                {Object.keys(districtCounts).map((dist) => (
                  <option key={dist} value={dist}>
                    {dist} ({districtCounts[dist]})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Applications Table */}
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="p-3.5">आवेदक (फोटो व नाम)</th>
                    <th className="p-3.5">आवेदन संदर्भ संख्या</th>
                    <th className="p-3.5">सदस्य ID (Member ID)</th>
                    <th className="p-3.5">स्थान (जिला व तहसील)</th>
                    <th className="p-3.5">स्थिति</th>
                    <th className="p-3.5 text-right">कार्य (Actions)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredVolunteers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-10 text-slate-500">
                        कोई आवेदन रिकॉर्ड नहीं मिला।
                      </td>
                    </tr>
                  ) : (
                    filteredVolunteers.map((vol) => (
                      <tr key={vol.id} className="hover:bg-slate-50/70 transition">
                        <td className="p-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden shrink-0 border border-slate-300">
                              {vol.photoUrl ? (
                                <img
                                  src={vol.photoUrl}
                                  alt=""
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <Users className="w-5 h-5 text-slate-400 m-auto mt-2" />
                              )}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900 text-sm">{vol.fullName}</p>
                              <p className="text-[11px] text-slate-500 font-mono">{vol.phone}</p>
                            </div>
                          </div>
                        </td>

                        <td className="p-3.5">
                          <span className="font-mono font-bold text-emerald-950 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            {vol.applicationReference || vol.id}
                          </span>
                        </td>

                        <td className="p-3.5">
                          {vol.memberId ? (
                            <span className="font-mono font-black text-amber-950 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                              {vol.memberId}
                            </span>
                          ) : (
                            <span className="text-slate-400 italic text-[11px]">अनुमोदन लंबित</span>
                          )}
                        </td>

                        <td className="p-3.5 text-slate-700">
                          {vol.district}, {vol.tehsil}
                        </td>

                        <td className="p-3.5">
                          <span
                            className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] inline-block ${
                              vol.verificationStatus === 'सत्यापित'
                                ? 'bg-emerald-100 text-emerald-800'
                                : vol.verificationStatus === 'अस्वीकृत'
                                ? 'bg-rose-100 text-rose-800'
                                : vol.verificationStatus === 'अतिरिक्त जानकारी आवश्यक'
                                ? 'bg-sky-100 text-sky-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {vol.verificationStatus}
                          </span>
                        </td>

                        <td className="p-3.5 text-right space-x-2">
                          <button
                            onClick={() => {
                              setSelectedVolunteer(vol);
                              setShowRejectBox(false);
                            }}
                            className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-bold text-xs border border-emerald-200 cursor-pointer transition"
                          >
                            समीक्षा / विवरण
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB: OFFICER MANAGEMENT (SUPER ADMIN CONTROL ROOM) ================= */}
      {activeTab === 'officers' && (
        <div className="space-y-6">
          {/* Founder Super Admin Control Room Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-teal-950 text-white p-6 rounded-3xl border border-emerald-800/40 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
                <span>संस्थापक सुपर एडमिन नियंत्रण कक्ष (Founder Super Admin Control Room)</span>
              </div>
              <h2 className="font-heading font-black text-xl text-white">
                संस्थापक: श्री बेनी सिंह केवट (Beni Singh Kewat)
              </h2>
              <p className="text-xs text-slate-300">
                आधिकारिक ईमेल: <strong className="text-amber-300">vikramstar864@gmail.com</strong> •
                Firebase Project: <code className="text-emerald-300">narmada-prahari-india</code>
              </p>
            </div>
            <button
              onClick={loadData}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer self-start md:self-auto border border-white/20"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>डेटा रीफ्रेश करें</span>
            </button>
          </div>

          {officerActionNotice && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2 shadow-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{officerActionNotice}</span>
            </div>
          )}

          {/* Sub Navigation */}
          <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
            <button
              onClick={() => setOfficerSubTab('applications')}
              className={`px-4 py-2 rounded-xl font-bold text-xs transition cursor-pointer flex items-center gap-2 ${
                officerSubTab === 'applications'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>अधिकारी पद हेतु आवेदन ({officerApps.length})</span>
            </button>

            <button
              onClick={() => setOfficerSubTab('officers')}
              className={`px-4 py-2 rounded-xl font-bold text-xs transition cursor-pointer flex items-center gap-2 ${
                officerSubTab === 'officers'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>अधिकृत अधिकारी सूची ({officersList.length})</span>
            </button>

            <button
              onClick={() => setOfficerSubTab('manualAdd')}
              className={`px-4 py-2 rounded-xl font-bold text-xs transition cursor-pointer flex items-center gap-2 ${
                officerSubTab === 'manualAdd'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              <span>सीधा अधिकारी रोल आवंटन</span>
            </button>
          </div>

          {/* ================= SUB-TAB 1: OFFICER APPLICATIONS ================= */}
          {officerSubTab === 'applications' && (
            <div className="space-y-6">
              {/* 5 Stat Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <button
                  onClick={() => setOfficerAppFilter('all')}
                  className={`p-3.5 rounded-2xl border text-left transition cursor-pointer ${
                    officerAppFilter === 'all'
                      ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-[11px] block font-semibold opacity-80">कुल आवेदन</span>
                  <span className="text-xl font-black">{officerApps.length}</span>
                </button>

                <button
                  onClick={() => setOfficerAppFilter('Pending')}
                  className={`p-3.5 rounded-2xl border text-left transition cursor-pointer ${
                    officerAppFilter === 'Pending'
                      ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-md font-bold'
                      : 'bg-white text-amber-700 border-amber-200 hover:bg-amber-50'
                  }`}
                >
                  <span className="text-[11px] block font-semibold">लंबित (Pending)</span>
                  <span className="text-xl font-black">
                    {officerApps.filter((a) => a.status === 'Pending').length}
                  </span>
                </button>

                <button
                  onClick={() => setOfficerAppFilter('Under Review')}
                  className={`p-3.5 rounded-2xl border text-left transition cursor-pointer ${
                    officerAppFilter === 'Under Review'
                      ? 'bg-sky-700 text-white border-sky-700 shadow-md font-bold'
                      : 'bg-white text-sky-700 border-sky-200 hover:bg-sky-50'
                  }`}
                >
                  <span className="text-[11px] block font-semibold">समीक्षाधीन (Review)</span>
                  <span className="text-xl font-black">
                    {officerApps.filter((a) => a.status === 'Under Review').length}
                  </span>
                </button>

                <button
                  onClick={() => setOfficerAppFilter('Approved')}
                  className={`p-3.5 rounded-2xl border text-left transition cursor-pointer ${
                    officerAppFilter === 'Approved'
                      ? 'bg-emerald-700 text-white border-emerald-700 shadow-md font-bold'
                      : 'bg-white text-emerald-700 border-emerald-200 hover:bg-emerald-50'
                  }`}
                >
                  <span className="text-[11px] block font-semibold">स्वीकृत (Approved)</span>
                  <span className="text-xl font-black">
                    {officerApps.filter((a) => a.status === 'Approved').length}
                  </span>
                </button>

                <button
                  onClick={() => setOfficerAppFilter('Rejected')}
                  className={`p-3.5 rounded-2xl border text-left transition cursor-pointer ${
                    officerAppFilter === 'Rejected'
                      ? 'bg-red-700 text-white border-red-700 shadow-md font-bold'
                      : 'bg-white text-red-700 border-red-200 hover:bg-red-50'
                  }`}
                >
                  <span className="text-[11px] block font-semibold">अस्वीकृत (Rejected)</span>
                  <span className="text-xl font-black">
                    {officerApps.filter((a) => a.status === 'Rejected').length}
                  </span>
                </button>
              </div>

              {/* Applications Table */}
              <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
                <div className="p-4 border-b border-slate-200 flex items-center justify-between">
                  <h3 className="font-bold text-sm text-slate-900">
                    अधिकारी पद हेतु प्राप्त आवेदन सूची ({
                      officerAppFilter === 'all'
                        ? officerApps.length
                        : officerApps.filter((a) => a.status === officerAppFilter).length
                    })
                  </h3>
                  <span className="text-[11px] text-slate-500">
                    केवल सुपर एडमिन द्वारा समीक्षा व नियुक्ति योग्य
                  </span>
                </div>

                {officerApps.length === 0 ? (
                  <div className="p-12 text-center space-y-2 text-slate-500 text-xs">
                    <FileText className="w-8 h-8 text-slate-300 mx-auto" />
                    <p>वर्तमान में कोई अधिकारी आवेदन प्राप्त नहीं हुआ है।</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-600">
                        <tr>
                          <th className="p-3">आवेदक नाम</th>
                          <th className="p-3">ईमेल व संपर्क</th>
                          <th className="p-3">गाँव / शहर</th>
                          <th className="p-3">आवेदन तिथि</th>
                          <th className="p-3">वर्तमान स्थिति</th>
                          <th className="p-3">नियुक्ति स्थिति</th>
                          <th className="p-3 text-right">कार्रवाई</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {officerApps
                          .filter((a) => officerAppFilter === 'all' || a.status === officerAppFilter)
                          .map((app) => (
                            <tr key={app.id} className="hover:bg-slate-50">
                              <td className="p-3 font-bold text-slate-900">{app.fullName}</td>
                              <td className="p-3 text-slate-600">
                                <div>{app.email}</div>
                                <div className="text-[11px] text-slate-400 font-mono">{app.phone}</div>
                              </td>
                              <td className="p-3 text-slate-700">{app.cityVillage}</td>
                              <td className="p-3 text-slate-500">{app.appliedAt}</td>
                              <td className="p-3">
                                <span
                                  className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                                    app.status === 'Approved'
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : app.status === 'Rejected'
                                      ? 'bg-red-100 text-red-800'
                                      : app.status === 'Under Review'
                                      ? 'bg-sky-100 text-sky-800'
                                      : 'bg-amber-100 text-amber-900'
                                  }`}
                                >
                                  {app.status === 'Approved'
                                    ? 'स्वीकृत'
                                    : app.status === 'Rejected'
                                    ? 'अस्वीकृत'
                                    : app.status === 'Under Review'
                                    ? 'समीक्षाधीन'
                                    : 'लंबित'}
                                </span>
                              </td>
                              <td className="p-3">
                                {app.appointedAsOfficer ? (
                                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                                    ✓ अधिकारी नियुक्त
                                  </span>
                                ) : (
                                  <span className="text-slate-400 text-[10px]">प्रक्रियाधीन</span>
                                )}
                              </td>
                              <td className="p-3 text-right">
                                <button
                                  onClick={() => {
                                    setSelectedOfficerApp(app);
                                    setShowRejectAppBox(false);
                                    setAppRejectReasonInput('');
                                  }}
                                  className="px-3 py-1.5 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-900 font-bold text-xs border border-sky-200 cursor-pointer transition"
                                >
                                  समीक्षा व निर्णय
                                </button>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ================= SUB-TAB 2: EXISTING OFFICERS ================= */}
          {officerSubTab === 'officers' && (
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="p-5 border-b border-slate-200 flex items-center justify-between">
                <h3 className="font-bold text-sm text-slate-900">
                  वर्तमान अधिकृत अधिकारियों की सूची ({officersList.length})
                </h3>
                <span className="text-[11px] text-slate-500">
                  सुरक्षित Firestore /users व सर्वर डेटाबेस से सत्यापित
                </span>
              </div>

              {officersList.length === 0 ? (
                <div className="p-10 text-center space-y-2 text-slate-500 text-xs">
                  <Users className="w-8 h-8 text-slate-300 mx-auto" />
                  <p>वर्तमान में कोई अतिरिक्त अधिकारी पंजीकृत नहीं है।</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-600">
                      <tr>
                        <th className="p-3">अधिकारी नाम</th>
                        <th className="p-3">ईमेल / संपर्क</th>
                        <th className="p-3">Firebase UID</th>
                        <th className="p-3">भूमिका (Role)</th>
                        <th className="p-3">कार्यक्षेत्र (Zone)</th>
                        <th className="p-3">स्थिति (Status)</th>
                        <th className="p-3 text-right">कार्रवाई</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {officersList.map((off) => (
                        <tr key={off.uid} className="hover:bg-slate-50">
                          <td className="p-3 font-bold text-slate-900">{off.displayName}</td>
                          <td className="p-3 text-slate-600">{off.email || 'उपलब्ध नहीं'}</td>
                          <td className="p-3 font-mono text-[11px] text-slate-500">{off.uid}</td>
                          <td className="p-3">
                            <span
                              className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                                off.role === 'superadmin'
                                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                  : 'bg-sky-100 text-sky-800 border border-sky-300'
                              }`}
                            >
                              {off.role === 'superadmin' ? 'सुपर एडमिन' : 'अधिकारी (Officer)'}
                            </span>
                          </td>
                          <td className="p-3 text-slate-700">{off.assignedZone || 'नर्मदा परिक्षेत्र'}</td>
                          <td className="p-3">
                            {off.isRevoked ? (
                              <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-800 text-[10px] font-bold">
                                निष्क्रिय (Revoked)
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                                सक्रिय (Active)
                              </span>
                            )}
                          </td>
                          <td className="p-3 text-right">
                            {!off.isRevoked ? (
                              <button
                                onClick={async () => {
                                  if (
                                    confirm(
                                      `क्या आप सचमुच अधिकारी '${off.displayName}' का एक्सेस निरस्त (Revoke) करना चाहते हैं?`
                                    )
                                  ) {
                                    const res = await revokeOfficerAccess(off.uid, adminInfo.adminId);
                                    if (res.success) {
                                      setOfficerActionNotice(
                                        `अधिकारी '${off.displayName}' का एक्सेस निरस्त कर दिया गया!`
                                      );
                                      loadData();
                                    } else {
                                      alert(res.error || 'एक्सेस निरस्त करने में विफलता।');
                                    }
                                  }
                                }}
                                className="px-2.5 py-1 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 font-bold text-[11px] border border-red-200 cursor-pointer"
                              >
                                एक्सेस हटाएँ (Revoke)
                              </button>
                            ) : (
                              <button
                                onClick={async () => {
                                  const res = await setOfficerRoleInFirestore(
                                    off.uid,
                                    off.role,
                                    off.displayName,
                                    off.email,
                                    off.assignedZone || 'नर्मदा परिक्षेत्र',
                                    adminInfo.adminId
                                  );
                                  if (res.success) {
                                    setOfficerActionNotice(
                                      `अधिकारी '${off.displayName}' पुनः सक्रिय किया गया!`
                                    );
                                    loadData();
                                  }
                                }}
                                className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-[11px] border border-emerald-200 cursor-pointer"
                              >
                                पुनः सक्रिय करें
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ================= SUB-TAB 3: MANUAL AUTHORIZATION ================= */}
          {officerSubTab === 'manualAdd' && (
            <div className="bg-gradient-to-br from-emerald-50/60 to-white p-6 rounded-3xl border-2 border-emerald-200 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-emerald-950 flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-emerald-700" />
                <span>नया अधिकारी अधिकृत करें (Authorize Officer Manually)</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    अधिकारी का पूरा नाम *
                  </label>
                  <input
                    type="text"
                    value={newOfficerName}
                    onChange={(e) => setNewOfficerName(e.target.value)}
                    placeholder="उदा. श्री सुनील रघुवंशी"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    आधिकारिक ईमेल (Login Email) *
                  </label>
                  <input
                    type="email"
                    value={newOfficerEmail}
                    onChange={(e) => setNewOfficerEmail(e.target.value)}
                    placeholder="officer@sanghiyanarmada.org"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Firebase UID / विशिष्ट पहचानकर्ता *
                  </label>
                  <input
                    type="text"
                    value={newOfficerUid}
                    onChange={(e) => setNewOfficerUid(e.target.value)}
                    placeholder="Firebase Auth UID अथवा विशिष्ट पहचान"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    भूमिका (Role) *
                  </label>
                  <select
                    value={newOfficerRole}
                    onChange={(e) => setNewOfficerRole(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white font-bold text-emerald-900"
                  >
                    <option value="officer">फाउंडेशन अधिकारी (Foundation Officer)</option>
                    <option value="superadmin">मुख्य सुपर एडमिन (Super Admin)</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">
                    कार्यक्षेत्र / जोन (Assigned Zone)
                  </label>
                  <input
                    type="text"
                    value={newOfficerZone}
                    onChange={(e) => setNewOfficerZone(e.target.value)}
                    placeholder="उदा. रायसेन, होशंगाबाद, जबलपुर तटवर्ती प्रभाग"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={async () => {
                    if (!newOfficerName.trim() || !newOfficerEmail.trim() || !newOfficerUid.trim()) {
                      alert('कृपया नाम, ईमेल और UID भरें।');
                      return;
                    }
                    setIsSavingOfficer(true);
                    const res = await setOfficerRoleInFirestore(
                      newOfficerUid.trim(),
                      newOfficerRole,
                      newOfficerName.trim(),
                      newOfficerEmail.trim(),
                      newOfficerZone.trim(),
                      adminInfo.adminId
                    );
                    setIsSavingOfficer(false);
                    if (res.success) {
                      setOfficerActionNotice(
                        `अधिकारी '${newOfficerName}' सफलतापूर्वक अधिकृत किया गया!`
                      );
                      setNewOfficerName('');
                      setNewOfficerEmail('');
                      setNewOfficerUid('');
                      loadData();
                      setTimeout(() => setOfficerActionNotice(null), 5000);
                    } else {
                      alert(res.error || 'अधिकारी सेव करने में विफलता।');
                    }
                  }}
                  disabled={isSavingOfficer}
                  className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-md transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <UserCheck className="w-4 h-4 text-amber-300" />
                  <span>{isSavingOfficer ? 'सहेज रहे हैं...' : 'अधिकारी भूमिका अधिकृत करें'}</span>
                </button>
              </div>
            </div>
          )}

          {/* ================= MODAL: OFFICER APPLICATION REVIEW & APPOINTMENT ================= */}
          {selectedOfficerApp && (
            <div
              role="dialog"
              aria-modal="true"
              className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5"
            >
              <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[94vh] flex flex-col">
                {/* Header */}
                <div className="px-6 py-4 bg-gradient-to-r from-sky-900 via-teal-900 to-emerald-950 text-white flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-300 uppercase tracking-wider">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>सुपर एडमिन समीक्षा खिड़की</span>
                    </div>
                    <h3 className="font-bold text-base leading-tight">
                      अधिकारी आवेदन विवरण: {selectedOfficerApp.fullName}
                    </h3>
                  </div>
                  <button
                    onClick={() => setSelectedOfficerApp(null)}
                    className="p-1 rounded-lg hover:bg-white/20 transition cursor-pointer text-slate-300 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto flex-1 space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                    <div>
                      <span className="text-[11px] text-slate-500 block">पूरा नाम:</span>
                      <strong className="text-slate-900 text-sm">{selectedOfficerApp.fullName}</strong>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-500 block">ईमेल पता:</span>
                      <strong className="text-slate-900">{selectedOfficerApp.email}</strong>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-500 block">मोबाइल नंबर:</span>
                      <strong className="text-slate-900 font-mono">{selectedOfficerApp.phone}</strong>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-500 block">वर्तमान गाँव / शहर:</span>
                      <strong className="text-slate-900">{selectedOfficerApp.cityVillage}</strong>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-500 block">आवेदन तिथि:</span>
                      <span className="text-slate-700">{selectedOfficerApp.appliedAt}</span>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-500 block">वर्तमान स्थिति:</span>
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                          selectedOfficerApp.status === 'Approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : selectedOfficerApp.status === 'Rejected'
                            ? 'bg-red-100 text-red-800'
                            : selectedOfficerApp.status === 'Under Review'
                            ? 'bg-sky-100 text-sky-800'
                            : 'bg-amber-100 text-amber-900'
                        }`}
                      >
                        {selectedOfficerApp.status}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="font-bold text-slate-700 block">
                      पर्यावरण और नर्मदा संरक्षण में अनुभव:
                    </span>
                    <div className="p-3 bg-white border border-slate-200 rounded-xl leading-relaxed text-slate-800">
                      {selectedOfficerApp.experienceDetails}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="font-bold text-slate-700 block">
                      अधिकारी बनने का उद्देश्य व कारण:
                    </span>
                    <div className="p-3 bg-white border border-slate-200 rounded-xl leading-relaxed text-slate-800">
                      {selectedOfficerApp.reasonForApplying}
                    </div>
                  </div>

                  {selectedOfficerApp.rejectionReason && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-900 space-y-1">
                      <strong className="block text-[11px] text-red-700">अस्वीकृति का कारण:</strong>
                      <p>{selectedOfficerApp.rejectionReason}</p>
                    </div>
                  )}

                  {/* Rejection Input Box */}
                  {showRejectAppBox && (
                    <div className="p-4 bg-red-50/70 border border-red-300 rounded-2xl space-y-2">
                      <label className="block font-bold text-red-950 text-xs">
                        अस्वीकृति का कारण दर्ज करें (यह आवेदक को सूचित किया जाएगा):
                      </label>
                      <textarea
                        rows={2}
                        value={appRejectReasonInput}
                        onChange={(e) => setAppRejectReasonInput(e.target.value)}
                        placeholder="उदा. अनुभव का अभाव अथवा अधूरा संपर्क विवरण..."
                        className="w-full p-2.5 rounded-xl border border-red-300 text-xs bg-white focus:outline-hidden"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={async () => {
                            if (!appRejectReasonInput.trim()) {
                              alert('कृपया अस्वीकृति का कारण लिखें।');
                              return;
                            }
                            setIsProcessingApp(true);
                            await updateOfficerApplicationStatus(selectedOfficerApp.id, 'Rejected', {
                              rejectionReason: appRejectReasonInput.trim(),
                              reviewerName: adminInfo.name,
                            });
                            setIsProcessingApp(false);
                            setSelectedOfficerApp(null);
                            setOfficerActionNotice(
                              `आवेदन अस्वीकृत किया गया: कारण - ${appRejectReasonInput}`
                            );
                            loadData();
                          }}
                          disabled={isProcessingApp}
                          className="px-4 py-1.5 rounded-xl bg-red-700 text-white font-bold text-xs cursor-pointer hover:bg-red-800"
                        >
                          पुष्टि करें: अस्वीकृत करें
                        </button>
                        <button
                          onClick={() => setShowRejectAppBox(false)}
                          className="px-3 py-1.5 rounded-xl bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
                        >
                          रद्द करें
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Appoint as Officer Box */}
                  {selectedOfficerApp.status === 'Approved' && (
                    <div className="p-4 bg-emerald-50 border-2 border-emerald-300 rounded-2xl space-y-3">
                      <div className="flex items-center gap-2">
                        <Award className="w-5 h-5 text-emerald-700" />
                        <div>
                          <h4 className="font-bold text-emerald-950 text-xs">
                            अधिकारी नियुक्ति (Officer Appointment by Founder)
                          </h4>
                          <p className="text-[11px] text-emerald-800">
                            आवेदन स्वीकृत हो चुका है। कार्यक्षेत्र निर्धारित कर आधिकारिक नियुक्ति करें।
                          </p>
                        </div>
                      </div>

                      <div>
                        <label className="block font-bold text-emerald-950 mb-1 text-[11px]">
                          आवंटित कार्यक्षेत्र / जोन (Assigned Zone):
                        </label>
                        <input
                          type="text"
                          value={appointZoneInput}
                          onChange={(e) => setAppointZoneInput(e.target.value)}
                          placeholder="उदा. रायसेन व बाड़ी परिक्षेत्र (मध्य प्रदेश)"
                          className="w-full px-3 py-2 rounded-xl border border-emerald-300 bg-white text-xs"
                        />
                      </div>

                      <button
                        onClick={async () => {
                          if (!appointZoneInput.trim()) {
                            alert('कृपया कार्यक्षेत्र दर्ज करें।');
                            return;
                          }
                          setIsProcessingApp(true);
                          const res = await appointOfficerFromApplication(
                            selectedOfficerApp.id,
                            {
                              fullName: selectedOfficerApp.fullName,
                              email: selectedOfficerApp.email,
                              assignedZone: appointZoneInput.trim(),
                            },
                            adminInfo.adminId,
                            adminInfo.name
                          );
                          setIsProcessingApp(false);
                          if (res.success) {
                            setSelectedOfficerApp(null);
                            setOfficerActionNotice(
                              `बधाई! '${selectedOfficerApp.fullName}' को अधिकृत अधिकारी नियुक्त कर दिया गया है!`
                            );
                            loadData();
                          } else {
                            alert(res.error || 'नियुक्ति में विफलता।');
                          }
                        }}
                        disabled={isProcessingApp}
                        className="w-full py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        <UserCheck className="w-4 h-4 text-amber-300" />
                        <span>
                          {isProcessingApp ? 'नियुक्ति हो रही है...' : 'आधिकारिक अधिकारी नियुक्त करें'}
                        </span>
                      </button>
                    </div>
                  )}

                  {/* Action Buttons for Super Admin */}
                  <div className="pt-3 border-t border-slate-200 flex flex-wrap gap-2 justify-end">
                    {selectedOfficerApp.status !== 'Under Review' &&
                      selectedOfficerApp.status !== 'Approved' && (
                        <button
                          onClick={async () => {
                            setIsProcessingApp(true);
                            await updateOfficerApplicationStatus(selectedOfficerApp.id, 'Under Review', {
                              reviewerName: adminInfo.name,
                            });
                            setIsProcessingApp(false);
                            setSelectedOfficerApp(null);
                            setOfficerActionNotice(
                              `आवेदन '${selectedOfficerApp.fullName}' को 'समीक्षाधीन' चिह्नित किया गया।`
                            );
                            loadData();
                          }}
                          disabled={isProcessingApp}
                          className="px-4 py-2 rounded-xl bg-sky-700 hover:bg-sky-800 text-white font-bold text-xs cursor-pointer shadow-xs"
                        >
                          समीक्षा में डालें (Under Review)
                        </button>
                      )}

                    {selectedOfficerApp.status !== 'Approved' && (
                      <button
                        onClick={async () => {
                          setIsProcessingApp(true);
                          await updateOfficerApplicationStatus(selectedOfficerApp.id, 'Approved', {
                            reviewerName: adminInfo.name,
                          });
                          setIsProcessingApp(false);
                          setSelectedOfficerApp({ ...selectedOfficerApp, status: 'Approved' });
                          setOfficerActionNotice(
                            `आवेदन '${selectedOfficerApp.fullName}' स्वीकृत किया गया। अब आप नीचे से अधिकारी नियुक्त कर सकते हैं।`
                          );
                          loadData();
                        }}
                        disabled={isProcessingApp}
                        className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs cursor-pointer shadow-xs flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4 text-amber-300" />
                        <span>आवेदन स्वीकार करें (Approve)</span>
                      </button>
                    )}

                    {selectedOfficerApp.status !== 'Rejected' && (
                      <button
                        onClick={() => setShowRejectAppBox(true)}
                        className="px-4 py-2 rounded-xl bg-red-100 hover:bg-red-200 text-red-800 font-bold text-xs cursor-pointer border border-red-300"
                      >
                        अस्वीकार करें (Reject)
                      </button>
                    )}

                    <button
                      onClick={() => setSelectedOfficerApp(null)}
                      className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
                    >
                      बंद करें
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 2: ANALYTICS & REPORTS ================= */}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-heading font-bold text-base text-slate-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-700" />
              <span>जिलेवार पंजीकृत सदस्यों की संख्या</span>
            </h3>
            <div className="space-y-2">
              {Object.entries(districtCounts).map(([dist, count]) => (
                <div key={dist} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50">
                  <span className="font-medium text-xs text-slate-800">{dist}</span>
                  <span className="font-bold text-xs bg-emerald-800 text-white px-2.5 py-0.5 rounded-full">
                    {count} सदस्य
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-heading font-bold text-base text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>सेवा क्षेत्र के अनुसार सहभागिता</span>
            </h3>
            <div className="space-y-2">
              {Object.entries(serviceCounts).map(([svc, count]) => (
                <div key={svc} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50">
                  <span className="font-medium text-xs text-slate-800">{svc}</span>
                  <span className="font-bold text-xs bg-sky-800 text-white px-2.5 py-0.5 rounded-full">
                    {count} स्वयंसेवक
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 3: AUDIT LOGS (DECISION TRAIL) ================= */}
      {activeTab === 'auditLogs' && (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs space-y-4 p-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div>
              <h3 className="font-heading font-bold text-lg text-slate-900 flex items-center gap-2">
                <History className="w-5 h-5 text-emerald-700" />
                <span>निर्णय एवं सुरक्षा ऑडिट लॉग्स (Immutable Audit Trail)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                मुख्य एडमिन द्वारा लिए गए सभी निर्णयों (स्वीकृति, अस्वीकृति, स्थिति परिवर्तन) का स्थायी रिकॉर्ड।
              </p>
            </div>
            <span className="text-xs font-bold bg-slate-100 text-slate-800 px-3 py-1 rounded-full">
              कुल प्रविष्टियाँ: {auditLogs.length}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[11px]">
                <tr>
                  <th className="p-3">तारीख व समय</th>
                  <th className="p-3">एडमिन आईडी</th>
                  <th className="p-3">कार्य (Action)</th>
                  <th className="p-3">लक्षित व्यक्ति / ID</th>
                  <th className="p-3">विवरण (Details)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {auditLogs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-slate-400">
                      कोई ऑडिट लॉग उपलब्ध नहीं है।
                    </td>
                  </tr>
                ) : (
                  auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50">
                      <td className="p-3 whitespace-nowrap text-slate-500 font-mono text-[11px]">
                        {log.timestamp}
                      </td>
                      <td className="p-3 font-mono font-bold text-slate-800">
                        {log.adminId}
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded font-bold text-[10px] uppercase ${
                            log.action === 'APPROVE_APPLICATION'
                              ? 'bg-emerald-100 text-emerald-800'
                              : log.action === 'REJECT_APPLICATION'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-sky-100 text-sky-800'
                          }`}
                        >
                          {log.action}
                        </span>
                      </td>
                      <td className="p-3 font-semibold text-slate-900">
                        {log.targetName || log.targetId || '—'}
                      </td>
                      <td className="p-3 text-slate-600 max-w-md">
                        {log.details}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= TAB 4: LOCATION MANAGEMENT ================= */}
      {activeTab === 'locations' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-8">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-heading font-bold text-lg text-slate-900">
              क्षेत्रीय स्थान प्रबंधन (Location Management Section)
            </h3>
            <p className="text-xs text-slate-500">
              नए राज्य, जिले, तहसील और गाँव जोड़ें। गाँव को सही तहसील और तहसील को सही जिले से जोड़ें।
            </p>
          </div>

          {locSuccessMessage && (
            <div className="p-3 bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>{locSuccessMessage}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs sm:text-sm">
            {/* Add District */}
            <form onSubmit={handleAddDistrict} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <h4 className="font-bold text-slate-900">1. नया जिला जोड़ें:</h4>
              <div>
                <label className="block text-[11px] text-slate-600 mb-1">राज्य चुनें:</label>
                <select
                  value={selectedLocState}
                  onChange={(e) => setSelectedLocState(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                >
                  {locations.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[11px] text-slate-600 mb-1">जिले का नाम:</label>
                <input
                  type="text"
                  required
                  value={newDistrictName}
                  onChange={(e) => setNewDistrictName(e.target.value)}
                  placeholder="उदा. रायसेन, जबलपुर..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 rounded-lg bg-emerald-800 text-white font-bold text-xs cursor-pointer"
              >
                + जिला जोड़ें
              </button>
            </form>

            {/* Add Tehsil */}
            <form onSubmit={handleAddTehsil} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <h4 className="font-bold text-slate-900">2. नई तहसील जोड़ें:</h4>
              <div>
                <label className="block text-[11px] text-slate-600 mb-1">संबंधित जिला चुनें:</label>
                <select
                  value={locTargetDistrictId}
                  onChange={(e) => setLocTargetDistrictId(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                >
                  <option value="">-- जिला चुनें --</option>
                  {locations
                    .find((s) => s.id === selectedLocState)
                    ?.districts?.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                </select>
              </div>
              <div>
                <label className="block text-[11px] text-slate-600 mb-1">तहसील/विकासखंड का नाम:</label>
                <input
                  type="text"
                  required
                  value={newTehsilName}
                  onChange={(e) => setNewTehsilName(e.target.value)}
                  placeholder="उदा. बरेली, बकतरा..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 rounded-lg bg-sky-800 text-white font-bold text-xs cursor-pointer"
              >
                + तहसील जोड़ें
              </button>
            </form>

            {/* Add Village */}
            <form onSubmit={handleAddVillage} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <h4 className="font-bold text-slate-900">3. नया गाँव जोड़ें:</h4>
              <div>
                <label className="block text-[11px] text-slate-600 mb-1">संबंधित तहसील चुनें:</label>
                <select
                  value={locTargetTehsilId}
                  onChange={(e) => setLocTargetTehsilId(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                >
                  <option value="">-- तहसील चुनें --</option>
                  {locations
                    .find((s) => s.id === selectedLocState)
                    ?.districts?.flatMap((d) => d.tehsils || [])
                    .map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                </select>
              </div>
              <div>
                <label className="block text-[11px] text-slate-600 mb-1">गाँव/वार्ड का नाम:</label>
                <input
                  type="text"
                  required
                  value={newVillageName}
                  onChange={(e) => setNewVillageName(e.target.value)}
                  placeholder="उदा. बकतरा घाट ग्राम..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 rounded-lg bg-amber-700 text-white font-bold text-xs cursor-pointer"
              >
                + गाँव जोड़ें
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ================= TAB 5: OFFICIAL LOGO MANAGEMENT ================= */}
      {activeTab === 'logo' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-emerald-300 shadow-md space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <h3 className="font-heading font-bold text-xl text-slate-900 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-emerald-700" />
              <span>स्थायी आधिकारिक लोगो प्रबंधन (Permanent Logo System)</span>
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              यहाँ से फाउंडेशन का चुना हुआ लोगो स्थायी रूप से सुरक्षित रहता है। भविष्य में कोई नया फीचर जोड़ने या पेज रिफ्रेश करने पर यह कभी पुराने लोगो में वापस नहीं जाएगा।
            </p>
          </div>

          {logoSaveNotice && (
            <div className="p-3 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-950 font-bold text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>{logoSaveNotice}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Current Active Logo Preview */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-3">
              <span className="text-xs font-bold text-slate-600 block uppercase tracking-wider">
                वर्तमान सक्रिय आधिकारिक लोगो पूर्वावलोकन
              </span>
              <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-amber-400 shadow-lg bg-[#1c3f60] flex items-center justify-center">
                <img
                  src={customLogoUrlInput || '/logo.png'}
                  alt="आधिकारिक लोगो"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-xs font-mono text-emerald-900 font-bold">
                {customLogoUrlInput.startsWith('data:') ? 'कस्टम अपलोड की गई छवि' : customLogoUrlInput}
              </p>
            </div>

            {/* Actions to Update Logo */}
            <div className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  1. नई लोगो फाइल चुनें (कंप्यूटर / मोबाइल से):
                </label>
                <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer shadow-sm">
                  <UploadCloud className="w-4 h-4 text-amber-300" />
                  <span>गैलरी / डिस्क से लोगो चुनें</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleUploadLogoFile}
                    className="hidden"
                  />
                </label>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  2. अथवा लोगो का इमेज URL लिखें:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customLogoUrlInput}
                    onChange={(e) => setCustomLogoUrlInput(e.target.value)}
                    placeholder="/file_00000000306082118bbb5f0c42339ad4.png या https://..."
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono"
                  />
                  <button
                    onClick={handleSaveLogo}
                    className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs cursor-pointer"
                  >
                    सहेजें
                  </button>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200">
                <button
                  onClick={handleResetLogo}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-medium cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>मूल डिफ़ॉल्ट लोगो पुनर्स्थापित करें</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 6: DATABASE BACKUP & SAFETY ================= */}
      {activeTab === 'backup' && (
        <div className="space-y-6 animate-in fade-in">
          {backupNotice && (
            <div
              className={`p-4 rounded-2xl border flex items-center gap-3 text-sm font-semibold ${
                backupNotice.type === 'success'
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                  : 'bg-red-50 border-red-300 text-red-900'
              }`}
            >
              {backupNotice.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
              )}
              <span>{backupNotice.message}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Export Backup Card */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-emerald-300 shadow-md space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <Download className="w-6 h-6 text-emerald-700" />
              </div>
              <h3 className="font-heading font-bold text-slate-900 text-xl">
                डेटाबेस बैकअप डाउनलोड करें (JSON Export)
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                वेबसाइट के सभी पंजीकृत वॉलंटियर्स, फोटो, सत्यापन स्थितियाँ और कस्टम गाँव/तहसील/जिलों
                का सम्पूर्ण डेटा सुरक्षित JSON फाइल के रूप में अपने कंप्यूटर/मोबाइल में सेव करें।
              </p>
              <div className="pt-2">
                <button
                  onClick={handleExportBackup}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-800 to-sky-900 hover:from-emerald-900 hover:to-sky-950 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4 text-amber-300" />
                  <span>संपूर्ण बैकअप डाउनलोड करें (.JSON)</span>
                </button>
              </div>
            </div>

            {/* Restore Backup Card */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-sky-300 shadow-md space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-800 flex items-center justify-center">
                <UploadCloud className="w-6 h-6 text-sky-700" />
              </div>
              <h3 className="font-heading font-bold text-slate-900 text-xl">
                बैकअप फाइल रीस्टोर करें (JSON Restore)
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                पूर्व में डाउनलोड की गई JSON बैकअप फाइल को अपलोड करके डेटा सुरक्षित रीस्टोर करें।
                मौजूदा रिकॉर्ड्स सुरक्षित रहेंगे और नए रिकॉर्ड्स जुड़ जाएंगे।
              </p>
              <div className="pt-2">
                <label className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1c3f60] hover:bg-[#15314b] text-white font-bold text-sm shadow-md transition-all cursor-pointer">
                  <UploadCloud className="w-4 h-4 text-sky-300" />
                  <span>JSON बैकअप फाइल चुनें</span>
                  <input
                    type="file"
                    accept=".json,application/json"
                    onChange={handleImportBackupFile}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 7: CERTIFICATE SETTINGS & FOUNDER SIGNATURE ================= */}
      {activeTab === 'certificateSettings' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Header Card */}
          <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-sky-950 text-white p-6 sm:p-8 rounded-3xl shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-bold border border-white/15">
                <PenTool className="w-3.5 h-3.5" />
                <span>डिजिटल हस्ताक्षर एवं प्रमाणपत्र सेटिंग्स (Certificate Authority)</span>
              </div>
              <h2 className="font-heading font-black text-2xl sm:text-3xl text-white">
                संस्थापक हस्ताक्षर एवं प्रमाणपत्र प्रबंधन
              </h2>
              <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
                संघिया इको-विजन नर्मदा फाउंडेशन द्वारा जारी किए जाने वाले सभी आधिकारिक डिजिटल सदस्यता प्रमाणपत्रों
                पर संस्थापक एवं मुख्य संरक्षक (श्री बेनी सिंह केवट) के अधिकृत हस्ताक्षर, नाम और पदनाम मुद्रित होते हैं।
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={handlePreviewCertificateWithSignature}
                className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-md cursor-pointer flex items-center gap-2"
              >
                <Award className="w-4 h-4 text-emerald-950" />
                <span>प्रमाणपत्र प्रीव्यू देखें</span>
              </button>
            </div>
          </div>

          {signatureSaveNotice && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-sm font-bold flex items-center gap-2.5 shadow-xs">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{signatureSaveNotice}</span>
            </div>
          )}

          {/* Two Column Layout: Signature Preview & Signature Form */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Box: Active Signature Preview Card */}
            <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  वर्तमान सक्रिय हस्ताक्षर
                </span>
                <span
                  className={`text-xs px-3 py-1 rounded-full font-bold ${
                    signatureConfig.isActive
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-rose-100 text-rose-800 border border-rose-300'
                  }`}
                >
                  {signatureConfig.isActive ? '✓ सक्रिय (Active)' : '✗ निष्क्रिय (Hidden)'}
                </span>
              </div>

              {/* Signature Display Box */}
              <div className="p-4 rounded-2xl bg-slate-50 border-2 border-dashed border-emerald-400/60 flex flex-col items-center justify-center min-h-[160px] text-center">
                {signatureConfig.imageUrl ? (
                  <div className="w-full flex items-center justify-center py-2">
                    <img
                      src={signatureConfig.imageUrl}
                      alt="संस्थापक डिजिटल हस्ताक्षर"
                      className="max-h-24 max-w-[260px] object-contain drop-shadow-xs"
                    />
                  </div>
                ) : (
                  <span className="text-xs text-slate-400 italic">हस्ताक्षर छवि उपलब्ध नहीं है</span>
                )}
                <div className="w-48 h-0.5 bg-slate-400/50 mt-1 mb-2"></div>
                <p className="font-heading font-black text-sm text-slate-900">
                  {signatureConfig.name || signatureConfig.founderName || 'श्री बेनी सिंह केवट'}
                </p>
                <p className="text-xs font-bold text-emerald-800">
                  {signatureConfig.designationHindi || 'संस्थापक एवं मुख्य संरक्षक'}
                </p>
                <p className="text-[10px] text-slate-500 font-medium">
                  {signatureConfig.designationEnglish || 'Founder & Chief Patron'}
                </p>
              </div>

              {/* Status and Metadata */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>हस्ताक्षर प्रकार:</span>
                  <strong className="text-slate-800">अधिकृत डिजिटल संस्थागत प्रतिरूप</strong>
                </div>
                <div className="flex justify-between">
                  <span>अंतिम अद्यतन:</span>
                  <span className="font-mono text-slate-700">
                    {signatureConfig.updatedAt
                      ? new Date(signatureConfig.updatedAt).toLocaleDateString('hi-IN')
                      : 'डिफ़ॉल्ट'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>अद्यतनकर्ता:</span>
                  <span className="font-medium text-emerald-800">
                    {signatureConfig.updatedBy || 'संस्थापक (Super Admin)'}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handlePreviewCertificateWithSignature}
                className="w-full py-2.5 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-950 font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Award className="w-4 h-4 text-emerald-700" />
                <span>इस हस्ताक्षर के साथ प्रमाणपत्र का नमूना देखें</span>
              </button>
            </div>

            {/* Right Box: Upload and Settings Controls */}
            <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-5">
              <div>
                <h3 className="font-heading font-bold text-lg text-slate-900">
                  हस्ताक्षर व अधिकृत विवरण संपादित करें
                </h3>
                <p className="text-xs text-slate-500">
                  हस्ताक्षर की नई पारदर्शी PNG या JPG फाइल अपलोड करें अथवा डिफ़ॉल्ट बहाल करें।
                </p>
              </div>

              <div className="space-y-4 text-xs sm:text-sm">
                {/* 1. File Upload */}
                <div className="space-y-2">
                  <label className="block font-bold text-slate-700">
                    1. हस्ताक्षर फाइल अपलोड करें (PNG, JPG, WebP - पारदर्शी बैकग्राउंड सर्वोत्तम):
                  </label>
                  <div className="flex flex-wrap items-center gap-3">
                    <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer shadow-xs transition">
                      <UploadCloud className="w-4 h-4 text-amber-300" />
                      <span>नई हस्ताक्षर फाइल चुनें</span>
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp,image/svg+xml"
                        onChange={handleUploadSignatureFile}
                        className="hidden"
                      />
                    </label>
                    <span className="text-xs text-slate-500">
                      * अधिकतम आकार: 5MB
                    </span>
                  </div>
                </div>

                {/* 2. Signatory Name */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    2. हस्ताक्षरकर्ता का नाम (Signatory Name):
                  </label>
                  <input
                    type="text"
                    value={signatureConfig.name || signatureConfig.founderName || ''}
                    onChange={(e) =>
                      setSignatureConfig((prev) => ({
                        ...prev,
                        name: e.target.value,
                        founderName: e.target.value,
                      }))
                    }
                    placeholder="श्री बेनी सिंह केवट"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold focus:border-emerald-600 focus:outline-hidden"
                  />
                </div>

                {/* 3. Hindi Designation */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    3. पदनाम (हिंदी) (Designation in Hindi):
                  </label>
                  <input
                    type="text"
                    value={signatureConfig.designationHindi}
                    onChange={(e) =>
                      setSignatureConfig((prev) => ({
                        ...prev,
                        designationHindi: e.target.value,
                      }))
                    }
                    placeholder="संस्थापक एवं मुख्य संरक्षक"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold focus:border-emerald-600 focus:outline-hidden"
                  />
                </div>

                {/* 4. English Designation */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    4. पदनाम (अंग्रेजी) (Designation in English):
                  </label>
                  <input
                    type="text"
                    value={signatureConfig.designationEnglish}
                    onChange={(e) =>
                      setSignatureConfig((prev) => ({
                        ...prev,
                        designationEnglish: e.target.value,
                      }))
                    }
                    placeholder="Founder & Chief Patron"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold focus:border-emerald-600 focus:outline-hidden"
                  />
                </div>

                {/* 5. Active Toggle */}
                <div className="pt-2">
                  <label className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100 transition">
                    <input
                      type="checkbox"
                      checked={signatureConfig.isActive}
                      onChange={(e) =>
                        setSignatureConfig((prev) => ({
                          ...prev,
                          isActive: e.target.checked,
                        }))
                      }
                      className="w-5 h-5 text-emerald-600 rounded-md focus:ring-emerald-500"
                    />
                    <div>
                      <span className="font-bold text-slate-900 text-xs sm:text-sm block">
                        प्रमाणपत्रों पर डिजिटल हस्ताक्षर मुद्रित करें
                      </span>
                      <span className="text-[11px] text-slate-500 block">
                        सक्रिय रहने पर सभी जारी किए गए प्रमाणपत्रों और PDF डाउनलोड में यह हस्ताक्षर प्रदर्शित होगा।
                      </span>
                    </div>
                  </label>
                </div>

                {/* Action Buttons */}
                <div className="pt-4 flex flex-wrap items-center gap-3 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={handleSaveSignature}
                    className="px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center gap-2"
                  >
                    <Check className="w-4 h-4 text-amber-300" />
                    <span>हस्ताक्षर सेटिंग्स सुरक्षित करें (Save)</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleResetSignature}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold cursor-pointer transition"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>डिफ़ॉल्ट हस्ताक्षर बहाल करें</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Legal / Institutional Declaration Note */}
          <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-300 text-amber-950 text-xs space-y-2">
            <div className="font-bold flex items-center gap-2 text-amber-900">
              <ShieldCheck className="w-4 h-4 text-amber-700" />
              <span>प्रमाणपत्र अधिकृतता एवं सुरक्षा घोषणा (Legal & Compliance Notice):</span>
            </div>
            <p className="leading-relaxed">
              संघिया इको-विजन नर्मदा फाउंडेशन (Sanghiya Eco-Vision Narmada Foundation) द्वारा जारी किए जाने वाले
              सभी प्रमाणपत्रों पर संस्था के आधिकारिक लोगो, संस्थापक एवं मुख्य संरक्षक के अधिकृत हस्ताक्षर,
              यूनिक सदस्य ID (Member ID) और रीयल-टाइम QR कोड अंकित होता है। यह व्यवस्था बिना किसी बाहरी पेड
              सर्विस या DSC टोकन के संस्था के नियमों के तहत पूर्णतया वैध और सुरक्षित है।
            </p>
          </div>
        </div>
      )}

      {/* ================= DETAILED APPLICATION REVIEW MODAL ================= */}
      {selectedVolunteer && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-emerald-200 overflow-hidden flex flex-col max-h-[92vh]">
            <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-sky-950 text-white p-5 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-white/10 text-amber-300">
                  अधिकृत आवेदन समीक्षा
                </span>
                <h3 className="font-heading font-bold text-lg mt-0.5">{selectedVolunteer.fullName}</h3>
                <p className="text-xs text-emerald-200 font-mono">
                  Ref: {selectedVolunteer.applicationReference || selectedVolunteer.id}
                </p>
              </div>
              <button
                onClick={() => setSelectedVolunteer(null)}
                className="p-1 rounded-lg hover:bg-white/10 text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5 text-xs sm:text-sm text-slate-700">
              {/* Photo & Core Identifiers */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="w-24 h-28 rounded-xl bg-slate-200 overflow-hidden shrink-0 border-2 border-emerald-600 flex items-center justify-center shadow-xs">
                  {selectedVolunteer.photoUrl ? (
                    <img
                      src={selectedVolunteer.photoUrl}
                      alt="फोटो"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Users className="w-8 h-8 text-slate-400" />
                  )}
                </div>
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-base text-slate-900">{selectedVolunteer.fullName}</span>
                    <span
                      className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold ${
                        selectedVolunteer.verificationStatus === 'सत्यापित'
                          ? 'bg-emerald-100 text-emerald-800'
                          : selectedVolunteer.verificationStatus === 'अस्वीकृत'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {selectedVolunteer.verificationStatus}
                    </span>
                  </div>

                  {selectedVolunteer.memberId && (
                    <div className="p-2 rounded-lg bg-amber-50 border border-amber-300 text-amber-950 font-bold font-mono text-xs">
                      जारी सदस्य ID: {selectedVolunteer.memberId}
                    </div>
                  )}

                  <div className="text-xs text-slate-600">
                    <strong>मोबाइल:</strong> {selectedVolunteer.phone} {selectedVolunteer.alternatePhone && `(वैकल्पिक: ${selectedVolunteer.alternatePhone})`}
                  </div>
                  <div className="text-xs text-slate-600">
                    <strong>ईमेल:</strong> {selectedVolunteer.email || 'उपलब्ध नहीं'}
                  </div>
                  <div className="text-xs text-slate-600">
                    <strong>स्थान:</strong> {selectedVolunteer.village}, {selectedVolunteer.tehsil}, {selectedVolunteer.district} ({selectedVolunteer.state})
                  </div>
                  <div className="text-[11px] text-slate-500">
                    <strong>जमा तारीख:</strong> {selectedVolunteer.registeredAt}
                  </div>
                </div>
              </div>

              {/* Application Details */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5 text-xs">
                <div>
                  <strong>आवेदन का प्रकार:</strong> <span className="font-bold text-emerald-900">{selectedVolunteer.applicationType || 'पर्यावरण स्वयंसेवक'}</span>
                </div>
                <div>
                  <strong>उद्देश्य व संकल्प:</strong> <span className="italic">"{selectedVolunteer.reasonForJoining}"</span>
                </div>
                <div>
                  <strong>सेवा क्षेत्र:</strong> {(selectedVolunteer.serviceInterests || []).join(', ')}
                </div>
                {selectedVolunteer.verifiedBy && (
                  <div className="text-emerald-800 font-semibold pt-1">
                    सत्यापनकर्ता: {selectedVolunteer.verifiedBy} ({selectedVolunteer.verifiedAt})
                  </div>
                )}
                {selectedVolunteer.rejectionReason && (
                  <div className="text-rose-800 font-semibold pt-1">
                    अस्वीकृति का कारण: {selectedVolunteer.rejectionReason}
                  </div>
                )}
              </div>

              {/* Admin Decision Action Area */}
              <div className="p-4 bg-emerald-50/70 border-2 border-emerald-300 rounded-2xl space-y-3">
                <p className="font-bold text-emerald-950 text-xs uppercase tracking-wider">
                  अधिकृत एडमिन निर्णय (Official Admin Actions):
                </p>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    प्रशासनिक टिप्पणी / अनुमोदन नोट (वैकल्पिक):
                  </label>
                  <input
                    type="text"
                    value={adminCommentInput}
                    onChange={(e) => setAdminCommentInput(e.target.value)}
                    placeholder="उदा. फोटो व निवास विवरण सत्यापित।"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {/* Approve Button */}
                  <button
                    onClick={() => handleApproveApplication(selectedVolunteer)}
                    className="px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition cursor-pointer flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4 text-amber-300" />
                    <span>स्वीकृत करें (Approve & Issue Member ID)</span>
                  </button>

                  {/* Reject Button */}
                  <button
                    onClick={() => setShowRejectBox(!showRejectBox)}
                    className="px-4 py-2.5 rounded-xl bg-rose-800 hover:bg-rose-700 text-white font-bold text-xs transition cursor-pointer flex items-center gap-1.5"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>अस्वीकृत करें (Reject)</span>
                  </button>

                  {/* Request Info */}
                  <button
                    onClick={() => handleRequestInfo(selectedVolunteer)}
                    className="px-4 py-2.5 rounded-xl bg-sky-800 hover:bg-sky-700 text-white font-bold text-xs transition cursor-pointer flex items-center gap-1.5"
                  >
                    <AlertCircle className="w-4 h-4" />
                    <span>अतिरिक्त जानकारी मांगें</span>
                  </button>

                  {/* Preview Certificate if approved */}
                  {selectedVolunteer.verificationStatus === 'सत्यापित' && (
                    <button
                      onClick={() => setCertificatePreviewModal(selectedVolunteer)}
                      className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold text-xs shadow transition cursor-pointer flex items-center gap-1.5"
                    >
                      <Award className="w-4 h-4" />
                      <span>प्रमाणपत्र देखें</span>
                    </button>
                  )}
                </div>

                {showRejectBox && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl space-y-2 mt-2">
                    <label className="block text-xs font-bold text-red-900">
                      अस्वीकृति का स्पष्ट कारण लिखें (आवेदक को दिखाई देगा):
                    </label>
                    <input
                      type="text"
                      value={rejectionReasonInput}
                      onChange={(e) => setRejectionReasonInput(e.target.value)}
                      placeholder="उदा. फोटो स्पष्ट नहीं है / अधूरा पता..."
                      className="w-full px-3 py-2 rounded-lg border border-red-300 text-xs bg-white"
                    />
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => setShowRejectBox(false)}
                        className="px-3 py-1.5 text-xs text-slate-600 cursor-pointer"
                      >
                        रद्द करें
                      </button>
                      <button
                        onClick={() => handleRejectApplication(selectedVolunteer)}
                        className="px-4 py-1.5 bg-red-700 text-white font-bold text-xs rounded-lg cursor-pointer"
                      >
                        अस्वीकृति की पुष्टि करें
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= CERTIFICATE PREVIEW MODAL ================= */}
      {certificatePreviewModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-in fade-in">
          <div className="relative w-full max-w-6xl bg-white rounded-3xl shadow-2xl p-4 sm:p-6 max-h-[95vh] overflow-y-auto">
            <CertificateView
              volunteer={certificatePreviewModal}
              onClose={() => setCertificatePreviewModal(null)}
              isModal={true}
            />
          </div>
        </div>
      )}

      {/* ================= CSV EXPORT CONSENT MODAL ================= */}
      {csvConsentModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 animate-in fade-in">
          <div className="bg-white p-6 rounded-3xl max-w-md w-full shadow-2xl border border-emerald-300 space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-lg text-slate-900">
              अधिकृत CSV डाउनलोड अनुमति
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              यह फाइल फाउंडेशन के पंजीकृत सदस्यों की संपर्क जानकारी समाहित करती है। कृपया सुनिश्चित
              करें कि इस डेटा का उपयोग केवल अधिकृत संस्थागत कार्यों हेतु किया जाएगा।
            </p>
            <div className="flex gap-2 justify-center pt-2">
              <button
                onClick={() => setCsvConsentModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
              >
                रद्द करें
              </button>
              <button
                onClick={executeAuthorizedCsvExport}
                className="px-5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold shadow-md cursor-pointer"
              >
                हाँ, Excel (CSV) डाउनलोड करें
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
