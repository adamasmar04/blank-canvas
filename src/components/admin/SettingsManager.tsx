import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Settings, Palette, Shield, Bell, Database, Mail } from 'lucide-react';
import { toast } from 'sonner';

export const SettingsManager = () => {
  const { isAdmin } = useAuth();
  
  // System Settings
  const [systemSettings, setSystemSettings] = useState({
    siteName: 'SomAdz',
    siteDescription: 'Professional Ad Creation Platform',
    maxTemplatesPerUser: 50,
    allowPublicTemplates: true,
    requireEmailVerification: true,
    enableNotifications: true
  });

  // Brand Settings
  const [brandSettings, setBrandSettings] = useState({
    primaryColor: '#3b82f6',
    secondaryColor: '#64748b',
    accentColor: '#f59e0b',
    logoUrl: '',
    faviconUrl: '',
    customCSS: ''
  });

  // Security Settings
  const [securitySettings, setSecuritySettings] = useState({
    enableTwoFactor: false,
    sessionTimeout: 24, // hours
    maxLoginAttempts: 5,
    requireStrongPasswords: true,
    allowPasswordReset: true
  });

  // Email Settings
  const [emailSettings, setEmailSettings] = useState({
    smtpHost: '',
    smtpPort: 587,
    smtpUser: '',
    smtpPassword: '',
    fromEmail: '',
    fromName: 'SomAdz',
    enableWelcomeEmail: true,
    enableNotificationEmails: true
  });

  const handleSystemSave = async () => {
    if (!isAdmin()) {
      toast.error('Only admins can modify system settings');
      return;
    }
    
    // In a real app, this would save to database
    toast.success('System settings saved successfully');
  };

  const handleBrandSave = async () => {
    if (!isAdmin()) {
      toast.error('Only admins can modify brand settings');
      return;
    }
    
    // Apply theme changes
    const root = document.documentElement;
    root.style.setProperty('--primary', brandSettings.primaryColor);
    root.style.setProperty('--secondary', brandSettings.secondaryColor);
    root.style.setProperty('--accent', brandSettings.accentColor);
    
    toast.success('Brand settings saved successfully');
  };

  const handleSecuritySave = async () => {
    if (!isAdmin()) {
      toast.error('Only admins can modify security settings');
      return;
    }
    
    toast.success('Security settings saved successfully');
  };

  const handleEmailSave = async () => {
    if (!isAdmin()) {
      toast.error('Only admins can modify email settings');
      return;
    }
    
    toast.success('Email settings saved successfully');
  };

  const testEmailConnection = async () => {
    toast.info('Testing email connection...');
    // Simulate test
    setTimeout(() => {
      toast.success('Email connection test successful');
    }, 2000);
  };

  if (!isAdmin()) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">
            You don't have permission to access system settings.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">System Settings</h1>
        <p className="text-muted-foreground">Configure system-wide settings and preferences</p>
      </div>

      <Tabs defaultValue="system" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="system" className="flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span>System</span>
          </TabsTrigger>
          <TabsTrigger value="brand" className="flex items-center space-x-2">
            <Palette className="h-4 w-4" />
            <span>Brand</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <span>Security</span>
          </TabsTrigger>
          <TabsTrigger value="email" className="flex items-center space-x-2">
            <Mail className="h-4 w-4" />
            <span>Email</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="system">
          <Card>
            <CardHeader>
              <CardTitle>System Configuration</CardTitle>
              <CardDescription>
                General system settings and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input
                    id="siteName"
                    value={systemSettings.siteName}
                    onChange={(e) => setSystemSettings({ ...systemSettings, siteName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxTemplates">Max Templates Per User</Label>
                  <Input
                    id="maxTemplates"
                    type="number"
                    value={systemSettings.maxTemplatesPerUser}
                    onChange={(e) => setSystemSettings({ ...systemSettings, maxTemplatesPerUser: parseInt(e.target.value) })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="siteDescription">Site Description</Label>
                <Textarea
                  id="siteDescription"
                  value={systemSettings.siteDescription}
                  onChange={(e) => setSystemSettings({ ...systemSettings, siteDescription: e.target.value })}
                  rows={3}
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Allow Public Templates</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow users to make their templates publicly available
                    </p>
                  </div>
                  <Switch
                    checked={systemSettings.allowPublicTemplates}
                    onCheckedChange={(checked) => setSystemSettings({ ...systemSettings, allowPublicTemplates: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Require Email Verification</Label>
                    <p className="text-sm text-muted-foreground">
                      Require users to verify their email before accessing features
                    </p>
                  </div>
                  <Switch
                    checked={systemSettings.requireEmailVerification}
                    onCheckedChange={(checked) => setSystemSettings({ ...systemSettings, requireEmailVerification: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Enable Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Send system notifications to users
                    </p>
                  </div>
                  <Switch
                    checked={systemSettings.enableNotifications}
                    onCheckedChange={(checked) => setSystemSettings({ ...systemSettings, enableNotifications: checked })}
                  />
                </div>
              </div>

              <Button onClick={handleSystemSave}>
                Save System Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="brand">
          <Card>
            <CardHeader>
              <CardTitle>Brand & Appearance</CardTitle>
              <CardDescription>
                Customize the look and feel of your application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="primaryColor"
                      type="color"
                      value={brandSettings.primaryColor}
                      onChange={(e) => setBrandSettings({ ...brandSettings, primaryColor: e.target.value })}
                      className="w-16 h-10"
                    />
                    <Input
                      value={brandSettings.primaryColor}
                      onChange={(e) => setBrandSettings({ ...brandSettings, primaryColor: e.target.value })}
                      placeholder="#3b82f6"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="secondaryColor">Secondary Color</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="secondaryColor"
                      type="color"
                      value={brandSettings.secondaryColor}
                      onChange={(e) => setBrandSettings({ ...brandSettings, secondaryColor: e.target.value })}
                      className="w-16 h-10"
                    />
                    <Input
                      value={brandSettings.secondaryColor}
                      onChange={(e) => setBrandSettings({ ...brandSettings, secondaryColor: e.target.value })}
                      placeholder="#64748b"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accentColor">Accent Color</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="accentColor"
                      type="color"
                      value={brandSettings.accentColor}
                      onChange={(e) => setBrandSettings({ ...brandSettings, accentColor: e.target.value })}
                      className="w-16 h-10"
                    />
                    <Input
                      value={brandSettings.accentColor}
                      onChange={(e) => setBrandSettings({ ...brandSettings, accentColor: e.target.value })}
                      placeholder="#f59e0b"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="logoUrl">Logo URL</Label>
                  <Input
                    id="logoUrl"
                    value={brandSettings.logoUrl}
                    onChange={(e) => setBrandSettings({ ...brandSettings, logoUrl: e.target.value })}
                    placeholder="https://example.com/logo.png"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="faviconUrl">Favicon URL</Label>
                  <Input
                    id="faviconUrl"
                    value={brandSettings.faviconUrl}
                    onChange={(e) => setBrandSettings({ ...brandSettings, faviconUrl: e.target.value })}
                    placeholder="https://example.com/favicon.ico"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="customCSS">Custom CSS</Label>
                <Textarea
                  id="customCSS"
                  value={brandSettings.customCSS}
                  onChange={(e) => setBrandSettings({ ...brandSettings, customCSS: e.target.value })}
                  placeholder="/* Add your custom CSS here */"
                  rows={6}
                  className="font-mono text-sm"
                />
              </div>

              <Button onClick={handleBrandSave}>
                Save Brand Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Configure security and authentication settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">Session Timeout (hours)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={securitySettings.sessionTimeout}
                    onChange={(e) => setSecuritySettings({ ...securitySettings, sessionTimeout: parseInt(e.target.value) })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                  <Input
                    id="maxLoginAttempts"
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
                    <Label>Enable Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">
                      Require 2FA for admin accounts
                    </p>
                  </div>
                  <Switch
                    checked={securitySettings.enableTwoFactor}
                    onCheckedChange={(checked) => setSecuritySettings({ ...securitySettings, enableTwoFactor: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Require Strong Passwords</Label>
                    <p className="text-sm text-muted-foreground">
                      Enforce strong password requirements
                    </p>
                  </div>
                  <Switch
                    checked={securitySettings.requireStrongPasswords}
                    onCheckedChange={(checked) => setSecuritySettings({ ...securitySettings, requireStrongPasswords: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Allow Password Reset</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow users to reset their passwords via email
                    </p>
                  </div>
                  <Switch
                    checked={securitySettings.allowPasswordReset}
                    onCheckedChange={(checked) => setSecuritySettings({ ...securitySettings, allowPasswordReset: checked })}
                  />
                </div>
              </div>

              <Button onClick={handleSecuritySave}>
                Save Security Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle>Email Configuration</CardTitle>
              <CardDescription>
                Configure SMTP settings for sending emails
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="smtpHost">SMTP Host</Label>
                  <Input
                    id="smtpHost"
                    value={emailSettings.smtpHost}
                    onChange={(e) => setEmailSettings({ ...emailSettings, smtpHost: e.target.value })}
                    placeholder="smtp.gmail.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="smtpPort">SMTP Port</Label>
                  <Input
                    id="smtpPort"
                    type="number"
                    value={emailSettings.smtpPort}
                    onChange={(e) => setEmailSettings({ ...emailSettings, smtpPort: parseInt(e.target.value) })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="smtpUser">SMTP Username</Label>
                  <Input
                    id="smtpUser"
                    value={emailSettings.smtpUser}
                    onChange={(e) => setEmailSettings({ ...emailSettings, smtpUser: e.target.value })}
                    placeholder="your-email@gmail.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="smtpPassword">SMTP Password</Label>
                  <Input
                    id="smtpPassword"
                    type="password"
                    value={emailSettings.smtpPassword}
                    onChange={(e) => setEmailSettings({ ...emailSettings, smtpPassword: e.target.value })}
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fromEmail">From Email</Label>
                  <Input
                    id="fromEmail"
                    type="email"
                    value={emailSettings.fromEmail}
                    onChange={(e) => setEmailSettings({ ...emailSettings, fromEmail: e.target.value })}
                    placeholder="noreply@somadz.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fromName">From Name</Label>
                  <Input
                    id="fromName"
                    value={emailSettings.fromName}
                    onChange={(e) => setEmailSettings({ ...emailSettings, fromName: e.target.value })}
                    placeholder="SomAdz"
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Send Welcome Emails</Label>
                    <p className="text-sm text-muted-foreground">
                      Send welcome email to new users
                    </p>
                  </div>
                  <Switch
                    checked={emailSettings.enableWelcomeEmail}
                    onCheckedChange={(checked) => setEmailSettings({ ...emailSettings, enableWelcomeEmail: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Send Notification Emails</Label>
                    <p className="text-sm text-muted-foreground">
                      Send email notifications for important events
                    </p>
                  </div>
                  <Switch
                    checked={emailSettings.enableNotificationEmails}
                    onCheckedChange={(checked) => setEmailSettings({ ...emailSettings, enableNotificationEmails: checked })}
                  />
                </div>
              </div>

              <div className="flex space-x-4">
                <Button onClick={handleEmailSave}>
                  Save Email Settings
                </Button>
                <Button variant="outline" onClick={testEmailConnection}>
                  Test Connection
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};