import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.55.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('[safe-signup] Starting profile creation with service role')
    
    const { userId, fullName, email, phoneNumber } = await req.json()

    if (!userId || !email) {
      console.error('[safe-signup] Missing required fields:', { userId, email })
      return new Response(
        JSON.stringify({ error: 'Missing required fields: userId and email are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create Supabase client with service role key
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    console.log('[safe-signup] Attempting to insert profile for user:', userId)

    // Insert profile using service role (bypasses RLS)
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .insert({
        id: userId,
        full_name: fullName,
        email: email,
        phone_number: phoneNumber,
        profile_pending: false,
      })
      .select()
      .single()

    if (error) {
      console.error('[safe-signup] Profile insert failed:', error)
      return new Response(
        JSON.stringify({ error: error.message, details: error.details }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('[safe-signup] Profile created successfully:', data)
    
    return new Response(
      JSON.stringify({ success: true, profile: data }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (err: any) {
    console.error('[safe-signup] Unexpected error:', err)
    return new Response(
      JSON.stringify({ error: err.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
