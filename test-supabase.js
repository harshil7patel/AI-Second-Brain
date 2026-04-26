import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://vvsgiymyiwrduohletmc.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2c2dpeW15aXdyZHVvaGxldG1jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY4NzkwNTcsImV4cCI6MjA5MjQ1NTA1N30.OjZVBWOdVGbw3Z0yi6NqgvZyzXyVmEGB4vUCGf4pI78"
);

async function test() {
  console.log("Starting sign in...");
  const { data, error } = await supabase.auth.signInWithPassword({
    email: "patel23harshil@gmail.com",
    password: "password123",
  });
  console.log("Result:", { data, error });
}

test();
