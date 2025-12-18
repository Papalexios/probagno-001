-- Create store_settings table for admin settings persistence
CREATE TABLE public.store_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  value jsonb NOT NULL DEFAULT '{}',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;

-- Policies: anyone can read, only admins can modify
CREATE POLICY "Anyone can view settings" ON public.store_settings
FOR SELECT USING (true);

CREATE POLICY "Admins can insert settings" ON public.store_settings
FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update settings" ON public.store_settings
FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete settings" ON public.store_settings
FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- Trigger for updated_at
CREATE TRIGGER update_store_settings_updated_at
BEFORE UPDATE ON public.store_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default settings
INSERT INTO public.store_settings (key, value) VALUES
('store', '{"name": "PROBAGNO", "email": "info@probagno.gr", "phone1": "210 6622215", "phone2": "210 6622218", "address": "2ο χλμ Λεωφόρος Κορωπίου-Βάρης, Κορωπί 194 00", "vatNumber": "094235821", "description": "Με συνεχή πορεία 50 ετών στο χώρο σχεδιασμού & κατασκευής επίπλων μπάνιου."}'::jsonb),
('shipping', '{"freeShippingThreshold": 500, "standardShippingCost": 15, "expressShippingCost": 30, "enableFreeShipping": true}'::jsonb),
('notifications', '{"orderConfirmation": true, "shippingUpdates": true, "newsletterEnabled": true, "smsNotifications": false}'::jsonb);