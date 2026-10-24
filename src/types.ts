export type AppRole = 'volunteer' | 'officer' | 'superadmin';

export type PageId =
  | 'home'
  | 'about'
  | 'campaigns'
  | 'gallery'
  | 'narmada-prahari'
  | 'volunteer'
  | 'volunteer-profile'
  | 'track-application'
  | 'verify-certificate'
  | 'officer-login'
  | 'officer-dashboard'
  | 'admin'
  | 'contact'
  | 'privacy';

export type VerificationStatus =
  | 'आवेदन प्राप्त'
  | 'समीक्षा में'
  | 'सत्यापित'
  | 'अतिरिक्त जानकारी आवश्यक'
  | 'अस्वीकृत'
  | 'निष्क्रिय';

export type OfficerApplicationStatus = 'Pending' | 'Under Review' | 'Approved' | 'Rejected';

export interface OfficerApplication {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  cityVillage: string;
  district?: string;
  reasonForApplying: string;
  experienceDetails: string;
  appliedAt: string;
  status: OfficerApplicationStatus;
  reviewedBy?: string;
  reviewedAt?: string;
  rejectionReason?: string;
  appointedAsOfficer?: boolean;
  appointedAt?: string;
  officialOfficerId?: string;
  assignedZone?: string;
  notes?: string;
}

export type ApplicationType =
  | 'नर्मदा प्रहरी'
  | 'पर्यावरण स्वयंसेवक'
  | 'सक्रिय सदस्य';

export interface LocationGhat {
  id: string;
  name: string;
  districtId: string;
  tehsilId?: string;
  locality?: string;
  isRiverside?: boolean;
}

export interface LocationVillage {
  id: string;
  name: string;
  tehsilId: string;
  isActive: boolean;
}

export interface LocationTehsil {
  id: string;
  name: string;
  districtId: string;
  isActive: boolean;
  villages?: LocationVillage[];
  ghats?: LocationGhat[];
}

export interface LocationDistrict {
  id: string;
  name: string;
  stateId: string;
  isActive: boolean;
  classification?: 'riverside' | 'basin' | 'service_area';
  classificationLabel?: string;
  isRiverside?: boolean;
  tehsils?: LocationTehsil[];
  ghats?: LocationGhat[];
}

export interface LocationState {
  id: string;
  name: string;
  country: string;
  isActive: boolean;
  districts?: LocationDistrict[];
}

export interface VolunteerProfile {
  // Permanent Identifiers
  id: string; // Internal / Volunteer ID (e.g. SEVNF-VOL-000101)
  applicationReference: string; // Distinct Application Reference Number (e.g. SEVNF-APP-2026-000101)
  memberId?: string; // Distinct Member ID (e.g. SEVNF-MP-2026-000101) - ONLY generated on Admin Approval!
  certificateNumber: string; // e.g. CERT-SEVNF-2026-000101
  receiptNumber?: string; // e.g. REC-SEVNF-2026-000101
  
  // Section A: Personal Information
  fullName: string;
  fatherOrGuardianName?: string;
  photoUrl?: string; // base64 or stored URL (supports up to 20MB)
  phone: string;
  alternatePhone?: string;
  email?: string;
  dob?: string;
  gender?: 'पुरुष' | 'महिला' | 'अन्य' | 'उल्लेख नहीं करना चाहते' | '';

  // Section B: Address & Location
  country: string;
  state: string;
  district: string;
  tehsil: string;
  village: string;
  isCustomVillage?: boolean;
  customVillageName?: string;
  pincode: string;
  fullAddress?: string;

  // Section B.6: Ghat & Geolocation fields
  selectedGhat?: string;
  isCustomGhat?: boolean;
  customGhatName?: string;
  ghatSelectionMethod?: 'predefined' | 'custom' | 'gps' | 'none';
  latitude?: number;
  longitude?: number;
  locationAccuracy?: number; // in meters
  locationCapturedAt?: string;
  locationClassification?: 'riverside' | 'basin' | 'service_area';

  // Section C: Service & Contributions
  applicationType: ApplicationType;
  reasonForJoining: string;
  serviceInterests: string[];
  interestTreePlantation: boolean;
  interestGhatSafai: boolean;
  interestEcoAwareness: boolean;
  interestPlasticControl: boolean;
  availableTime: string;
  pastExperience?: string;

  // Consent & Declaration
  consentDataUsage: boolean;
  consentPhotoUsage: boolean;

  // Verification & Decision Metadata
  verificationStatus: VerificationStatus;
  registeredAt: string;
  verifiedAt?: string;
  verifiedBy?: string;
  adminNotes?: string;
  rejectionReason?: string;
}

export interface ApplicationReceipt {
  receiptNumber: string;
  applicationReference: string;
  submittedAt: string;
  applicantName: string;
  phone: string;
  email?: string;
  applicationType: string;
  country: string;
  state: string;
  district: string;
  tehsil: string;
  village: string;
  selectedGhat?: string;
  coordinates?: string;
  status: VerificationStatus;
  trackingUrl: string;
  qrCodeDataUrl?: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  adminId: string;
  adminName: string;
  action:
    | 'APPROVE_APPLICATION'
    | 'REJECT_APPLICATION'
    | 'UPDATE_STATUS'
    | 'ADMIN_LOGIN'
    | 'ADMIN_SETUP'
    | 'UPDATE_LOGO'
    | 'EXPORT_BACKUP'
    | 'RESTORE_BACKUP';
  targetId?: string;
  targetName?: string;
  details: string;
  ip?: string;
}

export interface UserAccount {
  id: string;
  uid?: string;
  fullName: string;
  phone: string;
  email: string;
  photoURL?: string;
  role: 'volunteer' | 'officer' | 'superadmin' | 'member' | 'admin';
  assignedZone?: string;
  isRevoked?: boolean;
  createdAt: string;
  applicationReference?: string;
  memberId?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
  sentAt: string;
}

export interface CampaignItem {
  id: string;
  title: string;
  subtitle: string;
  iconName: string;
  colorScheme: 'emerald' | 'sky' | 'amber' | 'teal';
  objective: string;
  description: string;
  keyActions: string[];
  howToJoin: string;
  statusBadge: string;
  imagePlaceholderText: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'घाट सफाई' | 'प्लास्टिक मुक्ति' | 'पर्यावरण जागरूकता' | 'वृक्षारोपण' | 'तट संरक्षण';
  location: string;
  description: string;
  isSymbolic: boolean;
  customImageUrl?: string;
}

export interface FounderSignatureConfig {
  imageUrl: string;
  name?: string;
  founderName: string;
  founderNameEnglish: string;
  designationHindi: string;
  designationEnglish: string;
  isActive: boolean;
  approvedAt?: string;
  approvedBy?: string;
  updatedAt?: string;
  updatedBy?: string;
}

export interface InAppNotification {
  id: string;
  volunteerId?: string;
  targetVolunteerId?: string;
  targetPhone?: string;
  targetEmail?: string;
  title: string;
  message: string;
  type: 'approval' | 'rejection' | 'status_update' | 'general';
  isRead: boolean;
  createdAt: string;
  applicationReference?: string;
  memberId?: string;
  certificateNumber?: string;
}
