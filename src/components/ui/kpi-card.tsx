import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string | number;
  change?: string;
  icon: LucideIcon;
  variant?: "default" | "success" | "warning" | "accent";
  className?: string;
}

export function KPICard({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  variant = "default",
  className 
}: KPICardProps) {
  const variants = {
    default: "border-primary/20 hover:border-primary/40",
    success: "border-success/20 hover:border-success/40", 
    warning: "border-warning/20 hover:border-warning/40",
    accent: "border-accent/20 hover:border-accent/40",
  };

  const iconVariants = {
    default: "text-primary bg-primary/10",
    success: "text-success bg-success/10",
    warning: "text-warning bg-warning/10", 
    accent: "text-accent bg-accent/10",
  };

  return (
    <div className={cn(
      "group relative overflow-hidden rounded-lg border bg-card p-6 shadow-card transition-all duration-300 hover:shadow-kpi hover:-translate-y-1",
      variants[variant],
      className
    )}>
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="flex items-baseline space-x-2">
            <p className="text-3xl font-bold text-foreground">{value}</p>
            {change && (
              <span className={cn(
                "text-sm font-medium",
                change.startsWith('+') ? "text-success" : change.startsWith('-') ? "text-destructive" : "text-muted-foreground"
              )}>
                {change}
              </span>
            )}
          </div>
        </div>
        <div className={cn(
          "flex h-12 w-12 items-center justify-center rounded-lg transition-transform group-hover:scale-110",
          iconVariants[variant]
        )}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
      
      {/* Gradient overlay for extra visual appeal */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-primary/5 opacity-0 transition-opacity group-hover:opacity-100" />
    </div>
  );
}