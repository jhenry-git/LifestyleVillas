import { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://lifestyle-villas.com'
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    // Fetch all published villas for dynamic URLs
    const { data: villas } = await supabase
        .from('villas')
        .select('slug, updated_at')
        .eq('status', 'published')

    // Static pages with priority and change frequency
    const staticPages: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1.0,
        },
        {
            url: `${baseUrl}/villas`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/experiences`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/destinations/nanyuki`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/about`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.6,
        },
        {
            url: `${baseUrl}/reviews`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.7,
        },
    ]

    // Dynamic villa pages
    const villaPages: MetadataRoute.Sitemap = villas
        ? villas.map((villa) => ({
            url: `${baseUrl}/villas/${villa.slug}`,
            lastModified: villa.updated_at ? new Date(villa.updated_at) : new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.8,
        }))
        : []

    return [...staticPages, ...villaPages]
}
