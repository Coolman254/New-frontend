import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const demoUsers = [
      { email: "student123@gmail.com", password: "Student@123", role: "student" as const },
      { email: "teacher001@gmail.com", password: "Teacher@123", role: "teacher" as const },
      { email: "parent123@gmail.com", password: "Parent@123", role: "parent" as const },
      { email: "admin123@gmail.com", password: "Admin@123", role: "admin" as const },
    ];

    const results = [];

    for (const user of demoUsers) {
      // Check if user already exists
      const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
      const existing = existingUsers?.users?.find((u) => u.email === user.email);

      let userId: string;

      if (existing) {
        userId = existing.id;
        results.push({ email: user.email, status: "already exists", role: user.role });
      } else {
        const { data, error } = await supabaseAdmin.auth.admin.createUser({
          email: user.email,
          password: user.password,
          email_confirm: true,
          user_metadata: { full_name: `Demo ${user.role.charAt(0).toUpperCase() + user.role.slice(1)}` },
        });

        if (error) {
          results.push({ email: user.email, status: "error", error: error.message });
          continue;
        }
        userId = data.user.id;
        results.push({ email: user.email, status: "created", role: user.role });
      }

      // Ensure role exists
      const { data: existingRole } = await supabaseAdmin
        .from("user_roles")
        .select("id")
        .eq("user_id", userId)
        .eq("role", user.role)
        .maybeSingle();

      if (!existingRole) {
        await supabaseAdmin.from("user_roles").insert({ user_id: userId, role: user.role });
      }
    }

    return new Response(JSON.stringify({ success: true, results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
