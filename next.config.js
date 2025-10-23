/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  experimental: {
    serverComponentsExternalPackages: [],
  },
  generateBuildId: async () => {
    return 'build-' + Date.now()
  },
  staticPageGenerationTimeout: 300,
}

module.exports = nextConfig
