'use client'

import { useState, useEffect, useRef } from 'react'
import { DomainConfig } from '@/lib/types'
import { TerminalWindow } from '@/components/terminal/TerminalTheme'

interface Command {
  command: string
  output: string[]
  type?: 'success' | 'error' | 'warning' | 'info' | 'audit' | 'analysis' | 'crawl' | 'rank'
  delay?: number // Optional delay before showing output
}

interface TerminalLogBoxProps {
  content: {
    title?: string
    commands: Command[]
    autoPlay?: boolean
    playInterval?: number // milliseconds between commands
    maxCommands?: number // max commands to show at once
    allowInput?: boolean
    loop?: boolean // whether to loop commands
    showTimestamp?: boolean
  }
  config: DomainConfig
}

export function TerminalLogBox({ content, config }: TerminalLogBoxProps) {
  const isDark = config.template.colorMode === 'dark'
  const isTerminal = config.template.theme === 'terminal'
  
  const [displayedCommands, setDisplayedCommands] = useState<Array<{
    id: string
    command: string
    output: string[]
    type?: string
    timestamp?: string
  }>>([])
  const [currentInput, setCurrentInput] = useState('')
  const [commandIndex, setCommandIndex] = useState(0)
  const terminalRef = useRef<HTMLDivElement>(null)
  
  const {
    commands = [],
    autoPlay = true,
    playInterval = 5000,
    maxCommands = 10,
    allowInput = false,
    loop = true,
    showTimestamp = true,
    title = 'terminal@system'
  } = content

  // Auto-play commands
  useEffect(() => {
    if (!autoPlay || commands.length === 0) return

    let intervalId: NodeJS.Timeout

    // Function to add a command
    const addCommand = (index: number) => {
      const cmd = commands[index % commands.length]
      const newCommand = {
        id: `cmd-${Date.now()}-${index}`,
        command: cmd.command,
        output: cmd.output,
        type: cmd.type,
        timestamp: showTimestamp ? new Date().toLocaleTimeString() : undefined
      }

      setDisplayedCommands(prev => {
        const updated = [...prev, newCommand]
        return updated.slice(-maxCommands) // Keep only last N commands
      })
    }

    // Show first command after 1 second
    const initialTimeout = setTimeout(() => {
      addCommand(0)
      setCommandIndex(1)
      
      // Then continue with regular interval starting from second command
      intervalId = setInterval(() => {
        setCommandIndex(prev => {
          const next = prev
          if (!loop && next >= commands.length) {
            clearInterval(intervalId)
            return prev
          }
          addCommand(next)
          return next + 1
        })
      }, playInterval)
    }, 1000)

    return () => {
      clearTimeout(initialTimeout)
      if (intervalId) clearInterval(intervalId)
    }
  }, [autoPlay, commands, loop, maxCommands, playInterval, showTimestamp])

  // Auto-scroll to bottom
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [displayedCommands])

  // Handle user input
  const handleCommand = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && currentInput.trim() && allowInput) {
      const newCommand = {
        id: `user-${Date.now()}`,
        command: currentInput,
        output: ['Command executed successfully', 'Ready for next command...'],
        type: 'success',
        timestamp: showTimestamp ? new Date().toLocaleTimeString() : undefined
      }
      
      setDisplayedCommands(prev => {
        const updated = [...prev, newCommand]
        return updated.slice(-maxCommands)
      })
      setCurrentInput('')
    }
  }

  // Get color based on output type
  const getOutputColor = (type?: string, line?: string) => {
    // Check line content for special markers
    if (line) {
      if (line.includes('✓') || line.includes('PASSED')) {
        return isTerminal 
          ? (isDark ? 'text-green-400' : 'text-green-600')
          : (isDark ? 'text-green-400' : 'text-green-600')
      }
      if (line.includes('✗') || line.includes('FAILED')) {
        return isTerminal
          ? (isDark ? 'text-red-400' : 'text-red-600')
          : (isDark ? 'text-red-400' : 'text-red-600')
      }
      if (line.includes('⚠') || line.includes('WARNING')) {
        return isTerminal
          ? (isDark ? 'text-yellow-400' : 'text-yellow-600')
          : (isDark ? 'text-yellow-400' : 'text-yellow-600')
      }
    }

    // Check type
    switch(type) {
      case 'success':
      case 'audit':
        return isTerminal 
          ? (isDark ? 'text-green-400' : 'text-green-600')
          : (isDark ? 'text-green-400' : 'text-green-600')
      case 'error':
        return isTerminal
          ? (isDark ? 'text-red-400' : 'text-red-600')
          : (isDark ? 'text-red-400' : 'text-red-600')
      case 'warning':
        return isTerminal
          ? (isDark ? 'text-yellow-400' : 'text-yellow-600')
          : (isDark ? 'text-yellow-400' : 'text-yellow-600')
      default:
        return isTerminal
          ? (isDark ? 'text-green-300' : 'text-green-700')
          : (isDark ? 'text-gray-300' : 'text-gray-700')
    }
  }

  const terminalContent = (
    <div
      ref={terminalRef}
      className={`h-96 overflow-y-auto p-4 text-sm font-mono ${
        isTerminal ? '' : (isDark ? 'bg-gray-900' : 'bg-gray-50')
      }`}
    >
      {displayedCommands.map((cmd) => (
        <div key={cmd.id} className="mb-4">
          <div className={`flex items-center space-x-2 ${
            isTerminal 
              ? (isDark ? 'text-green-300' : 'text-green-700')
              : (isDark ? 'text-gray-400' : 'text-gray-600')
          }`}>
            {cmd.timestamp && (
              <span className={isTerminal 
                ? (isDark ? 'text-green-600' : 'text-green-800')
                : (isDark ? 'text-gray-500' : 'text-gray-500')
              }>
                [{cmd.timestamp}]
              </span>
            )}
            <span className={isTerminal 
              ? (isDark ? 'text-green-400' : 'text-green-700')
              : (isDark ? 'text-blue-400' : 'text-blue-600')
            }>
              $
            </span>
            <span>{cmd.command}</span>
          </div>
          <div className="ml-4 mt-1">
            {cmd.output.map((line, i) => (
              <div
                key={i}
                className={getOutputColor(cmd.type, line)}
              >
                {line}
              </div>
            ))}
          </div>
        </div>
      ))}
      
      {/* Command Input */}
      {allowInput && (
        <div className={`flex items-center space-x-2 ${
          isTerminal 
            ? (isDark ? 'text-green-400' : 'text-green-700')
            : (isDark ? 'text-gray-300' : 'text-gray-700')
        }`}>
          <span className={isTerminal 
            ? (isDark ? 'text-green-600' : 'text-green-800')
            : (isDark ? 'text-blue-400' : 'text-blue-600')
          }>
            $
          </span>
          <input
            type="text"
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            onKeyDown={handleCommand}
            className={`bg-transparent outline-none flex-1 font-mono ${
              isTerminal 
                ? (isDark ? 'text-green-400' : 'text-green-700')
                : (isDark ? 'text-gray-300' : 'text-gray-700')
            }`}
            placeholder="Enter command..."
          />
          <div className={`w-2 h-4 animate-pulse ${
            isTerminal 
              ? (isDark ? 'bg-green-400' : 'bg-green-700')
              : (isDark ? 'bg-blue-400' : 'bg-blue-600')
          }`}></div>
        </div>
      )}
    </div>
  )

  if (isTerminal) {
    return (
      <TerminalWindow title={title} isLightMode={!isDark}>
        {terminalContent}
      </TerminalWindow>
    )
  }

  return (
    <div className={`border rounded-lg overflow-hidden ${
      isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    }`}>
      <div className={`px-4 py-2 border-b font-mono text-sm ${
        isDark 
          ? 'bg-gray-900 border-gray-700 text-gray-400' 
          : 'bg-gray-100 border-gray-200 text-gray-600'
      }`}>
        {title}
      </div>
      {terminalContent}
    </div>
  )
}