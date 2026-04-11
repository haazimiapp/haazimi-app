export const USERS = [
  { 
    id: 1, 
    name: 'Admin User', 
    role: 'Country Admin', 
    center: 'Head Office', 
    email: 'admin@haazimi.org', 
    password: 'admin' 
  },
  { 
    id: 2, 
    name: 'Ahmad Ali', 
    role: 'Centre Manager', 
    center: 'Branch A', 
    email: 'ahmad@haazimi.org', 
    password: '1234' 
  },
  { 
    id: 3, 
    name: 'Yusuf Khan', 
    role: 'Staff', 
    center: 'Branch B', 
    email: 'yusuf@haazimi.org', 
    password: '1234' 
  },
  { 
    id: 4, 
    name: 'Global Admin', 
    role: 'Super Admin', 
    center: 'All', 
    email: 'super@haazimi.org', 
    password: 'super' 
  },
];

export const STAFF = [
  { id: 1, name: 'Ahmad Ali', role: 'Centre Manager', center: 'Branch A', status: 'Active', phone: '0300-1234567', joinDate: '2022-01-15', leaves: 3 },
  { id: 2, name: 'Bilal Hassan', role: 'Country Admin', center: 'Head Office', status: 'Active', phone: '0311-9876543', joinDate: '2021-06-01', leaves: 1 },
  { id: 3, name: 'Fatima Malik', role: 'Staff', center: 'Branch B', status: 'Active', phone: '0321-5556789', joinDate: '2023-03-20', leaves: 0 },
  { id: 4, name: 'Usman Tariq', role: 'Staff', center: 'Branch A', status: 'On Leave', phone: '0333-4445678', joinDate: '2020-09-10', leaves: 7 },
  { id: 5, name: 'Zainab Raza', role: 'Staff', center: 'Head Office', status: 'Active', phone: '0345-2223456', joinDate: '2022-11-05', leaves: 2 },
  { id: 6, name: 'Ibrahim Shah', role: 'Staff', center: 'Branch C', status: 'Active', phone: '0312-7778901', joinDate: '2023-07-01', leaves: 0 },
  { id: 7, name: 'Khadija Noor', role: 'Staff', center: 'Branch B', status: 'Inactive', phone: '0322-1112345', joinDate: '2019-04-15', leaves: 12 },
];

export const STUDENTS = [
  { id: 'S-1', name: 'Ahmad Patel', phone: '+27 82 111 1111', parentName: 'Haji Ismail Patel', parentPhone: '+27 82 222 2222', address: '15 Oak Avenue, Lenasia Ext 13, Johannesburg', className: 'Hifz Class A', teacherEmail: 'staff@dev.local', centre: 'Ext. 13 (Lenasia)', country: 'South Africa', attendance: 92, status: 'On Track', notes: '', intentions: 0b00111111, quranJuz: 'Juz 5', surahs: 'Yaseen, Mulk', duas: 'Morning, Evening', muzaakarahs: 'Salaah, Wudhu', other: '', addedAt: '2026-01-10' },
  { id: 'S-2', name: 'Fatima Khan', phone: '+27 83 333 3333', parentName: 'Mr. Yusuf Khan', parentPhone: '+27 83 444 4444', address: '22 Rose Street, Lenasia Ext 13, JHB', className: 'Hifz Class A', teacherEmail: 'staff@dev.local', centre: 'Ext. 13 (Lenasia)', country: 'South Africa', attendance: 88, status: 'On Track', notes: '', intentions: 0b11111111, quranJuz: 'Juz 7', surahs: 'Kahf, Rahman', duas: 'Morning, Sleeping', muzaakarahs: 'Salaah, Wudhu, Kalimah', other: '', addedAt: '2026-01-10' },
  { id: 'S-3', name: 'Yusuf Motala', phone: '+27 71 555 5555', parentName: 'Mrs. Hawa Motala', parentPhone: '+27 71 666 6666', address: '5 Jacaranda Close, Lenasia Ext 13', className: 'Hifz Class A', teacherEmail: 'staff@dev.local', centre: 'Ext. 13 (Lenasia)', country: 'South Africa', attendance: 75, status: 'Needs Attention', notes: 'Missing Thursdays regularly', intentions: 0b00011111, quranJuz: 'Juz 3', surahs: 'Baqarah (first 5)', duas: 'Morning', muzaakarahs: 'Kalimah', other: '', addedAt: '2026-01-15' },
  { id: 'S-4', name: 'Maryam Suleman', phone: '+27 79 777 7777', parentName: 'Dr. Ibrahim Suleman', parentPhone: '+27 79 888 8888', address: '31 Orchid Ave, Ext 1, Lenasia', className: 'Aamil Class', teacherEmail: 'staff@dev.local', centre: 'Ext. 13 (Lenasia)', country: 'South Africa', attendance: 95, status: 'Excellent', notes: '', intentions: 0b11111111, quranJuz: 'Complete', surahs: 'All required', duas: 'Complete', muzaakarahs: 'All completed', other: '', addedAt: '2026-01-15' },
  { id: 'S-5', name: 'Omar Farooq', phone: '+27 84 999 9999', parentName: 'Haji Anwar Khan', parentPhone: '+27 84 888 8888', address: '10 Gulshan Road, Gulshan-e-Iqbal', className: 'Hifz Class A', teacherEmail: 'centremanager@dev.local', centre: 'Ext. 1 (Lenasia)', country: 'South Africa', attendance: 75, status: 'Needs Attention', notes: 'Attendance improving', intentions: 0b00001111, quranJuz: 'Juz 4', surahs: 'Yaseen', duas: 'Morning', muzaakarahs: 'Salaah', other: '', addedAt: '2026-01-20' },
];

