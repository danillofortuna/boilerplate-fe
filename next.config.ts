import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimize barrel imports for better bundle size (Rule 2.1)
  // This automatically transforms barrel imports to direct imports at build time
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      '@radix-ui/react-avatar',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-label',
      '@radix-ui/react-separator',
      '@radix-ui/react-tooltip',
    ],
  },
};

import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
