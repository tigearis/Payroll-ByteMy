// app/(dashboard)/payroll-schedule/loading.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <Skeleton className="h-8 w-[250px]" />
          <Skeleton className="h-4 w-[300px] mt-2" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-10 w-[160px]" />
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-10 w-[180px]" />
          <Skeleton className="h-10 w-[100px]" />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-[300px]" />
          </CardTitle>
          <Skeleton className="h-4 w-[250px]" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-4">
              <Skeleton className="h-10 w-[100px]" />
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-[150px]" />
              ))}
            </div>
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="flex gap-4">
                <Skeleton className="h-16 w-[100px]" />
                {Array.from({ length: 5 }).map((_, j) => (
                  <Skeleton key={j} className="h-16 w-[150px]" />
                ))}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}