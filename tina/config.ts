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
    ],
  },
});
