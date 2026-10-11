/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Almarai', 'Tajawal', 'system-ui', 'sans-serif'],
      },
      colors: {
        // الخزامى الهادئ — للأفعال والروابط
        lav: {
          25: '#FBFAFF', 50: '#F4F1FC', 100: '#E9E3F8', 200: '#D6CBF1', 300: '#B9A9E5',
          400: '#9A84D6', 500: '#7F68C6', 600: '#6A53B3', 700: '#574396', 800: '#45357A', 900: '#2F2456',
        },
        // الأخضر المريمي — للتوجيه والنجاح
        sage: {
          50: '#F1F7F2', 100: '#E1EEE3', 200: '#C5DEC9', 300: '#A2C9A9', 400: '#7FB087',
          500: '#5F9668', 600: '#4A7A53', 700: '#3B6142',
        },
        // حبر العناوين — مستمد من الأزرق المخضر في شعار المدرسة
        ink: {
          900: '#123A3D', 800: '#1A4C50', 700: '#2C5F62', 600: '#4D6E70', 500: '#6C8587', 400: '#97A9AA', 200: '#D6DFDF',
        },
        // ذهبي الشعار — يُستخدم في موضع واحد فقط (قيمة الأسبوع)
        gold: { 100: '#F5ECDD', 500: '#B08A55', 700: '#80602F' },
        cream: '#FCF7F1',
      },
      // Almarai متوفر بالأوزان 300/400/700/800 فقط
      fontWeight: { light: '300', normal: '400', medium: '700', semibold: '800', bold: '800', extrabold: '800' },
      borderRadius: { xl2: '1.25rem', arch: '999px 999px 1.5rem 1.5rem' },
      boxShadow: {
        soft: '0 1px 2px rgba(47,36,86,.05), 0 10px 28px -14px rgba(87,67,150,.28)',
        lift: '0 2px 6px rgba(47,36,86,.06), 0 22px 48px -20px rgba(87,67,150,.45)',
        glow: '0 12px 32px -12px rgba(106,83,179,.55)',
      },
      maxWidth: { prose: '68ch' },
    },
  },
  plugins: [],
}
