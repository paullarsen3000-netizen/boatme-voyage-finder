import { Progress } from "@/components/ui/progress";
import { RatingDisplay } from "./RatingDisplay";
import { ReviewSummary as ReviewSummaryType } from "@/types/review";

interface ReviewSummaryProps {
  summary: ReviewSummaryType;
  className?: string;
}

export function ReviewSummary({ summary, className }: ReviewSummaryProps) {
  if (summary.totalReviews === 0) {
    return (
      <div className={className}>
        <p className="text-sm text-muted-foreground">No reviews yet</p>
      </div>
    );
  }

  const getPercentage = (count: number) => (count / summary.totalReviews) * 100;

  return (
    <div className={className}>
      <div className="flex items-center gap-4 mb-4">
        <div className="text-center">
          <div className="text-3xl font-bold text-foreground mb-1">
            {summary.averageRating.toFixed(1)}
          </div>
          <RatingDisplay 
            rating={summary.averageRating} 
            size="sm" 
            showNumber={false}
            className="justify-center"
          />
          <p className="text-xs text-muted-foreground mt-1">
            {summary.totalReviews} review{summary.totalReviews !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="flex-1 space-y-2">
          {[5, 4, 3, 2, 1].map((stars) => (
            <div key={stars} className="flex items-center gap-2 text-sm">
              <span className="w-3 text-muted-foreground">{stars}</span>
              <Progress 
                value={getPercentage(summary.ratingDistribution[stars as keyof typeof summary.ratingDistribution])} 
                className="h-2 flex-1"
              />
              <span className="w-8 text-xs text-muted-foreground text-right">
                {summary.ratingDistribution[stars as keyof typeof summary.ratingDistribution]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}