import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDocs,
  deleteDoc
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Demo Collections
const DEMO = {
  PATIENTS: 'demo_patients',
  APPOINTMENTS: 'demo_appointments',
  FOLLOW_UPS: 'demo_followUps',
  PAYMENTS: 'demo_payments',
  MEDICINES: 'demo_medicines',
  TREATMENTS: 'demo_treatments',
};

// 1. Medicines List
const demoMedicines = [
  { id: 'med-01', name: 'Suta Shekhar Ras', category: 'Vati / Rasayana', stock: 45, price: 380, lowStock: false },
  { id: 'med-02', name: 'Avipattikar Churna', category: 'Churna', stock: 60, price: 180, lowStock: false },
  { id: 'med-03', name: 'Kamadugha Ras (Moti Yukta)', category: 'Rasayana', stock: 12, price: 520, lowStock: true },
  { id: 'med-04', name: 'Shankha Bhasma', category: 'Bhasma', stock: 30, price: 140, lowStock: false },
  { id: 'med-05', name: 'Yogaraj Guggulu', category: 'Guggulu', stock: 50, price: 240, lowStock: false },
  { id: 'med-06', name: 'Shallaki 500mg', category: 'Vati', stock: 40, price: 290, lowStock: false },
  { id: 'med-07', name: 'Dashamoolarishta', category: 'Asava / Arishta', stock: 25, price: 210, lowStock: false },
  { id: 'med-08', name: 'Rasnasaptaka Kwath', category: 'Kwath', stock: 18, price: 195, lowStock: false },
  { id: 'med-09', name: 'Trayodashanga Guggulu', category: 'Guggulu', stock: 35, price: 260, lowStock: false },
  { id: 'med-10', name: 'Kaishore Guggulu', category: 'Guggulu', stock: 8, price: 230, lowStock: true },
  { id: 'med-11', name: 'Sahacharadi Taila', category: 'Taila / Oil', stock: 20, price: 310, lowStock: false },
  { id: 'med-12', name: 'Mahamanjisthadi Kwath', category: 'Kwath', stock: 28, price: 240, lowStock: false },
  { id: 'med-13', name: 'Gandhak Rasayana', category: 'Rasayana', stock: 10, price: 215, lowStock: true },
  { id: 'med-14', name: 'Chandraprabha Vati', category: 'Vati', stock: 55, price: 225, lowStock: false },
  { id: 'med-15', name: 'Vasant Kusumakar Ras', category: 'Rasayana', stock: 5, price: 1450, lowStock: true },
  { id: 'med-16', name: 'Kanchanar Guggulu', category: 'Guggulu', stock: 42, price: 250, lowStock: false },
  { id: 'med-17', name: 'Shwasakuthar Ras', category: 'Rasayana', stock: 30, price: 190, lowStock: false },
  { id: 'med-18', name: 'Sitopaladi Churna', category: 'Churna', stock: 65, price: 160, lowStock: false },
  { id: 'med-19', name: 'Shirashooladi Vajra Ras', category: 'Vati', stock: 22, price: 340, lowStock: false },
  { id: 'med-20', name: 'Manasamitra Vatakam', category: 'Vati', stock: 14, price: 680, lowStock: true },
];

// 2. Treatments List
const demoTreatments = [
  { id: 'trt-01', name: 'Vamana Karma', category: 'Panchakarma', duration: '15 Days Course', description: 'Therapeutic emesis procedure for Kapha-predominant disorders like Asthma & Psoriasis.' },
  { id: 'trt-02', name: 'Virechana Karma', category: 'Panchakarma', duration: '12 Days Course', description: 'Pitta purgation therapy for hyperacidity, liver disorders, and skin diseases.' },
  { id: 'trt-03', name: 'Basti Karma (Niruha & Anuvasana)', category: 'Panchakarma', duration: '8 to 16 Days', description: 'Medicated enema course for Vata disorders, Sciatica, and paralysis.' },
  { id: 'trt-04', name: 'Janu Basti', category: 'Kera Treatment', duration: '45 mins (7 Days)', description: 'Localized oil pooling over knee joint for Osteoarthritis (Sandhigata Vata).' },
  { id: 'trt-05', name: 'Kati Basti', category: 'Kera Treatment', duration: '45 mins (7 Days)', description: 'Retention of warm medicated oil on lumbar region for Low Back Pain & Lumbar Spondylosis.' },
  { id: 'trt-06', name: 'Shirodhara', category: 'Kera Treatment', duration: '45 mins (7 Days)', description: 'Continuous pouring of medicated oil/decoction on forehead for Insomnia, Anxiety & Migraine.' },
  { id: 'trt-07', name: 'Takradhara', category: 'Kera Treatment', duration: '45 mins (7 Days)', description: 'Medicated buttermilk dripping over forehead for Amlapitta, Stress, and Hypertension.' },
  { id: 'trt-08', name: 'Jalaukavacharana (Leech Therapy)', category: 'Raktamokshana', duration: '30 mins / session', description: 'Bio-purification using Hirudo medicinalis for non-healing ulcers, Eczema, and Varicose veins.' },
  { id: 'trt-09', name: 'Nasya Karma', category: 'Panchakarma', duration: '7 Days', description: 'Nasal administration of medicated oils for Sinusitis, Cervical Spondylosis & Migraine.' },
  { id: 'trt-10', name: 'Udvartana', category: 'Powder Massage', duration: '45 mins (10 Days)', description: 'Dry herbal powder scrub massage for Obesity (Sthoulya) and Cellulite reduction.' },
  { id: 'trt-11', name: 'Patra Pinda Sweda (Pottali)', category: 'Swedana', duration: '45 mins', description: 'Fomentation with medicinal leaves pottali for joint pain and stiffness.' },
  { id: 'trt-12', name: 'Shashtika Shali Pinda Sweda', category: 'Swedana', duration: '60 mins', description: 'Nourishing rice bolus massage for muscular dystrophy and post-stroke rehabilitation.' },
  { id: 'trt-13', name: 'Agnikarma', category: 'Anusastra', duration: '20 mins', description: 'Thermal cauterization using Shalaka for heel spurs (Kadara), tendinitis, and joint pain.' },
  { id: 'trt-14', name: 'Griva Basti', category: 'Kera Treatment', duration: '45 mins (7 Days)', description: 'Localized medicated oil pooling over cervical spine for Cervical Spondylosis.' },
  { id: 'trt-15', name: 'Uttara Basti', category: 'Special Procedure', duration: '3 Days Post-Menses', description: 'Intra-uterine oil instillation for Infertility, PCOS, and Endometrial thickness.' }
];

