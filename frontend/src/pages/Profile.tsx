import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/Button';
import { ArrowLeft, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

const Profile = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto w-full">
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border p-2 flex items-center gap-4">
        <Link to="/app">
            <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft className="w-5 h-5" />
            </Button>
        </Link>
        <div>
            <h2 className="text-xl font-bold">{user.name || user.username}</h2>
            <p className="text-xs text-muted-foreground">0 posts</p>
        </div>
      </div>

      {/* Cover Image */}
      <div className="h-48 bg-gradient-to-r from-blue-600 to-red-600"></div>

      <div className="px-4 pb-4 relative">
        {/* Avatar */}
        <div className="absolute -top-16 left-4">
            <div className="h-32 w-32 rounded-full border-4 border-background bg-slate-800 flex items-center justify-center text-4xl font-bold text-white overflow-hidden">
                {user.avatar ? <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" /> : user.username[0].toUpperCase()}
            </div>
        </div>

        {/* Edit Profile Button */}
        <div className="flex justify-end pt-4">
            <Button variant="outline" className="rounded-full font-bold">Edit profile</Button>
        </div>

        {/* User Info */}
        <div className="mt-4 space-y-1">
            <h1 className="text-2xl font-bold">{user.name || user.username}</h1>
            <p className="text-muted-foreground">@{user.username}</p>
        </div>

        <div className="mt-4">
            <p>{user.bio || "No bio yet."}</p>
        </div>

        <div className="mt-4 flex gap-4 text-muted-foreground text-sm">
            <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>Joined recently</span>
            </div>
        </div>

        <div className="mt-4 flex gap-4 text-sm">
            <div className="flex gap-1">
                <span className="font-bold text-foreground">0</span>
                <span className="text-muted-foreground">Following</span>
            </div>
            <div className="flex gap-1">
                <span className="font-bold text-foreground">0</span>
                <span className="text-muted-foreground">Followers</span>
            </div>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="flex border-b border-border mt-4">
        <div className="flex-1 hover:bg-accent/50 transition-colors cursor-pointer p-4 text-center font-bold border-b-4 border-primary">
            Posts
        </div>
        <div className="flex-1 hover:bg-accent/50 transition-colors cursor-pointer p-4 text-center text-muted-foreground font-medium">
            Replies
        </div>
        <div className="flex-1 hover:bg-accent/50 transition-colors cursor-pointer p-4 text-center text-muted-foreground font-medium">
            Likes
        </div>
      </div>

      <div className="p-8 text-center text-muted-foreground">
        No posts yet.
      </div>
    </div>
  );
};

export default Profile;
