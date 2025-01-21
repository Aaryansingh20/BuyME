import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface Notification {
  id: string;
  message: string;
  date: string;
  read: boolean;
}

interface NotificationsProps {
  notifications: Notification[];
}

export function Notifications({ notifications }: NotificationsProps) {
  const [notificationsState, setNotifications] = useState<Notification[]>(notifications);

  const toggleNotificationStatus = (id: string) => {
    setNotifications(notificationsState.map(notif =>
      notif.id === id ? { ...notif, read: !notif.read } : notif
    ));
  };

  return (
    <Card className="bg-zinc-900 border-zinc-800 shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl text-zinc-100">Notifications</CardTitle>
        <CardDescription className="text-zinc-400">Manage your notification preferences</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {notificationsState.map((notification) => (
            <div key={notification.id} className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium text-zinc-100">{notification.message}</p>
                <p className="text-sm text-zinc-400">{notification.date}</p>
              </div>
              <Switch 
                checked={!notification.read}
                onCheckedChange={() => toggleNotificationStatus(notification.id)}
              />
            </div>
          ))}
        </div>
        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="marketing-emails" className="text-zinc-300">Marketing Emails</Label>
            <Switch id="marketing-emails" />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="order-updates" className="text-zinc-300">Order Updates</Label>
            <Switch id="order-updates" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="price-alerts" className="text-zinc-300">Price Alerts</Label>
            <Switch id="price-alerts" />
          </div>
        </div>
        <Button 
          onClick={() => setNotifications(notificationsState.map(notif => ({ ...notif, read: true })))}
          className="mt-6 bg-zinc-100 text-zinc-900 hover:bg-zinc-200"
          size="sm"
        >
          Mark All as Read
        </Button>
      </CardContent>
    </Card>
  )
}

