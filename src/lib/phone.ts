/** أدوات أرقام الجوال السعودية */

/** 0597465591 → 966597465591 */
export function toInternational(local: string): string {
  const d = local.replace(/\D/g, '')
  if (d.startsWith('966')) return d
  if (d.startsWith('0')) return '966' + d.slice(1)
  return '966' + d
}

/** للاتصال المباشر */
export const telHref = (local: string) => `tel:+${toInternational(local)}`

/** لفتح محادثة واتساب */
export const whatsappHref = (local: string) => `https://wa.me/${toInternational(local)}`

/** 0597465591 → 059 746 5591 (يُعرض باتجاه من اليسار لليمين) */
export function formatLocal(local: string): string {
  const d = local.replace(/\D/g, '')
  return d.length === 10 ? `${d.slice(0, 3)} ${d.slice(3, 6)} ${d.slice(6)}` : local
}
