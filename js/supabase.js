const SUPABASE_URL = "https://fzxhhmklosdowjaztjuy.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ6eGhobWtsb3Nkb3dqYXp0anV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2MDI0MzIsImV4cCI6MjA4NzE3ODQzMn0.pInQANuUh-G4PKEwLRTqmyYZHf0NTqp4SQPJuykwQeU";

// Cria a instância global (usando let ou capturando a biblioteca do window)
const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