export const CLASSES = [
  {
    id: 1,
    name: 'Hifz Class - A',
    students: [
      { id: 101, name: 'Ali Raza', juz: 15, attendance: 92, status: 'On Track', notes: 'Making good progress.' },
      { id: 102, name: 'Hassan Mahmood', juz: 12, attendance: 88, status: 'On Track', notes: '' },
      { id: 103, name: 'Omar Farooq', juz: 8, attendance: 75, status: 'Needs Attention', notes: 'Struggling with tajweed.' },
      { id: 104, name: 'Tariq Jamil', juz: 20, attendance: 95, status: 'On Track', notes: 'Excellent student.' },
    ],
  },
  {
    id: 2,
    name: 'Nazra Class - B',
    students: [
      { id: 201, name: 'Ayesha Khan', juz: 5, attendance: 98, status: 'On Track', notes: '' },
      { id: 202, name: 'Sara Ahmed', juz: 3, attendance: 85, status: 'On Track', notes: '' },
      { id: 203, name: 'Nadia Hussain', juz: 7, attendance: 60, status: 'At Risk', notes: 'Frequent absences.' },
    ],
  },
  {
    id: 3,
    name: 'Tajweed Class - C',
    students: [
      { id: 301, name: 'Zaid Ali', juz: null, attendance: 90, status: 'On Track', notes: '' },
      { id: 302, name: 'Musa Iqbal', juz: null, attendance: 82, status: 'On Track', notes: '' },
    ],
  },
];

export const EVENTS = [
  { date: '2026-05-27', type: 'holiday', name: "Eidul Adh'haa Holiday", desc: 'Public holiday' },
  { date: '2026-04-11', type: 'monthly-muzaakarah', name: 'Monthly Muzaakarah', desc: 'All staff required to attend' },
  { date: '2026-05-04', type: 'exam', name: 'Mid Year Exams', desc: 'Mid Year Exams for all students' },
  { date: '2026-05-25', type: 'holiday', name: 'Mid Year Holidays', desc: 'Mid Year Holidays begins' },
  { date: '2026-04-05', type: 'event', name: 'Guest Scholar Visit', desc: 'Sheikh AbdulHaq Al-Farsi visiting' },
  { date: '2026-04-10', type: 'holiday', name: 'Eid-ul-Fitr', desc: 'Eid holiday — institute closed 3 days' },
];

export const LEAVE_REQUESTS = [
  {
    id: 1,
    staffId: 4,
    staffName: 'Usman Tariq',
    type: 'Medical',
    from: '2026-03-10',
    to: '2026-03-14',
    days: 5,
    reason: 'Admitted to hospital for minor surgery. Doctor has advised complete rest for one week.',
    status: 'pending',
    tally: { total: 8, approved: 3, rejected: 0 },
  },
  {
    id: 2,
    staffId: 3,
    staffName: 'Fatima Malik',
    type: 'Emergency',
    from: '2026-03-16',
    to: '2026-03-17',
    days: 2,
    reason: 'Family emergency — travelling out of city.',
    status: 'pending',
    tally: { total: 2, approved: 0, rejected: 0 },
  },
  {
    id: 3,
    staffId: 1,
    staffName: 'Ahmad Ali',
    type: 'Casual',
    from: '2026-02-20',
    to: '2026-02-20',
    days: 1,
    reason: 'Personal work.',
    status: 'approved',
    tally: { total: 4, approved: 3, rejected: 1 },
  },
  {
    id: 4,
    staffId: 6,
    staffName: 'Ibrahim Shah',
    type: 'Study',
    from: '2026-02-10',
    to: '2026-02-12',
    days: 3,
    reason: 'Attending a weekend seminar on advanced Quran studies.',
    status: 'rejected',
    tally: { total: 3, approved: 0, rejected: 3 },
  },
  {
    id: 5,
    staffId: 99,
    staffName: 'Dev Manager',
    type: 'Casual',
    from: '2026-03-28',
    to: '2026-03-28',
    days: 1,
    reason: 'Personal appointment.',
    status: 'pending',
    tally: { total: 3, approved: 2, rejected: 0 },
  },
  {
    id: 6,
    staffId: 99,
    staffName: 'Dev Manager',
    type: 'Annual',
    from: '2026-02-05',
    to: '2026-02-07',
    days: 3,
    reason: 'Family vacation.',
    status: 'approved',
    tally: { total: 3, approved: 2, rejected: 0 },
  },
];

