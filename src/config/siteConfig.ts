/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * केंद्रीय कॉन्फ़िगरेशन (Centralized Site Configuration)
 * ----------------------------------------------------
 * संघीय इको-विजन नर्मदा फाउंडेशन (Sanghiya Eco-Vision Narmada Foundation)
 * 
 * भविष्य में यदि आपको फाउंडेशन का नाम, संपर्क, लोगो पाथ, सोशल मीडिया लिंक
 * या थीम के रंग बदलने हों, तो केवल इसी एक फाइल में बदलाव करें।
 */

export interface FoundationContactConfig {
  phone: string;
  phoneDisplay: string;
  email: string;
  address: string;
  helplineTiming: string;
  emergencyContact?: string;
}

export interface FoundationSocialConfig {
  facebook?: string;
  twitter?: string;
  youtube?: string;
  instagram?: string;
  whatsapp?: string;
}

export interface FoundationThemeConfig {
  primaryDeepGreen: string;
  narmadaBlue: string;
  pureWhite: string;
  goldenAccent: string;
  lightGolden: string;
  bgLight: string;
  textDark: string;
}

export interface SiteConfiguration {
  // 1. नाम व ब्रांडिंग
  hindiName: string;
  englishName: string;
  founderName?: string;
  tagline: string;
  subtitle: string;
  shortBio: string;
  establishedNote: string;

  // 2. लोगो पाथ व मीडिया
  logo: {
    primaryPath: string;
    vectorPath: string;
    userUploadPath: string;
    faviconPath: string;
    altText: string;
  };

  // 3. संपर्क जानकारी
  contact: FoundationContactConfig;

  // 4. सोशल मीडिया
  social: FoundationSocialConfig;

  // 5. थीम के रंग
  theme: FoundationThemeConfig;

  // 6. डिजिटल प्रमाणपत्र सेटिंग्स
  certificate: {
    issuerTitle: string;
    signatoryHindi: string;
    signatoryEnglish: string;
    watermarkOpacity: number;
    defaultQrPrefix: string;
  };

  // 7. प्रशासनिक सेटिंग्स
  admin: {
    sessionKey: string;
    defaultPasscode: string;
  };

  // 8. मुख्य उद्देश्य और कार्यक्षेत्र
  coreFocus: string[];
}

export const SITE_CONFIG: SiteConfiguration = {
  // 1. नाम व ब्रांडिंग
  hindiName: 'संघिया इको-विजन नर्मदा फाउंडेशन',
  englishName: 'Sanghiya Eco-Vision Narmada Foundation',
  founderName: 'बेनी सिंह केवट (Beni Singh Kewat)',
  tagline: 'माँ नर्मदा का संरक्षण, हमारा संकल्प',
  subtitle: 'स्वच्छ नर्मदा, स्वच्छ पर्यावरण और जागरूक समाज के निर्माण की दिशा में एक जन-अभियान।',
  shortBio:
    'संघिया इको-विजन नर्मदा फाउंडेशन (संस्थापक: बेनी सिंह केवट) माँ नर्मदा नदी के निर्मल प्रवाह, पवित्र घाटों की शुचिता, तटवर्ती हरित आवरण और पर्यावरण संरक्षण हेतु समर्पित एक जन-अभियान है। ग्राम गोरा मछवाई, तहसील बाड़ी, जिला रायसेन, मध्य प्रदेश से संचालित यह फाउंडेशन संपूर्ण नर्मदा तट पर सक्रिय है।',
  establishedNote: 'संस्थापक: बेनी सिंह केवट | ग्राम गोरा मछवाई, तहसील बाड़ी, जिला रायसेन (म.प्र.)',

  // 2. लोगो पाथ
  logo: {
    primaryPath: '/file_00000000306082118bbb5f0c42339ad4.png',
    vectorPath: '/file_00000000306082118bbb5f0c42339ad4.png',
    userUploadPath: '/file_00000000306082118bbb5f0c42339ad4.png',
    faviconPath: '/file_00000000306082118bbb5f0c42339ad4.png',
    altText: 'संघिया इको-विजन नर्मदा फाउंडेशन आधिकारिक लोगो (Sanghiya Eco-Vision Narmada Foundation Emblem)',
  },

  // 3. संपर्क जानकारी (डिफ़ॉल्ट या कस्टम)
  contact: {
    phone: '+91-9826012345',
    phoneDisplay: '+91 98260 12345 (हेल्पलाइन)',
    email: 'contact@sanghiyanarmada.org',
    address: 'गाँव गोरा मछवाई, तहसील बाड़ी, जिला रायसेन, मध्य प्रदेश, भारत',
    helplineTiming: 'सोमवार से शनिवार: सुबह 09:00 से सायं 06:00 बजे तक',
    emergencyContact: 'घाट स्वच्छता समन्वयक प्रकोष्ठ - बेनी सिंह केवट',
  },

  // 4. सोशल मीडिया लिंक्स
  social: {
    whatsapp: 'https://wa.me/919826012345',
    facebook: 'https://facebook.com/sanghiyanarmada',
    youtube: 'https://youtube.com/@sanghiyanarmada',
    instagram: 'https://instagram.com/sanghiyanarmada',
  },

  // 5. आधिकारिक थीम रंग
  theme: {
    primaryDeepGreen: '#064e3b', // गहरा हरा (Emerald Deep)
    narmadaBlue: '#1c3f60',      // नर्मदा नीला (Sacred River Navy)
    pureWhite: '#ffffff',        // पावन श्वेत (Pure White)
    goldenAccent: '#f59e0b',     // हल्का सुनहरा / अंबर (Auspicious Gold)
    lightGolden: '#fef08a',      // दीप्तिमान पीला / स्वर्ण आभा
    bgLight: '#f8fafc',          // हल्का पृष्ठभूमि रंग
    textDark: '#0f172a',         // मुख्य टेक्स्ट रंग
  },

  // 6. सदस्यता प्रमाणपत्र विन्यास
  certificate: {
    issuerTitle: 'संघिया इको-विजन नर्मदा फाउंडेशन',
    signatoryHindi: 'संयोजक मंडल / अधिकृत पदाधिकारी',
    signatoryEnglish: 'Authorized Signatory, Central Coordination Committee',
    watermarkOpacity: 0.04,
    defaultQrPrefix: '#verify-certificate?cert=',
  },

  // 7. एडमिन सेटिंग्स
  admin: {
    sessionKey: 'sanghiya_admin_auth_v2',
    defaultPasscode: 'narmada2026',
  },

  // 8. मुख्य कार्यक्षेत्र
  coreFocus: [
    'माँ नर्मदा नदी का संरक्षण व जल शुचिता',
    'नर्मदा नदी और पवित्र घाटों की नियमित सफाई',
    'प्लास्टिक व गैर-बायोडिग्रेडेबल कचरा उन्मूलन',
    'पर्यावरण संरक्षण के प्रति व्यापक जन-जागरूकता',
    'नर्मदा तटवर्ती क्षेत्रों में सघन वृक्षारोपण',
    'स्थानीय नागरिकों, युवाओं व श्रद्धालुओं की सहभागिता',
    'तटवर्ती सतत विकास व मृदा क्षरण की रोकथाम',
    'नर्मदा प्रहरी मोबाइल ऐप द्वारा तकनीकी निगरानी',
  ],
};
