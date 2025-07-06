import { cn } from "@/lib/utils";

interface FlowDeskIconProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function FlowDeskIcon({ className, size = 'md' }: FlowDeskIconProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className={cn(
      "bg-gradient-to-br from-slate-700 to-slate-900 dark:from-gray-700 dark:to-gray-900 rounded-lg flex items-center justify-center relative overflow-hidden",
      sizeClasses[size],
      className
    )}>
      {/* Subtle geometric pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1 left-1 w-2 h-2 bg-blue-400 rounded-sm transform rotate-45"></div>
        <div className="absolute bottom-1 right-1 w-1.5 h-1.5 bg-indigo-300 rounded-sm"></div>
      </div>
      
      {/* Main logo - minimalist "F" */}
      <div className="relative z-10 text-white font-bold text-sm tracking-tight flex items-center justify-center">
        <svg 
          viewBox="0 0 20 20" 
          className="w-5 h-5 fill-current"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            d="M4 3h12v3H8v3h6v3H8v5H4V3z" 
            className="fill-white"
          />
        </svg>
      </div>
      
      {/* Subtle glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent rounded-lg"></div>
    </div>
  );
}