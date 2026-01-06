export const uz = {
  appName: 'EduOne',

  auth: {
    title: 'EduOne',
    loginTitle: 'Tizimga kirish',
    usernameLabel: 'Foydalanuvchi nomi',
    usernamePlaceholder: 'foydalanuvchi_nomi',
    passwordLabel: 'Parol',
    passwordPlaceholder: '••••••••',
    submit: 'Kirish',
    loginSuccessTitle: 'Muvaffaqiyatli',
    loginSuccessMessage: 'Tizimga kirdingiz',
    submitErrorTitle: 'Kirish amalga oshmadi',
    submitErrorFallback: 'Username yoki parol noto‘g‘ri',
  },

  teacher: {
    homeTitle: "O'qituvchi kabineti",
    homeSubtitle: "Kerakli bo'limni tanlang",
    myGroups: 'Mening guruhlarim',
    payments: "To'lovlar",
    attendance: 'Davomat qilish',
    tasks: 'Vazifalar',
  },

  admin: {
    homeTitle: 'Admin kabineti',
    homeSubtitle: "Kerakli bo'limni tanlang",
    groups: 'Guruhlar',
    payments: "To'lovlar",
    attendance: 'Davomat',
    tasks: 'Vazifalar',
  },

  superadmin: {
    homeTitle: 'Superadmin kabineti',
    homeSubtitle: "Kerakli bo'limni tanlang",
    groups: 'Guruhlar',
    payments: "To'lovlar",
    attendance: 'Davomat',
    tasks: 'Vazifalar',
  },

  common: {
    loading: 'Yuklanmoqda...',
    notFound: 'Topilmadi',
    save: 'Saqlash',
    saving: 'Saqlanmoqda...',
    savedTitle: 'Saqlandi',
    successTitle: 'Muvaffaqiyatli',
    errorTitle: 'Xatolik',
    logout: 'Chiqish',
    loggedOut: 'Tizimdan chiqdingiz',
  },

  groups: {
    empty: 'Guruhlar topilmadi',
    studentsCount: (n: number) => `${n} o'quvchi`,

    editNavTitle: 'Guruhni tahrirlash',
    editTitle: "Guruh ma'lumotlari",
    scheduleTitle: 'Dars jadvali',
    metaTitle: "Fan va o'qituvchi",
    studentsTitle: "O'quvchilar",

    nameLabel: 'Guruh nomi',
    namePlaceholder: "Masalan: Matematika 1-guruh",
    descriptionLabel: 'Tavsif',
    descriptionPlaceholder: "Guruh haqida qisqacha ma'lumot...",

    daysLabel: 'Hafta kunlari',
    startTimeLabel: 'Boshlanish vaqti',
    endTimeLabel: 'Tugash vaqti',
    timeHint: "Vaqt formati: HH:MM (masalan 09:00)",

    subjectLabel: 'Fan',
    teacherLabel: "O'qituvchi",
    selectSubject: 'Fanni tanlang',
    selectTeacher: "O'qituvchini tanlang",

    studentsSelected: (n: number) => `Tanlangan: ${n}`,
    searchStudentsPlaceholder: "O'quvchini qidiring...",
    updatedMessage: "Guruh ma'lumotlari yangilandi",
  },

  profile: {
    navTitle: 'Profil',
    title: 'Profil ma\'lumotlari',
    fullName: 'Ism-familiya',
    username: 'Username',
    role: 'Role',
    center: 'Markaz',
  },

  payments: {
    empty: "To'lovlar topilmadi",
    amountSuffix: "so'm",
    status: {
      pending: 'Kutilmoqda',
      paid: "To'langan",
      overdue: 'Muddati o‘tgan',
      cancelled: 'Bekor qilingan',
      unknown: 'Nomaʼlum',
    },
  },

  attendance: {
    selectGroup: 'Guruh tanlang',
    changeGroup: 'Guruhni almashtirish',
    dateLabel: 'Sana',
    studentsEmpty: 'Studentlar topilmadi',
    savedMessage: 'Bugungi davomat saqlandi',

    statsTitle: 'Statistika',
    presentLabel: 'Keldi',
    absentLabel: 'Kelmadi',
  },

  tasks: {
    selectGroup: 'Guruh tanlang',
    changeGroup: 'Guruhni almashtirish',
    dateLabel: 'Sana',
    studentsEmpty: 'Studentlar topilmadi',
    savedMessage: 'Bugungi vazifa saqlandi',

    statsTitle: 'Statistika',
    doneLabel: 'Bajardi',
    notDoneLabel: 'Bajarmadi',

    historyTitle: 'Vazifalar tarixi',
    historySelectGroup: 'Guruh tanlang',
    historyHint: 'Vazifa tarixi',
    historyEmpty: 'Tarix topilmadi',
    historyNotDone: (n: number) => `${n} ta bajarmadi`,
  },
} as const;