// 3. Authentic Patients List (14 Detailed Cases)
const demoPatients = [
  {
    id: 'pat-01',
    name: 'Ramesh Sharma',
    age: 45,
    dob: '1981-04-12',
    address: 'Flat 402, Shivneri Heights, Kothrud, Pune',
    phoneNumber: '+91 98220 14321',
    job: 'IT Project Manager',
    reference: 'Dr. Deshpande (Gastroenterologist)',
    height: '172',
    weight: '78',
    lastVisit: '2026-08-28',
    status: 'Active',
    nadiParikshan: '<p><strong>Nadi Type:</strong> Pitta-Kaphaj Nadi<br /><strong>Gati:</strong> Chala, Teekshna &amp; Ruksha<br /><strong>Vigour:</strong> 78 bpm, High Pitta spandana at Agnya sthana.</p>',
    condition: '<p><strong>Amlapitta &amp; Hrid Daha (Severe Hyperacidity / GERD):</strong> Epigastric burning sensation, sour &amp; bitter eructations (Amla Udgar), retrosternal burning, morning nausea, constipation with bloating.</p>',
    history: '<p>History of irregular meal times, excessive tea/coffee intake (4-5 cups/day), late night work. Symptoms present for 1.5 years. Temporary relief with PPIs.</p>',
    parikshan: '<p><strong>Jivha:</strong> Saam (White Coated)<br /><strong>Agni:</strong> Mandagni / Vishamagni<br /><strong>Ksudha:</strong> Alpa<br /><strong>Mal:</strong> Vibandha (Hard &amp; Irregular Stools)<br /><strong>Nidra:</strong> Disturbed due to acid reflux.</p>',
    treatmentPlan: '<p>1. Suta Shekhar Ras 250mg BD with lukewarm water (Before Meals)<br />2. Avipattikar Churna 5g HS with warm water<br />3. Kamadugha Ras (Moti Yukta) 250mg BD<br />4. Shankha Bhasma 250mg BD after meals<br />5. Pathya Pathya: Avoid fried, spicy, fermented foods; dinner before 8 PM.</p>',
    panchakarmaTherapies: [
      { name: 'Virechana Karma', duration: '12 Days Course', schedule: 'Day 1-5 Snehapana, Day 6-8 Abhyanga, Day 9 Virechana', notes: 'Trivrit Lehya 30g given on 9th day. 18 Vegans achieved (Shuddhi completed).' },
      { name: 'Takradhara', duration: '7 Days (45 Mins)', schedule: 'Daily 9:00 AM', notes: 'Using Musta & Chandanadi Takra for cooling Pitta & mind relaxation.' }
    ],
    extraProcedures: [
      { name: 'Kavala (Oil Pulling)', purpose: 'Oral Health & Mukha Paka Prevention', durationFrequency: 'Daily Morning 10 mins', remarks: 'Using Til Taila + Yashtimadhu' }
    ],
    treatment_days: 30
  },

  {
    id: 'pat-02',
    name: 'Sunita Patil',
    age: 52,
    dob: '1974-09-18',
    address: 'B-12, Laxmi Nivas, Karve Nagar, Pune',
    phoneNumber: '+91 94225 87102',
    job: 'Home Maker',
    reference: 'Self Walk-in',
    height: '158',
    weight: '72',
    lastVisit: '2026-08-30',
    status: 'Under Treatment',
    nadiParikshan: '<p><strong>Nadi Type:</strong> Vata-Pradhana Nadi<br /><strong>Gati:</strong> Mandagati &amp; Ruksha (Karpota Gati)<br /><strong>Vigour:</strong> 72 bpm, Vata spandana prominent in Sandhi sthana.</p>',
    condition: '<p><strong>Sandhigata Vata (Bilateral Knee Osteoarthritis):</strong> Severe bilateral knee joint pain (Janu Shula), crepitus on movement (Sandhi Sphutana), morning stiffness, difficulty climbing stairs.</p>',
    history: '<p>Pain progressing over 3 years. X-Ray shows Grade 3 medial joint space narrowing in both knees with osteophytes.</p>',
    parikshan: '<p><strong>Jivha:</strong> Kinchit Saam<br /><strong>Agni:</strong> Vishamagni<br /><strong>Ksudha:</strong> Madhyama<br /><strong>Mal:</strong> Samyak<br /><strong>Nidra:</strong> Alpa due to nocturnal pain.</p>',
    treatmentPlan: '<p>1. Yogaraj Guggulu 2 tab BD after meals<br />2. Shallaki 500mg BD<br />3. Dashamoolarishta 20ml BD with equal water after meals<br />4. Rasnasaptaka Kwath 20ml BD before meals.</p>',
    panchakarmaTherapies: [
      { name: 'Janu Basti', duration: '7 Days', schedule: 'Daily 10:30 AM', notes: 'Warm Mahanarayana Taila retention for 30 mins over both knee joints.' },
      { name: 'Patra Pinda Sweda', duration: '7 Days', schedule: 'Post Janu Basti', notes: 'Fomentation with Nirgundi & Eranda leaves pottali.' }
    ],
    extraProcedures: [
      { name: 'Agnikarma', purpose: 'Pain Management on Tender Points', durationFrequency: '1 Session completed', remarks: 'Punch-type Agnikarma done with Panchadhatu Shalaka on medial joint line.' }
    ],
    treatment_days: 45
  },

  {
    id: 'pat-03',
    name: 'Rajesh Kumar',
    age: 38,
    dob: '1988-02-05',
    address: 'House 89, Clover Park, Viman Nagar, Pune',
    phoneNumber: '+91 97640 22910',
    job: 'Civil Engineer',
    reference: 'Dr. Mehta (Orthopedic)',
    height: '178',
    weight: '84',
    lastVisit: '2026-09-01',
    status: 'Under Treatment',
    nadiParikshan: '<p><strong>Nadi Type:</strong> Vata-Kaphaj Nadi<br /><strong>Gati:</strong> Stambhit &amp; Kathin<br /><strong>Vigour:</strong> 76 bpm, Marked Vata aggravation in Kati pradesh.</p>',
    condition: '<p><strong>Gridhrasi (Sciatica / Lumbar Disc Herniation L4-L5):</strong> Sharp radiating pain from lumbar spine down left buttock, thigh, and calf to big toe (Gridhrasi Shula), tingling suptata, inability to sit &gt; 15 mins.</p>',
    history: '<p>Lifting heavy weight at construction site 2 months ago triggered acute onset. MRI shows L4-L5 disc protrusion compressing left L5 nerve root.</p>',
    parikshan: '<p><strong>Jivha:</strong> Saam<br /><strong>Agni:</strong> Mandagni<br /><strong>Ksudha:</strong> Alpa<br /><strong>Mal:</strong> Vibandha (Severe constipation)<br /><strong>SLR Test:</strong> Left leg positive at 35 degrees.</p>',
    treatmentPlan: '<p>1. Trayodashanga Guggulu 2 tab BD<br />2. Sahacharadi Kwath 20ml BD with lukewarm water<br />3. Gandharvahastadi Eranda Taila 15ml at bedtime with warm milk<br />4. Kaishore Guggulu 2 tab BD.</p>',
    panchakarmaTherapies: [
      { name: 'Kati Basti', duration: '7 Days (45 Mins)', schedule: 'Daily 11:00 AM', notes: 'Using Ksheerabala 101 Taila & Sahacharadi Taila mix.' },
      { name: 'Matra Basti', duration: '8 Days Course', schedule: 'Post-lunch daily', notes: 'Sahacharadi Taila 60ml administered via rectal route.' }
    ],
    extraProcedures: [
      { name: 'Siravyadha (Raktamokshana)', purpose: 'Relieving Nerve Compression & Local Stasis', durationFrequency: '1 Session', remarks: '40ml blood let out from left Janu Poshita Vira (popliteal vein area).' }
    ],
    treatment_days: 60
  },

  {
    id: 'pat-04',
    name: 'Meena Deshmukh',
    age: 29,
    dob: '1997-11-23',
    address: 'B-304, Green Acres, Baner, Pune',
    phoneNumber: '+91 91580 33451',
    job: 'Software Engineer',
    reference: 'Self Walk-in',
    height: '162',
    weight: '58',
    lastVisit: '2026-08-25',
    status: 'Under Treatment',
    nadiParikshan: '<p><strong>Nadi Type:</strong> Pitta-Kapha Pradhana Nadi<br /><strong>Gati:</strong> Druta &amp; Ruksha<br /><strong>Vigour:</strong> 82 bpm, Raktavaha Srotas Dushti evident.</p>',
    condition: '<p><strong>Vicharchika / Tvak Vikara (Eczema / Psoriasis Vulgaris):</strong> Erythematous dry scaly lesions over scalp, bilateral elbows, and shin area; severe nocturnal itching (Kandu), silver scales (Kiti), bleeding on scratch.</p>',
    history: '<p>Problem started 2 years back after severe psychological stress. Flare-ups every winter and monsoon.</p>',
    parikshan: '<p><strong>Jivha:</strong> Saam<br /><strong>Agni:</strong> Mandagni<br /><strong>Ksudha:</strong> Normal<br /><strong>Twak Parikshan:</strong> Dry, lichenified plaques with Auspitz sign positive.</p>',
    treatmentPlan: '<p>1. Mahamanjisthadi Kwath 20ml BD with equal water<br />2. Kaishore Guggulu 2 tab BD<br />3. Gandhak Rasayana 2 tab BD<br />4. Neem Ghanvati 2 tab BD<br />5. Local Application: Wrightia tinctoria (777) Oil + Nimbadi Lepa.</p>',
    panchakarmaTherapies: [
      { name: 'Jalaukavacharana (Leech Therapy)', duration: '4 Sessions (Weekly once)', schedule: 'Saturdays', notes: '4 Jalaukas applied over left elbow plaques. Marked reduction in itching post 2nd session.' }
    ],
    extraProcedures: [
      { name: 'Mukha & Sharira Lepana', purpose: 'Kandu Prashamana & Twak Prasadana', durationFrequency: 'Bi-weekly', remarks: 'Using Khadiradi & Nimbadi Churna with Takra.' }
    ],
    treatment_days: 90
  },

  {
    id: 'pat-05',
    name: 'Vikramaditya Joshi',
    age: 50,
    dob: '1976-06-14',
    address: '12, Prabhat Road, Lane 4, Erandwane, Pune',
    phoneNumber: '+91 98901 77623',
    job: 'Business Consultant',
    reference: 'Dr. Shah (Diabetologist)',
    height: '170',
    weight: '94',
    lastVisit: '2026-08-29',
    status: 'Under Treatment',
    nadiParikshan: '<p><strong>Nadi Type:</strong> Kapha-Vata Nadi<br /><strong>Gati:</strong> Sthula, Manda &amp; Gambhira<br /><strong>Vigour:</strong> 70 bpm, Medo-Vaha &amp; Mutra-vaha srotas dushti.</p>',
    condition: '<p><strong>Sthoulya &amp; Prameha (Obesity BMI 32.5 &amp; Type-2 Diabetes Mellitus):</strong> Excessive weight, HbA1c 8.2%, polyuria (Prabhuta Mutrata), nocturnal micturition (3-4 times), general lethargy (Alasya), dry mouth.</p>',
    history: '<p>Sedentary lifestyle, high carbohydrate diet. Known diabetic for 5 years on Metformin 1000mg BD.</p>',
    parikshan: '<p><strong>Jivha:</strong> Atisaam (Heavy white coating)<br /><strong>Agni:</strong> Mandagni / Dhatvagni Mandya<br /><strong>Ksudha:</strong> Atiksudha (Frequent craving)<br /><strong>Mal:</strong> Vibandha.</p>',
    treatmentPlan: '<p>1. Chandraprabha Vati 2 tab BD<br />2. Vasant Kusumakar Ras 1 tab OD morning empty stomach<br />3. Triphala Guggulu 2 tab BD<br />4. Gudmar Churna 3g BD 15 mins before meals.</p>',
    panchakarmaTherapies: [
      { name: 'Udvartana (Dry Herbal Scrub)', duration: '10 Days Course', schedule: 'Daily 8:30 AM', notes: 'Using Kolakulathadi & Triphala Churna. Weight dropped by 2.4 kg during 10-day course.' },
      { name: 'Lekhana Basti', duration: '8 Days Course', schedule: 'Alternate Days', notes: 'Triphala Kwath + Madhu + Saindhava + Gomutra Basti.' }
    ],
    extraProcedures: [
      { name: 'Yogasanas & Pranayama Guidance', purpose: 'Medoroga & Prameha Management', durationFrequency: 'Daily 45 mins', remarks: 'Kapalabhati, Paschimottanasana, Mandukasana.' }
    ],
    treatment_days: 120
  },

  {
    id: 'pat-06',
    name: 'Priya Kulkarni',
    age: 29,
    dob: '1997-03-08',
    address: 'Flat 101, Sunshine Park, Aundh, Pune',
    phoneNumber: '+91 98233 45678',
    job: 'UI/UX Designer',
    reference: 'Dr. Swati (Gynecologist)',
    height: '160',
    weight: '68',
    lastVisit: '2026-08-27',
    status: 'Active',
    nadiParikshan: '<p><strong>Nadi Type:</strong> Kapha-Vata Pradhana Nadi<br /><strong>Gati:</strong> Granthita &amp; Manda<br /><strong>Vigour:</strong> 74 bpm, Artava Vaha Srotas Obstruction.</p>',
    condition: '<p><strong>Anartava / PCOS (Polycystic Ovarian Syndrome):</strong> Oligomenorrhea (menses delayed by 60-90 days), painful menses (Kashtartava), facial acne, mild hirsutism, weight gain around abdomen.</p>',
    history: '<p>USG pelvis shows bilateral polycystic ovaries (multiple peripheral follicles &gt; 12 in each ovary). Trying for conception past 1 year.</p>',
    parikshan: '<p><strong>Jivha:</strong> Saam<br /><strong>Agni:</strong> Mandagni<br /><strong>Ksudha:</strong> Madhyama<br /><strong>Artava:</strong> Alpa &amp; Krishna-Varna.</p>',
    treatmentPlan: '<p>1. Kanchanar Guggulu 2 tab BD after meals<br />2. Rajahpravartini Vati 2 tab BD (Start 7 days before expected date)<br />3. Kumaryasava 20ml BD with equal water<br />4. Shatavari Churna 3g BD with warm milk.</p>',
    panchakarmaTherapies: [
      { name: 'Uttara Basti', duration: '3 Days', schedule: 'Post-menstrual day 6, 7, 8', notes: '5ml Phala Ghrita intrauterine instillation under strict aseptic precautions.' },
      { name: 'Vamana Karma', duration: '15 Days Course', schedule: 'Completed last month', notes: 'Kutumja & Madanaphala Yoga given. Good Kapha Vilayana achieved.' }
    ],
    extraProcedures: [
      { name: 'Dashamoola Yoni Dhavana', purpose: 'Local Cleansing & Srotoshodhana', durationFrequency: '5 Days Course', remarks: 'Done with warm Dashamoola Kwath.' }
    ],
    treatment_days: 90
  },

  {
    id: 'pat-07',
    name: 'Anil Rao',
    age: 58,
    dob: '1968-12-01',
    address: 'B-7, Sahakar Nagar Part 2, Pune',
    phoneNumber: '+91 94220 56789',
    job: 'Retired Bank Manager',
    reference: 'Self Walk-in',
    height: '168',
    weight: '64',
    lastVisit: '2026-08-31',
    status: 'Under Treatment',
    nadiParikshan: '<p><strong>Nadi Type:</strong> Vata-Kapha Nadi<br /><strong>Gati:</strong> Veegavati &amp; Shwasa-anugati<br /><strong>Vigour:</strong> 86 bpm, Pranavaha Srotas Dushti.</p>',
    condition: '<p><strong>Tamaka Shwasa (Bronchial Asthma / Chronic Obstructive Airway):</strong> Severe bouts of breathless cough (Shwasa Krichrata), wheezing sound (Ghurghurakam), orthopnea (worse lying flat), chest tightness during early morning.</p>',
    history: '<p>History of chronic seasonal allergy for 10 years. Inhaler dependent (Salbutamol + Budesonide).</p>',
    parikshan: '<p><strong>Jivha:</strong> Saam<br /><strong>Agni:</strong> Mandagni<br /><strong>Ksudha:</strong> Alpa<br /><strong>Uras:</strong> Bilateral rhonchi &amp; wheeze present on auscultation.</p>',
    treatmentPlan: '<p>1. Shwasakuthar Ras 1 tab BD with Honey<br />2. Sitopaladi Churna 3g + Abhraka Bhasma 125mg BD with Honey<br />3. Talisadi Churna 3g BD after meals<br />4. Kanakasava 15ml BD with equal warm water.</p>',
    panchakarmaTherapies: [
      { name: 'Vamana Karma', duration: 'Completed 3 weeks back', schedule: 'Early Morning', notes: 'Snehapana done with Kantakari Ghrita for 5 days followed by Madanaphala Vamana.' }
    ],
    extraProcedures: [
      { name: 'Uro Basti & Nadi Sweda', purpose: 'Chest Liquefaction of Mucus', durationFrequency: '7 Days Course', remarks: 'Til Taila + Saindhava Swedana on chest.' }
    ],
    treatment_days: 60
  },

  {
    id: 'pat-08',
    name: 'Kavita Verma',
    age: 42,
    dob: '1984-07-29',
    address: 'Flat 502, Orchid Towers, Wakad, Pune',
    phoneNumber: '+91 98902 34112',
    job: 'HR Director',
    reference: 'Dr. Joshi (Neurologist)',
    height: '165',
    weight: '62',
    lastVisit: '2026-08-26',
    status: 'Recovered',
    nadiParikshan: '<p><strong>Nadi Type:</strong> Pitta-Vata Nadi<br /><strong>Gati:</strong> Teekshna &amp; Spandana in Temporal Region<br /><strong>Vigour:</strong> 80 bpm, Shirah Pradesh Pitta Vriddhi.</p>',
    condition: '<p><strong>Ardhavabhedaka / Shirashula (Migraine Headache):</strong> Severe unilateral throbbing headache (right side), nausea, vomiting, photophobia and phonophobia. Bouts last 6-12 hours, triggered by sunlight &amp; skipped meals.</p>',
    history: '<p>Sufferer for 6 years. Taking Triptans for acute episodes.</p>',
    parikshan: '<p><strong>Jivha:</strong> Nirama<br /><strong>Agni:</strong> Vishamagni<br /><strong>Ksudha:</strong> Variable<br /><strong>Nidra:</strong> Severely disturbed during attacks.</p>',
    treatmentPlan: '<p>1. Shirashooladi Vajra Ras 1 tab BD<br />2. Pathyadi Kwath 20ml BD with equal water<br />3. Brahmi Vati 1 tab HS with milk<br />4. Godanti Bhasma 250mg BD with Cow Ghee.</p>',
    panchakarmaTherapies: [
      { name: 'Shirodhara', duration: '7 Days Course', schedule: 'Daily 4:00 PM', notes: 'Ksheerabala Taila + Chandanadi Taila Shirodhara 45 mins. Frequency of migraine attacks dropped to zero.' },
      { name: 'Nasya Karma', duration: '7 Days', schedule: 'Morning 8:00 AM', notes: 'Anu Taila 6 drops in each nostril.' }
    ],
    extraProcedures: [
      { name: 'Shiroabhyanga', purpose: 'Head Relaxation', durationFrequency: 'Daily Night', remarks: 'Brahmi Taila gentle scalp massage.' }
    ],
    treatment_days: 30
  },

  {
    id: 'pat-09',
    name: 'Suresh Nair',
    age: 62,
    dob: '1964-01-15',
    address: 'Plot 45, Kalyani Nagar, Pune',
    phoneNumber: '+91 94230 89123',
    job: 'Retired Professor',
    reference: 'Dr. Kulkarni (Neuro-rehab)',
    height: '175',
    weight: '70',
    lastVisit: '2026-09-02',
    status: 'Under Treatment',
    nadiParikshan: '<p><strong>Nadi Type:</strong> Vata Pradhana Nadi<br /><strong>Gati:</strong> Kshama &amp; Mandagati<br /><strong>Vigour:</strong> 68 bpm, Majjavaha &amp; Vatavaha srotas dushti.</p>',
    condition: '<p><strong>Pakshaghata (Right Side Hemiplegia / Post-Ischemic Stroke):</strong> Weakness in right upper &amp; lower limbs (Karakshaya &amp; Padakshaya), motor grade 3/5, slurred speech (Vak Stambha), facial asymmetry.</p>',
    history: '<p>Left MCA Ischemic Stroke 4 months back. Hypertension controlled on Amlodipine 5mg.</p>',
    parikshan: '<p><strong>Jivha:</strong> Nirama<br /><strong>Agni:</strong> Madhyama<br /><strong>Reflexes:</strong> Hyperreflexia on right side with Babinski positive.</p>',
    treatmentPlan: '<p>1. Ekangveer Ras 1 tab BD with lukewarm water<br />2. Sameerapannag Ras 125mg BD with Honey<br />3. Ashwagandharishta 20ml BD after meals<br />4. Maharasnadi Kwath 20ml BD.</p>',
    panchakarmaTherapies: [
      { name: 'Shashtika Shali Pinda Sweda (SSPS)', duration: '14 Days Course', schedule: 'Daily 10:00 AM', notes: 'Rice cooked in Balamoola Kwath & Milk massage over right limbs. Limb strength improved from Grade 3 to Grade 4-.' },
      { name: 'Yapana Basti', duration: '15 Days Course', schedule: 'Alternate Days', notes: 'Mustadi Yapana Basti course for neuro-regeneration.' }
    ],
    extraProcedures: [
      { name: 'Nasya (Ksheerabala 101)', purpose: 'Urdhva Jatrugata Vata Prashamana', durationFrequency: '7 Days Course', remarks: '8 drops each nostril.' }
    ],
    treatment_days: 90
  },

  {
    id: 'pat-10',
    name: 'Aarti Chavan',
    age: 31,
    dob: '1995-10-04',
    address: 'Flat 203, Rosewood Society, Hadapsar, Pune',
    phoneNumber: '+91 97655 43210',
    job: 'Primary School Teacher',
    reference: 'Self Walk-in',
    height: '155',
    weight: '52',
    lastVisit: '2026-08-24',
    status: 'Active',
    nadiParikshan: '<p><strong>Nadi Type:</strong> Pitta-Kapha Nadi<br /><strong>Gati:</strong> Chala &amp; Asamartha<br /><strong>Vigour:</strong> 76 bpm, Purishavaha Srotas Dushti.</p>',
    condition: '<p><strong>Grahani Roga (Irritable Bowel Syndrome / IBS-Diarrhea type):</strong> Alternating episodes of loose watery stools (4-5 times/day) and constipation, abdominal cramps prior to defecation (Muhur Baddha Muhur Drava), mucus in stool, weight loss.</p>',
    history: '<p>Onset 1 year ago following acute gastroenteritis. Worsened by anxiety &amp; dairy products.</p>',
    parikshan: '<p><strong>Jivha:</strong> Saam (Coated)<br /><strong>Agni:</strong> Severe Mandagni<br /><strong>Ksudha:</strong> Alpa<br /><strong>Mal:</strong> Purisha with Ama &amp; Shleshma.</p>',
    treatmentPlan: '<p>1. Kutajarishta 20ml BD with equal warm water after meals<br />2. Bilwadi Churna 3g BD with Fresh Takra (Buttermilk + Bhuna Jeera)<br />3. Shankh Vati 2 tab BD before meals<br />4. Mustakarishta 20ml BD.</p>',
    panchakarmaTherapies: [
      { name: 'Takra Basti', duration: '7 Days Course', schedule: 'Daily 11:30 AM', notes: 'Fresh buttermilk processed with Musta & Kutaja root. Mucus in stool stopped completely post 4th day.' }
    ],
    extraProcedures: [
      { name: 'Pichu Application', purpose: 'Local Healing', durationFrequency: 'As required', remarks: 'Jatyadi Taila Matra.' }
    ],
    treatment_days: 45
  },

  {
    id: 'pat-11',
    name: 'Ganesh Thorat',
    age: 40,
    dob: '1986-05-20',
    address: 'S.No. 44, Dhayari Phata, Sinhagad Road, Pune',
    phoneNumber: '+91 98224 11987',
    job: 'Tax Consultant',
    reference: 'Self Walk-in',
    height: '174',
    weight: '80',
    lastVisit: '2026-08-30',
    status: 'Under Treatment',
    nadiParikshan: '<p><strong>Nadi Type:</strong> Vata-Pitta Nadi<br /><strong>Gati:</strong> Chanchala, Druta &amp; Ruksha<br /><strong>Vigour:</strong> 84 bpm, Manovaha Srotas Dushti.</p>',
    condition: '<p><strong>Anidra &amp; Chittodvega (Insomnia &amp; Generalized Anxiety):</strong> Inability to fall asleep till 3-4 AM (Anidra), racing thoughts, restlessness (Chittodvega), daytime exhaustion, muscular tension in neck &amp; shoulders.</p>',
    history: '<p>High workload stress during tax season. Using Zolpidem sleeping pills on &amp; off.</p>',
    parikshan: '<p><strong>Jivha:</strong> Nirama<br /><strong>Agni:</strong> Vishamagni<br /><strong>Nidra:</strong> &lt; 3 hours per night.</p>',
    treatmentPlan: '<p>1. Manasamitra Vatakam 2 tab HS with warm Cow Milk<br />2. Tagara 500mg HS<br />3. Saraswatarishta 20ml BD after food<br />4. Jatamansi Churna 3g HS.</p>',
    panchakarmaTherapies: [
      { name: 'Shirodhara', duration: '7 Days Course', schedule: 'Daily 5:00 PM', notes: 'Jatamansi & Brahmi Kwath + Ksheerabala Taila. Patient achieved 6.5 hours of continuous natural sleep.' }
    ],
    extraProcedures: [
      { name: 'Padabhyanga', purpose: 'Nidra Janana & Vata Shamana', durationFrequency: 'Daily Bedtime', remarks: 'Foot massage with Kansa Vataki using Eranda Taila.' }
    ],
    treatment_days: 30
  },

  {
    id: 'pat-12',
    name: 'Nisha Gupta',
    age: 26,
    dob: '2000-08-14',
    address: 'B-102, Marvel Bounty, Magarpatta City, Pune',
    phoneNumber: '+91 91456 78901',
    job: 'Marketing Specialist',
    reference: 'Self Walk-in',
    height: '164',
    weight: '55',
    lastVisit: '2026-08-22',
    status: 'Recovered',
    nadiParikshan: '<p><strong>Nadi Type:</strong> Pitta-Rakta Pradhana Nadi<br /><strong>Gati:</strong> Teekshna &amp; Ushna<br /><strong>Vigour:</strong> 78 bpm, Raktavaha Srotas Dushti.</p>',
    condition: '<p><strong>Yauvanapidaka (Acne Vulgaris - Grade 3 Papulopustular Acne):</strong> Multiple painful inflammatory papules &amp; pustules over cheek, forehead &amp; chin; facial oiliness, post-acne hyperpigmentation (Mukha Kalaka).</p>',
    history: '<p>Exacerbation before menstrual cycles. History of consuming junk &amp; bakery products.</p>',
    parikshan: '<p><strong>Jivha:</strong> Kinchit Saam<br /><strong>Agni:</strong> Teekshnagm / Vishamagni<br /><strong>Skin Type:</strong> Snigdha &amp; Pidaka Yukta.</p>',
    treatmentPlan: '<p>1. Kaishore Guggulu 2 tab BD after meals<br />2. Sarivadyasava 20ml BD with equal water<br />3. Chandanasava 20ml BD<br />4. Topical: Lodhradi Lepa (Lodhra + Vacha + Dhanyaka) mixed with Rose water applied on face 20 mins daily.</p>',
    panchakarmaTherapies: [
      { name: 'Jalaukavacharana', duration: '2 Sessions (10 days gap)', schedule: 'Completed', notes: '2 Jalaukas applied over inflammatory lesions on cheeks. 80% reduction in redness and swelling.' }
    ],
    extraProcedures: [
      { name: 'Mukha Abhyanga & Swedana', purpose: 'Srotocleansing & Glow Enhancement', durationFrequency: 'Weekly once', remarks: 'Kumkumadi Taila face massage.' }
    ],
    treatment_days: 45
  },

  {
    id: 'pat-13',
    name: 'Vijay Gokhale',
    age: 55,
    dob: '1971-02-28',
    address: 'House 14, Ideal Colony, Paud Road, Kothrud, Pune',
    phoneNumber: '+91 94223 10982',
    job: 'Senior Accountant',
    reference: 'Dr. Joshi (Orthopedic Surgeon)',
    height: '171',
    weight: '76',
    lastVisit: '2026-08-28',
    status: 'Under Treatment',
    nadiParikshan: '<p><strong>Nadi Type:</strong> Vata-Pradhana Nadi<br /><strong>Gati:</strong> Stambhita &amp; Ruksha<br /><strong>Vigour:</strong> 72 bpm, Amsa Sandhi Vata Dushti.</p>',
    condition: '<p><strong>Avabahuka (Frozen Shoulder / Adhesive Capsulitis):</strong> Severe pain in right shoulder joint (Amsasandhi Shula), restricted abduction (&lt; 45 degrees) &amp; external rotation (Bahu Chesta Apaharana), inability to comb hair or reach back pocket.</p>',
    history: '<p>Duration 5 months following minor slip. Non-diabetic.</p>',
    parikshan: '<p><strong>Jivha:</strong> Nirama<br /><strong>Agni:</strong> Madhyama<br /><strong>Amsa Sandhi:</strong> Marked tenderness &amp; stiffness.</p>',
    treatmentPlan: '<p>1. Maharasnadi Kwath 20ml BD<br />2. Yogaraj Guggulu 2 tab BD<br />3. Rasona Vati 2 tab BD<br />4. Brihat Vatchintamani Ras 1 tab OD with Honey.</p>',
    panchakarmaTherapies: [
      { name: 'Griva & Amsa Basti', duration: '7 Days Course', schedule: 'Daily 11:00 AM', notes: 'Ksheerabala 101 Taila pooling over right shoulder joint. Abduction range improved to 110 degrees.' },
      { name: 'Patra Pinda Sweda', duration: '7 Days', schedule: 'Post Basti', notes: 'Hot Pottali Swedana over shoulder & neck.' }
    ],
    extraProcedures: [
      { name: 'Agnikarma', purpose: 'Instant Pain Relief', durationFrequency: '1 Session', remarks: 'Done over supraspinatus tendon insertion point.' }
    ],
    treatment_days: 45
  },

  {
    id: 'pat-14',
    name: 'Deepali Shinde',
    age: 36,
    dob: '1990-04-19',
    address: 'Flat 401, Suncity, Sinhagad Road, Pune',
    phoneNumber: '+91 98229 87654',
    job: 'Store Manager (Standing job)',
    reference: 'Self Walk-in',
    height: '158',
    weight: '67',
    lastVisit: '2026-08-31',
    status: 'Active',
    nadiParikshan: '<p><strong>Nadi Type:</strong> Vata-Kapha Nadi<br /><strong>Gati:</strong> Hard &amp; Piercing pulse at Padatala<br /><strong>Vigour:</strong> 76 bpm, Snayu &amp; Asthi Vata Dushti.</p>',
    condition: '<p><strong>Parshnishula &amp; Kadara (Plantar Fasciitis / Calcaneal Spur / Heel Corn):</strong> Excruciating pain in right heel upon taking first steps in the morning (Parshnishula), localized tenderness under right calcaneus, thickened skin (Kadara).</p>',
    history: '<p>Standing job for 8 hours daily. Pain persisting for 8 months.</p>',
    parikshan: '<p><strong>Jivha:</strong> Nirama<br /><strong>Agni:</strong> Madhyama<br /><strong>Right Heel:</strong> Tenderness over medial calcaneal tubercle. X-ray shows 4mm calcaneal spur.</p>',
    treatmentPlan: '<p>1. Punarnavadi Guggulu 2 tab BD<br />2. Dashamoolarishta 20ml BD<br />3. Rasnasaptaka Kwath 20ml BD<br />4. Local application: Eranda Taila + Saindhava warm fomentation.</p>',
    panchakarmaTherapies: [
      { name: 'Ishtika Sweda (Brick Fomentation)', duration: '7 Days Course', schedule: 'Daily Evening', notes: 'Heated brick quenched in Kanji (fermented gruel) and Eranda leaves for foot fomentation.' }
    ],
    extraProcedures: [
      { name: 'Agnikarma (Thermal Cautery)', purpose: 'Calcaneal Spur Pain Relief', durationFrequency: '1 Session done', remarks: 'Bindu-type Agnikarma performed over maximum tenderness point. 90% morning pain relief reported.' }
    ],
    treatment_days: 30
  }
];

