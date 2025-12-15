import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/Button';
import { Textarea } from '@/components/Textarea';
import { Image, Smile, MapPin, Calendar, Heart, MessageCircle, Repeat } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Post {
  id: string;
  content: string;
  image: string | null;
  createdAt: string;
  author: {
    id: string;
    username: string;
    name: string | null;
    avatar: string | null;
  };
  likeCount: number;
  isLiked: boolean;
}

const Dashboard = () => {
  const [content, setContent] = useState('');
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: posts, isLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const res = await api.get<{ data: Post[] }>('/posts');
      return res.data.data;
    },
  });

  const createPostMutation = useMutation({
    mutationFn: async (newContent: string) => {
      return api.post('/posts', { content: newContent });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['trending'] }); // Also refresh trending
      setContent('');
    },
  });

  const likeMutation = useMutation({
    mutationFn: async (postId: string) => {
      return api.post(`/posts/${postId}/like`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });

  const handlePost = () => {
    if (!content.trim()) return;
    createPostMutation.mutate(content);
  };

  return (
    <div className="max-w-2xl mx-auto w-full pb-20">
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border p-4">
        <h2 className="text-xl font-bold">Home</h2>
      </div>

      <div className="p-4 border-b border-border">
        <div className="flex gap-4">
          <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-blue-500 to-red-500 flex items-center justify-center text-white font-bold overflow-hidden">
             {user?.avatar ? <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" /> : user?.username[0].toUpperCase()}
          </div>
          <div className="flex-1 space-y-4">
            <Textarea
              placeholder="What is happening?!"
              className="bg-transparent border-none text-xl resize-none focus-visible:ring-0 p-0 min-h-[100px]"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <div className="flex justify-between items-center border-t border-border pt-4">
              <div className="flex gap-2 text-primary">
                <Button variant="ghost" size="icon" className="text-blue-500 hover:text-blue-600 hover:bg-blue-500/10"><Image className="w-5 h-5" /></Button>
                <Button variant="ghost" size="icon" className="text-blue-500 hover:text-blue-600 hover:bg-blue-500/10"><Smile className="w-5 h-5" /></Button>
                <Button variant="ghost" size="icon" className="text-blue-500 hover:text-blue-600 hover:bg-blue-500/10"><MapPin className="w-5 h-5" /></Button>
                <Button variant="ghost" size="icon" className="text-blue-500 hover:text-blue-600 hover:bg-blue-500/10"><Calendar className="w-5 h-5" /></Button>
              </div>
              <Button 
                onClick={handlePost} 
                disabled={!content.trim() || createPostMutation.isPending}
                className="rounded-full px-6 font-bold bg-blue-500 hover:bg-blue-600 text-white"
              >
                {createPostMutation.isPending ? 'Posting...' : 'Post'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Feed */}
      <div className="divide-y divide-border">
        {isLoading ? (
            <div className="p-8 text-center text-muted-foreground">Loading posts...</div>
        ) : posts?.map((post) => (
          <div key={post.id} className="p-4 hover:bg-accent/5 transition-colors cursor-pointer">
            <div className="flex gap-4">
              <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-slate-700 to-slate-600 flex-shrink-0 flex items-center justify-center text-white font-bold overflow-hidden">
                {post.author.avatar ? <img src={post.author.avatar} alt={post.author.username} className="w-full h-full object-cover" /> : post.author.username[0].toUpperCase()}
              </div>
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold">{post.author.name || post.author.username}</span>
                  <span className="text-muted-foreground text-sm">@{post.author.username} · {new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="whitespace-pre-wrap">{post.content}</p>
                <div className="flex gap-12 text-muted-foreground text-sm pt-2">
                  <button className="hover:text-blue-500 flex items-center gap-2 transition-colors group">
                    <div className="p-2 rounded-full group-hover:bg-blue-500/10">
                        <MessageCircle className="w-4 h-4" />
                    </div>
                    <span>0</span>
                  </button>
                  <button className="hover:text-green-500 flex items-center gap-2 transition-colors group">
                    <div className="p-2 rounded-full group-hover:bg-green-500/10">
                        <Repeat className="w-4 h-4" />
                    </div>
                    <span>0</span>
                  </button>
                  <button 
                    onClick={() => likeMutation.mutate(post.id)}
                    className={cn(
                        "hover:text-red-500 flex items-center gap-2 transition-colors group",
                        post.isLiked && "text-red-500"
                    )}
                  >
                    <div className="p-2 rounded-full group-hover:bg-red-500/10">
                        <Heart className={cn("w-4 h-4", post.isLiked && "fill-current")} />
                    </div>
                    <span>{post.likeCount}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {!isLoading && posts?.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">No posts yet. Be the first to post!</div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
