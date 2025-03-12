import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    basePath: process.env.NODE_ENV === 'production' ? '/openlayers-style-editor' : '',
    assetPrefix: process.env.NODE_ENV === 'production' ? '/openlayers-style-editor/' : '',
    output: 'export',
    images: {
        unoptimized: true,
    },
};

export default nextConfig;