// 4. Appointments Data (14 items corresponding to patients)
const demoAppointments = [
  { id: 'app-01', patientId: 'pat-01', patientName: 'Ramesh Sharma', date: '2026-09-02', time: '10:00 AM', type: 'Consultation', duration: '30 mins', status: 'Scheduled' },
  { id: 'app-02', patientId: 'pat-02', patientName: 'Sunita Patil', date: '2026-09-02', time: '10:30 AM', type: 'Janu Basti Session', duration: '45 mins', status: 'Scheduled' },
  { id: 'app-03', patientId: 'pat-03', patientName: 'Rajesh Kumar', date: '2026-09-02', time: '11:15 AM', type: 'Kati Basti Therapy', duration: '45 mins', status: 'Scheduled' },
  { id: 'app-04', patientId: 'pat-04', patientName: 'Meena Deshmukh', date: '2026-09-02', time: '12:00 PM', type: 'Jalaukavacharana', duration: '40 mins', status: 'Scheduled' },
  { id: 'app-05', patientId: 'pat-05', patientName: 'Vikramaditya Joshi', date: '2026-09-02', time: '04:00 PM', type: 'Udvartana Review', duration: '30 mins', status: 'Scheduled' },
  { id: 'app-06', patientId: 'pat-06', patientName: 'Priya Kulkarni', date: '2026-09-03', time: '09:30 AM', type: 'Uttara Basti Follow-up', duration: '30 mins', status: 'Scheduled' },
  { id: 'app-07', patientId: 'pat-07', patientName: 'Anil Rao', date: '2026-09-03', time: '10:30 AM', type: 'Nadi Sweda & Checkup', duration: '30 mins', status: 'Scheduled' },
  { id: 'app-08', patientId: 'pat-08', patientName: 'Kavita Verma', date: '2026-09-03', time: '04:30 PM', type: 'Shirodhara Review', duration: '45 mins', status: 'Completed' },
  { id: 'app-09', patientId: 'pat-09', patientName: 'Suresh Nair', date: '2026-09-04', time: '10:00 AM', type: 'SSPS Therapy', duration: '60 mins', status: 'Scheduled' },
  { id: 'app-10', patientId: 'pat-10', patientName: 'Aarti Chavan', date: '2026-09-04', time: '11:30 AM', type: 'Takra Basti Review', duration: '30 mins', status: 'Scheduled' },
  { id: 'app-11', patientId: 'pat-11', patientName: 'Ganesh Thorat', date: '2026-09-05', time: '05:00 PM', type: 'Shirodhara Session', duration: '45 mins', status: 'Scheduled' },
  { id: 'app-12', patientId: 'pat-12', patientName: 'Nisha Gupta', date: '2026-09-05', time: '06:00 PM', type: 'Acne Checkup', duration: '20 mins', status: 'Completed' },
  { id: 'app-13', patientId: 'pat-13', patientName: 'Vijay Gokhale', date: '2026-09-06', time: '11:00 AM', type: 'Amsa Basti Session', duration: '45 mins', status: 'Scheduled' },
  { id: 'app-14', patientId: 'pat-14', patientName: 'Deepali Shinde', date: '2026-09-06', time: '04:00 PM', type: 'Agnikarma Review', duration: '30 mins', status: 'Scheduled' }
];

