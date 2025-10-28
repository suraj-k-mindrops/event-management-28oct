import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  description?: string;
  isLoading?: boolean;
}

export function StatCard({ title, value, icon: Icon, trend, description, isLoading = false }: StatCardProps) {
  return (
    <Card className="bg-card border border-border hover:shadow-md transition-all">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          {title}
        </CardTitle>
        <div className="h-9 w-9 rounded bg-primary flex items-center justify-center">
          <Icon className="h-4 w-4 text-white" />
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="animate-pulse">
            <div className="h-6 w-20 bg-muted rounded mb-2" />
            <div className="h-3 w-28 bg-muted rounded mb-1" />
            <div className="h-3 w-24 bg-muted rounded" />
          </div>
        ) : (
          <>
            <div className="text-2xl font-bold text-foreground">{value}</div>
            {description && (
              <p className="text-xs text-muted-foreground mt-1">{description}</p>
            )}
            {trend && (
              <div className="flex items-center mt-2 text-xs">
                <span
                  className={
                    trend.isPositive ? "text-green-600 font-semibold" : "text-red-600 font-semibold"
                  }
                >
                  {trend.isPositive ? "↑ " : "↓ "}
                  {trend.value}%
                </span>
                <span className="text-muted-foreground ml-1">vs last month</span>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
