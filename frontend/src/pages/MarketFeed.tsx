import { useState, useMemo } from "react"
import { useQueries } from "@tanstack/react-query"
import { motion, AnimatePresence } from "framer-motion"
import { fadeUp, staggerContainer } from "@/utilits/animations"
import { FeedHeader } from "@/components/FeedHeader"
import { MarketCard } from "@/components/MarketCard"
import { MarketCardSkeleton } from "@/components/MarketCardSkeleton"
import { GetPostsFeedOption, SearchPostsOption } from "@/api/option/post"
import { GetMeOption } from "@/api/option/user"
import { useGlobalContext } from "@/utilits/Hooks/General"
import type { PostDetail } from "@/Options/post"
import type { ApiPost } from "@/api/config/types/post"
import { PostOverlay } from "@/components/PosterOverlay"

export function MarketFeed() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const { prefCurrency } = useGlobalContext()

  const [{ data: searchData }, { data: feedData, isLoading }] = useQueries({
    queries: [
      SearchPostsOption({ q: searchQuery }),
      GetPostsFeedOption(),
      GetMeOption(),
    ],
  })

  const posts: PostDetail[] = useMemo(() => {
    const rawData = (searchQuery ? searchData?.ans : feedData?.ans) || []
    return Array.isArray(rawData)
      ? (rawData.map((post: ApiPost) => ({
          ...post,
          owner: (post as ApiPost).entity_id
            ? [(post as ApiPost).entity_id]
            : ["system"],
          content: {
            ...post.content,
            price: post.content?.price_cents || 0,
            title: post.content?.title || "Untitled",
            body: post.content?.body || "",
          },
        })) as PostDetail[])
      : []
  }, [searchQuery, searchData, feedData])

  const categories = useMemo(() => {
    const all = posts.map((p) => p.content?.category).filter(Boolean)
    return ["All", ...Array.from(new Set(all)).sort()]
  }, [posts])

  const displayPosts = useMemo(() => {
    const RATES: Record<string, number> = {
      RWF: 1,
      USD: 0.00075,
      EUR: 0.0007,
      GBP: 0.0006,
    }
    return posts
      .filter(
        (p) =>
          selectedCategory === "All" || p.content?.category === selectedCategory
      )
      .map((p) => ({
        ...p,
        content: {
          ...p.content,
          price: p.content.price * (RATES[prefCurrency] || 1),
        },
      }))
  }, [posts, selectedCategory, prefCurrency])

  const selectedPost = useMemo(
    () => posts.find((p) => p.id === selectedId) || null,
    [posts, selectedId]
  )

  return (
    <div className="min-h-screen bg-background">
      <FeedHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setSelectedCategory={setSelectedCategory}
        availableCategories={categories as string[]}
      />

      <main className="mx-auto max-w-7xl px-4 py-8">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => (
                <MarketCardSkeleton key={i} />
              ))
            : displayPosts.map((post) => (
                <MarketCard
                  key={post.id}
                  post={post}
                  prefCurrency={prefCurrency}
                  variants={fadeUp}
                  onClick={() => setSelectedId(post.id)}
                />
              ))}
        </motion.div>
      </main>

      <AnimatePresence>
        {selectedPost && (
          <PostOverlay
            id={selectedPost.id}
            post={selectedPost}
            prefCurrency={prefCurrency}
            onClose={() => setSelectedId(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
