"use client"

import { Fragment, useEffect, useRef, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"
import { Bot, MessageCircle, Send, X } from "lucide-react"
import { cn } from "@/lib/utils"

// Routes where a shopping assistant doesn't belong (auth flows, admin console).
const HIDDEN_PREFIXES = ["/login", "/register", "/forgot-password", "/reset-password", "/admin"]

type Role = "user" | "assistant"
interface Message {
  role: Role
  content: string
}

const GREETING: Message = {
  role: "assistant",
  content:
    "Hi! I'm the BUYME assistant 👋 Ask me about products, sizing, stock, shipping, or your orders.",
}

const SUGGESTIONS = [
  "What hoodies do you have under €70?",
  "Is the Noir Bomber Jacket in stock?",
  "Where's my latest order?",
]

export function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([GREETING])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const pathname = usePathname()
  const hidden = HIDDEN_PREFIXES.some((p) => pathname?.startsWith(p))

  // Keep the latest message in view as the conversation grows.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
  }, [messages, loading])

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  async function send(text: string) {
    const trimmed = text.trim()
    if (!trimmed || loading) return

    const next = [...messages, { role: "user" as const, content: trimmed }]
    setMessages(next)
    setInput("")
    setLoading(true)

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Send conversation without the canned greeting (it's not a real turn).
        body: JSON.stringify({ messages: next.filter((m) => m !== GREETING) }),
      })
      const data = await res.json()
      const reply =
        res.ok && data.reply
          ? data.reply
          : data.error || "Sorry, something went wrong. Please try again."
      setMessages((m) => [...m, { role: "assistant", content: reply }])
    } catch {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "I couldn't reach the server. Please check your connection and try again." },
      ])
    } finally {
      setLoading(false)
    }
  }

  if (hidden) return null

  return (
    <>
      {/* Launcher */}
      <motion.button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close assistant" : "Open assistant"}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-white text-black shadow-lg shadow-black/40 ring-1 ring-white/20"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={open ? "close" : "open"}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
          </motion.span>
        </AnimatePresence>
      </motion.button>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed bottom-24 right-5 z-50 flex h-[min(70vh,560px)] w-[min(92vw,380px)] flex-col overflow-hidden rounded-2xl border border-white/10 bg-neutral-950/95 text-white shadow-2xl shadow-black/60 backdrop-blur"
          >
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-black">
                <Bot className="h-5 w-5" />
              </div>
              <div className="leading-tight">
                <p className="text-sm font-semibold">BUYME Assistant</p>
                <p className="text-xs text-white/50">Here to help you shop</p>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {messages.map((m, i) => (
                <Bubble key={i} role={m.role} content={m.content} />
              ))}

              {messages.length === 1 && (
                <div className="space-y-2 pt-1">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => send(s)}
                      className="block w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-left text-xs text-white/80 transition-colors hover:bg-white/10"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}

              {loading && (
                <div className="flex items-center gap-1.5 px-1 text-white/50">
                  {[0, 1, 2].map((d) => (
                    <motion.span
                      key={d}
                      className="h-2 w-2 rounded-full bg-white/50"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1, repeat: Infinity, delay: d * 0.2 }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Composer */}
            <form
              onSubmit={(e) => {
                e.preventDefault()
                send(input)
              }}
              className="flex items-center gap-2 border-t border-white/10 px-3 py-3"
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask anything…"
                maxLength={1000}
                className="flex-1 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder:text-white/40 focus:border-white/30 focus:outline-none"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                aria-label="Send message"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-black transition-opacity disabled:opacity-40"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// Internal storefront routes the assistant may reference. Matched paths are
// rendered as clickable links; relative paths keep working across every deploy
// (localhost, Vercel preview URLs, custom domains) with no hardcoded host.
const INTERNAL_PATH = /(\/(?:product|shop|search|collection|checkout)(?:\/[A-Za-z0-9_-]+)*)/g
const IS_INTERNAL_PATH = /^\/(?:product|shop|search|collection|checkout)(?:\/[A-Za-z0-9_-]+)*$/

/** Split text into plain segments and clickable internal links. */
function linkify(text: string): React.ReactNode[] {
  return text.split(INTERNAL_PATH).map((part, i) =>
    IS_INTERNAL_PATH.test(part) ? (
      <Link
        key={i}
        href={part}
        className="font-medium text-white underline underline-offset-2 hover:text-white/80"
      >
        {part}
      </Link>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    )
  )
}

function Bubble({ role, content }: { role: Role; content: string }) {
  const isUser = role === "user"
  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2 text-sm",
          isUser
            ? "rounded-br-sm bg-white text-black"
            : "rounded-bl-sm bg-white/10 text-white/90"
        )}
      >
        {isUser ? content : linkify(content)}
      </div>
    </div>
  )
}
