import { useState, useRef, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Camera, Award, Package, Heart, Wallet, CalendarDays } from "lucide-react"

interface User {
  name: string
  email: string
  phone: string
  address: string
  avatar: string
  dateOfBirth: string
  gender: string
}

type ProfileInfoProps = {
  user: User
  setUser: (updatedUser: Partial<User>) => void
}

type Overview = {
  loyaltyPoints: number
  memberSince: string
  orders: number
  totalSpent: number
  wishlist: number
}

const inputClass =
  "rounded-sm bg-zinc-900/80 text-white border-zinc-800 placeholder:text-gray-500 focus-visible:ring-white text-sm"
const labelClass = "text-xs uppercase tracking-wider text-gray-300"

function StatTile({ icon: Icon, label, value }: { icon: typeof Package; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
      <Icon className="h-4 w-4 text-gray-400" />
      <p className="mt-3 text-xl font-bold text-white">{value}</p>
      <p className="text-[11px] uppercase tracking-wider text-gray-500">{label}</p>
    </div>
  )
}

export function ProfileInfo({ user, setUser }: ProfileInfoProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedUser, setEditedUser] = useState<User>(user)
  const [overview, setOverview] = useState<Overview | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    Promise.all([
      fetch("/api/auth/me").then((r) => (r.ok ? r.json() : null)),
      fetch("/api/orders").then((r) => (r.ok ? r.json() : null)),
      fetch("/api/wishlist").then((r) => (r.ok ? r.json() : null)),
    ])
      .then(([me, ord, wl]) => {
        const orders: { total: number }[] = ord?.orders ?? []
        const created = me?.user?.createdAt
        setOverview({
          loyaltyPoints: me?.user?.loyaltyPoints ?? 0,
          memberSince: created
            ? new Date(created).toLocaleDateString(undefined, { month: "short", year: "numeric" })
            : "—",
          orders: orders.length,
          totalSpent: orders.reduce((s, o) => s + (o.total || 0), 0),
          wishlist: (wl?.items ?? []).length,
        })
      })
      .catch(() => {})
  }, [])

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

  const completenessFields = [user.phone, user.dateOfBirth, user.gender, user.address, user.avatar]
  const completeness = Math.round((completenessFields.filter(Boolean).length / completenessFields.length) * 100)

  return (
    <Card className="bg-white/[0.04] border-white/10">
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="text-xl sm:text-2xl uppercase tracking-wider text-white">Personal Information</CardTitle>
        <CardDescription className="text-xs uppercase tracking-wider text-gray-400">
          Update your personal details here
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-center sm:space-x-6 space-y-4 sm:space-y-0">
          <div className="relative">
            <Avatar className="w-20 h-20 sm:w-24 sm:h-24 bg-zinc-900 border border-white/15">
              <AvatarImage src={editedUser.avatar} alt={editedUser.name} />
              <AvatarFallback className="text-xl sm:text-2xl bg-zinc-900 text-white">
                {editedUser.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <Button
              size="icon"
              className="absolute bottom-0 right-0 rounded-full bg-white text-black hover:bg-gray-200"
              onClick={() => fileInputRef.current?.click()}
            >
              <Camera className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
            <Input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} accept="image/*" />
          </div>
          <div className="text-center sm:text-left">
            <h2 className="text-xl sm:text-2xl font-semibold uppercase tracking-wider text-white">{editedUser.name}</h2>
            <p className="text-sm text-gray-400">{editedUser.email}</p>
            {overview && (
              <p className="mt-1 text-xs uppercase tracking-wider text-gray-500">Member since {overview.memberSince}</p>
            )}
          </div>
        </div>
        {isEditing ? (
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name" className={labelClass}>Full Name</Label>
                <Input
                  id="name"
                  className={inputClass}
                  value={editedUser.name}
                  onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className={labelClass}>Email</Label>
                <Input
                  id="email"
                  type="email"
                  disabled
                  className={`${inputClass} opacity-60`}
                  value={editedUser.email}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className={labelClass}>Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 555 000 0000"
                  className={inputClass}
                  value={editedUser.phone}
                  onChange={(e) => setEditedUser({ ...editedUser, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dob" className={labelClass}>Date of Birth</Label>
                <Input
                  id="dob"
                  type="date"
                  className={`${inputClass} [color-scheme:dark]`}
                  value={editedUser.dateOfBirth}
                  onChange={(e) => setEditedUser({ ...editedUser, dateOfBirth: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender" className={labelClass}>Gender</Label>
                <select
                  id="gender"
                  className="h-10 w-full rounded-sm border border-zinc-800 bg-zinc-900/80 px-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white"
                  value={editedUser.gender}
                  onChange={(e) => setEditedUser({ ...editedUser, gender: e.target.value })}
                >
                  <option value="">Prefer not to say</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="address" className={labelClass}>Address</Label>
                <Input
                  id="address"
                  placeholder="Street, city, state, zip"
                  className={inputClass}
                  value={editedUser.address}
                  onChange={(e) => setEditedUser({ ...editedUser, address: e.target.value })}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                className="rounded-sm bg-white text-black hover:bg-gray-200 uppercase tracking-wider text-xs"
                size="sm"
                onClick={handleSave}
              >
                Save Changes
              </Button>
              <Button
                variant="outline"
                className="rounded-sm border-white/15 bg-transparent text-white hover:bg-white/5 hover:text-white uppercase tracking-wider text-xs"
                size="sm"
                onClick={() => {
                  setEditedUser(user)
                  setIsEditing(false)
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Details */}
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label className={labelClass}>Phone</Label>
                  <p className="text-sm sm:text-base font-medium text-white">{user.phone || "Not added"}</p>
                </div>
                <div>
                  <Label className={labelClass}>Date of Birth</Label>
                  <p className="text-sm sm:text-base font-medium text-white">{user.dateOfBirth || "Not added"}</p>
                </div>
                <div>
                  <Label className={labelClass}>Gender</Label>
                  <p className="text-sm sm:text-base font-medium text-white">{user.gender || "Not added"}</p>
                </div>
                <div>
                  <Label className={labelClass}>Address</Label>
                  <p className="text-sm sm:text-base font-medium text-white">{user.address || "Not added"}</p>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs uppercase tracking-wider text-gray-400">
                  <span>Profile Completeness</span>
                  <span className="text-white">{completeness}%</span>
                </div>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-gray-300 to-white transition-all"
                    style={{ width: `${completeness}%` }}
                  />
                </div>
              </div>

              <Button
                className="rounded-sm bg-white text-black hover:bg-gray-200 uppercase tracking-wider text-xs"
                size="sm"
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </Button>
            </div>

            {/* Account overview */}
            <div className="space-y-4">
              <div className="rounded-xl border border-amber-400/20 bg-gradient-to-br from-amber-500/15 via-amber-500/[0.03] to-transparent p-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wider text-amber-200/80">Loyalty Points</span>
                  <Award className="h-5 w-5 text-amber-300" />
                </div>
                <p className="mt-2 text-4xl font-bold text-white">
                  {overview ? overview.loyaltyPoints.toLocaleString() : "—"}
                </p>
                <p className="mt-1 text-xs text-gray-400">Earn points on every order you place</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <StatTile icon={Package} label="Orders" value={overview ? String(overview.orders) : "—"} />
                <StatTile icon={Heart} label="Wishlist" value={overview ? String(overview.wishlist) : "—"} />
                <StatTile
                  icon={Wallet}
                  label="Total Spent"
                  value={overview ? `$${overview.totalSpent.toFixed(2)}` : "—"}
                />
                <StatTile icon={CalendarDays} label="Member Since" value={overview ? overview.memberSince : "—"} />
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
