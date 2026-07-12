import { Construction } from 'lucide-react'

export default function PagePlaceholder({ title, description }) {
  return (
    <section className="card flex min-h-[420px] flex-col items-center justify-center p-8 text-center">
      <div className="mb-5 rounded-2xl bg-blue-50 p-4 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"><Construction size={28} /></div>
      <h1 className="text-xl font-semibold text-slate-900 dark:text-white">{title}</h1>
      <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500 dark:text-slate-400">{description}</p>
    </section>
  )
}
