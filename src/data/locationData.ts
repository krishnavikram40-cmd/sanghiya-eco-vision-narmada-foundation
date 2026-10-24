import { LocationState, LocationDistrict, LocationTehsil, LocationVillage, LocationGhat } from '../types';

export const INITIAL_LOCATION_DATA: LocationState[] = [
  {
    id: 'mp',
    name: 'मध्य प्रदेश (Madhya Pradesh)',
    country: 'भारत (India)',
    isActive: true,
    districts: [
      /* ================= 1. RIVERSIDE DISTRICTS (नर्मदा मुख्य प्रवाह तटवर्ती जिले) ================= */
      {
        id: 'mp-anuppur',
        name: 'अनूपपुर / अमरकंटक (Anuppur / Amarkantak)',
        stateId: 'mp',
        isActive: true,
        isRiverside: true,
        classification: 'riverside',
        classificationLabel: 'नर्मदा मुख्य प्रवाह तटवर्ती जिला (उद्गम तीर्थ)',
        tehsils: [
          {
            id: 'mp-anp-amarkantak',
            name: 'अमरकंटक (माँ नर्मदा उद्गम स्थल)',
            districtId: 'mp-anuppur',
            isActive: true,
            villages: [
              { id: 'v-301', name: 'नर्मदा कुण्ड परिक्षेत्र', tehsilId: 'mp-anp-amarkantak', isActive: true },
              { id: 'v-302', name: 'कपिलधारा आश्रम क्षेत्र', tehsilId: 'mp-anp-amarkantak', isActive: true },
              { id: 'v-303', name: 'दूधधारा वनग्राम', tehsilId: 'mp-anp-amarkantak', isActive: true },
              { id: 'v-304', name: 'कबीर चबूतरा', tehsilId: 'mp-anp-amarkantak', isActive: true },
            ],
          },
          {
            id: 'mp-anp-pushprajgarh',
            name: 'पुष्पराजगढ़ (Pushprajgarh)',
            districtId: 'mp-anuppur',
            isActive: true,
            villages: [
              { id: 'v-305', name: 'राजेन्द्रग्राम', tehsilId: 'mp-anp-pushprajgarh', isActive: true },
              { id: 'v-306', name: 'दमोह ग्राम', tehsilId: 'mp-anp-pushprajgarh', isActive: true },
              { id: 'v-307', name: 'करनपठार', tehsilId: 'mp-anp-pushprajgarh', isActive: true },
            ],
          },
          {
            id: 'mp-anp-jaithari',
            name: 'जैतहरी (Jaithari)',
            districtId: 'mp-anuppur',
            isActive: true,
            villages: [
              { id: 'v-308', name: 'जैतहरी नगर', tehsilId: 'mp-anp-jaithari', isActive: true },
              { id: 'v-309', name: 'वेंकटनगर', tehsilId: 'mp-anp-jaithari', isActive: true },
            ],
          },
        ],
        ghats: [
          { id: 'g-anp-01', name: 'नर्मदा कुण्ड उद्गम घाट', districtId: 'mp-anuppur', tehsilId: 'mp-anp-amarkantak', locality: 'अमरकंटक मुख्य मन्दिर', isRiverside: true },
          { id: 'g-anp-02', name: 'कपिलधारा तीर्थ घाट', districtId: 'mp-anuppur', tehsilId: 'mp-anp-amarkantak', locality: 'कपिलधारा', isRiverside: true },
          { id: 'g-anp-03', name: 'दूधधारा प्रपात घाट', districtId: 'mp-anuppur', tehsilId: 'mp-anp-amarkantak', locality: 'दूधधारा', isRiverside: true },
          { id: 'g-anp-04', name: 'चक्रतीर्थ घाट अमरकंटक', districtId: 'mp-anuppur', tehsilId: 'mp-anp-amarkantak', locality: 'चक्रतीर्थ', isRiverside: true },
          { id: 'g-anp-05', name: 'शंभुधारा संगम घाट', districtId: 'mp-anuppur', tehsilId: 'mp-anp-amarkantak', locality: 'शंभुधारा', isRiverside: true },
        ],
      },
      {
        id: 'mp-dindori',
        name: 'डिंडोरी (Dindori)',
        stateId: 'mp',
        isActive: true,
        isRiverside: true,
        classification: 'riverside',
        classificationLabel: 'नर्मदा मुख्य प्रवाह तटवर्ती जिला',
        tehsils: [
          {
            id: 'mp-ddr-dindori',
            name: 'डिंडोरी मुख्यालय (Dindori)',
            districtId: 'mp-dindori',
            isActive: true,
            villages: [
              { id: 'v-901', name: 'डेम घाट डिंडोरी', tehsilId: 'mp-ddr-dindori', isActive: true },
              { id: 'v-902', name: 'कछारी ग्राम', tehsilId: 'mp-ddr-dindori', isActive: true },
            ],
          },
          {
            id: 'mp-ddr-shahpura',
            name: 'शहपुरा (Shahpura)',
            districtId: 'mp-dindori',
            isActive: true,
            villages: [
              { id: 'v-903', name: 'बिलगांव', tehsilId: 'mp-ddr-shahpura', isActive: true },
              { id: 'v-904', name: 'बरगांव', tehsilId: 'mp-ddr-shahpura', isActive: true },
            ],
          },
          {
            id: 'mp-ddr-bajag',
            name: 'बजाग (Bajag)',
            districtId: 'mp-dindori',
            isActive: true,
            villages: [
              { id: 'v-905', name: 'गाड़ासरई', tehsilId: 'mp-ddr-bajag', isActive: true },
            ],
          },
        ],
        ghats: [
          { id: 'g-ddr-01', name: 'डेम घाट डिंडोरी', districtId: 'mp-dindori', tehsilId: 'mp-ddr-dindori', locality: 'डिंडोरी नगर', isRiverside: true },
          { id: 'g-ddr-02', name: 'लक्ष्मण मढ़वा संगम घाट', districtId: 'mp-dindori', locality: 'डिंडोरी कछार', isRiverside: true },
          { id: 'g-ddr-03', name: 'कुकर्रामठ ऐतिहासिक घाट', districtId: 'mp-dindori', locality: 'कुकर्रामठ', isRiverside: true },
        ],
      },
      {
        id: 'mp-mandla',
        name: 'मंडला (Mandla)',
        stateId: 'mp',
        isActive: true,
        isRiverside: true,
        classification: 'riverside',
        classificationLabel: 'नर्मदा मुख्य प्रवाह तटवर्ती जिला',
        tehsils: [
          {
            id: 'mp-mdl-mandla',
            name: 'मंडला नगर व ग्रामीण (Mandla)',
            districtId: 'mp-mandla',
            isActive: true,
            villages: [
              { id: 'v-701', name: 'रपटा घाट परिक्षेत्र', tehsilId: 'mp-mdl-mandla', isActive: true },
              { id: 'v-702', name: 'सहस्रधारा मंडला', tehsilId: 'mp-mdl-mandla', isActive: true },
              { id: 'v-703', name: 'संगम घाट क्षेत्र', tehsilId: 'mp-mdl-mandla', isActive: true },
            ],
          },
          {
            id: 'mp-mdl-nainpur',
            name: 'नैनपुर (Nainpur)',
            districtId: 'mp-mandla',
            isActive: true,
            villages: [
              { id: 'v-704', name: 'पिंडरई', tehsilId: 'mp-mdl-nainpur', isActive: true },
            ],
          },
          {
            id: 'mp-mdl-bichhiya',
            name: 'बिछिया (Bichhiya)',
            districtId: 'mp-mandla',
            isActive: true,
            villages: [
              { id: 'v-705', name: 'अंजनिया', tehsilId: 'mp-mdl-bichhiya', isActive: true },
            ],
          },
        ],
        ghats: [
          { id: 'g-mdl-01', name: 'रपटा घाट मंडला', districtId: 'mp-mandla', tehsilId: 'mp-mdl-mandla', locality: 'मंडला नगर', isRiverside: true },
          { id: 'g-mdl-02', name: 'संगम घाट मंडla (नर्मदा-बंजर संगम)', districtId: 'mp-mandla', tehsilId: 'mp-mdl-mandla', locality: 'मंडला किला', isRiverside: true },
          { id: 'g-mdl-03', name: 'सहस्रधारा घाट मंडला', districtId: 'mp-mandla', tehsilId: 'mp-mdl-mandla', locality: 'सहस्रधारा', isRiverside: true },
          { id: 'g-mdl-04', name: 'नावर घाट मंडला', districtId: 'mp-mandla', locality: 'नावर तट', isRiverside: true },
        ],
      },
      {
        id: 'mp-jbp',
        name: 'जबलपुर (Jabalpur)',
        stateId: 'mp',
        isActive: true,
        isRiverside: true,
        classification: 'riverside',
        classificationLabel: 'नर्मदा मुख्य प्रवाह तटवर्ती जिला (संस्कारधानी)',
        tehsils: [
          {
            id: 'mp-jbp-panagar',
            name: 'पनागर / गौरीघाट (Panagar / Gwarighat)',
            districtId: 'mp-jbp',
            isActive: true,
            villages: [
              { id: 'v-101', name: 'गौरीघाट तटवर्ती बस्ती', tehsilId: 'mp-jbp-panagar', isActive: true },
              { id: 'v-102', name: 'तिलवारा घाट क्षेत्र', tehsilId: 'mp-jbp-panagar', isActive: true },
              { id: 'v-103', name: 'भेड़ाघाट ग्राम', tehsilId: 'mp-jbp-panagar', isActive: true },
              { id: 'v-104', name: 'ललपुर घाट क्षेत्र', tehsilId: 'mp-jbp-panagar', isActive: true },
            ],
          },
          {
            id: 'mp-jbp-patan',
            name: 'पाटन (Patan)',
            districtId: 'mp-jbp',
            isActive: true,
            villages: [
              { id: 'v-108', name: 'शहपुरा भिटौनी', tehsilId: 'mp-jbp-patan', isActive: true },
              { id: 'v-109', name: 'बेलखेड़ा नर्मदा तट', tehsilId: 'mp-jbp-patan', isActive: true },
            ],
          },
          {
            id: 'mp-jbp-sihora',
            name: 'सिहोरा (Sihora)',
            districtId: 'mp-jbp',
            isActive: true,
            villages: [
              { id: 'v-105', name: 'मझौली', tehsilId: 'mp-jbp-sihora', isActive: true },
              { id: 'v-106', name: 'खितौला', tehsilId: 'mp-jbp-sihora', isActive: true },
            ],
          },
        ],
        ghats: [
          { id: 'g-jbp-01', name: 'गौरीघाट (Gwarighat - मुख्य महाआरती तट)', districtId: 'mp-jbp', tehsilId: 'mp-jbp-panagar', locality: 'गौरीघाट', isRiverside: true },
          { id: 'g-jbp-02', name: 'भेड़ाघाट (Bhedaghat - धुआंधार व संगमरमर शैल)', districtId: 'mp-jbp', tehsilId: 'mp-jbp-panagar', locality: 'भेड़ाघाट', isRiverside: true },
          { id: 'g-jbp-03', name: 'तिलवारा घाट (Tilwaraghat - गांधी अस्थि विसर्जन तीर्थ)', districtId: 'mp-jbp', tehsilId: 'mp-jbp-panagar', locality: 'तिलवारा', isRiverside: true },
          { id: 'g-jbp-04', name: 'ललपुर घाट (Lalpur Ghat)', districtId: 'mp-jbp', locality: 'ललपुर', isRiverside: true },
          { id: 'g-jbp-05', name: 'जिलहरी घाट (Jilhari Ghat)', districtId: 'mp-jbp', locality: 'जिलहरी', isRiverside: true },
          { id: 'g-jbp-06', name: 'उमा घाट (Uma Ghat)', districtId: 'mp-jbp', locality: 'गौरीघाट समीप', isRiverside: true },
          { id: 'g-jbp-07', name: 'सरस्वती घाट भेड़ाघाट', districtId: 'mp-jbp', locality: 'भेड़ाघाट', isRiverside: true },
        ],
      },
      {
        id: 'mp-narsinghpur',
        name: 'नरसिंहपुर (Narsinghpur)',
        stateId: 'mp',
        isActive: true,
        isRiverside: true,
        classification: 'riverside',
        classificationLabel: 'नर्मदा मुख्य प्रवाह तटवर्ती जिला',
        tehsils: [
          {
            id: 'mp-nsp-gadarwara',
            name: 'गाडरवारा / बरमान घाट (Gadarwara)',
            districtId: 'mp-narsinghpur',
            isActive: true,
            villages: [
              { id: 'v-601', name: 'बरमान घाट परिक्षेत्र', tehsilId: 'mp-nsp-gadarwara', isActive: true },
              { id: 'v-602', name: 'सांकल घाट', tehsilId: 'mp-nsp-gadarwara', isActive: true },
              { id: 'v-603', name: 'करेली तट', tehsilId: 'mp-nsp-gadarwara', isActive: true },
            ],
          },
          {
            id: 'mp-nsp-gotegaon',
            name: 'गोटेगांव / श्रीधाम (Gotegaon)',
            districtId: 'mp-narsinghpur',
            isActive: true,
            villages: [
              { id: 'v-604', name: 'झिरना घाट', tehsilId: 'mp-nsp-gotegaon', isActive: true },
              { id: 'v-605', name: 'कमोद', tehsilId: 'mp-nsp-gotegaon', isActive: true },
            ],
          },
          {
            id: 'mp-nsp-hq',
            name: 'नरसिंहपुर मुख्यालय (Narsinghpur)',
            districtId: 'mp-narsinghpur',
            isActive: true,
            villages: [
              { id: 'v-606', name: 'नरसिंहपुर सदर', tehsilId: 'mp-nsp-hq', isActive: true },
            ],
          },
        ],
        ghats: [
          { id: 'g-nsp-01', name: 'बरमान घाट (Barmanghat - महारानी लक्ष्मीबाई व दीपदान तट)', districtId: 'mp-narsinghpur', tehsilId: 'mp-nsp-gadarwara', locality: 'बरमान', isRiverside: true },
          { id: 'g-nsp-02', name: 'सांकल घाट (Sankal Ghat)', districtId: 'mp-narsinghpur', tehsilId: 'mp-nsp-gadarwara', locality: 'सांकल', isRiverside: true },
          { id: 'g-nsp-03', name: 'झिरना घाट (Jhirna Ghat)', districtId: 'mp-narsinghpur', locality: 'झिरना', isRiverside: true },
          { id: 'g-nsp-04', name: 'ककरा घाट नरसिंहपुर', districtId: 'mp-narsinghpur', locality: 'ककरा', isRiverside: true },
        ],
      },
      {
        id: 'mp-nrm',
        name: 'नर्मदापुरम / होशंगाबाद (Narmadapuram)',
        stateId: 'mp',
        isActive: true,
        isRiverside: true,
        classification: 'riverside',
        classificationLabel: 'नर्मदा मुख्य प्रवाह तटवर्ती जिला (सेठानी घाट तीर्थ)',
        tehsils: [
          {
            id: 'mp-nrm-hq',
            name: 'नर्मदापुरम मुख्यालय (सेठानी घाट परिक्षेत्र)',
            districtId: 'mp-nrm',
            isActive: true,
            villages: [
              { id: 'v-201', name: 'सेठानी घाट परिक्षेत्र', tehsilId: 'mp-nrm-hq', isActive: true },
              { id: 'v-202', name: 'कोरीघाट तट', tehsilId: 'mp-nrm-hq', isActive: true },
              { id: 'v-203', name: 'विवेकानंद घाट क्षेत्र', tehsilId: 'mp-nrm-hq', isActive: true },
              { id: 'v-204', name: 'रोहना कछार', tehsilId: 'mp-nrm-hq', isActive: true },
            ],
          },
          {
            id: 'mp-nrm-itarsi',
            name: 'इटारसी / तवा संगम (Itarsi)',
            districtId: 'mp-nrm',
            isActive: true,
            villages: [
              { id: 'v-205', name: 'बांद्राभान संगम तट', tehsilId: 'mp-nrm-itarsi', isActive: true },
              { id: 'v-206', name: 'तवानगर', tehsilId: 'mp-nrm-itarsi', isActive: true },
              { id: 'v-207', name: 'केसला', tehsilId: 'mp-nrm-itarsi', isActive: true },
            ],
          },
          {
            id: 'mp-nrm-pipariya',
            name: 'पिपरिया / सांडिया (Pipariya / Sandiya)',
            districtId: 'mp-nrm',
            isActive: true,
            villages: [
              { id: 'v-208', name: 'सांडिया नर्मदा घाट', tehsilId: 'mp-nrm-pipariya', isActive: true },
              { id: 'v-209', name: 'बनखेड़ी', tehsilId: 'mp-nrm-pipariya', isActive: true },
            ],
          },
          {
            id: 'mp-nrm-babai',
            name: 'माखननगर / बाबई (Makhannagar)',
            districtId: 'mp-nrm',
            isActive: true,
            villages: [
              { id: 'v-210', name: 'डोंगरवाड़ा घाट', tehsilId: 'mp-nrm-babai', isActive: true },
            ],
          },
        ],
        ghats: [
          { id: 'g-nrm-01', name: 'सेठानी घाट (Sethani Ghat - मुख्य ऐतिहासिक महा-आरती घाट)', districtId: 'mp-nrm', tehsilId: 'mp-nrm-hq', locality: 'नर्मदापुरम नगर', isRiverside: true },
          { id: 'g-nrm-02', name: 'कोरी घाट नर्मदापुरम', districtId: 'mp-nrm', tehsilId: 'mp-nrm-hq', locality: 'नर्मदापुरम', isRiverside: true },
          { id: 'g-nrm-03', name: 'विवेकानंद घाट नर्मदापुरम', districtId: 'mp-nrm', tehsilId: 'mp-nrm-hq', locality: 'नर्मदापुरम', isRiverside: true },
          { id: 'g-nrm-04', name: 'सांडिया घाट पिपरिया (Sandiya Ghat)', districtId: 'mp-nrm', tehsilId: 'mp-nrm-pipariya', locality: 'सांडिया', isRiverside: true },
          { id: 'g-nrm-05', name: 'बांद्राभान संगम घाट (तवा-नर्मदा पवित्र संगम)', districtId: 'mp-nrm', tehsilId: 'mp-nrm-itarsi', locality: 'बांद्राभान', isRiverside: true },
          { id: 'g-nrm-06', name: 'डोंगरवाड़ा घाट (Dongarwada Ghat)', districtId: 'mp-nrm', locality: 'डोंगरवाड़ा', isRiverside: true },
        ],
      },
      {
        id: 'mp-raisen',
        name: 'रायसेन (Raisen)',
        stateId: 'mp',
        isActive: true,
        isRiverside: true,
        classification: 'riverside',
        classificationLabel: 'नर्मदा मुख्य प्रवाह तटवर्ती जिला (बौरास व बकतरा तट)',
        tehsils: [
          {
            id: 'mp-rsn-bareli',
            name: 'बरेली / बकतरा (नर्मदा तट)',
            districtId: 'mp-raisen',
            isActive: true,
            villages: [
              { id: 'v-1301', name: 'बकतरा घाट', tehsilId: 'mp-rsn-bareli', isActive: true },
              { id: 'v-1302', name: 'भगदेई तटवर्ती ग्राम', tehsilId: 'mp-rsn-bareli', isActive: true },
              { id: 'v-1303', name: 'छींद धाम परिक्षेत्र', tehsilId: 'mp-rsn-bareli', isActive: true },
              { id: 'v-1304', name: 'पिपरिया कला', tehsilId: 'mp-rsn-bareli', isActive: true },
            ],
          },
          {
            id: 'mp-rsn-udaipura',
            name: 'उदयपुरा / बौरास (Udaipura / Bauras)',
            districtId: 'mp-raisen',
            isActive: true,
            villages: [
              { id: 'v-1305', name: 'बौरास नर्मदा घाट', tehsilId: 'mp-rsn-udaipura', isActive: true },
              { id: 'v-1306', name: 'उदयपुरा नगर व ग्रामीण', tehsilId: 'mp-rsn-udaipura', isActive: true },
              { id: 'v-1307', name: 'देवरी कछार', tehsilId: 'mp-rsn-udaipura', isActive: true },
            ],
          },
          {
            id: 'mp-rsn-badi',
            name: 'बाड़ी (नर्मदा कछार व बारना बेसिन)',
            districtId: 'mp-raisen',
            isActive: true,
            villages: [
              { id: 'v-1308', name: 'भारकच्छ तटवर्ती बस्ती', tehsilId: 'mp-rsn-badi', isActive: true },
              { id: 'v-1309', name: 'बाड़ी कस्बा', tehsilId: 'mp-rsn-badi', isActive: true },
              { id: 'v-1310', name: 'बम्होरी', tehsilId: 'mp-rsn-badi', isActive: true },
            ],
          },
          {
            id: 'mp-rsn-hq',
            name: 'रायसेन मुख्यालय व सांची',
            districtId: 'mp-raisen',
            isActive: true,
            villages: [
              { id: 'v-1311', name: 'सांची परिक्षेत्र', tehsilId: 'mp-rsn-hq', isActive: true },
              { id: 'v-1312', name: 'सलामतपुर', tehsilId: 'mp-rsn-hq', isActive: true },
            ],
          },
          {
            id: 'mp-rsn-silwani',
            name: 'सिलवानी (Silwani)',
            districtId: 'mp-raisen',
            isActive: true,
            villages: [
              { id: 'v-1314', name: 'सिलवानी नगर', tehsilId: 'mp-rsn-silwani', isActive: true },
            ],
          },
        ],
        ghats: [
          { id: 'g-rsn-01', name: 'बौरास नर्मदा घाट (Bauras Ghat)', districtId: 'mp-raisen', tehsilId: 'mp-rsn-udaipura', locality: 'बौरास', isRiverside: true },
          { id: 'g-rsn-02', name: 'बकतरा घाट (Baktara Ghat)', districtId: 'mp-raisen', tehsilId: 'mp-rsn-bareli', locality: 'बकतरा', isRiverside: true },
          { id: 'g-rsn-03', name: 'भारकच्छ घाट (Bharkachh Ghat)', districtId: 'mp-raisen', tehsilId: 'mp-rsn-badi', locality: 'भारकच्छ', isRiverside: true },
          { id: 'g-rsn-04', name: 'छींद धाम तट (Chhind Dham Ghat)', districtId: 'mp-raisen', locality: 'छींद', isRiverside: true },
          { id: 'g-rsn-05', name: 'भगदेई घाट (Bhagdei Ghat)', districtId: 'mp-raisen', locality: 'भगदेई', isRiverside: true },
        ],
      },
      {
        id: 'mp-sehore',
        name: 'सीहोर / बुधनी (Sehore / Budhni)',
        stateId: 'mp',
        isActive: true,
        isRiverside: true,
        classification: 'riverside',
        classificationLabel: 'नर्मदा मुख्य प्रवाह तटवर्ती जिला (बुधनी व भेरुंदा तट)',
        tehsils: [
          {
            id: 'mp-shr-budhni',
            name: 'बुधनी (नर्मदापुरम के समक्ष तट)',
            districtId: 'mp-sehore',
            isActive: true,
            villages: [
              { id: 'v-1201', name: 'बुधनी घाट बस्ती', tehsilId: 'mp-shr-budhni', isActive: true },
              { id: 'v-1202', name: 'आंवली घाट', tehsilId: 'mp-shr-budhni', isActive: true },
            ],
          },
          {
            id: 'mp-shr-bherunda',
            name: 'भेरुंदा / नसरुल्लागंज (Bherunda)',
            districtId: 'mp-sehore',
            isActive: true,
            villages: [
              { id: 'v-1203', name: 'डिगांबड़ नर्मदा तट', tehsilId: 'mp-shr-bherunda', isActive: true },
              { id: 'v-1204', name: 'नीलकंठ', tehsilId: 'mp-shr-bherunda', isActive: true },
            ],
          },
          {
            id: 'mp-shr-rehti',
            name: 'रेहटी (Rehti)',
            districtId: 'mp-sehore',
            isActive: true,
            villages: [
              { id: 'v-1205', name: 'सलकनपुर परिक्षेत्र', tehsilId: 'mp-shr-rehti', isActive: true },
            ],
          },
        ],
        ghats: [
          { id: 'g-shr-01', name: 'बुधनी घाट (Budhni Ghat)', districtId: 'mp-sehore', tehsilId: 'mp-shr-budhni', locality: 'बुधनी', isRiverside: true },
          { id: 'g-shr-02', name: 'आंवली घाट (Aonli Ghat)', districtId: 'mp-sehore', locality: 'आंवली', isRiverside: true },
          { id: 'g-shr-03', name: 'डिगांबड़ घाट (Digambad Ghat)', districtId: 'mp-sehore', locality: 'डिगांबड़', isRiverside: true },
          { id: 'g-shr-04', name: 'नीलकंठ घाट (Neelkanth Ghat)', districtId: 'mp-sehore', locality: 'नीलकंठ', isRiverside: true },
          { id: 'g-shr-05', name: 'छीपानेर घाट (Chhipaner Ghat)', districtId: 'mp-sehore', locality: 'छीपानेर', isRiverside: true },
        ],
      },
      {
        id: 'mp-harda',
        name: 'हरदा (Harda)',
        stateId: 'mp',
        isActive: true,
        isRiverside: true,
        classification: 'riverside',
        classificationLabel: 'नर्मदा मुख्य प्रवाह तटवर्ती जिला (हंडिया रिद्धनाथ तीर्थ)',
        tehsils: [
          {
            id: 'mp-hrd-handia',
            name: 'हंडिया (पवित्र रिद्धनाथ तट)',
            districtId: 'mp-harda',
            isActive: true,
            villages: [
              { id: 'v-1001', name: 'हंडिया घाट परिक्षेत्र', tehsilId: 'mp-hrd-handia', isActive: true },
              { id: 'v-1002', name: 'गोपीनाथ तट', tehsilId: 'mp-hrd-handia', isActive: true },
            ],
          },
          {
            id: 'mp-hrd-timarni',
            name: 'टिमरनी (Timarni)',
            districtId: 'mp-harda',
            isActive: true,
            villages: [
              { id: 'v-1003', name: 'रहटगांव', tehsilId: 'mp-hrd-timarni', isActive: true },
            ],
          },
        ],
        ghats: [
          { id: 'g-hrd-01', name: 'हंडिया रिद्धनाथ घाट (Handia Riddhanath Ghat - ऐतिहासिक)', districtId: 'mp-harda', tehsilId: 'mp-hrd-handia', locality: 'हंडिया', isRiverside: true },
          { id: 'g-hrd-02', name: 'गोपीनाथ घाट हंडिया', districtId: 'mp-harda', locality: 'हंडिया', isRiverside: true },
          { id: 'g-hrd-03', name: 'नेमावर के समक्ष हंडिया दक्षिण तट', districtId: 'mp-harda', locality: 'हंडिया', isRiverside: true },
        ],
      },
      {
        id: 'mp-dewas',
        name: 'देवास (Dewas)',
        stateId: 'mp',
        isActive: true,
        isRiverside: true,
        classification: 'riverside',
        classificationLabel: 'नर्मदा मुख्य प्रवाह तटवर्ती जिला (नेमावर नाभि स्थल)',
        tehsils: [
          {
            id: 'mp-dws-nemawar',
            name: 'खातेगांव / नेमावर (नर्मदा नाभि स्थल तीर्थ)',
            districtId: 'mp-dewas',
            isActive: true,
            villages: [
              { id: 'v-1401', name: 'नेमावर सिद्धनाथ घाट', tehsilId: 'mp-dws-nemawar', isActive: true },
              { id: 'v-1402', name: 'खातेगांव नगर', tehsilId: 'mp-dws-nemawar', isActive: true },
              { id: 'v-1403', name: 'संदीपनी आश्रम तट', tehsilId: 'mp-dws-nemawar', isActive: true },
            ],
          },
          {
            id: 'mp-dws-kannod',
            name: 'कन्नौद (Kannod)',
            districtId: 'mp-dewas',
            isActive: true,
            villages: [
              { id: 'v-1404', name: 'सतवास', tehsilId: 'mp-dws-kannod', isActive: true },
            ],
          },
        ],
        ghats: [
          { id: 'g-dws-01', name: 'नेमावर सिद्धनाथ घाट (Nemawar Siddhanath Ghat - नर्मदा नाभि स्थल)', districtId: 'mp-dewas', tehsilId: 'mp-dws-nemawar', locality: 'नेमावर', isRiverside: true },
          { id: 'g-dws-02', name: 'जटाशंकर घाट नेमावर', districtId: 'mp-dewas', locality: 'नेमावर', isRiverside: true },
          { id: 'g-dws-03', name: 'ऋषितीर्थ घाट नेमावर', districtId: 'mp-dewas', locality: 'नेमावर', isRiverside: true },
        ],
      },
      {
        id: 'mp-khandwa',
        name: 'खंडवा / पूर्वी निमाड़ (Khandwa / Omkareshwar)',
        stateId: 'mp',
        isActive: true,
        isRiverside: true,
        classification: 'riverside',
        classificationLabel: 'नर्मदा मुख्य प्रवाह तटवर्ती जिला (श्री ओंकारेश्वर ज्योतिर्लिंग)',
        tehsils: [
          {
            id: 'mp-knd-punasa',
            name: 'पुनासा / ओंकारेश्वर तीर्थ (Omkareshwar)',
            districtId: 'mp-khandwa',
            isActive: true,
            villages: [
              { id: 'v-401', name: 'ओंकारेश्वर नगर तट', tehsilId: 'mp-knd-punasa', isActive: true },
              { id: 'v-402', name: 'ममलेश्वर घाट क्षेत्र', tehsilId: 'mp-knd-punasa', isActive: true },
              { id: 'v-403', name: 'कोटेश्वर तीर्थ', tehsilId: 'mp-knd-punasa', isActive: true },
              { id: 'v-404', name: 'मोरटक्का', tehsilId: 'mp-knd-punasa', isActive: true },
            ],
          },
          {
            id: 'mp-knd-khandwa',
            name: 'खंडवा मुख्यालय व ग्रामीण',
            districtId: 'mp-khandwa',
            isActive: true,
            villages: [
              { id: 'v-405', name: 'मूंदी', tehsilId: 'mp-knd-khandwa', isActive: true },
              { id: 'v-406', name: 'पंधाना', tehsilId: 'mp-knd-khandwa', isActive: true },
            ],
          },
        ],
        ghats: [
          { id: 'g-knd-01', name: 'ओंकारेश्वर नागर घाट (Omkareshwar Nagar Ghat - ज्योतिर्लिंग तट)', districtId: 'mp-khandwa', tehsilId: 'mp-knd-punasa', locality: 'ओंकारेश्वर द्वीप', isRiverside: true },
          { id: 'g-knd-02', name: 'ममलेश्वर घाट ओंकारेश्वर (Mamleshwar Ghat)', districtId: 'mp-khandwa', tehsilId: 'mp-knd-punasa', locality: 'ममलेश्वर ज्योतिर्लिंग', isRiverside: true },
          { id: 'g-knd-03', name: 'कोटेश्वर घाट (Koteshwar Ghat)', districtId: 'mp-khandwa', locality: 'कोटेश्वर', isRiverside: true },
          { id: 'g-knd-04', name: 'गौमुख घाट ओंकारेश्वर (Gaumukh Ghat)', districtId: 'mp-khandwa', locality: 'ओंकारेश्वर', isRiverside: true },
          { id: 'g-knd-05', name: 'चक्रतीर्थ घाट ओंकारेश्वर (Chakratirth Ghat)', districtId: 'mp-khandwa', locality: 'ओंकारेश्वर', isRiverside: true },
          { id: 'g-knd-06', name: 'मोरटक्का नर्मदा घाट (Mortakka Ghat)', districtId: 'mp-khandwa', locality: 'मोरटक्का ब्रिज', isRiverside: true },
        ],
      },
      {
        id: 'mp-khargone',
        name: 'खरगोन / पश्चिमी निमाड़ (Khargone / Maheshwar)',
        stateId: 'mp',
        isActive: true,
        isRiverside: true,
        classification: 'riverside',
        classificationLabel: 'नर्मदा मुख्य प्रवाह तटवर्ती जिला (महेश्वर अहिल्या किला तीर्थ)',
        tehsils: [
          {
            id: 'mp-khg-maheshwar',
            name: 'महेश्वर (पवित्र अहिल्या घाट व किला)',
            districtId: 'mp-khargone',
            isActive: true,
            villages: [
              { id: 'v-501', name: 'अहिल्या घाट परिक्षेत्र', tehsilId: 'mp-khg-maheshwar', isActive: true },
              { id: 'v-502', name: 'मंडलेश्वर घाट', tehsilId: 'mp-khg-maheshwar', isActive: true },
              { id: 'v-503', name: 'चोली ग्राम', tehsilId: 'mp-khg-maheshwar', isActive: true },
              { id: 'v-504', name: 'सहस्रधारा तट', tehsilId: 'mp-khg-maheshwar', isActive: true },
            ],
          },
          {
            id: 'mp-khg-barwaha',
            name: 'बड़वाह (Barwaha)',
            districtId: 'mp-khargone',
            isActive: true,
            villages: [
              { id: 'v-505', name: 'नावड़ाटोड़ी तट', tehsilId: 'mp-khg-barwaha', isActive: true },
              { id: 'v-506', name: 'खेड़ी घाट', tehsilId: 'mp-khg-barwaha', isActive: true },
            ],
          },
          {
            id: 'mp-khg-kasrawad',
            name: 'कसरावद (Kasrawad)',
            districtId: 'mp-khargone',
            isActive: true,
            villages: [
              { id: 'v-507', name: 'कसरावद कछार', tehsilId: 'mp-khg-kasrawad', isActive: true },
            ],
          },
        ],
        ghats: [
          { id: 'g-khg-01', name: 'अहिल्या घाट महेश्वर (Ahilya Ghat - विश्वप्रसिद्ध ऐतिहासिक किला तट)', districtId: 'mp-khargone', tehsilId: 'mp-khg-maheshwar', locality: 'महेश्वर किला', isRiverside: true },
          { id: 'g-khg-02', name: 'नर्मदा मुख्य घाट महेश्वर (Narmada Ghat Maheshwar)', districtId: 'mp-khargone', tehsilId: 'mp-khg-maheshwar', locality: 'महेश्वर', isRiverside: true },
          { id: 'g-khg-03', name: 'पेशवा घाट महेश्वर (Peshwa Ghat)', districtId: 'mp-khargone', locality: 'महेश्वर', isRiverside: true },
          { id: 'g-khg-04', name: 'मंडलेश्वर घाट (Mandleshwar Ghat)', districtId: 'mp-khargone', locality: 'मंडलेश्वर', isRiverside: true },
          { id: 'g-khg-05', name: 'नावड़ाटोड़ी पुरातात्विक घाट (Navdatoli Ghat)', districtId: 'mp-khargone', locality: 'नावड़ाटोड़ी', isRiverside: true },
          { id: 'g-khg-06', name: 'सहस्रधारा महेश्वर (Sahasradhara Ghat)', districtId: 'mp-khargone', locality: 'सहस्रधारा', isRiverside: true },
          { id: 'g-khg-07', name: 'बड़वाह खेड़ी घाट (Khedighat Barwaha)', districtId: 'mp-khargone', locality: 'बड़वाह', isRiverside: true },
        ],
      },
      {
        id: 'mp-dhar',
        name: 'धार (Dhar)',
        stateId: 'mp',
        isActive: true,
        isRiverside: true,
        classification: 'riverside',
        classificationLabel: 'नर्मदा मुख्य प्रवाह तटवर्ती जिला (धरमपुरी व खलघाट तट)',
        tehsils: [
          {
            id: 'mp-dhr-dharampuri',
            name: 'धरमपुरी (नर्मदा मुख्य तट)',
            districtId: 'mp-dhar',
            isActive: true,
            villages: [
              { id: 'v-1101', name: 'धरमपुरी घाट', tehsilId: 'mp-dhr-dharampuri', isActive: true },
              { id: 'v-1102', name: 'खलघाट राष्ट्रीय राजमार्ग संगम', tehsilId: 'mp-dhr-dharampuri', isActive: true },
            ],
          },
          {
            id: 'mp-dhr-manawar',
            name: 'मनावर (Manawar)',
            districtId: 'mp-dhar',
            isActive: true,
            villages: [
              { id: 'v-1103', name: 'कोटेश्वर मनावर तट', tehsilId: 'mp-dhr-manawar', isActive: true },
              { id: 'v-1104', name: 'सिंघाना', tehsilId: 'mp-dhr-manawar', isActive: true },
            ],
          },
          {
            id: 'mp-dhr-kukshi',
            name: 'कुक्षी / निसरपुर (Kukshi / Nisarpur)',
            districtId: 'mp-dhar',
            isActive: true,
            villages: [
              { id: 'v-1105', name: 'निसरपुर नर्मदा बैकवाटर', tehsilId: 'mp-dhr-kukshi', isActive: true },
              { id: 'v-1106', name: 'चिखल्दा', tehsilId: 'mp-dhr-kukshi', isActive: true },
            ],
          },
        ],
        ghats: [
          { id: 'g-dhr-01', name: 'धरमपुरी नर्मदा घाट (Dharampuri Ghat)', districtId: 'mp-dhar', tehsilId: 'mp-dhr-dharampuri', locality: 'धरमपुरी', isRiverside: true },
          { id: 'g-dhr-02', name: 'खलघाट (Khalghat - राष्ट्रीय राजमार्ग तट)', districtId: 'mp-dhar', locality: 'खलघाट ब्रिज', isRiverside: true },
          { id: 'g-dhr-03', name: 'कोटेश्वर तीर्थ घाट मनावर', districtId: 'mp-dhar', locality: 'कोटेश्वर', isRiverside: true },
          { id: 'g-dhr-04', name: 'चिखल्दा घाट (Chikhaldas Ghat)', districtId: 'mp-dhar', locality: 'चिखल्दा', isRiverside: true },
          { id: 'g-dhr-05', name: 'निसरपुर घाट (Nisarpur Ghat)', districtId: 'mp-dhar', locality: 'निसरपुर', isRiverside: true },
        ],
      },
      {
        id: 'mp-barwani',
        name: 'बड़वानी (Barwani)',
        stateId: 'mp',
        isActive: true,
        isRiverside: true,
        classification: 'riverside',
        classificationLabel: 'नर्मदा मुख्य प्रवाह तटवर्ती जिला (राजघाट तीर्थ)',
        tehsils: [
          {
            id: 'mp-brw-barwani',
            name: 'बड़वानी (राजघाट तट)',
            districtId: 'mp-barwani',
            isActive: true,
            villages: [
              { id: 'v-801', name: 'राजघाट नर्मदा तट परिक्षेत्र', tehsilId: 'mp-brw-barwani', isActive: true },
              { id: 'v-802', name: 'कसरावद बड़वानी', tehsilId: 'mp-brw-barwani', isActive: true },
            ],
          },
          {
            id: 'mp-brw-anjad',
            name: 'अंजड़ / ठीकरी (Anjad / Thikri)',
            districtId: 'mp-barwani',
            isActive: true,
            villages: [
              { id: 'v-803', name: 'छोटा बड़दा तट', tehsilId: 'mp-brw-anjad', isActive: true },
              { id: 'v-804', name: 'ठीकरी कछार', tehsilId: 'mp-brw-anjad', isActive: true },
            ],
          },
        ],
        ghats: [
          { id: 'g-brw-01', name: 'राजघाट बड़वानी (Rajghat Barwani - मुख्य तीर्थ तट)', districtId: 'mp-barwani', tehsilId: 'mp-brw-barwani', locality: 'बड़वानी', isRiverside: true },
          { id: 'g-brw-02', name: 'छोटा बड़दा घाट (Chhota Barda Ghat)', districtId: 'mp-barwani', locality: 'छोटा बड़दा', isRiverside: true },
          { id: 'g-brw-03', name: 'कसरावद घाट बड़वानी', districtId: 'mp-barwani', locality: 'कसरावद', isRiverside: true },
        ],
      },
      {
        id: 'mp-alirajpur',
        name: 'अलीराजपुर (Alirajpur)',
        stateId: 'mp',
        isActive: true,
        isRiverside: true,
        classification: 'riverside',
        classificationLabel: 'नर्मदा मुख्य प्रवाह तटवर्ती जिला (ककराना बैकवाटर तट)',
        tehsils: [
          {
            id: 'mp-alj-sondwa',
            name: 'सोंडवा (ककराना नर्मदा तट)',
            districtId: 'mp-alirajpur',
            isActive: true,
            villages: [
              { id: 'v-2401', name: 'ककराना नर्मदा बैकवाटर तट', tehsilId: 'mp-alj-sondwa', isActive: true },
              { id: 'v-2402', name: 'चमेली ग्राम', tehsilId: 'mp-alj-sondwa', isActive: true },
            ],
          },
          {
            id: 'mp-alj-kattiwada',
            name: 'कट्ठीवाड़ा (Kattiwada)',
            districtId: 'mp-alirajpur',
            isActive: true,
            villages: [
              { id: 'v-2403', name: 'कट्ठीवाड़ा वनग्राम', tehsilId: 'mp-alj-kattiwada', isActive: true },
            ],
          },
        ],
        ghats: [
          { id: 'g-alj-01', name: 'ककराना घाट (Kakrana Ghat - नर्मदा बैकवाटर नौका तट)', districtId: 'mp-alirajpur', tehsilId: 'mp-alj-sondwa', locality: 'ककराना', isRiverside: true },
          { id: 'g-alj-02', name: 'चमेली घाट अलीराजपुर', districtId: 'mp-alirajpur', locality: 'सोंडवा', isRiverside: true },
        ],
      },

      /* ================= 2. BASIN & TRIBUTARY SERVICE DISTRICTS (नर्मदा कछार, सहायक नदी व सेवा क्षेत्र) ================= */
      {
        id: 'mp-bhopal',
        name: 'भोपाल (Bhopal)',
        stateId: 'mp',
        isActive: true,
        isRiverside: false,
        classification: 'basin',
        classificationLabel: 'नर्मदा कछार / जलसंभर व प्रादेशिक समन्वय केंद्र',
        tehsils: [
          {
            id: 'mp-bhp-bhopal',
            name: 'भोपाल शहर व कोलार (Bhopal)',
            districtId: 'mp-bhopal',
            isActive: true,
            villages: [
              { id: 'v-1501', name: 'कोलार परिक्षेत्र', tehsilId: 'mp-bhp-bhopal', isActive: true },
              { id: 'v-1502', name: 'बड़ा तालाब कैचमेंट', tehsilId: 'mp-bhp-bhopal', isActive: true },
            ],
          },
          {
            id: 'mp-bhp-berasia',
            name: 'बैरसिया (Berasia)',
            districtId: 'mp-bhopal',
            isActive: true,
            villages: [
              { id: 'v-1503', name: 'बैरसिया कस्बा', tehsilId: 'mp-bhp-berasia', isActive: true },
            ],
          },
        ],
        ghats: [
          { id: 'g-bhp-01', name: 'बड़ा तालाब शीतल दास की बगिया घाट (जलसंभर केंद्र)', districtId: 'mp-bhopal', locality: 'भोपाल', isRiverside: false },
        ],
      },
      {
        id: 'mp-indore',
        name: 'इंदौर (Indore)',
        stateId: 'mp',
        isActive: true,
        isRiverside: false,
        classification: 'basin',
        classificationLabel: 'नर्मदा जल प्रदाय व मालवा सेवा केंद्र',
        tehsils: [
          {
            id: 'mp-ind-indore',
            name: 'इंदौर शहर व महू (Indore / Mhow)',
            districtId: 'mp-indore',
            isActive: true,
            villages: [
              { id: 'v-1601', name: 'महू छावनी', tehsilId: 'mp-ind-indore', isActive: true },
              { id: 'v-1602', name: 'सांवेर', tehsilId: 'mp-ind-indore', isActive: true },
            ],
          },
        ],
      },
      {
        id: 'mp-betul',
        name: 'बैतूल (Betul - तवा उद्गम कछार)',
        stateId: 'mp',
        isActive: true,
        isRiverside: false,
        classification: 'basin',
        classificationLabel: 'नर्मदा प्रमुख सहायक नदी तवा उद्गम कछार',
        tehsils: [
          {
            id: 'mp-btl-multai',
            name: 'मुलताई / शाहपुर (Multai)',
            districtId: 'mp-betul',
            isActive: true,
            villages: [
              { id: 'v-2501', name: 'मुलताई तपोभूमि', tehsilId: 'mp-btl-multai', isActive: true },
              { id: 'v-2502', name: 'शाहपुर कछार', tehsilId: 'mp-btl-multai', isActive: true },
            ],
          },
        ],
      },
      {
        id: 'mp-seoni',
        name: 'सिवनी (Seoni)',
        stateId: 'mp',
        isActive: true,
        isRiverside: false,
        classification: 'basin',
        classificationLabel: 'सतपुड़ा नर्मदा जलसंभर क्षेत्र',
        tehsils: [
          {
            id: 'mp-sni-lakhnadon',
            name: 'लखनादौन (Lakhnadon)',
            districtId: 'mp-seoni',
            isActive: true,
            villages: [
              { id: 'v-2601', name: 'लखनादौन नगर', tehsilId: 'mp-sni-lakhnadon', isActive: true },
            ],
          },
        ],
      },
      {
        id: 'mp-damoh',
        name: 'दमोह (Damoh - सुनार बेसिन)',
        stateId: 'mp',
        isActive: true,
        isRiverside: false,
        classification: 'basin',
        classificationLabel: 'नर्मदा बेसिन जलसंभर क्षेत्र',
        tehsils: [
          {
            id: 'mp-dmh-jabera',
            name: 'जबेरा (Jabera)',
            districtId: 'mp-damoh',
            isActive: true,
            villages: [
              { id: 'v-2701', name: 'जबेरा ग्राम', tehsilId: 'mp-dmh-jabera', isActive: true },
            ],
          },
        ],
      },
      {
        id: 'mp-sagar',
        name: 'सागर (Sagar)',
        stateId: 'mp',
        isActive: true,
        isRiverside: false,
        classification: 'service_area',
        classificationLabel: 'बुंदेलखंड नर्मदा सेवा परिक्षेत्र',
        tehsils: [
          {
            id: 'mp-sgr-deori',
            name: 'देवरी (Deori)',
            districtId: 'mp-sagar',
            isActive: true,
            villages: [
              { id: 'v-2801', name: 'देवरी नगर', tehsilId: 'mp-sgr-deori', isActive: true },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'gj',
    name: 'गुजरात (Gujarat)',
    country: 'भारत (India)',
    isActive: true,
    districts: [
      /* ================= GUJARAT RIVERSIDE DISTRICTS ================= */
      {
        id: 'gj-narmada',
        name: 'नर्मदा / राजपीपला (Narmada / Rajpipla)',
        stateId: 'gj',
        isActive: true,
        isRiverside: true,
        classification: 'riverside',
        classificationLabel: 'नर्मदा मुख्य प्रवाह तटवर्ती जिला (सरदार सरोवर व गरुड़ेश्वर)',
        tehsils: [
          {
            id: 'gj-nrm-kevadia',
            name: 'केवड़िया / एकतानगर व गरुड़ेश्वर',
            districtId: 'gj-narmada',
            isActive: true,
            villages: [
              { id: 'v-1801', name: 'गरुड़ेश्वर दत्त मंदिर घाट', tehsilId: 'gj-nrm-kevadia', isActive: true },
              { id: 'v-1802', name: 'केवड़िया ग्राम', tehsilId: 'gj-nrm-kevadia', isActive: true },
              { id: 'v-1803', name: 'सरदार सरोवर बांध तट', tehsilId: 'gj-nrm-kevadia', isActive: true },
              { id: 'v-1804', name: 'गोरा ग्राम', tehsilId: 'gj-nrm-kevadia', isActive: true },
            ],
          },
          {
            id: 'gj-nrm-nandod',
            name: 'नांदोद / राजपीपला (Nandod)',
            districtId: 'gj-narmada',
            isActive: true,
            villages: [
              { id: 'v-1805', name: 'राजपीपला नगर', tehsilId: 'gj-nrm-nandod', isActive: true },
            ],
          },
          {
            id: 'gj-nrm-tilakwada',
            name: 'तिलकवाड़ा (Tilakwada)',
            districtId: 'gj-narmada',
            isActive: true,
            villages: [
              { id: 'v-1806', name: 'तिलकवाड़ा नर्मदा तट', tehsilId: 'gj-nrm-tilakwada', isActive: true },
            ],
          },
        ],
        ghats: [
          { id: 'g-gjn-01', name: 'गरुड़ेश्वर दत्त मंदिर घाट (Garudeshwar Datta Mandir Ghat)', districtId: 'gj-narmada', tehsilId: 'gj-nrm-kevadia', locality: 'गरुड़ेश्वर', isRiverside: true },
          { id: 'g-gjn-02', name: 'केवड़िया नर्मदा घाट (Kevadia Ghat)', districtId: 'gj-narmada', tehsilId: 'gj-nrm-kevadia', locality: 'एकतानगर', isRiverside: true },
          { id: 'g-gjn-03', name: 'गोरा घाट (Gora Ghat)', districtId: 'gj-narmada', locality: 'गोरा', isRiverside: true },
          { id: 'g-gjn-04', name: 'सरदार सरोवर बांध तट', districtId: 'gj-narmada', locality: 'केवड़िया', isRiverside: true },
          { id: 'g-gjn-05', name: 'तिलकवाड़ा नर्मदा घाट', districtId: 'gj-narmada', locality: 'तिलकवाड़ा', isRiverside: true },
        ],
      },
      {
        id: 'gj-vadodara',
        name: 'वडोदरा (Vadodara)',
        stateId: 'gj',
        isActive: true,
        isRiverside: true,
        classification: 'riverside',
        classificationLabel: 'नर्मदा मुख्य प्रवाह तटवर्ती जिला (चांदोद-कर्णाली दक्षिण प्रयाग)',
        tehsils: [
          {
            id: 'gj-vad-dabhoi',
            name: 'डभोई / चांदोद (Chandod)',
            districtId: 'gj-vadodara',
            isActive: true,
            villages: [
              { id: 'v-1901', name: 'चांदोद तीर्थ (कर्णाली)', tehsilId: 'gj-vad-dabhoi', isActive: true },
              { id: 'v-1902', name: 'कुबेर भंडारी तीर्थ', tehsilId: 'gj-vad-dabhoi', isActive: true },
            ],
          },
          {
            id: 'gj-vad-shinore',
            name: 'शिणोर (Shinore)',
            districtId: 'gj-vadodara',
            isActive: true,
            villages: [
              { id: 'v-1903', name: 'शिणोर नर्मदा तट', tehsilId: 'gj-vad-shinore', isActive: true },
              { id: 'v-1904', name: 'अनसूया माता धाम', tehsilId: 'gj-vad-shinore', isActive: true },
            ],
          },
          {
            id: 'gj-vad-karjan',
            name: 'करजन (Karjan)',
            districtId: 'gj-vadodara',
            isActive: true,
            villages: [
              { id: 'v-1905', name: 'करजन कछार', tehsilId: 'gj-vad-karjan', isActive: true },
            ],
          },
        ],
        ghats: [
          { id: 'g-gvd-01', name: 'चांदोद संगम घाट (Chandod - दक्षिण प्रयाग नर्मदा-ओरसंग संगम)', districtId: 'gj-vadodara', tehsilId: 'gj-vad-dabhoi', locality: 'चांदोद', isRiverside: true },
          { id: 'g-gvd-02', name: 'कर्णाली कुबेर भंडारी घाट (Karnali Kuber Bhandari Ghat)', districtId: 'gj-vadodara', tehsilId: 'gj-vad-dabhoi', locality: 'कर्णाली', isRiverside: true },
          { id: 'g-gvd-03', name: 'शिणोर नर्मदा घाट (Shinore Ghat)', districtId: 'gj-vadodara', locality: 'शिणोर', isRiverside: true },
          { id: 'g-gvd-04', name: 'अनसूया माता घाट (Anasuya Mata Ghat)', districtId: 'gj-vadodara', locality: 'शिणोर', isRiverside: true },
        ],
      },
      {
        id: 'gj-bharuch',
        name: 'भरूच (Bharuch - सागर संगम)',
        stateId: 'gj',
        isActive: true,
        isRiverside: true,
        classification: 'riverside',
        classificationLabel: 'नर्मदा मुख्य प्रवाह तटवर्ती जिला (अरब सागर संगम व कबीरवड)',
        tehsils: [
          {
            id: 'gj-bh-bharuch',
            name: 'भरूच नगर व कबीरवड (Bharuch)',
            districtId: 'gj-bharuch',
            isActive: true,
            villages: [
              { id: 'v-1703', name: 'झाड़ेश्वर घाट परिक्षेत्र', tehsilId: 'gj-bh-bharuch', isActive: true },
              { id: 'v-1704', name: 'शुक्लतीर्थ कबीरवड तट', tehsilId: 'gj-bh-bharuch', isActive: true },
              { id: 'v-1705', name: 'गोल्डन ब्रिज तट', tehsilId: 'gj-bh-bharuch', isActive: true },
            ],
          },
          {
            id: 'gj-bh-ankleshwar',
            name: 'अंकलेश्वर (Ankleshwar)',
            districtId: 'gj-bharuch',
            isActive: true,
            villages: [
              { id: 'v-1701', name: 'अंकलेश्वर नर्मदा तट', tehsilId: 'gj-bh-ankleshwar', isActive: true },
              { id: 'v-1702', name: 'विमलेश्वर समुद्र संगम', tehsilId: 'gj-bh-ankleshwar', isActive: true },
            ],
          },
          {
            id: 'gj-bh-hansot',
            name: 'हांसोट (Hansot - सागर संगम)',
            districtId: 'gj-bharuch',
            isActive: true,
            villages: [
              { id: 'v-1706', name: 'अरब सागर नर्मदा मुहाना', tehsilId: 'gj-bh-hansot', isActive: true },
            ],
          },
        ],
        ghats: [
          { id: 'g-gbh-01', name: 'शुक्लतीर्थ घाट (Shuklatirth Ghat - अति प्राचीन कबीरवड तट)', districtId: 'gj-bharuch', tehsilId: 'gj-bh-bharuch', locality: 'शुक्लतीर्थ', isRiverside: true },
          { id: 'g-gbh-02', name: 'झाड़ेश्वर घाट भरूच (Zadeshwar Ghat)', districtId: 'gj-bharuch', tehsilId: 'gj-bh-bharuch', locality: 'झाड़ेश्वर', isRiverside: true },
          { id: 'g-gbh-03', name: 'अंकलेश्वर नर्मदा घाट (Ankleshwar Ghat)', districtId: 'gj-bharuch', tehsilId: 'gj-bh-ankleshwar', locality: 'अंकलेश्वर', isRiverside: true },
          { id: 'g-gbh-04', name: 'गोल्डन ब्रिज तट भरूच (Golden Bridge Bank)', districtId: 'gj-bharuch', locality: 'भरूच', isRiverside: true },
          { id: 'g-gbh-05', name: 'विमलेश्वर संगम घाट (Vimleshwar - नर्मदा-अरब सागर संगम)', districtId: 'gj-bharuch', locality: 'विमलेश्वर', isRiverside: true },
          { id: 'g-gbh-06', name: 'कबीरवड घाट (Kabirvad Island Ghat)', districtId: 'gj-bharuch', locality: 'कबीरवड', isRiverside: true },
        ],
      },
      {
        id: 'gj-chhotaudaipur',
        name: 'छोटा उदेपुर (Chhota Udaipur)',
        stateId: 'gj',
        isActive: true,
        isRiverside: true,
        classification: 'riverside',
        classificationLabel: 'नर्मदा मुख्य प्रवाह तटवर्ती जिला (कवंत बैकवाटर तट)',
        tehsils: [
          {
            id: 'gj-chu-kavant',
            name: 'कवंत (Kavant)',
            districtId: 'gj-chhotaudaipur',
            isActive: true,
            villages: [
              { id: 'v-2901', name: 'हंफेश्वर तीर्थ नर्मदा तट', tehsilId: 'gj-chu-kavant', isActive: true },
            ],
          },
        ],
        ghats: [
          { id: 'g-gcu-01', name: 'हंफेश्वर महादेव नर्मदा तट (Hampheshwar Ghat)', districtId: 'gj-chhotaudaipur', locality: 'कवंत', isRiverside: true },
        ],
      },
    ],
  },
  {
    id: 'mh',
    name: 'महाराष्ट्र (Maharashtra)',
    country: 'भारत (India)',
    isActive: true,
    districts: [
      /* ================= MAHARASHTRA RIVERSIDE DISTRICT ================= */
      {
        id: 'mh-nandurbar',
        name: 'नंदुरबार (Nandurbar - नर्मदा अंतर्राज्यीय सीमा)',
        stateId: 'mh',
        isActive: true,
        isRiverside: true,
        classification: 'riverside',
        classificationLabel: 'नर्मदा मुख्य प्रवाह तटवर्ती जिला (महाराष्ट्र-मप्र अंतर्राज्यीय सीमा)',
        tehsils: [
          {
            id: 'mh-ndb-dhadgaon',
            name: 'धड़गांव / अक्राणी (Dhadgaon / Akrani)',
            districtId: 'mh-nandurbar',
            isActive: true,
            villages: [
              { id: 'v-2001', name: 'मणीबेली नर्मदा सीमावर्ती ग्राम', tehsilId: 'mh-ndb-dhadgaon', isActive: true },
              { id: 'v-2002', name: 'चिचखेड़ी तट', tehsilId: 'mh-ndb-dhadgaon', isActive: true },
            ],
          },
          {
            id: 'mh-ndb-molgi',
            name: 'मोलगी (Molgi)',
            districtId: 'mh-nandurbar',
            isActive: true,
            villages: [
              { id: 'v-2003', name: 'मोलगी नर्मदा बैकवाटर तट', tehsilId: 'mh-ndb-molgi', isActive: true },
            ],
          },
          {
            id: 'mh-ndb-shahada',
            name: 'शहादा / प्रकाशा (Shahada / Prakasha)',
            districtId: 'mh-nandurbar',
            isActive: true,
            villages: [
              { id: 'v-2004', name: 'प्रकाशा दक्षिण काशी तीर्थ', tehsilId: 'mh-ndb-shahada', isActive: true },
            ],
          },
        ],
        ghats: [
          { id: 'g-mhn-01', name: 'मणीबेली घाट (Manibeli Ghat - महाराष्ट्र प्रथम नर्मदा तटवर्ती ग्राम)', districtId: 'mh-nandurbar', tehsilId: 'mh-ndb-dhadgaon', locality: 'मणीबेली', isRiverside: true },
          { id: 'g-mhn-02', name: 'प्रकाशा तीर्थ संगम घाट (Prakasha Dakshin Kashi)', districtId: 'mh-nandurbar', locality: 'प्रकाशा', isRiverside: true },
          { id: 'g-mhn-03', name: 'मोलगी नर्मदा सीमा तट (Molgi Ghat)', districtId: 'mh-nandurbar', locality: 'मोलगी', isRiverside: true },
        ],
      },
      {
        id: 'mh-mumbai',
        name: 'मुंबई (Mumbai - पर्यावरण व संपर्क प्रकोष्ठ)',
        stateId: 'mh',
        isActive: true,
        isRiverside: false,
        classification: 'service_area',
        classificationLabel: 'फाउंडेशन प्रादेशिक समन्वय व सहायता केंद्र',
        tehsils: [
          {
            id: 'mh-mum-city',
            name: 'मुंबई नगर व उपनगर',
            districtId: 'mh-mumbai',
            isActive: true,
            villages: [
              { id: 'v-2005', name: 'दादर', tehsilId: 'mh-mum-city', isActive: true },
              { id: 'v-2006', name: 'अंधेरी', tehsilId: 'mh-mum-city', isActive: true },
            ],
          },
        ],
      },
    ],
  },
];

/**
 * Retrieve all verified Ghats for a specific district
 */
export function getGhatsForDistrict(districtId: string): LocationGhat[] {
  for (const state of INITIAL_LOCATION_DATA) {
    const dist = state.districts?.find((d) => d.id === districtId);
    if (dist && dist.ghats) {
      return dist.ghats;
    }
  }
  return [];
}

/**
 * Retrieve classification metadata for a district
 */
export function getDistrictInfo(districtId: string): {
  isRiverside: boolean;
  classification: 'riverside' | 'basin' | 'service_area';
  classificationLabel: string;
} {
  for (const state of INITIAL_LOCATION_DATA) {
    const dist = state.districts?.find((d) => d.id === districtId);
    if (dist) {
      return {
        isRiverside: !!dist.isRiverside,
        classification: dist.classification || 'service_area',
        classificationLabel: dist.classificationLabel || 'नर्मदा सेवा क्षेत्र',
      };
    }
  }
  return {
    isRiverside: false,
    classification: 'service_area',
    classificationLabel: 'नर्मदा सेवा क्षेत्र',
  };
}
