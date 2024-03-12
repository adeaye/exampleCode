import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import Icon, { IconName } from '@components/v1/platform/molecules/Icon';
import classNames from 'classnames';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-x-1 rounded-md border px-[6px] py-[2px] text-xs',
  {
    variants: {
      variant: {
        success: 'border-rp-green-200 bg-rp-green-50 text-rp-green-600',
        warning: 'border-rp-orange-200 bg-rp-orange-50 text-rp-orange-600',
        danger: 'border-rp-red-200 bg-rp-red-50 text-rp-red-600',
        info: 'border-rp-blue-200 bg-rp-blue-50 text-rp-blue-600',
      },
    },
    defaultVariants: {
      variant: 'success',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  icon?: IconName;
}

function Badge({ className, variant, children, icon, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props}>
      {icon ? <Icon icon={icon} className={classNames('h-4 w-4')} /> : null}
      {children}
    </div>
  );
}

export { Badge, badgeVariants };
