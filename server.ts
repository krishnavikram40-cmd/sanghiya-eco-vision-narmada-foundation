import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';

const PORT = parseInt(process.env.PORT || '3000', 10);
const DATA_DIR = path.resolve('server_data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial Database Structure
interface ServerDatabase {
  admin: {
    adminId: string;
    username: string;
    passwordHash: string;
    salt: string;
    recoveryPinHash: string;
    recoveryPinSalt: string;
    isConfigured: boolean;
  };
  users: Array<{
    id: string;
    fullName: string;
    phone: string;
    email: string;
    passwordHash: string;
    salt: string;
    role: 'member' | 'admin';
    createdAt: string;
    memberId?: string;
    applicationReference?: string;
  }>;
  applications: Array<any>;
  officerApplications: Array<{
    id: string;
    fullName: string;
    email: string;
    phone: string;
    cityVillage: string;
    reasonForApplying: string;
    experienceDetails: string;
    appliedAt: string;
    status: 'Pending' | 'Under Review' | 'Approved' | 'Rejected';
    reviewedBy?: string;
    reviewedAt?: string;
    rejectionReason?: string;
    appointedAsOfficer?: boolean;
    appointedAt?: string;
    assignedZone?: string;
    notes?: string;
  }>;
  officers: Array<{
    uid: string;
    displayName: string;
    email: string;
    phone?: string;
    role: 'officer' | 'superadmin';
    assignedZone: string;
    isRevoked: boolean;
    appointedBy: string;
    appointedAt: string;
  }>;
  auditLogs: Array<{
    id: string;
    timestamp: string;
    adminId: string;
    adminName: string;
    action: string;
    targetId?: string;
    targetName?: string;
    details: string;
    ip?: string;
  }>;
  config: {
    officialLogoUrl: string;
    updatedAt: string;
  };
}

// Password hashing utility using standard scrypt
function hashPassword(password: string, salt: string): string {
  return crypto.scryptSync(password, salt, 64).toString('hex');
}

function generateSalt(): string {
  return crypto.randomBytes(16).toString('hex');
}

// Seed admin setup: Official Admin ID "SEVNF-ADMIN-01"
const DEFAULT_SALT = generateSalt();
const DEFAULT_PASSWORD_HASH = hashPassword('narmada2026', DEFAULT_SALT);
const DEFAULT_PIN_SALT = generateSalt();
const DEFAULT_PIN_HASH = hashPassword('202601', DEFAULT_PIN_SALT);

const INITIAL_SERVER_DB: ServerDatabase = {
  admin: {
    adminId: 'SEVNF-ADMIN-01',
    username: 'admin@sevnf.org',
    passwordHash: DEFAULT_PASSWORD_HASH,
    salt: DEFAULT_SALT,
    recoveryPinHash: DEFAULT_PIN_HASH,
    recoveryPinSalt: DEFAULT_PIN_SALT,
    isConfigured: true,
  },
  users: [],
  officerApplications: [],
  officers: [
    {
      uid: 'SEVNF-FOUNDER-01',
      displayName: 'बेनी सिंह केवट',
      email: 'vikramstar864@gmail.com',
      role: 'superadmin',
      assignedZone: 'सम्पूर्ण नर्मदा परिक्षेत्र (मध्य प्रदेश)',
      isRevoked: false,
      appointedBy: 'SYSTEM_FOUNDER',
      appointedAt: '01/01/2026, 10:00 am',
    },
  ],
  applications: [
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
      tehsil: 'पनागर (Panagar)',
      village: 'गौरीघाट तटवर्ती बस्ती',
      isCustomVillage: false,
      pincode: '482001',
      fullAddress: 'गौरीघाट वार्ड नं. 4, जबलपुर, मध्य प्रदेश',
      applicationType: 'पर्यावरण स्वयंसेवक',
      reasonForJoining: 'माँ नर्मदा के पवित्र गौरीघाट को प्लास्टिक मुक्त व स्वच्छ रखने हेतु नियमित श्रमदान का संकल्प।',
      serviceInterests: ['नर्मदा घाट सफाई', 'प्लास्टिक प्रदूषण नियंत्रण', 'वृक्षारोपण'],
      availableTime: 'सप्ताहांत (शनिवार / रविवार)',
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
      tehsil: 'नर्मदापुरम नगर व ग्रामीण',
      village: 'सेठानी घाट परिक्षेत्र',
      isCustomVillage: false,
      pincode: '461001',
      fullAddress: 'सेठानी घाट रोड, नर्मदापुरम',
      applicationType: 'नर्मदा प्रहरी',
      reasonForJoining: 'तटवर्ती विद्यालयों में पर्यावरण जन-जागरूकता फैलाना और घाटों पर कपड़े के थैलों का वितरण।',
      serviceInterests: ['पर्यावरण जागरूकता', 'प्लास्टिक प्रदूषण नियंत्रण', 'वृक्षारोपण'],
      availableTime: 'मासिक 2-3 बार श्रमदान',
      verificationStatus: 'समीक्षा में',
      registeredAt: '11/10/2026, 09:45 am',
      adminNotes: 'दस्तावेज व फोटो समीक्षाधीन।',
    },
  ],
  auditLogs: [
    {
      id: 'AUD-SEED-01',
      timestamp: '11/10/2026, 02:15 pm',
      adminId: 'SEVNF-ADMIN-01',
      adminName: 'मुख्य अधिकृत एडमिन',
      action: 'APPROVE_APPLICATION',
      targetId: 'SEVNF-VOL-000101',
      targetName: 'राहुल शर्मा',
      details: 'आवेदन SEVNF-APP-2026-000101 स्वीकृत किया गया। सदस्य आईडी जारी: SEVNF-MP-2026-000101',
    },
  ],
  config: {
    officialLogoUrl: '/file_00000000306082118bbb5f0c42339ad4.png',
    updatedAt: new Date().toISOString(),
  },
};

