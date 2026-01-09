"use client";
import { Search } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;

    router.push(`/?q=${encodeURIComponent(q)}`);
  };

  return (
    <form
      id="search-products"
      onSubmit={handleSearch}
      className="relative flex items-center w-full max-w-sm"
    >
      <Search className="absolute ml-3 h-5 w-5" />
      <input
        name="search"
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Type to search..."
        className="w-full pl-10 pr-4 py-2 rounded-lg toolbar
          focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50
          dark:focus:ring-white/20 dark:focus:border-white/50"
      />
      <button type="submit" className="sr-only">
        Search
      </button>
    </form>
  );
}