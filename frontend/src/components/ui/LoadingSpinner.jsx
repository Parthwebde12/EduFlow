
const sizes = {
  sm: 'w-4 h-4 border-2',
  md: 'w-6 h-6 border-2',
  lg: 'w-10 h-10 border-3',
};

export default function LoadingSpinner({ size = 'md', className = '' }) {
  return (
    <div className={`
      ${sizes[size]} 
      border-slate-200 dark:border-slate-700 
      border-t-primary-500 
      rounded-full animate-spin
      ${className}
    `} />
  );
}