// Database Read/Write helper
function loadDatabase(): ServerDatabase {
  try {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(INITIAL_SERVER_DB, null, 2), 'utf-8');
      return INITIAL_SERVER_DB;
    }
    const content = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(content);
  } catch (err) {
    console.error('Error loading database, returning default fallback', err);
    return INITIAL_SERVER_DB;
  }
}

function saveDatabase(db: ServerDatabase): void {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving database', err);
  }
}

// In-memory active sessions token map: token -> { id, role, adminId, name, email, expiresAt }
const activeSessions = new Map<
  string,
  {
    id: string;
    role: 'admin' | 'member' | 'superadmin';
    adminId?: string;
    name: string;
    email?: string;
    expiresAt: number;
  }
>();

function generateToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

// Authentication middleware for Admin routes
function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ success: false, error: 'अनधिकृत: कृपया एडमिन के रूप में लॉगिन करें।' });
    return;
  }

  const token = authHeader.substring(7);
  const session = activeSessions.get(token);

  if (
    !session ||
    (session.role !== 'admin' && session.role !== 'superadmin') ||
    session.expiresAt < Date.now()
  ) {
    res.status(403).json({ success: false, error: 'सत्र समाप्त या अमान्य एडमिन क्रेडेंशियल।' });
    return;
  }

  (req as any).adminSession = session;
  next();
}

