import { cn } from '@/lib/utils'

interface EmptyProps {
  icon?: string;
  title?: string;
  subtitle?: string;
  className?: string;
}

export default function Empty({ icon, title, subtitle, className }: EmptyProps) {
  return (
    <div className={cn('flex h-full items-center justify-center', className)}>
      {icon || title || subtitle ? (
        <div className="text-center py-12">
          {icon && (
            <div className="text-6xl mb-4 opacity-50">{icon}</div>
          )}
          {title && (
            <p
              className="text-lg font-medium text-stone-600 mb-2"
              style={{ fontFamily: "'Lora', serif" }}
            >
              {title}
            </p>
          )}
          {subtitle && (
            <p
              className="text-sm text-stone-400"
              style={{ fontFamily: "'Lora', serif" }}
            >
              {subtitle}
            </p>
          )}
        </div>
      ) : (
        <span>Empty</span>
      )}
    </div>
  )
}
