import Image from "next/image"
import bg from "@/public/auth-bg.jpg"

// Shared full-bleed page backdrop: the dark wallpaper plus soft colour glows so
// pages read with depth instead of flat black. Render it as the first child of a
// page and put the actual content in a sibling with `relative z-10`.
export function AppBackdrop() {
  return (
    <div className="fixed inset-0">
      <Image src={bg} alt="" fill priority className="object-cover object-center" />
      {/* Soft colour glows (indigo top-left, pink bottom-right) for depth. */}
      <div className="absolute inset-0 bg-[radial-gradient(60%_55%_at_12%_8%,rgba(99,102,241,0.22),transparent_60%),radial-gradient(55%_50%_at_88%_92%,rgba(236,72,153,0.16),transparent_60%)]" />
      {/* Darken just enough to keep content readable. */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/45 via-black/30 to-black/55" />
    </div>
  )
}
