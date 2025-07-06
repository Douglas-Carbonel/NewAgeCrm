import { ReactNode } from "react";

interface PageLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

export function PageLayout({ children, title, description }: PageLayoutProps) {
  return (
    <div className="min-h-screen w-full flex flex-col bg-slate-50 dark:bg-slate-900">
      {title && (
        <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{title}</h1>
            {description && (
              <p className="text-slate-600 dark:text-slate-400 mt-1">{description}</p>
            )}
          </div>
        </div>
      )}
      <div className="flex-1 p-6 w-full max-w-7xl mx-auto">
        {children}
      </div>
    </div>
  );
}