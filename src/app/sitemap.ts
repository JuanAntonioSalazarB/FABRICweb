import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://fabriconsulting.com.mx';
  
  const routes = [
    '',
    '/aplicar',
    '/casos/ape-plazas',
    '/casos/ape-plazas/audit-trail',
    '/casos/aplazo',
    '/casos/aplazo/audit-trail',
    '/coming-soon',
    '/comparator/cloud',
    '/comparator/erp',
    '/diagnostico',
    '/doctrina',
    '/doctrina/generator',
    '/office-hours',
    '/referencias',
    '/transparencia'
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'weekly' : 'monthly',
    priority: route === '' ? 1.0 : 0.8,
  }));
}
