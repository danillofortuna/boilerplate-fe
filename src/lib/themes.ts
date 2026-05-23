export interface ThemeColors {
    // Core colors
    background: string;
    foreground: string;
    card: string;
    cardForeground: string;
    popover: string;
    popoverForeground: string;
    primary: string;
    primaryForeground: string;
    secondary: string;
    secondaryForeground: string;
    muted: string;
    mutedForeground: string;
    accent: string;
    accentForeground: string;
    destructive: string;
    destructiveForeground: string;
    border: string;
    input: string;
    ring: string;

    // Chart colors
    chart1: string;
    chart2: string;
    chart3: string;
    chart4: string;
    chart5: string;

    // Sidebar colors
    sidebar: string;
    sidebarForeground: string;
    sidebarPrimary: string;
    sidebarPrimaryForeground: string;
    sidebarAccent: string;
    sidebarAccentForeground: string;
    sidebarBorder: string;
    sidebarRing: string;
}

export interface Theme {
    name: string;
    value: string;
    icon?: string;
    description: string;
    light: ThemeColors;
    dark: ThemeColors;
    // Configurações customizadas opcionais
    config?: {
        fontSans?: string;
        fontSerif?: string;
        fontMono?: string;
        radius?: string;
        letterSpacing?: string;
        spacing?: string;
        shadows?: {
            '2xs'?: string;
            'xs'?: string;
            'sm'?: string;
            'default'?: string;
            'md'?: string;
            'lg'?: string;
            'xl'?: string;
            '2xl'?: string;
        };
    };
}

// Tema 1: Oceano (Azul profundo)
export const oceanTheme: Theme = {
    name: "Oceano",
    value: "ocean",
    icon: "🌊",
    description: "Tema azul profundo inspirado no oceano",
    light: {
        background: "oklch(0.9956 0.0021 236.8931)",
        foreground: "oklch(0.1549 0.0147 236.9061)",
        card: "oklch(0.9956 0.0021 236.8931)",
        cardForeground: "oklch(0.1549 0.0147 236.9061)",
        popover: "oklch(0.9956 0.0021 236.8931)",
        popoverForeground: "oklch(0.3733 0.0082 236.8942)",
        primary: "oklch(0.5451 0.1723 236.8936)",
        primaryForeground: "oklch(0.9820 0.0044 236.8932)",
        secondary: "oklch(0.9451 0.0055 236.8931)",
        secondaryForeground: "oklch(0.1549 0.0147 236.9061)",
        muted: "oklch(0.9451 0.0055 236.8931)",
        mutedForeground: "oklch(0.5451 0.0082 236.8942)",
        accent: "oklch(0.9451 0.0055 236.8931)",
        accentForeground: "oklch(0.1549 0.0147 236.9061)",
        destructive: "oklch(0.5451 0.2067 27.3252)",
        destructiveForeground: "oklch(0.9820 0.0044 236.8932)",
        border: "oklch(0.8865 0.0066 236.8933)",
        input: "oklch(0.8865 0.0066 236.8933)",
        ring: "oklch(0.5451 0.1723 236.8936)",
        chart1: "oklch(0.5451 0.1723 236.8936)",
        chart2: "oklch(0.6435 0.1644 264.3764)",
        chart3: "oklch(0.4882 0.1612 199.0451)",
        chart4: "oklch(0.7451 0.1261 236.8936)",
        chart5: "oklch(0.5961 0.1491 217.5765)",
        sidebar: "oklch(0.9956 0.0021 236.8931)",
        sidebarForeground: "oklch(0.5451 0.0082 236.8942)",
        sidebarPrimary: "oklch(0.5451 0.1723 236.8936)",
        sidebarPrimaryForeground: "oklch(0.9820 0.0044 236.8932)",
        sidebarAccent: "oklch(0.9451 0.0055 236.8931)",
        sidebarAccentForeground: "oklch(0.1549 0.0147 236.9061)",
        sidebarBorder: "oklch(0.8865 0.0066 236.8933)",
        sidebarRing: "oklch(0.5451 0.1723 236.8936)"
    },
    dark: {
        background: "oklch(0.1300 0.0147 236.9061)",
        foreground: "oklch(0.9438 0.0034 236.8929)",
        card: "oklch(0.1549 0.0147 236.9061)",
        cardForeground: "oklch(0.9438 0.0034 236.8929)",
        popover: "oklch(0.1800 0.0123 236.8943)",
        popoverForeground: "oklch(0.9438 0.0034 236.8929)",
        primary: "oklch(0.6392 0.1567 236.8935)",
        primaryForeground: "oklch(0.1300 0.0147 236.9061)",
        secondary: "oklch(0.2059 0.0098 236.8953)",
        secondaryForeground: "oklch(0.9438 0.0034 236.8929)",
        muted: "oklch(0.2059 0.0098 236.8953)",
        mutedForeground: "oklch(0.6392 0.0073 236.8946)",
        accent: "oklch(0.2059 0.0098 236.8953)",
        accentForeground: "oklch(0.9438 0.0034 236.8929)",
        destructive: "oklch(0.6216 0.2127 27.9239)",
        destructiveForeground: "oklch(0.9438 0.0034 236.8929)",
        border: "oklch(0.2059 0.0098 236.8953)",
        input: "oklch(0.2059 0.0098 236.8953)",
        ring: "oklch(0.6392 0.1567 236.8935)",
        chart1: "oklch(0.6392 0.1567 236.8935)",
        chart2: "oklch(0.7373 0.1349 264.3764)",
        chart3: "oklch(0.5843 0.1427 199.0451)",
        chart4: "oklch(0.8039 0.0917 236.8936)",
        chart5: "oklch(0.6863 0.1229 217.5765)",
        sidebar: "oklch(0.1300 0.0147 236.9061)",
        sidebarForeground: "oklch(0.6392 0.0073 236.8946)",
        sidebarPrimary: "oklch(0.6392 0.1567 236.8935)",
        sidebarPrimaryForeground: "oklch(0.1300 0.0147 236.9061)",
        sidebarAccent: "oklch(0.2059 0.0098 236.8953)",
        sidebarAccentForeground: "oklch(0.9438 0.0034 236.8929)",
        sidebarBorder: "oklch(0.2059 0.0098 236.8953)",
        sidebarRing: "oklch(0.6392 0.1567 236.8935)"
    }
};

