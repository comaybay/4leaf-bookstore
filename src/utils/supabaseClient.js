import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://lzjctfgtohwryiuanczm.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6amN0Zmd0b2h3cnlpdWFuY3ptIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTI4NTk3MDMsImV4cCI6MTk2ODQzNTcwM30.cphU6RJ-KuRSgyp1tFsXLp445h1xhz0jGpcwFzH0Iac"

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  localStorage: AsyncStorage, detectSessionInUrl: false
 })