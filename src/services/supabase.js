import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://guhajgofwwntarznvykd.supabase.co";
// const supabaseKey = process.env.SUPABASE_KEY
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd1aGFqZ29md3dudGFyem52eWtkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ0NjI5NDksImV4cCI6MjA1MDAzODk0OX0.HGvJ0MNv6Y5XEe99dR7BiVZACqKqhDwldFiE96YX7Bk";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
