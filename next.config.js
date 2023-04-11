/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/a/**',
      },
      {
        protocol:'https',
        hostname:'m.media-amazon.com',
        port:'',
        pathname:'/images/**'
      }
    ],
  },
}

module.exports = nextConfig
