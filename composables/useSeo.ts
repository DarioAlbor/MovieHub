import { useHead } from '#app'

interface SeoOptions {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
}

export const useSeo = (options: SeoOptions = {}) => {
  const defaultSettings = {
    title: 'MovieHub - Tu plataforma de entretenimiento',
    description: 'Explora y disfruta de una amplia selección de películas y series en MovieHub, tu plataforma de streaming favorita.',
    keywords: 'películas, series, streaming, entretenimiento, MovieHub',
    image: '/favicon.svg',
    url: 'https://moviehub-verifarma.vercel.app',
    type: 'website'
  }

  const metaData = {
    title: options.title || defaultSettings.title,
    description: options.description || defaultSettings.description,
    keywords: options.keywords || defaultSettings.keywords,
    image: options.image || defaultSettings.image,
    url: options.url || defaultSettings.url,
    type: options.type || defaultSettings.type
  }

  useHead({
    title: metaData.title,
    meta: [
      { name: 'description', content: metaData.description },
      { name: 'keywords', content: metaData.keywords },
      { name: 'author', content: 'MovieHub Team' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { property: 'og:title', content: metaData.title },
      { property: 'og:description', content: metaData.description },
      { property: 'og:type', content: metaData.type },
      { property: 'og:url', content: metaData.url },
      { property: 'og:image', content: metaData.image }
    ],
    link: [
      { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
      { rel: 'sitemap', type: 'application/xml', href: '/sitemap.xml' }
    ]
  })

  return { metaData }
} 