import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  // Update this dynamically once a custom domain is bought
  const baseUrl = 'https://safecon-phi.vercel.app';

  const routes = [
    '',
    '/add-page-numbers',
    '/compress',
    '/images-to-pdf',
    '/merge-pdf',
    '/pdf-to-images',
    '/protect-pdf',
    '/rotate-pdf',
    '/sign-pdf',
    '/split-pdf',
    '/unlock-pdf',
    '/watermark-pdf'
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: route === '' ? 1 : 0.8,
  }));
}
