import { RatingStars } from "@/components/RatingStars";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ThumbsUp, CheckCircle } from "lucide-react";

interface ReviewCardProps {
  review: {
    id: string;
    rating: number;
    title: string;
    body: string;
    isVerifiedPurchase: boolean;
    helpfulCount: number;
    createdAt: string | Date;
    user: {
      name: string | null;
      image: string | null;
    };
  };
}

export function ReviewCard({ review }: ReviewCardProps) {
  const date = new Date(review.createdAt);

  return (
    <Card>
      <CardContent className="p-4">
        <div className="mb-2 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <RatingStars rating={review.rating} size="sm" />
              <h4 className="font-semibold">{review.title}</h4>
            </div>
            <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
              <span>{review.user.name || "Anonymous"}</span>
              <span>·</span>
              <span>{date.toLocaleDateString()}</span>
              {review.isVerifiedPurchase && (
                <Badge variant="success" className="gap-1 text-xs">
                  <CheckCircle className="h-3 w-3" />
                  Verified Purchase
                </Badge>
              )}
            </div>
          </div>
        </div>
        <p className="mb-3 text-sm leading-relaxed text-muted-foreground">{review.body}</p>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <ThumbsUp className="h-3 w-3" />
          <span>{review.helpfulCount} found this helpful</span>
        </div>
      </CardContent>
    </Card>
  );
}
