import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://vvsgiymyiwrduohletmc.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2c2dpeW15aXdyZHVvaGxldG1jIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Njg3OTA1NywiZXhwIjoyMDkyNDU1MDU3fQ.jA49DsvDC8EDwAedqXnEfD7BBm-fYnNGjIrIr82TQwg" // service_role key
);

async function setupUser() {
  console.log("Creating user...");
  const { data, error } = await supabase.auth.admin.createUser({
    email: "patel23harshil@gmail.com",
    password: "password123",
    email_confirm: true,
    user_metadata: { full_name: "Harshil Patel" }
  });
  console.log("Create user result:", { data, error });
}

setupUser();
