/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useEffect, useState } from 'react';
import { settingsService } from '@/lib/services/settings.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PlatformSettings } from '@/types/settings.types';
import { Loader2, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function Settings() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState<PlatformSettings | null>(null);
  const [formData, setFormData] = useState({
    companyName: '',
    companyEmail: '',
    companyPhone: '',
    companyAddress: '',
    companyCity: '',
    companyCountry: '',
    contactEmail: '',
    contactPhone: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    settingsService.initialize();
    const settings = settingsService.getSettings();
   setTimeout(() => {
     setSettings(settings);
    setFormData({
      companyName: settings.companyName,
      companyEmail: settings.companyEmail,
      companyPhone: settings.companyPhone,
      companyAddress: settings.companyAddress,
      companyCity: settings.companyCity,
      companyCountry: settings.companyCountry,
      contactEmail: settings.contactEmail,
      contactPhone: settings.contactPhone,
    });
    setIsLoading(false);
   }, 100);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSave = async () => {
    setErrors({});
    const newErrors: Record<string, string> = {};

    if (!formData.companyName.trim()) newErrors.companyName = 'Company name is required';
    if (!formData.companyEmail.trim()) newErrors.companyEmail = 'Company email is required';
    if (!formData.companyPhone.trim()) newErrors.companyPhone = 'Company phone is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSaving(true);
    try {
      const result = settingsService.updateSettings(formData);
      if (result.success) {
        setSettings(result.settings!);
        toast.success('Settings saved successfully!');
      } else {
        toast.error('Failed to save settings');
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Manage your platform configuration and payment settings</p>
      </div>

      {/* Company Information */}
      <Card>
        <CardHeader>
          <CardTitle>Company Information</CardTitle>
          <CardDescription>Update your company details and contact information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Company Name */}
            <div>
              <label className="text-sm font-medium text-foreground">Company Name</label>
              <Input
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                className={errors.companyName ? 'border-destructive' : ''}
                placeholder="DotSkillsHub"
              />
              {errors.companyName && (
                <p className="text-xs text-destructive mt-1">{errors.companyName}</p>
              )}
            </div>

            {/* Company Email */}
            <div>
              <label className="text-sm font-medium text-foreground">Company Email</label>
              <Input
                name="companyEmail"
                type="email"
                value={formData.companyEmail}
                onChange={handleChange}
                className={errors.companyEmail ? 'border-destructive' : ''}
                placeholder="info@dotskillshub.com"
              />
              {errors.companyEmail && (
                <p className="text-xs text-destructive mt-1">{errors.companyEmail}</p>
              )}
            </div>

            {/* Company Phone */}
            <div>
              <label className="text-sm font-medium text-foreground">Company Phone</label>
              <Input
                name="companyPhone"
                value={formData.companyPhone}
                onChange={handleChange}
                className={errors.companyPhone ? 'border-destructive' : ''}
                placeholder="+880 1234 567890"
              />
              {errors.companyPhone && (
                <p className="text-xs text-destructive mt-1">{errors.companyPhone}</p>
              )}
            </div>

            {/* Contact Email */}
            <div>
              <label className="text-sm font-medium text-foreground">Contact Email</label>
              <Input
                name="contactEmail"
                type="email"
                value={formData.contactEmail}
                onChange={handleChange}
                placeholder="support@dotskillshub.com"
              />
            </div>

            {/* Company Address */}
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-foreground">Address</label>
              <Input
                name="companyAddress"
                value={formData.companyAddress}
                onChange={handleChange}
                placeholder="123 Business Street"
              />
            </div>

            {/* Company City */}
            <div>
              <label className="text-sm font-medium text-foreground">City</label>
              <Input
                name="companyCity"
                value={formData.companyCity}
                onChange={handleChange}
                placeholder="Dhaka"
              />
            </div>

            {/* Company Country */}
            <div>
              <label className="text-sm font-medium text-foreground">Country</label>
              <Input
                name="companyCountry"
                value={formData.companyCountry}
                onChange={handleChange}
                placeholder="Bangladesh"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="transition-all duration-200"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Methods</CardTitle>
          <CardDescription>Configure accepted payment methods for subscriptions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div>
                <h3 className="font-semibold text-foreground">bKash</h3>
                <p className="text-sm text-muted-foreground">Mobile banking service</p>
              </div>
              <Badge variant="default">Active</Badge>
            </div>

            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div>
                <h3 className="font-semibold text-foreground">Nagad</h3>
                <p className="text-sm text-muted-foreground">Mobile financial service</p>
              </div>
              <Badge variant="default">Active</Badge>
            </div>

            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div>
                <h3 className="font-semibold text-foreground">Bank Transfer</h3>
                <p className="text-sm text-muted-foreground">Direct bank transfer</p>
              </div>
              <Badge variant="secondary">Inactive</Badge>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Note:</strong> Payment method configuration is handled through the admin panel. Contact support to enable additional payment methods.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Payment Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Instructions</CardTitle>
          <CardDescription>Instructions displayed to customers when making payments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 p-4 bg-muted rounded-lg border">
            <div>
              <h4 className="font-semibold text-foreground mb-2">bKash Payment Instructions</h4>
              <p className="text-sm text-muted-foreground">
                1. Open bKash Mobile App<br />
                2. Select &quot;Send Money&quot;<br />
                3. Enter merchant account: +880 1700 000000<br />
                4. Enter amount<br />
                5. Complete transaction
              </p>
            </div>

            <div className="border-t border-border pt-4">
              <h4 className="font-semibold text-foreground mb-2">Nagad Payment Instructions</h4>
              <p className="text-sm text-muted-foreground">
                1. Open Nagad App<br />
                2. Select &quot;Send Money&quot;<br />
                3. Enter merchant account: +880 1800 000000<br />
                4. Enter amount<br />
                5. Complete transaction
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* API Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>API Configuration</CardTitle>
          <CardDescription>API keys and endpoints for integrations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground">API Key</label>
              <div className="flex gap-2 mt-2">
                <code className="flex-1 bg-muted px-3 py-2 rounded text-sm text-muted-foreground overflow-hidden text-ellipsis">
                  {process.env.NEXT_PUBLIC_API_KEY}
                </code>
                <Button size="sm" variant="outline">
                  Copy
                </Button>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">API Endpoint</label>
              <div className="flex gap-2 mt-2">
                <code className="flex-1 bg-muted px-3 py-2 rounded text-sm text-muted-foreground">
                  https://api.dotskillshub.com/v1
                </code>
                <Button size="sm" variant="outline">
                  Copy
                </Button>
              </div>
            </div>

            <div className="p-4 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                <strong>Warning:</strong> Keep your API key secure. Never share it in public or commit it to version control.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