// 5. FollowUps Data (14 items)
const demoFollowUps = [
  { id: 'fol-01', patientId: 'pat-01', date: '2026-09-10', time: '10:00 AM', reason: 'Amlapitta & Acidity Review', status: 'Pending', notes: 'Evaluate reduction in Amla Udgar and Hrid Daha post 12-day Virechana.' },
  { id: 'fol-02', patientId: 'pat-02', date: '2026-09-08', time: '10:30 AM', reason: 'Janu Basti Course Review', status: 'Pending', notes: 'Assess knee joint flexibility and pain score on visual analog scale.' },
  { id: 'fol-03', patientId: 'pat-03', date: '2026-09-09', time: '11:15 AM', reason: 'Sciatica Pain & SLR Check', status: 'Pending', notes: 'Check SLR test angle and bowel regulation post Matra Basti.' },
  { id: 'fol-04', patientId: 'pat-04', date: '2026-09-12', time: '12:00 PM', reason: 'Psoriasis Lesion Assessment', status: 'Pending', notes: 'Inspect silver scaling & erythema reduction post 4th Jalaukavacharana.' },
  { id: 'fol-05', patientId: 'pat-05', date: '2026-09-15', time: '04:00 PM', reason: 'Weight & Blood Sugar Audit', status: 'Pending', notes: 'Check fasting blood sugar, HbA1c, and body weight.' },
  { id: 'fol-06', patientId: 'pat-06', date: '2026-09-18', time: '09:30 AM', reason: 'USG Pelvis & Cycle Tracking', status: 'Pending', notes: 'Review menstrual cycle regularity post Uttara Basti.' },
  { id: 'fol-07', patientId: 'pat-07', date: '2026-09-14', time: '10:30 AM', reason: 'Asthma Breathlessness Audit', status: 'Pending', notes: 'Auscultate lungs for rhonchi and count inhaler usage frequency.' },
  { id: 'fol-08', patientId: 'pat-08', date: '2026-08-26', time: '04:30 PM', reason: 'Migraine Maintenance', status: 'Completed', notes: 'Patient reports 0 migraine attacks in last 3 weeks. Discontinued Triptans.' },
  { id: 'fol-09', patientId: 'pat-09', date: '2026-09-20', time: '10:00 AM', reason: 'Post-Stroke Limb Strength Check', status: 'Pending', notes: 'Test right hand grip and gait speed.' },
  { id: 'fol-10', patientId: 'pat-10', date: '2026-09-11', time: '11:30 AM', reason: 'Grahani Stool Consistency', status: 'Pending', notes: 'Check stool frequency and absence of mucus.' },
  { id: 'fol-11', patientId: 'pat-11', date: '2026-09-13', time: '05:00 PM', reason: 'Insomnia & Sleep Duration', status: 'Pending', notes: 'Confirm average sleep duration and daytime energy.' },
  { id: 'fol-12', patientId: 'pat-12', date: '2026-08-22', time: '06:00 PM', reason: 'Acne Clearance Final Check', status: 'Completed', notes: 'Pustules resolved completely. Skin smooth with mild marks.' },
  { id: 'fol-13', patientId: 'pat-13', date: '2026-09-16', time: '11:00 AM', reason: 'Frozen Shoulder Range of Motion', status: 'Pending', notes: 'Measure shoulder abduction & rotation angle.' },
  { id: 'fol-14', patientId: 'pat-14', date: '2026-09-07', time: '04:00 PM', reason: 'Plantar Heel Pain Audit', status: 'Pending', notes: 'Evaluate morning first-step pain after Agnikarma.' }
];

