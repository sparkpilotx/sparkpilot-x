import { cn } from '../../lib/cn'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'destructive' | 'ghost'
}

export const Button = ({
  className,
  variant = 'default',
  ...props
}: ButtonProps): React.JSX.Element => {
  return (
    <button
      data-variant={variant}
      className={cn(
        'inline-flex items-center justify-center select-none font-medium',
        'rounded-[var(--xs-radius)]',
        'px-[var(--xs-px)]',
        // lock button visual height to xs-height with compact line-height
        'h-[var(--xs-height)] leading-[1] text-[var(--xs-font-size)]',
        'shadow-[inset_0_0_0_1px_rgba(0,0,0,0.06)]',
        'bg-white text-black hover:bg-[rgba(0,0,0,0.03)] active:bg-[rgba(0,0,0,0.06)]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)] focus-visible:ring-offset-1',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        className,
      )}
      {...props}
    />
  )
}
