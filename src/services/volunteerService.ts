import {
  VolunteerProfile,
  VerificationStatus,
  ApplicationType,
  ApplicationReceipt,
  AuditLogEntry,
  UserAccount,
  LocationState,
  FounderSignatureConfig,
  InAppNotification,
} from '../types';
import { INITIAL_LOCATION_DATA } from '../data/locationData';
import { SITE_CONFIG } from '../config/siteConfig';

const STORAGE_KEY_VOLUNTEERS = 'sanghiya_narmada_volunteers_v2';
const STORAGE_KEY_LOCATIONS = 'sanghiya_narmada_locations_v3';
const STORAGE_KEY_ADMIN = 'sanghiya_admin_auth_v2';
const STORAGE_KEY_ADMIN_INFO = 'sanghiya_admin_info_v2';
const STORAGE_KEY_ACTIVE_MEMBER = 'sanghiya_active_member_id';
const STORAGE_KEY_AUDIT_LOGS = 'sanghiya_audit_logs_v2';
const STORAGE_KEY_USERS = 'sanghiya_user_accounts_v2';
const STORAGE_KEY_CURRENT_USER = 'sanghiya_current_user_v2';
const STORAGE_KEY_PERMANENT_LOGO = 'sanghiya_permanent_custom_logo';
const STORAGE_KEY_SIGNATURE = 'sanghiya_founder_signature_config_v2';
const STORAGE_KEY_NOTIFICATIONS = 'sanghiya_in_app_notifications_v2';

export const DEFAULT_FOUNDER_SIGNATURE_DATA: FounderSignatureConfig = {
  imageUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 90" width="320" height="90"><path d="M 25 55 Q 45 15 65 45 Q 75 70 95 35 T 125 45 Q 145 20 165 50 T 195 40 Q 215 25 235 55 T 265 40 Q 285 30 300 55" fill="none" stroke="%23064e3b" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M 30 70 Q 160 80 295 65" fill="none" stroke="%23064e3b" stroke-width="1.8" stroke-linecap="round"/><text x="40" y="44" font-family="Brush Script MT, cursive, serif" font-size="32" font-weight="bold" fill="%23064e3b" font-style="italic">Beni Singh</text></svg>',
  name: 'बेनी सिंह केवट',
  founderName: 'बेनी सिंह केवट',
  founderNameEnglish: 'Beni Singh Kewat',
  designationHindi: 'संस्थापक एवं मुख्य संरक्षक',
  designationEnglish: 'Founder & Chief Patron',
  isActive: true,
  approvedAt: '10/10/2026, 10:00 am',
  approvedBy: 'बेनी सिंह केवट (संस्थापक)',
  updatedAt: '2026-10-10T04:30:00.000Z',
  updatedBy: 'बेनी सिंह केवट (संस्थापक)',
};

const INITIAL_SEED_NOTIFICATIONS: InAppNotification[] = [
  {
    id: 'NOTIF-SEED-01',
    targetVolunteerId: 'SEVNF-VOL-000101',
    targetPhone: '9826012345',
    targetEmail: 'rahul.narmada@gmail.com',
    title: 'स्वयंसेवक सदस्यता आवेदन स्वीकृत!',
    message:
      'बधाई हो! संघिया इको-विजन नर्मदा फाउंडेशन में आपका स्वयंसेवक आवेदन स्वीकृत हो गया है। आपकी सदस्य आईडी: SEVNF-MP-2026-000101। आपका प्रमाणपत्र PDF डाउनलोड करने के लिए उपलब्ध है।',
    type: 'approval',
    isRead: false,
    createdAt: '11/10/2026, 02:15 pm',
    applicationReference: 'SEVNF-APP-2026-000101',
    memberId: 'SEVNF-MP-2026-000101',
    certificateNumber: 'CERT-SEVNF-2026-000101',
  },
];