// 6. Payments Data (14 items corresponding to patients)
const demoPayments = [
  { id: 'pay-01', patientId: 'pat-01', appointmentId: 'app-01', date: '2026-08-28', consultingFee: 500, medicineCharges: 1310, procedureCharges: 4500, panchakarmaCharges: 7500, extraCharges: 300, totalAmount: 14110, paidAmount: 14110, balanceAmount: 0 },
  { id: 'pay-02', patientId: 'pat-02', appointmentId: 'app-02', date: '2026-08-30', consultingFee: 500, medicineCharges: 940, procedureCharges: 3500, panchakarmaCharges: 4200, extraCharges: 500, totalAmount: 9640, paidAmount: 8000, balanceAmount: 1640 },
  { id: 'pay-03', patientId: 'pat-03', appointmentId: 'app-03', date: '2026-09-01', consultingFee: 500, medicineCharges: 1100, procedureCharges: 3500, panchakarmaCharges: 4800, extraCharges: 1200, totalAmount: 11100, paidAmount: 11100, balanceAmount: 0 },
  { id: 'pay-04', patientId: 'pat-04', appointmentId: 'app-04', date: '2026-08-25', consultingFee: 500, medicineCharges: 1450, procedureCharges: 2400, panchakarmaCharges: 0, extraCharges: 400, totalAmount: 4750, paidAmount: 4750, balanceAmount: 0 },
  { id: 'pay-05', patientId: 'pat-05', appointmentId: 'app-05', date: '2026-08-29', consultingFee: 500, medicineCharges: 2150, procedureCharges: 6000, panchakarmaCharges: 5000, extraCharges: 0, totalAmount: 13650, paidAmount: 10000, balanceAmount: 3650 },
  { id: 'pay-06', patientId: 'pat-06', appointmentId: 'app-06', date: '2026-08-27', consultingFee: 500, medicineCharges: 1350, procedureCharges: 3000, panchakarmaCharges: 6500, extraCharges: 500, totalAmount: 11850, paidAmount: 11850, balanceAmount: 0 },
  { id: 'pay-07', patientId: 'pat-07', appointmentId: 'app-07', date: '2026-08-31', consultingFee: 500, medicineCharges: 880, procedureCharges: 2000, panchakarmaCharges: 7000, extraCharges: 0, totalAmount: 10380, paidAmount: 10380, balanceAmount: 0 },
  { id: 'pay-08', patientId: 'pat-08', appointmentId: 'app-08', date: '2026-08-26', consultingFee: 500, medicineCharges: 1400, procedureCharges: 5200, panchakarmaCharges: 0, extraCharges: 200, totalAmount: 7300, paidAmount: 7300, balanceAmount: 0 },
  { id: 'pay-09', patientId: 'pat-09', appointmentId: 'app-09', date: '2026-09-02', consultingFee: 500, medicineCharges: 1850, procedureCharges: 8400, panchakarmaCharges: 9000, extraCharges: 600, totalAmount: 20350, paidAmount: 15000, balanceAmount: 5350 },
  { id: 'pay-10', patientId: 'pat-10', appointmentId: 'app-10', date: '2026-08-24', consultingFee: 500, medicineCharges: 920, procedureCharges: 2800, panchakarmaCharges: 0, extraCharges: 0, totalAmount: 4220, paidAmount: 4220, balanceAmount: 0 },
  { id: 'pay-11', patientId: 'pat-11', appointmentId: 'app-11', date: '2026-08-30', consultingFee: 500, medicineCharges: 1980, procedureCharges: 5200, panchakarmaCharges: 0, extraCharges: 300, totalAmount: 7980, paidAmount: 7980, balanceAmount: 0 },
  { id: 'pay-12', patientId: 'pat-12', appointmentId: 'app-12', date: '2026-08-22', consultingFee: 500, medicineCharges: 1100, procedureCharges: 1800, panchakarmaCharges: 0, extraCharges: 200, totalAmount: 3600, paidAmount: 3600, balanceAmount: 0 },
  { id: 'pay-13', patientId: 'pat-13', appointmentId: 'app-13', date: '2026-08-28', consultingFee: 500, medicineCharges: 1650, procedureCharges: 4200, panchakarmaCharges: 0, extraCharges: 800, totalAmount: 7150, paidAmount: 6000, balanceAmount: 1150 },
  { id: 'pay-14', patientId: 'pat-14', appointmentId: 'app-14', date: '2026-08-31', consultingFee: 500, medicineCharges: 820, procedureCharges: 2200, panchakarmaCharges: 0, extraCharges: 1000, totalAmount: 4520, paidAmount: 4520, balanceAmount: 0 }
];

