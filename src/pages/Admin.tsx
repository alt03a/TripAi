import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAdmin } from "@/hooks/useAdmin";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import {
  Users,
  MapPin,
  Plane,
  Shield,
  Plus,
  Pencil,
  Trash2,
  Loader2,
  BarChart3,
} from "lucide-react";

export default function Admin() {
  const { user, loading: authLoading } = useAuth();
  const {
    isAdmin,
    loading: adminLoading,
    stats,
    users,
    destinations,
    fetchStats,
    fetchUsers,
    fetchDestinations,
    assignRole,
    addDestination,
    updateDestination,
    deleteDestination,
  } = useAdmin();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingDestination, setEditingDestination] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchStats();
      fetchUsers();
      fetchDestinations();
    }
  }, [isAdmin, fetchStats, fetchUsers, fetchDestinations]);

  if (authLoading || adminLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <Skeleton className="h-10 w-48" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!isAdmin) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-12">
          <Shield className="h-16 w-16 text-muted-foreground mb-4" />
          <h1 className="text-2xl font-heading font-bold mb-2">Access Denied</h1>
          <p className="text-muted-foreground mb-6">
            You don't have permission to access this page.
          </p>
          <Button onClick={() => navigate("/")}>Go to Home</Button>
        </div>
      </DashboardLayout>
    );
  }

  const handleAddDestination = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const destination = {
      name: formData.get("name") as string,
      country: formData.get("country") as string,
      summary: formData.get("summary") as string,
      best_time: formData.get("best_time") as string,
      avg_cost: parseFloat(formData.get("avg_cost") as string) || null,
      rating: parseFloat(formData.get("rating") as string) || null,
      tags: (formData.get("tags") as string)?.split(",").map((t) => t.trim()) || [],
      images: (formData.get("images") as string)?.split(",").map((i) => i.trim()) || [],
    };

    const { error } = await addDestination(destination);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add destination",
      });
    } else {
      toast({
        title: "Success",
        description: "Destination added successfully",
      });
      setIsAddDialogOpen(false);
    }

    setIsSubmitting(false);
  };

  const handleUpdateDestination = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingDestination) return;

    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const updates = {
      name: formData.get("name") as string,
      country: formData.get("country") as string,
      summary: formData.get("summary") as string,
      best_time: formData.get("best_time") as string,
      avg_cost: parseFloat(formData.get("avg_cost") as string) || null,
      rating: parseFloat(formData.get("rating") as string) || null,
      tags: (formData.get("tags") as string)?.split(",").map((t) => t.trim()) || [],
      images: (formData.get("images") as string)?.split(",").map((i) => i.trim()) || [],
    };

    const { error } = await updateDestination(editingDestination.id, updates);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update destination",
      });
    } else {
      toast({
        title: "Success",
        description: "Destination updated successfully",
      });
      setEditingDestination(null);
    }

    setIsSubmitting(false);
  };

  const handleDeleteDestination = async (id: string) => {
    const { error } = await deleteDestination(id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete destination",
      });
    } else {
      toast({
        title: "Success",
        description: "Destination deleted successfully",
      });
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    const { error } = await assignRole(userId, newRole);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update user role",
      });
    } else {
      toast({
        title: "Success",
        description: "User role updated successfully",
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-heading font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage your application</p>
          </div>
          <Badge variant="secondary" className="gap-1">
            <Shield className="h-3 w-3" />
            Admin
          </Badge>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.users || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Trips</CardTitle>
              <Plane className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.trips || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Destinations</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.destinations || 0}</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="users" className="space-y-4">
          <TabsList>
            <TabsTrigger value="users" className="gap-2">
              <Users className="h-4 w-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="destinations" className="gap-2">
              <MapPin className="h-4 w-4" />
              Destinations
            </TabsTrigger>
            <TabsTrigger value="analytics" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                  View and manage all users in the system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((u) => (
                      <TableRow key={u.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={u.avatar_url || undefined} />
                              <AvatarFallback>
                                {u.name?.charAt(0)?.toUpperCase() || "U"}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{u.name || "Unknown"}</p>
                              <p className="text-xs text-muted-foreground">
                                {u.user_id.slice(0, 8)}...
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={u.role === "admin" ? "default" : "secondary"}
                          >
                            {u.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(u.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Select
                            defaultValue={u.role}
                            onValueChange={(value) =>
                              handleRoleChange(u.user_id, value)
                            }
                          >
                            <SelectTrigger className="w-28">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="user">User</SelectItem>
                              <SelectItem value="moderator">Moderator</SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))}
                    {users.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8">
                          <p className="text-muted-foreground">No users found</p>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Destinations Tab */}
          <TabsContent value="destinations">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Destination Management</CardTitle>
                  <CardDescription>
                    Add, edit, or remove destinations
                  </CardDescription>
                </div>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Destination
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Add New Destination</DialogTitle>
                      <DialogDescription>
                        Fill in the details for the new destination
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAddDestination} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Name</Label>
                          <Input id="name" name="name" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="country">Country</Label>
                          <Input id="country" name="country" required />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="summary">Summary</Label>
                        <Textarea id="summary" name="summary" rows={3} />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="best_time">Best Time to Visit</Label>
                          <Input id="best_time" name="best_time" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="avg_cost">Avg Cost/Day ($)</Label>
                          <Input id="avg_cost" name="avg_cost" type="number" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="rating">Rating (0-5)</Label>
                        <Input
                          id="rating"
                          name="rating"
                          type="number"
                          step="0.1"
                          min="0"
                          max="5"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="tags">Tags (comma-separated)</Label>
                        <Input
                          id="tags"
                          name="tags"
                          placeholder="Beach, Culture, Nature"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="images">Image URLs (comma-separated)</Label>
                        <Textarea
                          id="images"
                          name="images"
                          rows={2}
                          placeholder="https://..."
                        />
                      </div>
                      <DialogFooter>
                        <Button type="submit" disabled={isSubmitting}>
                          {isSubmitting && (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          )}
                          Add Destination
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Destination</TableHead>
                      <TableHead>Country</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Avg Cost</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {destinations.map((dest) => (
                      <TableRow key={dest.id}>
                        <TableCell className="font-medium">{dest.name}</TableCell>
                        <TableCell>{dest.country}</TableCell>
                        <TableCell>{dest.rating || "-"}</TableCell>
                        <TableCell>
                          {dest.avg_cost ? `$${dest.avg_cost}` : "-"}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => setEditingDestination(dest)}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-md">
                                <DialogHeader>
                                  <DialogTitle>Edit Destination</DialogTitle>
                                </DialogHeader>
                                <form
                                  onSubmit={handleUpdateDestination}
                                  className="space-y-4"
                                >
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <Label htmlFor="edit-name">Name</Label>
                                      <Input
                                        id="edit-name"
                                        name="name"
                                        defaultValue={editingDestination?.name}
                                        required
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor="edit-country">Country</Label>
                                      <Input
                                        id="edit-country"
                                        name="country"
                                        defaultValue={editingDestination?.country}
                                        required
                                      />
                                    </div>
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-summary">Summary</Label>
                                    <Textarea
                                      id="edit-summary"
                                      name="summary"
                                      defaultValue={editingDestination?.summary}
                                      rows={3}
                                    />
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <Label htmlFor="edit-best_time">
                                        Best Time
                                      </Label>
                                      <Input
                                        id="edit-best_time"
                                        name="best_time"
                                        defaultValue={editingDestination?.best_time}
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor="edit-avg_cost">
                                        Avg Cost ($)
                                      </Label>
                                      <Input
                                        id="edit-avg_cost"
                                        name="avg_cost"
                                        type="number"
                                        defaultValue={editingDestination?.avg_cost}
                                      />
                                    </div>
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-rating">Rating</Label>
                                    <Input
                                      id="edit-rating"
                                      name="rating"
                                      type="number"
                                      step="0.1"
                                      min="0"
                                      max="5"
                                      defaultValue={editingDestination?.rating}
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-tags">Tags</Label>
                                    <Input
                                      id="edit-tags"
                                      name="tags"
                                      defaultValue={editingDestination?.tags?.join(
                                        ", "
                                      )}
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-images">Image URLs</Label>
                                    <Textarea
                                      id="edit-images"
                                      name="images"
                                      rows={2}
                                      defaultValue={editingDestination?.images?.join(
                                        ", "
                                      )}
                                    />
                                  </div>
                                  <DialogFooter>
                                    <Button type="submit" disabled={isSubmitting}>
                                      {isSubmitting && (
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                      )}
                                      Save Changes
                                    </Button>
                                  </DialogFooter>
                                </form>
                              </DialogContent>
                            </Dialog>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Delete Destination
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete {dest.name}?
                                    This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteDestination(dest.id)}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {destinations.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8">
                          <p className="text-muted-foreground">
                            No destinations found. Add one to get started.
                          </p>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Analytics Overview</CardTitle>
                <CardDescription>
                  View key metrics and insights
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Analytics dashboard coming soon...
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}