// Initial seed volunteers (sample authentic data with one verified and one in review for immediate demonstration)
const INITIAL_SEED_VOLUNTEERS: VolunteerProfile[] = [
  {
    id: 'SEVNF-VOL-000101',
    applicationReference: 'SEVNF-APP-2026-000101',
    memberId: 'SEVNF-MP-2026-000101',
    certificateNumber: 'CERT-SEVNF-2026-000101',
    receiptNumber: 'REC-SEVNF-2026-000101',
    fullName: 'राहुल शर्मा',
    fatherOrGuardianName: 'श्री रामेश्वर शर्मा',
    phone: '9826012345',
    alternatePhone: '9425012345',
    email: 'rahul.narmada@gmail.com',
    dob: '1996-05-14',
    gender: 'पुरुष',
    country: 'भारत (India)',
    state: 'मध्य प्रदेश (Madhya Pradesh)',
    district: 'जबलपुर (Jabalpur)',
    tehsil: 'पनागर / गौरीघाट (Panagar / Gwarighat)',
    village: 'गौरीघाट तटवर्ती बस्ती',
    selectedGhat: 'गौरीघाट (Gwarighat - मुख्य महाआरती तट)',
    ghatSelectionMethod: 'predefined',
    locationClassification: 'riverside',
    latitude: 23.1415,
    longitude: 79.9532,
    locationAccuracy: 12.5,
    locationCapturedAt: '10/10/2026, 11:28 am',
    isCustomVillage: false,
    pincode: '482001',
    fullAddress: 'गौरीघाट वार्ड नं. 4, जबलपुर, मध्य प्रदेश',
    applicationType: 'पर्यावरण स्वयंसेवक',
    reasonForJoining: 'माँ नर्मदा के पवित्र गौरीघाट को प्लास्टिक मुक्त व स्वच्छ रखने हेतु नियमित श्रमदान का संकल्प।',
    serviceInterests: ['नर्मदा घाट सफाई', 'प्लास्टिक प्रदूषण नियंत्रण', 'वृक्षारोपण'],
    interestTreePlantation: true,
    interestGhatSafai: true,
    interestEcoAwareness: false,
    interestPlasticControl: true,
    availableTime: 'सप्ताहांत (शनिवार / रविवार)',
    pastExperience: 'विगत 2 वर्षों से स्थानीय घाट सफाई समूहों के साथ श्रमदान।',
    consentDataUsage: true,
    consentPhotoUsage: true,
    verificationStatus: 'सत्यापित',
    registeredAt: '10/10/2026, 11:30 am',
    verifiedAt: '11/10/2026, 02:15 pm',
    verifiedBy: 'मुख्य अधिकृत एडमिन (SEVNF-ADMIN-01)',
    adminNotes: 'पहचान व स्थानीय निवास सत्यापित। घाट श्रमदान में सक्रिय सहभागिता अनुमोदित।',
  },
  {
    id: 'SEVNF-VOL-000102',
    applicationReference: 'SEVNF-APP-2026-000102',
    certificateNumber: 'CERT-SEVNF-2026-000102',
    receiptNumber: 'REC-SEVNF-2026-000102',
    fullName: 'प्रिया पटेल',
    fatherOrGuardianName: 'श्री नारायण पटेल',
    phone: '9425098765',
    alternatePhone: '',
    email: 'priya.patel@gmail.com',
    dob: '2001-08-22',
    gender: 'महिला',
    country: 'भारत (India)',
    state: 'मध्य प्रदेश (Madhya Pradesh)',
    district: 'नर्मदापुरम / होशंगाबाद (Narmadapuram)',
    tehsil: 'नर्मदापुरम मुख्यालय (सेठानी घाट परिक्षेत्र)',
    village: 'सेठानी घाट परिक्षेत्र',
    selectedGhat: 'सेठानी घाट (Sethani Ghat - मुख्य ऐतिहासिक महा-आरती घाट)',
    ghatSelectionMethod: 'predefined',
    locationClassification: 'riverside',
    latitude: 22.7533,
    longitude: 77.7289,
    locationAccuracy: 8.0,
    locationCapturedAt: '11/10/2026, 09:42 am',
    isCustomVillage: false,
    pincode: '461001',
    fullAddress: 'सेठानी घाट रोड, नर्मदापुरम',
    applicationType: 'नर्मदा प्रहरी',
    reasonForJoining: 'तटवर्ती विद्यालयों में पर्यावरण जन-जागरूकता फैलाना और घाटों पर कपड़े के थैलों का वितरण।',
    serviceInterests: ['पर्यावरण जागरूकता', 'प्लास्टिक प्रदूषण नियंत्रण', 'वृक्षारोपण'],
    interestTreePlantation: true,
    interestGhatSafai: false,
    interestEcoAwareness: true,
    interestPlasticControl: true,
    availableTime: 'मासिक 2-3 बार श्रमदान',
    pastExperience: 'महाविद्यालयीन राष्ट्रीय सेवा योजना (NSS) स्वयंसेविका।',
    consentDataUsage: true,
    consentPhotoUsage: true,
    verificationStatus: 'समीक्षा में',
    registeredAt: '11/10/2026, 09:45 am',
    adminNotes: 'दस्तावेज व फोटो समीक्षाधीन।',
  },
];

// Initialize Volunteers Store
export function getVolunteers(): VolunteerProfile[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_VOLUNTEERS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_VOLUNTEERS, JSON.stringify(INITIAL_SEED_VOLUNTEERS));
      return INITIAL_SEED_VOLUNTEERS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_SEED_VOLUNTEERS;
  } catch {
    return INITIAL_SEED_VOLUNTEERS;
  }
}

