import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface MetricsCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: LucideIcon;
  iconColor: string;
  trend?: "up" | "down";
}

export function MetricsCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  iconColor,
  trend 
}: MetricsCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm font-medium">{title}</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
            <p className={cn(
              "text-sm mt-1 flex items-center gap-1",
              trend === "up" ? "text-green-600" : "text-gray-600"
            )}>
              {trend === "up" && "↗"}
              {subtitle}
            </p>
          </div>
          <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center", iconColor)}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
