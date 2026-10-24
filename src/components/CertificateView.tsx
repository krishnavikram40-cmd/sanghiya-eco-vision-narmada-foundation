import React, { useRef, useState, useEffect } from 'react';
import { VolunteerProfile, FounderSignatureConfig } from '../types';
import { FOUNDATION_INFO } from '../data/foundationData';
import { getFounderSignatureConfig } from '../services/volunteerService';
import QRCode from 'qrcode';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import {
  Download,
  ShieldCheck,
  Calendar,
  MapPin,
  Sparkles,
  Award,
  QrCode,
  FileCheck,
  CheckCircle2,
  Printer,
  User,
  Heart,
  AlertCircle,
} from 'lucide-react';

interface CertificateViewProps {
  volunteer: VolunteerProfile;
  onClose?: () => void;
  isModal?: boolean;
}

export const CertificateView: React.FC<CertificateViewProps> = ({
  volunteer,
  onClose,
  isModal = false,
}) => {
  const certificateRef = useRef<HTMLDivElement>(null);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [signatureConfig, setSignatureConfig] = useState<FounderSignatureConfig>(() =>
    getFounderSignatureConfig()
  );

  useEffect(() => {
    const handleSigChange = () => {
      setSignatureConfig(getFounderSignatureConfig());
    };
    window.addEventListener('sanghiya-signature-changed', handleSigChange);
    window.addEventListener('storage', handleSigChange);
    return () => {
      window.removeEventListener('sanghiya-signature-changed', handleSigChange);
      window.removeEventListener('storage', handleSigChange);
    };
  }, []);

  // Generate dynamic QR Code for public certificate verification URL
  useEffect(() => {
    const generateQr = async () => {
      try {
        const verifyUrl = `${window.location.origin}${window.location.pathname}#verify-certificate?cert=${encodeURIComponent(
          volunteer.certificateNumber
        )}`;
        const qr = await QRCode.toDataURL(verifyUrl, {
          width: 140,
          margin: 1,
          color: {
            dark: '#1c3f60',
            light: '#ffffff',
          },
        });
        setQrCodeDataUrl(qr);
      } catch (err) {
        console.warn('QR code generation notice:', err);
      }
    };
    generateQr();
  }, [volunteer.certificateNumber]);

  // A4 PDF Download Handler (Strictly Website-Only, NO Email)
  const downloadPdf = async () => {
    if (!certificateRef.current) return;

    // Strict Eligibility Check before initiating download
    if (volunteer.verificationStatus !== 'सत्यापित') {
      alert(
        'आपका आवेदन अभी समीक्षा में है। सत्यापन पूरा होने के बाद आप अपना प्रमाणपत्र वेबसाइट से डाउनलोड कर सकेंगे।'
      );
      return;
    }

    try {
      setIsGeneratingPdf(true);
      const certEl = certificateRef.current;

      const canvas = await html2canvas(certEl, {
        scale: 2, // High resolution for crisp print
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        onclone: (clonedDoc) => {
          // 1. Sanitize all style elements to rewrite oklch color functions that html2canvas cannot parse
          const styles = clonedDoc.querySelectorAll('style');
          styles.forEach((st) => {
            if (st.textContent && st.textContent.includes('oklch')) {
              st.textContent = st.textContent.replace(/oklch\([^)]+\)/g, '#10b981');
            }
          });

          // 2. Fallback override on all elements
          const allEls = clonedDoc.querySelectorAll('*');
          allEls.forEach((el: any) => {
            try {
              ['backgroundColor', 'color', 'borderColor', 'outlineColor'].forEach((prop) => {
                const val = (el.style as any)[prop];
                if (val && typeof val === 'string' && val.includes('oklch')) {
                  (el.style as any)[prop] =
                    prop === 'color' ? '#1e293b' : prop === 'backgroundColor' ? '#ffffff' : '#cbd5e1';
                }
              });
            } catch (_) {}
          });
        },
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Narmada_Foundation_Certificate_${volunteer.id}.pdf`);

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
    } catch (err) {
      console.warn('PDF generation notice, triggering print fallback:', err);
      window.print();
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const isVerified = volunteer.verificationStatus === 'सत्यापित';

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="bg-white p-4 rounded-2xl border border-emerald-200 shadow-sm flex flex-wrap items-center justify-between gap-4 no-print">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-800">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-heading font-bold text-slate-900 text-lg">
              डिजिटल सदस्यता प्रमाणपत्र
            </h2>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500 font-mono">ID: {volunteer.id}</span>
              <span>•</span>
              <span
                className={`font-semibold px-2 py-0.5 rounded-full ${
                  isVerified
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-amber-100 text-amber-800 border border-amber-300'
                }`}
              >
                {volunteer.verificationStatus}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons: Direct PDF Download & Print ONLY. Strictly NO Email Button */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {isVerified ? (
            <button
              onClick={downloadPdf}
              disabled={isGeneratingPdf}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-700 via-sky-800 to-emerald-900 hover:from-emerald-800 hover:to-sky-900 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Download className="w-4 h-4 text-amber-300" />
              <span>{isGeneratingPdf ? 'PDF तैयार हो रही है...' : 'मेरा प्रमाणपत्र डाउनलोड करें (PDF)'}</span>
            </button>
          ) : (
            <div className="px-4 py-2 bg-amber-50 border border-amber-200 text-amber-900 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>आवेदन समीक्षा में होने के कारण डाउनलोड लंबित है</span>
            </div>
          )}

          <button
            onClick={handlePrint}
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs border border-slate-300 transition-colors flex items-center gap-1.5 cursor-pointer"
            title="सीधे प्रिंट करें"
          >
            <Printer className="w-4 h-4" />
            <span>प्रिंट (Print)</span>
          </button>

          {isModal && onClose && (
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold text-xs transition-colors cursor-pointer"
            >
              बंद करें
            </button>
          )}
        </div>
      </div>

      {downloadSuccess && (
        <div className="p-3 bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs sm:text-sm font-semibold rounded-xl flex items-center gap-2 animate-in fade-in no-print">
          <CheckCircle2 className="w-5 h-5 text-emerald-700" />
          <span>आपका आधिकारिक प्रमाणपत्र (PDF) सफलतापूर्वक डाउनलोड हो गया है!</span>
        </div>
      )}

      {/* Verification Warning Notice if not verified */}
      {!isVerified && (
        <div className="p-4 bg-amber-50 border-2 border-amber-300 rounded-2xl text-amber-950 text-xs sm:text-sm space-y-1 no-print">
          <div className="font-bold flex items-center gap-1.5 text-amber-900 text-sm">
            <AlertCircle className="w-4 h-4 text-amber-700" />
            <span>सत्यापन सूचना:</span>
          </div>
          <p className="leading-relaxed">
            "आपका आवेदन अभी समीक्षा में है। सत्यापन पूरा होने के बाद आप अपना प्रमाणपत्र वेबसाइट से
            डाउनलोड कर सकेंगे।"
          </p>
        </div>
      )}

      {/* =========================================================================
          THE OFFICIAL MEMBERSHIP CERTIFICATE CANVAS (A4 Landscape Layout)
          Designed to perfectly print and export to 297mm x 210mm PDF
          ========================================================================= */}
      <div className="overflow-x-auto pb-4">
        <div
          ref={certificateRef}
          id="official-foundation-certificate"
          className="relative w-[1050px] h-[740px] mx-auto bg-gradient-to-br from-[#ffffff] via-[#fbfdfc] to-[#f4f9f6] text-slate-900 p-8 shadow-2xl select-none border-12 border-[#1c3f60] rounded-sm shrink-0"
          style={{ fontFamily: "'Yantramanav', 'Plus Jakarta Sans', sans-serif" }}
        >
          {/* Ornate Golden Inner Border & Corner Flourishes */}
          <div className="absolute inset-2 border-2 border-amber-500/80 pointer-events-none"></div>
          <div className="absolute inset-3 border border-emerald-800/40 pointer-events-none"></div>

          {/* Decorative Corner Accents */}
          <div className="absolute top-4 left-4 w-12 h-12 border-t-4 border-l-4 border-amber-600 pointer-events-none"></div>
          <div className="absolute top-4 right-4 w-12 h-12 border-t-4 border-r-4 border-amber-600 pointer-events-none"></div>
          <div className="absolute bottom-4 left-4 w-12 h-12 border-b-4 border-l-4 border-amber-600 pointer-events-none"></div>
          <div className="absolute bottom-4 right-4 w-12 h-12 border-b-4 border-r-4 border-amber-600 pointer-events-none"></div>

          {/* Sacred Narmada River Watermark in Background */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.04] pointer-events-none">
            <img
              src="/file_00000000306082118bbb5f0c42339ad4.png"
              alt="Watermark"
              className="w-[480px] h-[480px] object-contain"
            />
          </div>

          {/* Certificate Content Grid */}
          <div className="relative z-10 flex flex-col justify-between h-full p-4">
            {/* Header: Logo, Names & Title */}
            <div className="border-b-2 border-amber-500/70 pb-4">
              <div className="flex items-center justify-between gap-6">
                {/* Official Logo (Original Authentic Colors) */}
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-amber-500 shadow-md bg-[#1c3f60] shrink-0">
                    <img
                      src="/file_00000000306082118bbb5f0c42339ad4.png"
                      alt="संघिया इको-विजन नर्मदा फाउंडेशन लोगो"
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <div className="text-left space-y-0.5">
                    <h1 className="font-heading text-2xl font-black text-[#1c3f60] tracking-tight">
                      {FOUNDATION_INFO.hindiName}
                    </h1>
                    <p className="text-xs font-bold tracking-wider text-emerald-800 uppercase font-sans">
                      {FOUNDATION_INFO.englishName}
                    </p>
                    <p className="text-[11px] text-slate-600 font-medium">
                      माँ नर्मदा नदी संरक्षण, घाट शुचिता, वृक्षारोपण एवं जन-जागरूकता अभियान
                    </p>
                  </div>
                </div>

                {/* Certificate Number & QR Code */}
                <div className="flex items-center gap-3 bg-white/90 p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                  {qrCodeDataUrl ? (
                    <img
                      src={qrCodeDataUrl}
                      alt="सत्यापन QR कोड"
                      className="w-20 h-20 object-contain rounded-md border border-slate-200"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-slate-100 flex items-center justify-center">
                      <QrCode className="w-8 h-8 text-slate-400" />
                    </div>
                  )}
                  <div className="text-right text-[11px] space-y-0.5">
                    <div className="font-bold text-[#1c3f60] text-xs">QR सत्यापन सक्रिय</div>
                    <div className="font-mono text-slate-600 text-[10px]">{volunteer.certificateNumber}</div>
                    <div className="text-[10px] text-emerald-800 font-semibold">
                      स्थिति: {volunteer.verificationStatus}
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Certificate Banner Title */}
              <div className="mt-3 text-center">
                <div className="inline-block px-8 py-1 rounded-full bg-gradient-to-r from-emerald-900 via-sky-900 to-emerald-950 text-white shadow-sm border border-amber-400/80">
                  <span className="font-heading text-xl font-bold tracking-wider text-amber-200 uppercase">
                    स्वयंसेवक सदस्यता प्रमाणपत्र
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 font-sans tracking-widest uppercase mt-0.5">
                  Official Volunteer Membership Certificate
                </div>
              </div>
            </div>

            {/* Certificate Body: Member Details & Service Declaration */}
            <div className="my-auto py-2">
              <div className="grid grid-cols-12 gap-6 items-center">
                {/* Volunteer Photo & ID Badge */}
                <div className="col-span-3 flex flex-col items-center text-center space-y-2">
                  <div className="w-32 h-36 rounded-xl border-3 border-amber-500/90 shadow-md overflow-hidden bg-slate-100 flex items-center justify-center">
                    {volunteer.photoUrl ? (
                      <img
                        src={volunteer.photoUrl}
                        alt={volunteer.fullName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-slate-50">
                        <User className="w-12 h-12" />
                        <span className="text-[10px] mt-1">सत्यापित सदस्य</span>
                      </div>
                    )}
                  </div>
                  <div className="bg-[#1c3f60] text-white px-3 py-1 rounded-md text-xs font-mono font-bold shadow-xs">
                    ID: {volunteer.id}
                  </div>
                </div>

                {/* Formal Sanskrit/Hindi Conferral Text */}
                <div className="col-span-9 space-y-3 pr-4">
                  <p className="text-sm text-slate-700 leading-relaxed text-justify">
                    प्रमाणित किया जाता है कि{' '}
                    <strong className="text-xl text-[#1c3f60] font-heading font-black border-b-2 border-emerald-600 pb-0.5 px-2">
                      {volunteer.fullName}
                    </strong>
                    {volunteer.fatherOrGuardianName && (
                      <span className="text-slate-800">
                        {' '}(सुपुत्र/सुपुत्री: <strong>{volunteer.fatherOrGuardianName}</strong>)
                      </span>
                    )}
                    , निवासी{' '}
                    <strong>
                      {volunteer.village}, तहसील: {volunteer.tehsil}, जिला: {volunteer.district} (
                      {volunteer.state})
                    </strong>
                    , संघिया इको-विजन नर्मदा फाउंडेशन के अधिकृत स्वयंसेवक के रूप में पंजीकृत एवं सक्रिय सदस्य हैं।
                  </p>

                  {/* Areas of Contribution Badges */}
                  <div className="p-2.5 rounded-xl bg-emerald-50/80 border border-emerald-200 flex flex-wrap items-center gap-2 text-xs">
                    <span className="font-bold text-emerald-950 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      सेवा व सहयोग के रुचि क्षेत्र:
                    </span>
                    {volunteer.serviceInterests && volunteer.serviceInterests.length > 0 ? (
                      volunteer.serviceInterests.map((interest, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-0.5 rounded-full bg-white text-emerald-900 border border-emerald-300 font-semibold text-[11px]"
                        >
                          {interest}
                        </span>
                      ))
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-white text-emerald-900 text-[11px]">
                        माँ नर्मदा संरक्षण व पर्यावरण सेवा
                      </span>
                    )}
                  </div>

                  {/* Sacred Motto */}
                  <div className="text-center py-1">
                    <p className="font-heading text-sm text-emerald-900 font-bold italic">
                      "माँ नर्मदा का संरक्षण, स्वच्छ पर्यावरण और जागरूक समाज के निर्माण के लिए समर्पित।"
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Details: Dates, Authorities & Legal Clarity */}
            <div className="border-t-2 border-amber-500/70 pt-3">
              <div className="grid grid-cols-3 gap-4 items-end text-xs">
                {/* Column 1: Issuance Details */}
                <div className="space-y-1 text-slate-700">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                    <span>
                      सदस्यता पंजीकरण तिथि: <strong>{volunteer.registeredAt}</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <FileCheck className="w-3.5 h-3.5 text-sky-700" />
                    <span>
                      सत्यापन तिथि:{' '}
                      <strong>{volunteer.verifiedAt || 'समीक्षाधीन (Under Review)'}</strong>
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    प्रमाणपत्र क्रमांक: {volunteer.certificateNumber}
                  </div>
                </div>

                {/* Column 2: Digital Security & Honesty Seal */}
                <div className="text-center space-y-1">
                  <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 text-[10px] font-bold">
                    <ShieldCheck className="w-3 h-3 text-emerald-700" />
                    <span>सुरक्षित डिजिटल सदस्यता प्रमाण</span>
                  </div>
                  <p className="text-[10px] text-slate-500">
                    यह प्रमाणपत्र फाउंडेशन के वेब पोर्टल द्वारा जारी किया गया है।
                  </p>
                </div>

                {/* Column 3: Authorized Signatory Block */}
                <div className="text-center space-y-0.5">
                  <div className="h-12 flex items-end justify-center">
                    {signatureConfig?.isActive && signatureConfig.imageUrl ? (
                      <img
                        src={signatureConfig.imageUrl}
                        alt="हस्ताक्षर संस्थापक"
                        className="h-11 max-w-[170px] object-contain filter contrast-125"
                      />
                    ) : (
                      <span className="font-serif italic font-bold text-slate-800 text-sm tracking-wide">
                        {signatureConfig?.founderName || 'हस्ताक्षर अधिकृत प्राधिकारी'}
                      </span>
                    )}
                  </div>
                  <div className="border-t border-slate-700 w-44 mx-auto"></div>
                  <div className="font-bold text-[11px] text-[#1c3f60]">
                    {signatureConfig?.founderName || 'बेनी सिंह केवट'}
                  </div>
                  <div className="text-[10px] text-emerald-800 font-semibold">
                    {signatureConfig?.designationHindi || 'संस्थापक एवं मुख्य संरक्षक'}
                  </div>
                  <div className="text-[9px] text-slate-500 font-sans">
                    {FOUNDATION_INFO.hindiName}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
