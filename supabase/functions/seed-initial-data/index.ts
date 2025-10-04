import { createClient } from 'npm:@supabase/supabase-js@2';

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
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const achievements = [
      {
        title: 'First Steps',
        description: 'Complete your first task',
        icon: 'star',
        points_reward: 50,
        category: 'milestone',
        rarity: 'common'
      },
      {
        title: 'Team Player',
        description: 'Help 5 colleagues',
        icon: 'users',
        points_reward: 100,
        category: 'social',
        rarity: 'rare'
      },
      {
        title: 'Speed Demon',
        description: 'Complete a task in under 1 hour',
        icon: 'zap',
        points_reward: 75,
        category: 'performance',
        rarity: 'common'
      },
      {
        title: 'Perfect Week',
        description: 'Complete all tasks for 5 consecutive days',
        icon: 'calendar',
        points_reward: 200,
        category: 'milestone',
        rarity: 'epic'
      },
      {
        title: 'Master Achiever',
        description: 'Unlock 10 achievements',
        icon: 'trophy',
        points_reward: 300,
        category: 'special',
        rarity: 'legendary'
      }
    ];

    const rewards = [
      {
        title: 'Extra Day Off',
        description: 'Enjoy an additional vacation day',
        points_cost: 500,
        category: 'time_off',
        image_url: 'https://images.pexels.com/photos/1285625/pexels-photo-1285625.jpeg',
        stock_quantity: 10,
        is_active: true
      },
      {
        title: 'Premium Parking Spot',
        description: 'Reserved parking spot for one month',
        points_cost: 300,
        category: 'perks',
        image_url: 'https://images.pexels.com/photos/753876/pexels-photo-753876.jpeg',
        stock_quantity: 5,
        is_active: true
      },
      {
        title: 'Company Hoodie',
        description: 'Premium branded hoodie in your size',
        points_cost: 250,
        category: 'swag',
        image_url: 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg',
        stock_quantity: 20,
        is_active: true
      },
      {
        title: 'Team Lunch',
        description: 'Catered lunch for your entire team',
        points_cost: 400,
        category: 'experiences',
        image_url: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
        stock_quantity: 8,
        is_active: true
      },
      {
        title: 'Half Day Off',
        description: 'Leave early or come in late',
        points_cost: 250,
        category: 'time_off',
        image_url: 'https://images.pexels.com/photos/1416530/pexels-photo-1416530.jpeg',
        stock_quantity: 15,
        is_active: true
      },
      {
        title: 'Coffee Subscription',
        description: 'One month premium coffee delivery',
        points_cost: 200,
        category: 'perks',
        image_url: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg',
        stock_quantity: 12,
        is_active: true
      }
    ];

    const { data: existingAchievements } = await supabase.from('achievements').select('id');
    if (!existingAchievements || existingAchievements.length === 0) {
      await supabase.from('achievements').insert(achievements);
    }

    const { data: existingRewards } = await supabase.from('rewards').select('id');
    if (!existingRewards || existingRewards.length === 0) {
      await supabase.from('rewards').insert(rewards);
    }

    return new Response(
      JSON.stringify({ message: 'Initial data seeded successfully' }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});
