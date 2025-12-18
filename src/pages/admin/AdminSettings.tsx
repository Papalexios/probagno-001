import { useEffect, useState } from 'react';
import { Save, Store, Mail, Phone, MapPin, Truck, Bell, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import {
  useStoreSettings,
  useUpdateStoreSettings,
  useShippingSettings,
  useUpdateShippingSettings,
  useNotificationSettings,
  useUpdateNotificationSettings,
  StoreSettings,
  ShippingSettings,
  NotificationSettings,
} from '@/hooks/useSettings';

export default function AdminSettings() {
  // Fetch settings from database
  const { data: storeData, isLoading: storeLoading } = useStoreSettings();
  const { data: shippingData, isLoading: shippingLoading } = useShippingSettings();
  const { data: notificationData, isLoading: notificationLoading } = useNotificationSettings();
  
  // Mutations
  const updateStore = useUpdateStoreSettings();
  const updateShipping = useUpdateShippingSettings();
  const updateNotifications = useUpdateNotificationSettings();

  // Local state for form editing
  const [storeSettings, setStoreSettings] = useState<StoreSettings>({
    name: 'PROBAGNO',
    email: 'info@probagno.gr',
    phone1: '210 6622215',
    phone2: '210 6622218',
    address: '2ο χλμ Λεωφόρος Κορωπίου-Βάρης, Κορωπί 194 00',
    vatNumber: '094235821',
    description: 'Με συνεχή πορεία 50 ετών στο χώρο σχεδιασμού & κατασκευής επίπλων μπάνιου.',
  });

  const [shippingSettings, setShippingSettings] = useState<ShippingSettings>({
    freeShippingThreshold: 500,
    standardShippingCost: 15,
    expressShippingCost: 30,
    enableFreeShipping: true,
  });

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    orderConfirmation: true,
    shippingUpdates: true,
    newsletterEnabled: true,
    smsNotifications: false,
  });

  // Sync local state with database data
  useEffect(() => {
    if (storeData) setStoreSettings(storeData);
  }, [storeData]);

  useEffect(() => {
    if (shippingData) setShippingSettings(shippingData);
  }, [shippingData]);

  useEffect(() => {
    if (notificationData) setNotificationSettings(notificationData);
  }, [notificationData]);

  const handleSaveStore = async () => {
    try {
      await updateStore.mutateAsync(storeSettings);
      toast.success('Οι ρυθμίσεις καταστήματος αποθηκεύτηκαν');
    } catch (error: any) {
      toast.error(error.message || 'Σφάλμα κατά την αποθήκευση');
    }
  };

  const handleSaveShipping = async () => {
    try {
      await updateShipping.mutateAsync(shippingSettings);
      toast.success('Οι ρυθμίσεις αποστολής αποθηκεύτηκαν');
    } catch (error: any) {
      toast.error(error.message || 'Σφάλμα κατά την αποθήκευση');
    }
  };

  const handleSaveNotifications = async () => {
    try {
      await updateNotifications.mutateAsync(notificationSettings);
      toast.success('Οι ρυθμίσεις ειδοποιήσεων αποθηκεύτηκαν');
    } catch (error: any) {
      toast.error(error.message || 'Σφάλμα κατά την αποθήκευση');
    }
  };

  const isLoading = storeLoading || shippingLoading || notificationLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-semibold">Ρυθμίσεις</h1>
        <p className="text-muted-foreground mt-1">
          Διαχειριστείτε τις ρυθμίσεις του καταστήματος
        </p>
      </div>

      <Tabs defaultValue="store" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="store">Κατάστημα</TabsTrigger>
          <TabsTrigger value="shipping">Αποστολή</TabsTrigger>
          <TabsTrigger value="notifications">Ειδοποιήσεις</TabsTrigger>
        </TabsList>

        {/* Store Settings */}
        <TabsContent value="store">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Store className="w-5 h-5" />
                Στοιχεία Καταστήματος
              </CardTitle>
              <CardDescription>
                Βασικές πληροφορίες για το κατάστημά σας
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Όνομα Καταστήματος</Label>
                  <Input
                    value={storeSettings.name}
                    onChange={(e) => setStoreSettings({ ...storeSettings, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>ΑΦΜ</Label>
                  <Input
                    value={storeSettings.vatNumber}
                    onChange={(e) => setStoreSettings({ ...storeSettings, vatNumber: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </Label>
                  <Input
                    type="email"
                    value={storeSettings.email}
                    onChange={(e) => setStoreSettings({ ...storeSettings, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Τηλέφωνο 1
                  </Label>
                  <Input
                    value={storeSettings.phone1}
                    onChange={(e) => setStoreSettings({ ...storeSettings, phone1: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Τηλέφωνο 2
                  </Label>
                  <Input
                    value={storeSettings.phone2}
                    onChange={(e) => setStoreSettings({ ...storeSettings, phone2: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Διεύθυνση
                  </Label>
                  <Input
                    value={storeSettings.address}
                    onChange={(e) => setStoreSettings({ ...storeSettings, address: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Περιγραφή</Label>
                <Textarea
                  value={storeSettings.description}
                  onChange={(e) => setStoreSettings({ ...storeSettings, description: e.target.value })}
                  rows={3}
                />
              </div>

              <Button 
                onClick={handleSaveStore} 
                className="gap-2"
disabled={true}              >
                {updateStore.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Αποθήκευση
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Shipping Settings */}
        <TabsContent value="shipping">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="w-5 h-5" />
                Ρυθμίσεις Αποστολής
              </CardTitle>
              <CardDescription>
                Διαχειριστείτε τις επιλογές αποστολής
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div>
                  <Label className="text-base">Δωρεάν Αποστολή</Label>
                  <p className="text-sm text-muted-foreground">
                    Ενεργοποίηση δωρεάν αποστολής πάνω από ένα ποσό
                  </p>
                </div>
                <Switch
                  checked={shippingSettings.enableFreeShipping}
                  onCheckedChange={(checked) =>
                    setShippingSettings({ ...shippingSettings, enableFreeShipping: checked })
                  }
                />
              </div>

              {shippingSettings.enableFreeShipping && (
                <div className="space-y-2">
                  <Label>Ελάχιστο ποσό για δωρεάν αποστολή (€)</Label>
                  <Input
                    type="number"
                    value={shippingSettings.freeShippingThreshold}
                    onChange={(e) =>
                      setShippingSettings({
                        ...shippingSettings,
                        freeShippingThreshold: Number(e.target.value),
                      })
                    }
                  />
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Κανονική Αποστολή (€)</Label>
                  <Input
                    type="number"
                    value={shippingSettings.standardShippingCost}
                    onChange={(e) =>
                      setShippingSettings({
                        ...shippingSettings,
                        standardShippingCost: Number(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Express Αποστολή (€)</Label>
                  <Input
                    type="number"
                    value={shippingSettings.expressShippingCost}
                    onChange={(e) =>
                      setShippingSettings({
                        ...shippingSettings,
                        expressShippingCost: Number(e.target.value),
                      })
                    }
                  />
                </div>
              </div>

              <Button 
                onClick={handleSaveShipping} 
                className="gap-2"
                disabled={updateShipping.isPending}
              >
                {updateShipping.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Αποθήκευση
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Ρυθμίσεις Ειδοποιήσεων
              </CardTitle>
              <CardDescription>
                Διαχειριστείτε τις ειδοποιήσεις email και SMS
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  key: 'orderConfirmation' as const,
                  label: 'Επιβεβαίωση Παραγγελίας',
                  description: 'Αποστολή email επιβεβαίωσης μετά από κάθε παραγγελία',
                },
                {
                  key: 'shippingUpdates' as const,
                  label: 'Ενημερώσεις Αποστολής',
                  description: 'Ειδοποίηση πελατών για την πορεία της αποστολής',
                },
                {
                  key: 'newsletterEnabled' as const,
                  label: 'Newsletter',
                  description: 'Ενεργοποίηση εγγραφής στο newsletter',
                },
                {
                  key: 'smsNotifications' as const,
                  label: 'SMS Ειδοποιήσεις',
                  description: 'Αποστολή SMS για σημαντικές ενημερώσεις',
                },
              ].map((setting) => (
                <div
                  key={setting.key}
                  className="flex items-center justify-between p-4 bg-muted/50 rounded-lg"
                >
                  <div>
                    <Label className="text-base">{setting.label}</Label>
                    <p className="text-sm text-muted-foreground">{setting.description}</p>
                  </div>
                  <Switch
                    checked={notificationSettings[setting.key]}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({
                        ...notificationSettings,
                        [setting.key]: checked,
                      })
                    }
                  />
                </div>
              ))}

              <Button 
                onClick={handleSaveNotifications} 
                className="gap-2 mt-4"
                disabled={updateNotifications.isPending}
              >
                {updateNotifications.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Αποθήκευση
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
