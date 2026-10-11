/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BASE?: string
  readonly VITE_API_URL?: string
}
interface ImportMeta {
  readonly env: ImportMetaEnv
}

/** أرقام التواصل المصفّاة وقت البناء (انظري vite.config.ts) */
declare module 'virtual:contact-phones' {
  const phones: Record<string, { phone: string; whatsapp: boolean; publishable: boolean }>
  export const NUMBERS_APPROVED: boolean
  export default phones
}
