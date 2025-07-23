import { TrendingUp, DollarSign, Calendar, Users, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EarningsSummary } from '@/types/booking';

interface EarningsSummaryCardProps {
  summary: EarningsSummary;
  onDownloadReport?: () => void;
}

export function EarningsSummaryCard({ summary, onDownloadReport }: EarningsSummaryCardProps) {
  const summaryItems = [
    {
      title: 'Total Earnings',
      value: `R${summary.totalEarnings.toLocaleString()}`,
      icon: DollarSign,
      description: `R${summary.monthlyEarnings.toLocaleString()} this month`,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Total Bookings',
      value: summary.totalBookings.toString(),
      icon: Calendar,
      description: `${summary.monthlyBookings} this month`,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Completed Bookings',
      value: summary.completedBookings.toString(),
      icon: Users,
      description: `${Math.round((summary.completedBookings / summary.totalBookings) * 100)}% completion rate`,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Average Booking',
      value: `R${summary.averageBookingValue.toLocaleString()}`,
      icon: TrendingUp,
      description: 'Per booking value',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Summary Header */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl">Earnings Overview</CardTitle>
            <p className="text-muted-foreground">
              Your revenue and booking performance
            </p>
          </div>
          <div className="flex items-center gap-2">
            {summary.pendingPayouts > 0 && (
              <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                R{summary.pendingPayouts.toLocaleString()} pending
              </Badge>
            )}
            <Button variant="outline" onClick={onDownloadReport}>
              <Download className="h-4 w-4 mr-2" />
              Download Report
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Summary Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {summaryItems.map((item) => (
          <Card key={item.title}>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <div className={`p-2 rounded-lg ${item.bgColor}`}>
                  <item.icon className={`h-4 w-4 ${item.color}`} />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    {item.title}
                  </p>
                  <p className="text-2xl font-bold">{item.value}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pending Payouts Alert */}
      {summary.pendingPayouts > 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-yellow-600" />
              <div>
                <h4 className="font-medium text-yellow-800">
                  Pending Payouts: R{summary.pendingPayouts.toLocaleString()}
                </h4>
                <p className="text-sm text-yellow-700">
                  Your earnings will be processed within 3-5 business days after booking completion.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}