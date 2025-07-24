import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ImageUpload } from '@/components/ImageUpload';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save } from 'lucide-react';
import { useBoats } from '@/hooks/useBoats';

interface BoatFormData {
  title: string;
  description: string;
  location: string;
  pricePerDay: number;
  images: string[];
}

interface BoatListingFormProps {
  onSubmit?: (data: BoatFormData) => void;
  loading?: boolean;
  initialData?: Partial<BoatFormData>;
}

export function BoatListingForm({ 
  onSubmit, 
  loading = false, 
  initialData = {} 
}: BoatListingFormProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<BoatFormData>({
    title: initialData.title || '',
    description: initialData.description || '',
    location: initialData.location || '',
    pricePerDay: initialData.pricePerDay || 0,
    images: initialData.images || []
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a boat title",
        variant: "destructive",
      });
      return;
    }

    if (!formData.location.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a location",
        variant: "destructive",
      });
      return;
    }

    if (formData.pricePerDay <= 0) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid price per day",
        variant: "destructive",
      });
      return;
    }

    if (formData.images.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please upload at least one image",
        variant: "destructive",
      });
      return;
    }

    onSubmit?.(formData);
  };

  const handleInputChange = (field: keyof BoatFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Boat Listing Details</CardTitle>
        <CardDescription>
          Provide information about your boat to create an attractive listing
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title">Boat Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Beautiful 35ft Yacht"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                disabled={loading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                placeholder="e.g., Cape Town Harbour"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                disabled={loading}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pricePerDay">Price per Day (ZAR) *</Label>
            <Input
              id="pricePerDay"
              type="number"
              min="0"
              step="10"
              placeholder="e.g., 2500"
              value={formData.pricePerDay || ''}
              onChange={(e) => handleInputChange('pricePerDay', parseFloat(e.target.value) || 0)}
              disabled={loading}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              className="w-full min-h-[120px] px-3 py-2 border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 rounded-md"
              placeholder="Describe your boat, its features, and what makes it special..."
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              disabled={loading}
            />
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Label>Boat Images *</Label>
            <ImageUpload
              images={formData.images}
              onImagesChange={(images) => handleInputChange('images', images)}
              maxImages={8}
              disabled={loading}
              folder="boats"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button type="submit" disabled={loading} className="min-w-[120px]">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Listing
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}