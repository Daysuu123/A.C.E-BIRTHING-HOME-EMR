import { createClient } from '@supabase/supabase-js'

// Replace these with your actual Supabase credentials
const supabaseUrl = 'https://pjzbwavhzorpbrdtgwrh.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBqemJ3YXZoem9ycGJyZHRnd3JoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1OTk1MDMsImV4cCI6MjA3NjE3NTUwM30.GXiFi6biwbtj65_q3hgVP0xiRVshy_ONI-ijTxknVTE'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Test connection by fetching from a table (replace 'your_table' with an actual table name)
export async function testConnection() {
  const { error } = await supabase.from('A.C.E Birthing Home Database').select().limit(1)
  if (error) {
    console.error('Supabase connection failed:', error.message)
    return false
  }
  console.log('Supabase connection successful')
  return true
}