// Tema 2: Sunset (Laranja/Rosa)
export const sunsetTheme: Theme = {
    name: "Pôr do Sol",
    value: "sunset",
    icon: "🌅",
    description: "Tema quente com tons de laranja e rosa",
    light: {
        background: "oklch(0.9956 0.0104 25.0000)",
        foreground: "oklch(0.2549 0.0441 25.0000)",
        card: "oklch(0.9956 0.0104 25.0000)",
        cardForeground: "oklch(0.2549 0.0441 25.0000)",
        popover: "oklch(0.9956 0.0104 25.0000)",
        popoverForeground: "oklch(0.4510 0.0323 25.0000)",
        primary: "oklch(0.6863 0.1927 25.0000)",
        primaryForeground: "oklch(0.9820 0.0104 25.0000)",
        secondary: "oklch(0.9608 0.0208 25.0000)",
        secondaryForeground: "oklch(0.2549 0.0441 25.0000)",
        muted: "oklch(0.9608 0.0208 25.0000)",
        mutedForeground: "oklch(0.5490 0.0323 25.0000)",
        accent: "oklch(0.9608 0.0208 25.0000)",
        accentForeground: "oklch(0.2549 0.0441 25.0000)",
        destructive: "oklch(0.5765 0.2379 27.3252)",
        destructiveForeground: "oklch(0.9820 0.0104 25.0000)",
        border: "oklch(0.9020 0.0312 25.0000)",
        input: "oklch(0.9020 0.0312 25.0000)",
        ring: "oklch(0.6863 0.1927 25.0000)",
        chart1: "oklch(0.6863 0.1927 25.0000)",
        chart2: "oklch(0.7451 0.1789 350.0000)",
        chart3: "oklch(0.6078 0.1658 45.0000)",
        chart4: "oklch(0.8039 0.1261 10.0000)",
        chart5: "oklch(0.6471 0.1529 35.0000)",
        sidebar: "oklch(0.9956 0.0104 25.0000)",
        sidebarForeground: "oklch(0.5490 0.0323 25.0000)",
        sidebarPrimary: "oklch(0.6863 0.1927 25.0000)",
        sidebarPrimaryForeground: "oklch(0.9820 0.0104 25.0000)",
        sidebarAccent: "oklch(0.9608 0.0208 25.0000)",
        sidebarAccentForeground: "oklch(0.2549 0.0441 25.0000)",
        sidebarBorder: "oklch(0.9020 0.0312 25.0000)",
        sidebarRing: "oklch(0.6863 0.1927 25.0000)"
    },
    dark: {
        background: "oklch(0.1608 0.0294 25.0000)",
        foreground: "oklch(0.9412 0.0208 25.0000)",
        card: "oklch(0.2157 0.0441 25.0000)",
        cardForeground: "oklch(0.9412 0.0208 25.0000)",
        popover: "oklch(0.2706 0.0392 25.0000)",
        popoverForeground: "oklch(0.9412 0.0208 25.0000)",
        primary: "oklch(0.7647 0.1666 25.0000)",
        primaryForeground: "oklch(0.1608 0.0294 25.0000)",
        secondary: "oklch(0.3255 0.0343 25.0000)",
        secondaryForeground: "oklch(0.9412 0.0208 25.0000)",
        muted: "oklch(0.3255 0.0343 25.0000)",
        mutedForeground: "oklch(0.6471 0.0270 25.0000)",
        accent: "oklch(0.3255 0.0343 25.0000)",
        accentForeground: "oklch(0.9412 0.0208 25.0000)",
        destructive: "oklch(0.6549 0.2460 27.9239)",
        destructiveForeground: "oklch(0.9412 0.0208 25.0000)",
        border: "oklch(0.3255 0.0343 25.0000)",
        input: "oklch(0.3255 0.0343 25.0000)",
        ring: "oklch(0.7647 0.1666 25.0000)",
        chart1: "oklch(0.7647 0.1666 25.0000)",
        chart2: "oklch(0.8039 0.1464 350.0000)",
        chart3: "oklch(0.6863 0.1439 45.0000)",
        chart4: "oklch(0.8627 0.1034 10.0000)",
        chart5: "oklch(0.7255 0.1254 35.0000)",
        sidebar: "oklch(0.1608 0.0294 25.0000)",
        sidebarForeground: "oklch(0.6471 0.0270 25.0000)",
        sidebarPrimary: "oklch(0.7647 0.1666 25.0000)",
        sidebarPrimaryForeground: "oklch(0.1608 0.0294 25.0000)",
        sidebarAccent: "oklch(0.3255 0.0343 25.0000)",
        sidebarAccentForeground: "oklch(0.9412 0.0208 25.0000)",
        sidebarBorder: "oklch(0.3255 0.0343 25.0000)",
        sidebarRing: "oklch(0.7647 0.1666 25.0000)"
    }
};

