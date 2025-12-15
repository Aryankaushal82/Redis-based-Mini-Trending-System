import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import { Card, CardContent, CardHeader, CardTitle } from './Card';
import { Loader2 } from 'lucide-react';

interface TrendingTopic {
  value: string;
  score: number;
}

const TrendingSidebar = () => {
  const { data: trending, isLoading } = useQuery({
    queryKey: ['trending'],
    queryFn: async () => {
      const res = await api.get<{ data: TrendingTopic[] }>('/topics/trending');
      return res.data.data;
    },
    refetchInterval: 30000, // Refresh every 30s
  });

  return (
    <div className="hidden lg:block w-80 p-4 h-screen sticky top-0">
      <div className="space-y-4">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search TrendZ" 
            className="w-full bg-secondary text-secondary-foreground rounded-full px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <svg className="w-5 h-5 absolute left-3 top-2.5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        </div>

        <Card className="bg-secondary/50 border-none">
          <CardHeader>
            <CardTitle className="text-xl font-bold">What's Happening</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              <div className="flex justify-center p-4">
                <Loader2 className="animate-spin text-primary" />
              </div>
            ) : (
              trending?.slice(0, 5).map((topic) => (
                <div key={topic.value} className="flex justify-between items-start cursor-pointer hover:bg-accent/50 p-2 rounded transition-colors">
                  <div>
                    <p className="text-xs text-muted-foreground">Trending in Tech</p>
                    <p className="font-bold text-foreground">#{topic.value}</p>
                    <p className="text-xs text-muted-foreground">{topic.score} posts</p>
                  </div>
                  <span className="text-muted-foreground text-xs">...</span>
                </div>
              ))
            )}
            {!isLoading && (!trending || trending.length === 0) && (
               <p className="text-sm text-muted-foreground">No trending topics yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TrendingSidebar;
