import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { articles, type Article } from "@/lib/content";
import { fetchLiveArticles } from "@/lib/live-articles";

const Context = createContext<{ articles: Article[]; pending: boolean }>({ articles, pending: true });
export function LiveArticles({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const query = useQuery({ queryKey: ["public-github-articles"], queryFn: () => fetchLiveArticles(articles), enabled: mounted, retry: false, staleTime: 0, refetchOnWindowFocus: true });
  useEffect(() => { if (query.data) void router.invalidate(); }, [query.data, router]);
  return <Context.Provider value={{ articles: query.data ?? articles, pending: !mounted || query.isLoading }}>{children}</Context.Provider>;
}
export const useArticles = () => useContext(Context);