import { MetadataRoute } from 'next';
import { TOOLS } from '@/lib/tools';
import { GUIDES } from '@/lib/guides';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://cifra.tools';
  const lastModified = new Date('2026-10-21T00:00:00.000Z');

  // Páginas estáticas principales
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/herramientas`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/guias`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/acerca`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contacto`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacidad`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/aviso-legal`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/cookies`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/editorial`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
  ];

  // Herramientas individuales
  const toolPages: MetadataRoute.Sitemap = TOOLS.map((tool) => ({
    url: `${baseUrl}/herramientas/${tool.slug}`,
    lastModified,
    changeFrequency: 'weekly',
    priority: 0.9,
  }));

  // Guías individuales
  const guidePages: MetadataRoute.Sitemap = GUIDES.map((guide) => ({
    url: `${baseUrl}/guias/${guide.slug}`,
    lastModified: new Date(guide.publishDate),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [...staticPages, ...toolPages, ...guidePages];
}