async function wipeCollection(collectionName: string) {
  console.log(`🧹 Clearing collection: ${collectionName}...`);
  const snap = await getDocs(collection(db, collectionName));
  const deletePromises = snap.docs.map((docSnap) => deleteDoc(docSnap.ref));
  await Promise.all(deletePromises);
}

async function seedDemoData() {
  console.log('🌿 Starting Authentic Ayurvedic Demo Data Seeding Process...\n');

  // Clear existing demo tables
  await wipeCollection(DEMO.PATIENTS);
  await wipeCollection(DEMO.APPOINTMENTS);
  await wipeCollection(DEMO.FOLLOW_UPS);
  await wipeCollection(DEMO.PAYMENTS);
  await wipeCollection(DEMO.MEDICINES);
  await wipeCollection(DEMO.TREATMENTS);

  console.log('\n✨ Populating 14 Detailed Ayurvedic Patient Cases...');
  for (const patient of demoPatients) {
    await setDoc(doc(db, DEMO.PATIENTS, patient.id), {
      ...patient,
      createdAt: new Date(),
      updatedAt: new Date(),
      isDemo: true,
    });
  }

  console.log('✨ Populating 14 Appointments...');
  for (const appt of demoAppointments) {
    await setDoc(doc(db, DEMO.APPOINTMENTS, appt.id), {
      ...appt,
      createdAt: new Date(),
      updatedAt: new Date(),
      isDemo: true,
    });
  }

  console.log('✨ Populating 14 Follow-up Records...');
  for (const fol of demoFollowUps) {
    await setDoc(doc(db, DEMO.FOLLOW_UPS, fol.id), {
      ...fol,
      createdAt: new Date(),
      updatedAt: new Date(),
      isDemo: true,
    });
  }

  console.log('✨ Populating 14 Payment Records...');
  for (const pay of demoPayments) {
    await setDoc(doc(db, DEMO.PAYMENTS, pay.id), {
      ...pay,
      createdAt: new Date(),
      updatedAt: new Date(),
      isDemo: true,
    });
  }

  console.log('✨ Populating 20 Medicines...');
  for (const med of demoMedicines) {
    await setDoc(doc(db, DEMO.MEDICINES, med.id), {
      ...med,
      createdAt: new Date(),
      updatedAt: new Date(),
      isDemo: true,
    });
  }

  console.log('✨ Populating 15 Ayurvedic Treatments...');
  for (const trt of demoTreatments) {
    await setDoc(doc(db, DEMO.TREATMENTS, trt.id), {
      ...trt,
      createdAt: new Date(),
      updatedAt: new Date(),
      isDemo: true,
    });
  }

  console.log('\n🎉 Successfully Seeded Demo Environment!');
  console.log('-------------------------------------------');
  console.log('Patients:     14 authentic Ayurvedic cases');
  console.log('Appointments: 14 scheduled/completed visits');
  console.log('Follow-ups:   14 clinical follow-up logs');
  console.log('Payments:     14 billing records');
  console.log('Medicines:    20 stock items');
  console.log('Treatments:   15 Panchakarma & Kera therapies');
  console.log('Tables Used:  demo_patients, demo_appointments, demo_followUps, demo_payments, demo_medicines, demo_treatments');
  console.log('Real Data:    100% UNTOUCHED and Isolated');
  console.log('-------------------------------------------\n');

  process.exit(0);
}

seedDemoData().catch((err) => {
  console.error('❌ Error during demo data seeding:', err);
  process.exit(1);
});
