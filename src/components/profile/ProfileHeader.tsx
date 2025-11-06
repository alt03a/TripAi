import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Camera, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const ProfileHeader = () => {
  const { toast } = useToast();
  const [profile, setProfile] = useState({
    name: "Travel Enthusiast",
    bio: "Exploring the world one trip at a time",
    avatar: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    toast({
      title: "Profile Updated",
      description: "Your profile has been saved successfully",
    });
    setIsEditing(false);
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile({ ...profile, avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-card rounded-lg p-6 mb-6">
      <div className="flex items-start gap-6">
        <div className="relative">
          <Avatar className="h-24 w-24">
            <AvatarImage src={profile.avatar} />
            <AvatarFallback className="bg-primary">
              <User className="h-12 w-12 text-primary-foreground" />
            </AvatarFallback>
          </Avatar>
          <label className="absolute bottom-0 right-0 bg-accent rounded-full p-2 cursor-pointer hover:bg-accent/80">
            <Camera className="h-4 w-4 text-accent-foreground" />
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleAvatarUpload}
            />
          </label>
        </div>

        <div className="flex-1">
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSave}>Save</Button>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div>
              <h2 className="text-2xl font-heading font-bold text-foreground mb-1">
                {profile.name}
              </h2>
              <p className="text-muted-foreground mb-4">{profile.bio}</p>
              <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
