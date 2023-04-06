import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
    'https://ribscxvwydtjnrvyilkg.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJpYnNjeHZ3eWR0am5ydnlpbGtnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY4MDc5MjU1OCwiZXhwIjoxOTk2MzY4NTU4fQ.LHdpoz0n9-YTjCQEUA8sQbxg-g_OXdnFJEGokxwahlw',
)