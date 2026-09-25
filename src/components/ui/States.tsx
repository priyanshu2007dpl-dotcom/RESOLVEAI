export function LoadingSpinner({ label }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-slate-700" />
      {label && <p className="text-sm text-slate-600">{label}</p>}
    </div>
  )
}

export function ErrorState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-12">
      <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
        {message}
      </div>
    </div>
  )
}
