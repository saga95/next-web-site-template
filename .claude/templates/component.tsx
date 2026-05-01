/**
 * [ComponentName] Component
 *
 * @description Brief description of what this component does
 * @tokens All values sourced from design-system/tokens.ts
 * @accessibility WCAG 2.1 AA compliant
 */

import React from 'react';
import { tokens } from '../../design-system/tokens';
import type { Theme } from '../../design-system/theme';

// ─── TYPES ──────────────────────────────────────────────────────────────────

type Size = 'sm' | 'md' | 'lg';
type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

interface ComponentNameProps {
  /** Primary content */
  children: React.ReactNode;
  /** Visual variant */
  variant?: Variant;
  /** Size scale */
  size?: Size;
  /** Disabled state */
  disabled?: boolean;
  /** Loading state */
  isLoading?: boolean;
  /** Additional CSS class */
  className?: string;
  /** ARIA label for accessibility */
  'aria-label'?: string;
}

// ─── SIZE MAP ───────────────────────────────────────────────────────────────

const sizeMap: Record<Size, React.CSSProperties> = {
  sm: {
    padding: `${tokens.spacing[1.5]} ${tokens.spacing[3]}`,
    fontSize: tokens.typography.fontSize.sm,
  },
  md: {
    padding: `${tokens.spacing[2]} ${tokens.spacing[4]}`,
    fontSize: tokens.typography.fontSize.base,
  },
  lg: {
    padding: `${tokens.spacing[3]} ${tokens.spacing[6]}`,
    fontSize: tokens.typography.fontSize.lg,
  },
};

// ─── COMPONENT ──────────────────────────────────────────────────────────────

export const ComponentName = React.forwardRef<
  HTMLDivElement,
  ComponentNameProps
>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      disabled = false,
      isLoading = false,
      className,
      'aria-label': ariaLabel,
      ...props
    },
    ref
  ) => {
    const baseStyles: React.CSSProperties = {
      fontFamily: tokens.typography.fontFamily.body,
      borderRadius: tokens.radius.md,
      transition: `all ${tokens.animation.duration.normal} ${tokens.animation.easing.easeInOut}`,
      ...sizeMap[size],
    };

    return (
      <div
        ref={ref}
        className={className}
        aria-label={ariaLabel}
        aria-disabled={disabled}
        style={baseStyles}
        {...props}
      >
        {isLoading ? <span aria-label='Loading...'>...</span> : children}
      </div>
    );
  }
);

ComponentName.displayName = 'ComponentName';

export default ComponentName;
