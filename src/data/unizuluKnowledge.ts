/**
 * Comprehensive Knowledge Base for University of Zululand (UNIZULU)
 * Grounded in official information from https://www.unizulu.ac.za
 */

export interface FacultyDegree {
  title: string;
  minAps: number;
  duration: string;
  keyRequirements: string;
  caoCode?: string;
  campus?: 'KwaDlangezwa' | 'Richards Bay' | 'Both';
  qualificationType?: 'Degree' | 'Diploma' | 'Postgraduate';
}

export interface FacultyDetail {
  name: string;
  code: string;
  deanery: string;
  popularDegrees: FacultyDegree[];
  overview: string;
}

export const UNIZULU_FACULTIES: FacultyDetail[] = [
  {
    name: 'Faculty of Commerce, Administration and Law (CAL)',
    code: 'CAL',
    deanery: 'KwaDlangezwa & Richards Bay Campuses',
    overview: 'Prepares future attorneys, advocates, chartered accountants, economists, HR professionals, and public administrators.',
    popularDegrees: [
      {
        title: 'Bachelor of Laws (LLB)',
        minAps: 30,
        duration: '4 Years',
        keyRequirements: 'NSC Degree endorsement, English Home Language or FAL Level 5 (60%), Mathematical Literacy Level 4 or Maths Level 3.',
        caoCode: 'ZU-M-LLB',
        campus: 'KwaDlangezwa',
        qualificationType: 'Degree'
      },
      {
        title: 'Bachelor of Commerce in Accounting (SAICA Accredited)',
        minAps: 28,
        duration: '3 Years',
        keyRequirements: 'NSC Degree endorsement, Pure Mathematics Level 5 (60%), Accounting Level 4 (recommended), English Level 4.',
        caoCode: 'ZU-M-BCA',
        campus: 'KwaDlangezwa',
        qualificationType: 'Degree'
      },
      {
        title: 'Bachelor of Commerce in Business Management / Economics',
        minAps: 26,
        duration: '3 Years',
        keyRequirements: 'NSC Degree endorsement, Pure Mathematics Level 4 (50%) or Mathematical Literacy Level 6 (70%), English Level 4.',
        caoCode: 'ZU-M-BCE',
        campus: 'KwaDlangezwa',
        qualificationType: 'Degree'
      },
      {
        title: 'Bachelor of Administration (Public Administration)',
        minAps: 26,
        duration: '3 Years',
        keyRequirements: 'NSC Degree endorsement, English Level 4, any business or social science subject.',
        caoCode: 'ZU-M-BPA',
        campus: 'KwaDlangezwa',
        qualificationType: 'Degree'
      },
      {
        title: 'Diploma in Accounting (Richards Bay Campus)',
        minAps: 22,
        duration: '3 Years',
        keyRequirements: 'NSC Diploma endorsement, English Level 4 (50%), Mathematics Level 3 (40%) or Math Literacy Level 5 (60%), Accounting recommended.',
        caoCode: 'ZU-R-DAC',
        campus: 'Richards Bay',
        qualificationType: 'Diploma'
      },
      {
        title: 'Diploma in Transport & Logistics Management',
        minAps: 22,
        duration: '3 Years',
        keyRequirements: 'NSC Diploma endorsement, English Level 4, Mathematics Level 3 or Math Lit Level 4.',
        caoCode: 'ZU-R-DTM',
        campus: 'Richards Bay',
        qualificationType: 'Diploma'
      },
      {
        title: 'Diploma in Public Relations Management',
        minAps: 22,
        duration: '3 Years',
        keyRequirements: 'NSC Diploma endorsement, English Level 4 (50%), any three Level 3 subjects.',
        caoCode: 'ZU-R-DPR',
        campus: 'Richards Bay',
        qualificationType: 'Diploma'
      },
      {
        title: 'Diploma in Cooperative Management',
        minAps: 22,
        duration: '3 Years',
        keyRequirements: 'NSC Diploma endorsement, English Level 4 (50%), Mathematical Literacy Level 4 or Maths Level 3, Business/Accounting recommended.',
        caoCode: 'ZU-R-DCM',
        campus: 'Richards Bay',
        qualificationType: 'Diploma'
      },
      {
        title: 'Diploma in Management Information Systems',
        minAps: 22,
        duration: '3 Years',
        keyRequirements: 'NSC Diploma endorsement, English Level 4, Mathematics Level 3 or Math Lit Level 4, CAT/IT advantageous.',
        caoCode: 'ZU-R-MIS',
        campus: 'Richards Bay',
        qualificationType: 'Diploma'
      },
      {
        title: 'Higher Certificate in Accountancy',
        minAps: 20,
        duration: '1 Year',
        keyRequirements: 'NSC Higher Certificate endorsement, English Level 4, Mathematics Level 3 or Math Lit Level 4.',
        caoCode: 'ZU-R-HCA',
        campus: 'Richards Bay',
        qualificationType: 'Diploma'
      }
    ]
  },
  {
    name: 'Faculty of Science, Agriculture and Engineering (SAE)',
    code: 'SAE',
    deanery: 'KwaDlangezwa & Richards Bay Campuses',
    overview: 'Pioneering innovation in natural sciences, computing, agriculture, food security, environmental hydrology, and engineering technology.',
    popularDegrees: [
      {
        title: 'Bachelor of Science in Computer Science',
        minAps: 28,
        duration: '3 Years',
        keyRequirements: 'NSC Degree endorsement, Pure Mathematics Level 4 (50%), Physical Science Level 4 (50%), English Level 4.',
        caoCode: 'ZU-M-BSC',
        campus: 'KwaDlangezwa',
        qualificationType: 'Degree'
      },
      {
        title: 'Bachelor of Science in Hydrology',
        minAps: 28,
        duration: '3 Years',
        keyRequirements: 'NSC Degree endorsement, Mathematics Level 4, Physical Sciences Level 4, English Level 4. World-renowned department at UNIZULU.',
        caoCode: 'ZU-M-HYD',
        campus: 'KwaDlangezwa',
        qualificationType: 'Degree'
      },
      {
        title: 'Bachelor of Science in Agriculture (Agronomy / Animal Science)',
        minAps: 28,
        duration: '4 Years',
        keyRequirements: 'NSC Degree endorsement, Mathematics or Math Lit Level 5, Life Sciences or Agricultural Sciences Level 4.',
        caoCode: 'ZU-M-BSA',
        campus: 'KwaDlangezwa',
        qualificationType: 'Degree'
      },
      {
        title: 'Bachelor of Science in Biochemistry & Microbiology',
        minAps: 28,
        duration: '3 Years',
        keyRequirements: 'NSC Degree endorsement, Pure Mathematics Level 4, Physical Science Level 4, Life Sciences Level 4.',
        caoCode: 'ZU-M-BCM',
        campus: 'KwaDlangezwa',
        qualificationType: 'Degree'
      },
      {
        title: 'Bachelor of Nursing Science',
        minAps: 30,
        duration: '4 Years',
        keyRequirements: 'NSC Degree endorsement, Life Sciences Level 4 (50%), English Level 4, Physical Science or Pure Maths Level 4.',
        caoCode: 'ZU-M-BNS',
        campus: 'KwaDlangezwa',
        qualificationType: 'Degree'
      },
      {
        title: 'Diploma in Hospitality & Tourism Management',
        minAps: 22,
        duration: '3 Years',
        keyRequirements: 'NSC Diploma endorsement, English Level 4, Math Lit Level 4 or Maths Level 3, Tourism/Hospitality advantageous.',
        caoCode: 'ZU-R-DHT',
        campus: 'Richards Bay',
        qualificationType: 'Diploma'
      },
      {
        title: 'Diploma in Information Technology',
        minAps: 24,
        duration: '3 Years',
        keyRequirements: 'NSC Diploma endorsement, English Level 4 (50%), Mathematics Level 4 (50%) or Mathematical Literacy Level 6 (70%).',
        caoCode: 'ZU-R-DIT',
        campus: 'Richards Bay',
        qualificationType: 'Diploma'
      },
      {
        title: 'Diploma in Engineering Technology (Electrical / Mechanical)',
        minAps: 26,
        duration: '3 Years',
        keyRequirements: 'NSC Diploma endorsement, Pure Mathematics Level 4 (50%), Physical Sciences Level 4 (50%), English Level 4 (50%).',
        caoCode: 'ZU-R-DET',
        campus: 'Richards Bay',
        qualificationType: 'Diploma'
      }
    ]
  },
  {
    name: 'Faculty of Education',
    code: 'EDU',
    deanery: 'KwaDlangezwa Campus',
    overview: 'One of the largest faculties, training high-caliber teachers and educational leaders across primary, secondary, and tertiary education.',
    popularDegrees: [
      {
        title: 'Bachelor of Education (B.Ed) Foundation Phase (Grades R-3)',
        minAps: 26,
        duration: '4 Years',
        keyRequirements: 'NSC Degree endorsement, English Level 4, isiZulu Level 4 (or approved indigenous language), Maths/Math Lit Level 3.',
        caoCode: 'ZU-M-EDF',
        campus: 'KwaDlangezwa',
        qualificationType: 'Degree'
      },
      {
        title: 'Bachelor of Education (B.Ed) Intermediate Phase (Grades 4-7)',
        minAps: 26,
        duration: '4 Years',
        keyRequirements: 'NSC Degree endorsement, English Level 4, two primary teaching subjects at Level 4.',
        caoCode: 'ZU-M-EDI',
        campus: 'KwaDlangezwa',
        qualificationType: 'Degree'
      },
      {
        title: 'Bachelor of Education (B.Ed) Senior Phase & FET (Grades 8-12)',
        minAps: 26,
        duration: '4 Years',
        keyRequirements: 'NSC Degree endorsement, English Level 4, two FET teaching major subjects (e.g. History, Physical Science, Accounting, Maths) at Level 4 or 5.',
        caoCode: 'ZU-M-EDS',
        campus: 'KwaDlangezwa',
        qualificationType: 'Degree'
      },
      {
        title: 'Postgraduate Certificate in Education (PGCE)',
        minAps: 0,
        duration: '1 Year',
        keyRequirements: 'An approved Bachelor’s degree with two recognized school teaching majors.',
        caoCode: 'ZU-M-PGC',
        campus: 'KwaDlangezwa',
        qualificationType: 'Postgraduate'
      }
    ]
  },
  {
    name: 'Faculty of Humanities and Social Sciences',
    code: 'HSS',
    deanery: 'KwaDlangezwa Campus',
    overview: 'Offers dynamic programmes in languages, social work, media studies, psychology, criminology, and sociology dedicated to human and community advancement.',
    popularDegrees: [
      {
        title: 'Bachelor of Social Work (BSW)',
        minAps: 28,
        duration: '4 Years',
        keyRequirements: 'NSC Degree endorsement, English Level 4 (50%), selection screening may apply.',
        caoCode: 'ZU-M-BSW',
        campus: 'KwaDlangezwa',
        qualificationType: 'Degree'
      },
      {
        title: 'Bachelor of Arts in Psychology',
        minAps: 26,
        duration: '3 Years',
        keyRequirements: 'NSC Degree endorsement, English Level 4 (50%).',
        caoCode: 'ZU-M-BAP',
        campus: 'KwaDlangezwa',
        qualificationType: 'Degree'
      },
      {
        title: 'Bachelor of Arts in Communication Science',
        minAps: 26,
        duration: '3 Years',
        keyRequirements: 'NSC Degree endorsement, English Level 4 (50%), Life Orientation Level 4.',
        caoCode: 'ZU-M-BAC',
        campus: 'KwaDlangezwa',
        qualificationType: 'Degree'
      },
      {
        title: 'Bachelor of Arts in Development Studies',
        minAps: 26,
        duration: '3 Years',
        keyRequirements: 'NSC Degree endorsement, English Level 4, any two social science subjects.',
        caoCode: 'ZU-M-BAD',
        campus: 'KwaDlangezwa',
        qualificationType: 'Degree'
      },
      {
        title: 'Bachelor of Arts in Correctional Studies / Criminology',
        minAps: 26,
        duration: '3 Years',
        keyRequirements: 'NSC Degree endorsement, English Level 4.',
        caoCode: 'ZU-M-BCS',
        campus: 'KwaDlangezwa',
        qualificationType: 'Degree'
      },
      {
        title: 'Diploma in Media Studies & Public Communication',
        minAps: 22,
        duration: '3 Years',
        keyRequirements: 'NSC Diploma endorsement, English Home Language or FAL Level 4 (50%), any three Level 3 subjects.',
        caoCode: 'ZU-R-DMS',
        campus: 'Richards Bay',
        qualificationType: 'Diploma'
      },
      {
        title: 'Diploma in Youth and Community Development',
        minAps: 22,
        duration: '3 Years',
        keyRequirements: 'NSC Diploma endorsement, English Level 4 (50%), Social Sciences or History Level 3.',
        caoCode: 'ZU-R-DYD',
        campus: 'Richards Bay',
        qualificationType: 'Diploma'
      }
    ]
  }
];

