import React, { useState, useEffect } from 'react';
import { PageId, VolunteerProfile, VerificationStatus } from '../types';
import { CustomEmblem } from '../components/CustomEmblem';
import { SITE_CONFIG } from '../config/siteConfig';
import {
  FirebaseUserProfile,
  fetchFirestoreApplications,
  approveApplicationInFirestore,
  rejectApplicationInFirestore,
  logoutFirebase,
} from '../services/firebaseAuthService';
import { getVolunteers, approveApplication, rejectApplication } from '../services/volunteerService';
import { CertificateView } from '../components/CertificateView';
import {
  ShieldCheck,
  Users,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  LogOut,
  MapPin,
  Calendar,
  AlertTriangle,
  Eye,
  Award,
  RefreshCw,
  Phone,
  Mail,
  User,
  AlertCircle,
  FileText,
  ChevronDown,
} from 'lucide-react';

interface OfficerDashboardPageProps {
  onNavigate: (page: PageId) => void;
  officerProfile: FirebaseUserProfile | null;
  onLogout: () => void;
  customLogoUrl: string | null;
}

export const OfficerDashboardPage: React.FC<OfficerDashboardPageProps> = ({
  onNavigate,
  officerProfile,
  onLogout,
  customLogoUrl,
}) => {
  const [applications, setApplications] = useState<VolunteerProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('सभी');
  const [filterDate, setFilterDate] = useState<string>('सभी');

  // Modal states
  const [selectedApp, setSelectedApp] = useState<VolunteerProfile | null>(null);
  const [viewDetailModalOpen, setViewDetailModalOpen] = useState(false);
  const [confirmApproveModalOpen, setConfirmApproveModalOpen] = useState(false);
  const [confirmRejectModalOpen, setConfirmRejectModalOpen] = useState(false);
  const [officerNotes, setOfficerNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(
    null
  );
  const [viewCertModalOpen, setViewCertModalOpen] = useState(false);

  // Load applications
  const loadData = async () => {
    setIsLoading(true);
    try {
      const fbApps = await fetchFirestoreApplications();
      if (fbApps.length > 0) {
        setApplications(fbApps);
      } else {
        // Fallback to local volunteer storage if Firestore is empty initially
        const local = getVolunteers();
        setApplications(local);
      }
    } catch {
      setApplications(getVolunteers());
    } finally {
      setIsLoading(false);
    }
  };

  // Strict Authorization & Revocation Guard
  const isAuthorizedOfficer =
    officerProfile &&
    (officerProfile.role === 'officer' || officerProfile.role === 'superadmin') &&
    !officerProfile.isRevoked;

  useEffect(() => {
    if (isAuthorizedOfficer) {
      loadData();
    }
  }, [isAuthorizedOfficer]);

  if (!isAuthorizedOfficer) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4 bg-slate-50">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-red-200 text-center space-y-5">
          <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold font-heading text-slate-900">
              अनाधिकृत प्रवेश (Unauthorized Access)
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              यह पैनल केवल संस्थापक द्वारा अधिकृत व सक्रिय अधिकारियों के लिए सुरक्षित है।
              आपका खाता या तो अधिकारी के रूप में अधिकृत नहीं है, अथवा अधिकार निरस्त कर दिए गए हैं।
            </p>
          </div>
          <button
            onClick={() => {
              onLogout();
              onNavigate('officer-login');
            }}
            className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition shadow-md cursor-pointer"
          >
            अधिकारी लॉगिन पर जाएँ
          </button>
        </div>
      </div>
    );
  }

  // Filtered applications
  const filteredApps = applications.filter((app) => {
    // Search
    const q = searchQuery.toLowerCase().trim();
    const matchSearch =
      !q ||
      app.fullName.toLowerCase().includes(q) ||
      app.id.toLowerCase().includes(q) ||
      (app.applicationReference && app.applicationReference.toLowerCase().includes(q)) ||
      (app.memberId && app.memberId.toLowerCase().includes(q)) ||
      app.phone.includes(q) ||
      app.district.toLowerCase().includes(q);

    // Filter status
    const matchStatus =
      filterStatus === 'सभी' ||
      (filterStatus === 'Pending' &&
        (app.verificationStatus === 'आवेदन प्राप्त' || app.verificationStatus === 'समीक्षा में')) ||
      (filterStatus === 'Approved' && app.verificationStatus === 'सत्यापित') ||
      (filterStatus === 'Rejected' && app.verificationStatus === 'अस्वीकृत');

    return matchSearch && matchStatus;
  });

  // Analytics counts
  const totalCount = applications.length;
  const pendingCount = applications.filter(
    (a) => a.verificationStatus === 'आवेदन प्राप्त' || a.verificationStatus === 'समीक्षा में'
  ).length;
  const approvedCount = applications.filter((a) => a.verificationStatus === 'सत्यापित').length;
  const rejectedCount = applications.filter((a) => a.verificationStatus === 'अस्वीकृत').length;

  // Handle Approve Application
  const handleApprove = async () => {
    if (!selectedApp) return;
    setIsProcessing(true);
    setFeedbackMsg(null);

    const officerUid = officerProfile?.uid || 'OFFICER-01';
    const officerName = officerProfile?.displayName || 'फाउंडेशन अधिकारी';

    // 1. Try Firestore Transaction
    const res = await approveApplicationInFirestore(
      selectedApp.id,
      officerUid,
      officerName,
      officerNotes
    );

    // 2. Also sync local service
    approveApplication(selectedApp.id, officerUid, officerName, officerNotes);

    setIsProcessing(false);
    setConfirmApproveModalOpen(false);

    if (res.success) {
      setFeedbackMsg({
        type: 'success',
        text: `आवेदन सफलतापूर्वक स्वीकृत किया गया! Member ID: ${res.memberId || 'जारी की गई'}`,
      });
      loadData();
      setViewDetailModalOpen(false);
    } else {
      setFeedbackMsg({
        type: 'error',
        text: res.error || 'स्वीकृति में समस्या आई।',
      });
    }
  };

  // Handle Reject Application
  const handleReject = async () => {
    if (!selectedApp) return;
    if (!rejectionReason.trim()) {
      setFeedbackMsg({ type: 'error', text: 'कृपया अस्वीकृति का कारण दर्ज करें।' });
      return;
    }

    setIsProcessing(true);
    setFeedbackMsg(null);

    const officerUid = officerProfile?.uid || 'OFFICER-01';
    const officerName = officerProfile?.displayName || 'फाउंडेशन अधिकारी';

    const res = await rejectApplicationInFirestore(
      selectedApp.id,
      officerUid,
      officerName,
      rejectionReason
    );

    rejectApplication(selectedApp.id, officerUid, officerName, rejectionReason);

    setIsProcessing(false);
    setConfirmRejectModalOpen(false);

    if (res.success) {
      setFeedbackMsg({
        type: 'success',
        text: 'आवेदन अस्वीकृत किया गया एवं कारण रिकॉर्ड कर दिया गया।',
      });
      loadData();
      setViewDetailModalOpen(false);
    } else {
      setFeedbackMsg({
        type: 'error',
        text: res.error || 'अस्वीकृति में समस्या आई।',
      });
    }
  };

  const handleLogoutClick = async () => {
    await logoutFirebase();
    onLogout();
    onNavigate('officer-login');
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Top Header Card */}
      <div className="max-w-7xl mx-auto bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <CustomEmblem size="md" customLogoUrl={customLogoUrl} />
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 text-[11px] font-bold uppercase tracking-wider">
                अधिकृत अधिकारी डैशबोर्ड
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs font-semibold text-emerald-800">
                जोन: {officerProfile?.assignedZone || 'सम्पूर्ण नर्मदा परिक्षेत्र'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900 mt-1">
              स्वयंसेवक आवेदन समीक्षा व अनुमोदन कक्ष
            </h1>
            <p className="text-xs text-slate-500">
              स्वागत है, {officerProfile?.displayName || 'अधिकारी'} ({officerProfile?.email})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            disabled={isLoading}
            className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition cursor-pointer"
            title="डेटा रीफ्रेश करें"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={handleLogoutClick}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold transition cursor-pointer border border-red-200"
          >
            <LogOut className="w-4 h-4" />
            <span>लॉगआउट</span>
          </button>
        </div>
      </div>

      {/* Feedback Toast */}
      {feedbackMsg && (
        <div className="max-w-7xl mx-auto">
          <div
            className={`p-4 rounded-2xl text-xs sm:text-sm font-semibold flex items-center justify-between shadow-sm animate-in fade-in ${
              feedbackMsg.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                : 'bg-red-50 text-red-800 border border-red-300'
            }`}
          >
            <div className="flex items-center gap-2">
              {feedbackMsg.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
              )}
              <span>{feedbackMsg.text}</span>
            </div>
            <button
              onClick={() => setFeedbackMsg(null)}
              className="text-slate-400 hover:text-slate-600 text-xs underline cursor-pointer"
            >
              बंद करें
            </button>
          </div>
        </div>
      )}

      {/* Analytics Counter Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>कुल आवेदन</span>
            <Users className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">{totalCount}</div>
          <p className="text-[11px] text-slate-400">फाउंडेशन को प्राप्त समस्त आवेदन</p>
        </div>

        {/* Pending */}
        <div className="bg-white p-5 rounded-2xl border border-amber-200/80 shadow-xs space-y-1 bg-gradient-to-br from-amber-50/40 to-white">
          <div className="flex items-center justify-between text-amber-800 text-xs font-semibold">
            <span>लंबित (Pending)</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-900">{pendingCount}</div>
          <p className="text-[11px] text-amber-700/80">समीक्षा व निर्णय हेतु प्रतीक्षारत</p>
        </div>

        {/* Approved */}
        <div className="bg-white p-5 rounded-2xl border border-emerald-200/80 shadow-xs space-y-1 bg-gradient-to-br from-emerald-50/40 to-white">
          <div className="flex items-center justify-between text-emerald-800 text-xs font-semibold">
            <span>स्वीकृत (Approved)</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-900">{approvedCount}</div>
          <p className="text-[11px] text-emerald-700/80">सत्यापित सक्रिय स्वयंसेवक</p>
        </div>

        {/* Rejected */}
        <div className="bg-white p-5 rounded-2xl border border-red-200/80 shadow-xs space-y-1 bg-gradient-to-br from-red-50/40 to-white">
          <div className="flex items-center justify-between text-red-800 text-xs font-semibold">
            <span>अस्वीकृत (Rejected)</span>
            <XCircle className="w-4 h-4 text-red-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-red-900">{rejectedCount}</div>
          <p className="text-[11px] text-red-700/80">कारण सहित निरस्त आवेदन</p>
        </div>
      </div>

      {/* Main Applications Section */}
      <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sm:p-8 space-y-6">
        {/* Search & Filter Toolbar */}
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between pb-6 border-b border-slate-100">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="नाम, Application ID, मोबाइल या जिला से खोजें..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex rounded-xl bg-slate-100 p-1 text-xs font-semibold text-slate-700">
              {(['सभी', 'Pending', 'Approved', 'Rejected'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                    filterStatus === status
                      ? 'bg-white text-slate-900 shadow-xs font-bold'
                      : 'hover:text-slate-900'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Applications Table / Cards */}
        {isLoading ? (
          <div className="py-20 text-center text-slate-500 space-y-3">
            <RefreshCw className="w-8 h-8 text-sky-600 animate-spin mx-auto" />
            <p className="text-sm font-semibold">आवेदन लोड हो रहे हैं...</p>
          </div>
        ) : filteredApps.length === 0 ? (
          /* Empty State */
          <div className="py-20 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Users className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-slate-800 text-lg">कोई आवेदन नहीं मिला</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                {searchQuery || filterStatus !== 'सभी'
                  ? 'दिए गए फ़िल्टर के अनुसार कोई रिकॉर्ड उपलब्ध नहीं है।'
                  : 'वर्तमान में इस श्रेणी में कोई आवेदन दर्ज नहीं है।'}
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 uppercase font-bold text-[10px] tracking-wider bg-slate-50/60">
                  <th className="py-3 px-3">फोटो</th>
                  <th className="py-3 px-3">Application Ref</th>
                  <th className="py-3 px-3">आवेदक का नाम</th>
                  <th className="py-3 px-3">मोबाइल नंबर</th>
                  <th className="py-3 px-3">स्थान (जिला/तहसील)</th>
                  <th className="py-3 px-3">आवेदन तिथि</th>
                  <th className="py-3 px-3">स्थिति (Status)</th>
                  <th className="py-3 px-3 text-right">कार्रवाई</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredApps.map((app) => {
                  const isAppApproved = app.verificationStatus === 'सत्यापित';
                  const isAppRejected = app.verificationStatus === 'अस्वीकृत';
                  const isAppPending = !isAppApproved && !isAppRejected;

                  return (
                    <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-3">
                        {app.photoUrl ? (
                          <img
                            src={app.photoUrl}
                            alt={app.fullName}
                            className="w-9 h-9 rounded-full object-cover border border-slate-200"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                            {app.fullName.charAt(0)}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-mono font-bold text-slate-800 block">
                          {app.applicationReference || app.id}
                        </span>
                        {app.memberId && (
                          <span className="text-[10px] text-emerald-700 font-semibold block">
                            {app.memberId}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-bold text-slate-900 block">{app.fullName}</span>
                        {app.fatherOrGuardianName && (
                          <span className="text-[11px] text-slate-500">
                            पिता: {app.fatherOrGuardianName}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-700">{app.phone}</td>
                      <td className="py-3 px-3">
                        <span className="text-slate-800 font-medium block">{app.district}</span>
                        <span className="text-[11px] text-slate-500">
                          {app.tehsil}, {app.village}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-600">{app.registeredAt}</td>
                      <td className="py-3 px-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                            isAppApproved
                              ? 'bg-emerald-100 text-emerald-800'
                              : isAppRejected
                              ? 'bg-red-100 text-red-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {isAppApproved ? (
                            <CheckCircle2 className="w-3 h-3" />
                          ) : isAppRejected ? (
                            <XCircle className="w-3 h-3" />
                          ) : (
                            <Clock className="w-3 h-3" />
                          )}
                          <span>{app.verificationStatus}</span>
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => {
                            setSelectedApp(app);
                            setViewDetailModalOpen(true);
                          }}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-800 font-bold text-xs transition cursor-pointer border border-sky-200"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>विवरण व निर्णय</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Application Detail & Decision Modal */}
      {viewDetailModalOpen && selectedApp && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6"
        >
          <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto max-h-[92vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-sky-900 to-emerald-950 text-white border-b border-sky-800">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-300" />
                <h3 className="font-bold text-base sm:text-lg">आवेदन विवरण एवं अनुमोदन निर्णय</h3>
              </div>
              <button
                onClick={() => setViewDetailModalOpen(false)}
                className="text-slate-300 hover:text-white p-1 rounded-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="overflow-y-auto p-6 space-y-6 flex-1 text-slate-800">
              {/* Applicant Header summary */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                {selectedApp.photoUrl ? (
                  <img
                    src={selectedApp.photoUrl}
                    alt={selectedApp.fullName}
                    className="w-20 h-20 rounded-2xl object-cover border-2 border-emerald-600 shadow-md"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-2xl border-2 border-emerald-600 shadow-md">
                    {selectedApp.fullName.charAt(0)}
                  </div>
                )}

                <div className="flex-1 text-center sm:text-left space-y-1">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <h4 className="text-xl font-bold font-heading text-slate-900">
                      {selectedApp.fullName}
                    </h4>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        selectedApp.verificationStatus === 'सत्यापित'
                          ? 'bg-emerald-100 text-emerald-800'
                          : selectedApp.verificationStatus === 'अस्वीकृत'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {selectedApp.verificationStatus}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-mono">
                    Ref: {selectedApp.applicationReference || selectedApp.id}
                  </p>
                  {selectedApp.memberId && (
                    <p className="text-xs text-emerald-700 font-bold font-mono">
                      सदस्यता क्रमांक (Member ID): {selectedApp.memberId}
                    </p>
                  )}
                </div>
              </div>

              {/* Data Fields 2-Col Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="text-slate-400 block font-semibold uppercase text-[10px]">
                    पिता / अभिभावक का नाम
                  </span>
                  <span className="font-bold text-slate-800">
                    {selectedApp.fatherOrGuardianName || 'उपलब्ध नहीं'}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="text-slate-400 block font-semibold uppercase text-[10px]">
                    मोबाइल नंबर
                  </span>
                  <span className="font-bold text-slate-800 font-mono">{selectedApp.phone}</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="text-slate-400 block font-semibold uppercase text-[10px]">
                    ईमेल पता
                  </span>
                  <span className="font-bold text-slate-800">
                    {selectedApp.email || 'उपलब्ध नहीं'}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="text-slate-400 block font-semibold uppercase text-[10px]">
                    जन्म तिथि व लिंग
                  </span>
                  <span className="font-bold text-slate-800">
                    {selectedApp.dob || 'एन/ए'} • {selectedApp.gender || 'एन/ए'}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1 sm:col-span-2">
                  <span className="text-slate-400 block font-semibold uppercase text-[10px]">
                    पूर्ण पता एवं स्थान
                  </span>
                  <span className="font-bold text-slate-800 block">
                    गाँव: {selectedApp.village}, तहसील: {selectedApp.tehsil}, जिला:{' '}
                    {selectedApp.district}, राज्य: {selectedApp.state} - पिन: {selectedApp.pincode}
                  </span>
                  {selectedApp.fullAddress && (
                    <span className="text-slate-600 block mt-1">{selectedApp.fullAddress}</span>
                  )}
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1 sm:col-span-2">
                  <span className="text-slate-400 block font-semibold uppercase text-[10px]">
                    जुड़ने का उद्देश्य व सेवा रुचि
                  </span>
                  <p className="font-medium text-slate-800">{selectedApp.reasonForJoining}</p>
                  {selectedApp.serviceInterests && selectedApp.serviceInterests.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {selectedApp.serviceInterests.map((interest, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold text-[10px]"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {selectedApp.rejectionReason && (
                  <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 space-y-1 sm:col-span-2">
                    <span className="font-bold block uppercase text-[10px]">
                      अस्वीकृति का दर्ज कारण
                    </span>
                    <p className="font-medium">{selectedApp.rejectionReason}</p>
                  </div>
                )}

                {selectedApp.adminNotes && (
                  <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-1 sm:col-span-2">
                    <span className="font-bold block uppercase text-[10px]">
                      अधिकारी / एडमिन टिप्पणी
                    </span>
                    <p className="font-medium">{selectedApp.adminNotes}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Actions Footer */}
            <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                {selectedApp.verificationStatus === 'सत्यापित' && (
                  <button
                    onClick={() => setViewCertModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold text-xs shadow-xs cursor-pointer"
                  >
                    <Award className="w-4 h-4" />
                    <span>प्रमाणपत्र देखें</span>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-3">
                {selectedApp.verificationStatus !== 'सत्यापित' && (
                  <button
                    onClick={() => {
                      setConfirmApproveModalOpen(true);
                      setOfficerNotes('');
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md cursor-pointer transition"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>आवेदन स्वीकृत करें (Approve)</span>
                  </button>
                )}

                {selectedApp.verificationStatus !== 'अस्वीकृत' && (
                  <button
                    onClick={() => {
                      setConfirmRejectModalOpen(true);
                      setRejectionReason('');
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md cursor-pointer transition"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>आवेदन अस्वीकृत करें (Reject)</span>
                  </button>
                )}

                <button
                  onClick={() => setViewDetailModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-bold text-xs cursor-pointer"
                >
                  बंद करें
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog: Approve Application */}
      {confirmApproveModalOpen && selectedApp && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-60 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 space-y-5 animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-lg font-bold text-slate-900">
                क्या आप इस स्वयंसेवक के आवेदन को स्वीकृत करना चाहते हैं?
              </h3>
              <p className="text-xs text-slate-600">
                स्वीकृति के बाद आवेदक <strong>{selectedApp.fullName}</strong> को आधिकारिक Member ID
                जारी होगी और वे वेबसाइट से अपना प्रमाणपत्र डाउनलोड कर सकेंगे।
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                समीक्षा टिप्पणी (वैकल्पिक)
              </label>
              <textarea
                value={officerNotes}
                onChange={(e) => setOfficerNotes(e.target.value)}
                placeholder="दस्तावेज व जानकारी सत्यापित की गई..."
                rows={2}
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setConfirmApproveModalOpen(false)}
                disabled={isProcessing}
                className="flex-1 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 cursor-pointer"
              >
                रद्द करें
              </button>
              <button
                onClick={handleApprove}
                disabled={isProcessing}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md cursor-pointer disabled:opacity-50"
              >
                {isProcessing ? 'स्वीकृति हो रही है...' : 'हाँ, स्वीकृत करें'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog: Reject Application */}
      {confirmRejectModalOpen && selectedApp && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-60 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 space-y-5 animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-700 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-lg font-bold text-slate-900">
                क्या आप इस आवेदन को अस्वीकृत करना चाहते हैं?
              </h3>
              <p className="text-xs text-slate-600">
                आवेदक <strong>{selectedApp.fullName}</strong> के आवेदन को अस्वीकृत करने का कारण दर्ज
                करना अनिवार्य है ताकि आवेदक स्थिति ट्रैक करते समय कारण देख सके।
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                अस्वीकृति का कारण (अनिवार्य)
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="उदा. फोटो अस्पष्ट है अथवा पता पूर्ण नहीं है..."
                rows={3}
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-red-500 focus:outline-hidden"
                required
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setConfirmRejectModalOpen(false)}
                disabled={isProcessing}
                className="flex-1 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 cursor-pointer"
              >
                वापस जाएँ
              </button>
              <button
                onClick={handleReject}
                disabled={isProcessing}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md cursor-pointer disabled:opacity-50"
              >
                {isProcessing ? 'दर्ज कर रहे हैं...' : 'अस्वीकृत करें'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Certificate Preview Modal */}
      {viewCertModalOpen && selectedApp && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-70 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6"
        >
          <div className="relative w-full max-w-4xl bg-white rounded-3xl p-6 shadow-2xl overflow-y-auto max-h-[95vh] space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200">
              <h3 className="font-bold text-base text-slate-900">
                अधिकृत प्रमाणपत्र पूर्वावलोकन ({selectedApp.fullName})
              </h3>
              <button
                onClick={() => setViewCertModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-800 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>
            <CertificateView volunteer={selectedApp} isModal={true} />
          </div>
        </div>
      )}
    </div>
  );
};
