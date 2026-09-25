import { Construction } from 'lucide-react'

export function PlaceholderPage({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="rounded-full bg-slate-100 p-4">
        <Construction className="h-8 w-8 text-slate-500" />
      </div>
      <h1 className="mt-4 text-xl font-semibold text-slate-900">{title}</h1>
      <p className="mt-2 max-w-md text-center text-sm text-slate-600">{description}</p>
      <p className="mt-4 text-xs font-medium text-slate-400">Coming in Phase 2</p>
    </div>
  )
}
