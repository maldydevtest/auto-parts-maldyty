CREATE TABLE public.telegram_delivery_log (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  chat_id text NOT NULL,
  status text NOT NULL,
  detail text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.telegram_delivery_log TO service_role;
ALTER TABLE public.telegram_delivery_log ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_telegram_delivery_log_created_at ON public.telegram_delivery_log (created_at DESC);