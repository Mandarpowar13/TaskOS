export default function IconButton({ label, children, className = '', ...props }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={`inline-flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
