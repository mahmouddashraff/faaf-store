import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'FAAF Fitness Magic',
    short_name: 'FAAF',
    description: 'Discover pure, science-backed athletic supplements, 100% whey isolate, performance creatine, and protein snacks engineered for peak fitness performance.',
    start_url: '/',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#000000',
    icons: [
      {
        src: '/icon.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: '/icon.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any'
      }
    ],
  }
}
