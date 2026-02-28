import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Settings, Shield, Bell } from 'lucide-react';
import { toast } from 'sonner';

export const SettingsManager = () => {
  const { isAdmin } = useAuth();
  
  const [systemSettings, setSystemSettings] = useState({
    siteName: 'SomAdz',
    siteDescription: 'Suuqa Xayeysiisyada Soomaaliya',
    maxAdsPerUser: 20,
    enableNotifications: true,
    autoApproveAds: false
  });

  const [securitySettings, setSecuritySettings] = useState({
    requireEmailVerification: true,
    requireStrongPasswords: true,
    sessionTimeout: 24,
    maxLoginAttempts: 5
  });

  const handleSystemSave = () => {
    toast.success('Settings saved successfully');
  };

  const handleSecuritySave = () => {
    toast.success('Security settings saved');
  };

  if (!isAdmin()) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">
            Adigu ma lihid ogolaansho.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Habee nidaamka guud</p>
      </div>

      <Tabs defaultValue="system" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="system">
            <Settings className="h-4 w-4 mr-2" />
            Nidaamka
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="h-4 w-4 mr-2" />
            Amniga
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="h-4 w-4 mr-2" />
            Ogeysiisyada
          </TabsTrigger>
        </TabsList>

        <TabsContent value="system">
          <Card>
            <CardHeader>
              <CardTitle>Nidaamka Guud</CardTitle>
              <CardDescription>Habee goobaha guud ee nidaamka</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Magaca Websaydhka</Label>
                  <Input
                    value={systemSettings.siteName}
                    onChange={(e) => setSystemSettings({ ...systemSettings, siteName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Xadka Xayeysiisyada qof walba</Label>
                  <Input
                    type="number"
                    value={systemSettings.maxAdsPerUser}
                    onChange={(e) => setSystemSettings({ ...systemSettings, maxAdsPerUser: parseInt(e.target.value) })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Sharaxaadda</Label>
                <Input
                  value={systemSettings.siteDescription}
                  onChange={(e) => setSystemSettings({ ...systemSettings, siteDescription: e.target.value })}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label>Si toos ah u ansax xayeysiisyada</Label>
                  <p className="text-sm text-muted-foreground">
                    Xayeysiisyada cusub si toos ah u ansax
                  </p>
                </div>
                <Switch
                  checked={systemSettings.autoApproveAds}
                  onCheckedChange={(checked) => setSystemSettings({ ...systemSettings, autoApproveAds: checked })}
                />
              </div>

              <Button onClick={handleSystemSave}>Kaydi</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Goobaha Amniga</CardTitle>
              <CardDescription>Habee amniga nidaamka</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Waqtiga Session-ka (saacadood)</Label>
                  <Input
                    type="number"
                    value={securitySettings.sessionTimeout}
                    onChange={(e) => setSecuritySettings({ ...securitySettings, sessionTimeout: parseInt(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Xadka Isku dayga galitaanka</Label>
                  <Input
                    type="number"
                    value={securitySettings.maxLoginAttempts}
                    onChange={(e) => setSecuritySettings({ ...securitySettings, maxLoginAttempts: parseInt(e.target.value) })}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>U baahan email xaqiijin</Label>
                    <p className="text-sm text-muted-foreground">Isticmaalayaasha waa inay xaqiijiyaan email-kooda</p>
                  </div>
                  <Switch
                    checked={securitySettings.requireEmailVerification}
                    onCheckedChange={(checked) => setSecuritySettings({ ...securitySettings, requireEmailVerification: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Password adag u baahan</Label>
                    <p className="text-sm text-muted-foreground">Ka dhig password-ka mid adag</p>
                  </div>
                  <Switch
                    checked={securitySettings.requireStrongPasswords}
                    onCheckedChange={(checked) => setSecuritySettings({ ...securitySettings, requireStrongPasswords: checked })}
                  />
                </div>
              </div>

              <Button onClick={handleSecuritySave}>Kaydi</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Ogeysiisyada</CardTitle>
              <CardDescription>Habee ogeysiisyada nidaamka</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Fur Ogeysiisyada</Label>
                  <p className="text-sm text-muted-foreground">U dir ogeysiisyo isticmaalayaasha</p>
                </div>
                <Switch
                  checked={systemSettings.enableNotifications}
                  onCheckedChange={(checked) => setSystemSettings({ ...systemSettings, enableNotifications: checked })}
                />
              </div>
              <Button onClick={() => toast.success('Notifications settings saved')}>Kaydi</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
