import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface KpiWidgetProps {
  title: string;
  count: number;
  icon: LucideIcon;
  variant: 'primary' | 'success' | 'danger';
  pulse?: boolean;
}

const KpiWidget = ({ title, count, icon: Icon, variant, pulse = false }: KpiWidgetProps) => {
  const variantStyles = {
    primary: {
      iconColor: 'text-[hsl(var(--brand-primary))]',
      countColor: 'text-[hsl(var(--brand-primary))]',
      bgColor: 'bg-[hsl(var(--brand-primary)/0.05)]'
    },
    success: {
      iconColor: 'text-[hsl(var(--brand-success))]',
      countColor: 'text-[hsl(var(--brand-success))]',
      bgColor: 'bg-[hsl(var(--brand-success)/0.05)]'
    },
    danger: {
      iconColor: 'text-[hsl(var(--brand-danger))]',
      countColor: 'text-[hsl(var(--brand-danger))]',
      bgColor: 'bg-[hsl(var(--brand-danger)/0.05)]'
    }
  };

  const styles = variantStyles[variant];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-xl border border-border p-6 ${styles.bgColor} ${
        pulse && count > 0 ? 'animate-pulse' : ''
      }`}
    >
      <div className="flex items-center space-x-4">
        <div className={`p-3 rounded-full ${styles.bgColor}`}>
          <Icon className={`h-6 w-6 ${styles.iconColor}`} />
        </div>
        <div>
          <p className={`text-3xl font-bold ${styles.countColor}`}>
            {count}
          </p>
          <p className="text-sm font-medium text-muted-foreground mt-1">
            {title}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default KpiWidget;