// Tema Supabase
export const supabaseTheme: Theme = {
    name: "Supabase",
    value: "supabase",
    icon: "⚡",
    description: "Tema inspirado no Supabase com tons de verde",
    light: {
        background: "oklch(0.9911 0 0)",
        foreground: "oklch(0.2046 0 0)",
        card: "oklch(0.9911 0 0)",
        cardForeground: "oklch(0.2046 0 0)",
        popover: "oklch(0.9911 0 0)",
        popoverForeground: "oklch(0.4386 0 0)",
        primary: "oklch(0.8348 0.1302 160.9080)",
        primaryForeground: "oklch(0.2626 0.0147 166.4589)",
        secondary: "oklch(0.9940 0 0)",
        secondaryForeground: "oklch(0.2046 0 0)",
        muted: "oklch(0.9461 0 0)",
        mutedForeground: "oklch(0.2435 0 0)",
        accent: "oklch(0.9461 0 0)",
        accentForeground: "oklch(0.2435 0 0)",
        destructive: "oklch(0.5523 0.1927 32.7272)",
        destructiveForeground: "oklch(0.9934 0.0032 17.2118)",
        border: "oklch(0.9037 0 0)",
        input: "oklch(0.9731 0 0)",
        ring: "oklch(0.8348 0.1302 160.9080)",
        chart1: "oklch(0.8348 0.1302 160.9080)",
        chart2: "oklch(0.6231 0.1880 259.8145)",
        chart3: "oklch(0.6056 0.2189 292.7172)",
        chart4: "oklch(0.7686 0.1647 70.0804)",
        chart5: "oklch(0.6959 0.1491 162.4796)",
        sidebar: "oklch(0.9911 0 0)",
        sidebarForeground: "oklch(0.5452 0 0)",
        sidebarPrimary: "oklch(0.8348 0.1302 160.9080)",
        sidebarPrimaryForeground: "oklch(0.2626 0.0147 166.4589)",
        sidebarAccent: "oklch(0.9461 0 0)",
        sidebarAccentForeground: "oklch(0.2435 0 0)",
        sidebarBorder: "oklch(0.9037 0 0)",
        sidebarRing: "oklch(0.8348 0.1302 160.9080)"
    },
    dark: {
        background: "oklch(0.1822 0 0)",
        foreground: "oklch(0.9288 0.0126 255.5078)",
        card: "oklch(0.2046 0 0)",
        cardForeground: "oklch(0.9288 0.0126 255.5078)",
        popover: "oklch(0.2603 0 0)",
        popoverForeground: "oklch(0.7348 0 0)",
        primary: "oklch(0.4365 0.1044 156.7556)",
        primaryForeground: "oklch(0.9213 0.0135 167.1556)",
        secondary: "oklch(0.2603 0 0)",
        secondaryForeground: "oklch(0.9851 0 0)",
        muted: "oklch(0.2393 0 0)",
        mutedForeground: "oklch(0.7122 0 0)",
        accent: "oklch(0.3132 0 0)",
        accentForeground: "oklch(0.9851 0 0)",
        destructive: "oklch(0.3123 0.0852 29.7877)",
        destructiveForeground: "oklch(0.9368 0.0045 34.3092)",
        border: "oklch(0.2809 0 0)",
        input: "oklch(0.2603 0 0)",
        ring: "oklch(0.8003 0.1821 151.7110)",
        chart1: "oklch(0.8003 0.1821 151.7110)",
        chart2: "oklch(0.7137 0.1434 254.6240)",
        chart3: "oklch(0.7090 0.1592 293.5412)",
        chart4: "oklch(0.8369 0.1644 84.4286)",
        chart5: "oklch(0.7845 0.1325 181.9120)",
        sidebar: "oklch(0.1822 0 0)",
        sidebarForeground: "oklch(0.6301 0 0)",
        sidebarPrimary: "oklch(0.4365 0.1044 156.7556)",
        sidebarPrimaryForeground: "oklch(0.9213 0.0135 167.1556)",
        sidebarAccent: "oklch(0.3132 0 0)",
        sidebarAccentForeground: "oklch(0.9851 0 0)",
        sidebarBorder: "oklch(0.2809 0 0)",
        sidebarRing: "oklch(0.8003 0.1821 151.7110)"
    }
};

