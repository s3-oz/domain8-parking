import { DomainConfig } from '@/lib/types'

interface AdAlertBoxProps {
  content: {
    type?: 'warning' | 'info' | 'success'
    message: string
    cta?: string
  }
  config: DomainConfig
}

export function AdAlertBox({ content, config }: AdAlertBoxProps) {
  const isDark = config.template.colorMode === 'dark'
  const isTerminal = config.template.theme === 'terminal'
  
  const getAlertStyles = () => {
    if (isTerminal) {
      return isDark 
        ? 'bg-green-900/20 border-green-500 text-green-400'
        : 'bg-green-50 border-green-600 text-green-700'
    }
    if (isDark) {
      switch(content.type) {
        case 'warning': return 'bg-yellow-900/20 border-yellow-800 text-yellow-400'
        case 'success': return 'bg-green-900/20 border-green-800 text-green-400'
        default: return 'bg-blue-900/20 border-blue-800 text-blue-400'
      }
    } else {
      switch(content.type) {
        case 'warning': return 'bg-yellow-50 border-yellow-200 text-yellow-800'
        case 'success': return 'bg-green-50 border-green-200 text-green-800'
        default: return 'bg-blue-50 border-blue-200 text-blue-800'
      }
    }
  }
  
  const getIcon = () => {
    switch(content.type) {
      case 'warning': return '⚡'
      case 'success': return '✅'
      default: return 'ℹ️'
    }
  }
  
  return (
    <div className={`border-2 rounded-lg p-4 ${getAlertStyles()} ${isTerminal ? 'font-mono' : ''}`}>
      <div className="flex items-center justify-between">
        <div>
          <div className={`text-xs mb-1 ${isTerminal ? 'text-yellow-400' : 'opacity-75'}`}>
            {isTerminal ? '[!]' : getIcon()} {isTerminal ? '// SPECIAL OFFER' : 'SPECIAL OFFER'}
          </div>
          <div className="font-bold">{content.message}</div>
        </div>
        {content.cta && (
          <button className={`px-4 py-2 text-sm rounded font-bold transition ${
            isTerminal 
              ? 'border border-green-500 hover:bg-green-500 hover:text-black'
              : isDark 
              ? 'bg-white/10 hover:bg-white/20 text-white' 
              : 'bg-black/5 hover:bg-black/10'
          }`}>
            {content.cta}
          </button>
        )}
      </div>
    </div>
  )
}