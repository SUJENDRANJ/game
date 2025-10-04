import { createClient } from 'npm:@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);

    const demoUsers = [
      {
        email: 'admin@gmail.com',
        password: 'admin@123',
        fullName: 'Admin User',
        role: 'admin'
      },
      {
        email: 'sarah.chen@company.com',
        password: 'demo123',
        fullName: 'Sarah Chen',
        role: 'employee'
      },
      {
        email: 'marcus.rodriguez@company.com',
        password: 'demo123',
        fullName: 'Marcus Rodriguez',
        role: 'employee'
      }
    ];

    const results = [];

    for (const user of demoUsers) {
      const { data: existingUser } = await supabaseAdmin.auth.admin.listUsers();
      const userExists = existingUser?.users.some(u => u.email === user.email);

      if (!userExists) {
        const { data, error } = await supabaseAdmin.auth.admin.createUser({
          email: user.email,
          password: user.password,
          email_confirm: true,
          user_metadata: {
            full_name: user.fullName,
            role: user.role
          }
        });

        if (error) {
          results.push({ email: user.email, status: 'error', message: error.message });
        } else {
          results.push({ email: user.email, status: 'created', id: data.user?.id });
        }
      } else {
        results.push({ email: user.email, status: 'already_exists' });
      }
    }

    return new Response(
      JSON.stringify({ success: true, results }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    );
  }
});