// Tema VioletBloom
export const violetBloomTheme: Theme = {
    name: "VioletBloom",
    value: "violetbloom",
    icon: "🌸",
    description: "Tema elegante com tons de violeta e roxo",
    light: {
        background: "oklch(0.9940 0 0)",
        foreground: "oklch(0 0 0)",
        card: "oklch(0.9940 0 0)",
        cardForeground: "oklch(0 0 0)",
        popover: "oklch(0.9911 0 0)",
        popoverForeground: "oklch(0 0 0)",
        primary: "oklch(0.5393 0.2713 286.7462)",
        primaryForeground: "oklch(1.0000 0 0)",
        secondary: "oklch(0.9540 0.0063 255.4755)",
        secondaryForeground: "oklch(0.1344 0 0)",
        muted: "oklch(0.9702 0 0)",
        mutedForeground: "oklch(0.4386 0 0)",
        accent: "oklch(0.9393 0.0288 266.3680)",
        accentForeground: "oklch(0.5445 0.1903 259.4848)",
        destructive: "oklch(0.6290 0.1902 23.0704)",
        destructiveForeground: "oklch(1.0000 0 0)",
        border: "oklch(0.9300 0.0094 286.2156)",
        input: "oklch(0.9401 0 0)",
        ring: "oklch(0 0 0)",
        chart1: "oklch(0.7459 0.1483 156.4499)",
        chart2: "oklch(0.5393 0.2713 286.7462)",
        chart3: "oklch(0.7336 0.1758 50.5517)",
        chart4: "oklch(0.5828 0.1809 259.7276)",
        chart5: "oklch(0.5590 0 0)",
        sidebar: "oklch(0.9777 0.0051 247.8763)",
        sidebarForeground: "oklch(0 0 0)",
        sidebarPrimary: "oklch(0 0 0)",
        sidebarPrimaryForeground: "oklch(1.0000 0 0)",
        sidebarAccent: "oklch(0.9401 0 0)",
        sidebarAccentForeground: "oklch(0 0 0)",
        sidebarBorder: "oklch(0.9401 0 0)",
        sidebarRing: "oklch(0 0 0)"
    },
    dark: {
        background: "oklch(0.2223 0.0060 271.1393)",
        foreground: "oklch(0.9551 0 0)",
        card: "oklch(0.2568 0.0076 274.6528)",
        cardForeground: "oklch(0.9551 0 0)",
        popover: "oklch(0.2568 0.0076 274.6528)",
        popoverForeground: "oklch(0.9551 0 0)",
        primary: "oklch(0.6132 0.2294 291.7437)",
        primaryForeground: "oklch(1.0000 0 0)",
        secondary: "oklch(0.2940 0.0130 272.9312)",
        secondaryForeground: "oklch(0.9551 0 0)",
        muted: "oklch(0.2940 0.0130 272.9312)",
        mutedForeground: "oklch(0.7058 0 0)",
        accent: "oklch(0.2795 0.0368 260.0310)",
        accentForeground: "oklch(0.7857 0.1153 246.6596)",
        destructive: "oklch(0.7106 0.1661 22.2162)",
        destructiveForeground: "oklch(1.0000 0 0)",
        border: "oklch(0.3289 0.0092 268.3843)",
        input: "oklch(0.3289 0.0092 268.3843)",
        ring: "oklch(0.6132 0.2294 291.7437)",
        chart1: "oklch(0.8003 0.1821 151.7110)",
        chart2: "oklch(0.6132 0.2294 291.7437)",
        chart3: "oklch(0.8077 0.1035 19.5706)",
        chart4: "oklch(0.6691 0.1569 260.1063)",
        chart5: "oklch(0.7058 0 0)",
        sidebar: "oklch(0.2011 0.0039 286.0396)",
        sidebarForeground: "oklch(0.9551 0 0)",
        sidebarPrimary: "oklch(0.6132 0.2294 291.7437)",
        sidebarPrimaryForeground: "oklch(1.0000 0 0)",
        sidebarAccent: "oklch(0.2940 0.0130 272.9312)",
        sidebarAccentForeground: "oklch(0.6132 0.2294 291.7437)",
        sidebarBorder: "oklch(0.3289 0.0092 268.3843)",
        sidebarRing: "oklch(0.6132 0.2294 291.7437)"
    }
};

