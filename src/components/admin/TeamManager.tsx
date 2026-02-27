import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Edit, Trash2, MoreHorizontal, Users, Shield, UserCheck, UserX } from 'lucide-react';
import { toast } from 'sonner';

interface TeamMember {
  id: string;
  user_id: string;
  role: 'user' | 'designer' | 'manager' | 'admin' | 'super_admin';
  is_active: boolean;
  created_at: string;
  updated_at: string;
  email?: string;
}

export const TeamManager = () => {
  const { userRole, isAdmin } = useAuth();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  const [formData, setFormData] = useState({
    email: '',
    role: 'designer' as 'user' | 'designer' | 'manager' | 'admin' | 'super_admin',
    is_active: true
  });

  useEffect(() => {
    if (isAdmin()) {
      fetchTeamMembers();
    }
  }, [isAdmin]);

  const fetchTeamMembers = async () => {
    try {
      // First get admin users
      const { data: adminUsers, error: adminError } = await supabase
        .from('admin_users')
        .select('*')
        .order('created_at', { ascending: false });

      if (adminError) throw adminError;

      // Then get user emails from auth.users (this requires RLS to be properly configured)
      const userIds = adminUsers?.map(user => user.user_id) || [];
      
      // For now, we'll just show the admin users without emails
      // In a real app, you'd need to set up a proper way to get user emails
      setTeamMembers(adminUsers || []);
      
    } catch (error) {
      console.error('Error fetching team members:', error);
      toast.error('Failed to load team members');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAdmin()) {
      toast.error('Only admins can manage team members');
      return;
    }

    try {
      if (selectedMember) {
        // Update existing member
        const { error } = await supabase
          .from('admin_users')
          .update({
            role: formData.role,
            is_active: formData.is_active
          })
          .eq('id', selectedMember.id);

        if (error) throw error;
        toast.success('Team member updated successfully');
      } else {
        // For adding new members, we'd need to first create the user account
        // This is a simplified version - in reality you'd need an invitation system
        toast.info('Adding new team members requires an invitation system');
        return;
      }

      setIsDialogOpen(false);
      resetForm();
      fetchTeamMembers();
    } catch (error) {
      console.error('Error saving team member:', error);
      toast.error('Failed to save team member');
    }
  };

  const handleToggleActive = async (memberId: string, isActive: boolean) => {
    if (!isAdmin()) {
      toast.error('Only admins can modify team member status');
      return;
    }

    try {
      const { error } = await supabase
        .from('admin_users')
        .update({ is_active: !isActive })
        .eq('id', memberId);

      if (error) throw error;
      toast.success(`Team member ${!isActive ? 'activated' : 'deactivated'} successfully`);
      fetchTeamMembers();
    } catch (error) {
      console.error('Error updating team member status:', error);
      toast.error('Failed to update team member status');
    }
  };

  const handleDelete = async (memberId: string) => {
    if (!isAdmin()) {
      toast.error('Only admins can remove team members');
      return;
    }

    if (!confirm('Are you sure you want to remove this team member?')) return;

    try {
      const { error } = await supabase
        .from('admin_users')
        .delete()
        .eq('id', memberId);

      if (error) throw error;
      toast.success('Team member removed successfully');
      fetchTeamMembers();
    } catch (error) {
      console.error('Error removing team member:', error);
      toast.error('Failed to remove team member');
    }
  };

  const openDialog = (member?: TeamMember) => {
    if (member) {
      setSelectedMember(member);
      setFormData({
        email: member.email || '',
        role: member.role,
        is_active: member.is_active
      });
    } else {
      setSelectedMember(null);
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      email: '',
      role: 'designer' as 'user' | 'designer' | 'manager' | 'admin' | 'super_admin',
      is_active: true
    });
  };

  const filteredMembers = teamMembers.filter(member => {
    const matchesSearch = member.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.user_id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || member.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'super_admin': return 'bg-red-500';
      case 'admin': return 'bg-orange-500';
      case 'manager': return 'bg-blue-500';
      case 'designer': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'super_admin':
      case 'admin': return Shield;
      case 'manager': return UserCheck;
      case 'designer': return Users;
      default: return Users;
    }
  };

  if (!isAdmin()) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">
            You don't have permission to access team management.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Team Management</h1>
          <p className="text-muted-foreground">Manage team members and their roles</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => openDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              Invite Member
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {selectedMember ? 'Edit Team Member' : 'Invite New Member'}
              </DialogTitle>
              <DialogDescription>
                {selectedMember ? 
                  'Update team member role and permissions' : 
                  'Send an invitation to join your team'
                }
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {!selectedMember && (
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="member@example.com"
                    required
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value: any) => setFormData({ ...formData, role: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="designer">Designer</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    {userRole?.role === 'super_admin' && (
                      <SelectItem value="super_admin">Super Admin</SelectItem>
                    )}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  {formData.role === 'designer' && 'Can create and edit templates'}
                  {formData.role === 'manager' && 'Can publish templates and manage categories'}
                  {formData.role === 'admin' && 'Full access to admin features'}
                  {formData.role === 'super_admin' && 'Complete system administration'}
                </p>
              </div>
              
              {selectedMember && (
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                  />
                  <Label htmlFor="is_active">Active</Label>
                </div>
              )}
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {selectedMember ? 'Update' : 'Send Invitation'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Team Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-2xl font-bold">{teamMembers.length}</span>
            </div>
            <p className="text-sm text-muted-foreground">Total Members</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <UserCheck className="h-4 w-4 text-green-500" />
              <span className="text-2xl font-bold">
                {teamMembers.filter(m => m.is_active).length}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">Active Members</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-blue-500" />
              <span className="text-2xl font-bold">
                {teamMembers.filter(m => ['admin', 'super_admin'].includes(m.role)).length}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">Admins</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-green-500" />
              <span className="text-2xl font-bold">
                {teamMembers.filter(m => m.role === 'designer').length}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">Designers</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4 items-center">
            <div className="flex-1">
              <Input
                placeholder="Search members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="designer">Designer</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="super_admin">Super Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Team Members Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Member</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMembers.map((member) => {
              const RoleIcon = getRoleIcon(member.role);
              return (
                <TableRow key={member.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                        <RoleIcon className="h-4 w-4 text-primary-foreground" />
                      </div>
                      <div>
                        <div className="font-medium">
                          {member.email || `User ${member.user_id.slice(0, 8)}`}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          ID: {member.user_id.slice(0, 8)}...
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={`${getRoleColor(member.role)} text-white`}>
                      {member.role.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {member.is_active ? (
                        <UserCheck className="h-4 w-4 text-green-500" />
                      ) : (
                        <UserX className="h-4 w-4 text-red-500" />
                      )}
                      <span className={member.is_active ? 'text-green-600' : 'text-red-600'}>
                        {member.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(member.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openDialog(member)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleToggleActive(member.id, member.is_active)}
                        >
                          {member.is_active ? (
                            <UserX className="h-4 w-4 mr-2" />
                          ) : (
                            <UserCheck className="h-4 w-4 mr-2" />
                          )}
                          {member.is_active ? 'Deactivate' : 'Activate'}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(member.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Remove
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};