import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.55.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('[safe-signup] Starting profile creation with service role')
    
    const { userId, fullName, email, phoneNumber } = await req.json()

    // Validate required fields
    if (!userId || !email) {
      console.error('[safe-signup] Missing required fields')
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Validate email format
    if (!EMAIL_REGEX.test(email)) {
      console.error('[safe-signup] Invalid email format')
      return new Response(
        JSON.stringify({ error: 'Invalid email format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Validate full name length
    if (fullName && fullName.length > 200) {
      console.error('[safe-signup] Full name too long')
      return new Response(
        JSON.stringify({ error: 'Full name exceeds maximum length' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Validate phone number format if provided
    if (phoneNumber && !/^[\d\s\+\-\(\)]+$/.test(phoneNumber)) {
      console.error('[safe-signup] Invalid phone number format')
      return new Response(
        JSON.stringify({ error: 'Invalid phone number format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get authenticated user from JWT to verify caller identity
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      console.error('[safe-signup] No authorization header')
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create Supabase client to verify JWT
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    })

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      console.error('[safe-signup] Authentication failed:', authError?.message)
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Verify the userId matches the authenticated user
    if (user.id !== userId) {
      console.error('[safe-signup] User ID mismatch - potential impersonation attempt')
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create Supabase admin client with service role key
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
        JSON.stringify({ error: 'Failed to create profile' }),
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
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
