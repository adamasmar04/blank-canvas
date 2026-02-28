import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { Edit, MoreHorizontal, Users, Shield, UserCheck, UserX } from 'lucide-react';
import { toast } from 'sonner';

interface UserWithRole {
  role_id: string;
  user_id: string;
  role: string;
  is_active: boolean;
  created_at: string;
  business_name: string | null;
  business_location: string | null;
}

export const UsersManager = () => {
  const { userRole } = useAuth();
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [editUser, setEditUser] = useState<UserWithRole | null>(null);
  const [editRole, setEditRole] = useState('');
  const [editActive, setEditActive] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      // Fetch user roles
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('id, user_id, role, is_active, created_at')
        .order('created_at', { ascending: false });

      if (rolesError) throw rolesError;

      // Fetch profiles for these users
      const userIds = roles?.map(r => r.user_id) || [];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, business_name, business_location')
        .in('id', userIds);

      // Combine data
      const combined = roles?.map(role => {
        const profile = profiles?.find(p => p.id === role.user_id);
        return {
          role_id: role.id,
          user_id: role.user_id,
          role: role.role,
          is_active: role.is_active,
          created_at: role.created_at,
          business_name: profile?.business_name || null,
          business_location: profile?.business_location || null,
        };
      }) || [];

      setUsers(combined);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user: UserWithRole) => {
    setEditUser(user);
    setEditRole(user.role);
    setEditActive(user.is_active);
    setIsEditOpen(true);
  };

  const handleSave = async () => {
    if (!editUser) return;

    try {
      const { error } = await supabase
        .from('user_roles')
        .update({ role: editRole, is_active: editActive })
        .eq('id', editUser.role_id);

      if (error) throw error;
      toast.success('User updated successfully');
      setIsEditOpen(false);
      fetchUsers();
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Failed to update user');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.user_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (user.business_name?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Maaraynta Isticmaalayaasha</h1>
        <p className="text-muted-foreground">Maaree isticmaalayaasha iyo doorkooda</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-2xl font-bold">{users.length}</span>
            </div>
            <p className="text-sm text-muted-foreground">Wadarta</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <UserCheck className="h-4 w-4 text-green-500" />
              <span className="text-2xl font-bold">
                {users.filter(u => u.is_active).length}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">Firfircoon</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-blue-500" />
              <span className="text-2xl font-bold">
                {users.filter(u => ['admin', 'super_admin'].includes(u.role)).length}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">Admins</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <UserX className="h-4 w-4 text-red-500" />
              <span className="text-2xl font-bold">
                {users.filter(u => !u.is_active).length}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">La joojiyay</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4 items-center">
            <div className="flex-1">
              <Input
                placeholder="Raadi isticmaalayaasha..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Dhammaan</SelectItem>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="designer">Designer</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="super_admin">Super Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Isticmaalaha</TableHead>
              <TableHead>Doorka</TableHead>
              <TableHead>Xaaladda</TableHead>
              <TableHead>Isku biir</TableHead>
              <TableHead>Ficilada</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.role_id}>
                <TableCell>
                  <div>
                    <div className="font-medium">
                      {user.business_name || `User ${user.user_id.slice(0, 8)}`}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {user.business_location || `ID: ${user.user_id.slice(0, 12)}...`}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={`${getRoleColor(user.role)} text-white`}>
                    {user.role.replace('_', ' ')}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    {user.is_active ? (
                      <UserCheck className="h-4 w-4 text-green-500" />
                    ) : (
                      <UserX className="h-4 w-4 text-red-500" />
                    )}
                    <span className={user.is_active ? 'text-green-600' : 'text-red-600'}>
                      {user.is_active ? 'Firfircoon' : 'La joojiyay'}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  {new Date(user.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(user)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Wax ka beddel
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Wax ka beddel Isticmaalaha</DialogTitle>
            <DialogDescription>
              Beddel doorka iyo xaaladda isticmaalaha
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Doorka</Label>
              <Select value={editRole} onValueChange={setEditRole}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="designer">Designer</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  {userRole?.role === 'super_admin' && (
                    <SelectItem value="super_admin">Super Admin</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                checked={editActive}
                onCheckedChange={setEditActive}
              />
              <Label>Firfircoon</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Ka noqo
            </Button>
            <Button onClick={handleSave}>
              Kaydi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
