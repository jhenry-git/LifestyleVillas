import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
    return createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
}

// Allowed admin emails - only these can access the admin panel
export const ALLOWED_ADMIN_EMAILS = [
    'lifestylevillasbnb@gmail.com',
    'jhenry@glidexp.com',
    // Add more admin emails here as needed
]

export function isAllowedAdminEmail(email: string): boolean {
    return ALLOWED_ADMIN_EMAILS.includes(email.toLowerCase())
}
