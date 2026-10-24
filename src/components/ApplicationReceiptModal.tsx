import React, { useRef, useState, useEffect } from 'react';
import { ApplicationReceipt } from '../types';
import { SITE_CONFIG } from '../config/siteConfig';
import { CustomEmblem } from './CustomEmblem';
import {
  Download,
  Printer,
  X,
  CheckCircle2,
  Clock,
  ShieldCheck,
  FileText,
  AlertCircle,
  Copy,
  ExternalLink,
} from 'lucide-react';
import QRCode from 'qrcode';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface ApplicationReceiptModalProps {
  receipt: ApplicationReceipt | null;
  isOpen: boolean;
  onClose: () => void;
  onTrackNow?: (ref: string) => void;
  customLogoUrl?: string | null;
}

export const ApplicationReceiptModal: React.FC<ApplicationReceiptModalProps> = ({
  receipt,
  isOpen,
  onClose,
  onTrackNow,
  customLogoUrl,
}) => {
  const receiptCardRef = useRef<HTMLDivElement>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (receipt) {
      const trackUrl = `${window.location.origin}/#track-application?ref=${encodeURIComponent(
        receipt.applicationReference
      )}`;
      QRCode.toDataURL(trackUrl, {
        width: 180,
        margin: 1,
        color: { dark: '#064e3b', light: '#ffffff' },
      })
        .then((url) => setQrCodeUrl(url))
        .catch((err) => console.warn('QR code generation notice:', err));
    }
  }, [receipt]);

  if (!isOpen || !receipt) return null;

  const handleCopyRef = () => {
    navigator.clipboard.writeText(receipt.applicationReference);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = async () => {
    if (!receiptCardRef.current) return;
    setIsGeneratingPdf(true);
    try {
      const element = receiptCardRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
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
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 10, pdfWidth, pdfHeight);
      pdf.save(`Pawti_${receipt.applicationReference}_Sanghiya_Narmada.pdf`);
    } catch (err) {
      console.warn('Failed to generate Receipt PDF via canvas, using print view fallback:', err);
      window.print();
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="receipt-dialog-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6"
    >
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto max-h-[96vh]">
        {/* Top Action Bar (Non-print) */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-gradient-to-r from-emerald-900 via-teal-900 to-sky-950 text-white border-b border-emerald-800/50 no-print">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-amber-300 shrink-0" />
            <h3 id="receipt-dialog-title" className="font-bold text-sm sm:text-base">
              आवेदन सफलता पावती (Acknowledgement Receipt)
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium transition cursor-pointer"
              title="पावती प्रिंट करें"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">प्रिंट</span>
            </button>
            <button
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-400 text-emerald-950 hover:bg-amber-300 text-xs font-bold transition shadow-sm cursor-pointer disabled:opacity-50"
              title="PDF डाउनलोड करें"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isGeneratingPdf ? 'तैयार हो रहा है...' : 'PDF डाउनलोड'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-white/20 transition cursor-pointer text-slate-300 hover:text-white"
              title="बंद करें"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Card Body */}
        <div className="overflow-y-auto p-4 sm:p-6 bg-slate-50 flex-1">
          <div
            ref={receiptCardRef}
            className="bg-white rounded-xl border-2 border-emerald-800/30 p-5 sm:p-7 shadow-sm text-slate-800 relative overflow-hidden"
          >
            {/* Watermark Logo in Background */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
              <CustomEmblem size="xl" customLogoUrl={customLogoUrl} />
            </div>

            {/* Header with Logo and Foundation Details */}
            <div className="flex items-center gap-4 pb-4 border-b-2 border-emerald-800/20">
              <CustomEmblem size="lg" customLogoUrl={customLogoUrl} />
              <div className="flex-1">
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 tracking-wide uppercase mb-1">
                  आधिकारिक डिजिटल पावती • Official Receipt
                </span>
                <h1 className="font-serif text-lg sm:text-xl font-bold text-emerald-950 leading-tight">
                  {SITE_CONFIG.hindiName}
                </h1>
                <p className="text-xs font-medium text-slate-600">
                  {SITE_CONFIG.englishName}
                </p>
                <p className="text-[11px] text-emerald-700 italic mt-0.5 font-medium">
                  {SITE_CONFIG.tagline}
                </p>
              </div>
            </div>

            {/* Reference Number Banner */}
            <div className="my-4 p-3.5 rounded-xl bg-gradient-to-r from-emerald-50 via-teal-50 to-amber-50 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <p className="text-xs text-slate-600 font-semibold uppercase tracking-wider">
                  आवेदन संदर्भ संख्या (Application Reference Number):
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="font-mono text-lg sm:text-xl font-black text-emerald-900 tracking-wider">
                    {receipt.applicationReference}
                  </span>
                  <button
                    onClick={handleCopyRef}
                    className="p-1 rounded hover:bg-emerald-200/60 text-emerald-800 transition cursor-pointer"
                    title="संख्या कॉपी करें"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  {copied && (
                    <span className="text-xs text-emerald-600 font-bold">कॉपी हुआ!</span>
                  )}
                </div>
              </div>

              <div className="sm:text-right">
                <p className="text-[11px] text-slate-500 font-medium">आवेदन जमा तारीख व समय</p>
                <p className="text-xs font-bold text-slate-800 flex items-center sm:justify-end gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  {receipt.submittedAt}
                </p>
              </div>
            </div>

            {/* Grid of Applicant Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-xs border-y border-slate-200 py-4 my-3">
              <div>
                <span className="text-slate-500 block">आवेदक का नाम:</span>
                <span className="font-bold text-slate-900 text-sm">{receipt.applicantName}</span>
              </div>
              <div>
                <span className="text-slate-500 block">पंजीकृत मोबाइल नंबर:</span>
                <span className="font-bold text-slate-900">{receipt.phone}</span>
              </div>
              <div>
                <span className="text-slate-500 block">पंजीकृत ईमेल:</span>
                <span className="font-semibold text-slate-800">{receipt.email || '—'}</span>
              </div>
              <div>
                <span className="text-slate-500 block">आवेदन का प्रकार:</span>
                <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded inline-block">
                  {receipt.applicationType}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">राज्य व जिला:</span>
                <span className="font-semibold text-slate-800">
                  {receipt.state}, {receipt.district}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">तहसील व गाँव / शहर:</span>
                <span className="font-semibold text-slate-800">
                  {receipt.tehsil}, {receipt.village}
                </span>
              </div>
              {receipt.selectedGhat && (
                <div className="sm:col-span-2">
                  <span className="text-slate-500 block">नर्मदा तट / चयनित घाट:</span>
                  <span className="font-bold text-emerald-800">
                    🌊 {receipt.selectedGhat}
                  </span>
                </div>
              )}
              {receipt.coordinates && (
                <div className="sm:col-span-2">
                  <span className="text-slate-500 block">सत्यापित GPS निर्देशांक:</span>
                  <span className="font-mono text-xs text-sky-800">
                    📍 {receipt.coordinates}
                  </span>
                </div>
              )}
              <div>
                <span className="text-slate-500 block">आवेदन की वर्तमान स्थिति:</span>
                <span className="inline-flex items-center gap-1 font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded">
                  <Clock className="w-3 h-3 text-amber-600" />
                  {receipt.status}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">पावती क्रमांक (Receipt No):</span>
                <span className="font-mono font-bold text-slate-800">{receipt.receiptNumber}</span>
              </div>
            </div>

            {/* Verification QR & Tracking Info */}
            <div className="flex flex-col sm:flex-row items-center gap-4 p-3.5 bg-slate-50 rounded-xl border border-slate-200 my-3">
              {qrCodeUrl && (
                <div className="shrink-0 p-1.5 bg-white rounded-lg border border-slate-300 shadow-sm text-center">
                  <img
                    src={qrCodeUrl}
                    alt="पावती सत्यापन QR Code"
                    className="w-24 h-24 object-contain mx-auto"
                  />
                  <p className="text-[10px] text-slate-500 font-bold mt-1">स्कैन कर स्थिति जाँचें</p>
                </div>
              )}
              <div className="flex-1 text-xs text-slate-600 space-y-1">
                <p className="font-bold text-emerald-950 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  आवेदन की स्थिति कैसे जाँचें?
                </p>
                <p>
                  1. हमारी वेबसाइट पर <strong>"आवेदन ट्रैक करें"</strong> पेज पर जाएँ।
                </p>
                <p>
                  2. अपनी आवेदन संख्या <code className="bg-emerald-100 text-emerald-900 px-1 py-0.5 rounded font-mono font-bold">{receipt.applicationReference}</code> और पंजीकृत मोबाइल नंबर दर्ज करें।
                </p>
                <p className="text-[11px] text-slate-500 pt-0.5">
                  आधिकारिक वेबसाइट: <strong>{window.location.origin}</strong>
                </p>
              </div>
            </div>

            {/* Mandatory Legal & Procedural Disclaimer */}
            <div className="mt-4 p-3 rounded-lg bg-amber-50/90 border border-amber-300/80 text-[11px] text-amber-950 leading-relaxed flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-amber-900 mb-0.5">महत्वपूर्ण सूचना (Declaration):</p>
                <p>
                  "यह पावती केवल आवेदन प्राप्त होने का प्रमाण है। यह सदस्यता या आवेदन अप्रूवल का प्रमाणपत्र नहीं है। आवेदन की स्वीकृति फाउंडेशन के अधिकृत एडमिन की जाँच और सत्यापन के बाद ही मान्य होगी।"
                </p>
              </div>
            </div>

            {/* Footer stamp & signature area */}
            <div className="mt-5 pt-3 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
              <span>कंप्यूटर जनरेटेड अधिकृत पावती • हस्ताक्षर की आवश्यकता नहीं</span>
              <span className="font-bold text-emerald-900">
                {SITE_CONFIG.hindiName}
              </span>
            </div>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="p-4 bg-white border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 no-print">
          <div className="text-xs text-slate-600">
            कृपया अपनी आवेदन संख्या <strong className="font-mono text-emerald-800">{receipt.applicationReference}</strong> को भविष्य के संदर्भ हेतु सुरक्षित रखें।
          </div>

          <div className="flex items-center gap-2">
            {onTrackNow && (
              <button
                onClick={() => {
                  onClose();
                  onTrackNow(receipt.applicationReference);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-50 text-emerald-900 hover:bg-emerald-100 font-bold text-xs transition cursor-pointer border border-emerald-300"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>स्थिति ट्रैक करें</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs transition cursor-pointer"
            >
              पूर्ण / बंद करें
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
