import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarDays, Download } from "lucide-react";

interface AnalyticsFiltersProps {
  dateRange: string;
  onDateRangeChange: (range: string) => void;
  onExport?: () => void;
  showExport?: boolean;
}

export function AnalyticsFilters({ 
  dateRange, 
  onDateRangeChange, 
  onExport,
  showExport = true 
}: AnalyticsFiltersProps) {
  return (
    <Card>
      <CardContent className="flex flex-col sm:flex-row gap-4 items-center justify-between p-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Time Period:</span>
          </div>
          
          <Select value={dateRange} onValueChange={onDateRangeChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 3 months</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {showExport && onExport && (
          <Button variant="outline" onClick={onExport} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Data
          </Button>
        )}
      </CardContent>
    </Card>
  );
}