import { DomainConfig } from '@/lib/types'
import { TerminalWindow } from '@/components/terminal/TerminalTheme'

interface TextBoxProps {
  content: {
    text: string
    aiPrompt?: string
  }
  config: DomainConfig
}

export function TextBox({ content, config }: TextBoxProps) {
  const isDark = config.template.colorMode === 'dark'
  const isTerminal = config.template.theme === 'terminal'
  
  if (isTerminal) {
    return (
      <TerminalWindow title="output@system" isLightMode={!isDark}>
        <pre className={`text-sm whitespace-pre-wrap font-mono ${isDark ? 'text-green-400' : 'text-green-800'}`}>
          {content.text}
        </pre>
      </TerminalWindow>
    )
  }
  
  return (
    <div className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
      <p className="text-lg leading-relaxed">
        {content.text}
      </p>
    </div>
  )
}