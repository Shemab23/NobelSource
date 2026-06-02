import { MagnifyingGlassIcon } from "@phosphor-icons/react"
import { useGlobalContext } from "@/utilits/Hooks/General"
import { Input } from "./ui/input"

interface FeedHeaderProps {
  searchQuery: string
  setSearchQuery: (q: string) => void
  setSelectedCategory: (c: string) => void
  availableCategories?: string[]
}

export const FeedHeader = ({
  searchQuery,
  setSearchQuery,
  setSelectedCategory,
  availableCategories = [],
}: FeedHeaderProps) => {
  const { prefCurrency, setPrefCurrency } = useGlobalContext()

  return (
    <header className="mx-auto max-w-7xl border-b px-4 py-8">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-black tracking-tighter uppercase">
            Market Feed
          </h1>
          <select
            value={prefCurrency}
            onChange={(e) => setPrefCurrency(e.target.value)}
            className="cursor-pointer bg-transparent text-[10px] font-black tracking-widest outline-none"
          >
            {["USD", "EUR", "GBP", "RWF"].map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-1 items-center gap-3 md:justify-end">
          <div className="relative h-11 max-w-60 flex-1">
            <MagnifyingGlassIcon
              className="absolute top-1/2 left-4 -translate-y-1/2 text-muted-foreground"
              size={18}
            />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="h-full rounded-2xl pl-11"
            />
          </div>
          <select
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="h-11 cursor-pointer rounded-2xl border bg-card px-4 outline-none"
          >
            <option value="All">All Sectors</option>
            {availableCategories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>
    </header>
  )
}
