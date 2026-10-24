import React, { useState } from 'react';
import { VolunteerRegistrationForm } from './VolunteerRegistrationForm';
import {
  Users,
  Award,
  ShieldCheck,
  Search,
  Sparkles,
  QrCode,
  FileCheck,
  HeartHandshake,
} from 'lucide-react';

interface VolunteerPageProps {
  onNavigateToProfile?: () => void;
  onNavigateToVerify?: () => void;
  onNavigateToTrack?: () => void;
}

export const VolunteerPage: React.FC<VolunteerPageProps> = ({
  onNavigateToProfile,
  onNavigateToVerify,
  onNavigateToTrack,
}) => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      {/* 1. Header */}
      <section className="text-center max-w-4xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-900 text-xs sm:text-sm font-semibold">
          <HeartHandshake className="w-4 h-4 text-emerald-700" />
          <span>माँ नर्मदा संरक्षण जन-अभियान • स्वयंसेवक सहभागिता</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading text-slate-900 leading-tight">
          स्वयंसेवक बनें — माँ नर्मदा की सेवा में अपना श्रमदान दें
        </h1>
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl mx-auto">
          "नर्मदे हर!" पवित्र नर्मदा के घाटों की सफाई, प्लास्टिक प्रदूषण उन्मूलन, सघन वृक्षारोपण और
          जागरूकता अभियानों में अपनी सक्रिय सहभागिता दर्ज करें। सफल पंजीकरण पर आपको तुरंत यूनिक
          वॉलंटियर ID प्रदान की जाएगी।
        </p>

        {/* Quick Portal Switchers */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => {
              if (onNavigateToTrack) onNavigateToTrack();
              else window.location.hash = '#track-application';
            }}
            className="px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
          >
            <Search className="w-4 h-4 text-emerald-700" />
            <span>आवेदन की स्थिति ट्रैक करें (Track Application)</span>
          </button>

          <button
            onClick={() => {
              if (onNavigateToProfile) onNavigateToProfile();
              else window.location.hash = '#volunteer-profile';
            }}
            className="px-4 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-300 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
          >
            <Award className="w-4 h-4 text-sky-600" />
            <span>प्रोफाइल व प्रमाणपत्र पोर्टल →</span>
          </button>

          <button
            onClick={() => {
              if (onNavigateToVerify) onNavigateToVerify();
              else window.location.hash = '#verify-certificate';
            }}
            className="px-4 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
          >
            <QrCode className="w-4 h-4 text-amber-700" />
            <span>प्रमाणपत्र QR सत्यापन पोर्टल</span>
          </button>
        </div>
      </section>

      {/* 2. Key Highlights Pill */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center text-xs">
        <div className="p-4 rounded-2xl bg-white border border-emerald-100 shadow-2xs space-y-1">
          <div className="font-bold text-emerald-900 text-sm">यूनिक वॉलंटियर ID</div>
          <div className="text-slate-500 text-[11px]">पंजीकरण होते ही तत्काल जारी</div>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-sky-100 shadow-2xs space-y-1">
          <div className="font-bold text-sky-900 text-sm">तहसील व गाँव स्तर चयन</div>
          <div className="text-slate-500 text-[11px]">नर्मदा घाटी के सभी जिलों का समावेश</div>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-amber-100 shadow-2xs space-y-1">
          <div className="font-bold text-amber-900 text-sm">सत्यापित डिजिटल प्रमाणपत्र</div>
          <div className="text-slate-500 text-[11px]">वेबसाइट से सीधे A4 PDF डाउनलोड</div>
        </div>
      </div>

      {/* 3. The Full Registration Form with Photo & Cascading Locations */}
      <VolunteerRegistrationForm
        onSuccessNavigate={(id) => {
          if (onNavigateToProfile) onNavigateToProfile();
          else window.location.hash = '#volunteer-profile';
        }}
      />
    </div>
  );
};