export const UNIZULU_CONTACTS = {
  website: 'https://www.unizulu.ac.za',
  admissionsEmail: 'admissions@unizulu.ac.za',
  generalEmail: 'info@unizulu.ac.za',
  switchboard: '+27 (0)35 902 6000',
  admissionsOfficePhone: '+27 (0)35 902 6030 / 6718',
  caoWebsite: 'https://www.cao.ac.za',
  caoPhone: '+27 (0)31 268 4444',
  nsfasWebsite: 'https://www.nsfas.org.za',
  kwaDlangezwaAddress: '1 Main Road, KwaDlangezwa, 3886, KwaZulu-Natal, South Africa',
  richardsBayAddress: 'Corner of Guldengracht & EShared Street, Arboretum, Richards Bay, 3900'
};

export const DOCUMENT_SUBMISSION_STEPS = [
  {
    step: 1,
    title: 'Certified Copy of Identity Document (ID)',
    description: 'A clear copy of your South African ID card/book (or valid Passport with study permit for international students). Must be certified by SAPS, Post Office, or a Commissioner of Oaths within the last 3 months.',
    tip: 'Ensure the certification date stamp and signature are clearly visible.'
  },
  {
    step: 2,
    title: 'Grade 11 Final Report or Matric / NSC Certificate',
    description: 'If you are currently in Grade 12, provide your official final Grade 11 end-of-year report. If you have completed Matric, provide your certified National Senior Certificate (NSC) or Statement of Results.',
    tip: 'Make sure your examination number and all subject achievement percentages are legible.'
  },
  {
    step: 3,
    title: 'CAO Application Fee Proof of Payment',
    description: 'UNIZULU undergraduate applications are submitted via CAO (Central Applications Office). Standard fee is R250 for on-time South African applicants, R470 for late applications, or R300 for international applicants.',
    tip: 'Pay via EasyPay at Shoprite/Checkers/Pick n Pay, or directly via credit card on www.cao.ac.za.'
  },
  {
    step: 4,
    title: 'Academic Records & Certificate of Conduct (Transfer Students)',
    description: 'If you studied previously at another university, TVET college, or higher education institution, submit an official stamped academic record and certificate of good conduct.',
    tip: 'Must be issued on official institutional letterhead.'
  },
  {
    step: 5,
    title: 'Proof of Residential Address (For Housing)',
    description: 'Utility bill, stamped letter from tribal authority / local ward councillor, or municipal account showing your home address if applying for student residences at KwaDlangezwa or Richards Bay.',
    tip: 'Needed for on-campus student housing allocation preference.'
  }
];

