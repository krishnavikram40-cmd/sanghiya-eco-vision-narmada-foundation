import React, { useState } from 'react';
import { INITIAL_GALLERY_ITEMS } from '../data/foundationData';
import { GalleryItem } from '../types';
import {
  Image as ImageIcon,
  PlusCircle,
  Filter,
  CheckCircle2,
  Trash2,
  Info,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';

export const GalleryPage: React.FC = () => {
  const [items, setItems] = useState<GalleryItem[]>(INITIAL_GALLERY_ITEMS);
  const [selectedCategory, setSelectedCategory] = useState<string>('सभी');
  const [previewNote, setPreviewNote] = useState<string | null>(null);

  const categories = ['सभी', 'घाट सफाई', 'प्लास्टिक मुक्ति', 'पर्यावरण जागरूकता', 'वृक्षारोपण', 'तट संरक्षण'];

  const filteredItems =
    selectedCategory === 'सभी'
      ? items
      : items.filter((item) => item.category === selectedCategory);

  // Handle local user photo preview upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const newItem: GalleryItem = {
        id: `custom-${Date.now()}`,
        title: file.name.replace(/\.[^/.]+$/, ''),
        category: 'घाट सफाई',
        location: 'स्थानीय नर्मदा तट (उपयोगकर्ता पूर्वावलोकन)',
        description: 'आपके द्वारा पूर्वावलोकन हेतु चुनी गई वास्तविक तस्वीर।',
        isSymbolic: false,
        customImageUrl: result,
      };
      setItems([newItem, ...items]);
      setPreviewNote('आपकी तस्वीर सफलतापूर्वक गैलरी में पूर्वावलोकन (Preview) हेतु जोड़ दी गई है!');
      setTimeout(() => setPreviewNote(null), 4000);
    };
    reader.readAsDataURL(file);
  };

  const removeCustomItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      {/* 1. Header */}
      <section className="text-center max-w-4xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-900 text-xs sm:text-sm font-semibold">
          <ImageIcon className="w-4 h-4 text-emerald-700" />
          <span>गतिविधियों का सचित्र संकलन</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading text-slate-900 leading-tight">
          गतिविधियों की गैलरी — माँ नर्मदा सेवा स्थल
        </h1>
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
          हमारे अभियानों, घाट सफाई स्थलों, वृक्षारोपण क्षेत्रों और जागरूकता आयोजनों का सुव्यवस्थित फोटो संग्रह।
        </p>
      </section>

      {/* 2. Honesty and Photo Addition Policy Notice */}
      <section className="p-4 sm:p-5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm">
            <span className="font-bold text-amber-900 block">पारदर्शिता नीति:</span>
            <span className="text-amber-800">
              फाउंडेशन के पास वर्तमान में पुरानी औपचारिक तस्वीरें उपलब्ध नहीं हैं। अतः किसी भी फर्जी गतिविधि का दावा न करते हुए यहां केवल सांकेतिक स्लॉट रखे गए हैं। नीचे दिए गए बटन से आप अपनी वास्तविक तस्वीरें तुरंत जोड़कर पूर्वावलोकन कर सकते हैं।
            </span>
          </div>
        </div>

        {/* Local Preview Upload Button */}
        <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold shadow-xs cursor-pointer shrink-0 transition-colors">
          <PlusCircle className="w-4 h-4" />
          <span>अपनी वास्तविक फोटो जोड़ें (पूर्वावलोकन)</span>
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            className="hidden"
          />
        </label>
      </section>

      {previewNote && (
        <div className="p-3 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-xl text-xs sm:text-sm font-medium flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
          <span>{previewNote}</span>
        </div>
      )}

      {/* 3. Category Filter Tabs */}
      <section className="flex flex-wrap items-center justify-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </section>

      {/* 4. Gallery Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            {/* Image / Graphic Display */}
            <div className="relative aspect-16/10 bg-slate-100 flex items-center justify-center overflow-hidden border-b border-slate-100">
              {item.customImageUrl ? (
                <img
                  src={item.customImageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full p-6 flex flex-col items-center justify-center text-center bg-gradient-to-br from-slate-100 via-sky-50 to-emerald-50">
                  <div className="w-12 h-12 rounded-full bg-white shadow-2xs flex items-center justify-center text-emerald-700 mb-2">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-semibold text-slate-700">
                    {item.location}
                  </span>
                  <span className="text-[11px] text-slate-500 mt-0.5">
                    [वास्तविक फोटो जोड़ने हेतु स्लॉट]
                  </span>
                </div>
              )}

              {/* Status Tag Badge */}
              <div className="absolute top-3 left-3">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-900/80 backdrop-blur-xs text-white">
                  {item.category}
                </span>
              </div>

              {/* If user uploaded this item, allow removing */}
              {item.customImageUrl && (
                <button
                  onClick={() => removeCustomItem(item.id)}
                  className="absolute top-3 right-3 p-1.5 rounded-full bg-red-600/90 text-white hover:bg-red-700 transition-colors cursor-pointer shadow-xs"
                  title="यह पूर्वावलोकन हटाएं"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Info Body */}
            <div className="p-5 space-y-2">
              <h3 className="font-bold text-base text-slate-900">{item.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>
              <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100">
                <span>स्थान: {item.location}</span>
                <span className={item.isSymbolic ? 'text-amber-700 font-medium' : 'text-emerald-700 font-medium'}>
                  {item.isSymbolic ? 'सांकेतिक स्थान' : 'सत्यापित पूर्वावलोकन'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* 5. Instructions for permanent real photos */}
      <section className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-2">
        <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
          <Info className="w-4 h-4 text-sky-600" />
          <span>वेबसाइट में अपनी वास्तविक तस्वीरें स्थायी रूप से कैसे शामिल करें?</span>
        </h3>
        <p>
          जब आप अपने अभियान की वास्तविक तस्वीरें लें, तो उन्हें <code>public/images/</code> फोल्डर में
          सहेजें और <code>src/data/foundationData.ts</code> की <code>INITIAL_GALLERY_ITEMS</code> सूची में
          फ़ाइल का नाम (जैसे: <code>customImageUrl: '/images/ghat_safai_1.jpg'</code>) जोड़ दें। आपकी असली
          तस्वीरें वेबसाइट पर स्थायी रूप से दिखने लगेंगी।
        </p>
      </section>
    </div>
  );
};