export function saveVolunteers(volunteers: VolunteerProfile[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_VOLUNTEERS, JSON.stringify(volunteers));
  } catch (err: any) {
    console.warn('Quota exceeded in localStorage saveVolunteers, pruning high-res photo payloads:', err);
    try {
      // Strip base64 photoUrl if payload exceeded storage quota
      const lightweight = volunteers.map((v) => ({
        ...v,
        photoUrl: v.photoUrl && v.photoUrl.startsWith('data:') && v.photoUrl.length > 2000 ? undefined : v.photoUrl,
      }));
      localStorage.setItem(STORAGE_KEY_VOLUNTEERS, JSON.stringify(lightweight.slice(0, 30)));
    } catch (fallbackErr) {
      console.warn('Could not persist all volunteers to local cache:', fallbackErr);
    }
  }
}

// Generate Next Sequential Application Reference and Volunteer IDs
export function generateNextApplicationRef(): {
  id: string;
  applicationReference: string;
  receiptNumber: string;
  certNumber: string;
} {
  const volunteers = getVolunteers();
  let maxSeq = 100;

  volunteers.forEach((v) => {
    // Check ID or applicationReference
    const match = (v.applicationReference || v.id).match(/(\d{6})/);
    if (match) {
      const num = parseInt(match[1], 10);
      if (num > maxSeq) maxSeq = num;
    }
  });

  const nextSeq = maxSeq + 1;
  const seqFormatted = String(nextSeq).padStart(6, '0');
  const id = `SEVNF-VOL-${seqFormatted}`;
  const applicationReference = `SEVNF-APP-2026-${seqFormatted}`;
  const receiptNumber = `REC-SEVNF-2026-${seqFormatted}`;
  const certNumber = `CERT-SEVNF-2026-${seqFormatted}`;

  return { id, applicationReference, receiptNumber, certNumber };
}

// Generate Next Unique Member ID (ONLY upon Admin Approval!)
export function generateNextMemberId(stateCode: string = 'MP'): string {
  const volunteers = getVolunteers();
  let maxSeq = 100;

  volunteers.forEach((v) => {
    if (v.memberId) {
      const match = v.memberId.match(/(\d{6})/);
      if (match) {
        const num = parseInt(match[1], 10);
        if (num > maxSeq) maxSeq = num;
      }
    }
  });

  const nextSeq = maxSeq + 1;
  const seqFormatted = String(nextSeq).padStart(6, '0');
  return `SEVNF-${stateCode}-2026-${seqFormatted}`;
}

// Register Volunteer / Submit Application
export function registerVolunteer(
  data: Omit<
    VolunteerProfile,
    | 'id'
    | 'applicationReference'
    | 'memberId'
    | 'certificateNumber'
    | 'receiptNumber'
    | 'registeredAt'
    | 'verificationStatus'
  >
): { volunteer: VolunteerProfile; receipt: ApplicationReceipt } {
  const { id, applicationReference, receiptNumber, certNumber } = generateNextApplicationRef();
  const now = new Date().toLocaleString('hi-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  const newVolunteer: VolunteerProfile = {
    ...data,
    id,
    applicationReference,
    certificateNumber: certNumber,
    receiptNumber,
    verificationStatus: 'आवेदन प्राप्त', // Starts as "Application Received" pending review
    registeredAt: now,
  };

  const list = getVolunteers();
  list.unshift(newVolunteer);
  saveVolunteers(list);

  // Set as current active member in session
  setActiveMemberId(newVolunteer.id);

  // Generate Official Receipt
  const receipt: ApplicationReceipt = {
    receiptNumber,
    applicationReference,
    submittedAt: now,
    applicantName: data.fullName,
    phone: data.phone,
    email: data.email,
    applicationType: data.applicationType || 'पर्यावरण स्वयंसेवक',
    country: data.country,
    state: data.state,
    district: data.district,
    tehsil: data.tehsil,
    village: data.isCustomVillage && data.customVillageName ? data.customVillageName : data.village,
    selectedGhat: data.selectedGhat,
    coordinates: data.latitude && data.longitude ? `${data.latitude}, ${data.longitude}` : undefined,
    status: 'आवेदन प्राप्त',
    trackingUrl: `${window.location.origin}/#track-application?ref=${applicationReference}`,
  };

  return { volunteer: newVolunteer, receipt };
}

// Update Volunteer
export function updateVolunteer(id: string, updates: Partial<VolunteerProfile>): VolunteerProfile | null {
  const list = getVolunteers();
  const idx = list.findIndex((v) => v.id === id);
  if (idx === -1) return null;

  list[idx] = { ...list[idx], ...updates };
  saveVolunteers(list);
  return list[idx];
}