export const RED_FLAGS = [
  { id: 1, staffName: 'Khadija Noor', issue: 'High Absenteeism', detail: '12 leaves taken, exceeds annual limit of 10.', severity: 'high', date: '2026-03-01' },
  { id: 2, staffName: 'Omar Farooq (Student)', issue: 'Poor Attendance', detail: 'Attendance dropped to 75% — below the 80% threshold.', severity: 'medium', date: '2026-03-10' },
  { id: 3, staffName: 'Usman Tariq', issue: 'Extended Leave', detail: 'On medical leave for 5 days. Replacement arrangements needed.', severity: 'medium', date: '2026-03-10' },
  { id: 4, staffName: 'Nadia Hussain (Student)', issue: 'At-Risk Student', detail: 'Attendance at 60%. Parents have not responded to communication.', severity: 'high', date: '2026-03-12' },
];

export const PEOPLE_TO_VISIT = [
  { id: 1, name: 'Haji Anwar Khan', relation: 'Wali (Guardian)', student: 'Omar Farooq', area: 'Gulshan', dueDate: '2026-03-15', lastVisit: '2026-01-20', status: 'overdue', notes: 'Discuss attendance issues.' },
  { id: 2, name: 'Mr. Ghulam Mustafa', relation: 'Donor', student: null, area: 'DHA', dueDate: '2026-03-20', lastVisit: '2025-12-05', status: 'due', notes: 'Annual donor meeting.' },
  { id: 3, name: 'Mrs. Rubina Akhtar', relation: 'Wali (Guardian)', student: 'Nadia Hussain', area: 'North Karachi', dueDate: '2026-03-18', lastVisit: '2026-02-01', status: 'overdue', notes: 'Urgent - no response by phone.' },
  { id: 4, name: 'Sheikh AbdulHay', relation: 'Community Leader', student: null, area: 'Saddar', dueDate: '2026-04-01', lastVisit: '2026-02-15', status: 'upcoming', notes: 'Partnership discussion.' },
  { id: 5, name: 'Dr. Kamran Baig', relation: 'Wali (Guardian)', student: 'Zaid Ali', area: 'Clifton', dueDate: '2026-04-05', lastVisit: '2026-03-01', status: 'upcoming', notes: 'Routine feedback meeting.' },
];

export const BUDGET_ITEMS = [
  { id: 1, category: 'Staff Salaries', budgeted: 250000, spent: 248000 },
  { id: 2, category: 'Utilities', budgeted: 20000, spent: 18500 },
  { id: 3, category: 'Teaching Materials', budgeted: 15000, spent: 12000 },
  { id: 4, category: 'Maintenance', budgeted: 10000, spent: 7500 },
  { id: 5, category: 'Miscellaneous', budgeted: 5000, spent: 6200 },
];

export const TIME_LOGS = [
  { id: 1, date: '2026-03-14', checkIn: '08:00', checkOut: '14:00', hours: 6, activity: 'Teaching + Admin', notes: '' },
  { id: 2, date: '2026-03-13', checkIn: '08:30', checkOut: '13:30', hours: 5, activity: 'Teaching', notes: 'Half day.' },
  { id: 3, date: '2026-03-12', checkIn: '08:00', checkOut: '16:00', hours: 8, activity: 'Exam Supervision', notes: 'Monthly assessment.' },
  { id: 4, date: '2026-03-11', checkIn: '09:00', checkOut: '14:00', hours: 5, activity: 'Teaching', notes: '' },
  { id: 5, date: '2026-03-10', checkIn: '08:00', checkOut: '15:00', hours: 7, activity: 'Teaching + Planning', notes: '' },
];