export const themes = {
    ocean: oceanTheme,
    sunset: sunsetTheme,
    supabase: supabaseTheme,
    violetbloom: violetBloomTheme,
};

export type ThemeValue = keyof typeof themes;

export const sharedCSSVars = {
    '--font-sans': 'Outfit, sans-serif',
    '--font-serif': 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
    '--font-mono': 'monospace',
    '--radius': '0.5rem',
    '--shadow-2xs': '0px 1px 3px 0px hsl(0 0% 0% / 0.09)',
    '--shadow-xs': '0px 1px 3px 0px hsl(0 0% 0% / 0.09)',
    '--shadow-sm': '0px 1px 3px 0px hsl(0 0% 0% / 0.17), 0px 1px 2px -1px hsl(0 0% 0% / 0.17)',
    '--shadow': '0px 1px 3px 0px hsl(0 0% 0% / 0.17), 0px 1px 2px -1px hsl(0 0% 0% / 0.17)',
    '--shadow-md': '0px 1px 3px 0px hsl(0 0% 0% / 0.17), 0px 2px 4px -1px hsl(0 0% 0% / 0.17)',
    '--shadow-lg': '0px 1px 3px 0px hsl(0 0% 0% / 0.17), 0px 4px 6px -1px hsl(0 0% 0% / 0.17)',
    '--shadow-xl': '0px 1px 3px 0px hsl(0 0% 0% / 0.17), 0px 8px 10px -1px hsl(0 0% 0% / 0.17)',
    '--shadow-2xl': '0px 1px 3px 0px hsl(0 0% 0% / 0.43)',
    '--tracking-normal': '0.025em',
};

function camelToKebab(str: string): string {
    return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

export function generateThemeCSSVars(theme: Theme, isDark: boolean = false): Record<string, string> {
    const colors = isDark ? theme.dark : theme.light;
    const cssVars: Record<string, string> = {};

    Object.entries(colors).forEach(([key, value]) => {
        cssVars[`--${camelToKebab(key)}`] = value;
    });

    if (theme.config) {
        if (theme.config.fontSans) cssVars['--font-sans'] = theme.config.fontSans;
        if (theme.config.fontSerif) cssVars['--font-serif'] = theme.config.fontSerif;
        if (theme.config.fontMono) cssVars['--font-mono'] = theme.config.fontMono;
        if (theme.config.radius) cssVars['--radius'] = theme.config.radius;
        if (theme.config.letterSpacing) cssVars['--tracking-normal'] = theme.config.letterSpacing;
        if (theme.config.spacing) cssVars['--spacing'] = theme.config.spacing;

        if (theme.config.shadows) {
            Object.entries(theme.config.shadows).forEach(([shadowKey, shadowValue]) => {
                const varName = shadowKey === 'default' ? '--shadow' : `--shadow-${shadowKey}`;
                cssVars[varName] = shadowValue;
            });
        }

        Object.entries(sharedCSSVars).forEach(([key, value]) => {
            if (!cssVars[key]) {
                cssVars[key] = value;
            }
        });
    } else {
        Object.assign(cssVars, sharedCSSVars);
    }

    return cssVars;
}