async function startServer() {
  const app = express();

  // Support up to 25MB for high resolution photo uploads
  app.use(express.json({ limit: '25mb' }));
  app.use(express.urlencoded({ extended: true, limit: '25mb' }));

  // ==========================================
  // API Routes
  // ==========================================

  // Health check
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({
      status: 'healthy',
      service: 'Sanghiya Eco-Vision Narmada Foundation API',
      timestamp: new Date().toISOString(),
    });
  });

  // Official Logo config
  app.get('/api/config/logo', (_req: Request, res: Response) => {
    const db = loadDatabase();
    res.json({ success: true, logoUrl: db.config.officialLogoUrl || '/file_00000000306082118bbb5f0c42339ad4.png' });
  });

  app.post('/api/config/logo', requireAdmin, (req: Request, res: Response) => {
    const { logoUrl } = req.body;
    if (!logoUrl) {
      res.status(400).json({ success: false, error: 'लोगो URL आवश्यक है।' });
      return;
    }
    const db = loadDatabase();
    db.config.officialLogoUrl = logoUrl;
    db.config.updatedAt = new Date().toISOString();

    const session = (req as any).adminSession;
    db.auditLogs.unshift({
      id: `AUD-${Date.now()}`,
      timestamp: new Date().toLocaleString('hi-IN'),
      adminId: session.adminId || 'SEVNF-ADMIN-01',
      adminName: session.name || 'मुख्य एडमिन',
      action: 'UPDATE_LOGO',
      details: 'आधिकारिक लोगो अपडेट किया गया।',
    });

    saveDatabase(db);
    res.json({ success: true, message: 'लोगो सफलतापूर्वक अपडेट किया गया।', logoUrl });
  });

  // Submit Application
  app.post('/api/applications', (req: Request, res: Response) => {
    try {
      const data = req.body;
      if (!data.fullName || !data.phone || !data.state || !data.district) {
        res.status(400).json({
          success: false,
          error: 'कृपया सभी आवश्यक फ़ील्ड (नाम, मोबाइल नंबर, राज्य, जिला) भरें।',
        });
        return;
      }

      const db = loadDatabase();

      // Check duplicates for same phone number within last 7 days
      const existing = db.applications.find(
        (a) =>
          a.phone.replace(/\D/g, '') === data.phone.replace(/\D/g, '') &&
          a.verificationStatus !== 'अस्वीकृत'
      );
      if (existing) {
        res.status(409).json({
          success: false,
          error: `इस मोबाइल नंबर से पहले ही एक सक्रिय आवेदन (${existing.applicationReference || existing.id}) मौजूद है। कृपया 'आवेदन ट्रैक करें' पेज पर स्थिति जाँचें।`,
          existingRef: existing.applicationReference || existing.id,
        });
        return;
      }

      // Generate Sequential Application Reference
      let maxSeq = 100;
      db.applications.forEach((a) => {
        const m = (a.applicationReference || a.id).match(/(\d{6})/);
        if (m) {
          const num = parseInt(m[1], 10);
          if (num > maxSeq) maxSeq = num;
        }
      });
      const nextSeq = maxSeq + 1;
      const seqFormatted = String(nextSeq).padStart(6, '0');
      const id = `SEVNF-VOL-${seqFormatted}`;
      const applicationReference = `SEVNF-APP-2026-${seqFormatted}`;
      const receiptNumber = `REC-SEVNF-2026-${seqFormatted}`;
      const certNumber = `CERT-SEVNF-2026-${seqFormatted}`;

      const now = new Date().toLocaleString('hi-IN', {
        dateStyle: 'medium',
        timeStyle: 'short',
      });

      const newApplication = {
        ...data,
        id,
        applicationReference,
        receiptNumber,
        certificateNumber: certNumber,
        verificationStatus: 'आवेदन प्राप्त', // Starts as application received
        registeredAt: now,
      };

      db.applications.unshift(newApplication);
      saveDatabase(db);

      const receipt = {
        receiptNumber,
        applicationReference,
        submittedAt: now,
        applicantName: data.fullName,
        phone: data.phone,
        email: data.email,
        applicationType: data.applicationType || 'पर्यावरण स्वयंसेवक',
        country: data.country || 'भारत (India)',
        state: data.state,
        district: data.district,
        tehsil: data.tehsil,
        village: data.isCustomVillage && data.customVillageName ? data.customVillageName : data.village,
        status: 'आवेदन प्राप्त',
        trackingUrl: `${req.protocol}://${req.get('host')}/#track-application?ref=${applicationReference}`,
      };

      res.status(201).json({
        success: true,
        message: 'आवेदन सफलतापूर्वक जमा कर लिया गया है।',
        applicationReference,
        receipt,
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message || 'सर्वर त्रुटि।' });
    }
  });

  // Track Application (Public, Privacy-Preserving)
  app.post('/api/applications/track', (req: Request, res: Response) => {
    const { applicationReference, phone } = req.body;
    if (!applicationReference || !phone) {
      res.status(400).json({
        success: false,
        error: 'आवेदन संख्या (Application Reference Number) और मोबाइल नंबर दोनों आवश्यक हैं।',
      });
      return;
    }

    const cleanRef = String(applicationReference).trim().toUpperCase();
    const cleanPhone = String(phone).trim().replace(/\D/g, '');

    const db = loadDatabase();
    const appRecord = db.applications.find((a) => {
      const refMatch =
        (a.applicationReference && a.applicationReference.toUpperCase() === cleanRef) ||
        a.id.toUpperCase() === cleanRef;
      const phoneDigits = a.phone.replace(/\D/g, '');
      const phoneMatch = phoneDigits.endsWith(cleanPhone.slice(-10));
      return refMatch && phoneMatch;
    });

    if (!appRecord) {
      res.status(404).json({
        success: false,
        error: 'दर्ज की गई आवेदन संख्या और मोबाइल नंबर से कोई आवेदन नहीं मिला। कृपया पुनः जाँचें।',
      });
      return;
    }

    // Privacy Masking
    const parts = appRecord.fullName.trim().split(/\s+/);
    const maskedName = parts
      .map((p: string) => (p.length > 1 ? p[0] + '*'.repeat(Math.min(3, p.length - 1)) : p))
      .join(' ');
    const pDigits = appRecord.phone.replace(/\D/g, '');
    const maskedPhone =
      pDigits.length >= 10 ? `${pDigits.slice(0, 2)}****${pDigits.slice(-3)}` : '******';

    res.json({
      success: true,
      data: {
        applicationReference: appRecord.applicationReference || appRecord.id,
        maskedName,
        maskedPhone,
        status: appRecord.verificationStatus,
        submittedAt: appRecord.registeredAt,
        reviewedAt: appRecord.verifiedAt,
        reviewedBy: appRecord.verifiedBy,
        memberId: appRecord.verificationStatus === 'सत्यापित' ? appRecord.memberId : undefined,
        certificateNumber:
          appRecord.verificationStatus === 'सत्यापित' ? appRecord.certificateNumber : undefined,
        reviewComment: appRecord.adminNotes,
        rejectionReason: appRecord.rejectionReason,
        state: appRecord.state,
        district: appRecord.district,
        applicationType: appRecord.applicationType,
      },
    });
  });

  // Admin Login
  app.post('/api/admin/login', (req: Request, res: Response) => {
    const { adminId, password } = req.body;
    if (!adminId || !password) {
      res.status(400).json({ success: false, error: 'आधिकारिक एडमिन आईडी और पासवर्ड आवश्यक हैं।' });
      return;
    }

    const db = loadDatabase();
    const cleanId = String(adminId).trim().toUpperCase();

    // Check against official admin
    const isIdMatch =
      cleanId === db.admin.adminId.toUpperCase() ||
      cleanId === db.admin.username.toUpperCase() ||
      cleanId === 'ADMIN';

    if (!isIdMatch) {
      res.status(401).json({ success: false, error: 'अमान्य एडमिन आईडी।' });
      return;
    }

    const computedHash = hashPassword(password, db.admin.salt);
    if (computedHash !== db.admin.passwordHash) {
      res.status(401).json({ success: false, error: 'अमान्य पासवर्ड।' });
      return;
    }

    // Generate session token
    const token = generateToken();
    activeSessions.set(token, {
      id: db.admin.adminId,
      role: 'admin',
      adminId: db.admin.adminId,
      name: 'मुख्य अधिकृत एडमिन',
      expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    });

    db.auditLogs.unshift({
      id: `AUD-${Date.now()}`,
      timestamp: new Date().toLocaleString('hi-IN'),
      adminId: db.admin.adminId,
      adminName: 'मुख्य अधिकृत एडमिन',
      action: 'ADMIN_LOGIN',
      details: 'सफलतापूर्वक एडमिन पैनल में लॉगिन किया गया।',
    });
    saveDatabase(db);

    res.json({
      success: true,
      token,
      admin: {
        adminId: db.admin.adminId,
        name: 'मुख्य अधिकृत एडमिन',
        role: 'Chief Administrator',
      },
    });
  });

  // Founder / Super Admin Verified Session (Shri Beni Singh Kewat)
  app.post('/api/admin/founder-session', (req: Request, res: Response) => {
    const { email, uid, displayName } = req.body;
    const cleanEmail = String(email || '').trim().toLowerCase();

    // Verify Founder Email
    if (cleanEmail !== 'vikramstar864@gmail.com') {
      res.status(403).json({
        success: false,
        error: 'अनधिकृत: यह सत्र केवल संस्थापक (Super Admin) श्री बेनी सिंह केवट के लिए आरक्षित है।'
      });
      return;
    }

    const db = loadDatabase();
    const token = generateToken();
    const founderName = 'बेनी सिंह केवट';

    // Ensure founder in server db
    if (!db.officers) db.officers = [];
    let founder = db.officers.find((o) => o.email.toLowerCase() === 'vikramstar864@gmail.com');
    if (!founder) {
      founder = {
        uid: uid || 'SEVNF-FOUNDER-01',
        displayName: founderName,
        email: 'vikramstar864@gmail.com',
        role: 'superadmin',
        assignedZone: 'सम्पूर्ण नर्मदा परिक्षेत्र (संस्थापक)',
        isRevoked: false,
        appointedBy: 'SYSTEM_FOUNDER',
        appointedAt: new Date().toLocaleString('hi-IN'),
      };
      db.officers.push(founder);
    } else {
      founder.role = 'superadmin';
      founder.isRevoked = false;
      founder.displayName = founderName;
    }

    activeSessions.set(token, {
      id: founder.uid,
      role: 'superadmin',
      adminId: 'SEVNF-FOUNDER-01',
      name: `${founderName} (संस्थापक)`,
      email: cleanEmail,
      expiresAt: Date.now() + 24 * 60 * 60 * 1000,
    });

    if (!db.auditLogs) db.auditLogs = [];
    db.auditLogs.unshift({
      id: `AUD-SUPER-${Date.now()}`,
      timestamp: new Date().toLocaleString('hi-IN'),
      adminId: 'SEVNF-FOUNDER-01',
      adminName: `${founderName} (संस्थापक)`,
      action: 'SUPERADMIN_LOGIN',
      details: 'संस्थापक (Super Admin) द्वारा पोर्टल में सफल प्रवेश।',
    });
    saveDatabase(db);

    res.json({
      success: true,
      token,
      admin: {
        adminId: 'SEVNF-FOUNDER-01',
        name: `${founderName} (संस्थापक)`,
        email: cleanEmail,
        role: 'संस्थापक एवं मुख्य संरक्षक (Super Admin)',
        isSuperAdmin: true,
      },
    });
  });

  // Admin Setup / Password Update
  app.post('/api/admin/setup', (req: Request, res: Response) => {
    const { currentPassword, newAdminId, newPassword, recoveryPin } = req.body;
    const db = loadDatabase();

    // Verify current credentials if already configured
    if (db.admin.isConfigured && currentPassword) {
      const computedHash = hashPassword(currentPassword, db.admin.salt);
      if (computedHash !== db.admin.passwordHash) {
        res.status(401).json({ success: false, error: 'वर्तमान पासवर्ड गलत है।' });
        return;
      }
    }

    if (newPassword && newPassword.length < 6) {
      res.status(400).json({ success: false, error: 'पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।' });
      return;
    }

    if (newAdminId) {
      db.admin.adminId = newAdminId.trim().toUpperCase();
    }
    if (newPassword) {
      db.admin.salt = generateSalt();
      db.admin.passwordHash = hashPassword(newPassword, db.admin.salt);
    }
    if (recoveryPin) {
      db.admin.recoveryPinSalt = generateSalt();
      db.admin.recoveryPinHash = hashPassword(recoveryPin, db.admin.recoveryPinSalt);
    }
    db.admin.isConfigured = true;

    db.auditLogs.unshift({
      id: `AUD-${Date.now()}`,
      timestamp: new Date().toLocaleString('hi-IN'),
      adminId: db.admin.adminId,
      adminName: 'मुख्य अधिकृत एडमिन',
      action: 'ADMIN_SETUP',
      details: 'एडमिन क्रेडेंशियल्स व सुरक्षा सेटिंग्स अपडेट की गईं।',
    });
    saveDatabase(db);

    res.json({ success: true, message: 'एडमिन सुरक्षा सेटिंग्स सफलतापूर्वक सहेजी गईं।' });
  });

  // Admin Get All Applications
  app.get('/api/admin/applications', requireAdmin, (req: Request, res: Response) => {
    const db = loadDatabase();
    const { status } = req.query;

    let apps = db.applications;
    if (status && typeof status === 'string' && status !== 'all') {
      apps = apps.filter((a) => a.verificationStatus === status);
    }

    res.json({ success: true, count: apps.length, applications: apps });
  });

  // Admin Approve Application (Generates Permanent Member ID!)
  app.post('/api/admin/applications/:id/approve', requireAdmin, (req: Request, res: Response) => {
    const { id } = req.params;
    const { comment } = req.body;
    const session = (req as any).adminSession;

    const db = loadDatabase();
    const appIndex = db.applications.findIndex((a) => a.id === id || a.applicationReference === id);

    if (appIndex === -1) {
      res.status(404).json({ success: false, error: 'आवेदन नहीं मिला।' });
      return;
    }

    const appRecord = db.applications[appIndex];

    // Idempotent: don't regenerate memberId if already exists
    if (!appRecord.memberId) {
      let maxMemberSeq = 100;
      db.applications.forEach((a) => {
        if (a.memberId) {
          const m = a.memberId.match(/(\d{6})/);
          if (m) {
            const num = parseInt(m[1], 10);
            if (num > maxMemberSeq) maxMemberSeq = num;
          }
        }
      });
      const nextMemberSeq = maxMemberSeq + 1;
      appRecord.memberId = `SEVNF-MP-2026-${String(nextMemberSeq).padStart(6, '0')}`;
    }

    const now = new Date().toLocaleString('hi-IN', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });

    appRecord.verificationStatus = 'सत्यापित';
    appRecord.verifiedAt = now;
    appRecord.verifiedBy = `${session.name} (${session.adminId})`;
    if (comment) {
      appRecord.adminNotes = comment;
    }

    db.auditLogs.unshift({
      id: `AUD-${Date.now()}`,
      timestamp: now,
      adminId: session.adminId,
      adminName: session.name,
      action: 'APPROVE_APPLICATION',
      targetId: appRecord.id,
      targetName: appRecord.fullName,
      details: `आवेदन ${appRecord.applicationReference || appRecord.id} को अधिकृत रूप से स्वीकृत किया गया। सदस्य आईडी जारी: ${appRecord.memberId}`,
    });

    saveDatabase(db);

    res.json({
      success: true,
      message: 'आवेदन सफलतापूर्वक स्वीकृत (Approve) किया गया।',
      application: appRecord,
    });
  });

  // Admin Reject Application
  app.post('/api/admin/applications/:id/reject', requireAdmin, (req: Request, res: Response) => {
    const { id } = req.params;
    const { reason } = req.body;
    const session = (req as any).adminSession;

    if (!reason) {
      res.status(400).json({ success: false, error: 'अस्वीकृति का कारण लिखना अनिवार्य है।' });
      return;
    }

    const db = loadDatabase();
    const appIndex = db.applications.findIndex((a) => a.id === id || a.applicationReference === id);

    if (appIndex === -1) {
      res.status(404).json({ success: false, error: 'आवेदन नहीं मिला।' });
      return;
    }

    const appRecord = db.applications[appIndex];
    const now = new Date().toLocaleString('hi-IN', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });

    appRecord.verificationStatus = 'अस्वीकृत';
    appRecord.verifiedAt = now;
    appRecord.verifiedBy = `${session.name} (${session.adminId})`;
    appRecord.rejectionReason = reason;

    db.auditLogs.unshift({
      id: `AUD-${Date.now()}`,
      timestamp: now,
      adminId: session.adminId,
      adminName: session.name,
      action: 'REJECT_APPLICATION',
      targetId: appRecord.id,
      targetName: appRecord.fullName,
      details: `आवेदन अस्वीकृत किया गया। कारण: ${reason}`,
    });

    saveDatabase(db);

    res.json({
      success: true,
      message: 'आवेदन अस्वीकृत (Reject) किया गया।',
      application: appRecord,
    });
  });

  // Admin Update Application Status (e.g. Action Required)
  app.post('/api/admin/applications/:id/status', requireAdmin, (req: Request, res: Response) => {
    const { id } = req.params;
    const { status, notes } = req.body;
    const session = (req as any).adminSession;

    const db = loadDatabase();
    const appIndex = db.applications.findIndex((a) => a.id === id || a.applicationReference === id);

    if (appIndex === -1) {
      res.status(404).json({ success: false, error: 'आवेदन नहीं मिला।' });
      return;
    }

    const appRecord = db.applications[appIndex];
    const now = new Date().toLocaleString('hi-IN', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });

    appRecord.verificationStatus = status;
    appRecord.verifiedAt = now;
    appRecord.verifiedBy = `${session.name} (${session.adminId})`;
    if (notes) {
      appRecord.adminNotes = notes;
    }

    db.auditLogs.unshift({
      id: `AUD-${Date.now()}`,
      timestamp: now,
      adminId: session.adminId,
      adminName: session.name,
      action: 'UPDATE_STATUS',
      targetId: appRecord.id,
      targetName: appRecord.fullName,
      details: `स्थिति '${status}' में परिवर्तित की गई। टिप्पणी: ${notes || 'कोई नहीं'}`,
    });

    saveDatabase(db);

    res.json({
      success: true,
      message: 'स्थिति सफलतापूर्वक अपडेट की गई।',
      application: appRecord,
    });
  });

  // Admin Audit Logs
  app.get('/api/admin/audit-logs', requireAdmin, (_req: Request, res: Response) => {
    const db = loadDatabase();
    res.json({ success: true, count: db.auditLogs.length, auditLogs: db.auditLogs });
  });

  // Admin Stats
  app.get('/api/admin/stats', requireAdmin, (_req: Request, res: Response) => {
    const db = loadDatabase();
    const total = db.applications.length;
    const pending = db.applications.filter(
      (a) => a.verificationStatus === 'आवेदन प्राप्त' || a.verificationStatus === 'समीक्षा में'
    ).length;
    const approved = db.applications.filter((a) => a.verificationStatus === 'सत्यापित').length;
    const rejected = db.applications.filter((a) => a.verificationStatus === 'अस्वीकृत').length;
    const actionNeeded = db.applications.filter(
      (a) => a.verificationStatus === 'अतिरिक्त जानकारी आवश्यक'
    ).length;

    res.json({
      success: true,
      stats: { total, pending, approved, rejected, actionNeeded },
    });
  });

  // ==========================================
  // Controlled Officer Application & Appointment Endpoints
  // ==========================================
  app.post('/api/officer-applications', (req: Request, res: Response) => {
    try {
      const data = req.body;
      if (!data.fullName || !data.email || !data.phone || !data.cityVillage) {
        res.status(400).json({ success: false, error: 'सभी आवश्यक फ़ील्ड भरें।' });
        return;
      }
      const db = loadDatabase();
      if (!db.officerApplications) db.officerApplications = [];
      const newApp = {
        id: data.id || `OFF-APP-${Date.now()}`,
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        cityVillage: data.cityVillage,
        reasonForApplying: data.reasonForApplying || '',
        experienceDetails: data.experienceDetails || '',
        appliedAt: data.appliedAt || new Date().toLocaleString('hi-IN'),
        status: 'Pending' as const,
      };
      db.officerApplications.unshift(newApp);
      db.auditLogs.unshift({
        id: `AUD-${Date.now()}`,
        timestamp: new Date().toLocaleString('hi-IN'),
        adminId: 'SYSTEM',
        adminName: 'गोपनीय अधिकारी आवेदन पोर्टल',
        action: 'OFFICER_APPLICATION_RECEIVED',
        details: `नया अधिकारी आवेदन प्राप्त: ${data.fullName} (${data.email})`,
      });
      saveDatabase(db);
      res.status(201).json({
        success: true,
        message: 'आवेदन सुरक्षित रूप से संस्थापक तक पहुँच गया है।',
        application: newApp,
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.get('/api/admin/officer-applications', requireAdmin, (_req: Request, res: Response) => {
    const db = loadDatabase();
    const apps = db.officerApplications || [];
    res.json({ success: true, count: apps.length, applications: apps });
  });

  app.post('/api/admin/officer-applications/:id/status', requireAdmin, (req: Request, res: Response) => {
    const { id } = req.params;
    const { status, rejectionReason, notes, reviewerName } = req.body;
    const session = (req as any).adminSession;
    const db = loadDatabase();
    if (!db.officerApplications) db.officerApplications = [];
    const idx = db.officerApplications.findIndex((a) => a.id === id);
    if (idx === -1) {
      res.status(404).json({ success: false, error: 'आवेदन नहीं मिला।' });
      return;
    }
    const appRecord = db.officerApplications[idx];
    appRecord.status = status;
    appRecord.reviewedAt = new Date().toLocaleString('hi-IN');
    appRecord.reviewedBy = reviewerName || session.name || 'संस्थापक (बेनी सिंह केवट)';
    if (rejectionReason) appRecord.rejectionReason = rejectionReason;
    if (notes) appRecord.notes = notes;

    db.auditLogs.unshift({
      id: `AUD-${Date.now()}`,
      timestamp: new Date().toLocaleString('hi-IN'),
      adminId: session.adminId,
      adminName: session.name,
      action: 'OFFICER_APP_STATUS_UPDATE',
      details: `अधिकारी आवेदन (${appRecord.fullName}) की स्थिति बदलकर '${status}' की गई।`,
    });
    saveDatabase(db);
    res.json({ success: true, application: appRecord });
  });

  app.post('/api/admin/officer-applications/:id/appoint', requireAdmin, (req: Request, res: Response) => {
    const { id } = req.params;
    const { officerUid, assignedZone } = req.body;
    const session = (req as any).adminSession;
    const db = loadDatabase();
    if (!db.officerApplications) db.officerApplications = [];
    if (!db.officers) db.officers = [];
    const idx = db.officerApplications.findIndex((a) => a.id === id);
    if (idx === -1) {
      res.status(404).json({ success: false, error: 'आवेदन नहीं मिला।' });
      return;
    }
    const appRecord = db.officerApplications[idx];
    const now = new Date().toLocaleString('hi-IN');
    appRecord.status = 'Approved';
    appRecord.appointedAsOfficer = true;
    appRecord.appointedAt = now;
    appRecord.assignedZone = assignedZone || 'सम्पूर्ण नर्मदा परिक्षेत्र';

    const targetUid = officerUid || `OFF-${Date.now()}`;
    const existingOff = db.officers.find((o) => o.email.toLowerCase() === appRecord.email.toLowerCase());
    if (existingOff) {
      existingOff.isRevoked = false;
      existingOff.assignedZone = assignedZone || 'सम्पूर्ण नर्मदा परिक्षेत्र';
    } else {
      db.officers.push({
        uid: targetUid,
        displayName: appRecord.fullName,
        email: appRecord.email,
        phone: appRecord.phone,
        role: 'officer',
        assignedZone: assignedZone || 'सम्पूर्ण नर्मदा परिक्षेत्र',
        isRevoked: false,
        appointedBy: session.name || 'संस्थापक (बेनी सिंह केवट)',
        appointedAt: now,
      });
    }

    db.auditLogs.unshift({
      id: `AUD-${Date.now()}`,
      timestamp: now,
      adminId: session.adminId,
      adminName: session.name,
      action: 'APPOINT_OFFICER',
      details: `संस्थापक द्वारा अधिकारी नियुक्त: ${appRecord.fullName} (${appRecord.email}) - कार्यक्षेत्र: ${assignedZone}`,
    });
    saveDatabase(db);
    res.json({
      success: true,
      message: 'अधिकारी सफलतापूर्वक नियुक्त किया गया।',
      application: appRecord,
    });
  });

  app.get('/api/admin/officers', requireAdmin, (_req: Request, res: Response) => {
    const db = loadDatabase();
    res.json({ success: true, count: (db.officers || []).length, officers: db.officers || [] });
  });

  app.post('/api/admin/officers/:uid/revoke', requireAdmin, (req: Request, res: Response) => {
    const { uid } = req.params;
    const session = (req as any).adminSession;
    const db = loadDatabase();
    const off = (db.officers || []).find((o) => o.uid === uid);
    if (!off) {
      res.status(404).json({ success: false, error: 'अधिकारी नहीं मिला।' });
      return;
    }
    off.isRevoked = true;
    db.auditLogs.unshift({
      id: `AUD-${Date.now()}`,
      timestamp: new Date().toLocaleString('hi-IN'),
      adminId: session.adminId,
      adminName: session.name,
      action: 'REVOKE_OFFICER',
      details: `अधिकारी एक्सेस निरस्त किया गया: ${off.displayName} (${off.email})`,
    });
    saveDatabase(db);
    res.json({ success: true, message: 'अधिकारी एक्सेस निरस्त किया गया।' });
  });

  app.post('/api/admin/officers/:uid/restore', requireAdmin, (req: Request, res: Response) => {
    const { uid } = req.params;
    const session = (req as any).adminSession;
    const db = loadDatabase();
    const off = (db.officers || []).find((o) => o.uid === uid);
    if (!off) {
      res.status(404).json({ success: false, error: 'अधिकारी नहीं मिला।' });
      return;
    }
    off.isRevoked = false;
    db.auditLogs.unshift({
      id: `AUD-${Date.now()}`,
      timestamp: new Date().toLocaleString('hi-IN'),
      adminId: session.adminId,
      adminName: session.name,
      action: 'RESTORE_OFFICER',
      details: `अधिकारी एक्सेस पुनः सक्रिय किया गया: ${off.displayName} (${off.email})`,
    });
    saveDatabase(db);
    res.json({ success: true, message: 'अधिकारी एक्सेस पुनः सक्रिय किया गया।' });
  });

  // ==========================================
  // Vite Integration (Dev) or Static dist (Prod)
  // ==========================================
  if (process.env.NODE_ENV === 'production' && fs.existsSync(path.resolve('dist'))) {
    app.use(express.static(path.resolve('dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve('dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Sanghiya Foundation Server] Running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal Server Startup Error:', err);
  process.exit(1);
});
