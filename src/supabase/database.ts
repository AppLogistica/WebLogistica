import { createClient } from '@supabase/supabase-js'

export const supabase = createClient('https://iycskjreiopxtxzqczkh.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml5Y3NranJlaW9weHR4enFjemtoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEwMzA1NjEsImV4cCI6MjA1NjYwNjU2MX0.yr0rf4tRG2ktOdHjYG3oF7nnhkuVrf8CxUPKgdBuHK4')