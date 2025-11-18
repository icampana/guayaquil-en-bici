import {
    Zap,
    Shield,
    Heart,
    Coffee,
    Smile,
    Type,
    TabletSmartphone,
    CodeXml,
    Users,
    Calendar,
    MessageCircle,
    BookOpen,
    Map,
    Award,
    Bike,
    Building,
    Car,
    Clipboard,
    ClipboardList,
    Compass,
    FileText,
    Flag,
    Megaphone,
    Navigation,
    Radio,
    Target,
    TrendingUp,
    Trophy,
    UserCheck,
    UserPlus
} from 'lucide-astro';

// Map of icon names to Lucide icon components
export const iconMap = {
    'zap': Zap,
    'shield': Shield,
    'heart': Heart,
    'coffee': Coffee,
    'smile': Smile,
    'type': Type,
    'tablet-smartphone': TabletSmartphone,
    'code-xml': CodeXml,
    'users': Users,
    'calendar': Calendar,
    'message-circle': MessageCircle,
    'book-open': BookOpen,
    'map': Map,
    'award': Award,
    'bike': Bike,
    'building': Building,
    'car': Car,
    'clipboard': Clipboard,
    'clipboard-list': ClipboardList,
    'compass': Compass,
    'file-text': FileText,
    'flag': Flag,
    'megaphone': Megaphone,
    'navigation': Navigation,
    'radio': Radio,
    'target': Target,
    'trending-up': TrendingUp,
    'trophy': Trophy,
    'user-check': UserCheck,
    'user-plus': UserPlus
} as const;

export type IconName = keyof typeof iconMap;

// Helper function to get icon component by name
export function getIcon(iconName: string) {
    return iconMap[iconName as IconName] || Users; // Default to Users icon if not found
}

// Get all available icon names for use in CMS
export const availableIcons = Object.keys(iconMap);
