import { defineConfig } from 'tinacms';

// Your hosting provider likely exposes this as an environment variable
const branch =
  process.env.GITHUB_BRANCH ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  process.env.HEAD ||
  'main';

export default defineConfig({
  branch,

  // Get this from tina.io
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID,
  // Get this from tina.io
  token: process.env.TINA_TOKEN,

  build: {
    outputFolder: 'admin',
    publicFolder: 'public',
  },
  media: {
    tina: {
      mediaRoot: 'uploads',
      publicFolder: 'public',
    },
  },
  // See docs on content modeling for more info on how to setup new content models: https://tina.io/docs/schema/
  schema: {
    collections: [
      {
        name: 'blog',
        label: 'Blog Posts',
        path: 'src/content/blog',
        format: 'md',
        fields: [
          {
            type: 'string',
            name: 'title',
            label: 'Título',
            isTitle: true,
            required: true,
          },
          {
            type: 'string',
            name: 'excerpt',
            label: 'Extracto',
            required: true,
            ui: {
              component: 'textarea',
            },
          },
          {
            type: 'image',
            name: 'featuredImage',
            label: 'Imagen Destacada',
          },
          {
            type: 'datetime',
            name: 'publishDate',
            label: 'Fecha de Publicación',
            required: true,
          },
          {
            type: 'boolean',
            name: 'publish',
            label: 'Publicar',
            description: 'Desmarcar para ocultar este post',
          },
          {
            type: 'string',
            name: 'categories',
            label: 'Categorías',
            list: true,
            options: [
              { value: 'noticias', label: 'Noticias' },
              { value: 'destacadas', label: 'Destacadas' },
              { value: 'locales', label: 'Locales' },
              { value: 'internacionales', label: 'Internacionales' },
              { value: 'opinion', label: 'Opinión' },
              { value: 'reportajes', label: 'Reportajes' },
              { value: 'entrevistas', label: 'Entrevistas' },
              { value: 'informacion', label: 'Información' },
              { value: 'seguridad', label: 'Seguridad' },
              { value: 'espacios-publicos', label: 'Espacios Públicos' },
              { value: 'fotos', label: 'Fotos' },
              { value: 'videos', label: 'Videos' },
              { value: 'indumentaria', label: 'Indumentaria' },
            ],
          },
          {
            type: 'string',
            name: 'tags',
            label: 'Etiquetas',
            list: true,
          },
          {
            type: 'rich-text',
            name: 'body',
            label: 'Contenido',
            isBody: true,
          },
          {
            type: 'object',
            name: 'seo',
            label: 'SEO',
            fields: [
              {
                type: 'string',
                name: 'title',
                label: 'Título SEO',
              },
              {
                type: 'string',
                name: 'description',
                label: 'Descripción SEO',
                ui: {
                  component: 'textarea',
                },
              },
              {
                type: 'string',
                name: 'image',
                label: 'Imagen SEO',
              },
            ],
          },
        ],
        defaultItem: () => {
          return {
            title: 'Nueva Entrada',
            publishDate: new Date().toISOString(),
            publish: true,
            categories: [],
            tags: [],
          };
        },
      },
      {
        name: 'page',
        label: 'Pages',
        path: 'src/content/pages',
        format: 'md',
        fields: [
          {
            type: 'string',
            name: 'title',
            label: 'Título',
            isTitle: true,
            required: true,
          },
          {
            type: 'string',
            name: 'excerpt',
            label: 'Extracto',
            ui: {
              component: 'textarea',
            },
          },
          {
            type: 'boolean',
            name: 'publish',
            label: 'Publicar',
          },
          {
            type: 'rich-text',
            name: 'body',
            label: 'Contenido',
            isBody: true,
          },
          {
            type: 'object',
            name: 'seo',
            label: 'SEO',
            fields: [
              {
                type: 'string',
                name: 'title',
                label: 'Título SEO',
              },
              {
                type: 'string',
                name: 'description',
                label: 'Descripción SEO',
                ui: {
                  component: 'textarea',
                },
              },
            ],
          },
        ],
      },
      {
        name: 'service',
        label: 'Services',
        path: 'src/content/services',
        format: 'md',
        fields: [
          {
            type: 'string',
            name: 'title',
            label: 'Título',
            isTitle: true,
            required: true,
          },
          {
            type: 'string',
            name: 'excerpt',
            label: 'Extracto',
            ui: {
              component: 'textarea',
            },
          },
          {
            type: 'image',
            name: 'icon',
            label: 'Icono',
          },
          {
            type: 'string',
            name: 'link',
            label: 'Enlace',
          },
          {
            type: 'number',
            name: 'order',
            label: 'Orden',
            description: 'Orden de visualización',
          },
          {
            type: 'rich-text',
            name: 'body',
            label: 'Descripción',
            isBody: true,
          },
        ],
      },
      {
        name: 'video',
        label: 'Videos',
        path: 'src/content/videos',
        format: 'md',
        fields: [
          {
            type: 'string',
            name: 'title',
            label: 'Título',
            isTitle: true,
            required: true,
          },
          {
            type: 'string',
            name: 'videoUrl',
            label: 'URL del Video',
            description: 'YouTube, Vimeo, etc.',
            required: true,
          },
          {
            type: 'string',
            name: 'category',
            label: 'Categoría',
            options: [
              { value: 'tutorial', label: 'Tutorial' },
              { value: 'demo', label: 'Demostración' },
              { value: 'presentation', label: 'Presentación' },
            ],
          },
          {
            type: 'image',
            name: 'thumbnail',
            label: 'Miniatura',
          },
          {
            type: 'rich-text',
            name: 'body',
            label: 'Descripción',
            isBody: true,
          },
        ],
      },
      {
        name: 'banner',
        label: 'Banners',
        path: 'src/content/banners',
        format: 'md',
        fields: [
          {
            type: 'string',
            name: 'title',
            label: 'Título',
            isTitle: true,
            required: true,
          },
          {
            type: 'image',
            name: 'image',
            label: 'Imagen del Banner',
            required: true,
          },
          {
            type: 'string',
            name: 'link',
            label: 'Enlace',
          },
          {
            type: 'number',
            name: 'order',
            label: 'Orden',
            description: 'Orden de visualización',
          },
          {
            type: 'boolean',
            name: 'active',
            label: 'Activo',
            description: 'Mostrar este banner',
          },
          {
            type: 'rich-text',
            name: 'body',
            label: 'Contenido',
            isBody: true,
          },
        ],
        defaultItem: () => {
          return {
            title: 'Nuevo Banner',
            active: true,
            order: 0,
          };
        },
      },
      {
        name: 'feature',
        label: 'Características',
        path: 'src/content/features',
        format: 'md',
        fields: [
          {
            type: 'string',
            name: 'title',
            label: 'Título',
            isTitle: true,
            required: true,
          },
          {
            type: 'string',
            name: 'description',
            label: 'Descripción',
            required: true,
            ui: {
              component: 'textarea',
            },
          },
          {
            type: 'string',
            name: 'icon',
            label: 'Icono',
            required: true,
            options: [
              { value: 'users', label: 'Usuarios' },
              { value: 'calendar', label: 'Calendario' },
              { value: 'shield', label: 'Escudo' },
              { value: 'book-open', label: 'Libro Abierto' },
              { value: 'message-circle', label: 'Mensaje' },
              { value: 'heart', label: 'Corazón' },
              { value: 'bike', label: 'Bicicleta' },
              { value: 'map', label: 'Mapa' },
              { value: 'award', label: 'Premio' },
              { value: 'target', label: 'Objetivo' },
              { value: 'megaphone', label: 'Megáfono' },
              { value: 'flag', label: 'Bandera' },
              { value: 'trophy', label: 'Trofeo' },
              { value: 'compass', label: 'Brújula' },
              { value: 'trending-up', label: 'Tendencia Creciente' },
              { value: 'user-plus', label: 'Agregar Usuario' },
              { value: 'user-check', label: 'Usuario Verificado' },
              { value: 'building', label: 'Edificio' },
              { value: 'clipboard-list', label: 'Lista' },
              { value: 'file-text', label: 'Documento' },
            ],
          },
          {
            type: 'number',
            name: 'order',
            label: 'Orden',
            description: 'Orden de visualización (menor número aparece primero)',
            required: true,
          },
          {
            type: 'boolean',
            name: 'active',
            label: 'Activo',
            description: 'Mostrar esta característica en el sitio',
          },
          {
            type: 'rich-text',
            name: 'body',
            label: 'Contenido Adicional',
            description: 'Contenido opcional adicional',
            isBody: true,
          },
        ],
        defaultItem: () => {
          return {
            title: 'Nueva Característica',
            active: true,
            order: 999,
            icon: 'users',
          };
        },
      },
      {
        name: 'homepage',
        label: 'Página Principal',
        path: 'src/content/homepage',
        format: 'md',
        ui: {
          allowedActions: {
            create: false,
            delete: false,
          },
        },
        fields: [
          {
            type: 'string',
            name: 'title',
            label: 'Título de la Página',
            isTitle: true,
            required: true,
            description: 'Solo para referencia interna',
          },
          // Hero Section
          {
            type: 'object',
            name: 'hero',
            label: 'Sección Hero',
            fields: [
              {
                type: 'string',
                name: 'heroTitle',
                label: 'Título',
                required: true,
              },
              {
                type: 'string',
                name: 'heroDescription',
                label: 'Descripción',
                required: true,
                ui: {
                  component: 'textarea',
                },
              },
              {
                type: 'image',
                name: 'heroImage',
                label: 'Imagen de Fondo',
              },
              {
                type: 'number',
                name: 'heroOverlayOpacity',
                label: 'Opacidad de Superposición',
                description: 'Valor entre 0 y 1 (ej: 0.3)',
              },
              {
                type: 'string',
                name: 'heroButton1Text',
                label: 'Texto del Botón 1',
                required: true,
              },
              {
                type: 'string',
                name: 'heroButton1Link',
                label: 'Enlace del Botón 1',
                required: true,
              },
              {
                type: 'string',
                name: 'heroButton2Text',
                label: 'Texto del Botón 2',
                required: true,
              },
              {
                type: 'string',
                name: 'heroButton2Link',
                label: 'Enlace del Botón 2',
                required: true,
              },
            ],
          },
          // Features Section
          {
            type: 'object',
            name: 'features',
            label: 'Sección de Características',
            fields: [
              {
                type: 'string',
                name: 'featuresEyebrow',
                label: 'Subtítulo Superior',
                required: true,
              },
              {
                type: 'string',
                name: 'featuresTitle',
                label: 'Título',
                required: true,
              },
              {
                type: 'string',
                name: 'featuresDescription',
                label: 'Descripción',
                required: true,
                ui: {
                  component: 'textarea',
                },
              },
              {
                type: 'string',
                name: 'featuresButtonText',
                label: 'Texto del Botón',
                required: true,
              },
              {
                type: 'string',
                name: 'featuresButtonLink',
                label: 'Enlace del Botón',
                required: true,
              },
            ],
          },
          // Main CTA Section
          {
            type: 'object',
            name: 'mainCta',
            label: 'Llamada a la Acción Principal',
            fields: [
              {
                type: 'string',
                name: 'mainCtaEyebrow',
                label: 'Subtítulo Superior',
                required: true,
              },
              {
                type: 'string',
                name: 'mainCtaTitle',
                label: 'Título',
                required: true,
              },
              {
                type: 'string',
                name: 'mainCtaDescription',
                label: 'Descripción',
                required: true,
                ui: {
                  component: 'textarea',
                },
              },
              {
                type: 'string',
                name: 'mainCtaButtonText',
                label: 'Texto del Botón',
                required: true,
              },
              {
                type: 'string',
                name: 'mainCtaButtonLink',
                label: 'Enlace del Botón',
                required: true,
              },
            ],
          },
          // Footer CTA Section
          {
            type: 'object',
            name: 'footerCta',
            label: 'Llamada a la Acción del Footer',
            fields: [
              {
                type: 'string',
                name: 'footerCtaEyebrow',
                label: 'Subtítulo Superior',
                required: true,
              },
              {
                type: 'string',
                name: 'footerCtaTitle',
                label: 'Título',
                required: true,
              },
              {
                type: 'string',
                name: 'footerCtaDescription',
                label: 'Descripción',
                required: true,
                ui: {
                  component: 'textarea',
                },
              },
              {
                type: 'string',
                name: 'footerCtaButtonText',
                label: 'Texto del Botón',
                required: true,
              },
              {
                type: 'string',
                name: 'footerCtaButtonLink',
                label: 'Enlace del Botón',
                required: true,
              },
            ],
          },
          // Recent Posts Section
          {
            type: 'object',
            name: 'recentPosts',
            label: 'Sección de Publicaciones Recientes',
            fields: [
              {
                type: 'string',
                name: 'recentPostsEyebrow',
                label: 'Subtítulo Superior',
                required: true,
              },
              {
                type: 'string',
                name: 'recentPostsTitle',
                label: 'Título',
                required: true,
              },
              {
                type: 'string',
                name: 'recentPostsDescription',
                label: 'Descripción',
                required: true,
                ui: {
                  component: 'textarea',
                },
              },
              {
                type: 'string',
                name: 'recentPostsButtonText',
                label: 'Texto del Botón',
                required: true,
              },
              {
                type: 'string',
                name: 'recentPostsButtonLink',
                label: 'Enlace del Botón',
                required: true,
              },
              {
                type: 'number',
                name: 'recentPostsCount',
                label: 'Número de Publicaciones a Mostrar',
                description: 'Cantidad de posts recientes a mostrar',
              },
            ],
          },
          // SEO
          {
            type: 'object',
            name: 'seo',
            label: 'SEO',
            fields: [
              {
                type: 'string',
                name: 'seoTitle',
                label: 'Título SEO',
                required: true,
              },
              {
                type: 'string',
                name: 'seoDescription',
                label: 'Descripción SEO',
                required: true,
                ui: {
                  component: 'textarea',
                },
              },
            ],
          },
          {
            type: 'rich-text',
            name: 'body',
            label: 'Notas',
            description: 'Notas internas (no se muestran en el sitio)',
            isBody: true,
          },
        ],
      },
    ],
  },
});
