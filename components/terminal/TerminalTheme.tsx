'use client';

import { useEffect, useRef } from 'react';

// Matrix Rain Background Component
interface MatrixRainProps {
  color?: string; // Hex color for the rain
  opacity?: string; // Opacity of the rain
}

export function MatrixRain({ color = '#00ff41', opacity = '0.2' }: MatrixRainProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      console.error('Canvas ref not found');
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('Could not get 2d context');
      return;
    }

    // Set initial canvas size
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    setCanvasSize();

    // Handle window resize
    const handleResize = () => {
      setCanvasSize();
    };
    window.addEventListener('resize', handleResize);

    const characters = '01ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*(){}[]<>?';
    const fontSize = 14;
    let columns = Math.floor(canvas.width / fontSize);
    let drops: number[] = [];

    // Initialize drops
    const initDrops = () => {
      columns = Math.floor(canvas.width / fontSize);
      drops = [];
      for (let i = 0; i < columns; i++) {
        drops[i] = Math.floor(Math.random() * -100);
      }
    };
    
    initDrops();

    const draw = () => {
      // Make sure canvas dimensions are set
      if (canvas.width === 0 || canvas.height === 0) {
        setCanvasSize();
        initDrops();
      }

      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = color;
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = characters.charAt(Math.floor(Math.random() * characters.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    // Start animation
    console.log('Starting Matrix rain animation');
    const interval = setInterval(draw, 100);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
    };
  }, [color]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0, 
        opacity,
        pointerEvents: 'none'
      }}
    />
  );
}

// Terminal Window Component
interface TerminalWindowProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  isLightMode?: boolean;
}

export function TerminalWindow({ title = 'terminal@domain:~$', children, className = '', isLightMode = false }: TerminalWindowProps) {
  return (
    <div className={`${isLightMode ? 'bg-white border-green-600' : 'bg-black border-green-500'} border rounded ${className}`}>
      <div className={`flex items-center justify-between px-4 py-2 ${isLightMode ? 'bg-green-50 border-green-600' : 'bg-gray-900 border-green-500'} border-b`}>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className={`w-3 h-3 ${isLightMode ? 'bg-green-600' : 'bg-green-500'} rounded-full`}></div>
        </div>
        <span className={`text-xs ${isLightMode ? 'text-green-700' : 'text-green-400'}`}>{title}</span>
      </div>
      <div className={`p-4 font-mono ${isLightMode ? 'text-green-800' : 'text-green-400'}`}>
        {children}
      </div>
    </div>
  );
}

// Terminal Button Component
interface TerminalButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  className?: string;
}

export function TerminalButton({ 
  onClick, 
  disabled, 
  loading, 
  children, 
  variant = 'primary',
  className = ''
}: TerminalButtonProps) {
  const baseClasses = 'py-3 px-4 border-2 rounded font-bold transition-all font-mono';
  const variantClasses = variant === 'primary' 
    ? 'border-green-500 text-green-400 hover:bg-green-500 hover:text-black'
    : 'border-green-800 text-green-400 hover:bg-green-900';
  
  const stateClasses = loading 
    ? 'border-yellow-500 text-yellow-500 animate-pulse'
    : disabled 
    ? 'border-gray-600 text-gray-600 cursor-not-allowed'
    : '';

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${stateClasses || variantClasses} ${className}`}
    >
      {loading ? '>>> PROCESSING...' : children}
    </button>
  );
}

// Terminal Modal Component
interface TerminalModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function TerminalModal({ isOpen, onClose, title, children }: TerminalModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      <div className="bg-black border-2 border-green-500 rounded max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-green-500">
          <h2 className="text-green-400 font-bold font-mono">{title}</h2>
          <button
            onClick={onClose}
            className="text-green-400 hover:text-red-400 text-xl"
          >
            ×
          </button>
        </div>
        <div className="p-6 font-mono">
          {children}
        </div>
      </div>
    </div>
  );
}

// Terminal Command Display Component
interface TerminalCommandProps {
  command: string;
  output: string[];
  timestamp?: string;
  type?: 'success' | 'error' | 'warning' | 'info';
}

export function TerminalCommand({ command, output, timestamp, type = 'info' }: TerminalCommandProps) {
  const typeColors = {
    success: 'text-green-400',
    error: 'text-red-400',
    warning: 'text-yellow-400',
    info: 'text-green-300'
  };

  return (
    <div className="mb-4">
      <div className="flex items-center space-x-2 text-green-300">
        {timestamp && <span className="text-green-600">[{timestamp}]</span>}
        <span className="text-green-400">$</span>
        <span>{command}</span>
      </div>
      <div className="ml-4 mt-1">
        {output.map((line, i) => (
          <div key={i} className={typeColors[type]}>
            {line}
          </div>
        ))}
      </div>
    </div>
  );
}

// Terminal Stats Widget
interface TerminalStatsProps {
  title: string;
  stats: { label: string; value: string | number; trend?: 'up' | 'down' | 'neutral' }[];
}

export function TerminalStats({ title, stats }: TerminalStatsProps) {
  return (
    <TerminalWindow title={title}>
      <div className="space-y-2 text-sm">
        {stats.map((stat, i) => (
          <div key={i} className="flex justify-between">
            <span className="text-green-300">{stat.label}:</span>
            <span className={
              stat.trend === 'up' ? 'text-green-400' :
              stat.trend === 'down' ? 'text-red-400' :
              'text-yellow-400'
            }>
              {stat.value}
            </span>
          </div>
        ))}
      </div>
    </TerminalWindow>
  );
}

// Terminal Input Component
interface TerminalInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
  type?: 'text' | 'email';
}

export function TerminalInput({ value, onChange, onSubmit, placeholder, type = 'text' }: TerminalInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && onSubmit) {
      onSubmit();
    }
  };

  return (
    <div className="flex items-center space-x-2 bg-black border border-green-800 rounded px-3 py-2">
      <span className="text-green-600">$</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        className="bg-transparent outline-none flex-1 text-green-400 font-mono placeholder-green-700"
        placeholder={placeholder}
      />
      <div className="w-2 h-4 bg-green-400 animate-pulse"></div>
    </div>
  );
}