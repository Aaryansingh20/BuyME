import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useState, FormEvent } from "react";

export function SecuritySettings() {
  const [passwordData, setPasswordData] = useState({ current: "", new: "", confirm: "" });
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const handlePasswordChange = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Password change requested", passwordData);
    setPasswordData({ current: "", new: "", confirm: "" });
  };

  return (
    <Card className="bg-zinc-900 border-zinc-800 shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl text-zinc-100">Security Settings</CardTitle>
        <CardDescription className="text-zinc-400">Manage your account security</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password" className="text-zinc-300">
              Current Password
            </Label>
            <Input
              id="current-password"
              type="password"
              value={passwordData.current}
              onChange={(e) =>
                setPasswordData({ ...passwordData, current: e.target.value })
              }
              className="bg-zinc-800 text-zinc-100 border-zinc-700 focus:border-zinc-500 focus:ring-zinc-500"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-password" className="text-zinc-300">
              New Password
            </Label>
            <Input
              id="new-password"
              type="password"
              value={passwordData.new}
              onChange={(e) =>
                setPasswordData({ ...passwordData, new: e.target.value })
              }
              className="bg-zinc-800 text-zinc-100 border-zinc-700 focus:border-zinc-500 focus:ring-zinc-500"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password" className="text-zinc-300">
              Confirm New Password
            </Label>
            <Input
              id="confirm-password"
              type="password"
              value={passwordData.confirm}
              onChange={(e) =>
                setPasswordData({ ...passwordData, confirm: e.target.value })
              }
              className="bg-zinc-800 text-zinc-100 border-zinc-700 focus:border-zinc-500 focus:ring-zinc-500"
            />
          </div>
          <Button
            type="submit"
            className="bg-zinc-100 text-zinc-900 hover:bg-zinc-200"
            size="sm"
          >
            Change Password
          </Button>
        </form>
        <div className="flex items-center justify-between pt-4">
          <div>
            <p className="font-medium text-zinc-100">Two-Factor Authentication</p>
            <p className="text-sm text-zinc-400">
              Add an extra layer of security to your account
            </p>
          </div>
          <Switch
            checked={twoFactorEnabled}
            onCheckedChange={setTwoFactorEnabled}
          />
        </div>
        <div className="pt-4">
          <p className="font-medium text-zinc-100">Login History</p>
          <p className="text-sm text-zinc-400">Recent account activity</p>
          <ul className="mt-2 space-y-2">
            <li className="text-sm text-zinc-300">
              Today, 10:00 AM - Login from Chrome on Windows
            </li>
            <li className="text-sm text-zinc-300">
              Yesterday, 2:30 PM - Login from Safari on macOS
            </li>
            <li className="text-sm text-zinc-300">
              June 1, 2023, 9:15 AM - Login from Firefox on Linux
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
