import fs from 'node:fs'
import path from 'node:path'
import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * أرقام التواصل: تُقرأ من private/contact-phones.json (ملف خاص غير مرفوع إلى GitHub).
 * - أثناء التطوير (npm run dev): تظهر كل الأرقام للمراجعة مع تمييز غير المنشور.
 * - عند البناء للنشر: لا يدخل ملفات الموقع إلا رقم تحقق فيه الشرطان:
 *   اعتماد الإدارة (approved) وموافقة صاحبته (consent). البقية تُحذف ولا تظهر حتى في الكود.
 */
function contactPhones(): Plugin {
  const id = 'virtual:contact-phones'
  const resolved = '\0' + id
  let dev = false
  return {
    name: 'madar-contact-phones',
    configResolved(c) {
      dev = c.command === 'serve'
    },
    resolveId(source) {
      if (source === id) return resolved
    },
    load(source) {
      if (source !== resolved) return
      const file = path.resolve(process.cwd(), 'private/contact-phones.json')
      let data: { approved?: boolean; phones?: Record<string, { phone: string; consent?: boolean; whatsapp?: boolean }> } = {}
      if (fs.existsSync(file)) {
        this.addWatchFile(file)
        data = JSON.parse(fs.readFileSync(file, 'utf8'))
      }
      const approved = data.approved === true
      const out: Record<string, { phone: string; whatsapp: boolean; publishable: boolean }> = {}
      for (const [key, p] of Object.entries(data.phones ?? {})) {
        const publishable = approved && p.consent === true
        if (dev || publishable) out[key] = { phone: p.phone, whatsapp: p.whatsapp !== false, publishable }
      }
      return `export const NUMBERS_APPROVED = ${JSON.stringify(approved)};\nexport default ${JSON.stringify(out)};`
    },
  }
}

// المسار الأساسي: يُضبط تلقائيًا في GitHub Actions إلى /اسم-المستودع/
// ويمكن تغييره يدويًا عبر المتغير VITE_BASE في ملف .env
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    base: env.VITE_BASE || './',
    plugins: [react(), contactPhones()],
    build: {
      target: 'es2020',
      cssCodeSplit: true,
      rollupOptions: {
        output: {
          manualChunks: {
            react: ['react', 'react-dom', 'react-router-dom'],
          },
        },
      },
    },
  }
})
