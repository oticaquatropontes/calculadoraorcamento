import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://bvyrqhccnxekeouzidfp.supabase.co'

const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2eXJxaGNjbnhla2VvdXppZGZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQwMzU1NjUsImV4cCI6MjA5OTYxMTU2NX0.xjB_O8aeWPa5KZpWUTFflD3f79FgBYJAsA4QAzqzJ60'

export const supabase = createClient(
  supabaseUrl,
  supabaseKey
)