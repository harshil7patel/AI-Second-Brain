import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://vvsgiymyiwrduohletmc.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2c2dpeW15aXdyZHVvaGxldG1jIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Njg3OTA1NywiZXhwIjoyMDkyNDU1MDU3fQ.jA49DsvDC8EDwAedqXnEfD7BBm-fYnNGjIrIr82TQwg" // service_role key
);

async function forceUpdateUser() {
  console.log("Fetching user...");
  const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
  if (listError) return console.error(listError);
  
  const user = users.find(u => u.email === "patel23harshil@gmail.com");
  if (!user) return console.log("User not found in list.");

  console.log("Updating user password and auto-confirming...");
  const { data, error } = await supabase.auth.admin.updateUserById(user.id, {
    password: "password123",
    email_confirm: true
  });
  
  console.log("Update result:", { data, error });
}

forceUpdateUser();
