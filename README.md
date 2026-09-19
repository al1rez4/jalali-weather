# تقویم هواشناسی شمسی ☀️

تقویم شمسی حرفه‌ای با پیش‌بینی دقیق هواشناسی، میانگین آماری تاریخی، مناسبت‌ها و تعطیلات رسمی

## ویژگی‌ها

- 📅 تقویم شمسی کامل با تبدیل به میلادی و قمری
- 🌤️ پیش‌بینی هواشناسی ۱۶ روزه
- 📊 میانگین آماری ۶ ساله
- 🎉 مناسبت‌ها و تعطیلات رسمی
- 📈 نمودار دما و پیش‌بینی ساعتی
- 🌙 تم تاریک و روشن
- 📱 طراحی ریسپانسیو

## راه‌اندازی محلی

فقط فایل `index.html` را در مرورگر باز کنید یا از یک سرور محلی استفاده کنید:

```bash
# با Python
python -m http.server 8000

# با Node.js
npx http-server -p 8000
```

## آپلود روی Cloudflare Pages

### روش ۱: آپلود مستقیم (بدون Git)

1. به [dash.cloudflare.com](https://dash.cloudflare.com) بروید
2. وارد حساب خود شوید (یا ثبت‌نام کنید)
3. از منوی سمت چپ، **Workers & Pages** را انتخاب کنید
4. روی دکمه **Create** کلیک کنید
5. تب **Pages** را انتخاب کنید
6. **Upload assets** را انتخاب کنید
7. نام پروژه را وارد کنید (مثلاً: `taghvim-shamsi`)
8. همه فایل‌های پروژه را انتخاب و آپلود کنید:
   - `index.html`
   - `styles.css`
   - `app.js`
   - `manifest.json`
   - `sw.js`
   - `icon.svg`
   - `robots.txt`
   - `sitemap.xml`
9. روی **Deploy** کلیک کنید

سایت شما در آدرس `https://PROJECT-NAME.pages.dev` در دسترس خواهد بود.

### روش ۲: با Git (توصیه می‌شود)

1. **مخزن Git ایجاد کنید:**

```bash
git init
git add .
git commit -m "Initial commit: تقویم شمسی + هواشناسی"
```

2. **مخزن را به GitHub یا GitLab بفرستید:**

```bash
# GitHub
git remote add origin https://github.com/USERNAME/taghvim-shamsi.git
git branch -M main
git push -u origin main
```

3. **در Cloudflare Pages:**
   - Workers & Pages → Create
   - **Connect to Git** را انتخاب کنید
   - مخزن خود را متصل کنید
   - تنظیمات Build نیاز ندارد (سایت استاتیک است)
   - Deploy کنید

### اتصال دامنه شخصی

1. در پروژه Cloudflare Pages خود، به **Custom domains** بروید
2. **Set up a custom domain** را کلیک کنید
3. دامنه خود را وارد کنید
4. دستورالعمل‌های DNS را دنبال کنید

## تنظیمات قبل از انتشار

قبل از آپلود، این موارد را بررسی کنید:

- [ ] دامنه خود را در `index.html` جایگزین کنید (جایگزین `your-domain.com`)
- [ ] دامنه را در `sitemap.xml` تغییر دهید
- [ ] دامنه را در `robots.txt` تغییر دهید
- [ ] شماره کارت و نام را در بخش حمایت مالی تغییر دهید

## فایل‌های پروژه

```
test/
├── index.html          # صفحه اصلی
├── styles.css          # استایل‌ها
├── app.js              # منطق برنامه
├── manifest.json       # PWA manifest
├── sw.js               # Service Worker
├── icon.svg            # آیکون سایت
├── robots.txt          # دستورالعمل‌های ربات‌ها
├── sitemap.xml         # نقشه سایت
└── README.md           # این فایل
```

## منابع داده

- **پیش‌بینی هوا:** Open-Meteo API (ECMWF/GFS models)
- **موقعیت جغرافیایی:** Open-Meteo Geocoding API
- **مناسبت‌های قمری:** تقویم رسمی ایران برای ۱۴۰۴ و ۱۴۰۵

## پشتیبانی

برای گزارش باگ یا پیشنهاد ویژگی جدید، لطفاً Issue ایجاد کنید.

## لایسنس

این پروژه تحت لایسنس MIT منتشر شده است.

---

ساخته شده با ❤️ در ایران
