import { useState, useRef } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Camera } from "lucide-react"

interface User {
  name: string
  email: string
  phone: string
  address: string
  avatar: string
}

type ProfileInfoProps = {
  user: User
  setUser: (updatedUser: Partial<User>) => void
}

export function ProfileInfo({ user, setUser }: ProfileInfoProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedUser, setEditedUser] = useState<User>(user)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const handleSave = () => {
    setUser(editedUser)
    setIsEditing(false)
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setEditedUser({ ...editedUser, avatar: reader.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <Card className="bg-zinc-900 border-zinc-800 shadow-lg">
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="text-xl sm:text-2xl text-zinc-100">Personal Information</CardTitle>
        <CardDescription className="text-sm sm:text-base text-zinc-400">
          Update your personal details here
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-center sm:space-x-6 space-y-4 sm:space-y-0">
          <div className="relative">
            <Avatar className="w-20 h-20 sm:w-24 sm:h-24 bg-zinc-800 border-2 border-zinc-700">
              <AvatarImage src={editedUser.avatar} alt={editedUser.name} />
              <AvatarFallback className="text-xl sm:text-2xl text-zinc-100">
                {editedUser.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <Button
              size="icon"
              variant="secondary"
              className="absolute bottom-0 right-0 rounded-full"
              onClick={() => fileInputRef.current?.click()}
            >
              <Camera className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
            <Input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} accept="image/*" />
          </div>
          <div className="text-center sm:text-left">
            <h2 className="text-xl sm:text-2xl font-semibold text-zinc-100">{editedUser.name}</h2>
            <p className="text-sm sm:text-base text-zinc-400">{editedUser.email}</p>
          </div>
        </div>
        {isEditing ? (
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm text-zinc-300">
                  Full Name
                </Label>
                <Input
                  id="name"
                  className="bg-zinc-800 text-zinc-100 border-zinc-700 focus:border-zinc-500 focus:ring-zinc-500 text-sm"
                  value={editedUser.name}
                  onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm text-zinc-300">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  className="bg-zinc-800 text-zinc-100 border-zinc-700 focus:border-zinc-500 focus:ring-zinc-500 text-sm"
                  value={editedUser.email}
                  onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm text-zinc-300">
                  Phone
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  className="bg-zinc-800 text-zinc-100 border-zinc-700 focus:border-zinc-500 focus:ring-zinc-500 text-sm"
                  value={editedUser.phone}
                  onChange={(e) => setEditedUser({ ...editedUser, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address" className="text-sm text-zinc-300">
                  Address
                </Label>
                <Input
                  id="address"
                  className="bg-zinc-800 text-zinc-100 border-zinc-700 focus:border-zinc-500 focus:ring-zinc-500 text-sm"
                  value={editedUser.address}
                  onChange={(e) => setEditedUser({ ...editedUser, address: e.target.value })}
                />
              </div>
            </div>
            <div className="flex space-x-2">
              <Button className="bg-zinc-100 text-zinc-900 hover:bg-zinc-200 text-sm" size="sm" onClick={handleSave}>
                Save Changes
              </Button>
              <Button
                variant="outline"
                className="text-zinc-100 border-zinc-700 hover:bg-zinc-800 text-sm"
                size="sm"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label className="text-sm text-zinc-300">Phone</Label>
                <p className="text-sm sm:text-base text-zinc-100 font-medium">{user.phone}</p>
              </div>
              <div>
                <Label className="text-sm text-zinc-300">Address</Label>
                <p className="text-sm sm:text-base text-zinc-100 font-medium">{user.address}</p>
              </div>
            </div>
            <Button
              className="bg-zinc-100 text-zinc-900 hover:bg-zinc-200 text-sm"
              size="sm"
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

