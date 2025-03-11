import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function RecentActivity() {
  const activities = [
    {
      id: 1,
      user: {
        name: "John Doe",
        email: "john@example.com",
        avatar: "/placeholder.svg",
        initials: "JD",
      },
      action: "approved payroll",
      target: "Acme Inc.",
      date: "2 hours ago",
    },
    {
      id: 2,
      user: {
        name: "Jane Smith",
        email: "jane@example.com",
        avatar: "/placeholder.svg",
        initials: "JS",
      },
      action: "added new client",
      target: "Wayne Enterprises",
      date: "5 hours ago",
    },
    {
      id: 3,
      user: {
        name: "Mike Johnson",
        email: "mike@example.com",
        avatar: "/placeholder.svg",
        initials: "MJ",
      },
      action: "updated payroll schedule for",
      target: "Globex Corp",
      date: "Yesterday",
    },
    {
      id: 4,
      user: {
        name: "Sarah Williams",
        email: "sarah@example.com",
        avatar: "/placeholder.svg",
        initials: "SW",
      },
      action: "processed payroll for",
      target: "Stark Industries",
      date: "2 days ago",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest actions performed in the system.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-center">
              <Avatar className="h-9 w-9">
                <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
                <AvatarFallback>{activity.user.initials}</AvatarFallback>
              </Avatar>
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">
                  {activity.user.name} <span className="text-muted-foreground">{activity.action}</span>{" "}
                  <span className="font-medium">{activity.target}</span>
                </p>
                <p className="text-sm text-muted-foreground">{activity.date}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

