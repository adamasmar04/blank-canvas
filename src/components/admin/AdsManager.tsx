import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { Eye, Trash2, MoreHorizontal, CheckCircle, XCircle, Megaphone, Ban } from 'lucide-react';
import { toast } from 'sonner';

interface Ad {
  id: string;
  headline: string;
  business_name: string;
  status: string;
  views: number;
  price: number | null;
  currency: string | null;
  package_type: string;
  created_at: string;
  expires_at: string;
  user_id: string;
}

export const AdsManager = () => {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedAd, setSelectedAd] = useState<Ad | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    try {
      const { data, error } = await supabase
        .from('ads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAds(data || []);
    } catch (error) {
      console.error('Error fetching ads:', error);
      toast.error('Failed to load ads');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (adId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('ads')
        .update({ status: newStatus })
        .eq('id', adId);

      if (error) throw error;
      toast.success(`Ad status updated to ${newStatus}`);
      fetchAds();
    } catch (error) {
      console.error('Error updating ad status:', error);
      toast.error('Failed to update ad status');
    }
  };

  const handleDelete = async (adId: string) => {
    if (!confirm('Ma hubtaa inaad rabto inaad tirtirto xayeysiiskan?')) return;

    try {
      const { error } = await supabase
        .from('ads')
        .delete()
        .eq('id', adId);

      if (error) throw error;
      toast.success('Ad deleted successfully');
      fetchAds();
    } catch (error) {
      console.error('Error deleting ad:', error);
      toast.error('Failed to delete ad');
    }
  };

  const filteredAds = ads.filter(ad => {
    const matchesSearch = ad.headline.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ad.business_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || ad.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'expired': return 'bg-red-500';
      case 'suspended': return 'bg-gray-500';
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
        <h1 className="text-3xl font-bold text-foreground">Maaraynta Xayeysiisyada</h1>
        <p className="text-muted-foreground">Maaree dhammaan xayeysiisyada suuqa</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{ads.length}</div>
            <p className="text-sm text-muted-foreground">Wadarta</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">
              {ads.filter(a => a.status === 'active').length}
            </div>
            <p className="text-sm text-muted-foreground">Firfircoon</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-yellow-600">
              {ads.filter(a => a.status === 'pending').length}
            </div>
            <p className="text-sm text-muted-foreground">Sugitaan</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-red-600">
              {ads.filter(a => a.status === 'expired').length}
            </div>
            <p className="text-sm text-muted-foreground">Dhamaaday</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4 items-center">
            <div className="flex-1">
              <Input
                placeholder="Raadi xayeysiisyo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Dhammaan</SelectItem>
                <SelectItem value="active">Firfircoon</SelectItem>
                <SelectItem value="pending">Sugitaan</SelectItem>
                <SelectItem value="expired">Dhamaaday</SelectItem>
                <SelectItem value="suspended">La joojiyay</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Ads Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Xayeysiiska</TableHead>
              <TableHead>Ganacsiga</TableHead>
              <TableHead>Xaalad</TableHead>
              <TableHead>Aragti</TableHead>
              <TableHead>Qiimaha</TableHead>
              <TableHead>Taariikhda</TableHead>
              <TableHead>Ficilada</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAds.map((ad) => (
              <TableRow key={ad.id}>
                <TableCell>
                  <div className="font-medium">{ad.headline}</div>
                  <div className="text-xs text-muted-foreground">{ad.package_type}</div>
                </TableCell>
                <TableCell>{ad.business_name}</TableCell>
                <TableCell>
                  <Badge className={`${getStatusColor(ad.status)} text-white`}>
                    {ad.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Eye className="h-3 w-3 text-muted-foreground" />
                    {ad.views || 0}
                  </div>
                </TableCell>
                <TableCell>
                  {ad.price ? `${ad.price} ${ad.currency || 'USD'}` : 'N/A'}
                </TableCell>
                <TableCell>
                  {new Date(ad.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => {
                        setSelectedAd(ad);
                        setIsDetailOpen(true);
                      }}>
                        <Eye className="h-4 w-4 mr-2" />
                        Faahfaahin
                      </DropdownMenuItem>
                      {ad.status !== 'active' && (
                        <DropdownMenuItem onClick={() => handleStatusChange(ad.id, 'active')}>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Firfircoonee
                        </DropdownMenuItem>
                      )}
                      {ad.status === 'active' && (
                        <DropdownMenuItem onClick={() => handleStatusChange(ad.id, 'suspended')}>
                          <Ban className="h-4 w-4 mr-2" />
                          Jooji
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        onClick={() => handleDelete(ad.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Tirtir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            {filteredAds.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <Megaphone className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">Ma jiraan xayeysiisyo</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Faahfaahinta Xayeysiiska</DialogTitle>
          </DialogHeader>
          {selectedAd && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Cinwaanka</p>
                  <p className="font-medium">{selectedAd.headline}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Ganacsiga</p>
                  <p className="font-medium">{selectedAd.business_name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Xaaladda</p>
                  <Badge className={`${getStatusColor(selectedAd.status)} text-white`}>
                    {selectedAd.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Nooca</p>
                  <p className="font-medium">{selectedAd.package_type}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Qiimaha</p>
                  <p className="font-medium">{selectedAd.price ? `${selectedAd.price} ${selectedAd.currency}` : 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Aragtida</p>
                  <p className="font-medium">{selectedAd.views || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">La sameeyay</p>
                  <p className="font-medium">{new Date(selectedAd.created_at).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Wuu dhacayaa</p>
                  <p className="font-medium">{new Date(selectedAd.expires_at).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailOpen(false)}>Xir</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
