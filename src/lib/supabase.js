import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://extkotvjigtswrrnxikw.supabase.co';
const supabaseAnonKey = 'sb_publishable_17C83bnQAgpEwASSlFKxZw_6U6Qaa4o';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);