// Find Volunteer by ID, Application Reference, Phone, or Cert Number
export function findVolunteer(query: string): VolunteerProfile | null {
  const trimmed = query.trim().toLowerCase();
  const list = getVolunteers();
  return (
    list.find(
      (v) =>
        v.id.toLowerCase() === trimmed ||
        (v.applicationReference && v.applicationReference.toLowerCase() === trimmed) ||
        (v.memberId && v.memberId.toLowerCase() === trimmed) ||
        v.phone.replace(/\D/g, '') === trimmed.replace(/\D/g, '') ||
        v.certificateNumber.toLowerCase() === trimmed
    ) || null
  );
}

// Track Application by Application Reference Number and Phone
export function trackApplication(
  applicationRef: string,
  phone: string
): {
  found: boolean;
  message?: string;
  data?: {
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
  };
} {
  const cleanRef = applicationRef.trim().toUpperCase();
  const cleanPhone = phone.trim().replace(/\D/g, '');
  const list = getVolunteers();

  const app = list.find((v) => {
    const refMatch =
      (v.applicationReference && v.applicationReference.toUpperCase() === cleanRef) ||
      v.id.toUpperCase() === cleanRef;
    const phoneMatch = v.phone.replace(/\D/g, '').endsWith(cleanPhone.slice(-10));
    return refMatch && phoneMatch;
  });

  if (!app) {
    return {
      found: false,
      message: 'दर्ज की गई आवेदन संख्या और मोबाइल नंबर से कोई आवेदन नहीं मिला। कृपया विवरण की जाँच करें।',
    };
  }

  // Mask Name: e.g. "राहुल शर्मा" -> "रा*** श***"
  const parts = app.fullName.trim().split(/\s+/);
  const maskedName = parts
    .map((p) => (p.length > 1 ? p[0] + '*'.repeat(Math.min(3, p.length - 1)) : p))
    .join(' ');

  // Mask Phone: e.g. "9826012345" -> "98****345"
  const pDigits = app.phone.replace(/\D/g, '');
  const maskedPhone =
    pDigits.length >= 10
      ? `${pDigits.slice(0, 2)}****${pDigits.slice(-3)}`
      : '******';

  return {
    found: true,
    data: {
      applicationReference: app.applicationReference || app.id,
      maskedName,
      maskedPhone,
      status: app.verificationStatus,
      submittedAt: app.registeredAt,
      reviewedAt: app.verifiedAt,
      reviewedBy: app.verifiedBy,
      memberId: app.verificationStatus === 'सत्यापित' ? app.memberId : undefined,
      certificateNumber: app.verificationStatus === 'सत्यापित' ? app.certificateNumber : undefined,
      reviewComment: app.adminNotes,
      rejectionReason: app.rejectionReason,
      state: app.state,
      district: app.district,
      applicationType: app.applicationType,
    },
  };
}

