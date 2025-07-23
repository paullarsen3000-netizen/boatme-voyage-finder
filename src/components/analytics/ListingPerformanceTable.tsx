import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ListingPerformance } from "@/lib/analyticsData";

interface ListingPerformanceTableProps {
  listings: ListingPerformance[];
}

export function ListingPerformanceTable({ listings }: ListingPerformanceTableProps) {
  const getConversionColor = (rate: number) => {
    if (rate >= 4.5) return "bg-green-100 text-green-800";
    if (rate >= 3.5) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Performing Listings</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Listing Name</TableHead>
              <TableHead className="text-right">Bookings</TableHead>
              <TableHead className="text-right">Earnings</TableHead>
              <TableHead className="text-right">Views</TableHead>
              <TableHead className="text-right">Conversion</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {listings.map((listing) => (
              <TableRow key={listing.id}>
                <TableCell className="font-medium">
                  {listing.name}
                </TableCell>
                <TableCell className="text-right">
                  {listing.bookings}
                </TableCell>
                <TableCell className="text-right">
                  R{listing.earnings.toLocaleString()}
                </TableCell>
                <TableCell className="text-right">
                  {listing.views}
                </TableCell>
                <TableCell className="text-right">
                  <Badge 
                    variant="secondary" 
                    className={getConversionColor(listing.conversionRate)}
                  >
                    {listing.conversionRate}%
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}