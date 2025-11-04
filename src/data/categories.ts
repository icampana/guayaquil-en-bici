interface Category {
  name: string;
  slug: string;
  description: string;
}

export const categories: Category[] = [
  {
    name: 'Noticias',
    slug: 'noticias',
    description: 'Últimas noticias sobre ciclismo urbano y movilidad sostenible'
  },
  {
    name: 'Destacadas',
    slug: 'destacadas',
    description: 'Contenido destacado y artículos más relevantes'
  },
  {
    name: 'Locales',
    slug: 'locales',
    description: 'Noticias y eventos locales de ciclismo'
  },
  {
    name: 'Internacionales',
    slug: 'internacionales',
    description: 'Noticias de ciclismo y movilidad a nivel internacional'
  },
  {
    name: 'Opinión',
    slug: 'opinion',
    description: 'Artículos de opinión y reflexiones sobre movilidad'
  },
  {
    name: 'Reportajes',
    slug: 'reportajes',
    description: 'Reportajes en profundidad sobre ciclismo urbano'
  },
  {
    name: 'Entrevistas',
    slug: 'entrevistas',
    description: 'Entrevistas con ciclistas y activistas'
  },
  {
    name: 'Información',
    slug: 'informacion',
    description: 'Información útil para ciclistas urbanos'
  },
  {
    name: 'Seguridad',
    slug: 'seguridad',
    description: 'Consejos y tips de seguridad para ciclistas'
  },
  {
    name: 'Espacios Públicos',
    slug: 'espacios-publicos',
    description: 'Infraestructura ciclista y espacios públicos'
  },
  {
    name: 'Fotos',
    slug: 'fotos',
    description: 'Galerías fotográficas y contenido visual'
  },
  {
    name: 'Videos',
    slug: 'videos',
    description: 'Contenido en video sobre ciclismo'
  },
  {
    name: 'Indumentaria',
    slug: 'indumentaria',
    description: 'Equipamiento y vestimenta para ciclistas'
  },
];

// Helper function to get category by slug
export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find(category => category.slug === slug);
}