// Admin: Approve Application (Generates Permanent Member ID!)
export function approveApplication(
  id: string,
  adminId: string,
  adminName: string,
  comment?: string
): VolunteerProfile | null {
  const list = getVolunteers();
  const idx = list.findIndex((v) => v.id === id);
  if (idx === -1) return null;

  const now = new Date().toLocaleString('hi-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  // Idempotent: don't regenerate memberId if already approved
  if (!list[idx].memberId) {
    list[idx].memberId = generateNextMemberId('MP');
  }

  list[idx].verificationStatus = 'सत्यापित';
  list[idx].verifiedAt = now;
  list[idx].verifiedBy = `${adminName} (${adminId})`;
  if (comment) {
    list[idx].adminNotes = comment;
  }

  saveVolunteers(list);

  // Add Audit Log
  addAuditLogEntry({
    id: `AUD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp: now,
    adminId,
    adminName,
    action: 'APPROVE_APPLICATION',
    targetId: list[idx].id,
    targetName: list[idx].fullName,
    details: `आवेदन संख्या ${list[idx].applicationReference || list[idx].id} को स्वीकृत किया गया। सदस्य आईडी जारी: ${list[idx].memberId}`,
  });

  // Automatic In-App Approval Notification
  addInAppNotification({
    targetVolunteerId: list[idx].id,
    targetPhone: list[idx].phone,
    targetEmail: list[idx].email,
    title: 'स्वयंसेवक सदस्यता आवेदन स्वीकृत!',
    message: `बधाई हो! संघिया इको-विजन नर्मदा फाउंडेशन में आपका स्वयंसेवक आवेदन स्वीकृत हो गया है। आपकी सदस्य आईडी: ${list[idx].memberId}। आपका प्रमाणपत्र PDF डाउनलोड करने के लिए उपलब्ध है।`,
    type: 'approval',
    isRead: false,
    applicationReference: list[idx].applicationReference,
    memberId: list[idx].memberId,
    certificateNumber: list[idx].certificateNumber,
  });

  return list[idx];
}

// Admin: Reject Application
export function rejectApplication(
  id: string,
  adminId: string,
  adminName: string,
  reason: string
): VolunteerProfile | null {
  const list = getVolunteers();
  const idx = list.findIndex((v) => v.id === id);
  if (idx === -1) return null;

  const now = new Date().toLocaleString('hi-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  list[idx].verificationStatus = 'अस्वीकृत';
  list[idx].verifiedAt = now;
  list[idx].verifiedBy = `${adminName} (${adminId})`;
  list[idx].rejectionReason = reason;

  saveVolunteers(list);

  // Add Audit Log
  addAuditLogEntry({
    id: `AUD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp: now,
    adminId,
    adminName,
    action: 'REJECT_APPLICATION',
    targetId: list[idx].id,
    targetName: list[idx].fullName,
    details: `आवेदन अस्वीकृत किया गया। कारण: ${reason}`,
  });

  return list[idx];
}

// Admin: Update Status (e.g. Action Required, Under Review)
export function updateApplicationStatus(
  id: string,
  newStatus: VerificationStatus,
  adminId: string,
  adminName: string,
  notes?: string
): VolunteerProfile | null {
  const list = getVolunteers();
  const idx = list.findIndex((v) => v.id === id);
  if (idx === -1) return null;

  const now = new Date().toLocaleString('hi-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  list[idx].verificationStatus = newStatus;
  list[idx].verifiedAt = now;
  list[idx].verifiedBy = `${adminName} (${adminId})`;
  if (notes) {
    list[idx].adminNotes = notes;
  }

  saveVolunteers(list);

  // Add Audit Log
  addAuditLogEntry({
    id: `AUD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp: now,
    adminId,
    adminName,
    action: 'UPDATE_STATUS',
    targetId: list[idx].id,
    targetName: list[idx].fullName,
    details: `आवेदन स्थिति '${newStatus}' में परिवर्तित की गई। टिप्पणी: ${notes || 'कोई टिप्पणी नहीं'}`,
  });

  return list[idx];
}

// Audit Logs Management
export function getAuditLogs(): AuditLogEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_AUDIT_LOGS);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function addAuditLogEntry(entry: AuditLogEntry): void {
  try {
    const logs = getAuditLogs();
    logs.unshift(entry);
    // Keep last 200 logs
    const trimmed = logs.slice(0, 200);
    localStorage.setItem(STORAGE_KEY_AUDIT_LOGS, JSON.stringify(trimmed));
  } catch (err) {
    console.warn('Failed to save audit log:', err);
  }
}

// Check Certificate Eligibility
export function checkCertificateEligibility(volunteer: VolunteerProfile): {
  eligible: boolean;
  message: string;
} {
  if (volunteer.verificationStatus === 'सत्यापित') {
    return {
      eligible: true,
      message: 'आपका आवेदन सत्यापित है। आप अपना आधिकारिक सदस्यता प्रमाणपत्र PDF डाउनलोड कर सकते हैं।',
    };
  }

  return {
    eligible: false,
    message:
      'आपका आवेदन अभी समीक्षा में है। अधिकृत सत्यापन पूरा होने के बाद ही सदस्यता प्रमाणपत्र जारी होगा।',
  };
}

// Active Member Session
export function getActiveMemberId(): string | null {
  return localStorage.getItem(STORAGE_KEY_ACTIVE_MEMBER);
}

export function setActiveMemberId(id: string | null): void {
  if (id) {
    localStorage.setItem(STORAGE_KEY_ACTIVE_MEMBER, id);
  } else {
    localStorage.removeItem(STORAGE_KEY_ACTIVE_MEMBER);
  }
}

// Public Safe Verification Details (Strictly excludes phone, email, full home address)
export function getPublicVerificationDetails(certOrVolId: string): {
  found: boolean;
  certificateNumber?: string;
  volunteerId?: string;
  memberId?: string;
  fullName?: string;
  verificationStatus?: VerificationStatus;
  state?: string;
  district?: string;
  tehsil?: string;
  registeredAt?: string;
  verifiedAt?: string;
  isEligibleAndValid?: boolean;
} {
  const vol = findVolunteer(certOrVolId);
  if (!vol) {
    return { found: false };
  }

  return {
    found: true,
    certificateNumber: vol.certificateNumber,
    volunteerId: vol.id,
    memberId: vol.memberId,
    fullName: vol.fullName,
    verificationStatus: vol.verificationStatus,
    state: vol.state,
    district: vol.district,
    tehsil: vol.tehsil,
    registeredAt: vol.registeredAt,
    verifiedAt: vol.verifiedAt,
    isEligibleAndValid: vol.verificationStatus === 'सत्यापित',
  };
}

// Location Management
export function getLocations(): LocationState[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_LOCATIONS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_LOCATIONS, JSON.stringify(INITIAL_LOCATION_DATA));
      return INITIAL_LOCATION_DATA;
    }
    const parsed = JSON.parse(raw);
    const hasGhats = Array.isArray(parsed) && parsed.some((s: any) => s.districts?.some((d: any) => Array.isArray(d.ghats) && d.ghats.length > 0));
    if (!hasGhats) {
      localStorage.setItem(STORAGE_KEY_LOCATIONS, JSON.stringify(INITIAL_LOCATION_DATA));
      return INITIAL_LOCATION_DATA;
    }
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_LOCATION_DATA;
  } catch {
    return INITIAL_LOCATION_DATA;
  }
}

export function saveLocations(locations: LocationState[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_LOCATIONS, JSON.stringify(locations));
  } catch (err) {
    console.warn('Failed to save locations:', err);
  }
}

// Permanent Official Logo Management
export function getPermanentLogo(): string {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_PERMANENT_LOGO);
    if (saved && saved.trim()) return saved;
  } catch {
    // fallback
  }
  return SITE_CONFIG.logo.primaryPath || '/file_00000000306082118bbb5f0c42339ad4.png';
}

export function savePermanentLogo(logoUrl: string): void {
  // If large base64 data URL, downscale immediately to prevent QuotaExceededError
  if (logoUrl.startsWith('data:image')) {
    const img = new Image();
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const maxDim = 180;
        let width = img.width;
        let height = img.height;
        if (width > height && width > maxDim) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else if (height > maxDim) {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL('image/png', 0.7);
          try {
            localStorage.setItem(STORAGE_KEY_PERMANENT_LOGO, compressed);
            window.dispatchEvent(new Event('sanghiya-permanent-logo-changed'));
          } catch (storageErr) {
            console.warn('Could not store compressed logo:', storageErr);
          }
        }
      } catch (innerErr) {
        console.warn('Failed to compress permanent logo:', innerErr);
      }
    };
    img.src = logoUrl;
    return;
  }

  try {
    localStorage.setItem(STORAGE_KEY_PERMANENT_LOGO, logoUrl);
    window.dispatchEvent(new Event('sanghiya-permanent-logo-changed'));
  } catch (err) {
    console.warn('Could not save permanent logo:', err);
  }
}

export function resetPermanentLogo(): void {
  try {
    localStorage.removeItem(STORAGE_KEY_PERMANENT_LOGO);
  } catch (err) {
    console.warn('Failed to reset permanent logo:', err);
  }
}

// Admin Authentication Session
export interface AdminInfo {
  adminId: string;
  name: string;
  role: string;
}

export function isAdminAuthenticated(): boolean {
  return sessionStorage.getItem(STORAGE_KEY_ADMIN) === 'true';
}

export function getAdminSessionInfo(): AdminInfo {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY_ADMIN_INFO);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return {
    adminId: 'SEVNF-ADMIN-01',
    name: 'मुख्य अधिकृत एडमिन',
    role: 'Chief Administrator',
  };
}

export function setAdminAuthenticated(auth: boolean, info?: AdminInfo): void {
  if (auth) {
    sessionStorage.setItem(STORAGE_KEY_ADMIN, 'true');
    if (info) {
      sessionStorage.setItem(STORAGE_KEY_ADMIN_INFO, JSON.stringify(info));
    }
  } else {
    sessionStorage.removeItem(STORAGE_KEY_ADMIN);
    sessionStorage.removeItem(STORAGE_KEY_ADMIN_INFO);
  }
}

// User Accounts Management (Member signup / login)
export function getUserAccounts(): UserAccount[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_USERS);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function getCurrentUser(): UserAccount | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CURRENT_USER);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setCurrentUser(user: UserAccount | null): void {
  if (user) {
    localStorage.setItem(STORAGE_KEY_CURRENT_USER, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEY_CURRENT_USER);
  }
}

// Database Backup & Restore Utility
export interface DatabaseBackupPayload {
  version: string;
  exportedAt: string;
  foundation: string;
  volunteersCount: number;
  volunteers: VolunteerProfile[];
  locations: LocationState[];
  auditLogs?: AuditLogEntry[];
}

export function exportDatabaseBackup(): string {
  const payload: DatabaseBackupPayload = {
    version: '3.0.0',
    exportedAt: new Date().toISOString(),
    foundation: 'संघिया इको-विजन नर्मदा फाउंडेशन (Sanghiya Eco-Vision Narmada Foundation)',
    volunteersCount: getVolunteers().length,
    volunteers: getVolunteers(),
    locations: getLocations(),
    auditLogs: getAuditLogs(),
  };
  return JSON.stringify(payload, null, 2);
}

export function importDatabaseBackup(jsonString: string): {
  success: boolean;
  message: string;
  importedCount?: number;
} {
  try {
    const parsed = JSON.parse(jsonString) as Partial<DatabaseBackupPayload>;
    if (!parsed || !Array.isArray(parsed.volunteers)) {
      return {
        success: false,
        message: 'अमान्य बैकअप फाइल। इसमें वॉलंटियर्स का वैध डेटा नहीं मिला।',
      };
    }

    const existingList = getVolunteers();
    const existingIds = new Set(existingList.map((v) => v.id));

    let newCount = 0;
    const mergedList = [...existingList];

    parsed.volunteers.forEach((v) => {
      if (v.id && !existingIds.has(v.id)) {
        mergedList.push(v);
        existingIds.add(v.id);
        newCount++;
      } else if (v.id && existingIds.has(v.id)) {
        const idx = mergedList.findIndex((item) => item.id === v.id);
        if (idx !== -1) {
          mergedList[idx] = { ...mergedList[idx], ...v };
        }
      }
    });

    saveVolunteers(mergedList);

    if (Array.isArray(parsed.locations) && parsed.locations.length > 0) {
      saveLocations(parsed.locations);
    }

    if (Array.isArray(parsed.auditLogs) && parsed.auditLogs.length > 0) {
      const existingLogs = getAuditLogs();
      const mergedLogs = [...parsed.auditLogs, ...existingLogs];
      localStorage.setItem(STORAGE_KEY_AUDIT_LOGS, JSON.stringify(mergedLogs.slice(0, 200)));
    }

    return {
      success: true,
      message: `बैकअप सफलतापूर्वक रीस्टोर किया गया! ${newCount} नए रिकॉर्ड जोड़े गए। कुल रिकॉर्ड: ${mergedList.length}`,
      importedCount: mergedList.length,
    };
  } catch {
    return {
      success: false,
      message: 'बैकअप फाइल पढ़ने में त्रुटि: अमान्य JSON प्रारूप।',
    };
  }
}

// ==========================================
// Founder Signature Management
// ==========================================
export function getFounderSignatureConfig(): FounderSignatureConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SIGNATURE);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.imageUrl) return parsed;
    }
  } catch (err) {
    console.warn('Error reading founder signature config:', err);
  }
  return DEFAULT_FOUNDER_SIGNATURE_DATA;
}

export function saveFounderSignatureConfig(config: Partial<FounderSignatureConfig>): FounderSignatureConfig {
  const current = getFounderSignatureConfig();
  const merged: FounderSignatureConfig = {
    ...current,
    ...config,
    founderName: config.name || config.founderName || current.founderName,
    name: config.name || config.founderName || current.founderName,
    updatedAt: new Date().toISOString(),
  };

  try {
    localStorage.setItem(STORAGE_KEY_SIGNATURE, JSON.stringify(merged));
    window.dispatchEvent(new Event('sanghiya-signature-changed'));
  } catch (err) {
    console.warn('Error saving founder signature config:', err);
  }
  return merged;
}

export function resetFounderSignatureConfig(): FounderSignatureConfig {
  try {
    localStorage.removeItem(STORAGE_KEY_SIGNATURE);
    window.dispatchEvent(new Event('sanghiya-signature-changed'));
  } catch (err) {
    console.warn('Error resetting founder signature config:', err);
  }
  return DEFAULT_FOUNDER_SIGNATURE_DATA;
}

// ==========================================
// In-App Notification System
// ==========================================
export function getInAppNotifications(targetPhoneOrId?: string): InAppNotification[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_NOTIFICATIONS);
    let list: InAppNotification[] = [];
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_NOTIFICATIONS, JSON.stringify(INITIAL_SEED_NOTIFICATIONS));
      list = INITIAL_SEED_NOTIFICATIONS;
    } else {
      const parsed = JSON.parse(raw);
      list = Array.isArray(parsed) ? parsed : INITIAL_SEED_NOTIFICATIONS;
    }

    if (targetPhoneOrId) {
      const cleanTarget = targetPhoneOrId.trim().toLowerCase();
      const cleanDigits = targetPhoneOrId.replace(/\D/g, '');
      return list.filter((n) => {
        if (!n.targetVolunteerId && !n.targetPhone && !n.targetEmail) return true; // broadcast
        if (n.targetVolunteerId && n.targetVolunteerId.toLowerCase() === cleanTarget) return true;
        if (n.targetPhone && cleanDigits && n.targetPhone.replace(/\D/g, '').endsWith(cleanDigits.slice(-10))) return true;
        if (n.targetEmail && n.targetEmail.toLowerCase() === cleanTarget) return true;
        return false;
      });
    }

    return list;
  } catch {
    return INITIAL_SEED_NOTIFICATIONS;
  }
}

export function addInAppNotification(notification: Omit<InAppNotification, 'id' | 'createdAt'>): InAppNotification {
  const newNotif: InAppNotification = {
    ...notification,
    id: `NOTIF-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    createdAt: new Date().toLocaleString('hi-IN', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }),
  };

  try {
    const current = getInAppNotifications();
    // Prevent duplicate approval notification for same applicationReference
    const exists = current.find(
      (n) =>
        n.type === notification.type &&
        n.applicationReference &&
        n.applicationReference === notification.applicationReference
    );
    if (!exists) {
      current.unshift(newNotif);
      localStorage.setItem(STORAGE_KEY_NOTIFICATIONS, JSON.stringify(current.slice(0, 100)));
      window.dispatchEvent(new Event('sanghiya-notifications-changed'));
    }
  } catch (err) {
    console.warn('Error saving in-app notification:', err);
  }

  return newNotif;
}

export function markNotificationAsRead(id: string): void {
  try {
    const current = getInAppNotifications();
    const updated = current.map((n) => (n.id === id ? { ...n, isRead: true } : n));
    localStorage.setItem(STORAGE_KEY_NOTIFICATIONS, JSON.stringify(updated));
    window.dispatchEvent(new Event('sanghiya-notifications-changed'));
  } catch (err) {
    console.warn('Error marking notification as read:', err);
  }
}

export function markAllNotificationsAsRead(): void {
  try {
    const current = getInAppNotifications();
    const updated = current.map((n) => ({ ...n, isRead: true }));
    localStorage.setItem(STORAGE_KEY_NOTIFICATIONS, JSON.stringify(updated));
    window.dispatchEvent(new Event('sanghiya-notifications-changed'));
  } catch (err) {
    console.warn('Error marking all notifications as read:', err);
  }
}

export function getUnreadNotificationsCount(targetPhoneOrId?: string): number {
  const list = getInAppNotifications(targetPhoneOrId);
  return list.filter((n) => !n.isRead).length;
}

// ==========================================
// Permitted Volunteer Profile Updates
// ==========================================
export function updateVolunteerProfilePermitted(
  id: string,
  permittedUpdates: {
    alternatePhone?: string;
    email?: string;
    dob?: string;
    gender?: 'पुरुष' | 'महिला' | 'अन्य' | 'उल्लेख नहीं करना चाहते' | '';
    photoUrl?: string;
    village?: string;
    isCustomVillage?: boolean;
    customVillageName?: string;
    pincode?: string;
    fullAddress?: string;
    reasonForJoining?: string;
    serviceInterests?: string[];
    availableTime?: string;
    pastExperience?: string;
  }
): { success: boolean; volunteer?: VolunteerProfile; error?: string } {
  const list = getVolunteers();
  const idx = list.findIndex((v) => v.id === id);
  if (idx === -1) {
    return { success: false, error: 'वॉलंटियर प्रोफाइल नहीं मिली।' };
  }

  const current = list[idx];
  const updated: VolunteerProfile = {
    ...current,
    alternatePhone: permittedUpdates.alternatePhone !== undefined ? permittedUpdates.alternatePhone : current.alternatePhone,
    email: permittedUpdates.email !== undefined ? permittedUpdates.email : current.email,
    dob: permittedUpdates.dob !== undefined ? permittedUpdates.dob : current.dob,
    gender: permittedUpdates.gender !== undefined ? permittedUpdates.gender : current.gender,
    photoUrl: permittedUpdates.photoUrl !== undefined ? permittedUpdates.photoUrl : current.photoUrl,
    village: permittedUpdates.village !== undefined ? permittedUpdates.village : current.village,
    isCustomVillage: permittedUpdates.isCustomVillage !== undefined ? permittedUpdates.isCustomVillage : current.isCustomVillage,
    customVillageName: permittedUpdates.customVillageName !== undefined ? permittedUpdates.customVillageName : current.customVillageName,
    pincode: permittedUpdates.pincode !== undefined ? permittedUpdates.pincode : current.pincode,
    fullAddress: permittedUpdates.fullAddress !== undefined ? permittedUpdates.fullAddress : current.fullAddress,
    reasonForJoining: permittedUpdates.reasonForJoining !== undefined ? permittedUpdates.reasonForJoining : current.reasonForJoining,
    serviceInterests: permittedUpdates.serviceInterests !== undefined ? permittedUpdates.serviceInterests : current.serviceInterests,
    availableTime: permittedUpdates.availableTime !== undefined ? permittedUpdates.availableTime : current.availableTime,
    pastExperience: permittedUpdates.pastExperience !== undefined ? permittedUpdates.pastExperience : current.pastExperience,
    // Non-permitted fields are strictly preserved:
    id: current.id,
    applicationReference: current.applicationReference,
    memberId: current.memberId,
    certificateNumber: current.certificateNumber,
    verificationStatus: current.verificationStatus,
    registeredAt: current.registeredAt,
    verifiedAt: current.verifiedAt,
    verifiedBy: current.verifiedBy,
  };

  list[idx] = updated;
  saveVolunteers(list);
  return { success: true, volunteer: updated };
}
