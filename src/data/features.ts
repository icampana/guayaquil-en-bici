import { Zap, Shield, Heart, Coffee, Smile, Type, TabletSmartphone, CodeXml, Users, Calendar, MessageCircle, BookOpen, Map, Award } from 'lucide-astro';

// Define the LucideIcon type based on the structure of Lucide icons
type LucideIcon = typeof Zap;

export interface Feature {
    icon: LucideIcon;
    title: string;
    description: string;
}

export interface FeatureList {
    id: string;
    features: Feature[];
}

// Example feature lists
export const featureLists: Record<string, FeatureList> = {
    main: {
        id: 'main',
        features: [
            {
                icon: Users,
                title: 'Comunidad Activa',
                description: 'Una red de ciclistas urbanos comprometidos con la movilidad sostenible en Guayaquil'
            },
            {
                icon: Calendar,
                title: 'Eventos Regulares',
                description: 'Masa Crítica mensual, Día Mundial Sin Auto, Alleycat y más actividades para todos'
            },
            {
                icon: Shield,
                title: 'Incidencia Ciudadana',
                description: 'Trabajamos por políticas públicas que promuevan el derecho a circular en bicicleta'
            },
            {
                icon: BookOpen,
                title: 'Educación y Capacitación',
                description: 'Talleres, charlas y recursos para promover el ciclismo urbano seguro'
            },
            {
                icon: MessageCircle,
                title: 'Espacio de Diálogo',
                description: 'Conectamos ciclistas, autoridades y ciudadanos para construir soluciones'
            },
            {
                icon: Heart,
                title: 'Inclusión y Diversidad',
                description: 'Todos son bienvenidos: diferentes edades, géneros y niveles de experiencia'
            }
        ]
    },
    secondary: {
        id: 'secondary',
        features: [
            {
                icon: Heart,
                title: 'Made with Love',
                description: 'Crafted with attention to detail'
            },
            {
                icon: Coffee,
                title: 'Always Fresh',
                description: 'Regular updates and improvements'
            },
            {
                icon: Smile,
                title: 'User Friendly',
                description: 'Intuitive and easy to use'
            }
        ]
    }
};
