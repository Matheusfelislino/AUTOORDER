import { MessageSquare } from 'lucide-react'

export function RawMessage({ content }: { content: string | null }) {
  if (!content) return null
  return (
    <div className="mx-6 mt-5">
      <div className="flex items-center gap-1.5 mb-2">
        <MessageSquare size={12} className="text-gray-400" />
        <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
          Mensagem original do cliente
        </span>
      </div>
      <blockquote className="bg-gray-50 border-l-2 border-gray-300 rounded-r-lg px-4 py-3 text-sm text-gray-600 italic leading-relaxed">
        "{content}"
      </blockquote>
    </div>
  )
}
