# Supabase Configuration Guide

## Environment Variables

This project uses a single, consistent Supabase instance across all components. The configuration is managed through environment variables.

### Client-Side Variables (Browser)

These variables are prefixed with `VITE_` and are used in the React application:

- **VITE_SUPABASE_URL**: Your Supabase project URL
- **VITE_SUPABASE_ANON_KEY**: Public anonymous key for client-side operations

Example in code:
```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### Server-Side Variables (Edge Functions)

Supabase Edge Functions automatically have access to these environment variables:

- **SUPABASE_URL**: Your Supabase project URL (auto-provided by Supabase)
- **SUPABASE_SERVICE_ROLE_KEY**: Service role key for admin operations (auto-provided by Supabase)

These are used in Deno edge functions for server-side operations that require elevated privileges:

```typescript
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);
```

## Security Notes

### Anon Key vs Service Role Key

- **VITE_SUPABASE_ANON_KEY**:
  - Safe to expose in client-side code
  - Row Level Security (RLS) policies restrict access
  - Used for user-facing operations

- **VITE_SUPABASE_SERVICE_ROLE_KEY**:
  - NEVER expose in client-side code
  - Bypasses all RLS policies
  - Only use in server-side Edge Functions
  - Has full admin access to your database

## Setup Instructions

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Update `.env` with your actual Supabase credentials:
   - Get these from your Supabase project dashboard
   - Project Settings → API → Project URL and API Keys

3. **Important**: The `.env` file is gitignored for security. Never commit it to version control.

## Configuration Files

### .env (Local Development)
Contains your actual credentials. Not committed to git.

### .env.example (Template)
Template file showing required environment variables. Safe to commit to git.

## Troubleshooting

### URL Changes Every Time
If your Supabase URL keeps changing, ensure you're using a permanent Supabase project:

1. Create a persistent Supabase project at https://supabase.com
2. Copy the permanent URL and keys to your `.env` file
3. Configure your deployment platform to use these same credentials

### Missing Environment Variables
If you see errors about missing environment variables:

1. Verify `.env` file exists in project root
2. Check that all required variables are defined
3. Restart your development server after changing `.env`
4. For Edge Functions, ensure variables are configured in Supabase dashboard

## Current Configuration

This project is configured to use:
- **Supabase URL**: https://tjdhltvbnqpbywxgtkpt.supabase.co
- **Client Library**: @supabase/supabase-js v2.57.4
- **Edge Functions**: Two seeding functions for demo users and initial data
