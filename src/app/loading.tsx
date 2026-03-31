import { FlaskConical } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center">
      <FlaskConical className="mb-4 h-12 w-12 animate-pulse text-primary" />
      <p className="text-lg text-muted-foreground">Loading...</p>
    </div>
  );
}
