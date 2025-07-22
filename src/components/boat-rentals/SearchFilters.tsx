import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, MapPin } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface SearchFiltersProps {
  onFiltersChange: (filters: any) => void
}

export function SearchFilters({ onFiltersChange }: SearchFiltersProps) {
  const [location, setLocation] = useState("")
  const [boatType, setBoatType] = useState("all")
  const [waterBody, setWaterBody] = useState("all")
  const [priceRange, setPriceRange] = useState([0, 5000])
  const [availableOnly, setAvailableOnly] = useState(true)
  const [checkIn, setCheckIn] = useState<Date>()
  const [checkOut, setCheckOut] = useState<Date>()

  const handleFilterChange = () => {
    onFiltersChange({
      location,
      boatType,
      waterBody,
      priceRange,
      availableOnly,
      checkIn,
      checkOut
    })
  }

  // Apply filters whenever any filter changes
  useEffect(() => {
    handleFilterChange()
  }, [location, boatType, waterBody, priceRange, availableOnly, checkIn, checkOut])

  return (
    <Card className="sticky top-32">
      <CardHeader>
        <CardTitle className="font-brand">Search Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Location Search */}
        <div className="space-y-2">
          <Label htmlFor="location" className="font-medium">Location</Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              id="location"
              placeholder="e.g., Cape Town, Knysna, Vaal Dam"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Date Range */}
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-2">
            <Label className="font-medium">Check-in</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !checkIn && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {checkIn ? format(checkIn, "MMM dd") : "Select"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={checkIn}
                  onSelect={setCheckIn}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="space-y-2">
            <Label className="font-medium">Check-out</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !checkOut && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {checkOut ? format(checkOut, "MMM dd") : "Select"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={checkOut}
                  onSelect={setCheckOut}
                  disabled={(date) => date < new Date() || (checkIn && date <= checkIn)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Boat Type */}
        <div className="space-y-2">
          <Label className="font-medium">Boat Type</Label>
          <Select value={boatType} onValueChange={setBoatType}>
            <SelectTrigger>
              <SelectValue placeholder="All boat types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="speedboat">Speedboat</SelectItem>
              <SelectItem value="pontoon">Pontoon</SelectItem>
              <SelectItem value="houseboat">Houseboat</SelectItem>
              <SelectItem value="jetski">Jet Ski</SelectItem>
              <SelectItem value="kayak">Kayak</SelectItem>
              <SelectItem value="yacht">Yacht</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Water Body Type */}
        <div className="space-y-2">
          <Label className="font-medium">Water Body</Label>
          <Select value={waterBody} onValueChange={setWaterBody}>
            <SelectTrigger>
              <SelectValue placeholder="All water bodies" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Water Bodies</SelectItem>
              <SelectItem value="ocean">Ocean</SelectItem>
              <SelectItem value="dam">Dam</SelectItem>
              <SelectItem value="lagoon">Lagoon</SelectItem>
              <SelectItem value="river">River</SelectItem>
              <SelectItem value="lake">Lake</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Price Range */}
        <div className="space-y-3">
          <Label className="font-medium">Price per Day (ZAR)</Label>
          <div className="px-2">
            <Slider
              value={priceRange}
              onValueChange={setPriceRange}
              max={5000}
              min={0}
              step={100}
              className="w-full"
            />
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>R{priceRange[0]}</span>
            <span>R{priceRange[1]}</span>
          </div>
        </div>

        {/* Available Only Checkbox */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="available-only"
            checked={availableOnly}
            onCheckedChange={(checked) => setAvailableOnly(checked === true)}
          />
          <Label htmlFor="available-only" className="font-medium">
            Show available boats only
          </Label>
        </div>

        {/* Clear Filters */}
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => {
            setLocation("")
            setBoatType("all")
            setWaterBody("all")
            setPriceRange([0, 5000])
            setAvailableOnly(true)
            setCheckIn(undefined)
            setCheckOut(undefined)
          }}
        >
          Clear All Filters
        </Button>
      </CardContent>
    </Card>
  )
}