# Study Flow - مخطط الدراسة الذكي 📚

نظام دراسة مُلعَّب يساعدك على تحقيق أهدافك الدراسية بطريقة ممتعة ومنظمة.

## المميزات ✨

- **نظام Onboarding ذكي**: إدخال بيانات المواد والدروس بطريقة سهلة
- **جدول دراسي موحد**: توزيع تلقائي للدروس على الأيام المتاحة
- **وضع التركيز**: مؤقت دراسة مع تنبيهات وتشجيع
- **تتبع التقدم**: إحصائيات وتقارير عن الإنجاز
- **نظام Streak**: تحفيز للاستمرارية
- **دعم اللغتين**: العربية والإنجليزية
- **الوضع الليلي**: حماية للعين
- **تأثيرات بصرية**: رسوم متحركة وconfetti عند الإنجاز
- **⚡ PWA**: يشتغل كتطبيق على الموبايل والكمبيوتر
- **📴 Offline**: يشتغل بدون نت بعد التثبيت
- **🚀 سريع جداً**: يحمل في أقل من ثانية

## التقنيات المستخدمة 🛠️

- **Next.js 14**: React framework
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling
- **Framer Motion**: Animations
- **Lucide React**: Icons
- **Canvas Confetti**: Celebrations
- **PWA**: Progressive Web App

## التثبيت والتشغيل 🚀

```bash
# تثبيت المكتبات
npm install

# تشغيل المشروع
npm run dev

# بناء للإنتاج
npm run build
npm start
```

افتح [http://localhost:3000](http://localhost:3000) في المتصفح.

## تثبيت التطبيق على جهازك 📱

### خطوات سريعة:
1. افتح الموقع في المتصفح
2. اضغط على زر "تنزيل التطبيق" اللي هيظهر
3. أو من قائمة المتصفح اختر "Add to Home Screen"
4. التطبيق هيظهر على الشاشة الرئيسية! 🎉

**للتفاصيل الكاملة، شوف ملف [INSTALL.md](INSTALL.md)**

## إنشاء الأيقونات 🎨

1. افتح `public/generate-icons.html` في المتصفح
2. حمّل الأيقونات (192x192 و 512x512)
3. احفظهم في مجلد `public`

## البنية 📁

```
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout with PWA meta
│   ├── page.tsx           # Main page
│   └── globals.css        # Global styles + performance
├── components/
│   ├── onboarding/        # Onboarding screens
│   ├── dashboard/         # Dashboard components
│   ├── AnimatedBackground.tsx
│   ├── ClientProviders.tsx # Context + SW registration
│   └── PWAInstallPrompt.tsx # Install prompt
├── lib/
│   ├── context.tsx        # App context
│   └── translations.ts    # i18n translations
├── public/
│   ├── manifest.json      # PWA manifest
│   ├── sw.js             # Service Worker
│   ├── generate-icons.html # Icon generator
│   └── offline.html       # Offline fallback
└── next.config.js         # Next.js config + PWA headers
```

## الاستخدام 📖

1. **الترحيب**: أدخل اسمك
2. **المعلومات**: اختر السنة الدراسية والبلد
3. **عدد المواد**: حدد كم مادة تريد دراستها
4. **تفاصيل المواد**: لكل مادة أدخل:
   - اسم المادة
   - الدروس
   - تاريخ الامتحان
   - أيام المراجعة
5. **Dashboard**: ابدأ الدراسة وتتبع تقدمك

## الأداء ⚡

- **First Contentful Paint**: < 1s
- **Time to Interactive**: < 1.5s
- **Bundle Size**: ~200KB
- **Lighthouse Score**: 95+

**للتفاصيل، شوف ملف [PERFORMANCE.md](PERFORMANCE.md)**

## المميزات التقنية 🔧

### PWA Features:
- ✅ Service Worker للتخزين المؤقت
- ✅ Manifest للتثبيت
- ✅ Offline Support
- ✅ Install Prompt
- ✅ App-like Experience

### Performance:
- ✅ Code Splitting
- ✅ Tree Shaking
- ✅ Image Optimization
- ✅ Compression
- ✅ Caching Strategy

### Accessibility:
- ✅ RTL Support
- ✅ Dark Mode
- ✅ Reduced Motion
- ✅ Touch Optimization
- ✅ Keyboard Navigation

## المساهمة 🤝

المشروع مفتوح المصدر. يمكنك المساهمة بـ:
- تحسينات في الكود
- إضافة مميزات جديدة
- إصلاح الأخطاء
- تحسين الترجمة
- تحسين الأداء

## الترخيص 📄

MIT License

---

صنع بـ ❤️ للطلاب المجتهدين

