# HappyTel Admin Panel

## 🚀 **Loyiha haqida**

HappyTel Admin Panel - bu SIM-karta va mahsulot buyurtmalarini boshqarish uchun yaratilgan zamonaviy admin panel. Loyiha React.js, Vite va Tailwind CSS yordamida qurilgan.

## ✨ **Asosiy xususiyatlar**

- 📱 **SIM-karta buyurtmalari** - E-SIM va fizik SIM-kartalarni boshqarish
- 🛍️ **Mahsulot buyurtmalari** - Mahsulotlarni buyurtma qilish va boshqarish
- 📊 **Dashboard** - Statistika va hisobotlar
- 🏢 **Filiallar boshqaruvi** - Filiallar va xodimlarni boshqarish
- 👥 **Mijozlar boshqaruvi** - Mijoz ma'lumotlarini saqlash va qidirish
- 💰 **To'lov tizimi** - Turli xil to'lov usullarini qo'llab-quvvatlash
- 📦 **Sklad boshqaruvi** - Mahsulotlarni kirim-chiqim qilish

## 🏗️ **Loyiha tuzilishi**

```
happytel-admin/
├── src/
│   ├── components/          # Qayta ishlatiluvchi komponentlar
│   │   ├── buttons/        # Tugmalar
│   │   ├── formElements/   # Form elementlari
│   │   ├── header/         # Sarlavha komponentlari
│   │   ├── sidebar/        # Yon panel
│   │   ├── tables/         # Jadvallar
│   │   ├── ui/             # UI komponentlari
│   │   └── simOrders/      # SIM buyurtma komponentlari
│   ├── hooks/              # Custom hooks
│   ├── pages/              # Sahifalar
│   ├── routes/             # Routing
│   ├── store/              # State management
│   ├── types/              # TypeScript tiplari
│   ├── utils/              # Utility funksiyalar
│   └── constants/          # Konstantalar
├── public/                 # Ommaviy fayllar
└── package.json           # Dependencies
```

## 🚀 **O'rnatish va ishga tushirish**

### 1. Dependencies o'rnatish

```bash
npm install
```

### 2. Development server ishga tushirish

```bash
npm run dev
```

### 3. Production build

```bash
npm run build
```

## 🛠️ **Texnologiyalar**

- **Frontend**: React 18, Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Routing**: React Router
- **Icons**: Lucide React
- **Forms**: Custom form components
- **Validation**: Custom validation utilities

## 📱 **Asosiy sahifalar**

### Dashboard

- Umumiy statistika
- Savdo grafiklari
- Top mahsulotlar

### SIM Buyurtmalari

- Region guruhlarini tanlash
- Tarif rejalarini ko'rish
- ICCID tanlash
- Mijoz ma'lumotlarini kiritish
- To'lov usullarini tanlash

### Mahsulotlar

- Mahsulotlar ro'yxati
- Mahsulot qo'shish/tahrirlash
- Mahsulot guruhlari

### Mijozlar

- Mijozlar ro'yxati
- Mijoz qo'shish/tahrirlash
- Mijoz qidirish

## 🔧 **Kod tuzilishi**

### SOLID tamoyillari

- **Single Responsibility**: Har bir komponent faqat bitta vazifani bajaradi
- **Open/Closed**: Komponentlar kengaytirish uchun ochiq, o'zgartirish uchun yopiq
- **Liskov Substitution**: Komponentlar o'rniga boshqa komponentlarni qo'yish mumkin
- **Interface Segregation**: Kichik va aniq interfeyslar
- **Dependency Inversion**: Yuqori darajadagi modullar past darajadagi modullarga bog'liq emas

### Komponentlar

- **Reusable**: Qayta ishlatiluvchi
- **Modular**: Mustaqil ishlaydigan
- **Testable**: Test qilish oson
- **Maintainable**: O'zgartirish oson

## 📁 **Fayl tuzilishi**

### Komponentlar

```
components/
├── buttons/           # Tugmalar
├── formElements/      # Form elementlari
├── header/           # Sarlavha
├── sidebar/          # Yon panel
├── tables/           # Jadvallar
├── ui/               # UI komponentlari
└── simOrders/        # SIM buyurtma komponentlari
    ├── RegionGroupSelector.jsx
    ├── PlansDisplay.jsx
    ├── SimCardsSelector.jsx
    ├── SimCardsTable.jsx
    ├── PersonalInfoForm.jsx
    ├── PaymentSection.jsx
    ├── PassportModal.jsx
    ├── FormActions.jsx
    └── index.js
```

### Hooks

```
hooks/
├── useApi.js         # API chaqiruvlari
├── useAuth.js        # Autentifikatsiya
├── useLocalStorage.js # Local storage
└── useSimOrder.js    # SIM buyurtma logikasi
```

### Utils

```
utils/
├── formValidation.js # Form validatsiya
├── toastHelper.js    # Toast xabarlar
├── formatNumber.js   # Raqamlarni formatlash
└── dateFormatter.js  # Sana formatlash
```

## 🎯 **Kelajak rejalari**

- [ ] TypeScript to'liq qo'llab-quvvatlash
- [ ] Unit testlar qo'shish
- [ ] E2E testlar
- [ ] Dark mode
- [ ] Responsive dizayn
- [ ] PWA qo'llab-quvvatlash
- [ ] Real-time yangilanishlar
- [ ] Export/Import funksiyalari

## 🤝 **Hissa qo'shish**

1. Repository ni fork qiling
2. Yangi branch yarating (`git checkout -b feature/yangi-xususiyat`)
3. O'zgarishlarni commit qiling (`git commit -am 'Yangi xususiyat qo'shildi'`)
4. Branch ni push qiling (`git push origin feature/yangi-xususiyat`)
5. Pull Request yarating

## 📄 **Litsenziya**

Bu loyiha MIT litsenziyasi ostida tarqatiladi.

## 📞 **Aloqa**

Savollar yoki takliflar uchun:

- Email: [email protected]
- Telegram: @happytel_support

---

**HappyTel Admin Panel** - Zamonaviy va samarali boshqaruv tizimi! 🚀
