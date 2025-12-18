import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// Types for settings
export interface StoreSettings {
  name: string;
  email: string;
  phone1: string;
  phone2: string;
  address: string;
  vatNumber: string;
  description: string;
}

export interface ShippingSettings {
  freeShippingThreshold: number;
  standardShippingCost: number;
  expressShippingCost: number;
  enableFreeShipping: boolean;
}

export interface NotificationSettings {
  orderConfirmation: boolean;
  shippingUpdates: boolean;
  newsletterEnabled: boolean;
  smsNotifications: boolean;
}

// Default values
const defaultStoreSettings: StoreSettings = {
  name: 'PROBAGNO',
  email: 'info@probagno.gr',
  phone1: '210 6622215',
  phone2: '210 6622218',
  address: '2ο χλμ Λεωφόρος Κορωπίου-Βάρης, Κορωπί 194 00',
  vatNumber: '094235821',
  description: 'Με συνεχή πορεία 50 ετών στο χώρο σχεδιασμού & κατασκευής επίπλων μπάνιου.',
};

const defaultShippingSettings: ShippingSettings = {
  freeShippingThreshold: 500,
  standardShippingCost: 15,
  expressShippingCost: 30,
  enableFreeShipping: true,
};

const defaultNotificationSettings: NotificationSettings = {
  orderConfirmation: true,
  shippingUpdates: true,
  newsletterEnabled: true,
  smsNotifications: false,
};

// Fetch settings by key
export function useSettingsQuery<T>(key: string, defaultValue: T) {
  return useQuery({
    queryKey: ['settings', key],
    queryFn: async (): Promise<T> => {
      const { data, error } = await supabase
        .from('store_settings')
        .select('value')
        .eq('key', key)
        .maybeSingle();

      if (error) {
        console.error(`Error fetching ${key} settings:`, error);
        return defaultValue;
      }

      if (!data) {
        return defaultValue;
      }

      return data.value as T;
    },
  });
}

// Update settings mutation
export function useUpdateSettings<T>(key: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (value: T) => {
      const { error } = await supabase
        .from('store_settings')
        .upsert([{ key, value: value as any }], { onConflict: 'key' });

      if (error) throw error;
      return value;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings', key] });
    },
  });
}

// Convenience hooks for specific settings
export function useStoreSettings() {
  return useSettingsQuery<StoreSettings>('store', defaultStoreSettings);
}

export function useUpdateStoreSettings() {
  return useUpdateSettings<StoreSettings>('store');
}

export function useShippingSettings() {
  return useSettingsQuery<ShippingSettings>('shipping', defaultShippingSettings);
}

export function useUpdateShippingSettings() {
  return useUpdateSettings<ShippingSettings>('shipping');
}

export function useNotificationSettings() {
  return useSettingsQuery<NotificationSettings>('notifications', defaultNotificationSettings);
}

export function useUpdateNotificationSettings() {
  return useUpdateSettings<NotificationSettings>('notifications');
}
