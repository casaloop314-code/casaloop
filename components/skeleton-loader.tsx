import { Card } from "@/components/ui/card";

export function PropertyCardSkeleton() {
  return (
    <Card className="overflow-hidden animate-pulse">
      <div className="relative h-48 bg-muted" />
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <div className="h-5 bg-muted rounded w-3/4" />
            <div className="h-4 bg-muted rounded w-1/2" />
          </div>
        </div>
        <div className="flex items-center gap-4 pt-2">
          <div className="h-4 bg-muted rounded w-16" />
          <div className="h-4 bg-muted rounded w-16" />
          <div className="h-4 bg-muted rounded w-16" />
        </div>
        <div className="flex items-center justify-between pt-3">
          <div className="h-6 bg-muted rounded w-24" />
          <div className="h-8 bg-muted rounded w-20" />
        </div>
      </div>
    </Card>
  );
}

export function ServiceCardSkeleton() {
  return (
    <Card className="p-4 animate-pulse">
      <div className="flex gap-4">
        <div className="h-12 w-12 bg-muted rounded-full flex-shrink-0" />
        <div className="flex-1 space-y-3">
          <div className="flex items-start justify-between">
            <div className="space-y-2 flex-1">
              <div className="h-5 bg-muted rounded w-2/3" />
              <div className="h-4 bg-muted rounded w-1/3" />
            </div>
          </div>
          <div className="h-4 bg-muted rounded w-full" />
          <div className="h-4 bg-muted rounded w-4/5" />
          <div className="flex items-center justify-between pt-2">
            <div className="h-4 bg-muted rounded w-24" />
            <div className="h-6 bg-muted rounded w-20" />
          </div>
        </div>
      </div>
    </Card>
  );
}

export function PropertyGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 p-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <PropertyCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function ServiceGridSkeleton() {
  return (
    <div className="space-y-4 p-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <ServiceCardSkeleton key={i} />
      ))}
    </div>
  );
}