export const CAO_APPLICATION_GUIDE = [
  {
    phase: 'Step 1: Check Minimum Requirements',
    detail: 'Calculate your Admission Point Score (APS) and verify program-specific subject requirements (e.g. Pure Maths for BSc/BCom vs Math Lit for Humanities).'
  },
  {
    phase: 'Step 2: Visit CAO Portal',
    detail: 'Navigate to www.cao.ac.za and click "Apply Now". Create your profile or enter your existing CAO number if you previously registered.'
  },
  {
    phase: 'Step 3: Select UNIZULU Choices',
    detail: 'Search for UNIZULU programmes using the code prefix "ZU-" (e.g., ZU-M-LLB for LLB, ZU-M-BSC for Science). You can select multiple choices in order of preference.'
  },
  {
    phase: 'Step 4: Upload Required Documents',
    detail: 'Scan your certified ID, Grade 11/12 results, and submit them through the CAO upload portal in PDF or JPEG format (under 2MB per document).'
  },
  {
    phase: 'Step 5: Pay Fee and Track Status',
    detail: 'Use your CAO number as reference to pay the application fee. Track your admission decision online using the CAO tracking portal.'
  }
];

export const INITIAL_EVOLVED_QUERIES = [
  {
    id: 'eq-1',
    topic: 'Admission Requirements',
    question: 'What APS score do I need for Law (LLB) at UNIZULU?',
    frequency: 412,
    lastUpdated: 'Recently updated',
    category: 'Admissions' as const
  },
  {
    id: 'eq-2',
    topic: 'Document Submissions',
    question: 'How do I submit certified documents if I only have a smartphone scan?',
    frequency: 389,
    lastUpdated: 'Recently updated',
    category: 'Documents' as const
  },
  {
    id: 'eq-3',
    topic: 'CAO Process',
    question: 'How do I apply to UNIZULU through CAO with code ZU-?',
    frequency: 345,
    lastUpdated: 'Recently updated',
    category: 'CAO' as const
  },
  {
    id: 'eq-4',
    topic: 'Financial Aid',
    question: 'How does NSFAS link with my UNIZULU registration?',
    frequency: 298,
    lastUpdated: 'Recently updated',
    category: 'Financial Aid' as const
  },
  {
    id: 'eq-5',
    topic: 'Accommodation',
    question: 'When does UNIZULU residence application open for first years?',
    frequency: 264,
    lastUpdated: 'Recently updated',
    category: 'Housing' as const
  }
];
