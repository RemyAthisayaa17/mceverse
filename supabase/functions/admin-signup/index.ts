import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.55.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AdminSignupRequest {
  role: "student" | "staff";
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  department?: string;
  yearOfStudy?: string;
  studentId?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body: AdminSignupRequest = await req.json();

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const admin = createClient(supabaseUrl, serviceKey);

    // 1) Create user as confirmed to bypass email verification
    const { data: createRes, error: createErr } = await admin.auth.admin.createUser({
      email: body.email,
      password: body.password,
      email_confirm: true,
      user_metadata: {
        full_name: body.fullName,
        phone_number: body.phone ?? null,
        department: body.department ?? null,
        academic_year: body.yearOfStudy ?? null,
        register_number: body.studentId ?? null,
        role: body.role,
      },
    });

    if (createErr || !createRes?.user) {
      console.error("admin-signup:createUser", createErr);
      
      // Check if it's a duplicate email error
      const isDuplicateEmail = createErr?.message?.includes('already been registered') || 
                               (createErr as any)?.code === 'email_exists';
      
      return new Response(
        JSON.stringify({ 
          ok: false, 
          error: createErr?.message || "Failed to create user",
          code: isDuplicateEmail ? 'EMAIL_EXISTS' : 'UNKNOWN_ERROR'
        }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const user = createRes.user;

    // 2) Create base profile
    const profilePayload = {
      id: user.id,
      email: body.email,
      full_name: body.fullName,
      phone_number: body.phone ?? null,
    };

    const { error: profileErr } = await admin.from("profiles").upsert(profilePayload, { onConflict: "id" });
    if (profileErr) {
      console.error("admin-signup:profiles upsert", profileErr);
    }

    // 3) Role-specific profile insertions (ignore duplicates)
    if (body.role === "student") {
      const { error: spErr } = await admin.from("student_profiles").insert({
        user_id: user.id,
        full_name: body.fullName,
        email: body.email,
        phone_number: body.phone ?? null,
        department: body.department ?? "",
        academic_year: body.yearOfStudy ?? "",
        register_number: body.studentId ?? "",
      });
      if (spErr && (spErr as any).code !== "23505") {
        console.error("admin-signup:student_profiles insert", spErr);
      }
    } else if (body.role === "staff") {
      const { error: stErr } = await admin.from("staff_profiles").insert({
        user_id: user.id,
        full_name: body.fullName,
        email: body.email,
        phone_number: body.phone ?? null,
        department: body.department ?? "",
        academic_year: body.yearOfStudy ?? "",
      });
      if (stErr && (stErr as any).code !== "23505") {
        console.error("admin-signup:staff_profiles insert", stErr);
      }
    }

    return new Response(
      JSON.stringify({ ok: true, userId: user.id }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("admin-signup:error", error);
    return new Response(
      JSON.stringify({ ok: false, error: error?.message || "Unexpected error" }),
      { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});