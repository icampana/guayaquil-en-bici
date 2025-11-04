// src/data/menu.ts

export const headerMenu = [
    { name: 'Inicio', link: '/' },
    { name: 'Blog', link: '/blog' },
    {
        name: 'Sobre Nosotros',
        link: '/que-hacemos',
        children: [
            { name: '¿Quiénes Somos?', link: '/que-hacemos' },
            { name: 'Contáctanos', link: '/contactanos' },
            { name: 'Apóyanos', link: '/apoyanos' },
        ]
    },
    {
        name: 'Proyectos',
        link: '/blog/campana-la-bicicleta-como-derecho-humano',
        children: [
            { name: 'La bici como derecho humano', link: '/blog/campana-la-bicicleta-como-derecho-humano' },
            { name: 'Resultados de Encuesta', link: '/blog/resultados-de-opinion-ciudadana-sobre-la-convivencia-vial-en-guayaquil' },
            { name: 'Manifiesto Ciudadano', link: '/blog/manifiesto-ciudadano-por-el-derecho-a-circular-y-pedalear-en-condiciones-dignas' },
        ]
    },
    {
        name: 'Actividades',
        link: '/masa-critica',
        children: [
            { name: 'Masa Crítica', link: '/masa-critica' },
            { name: 'Día Mundial Sin Auto', link: '/dia-mundial-sin-auto' },
            { name: 'Alleycat', link: '/alley-cat-guayaquil' },
            { name: 'Semana de la Movilidad', link: '/semana-movilidad-guayaca' },
        ]
    },
    {
        name: 'Recursos',
        link: '/tiendas-talleres-guayaquil',
        children: [
            { name: 'Tiendas y Talleres', link: '/tiendas-talleres-guayaquil' },
            { name: 'Clubes y Grupos', link: '/clubes-y-grupos-de-ciclismo' },
            { name: 'Tipos de Bicicletas', link: '/que-bicicleta-es-la-mejor-para-mi' },
        ]
    }
];

export const footerMenu = [
    { name: 'Sobre Nosotros', link: '/que-hacemos' },
    { name: 'Blog', link: '/blog' },
    { name: 'Contáctanos', link: '/contactanos' },
];

export const legalMenu = [
    { name: 'Política de Privacidad', link: '/legal/privacy-policy' },
    { name: 'Términos de Servicio', link: '/legal/terms-of-service' }
];

