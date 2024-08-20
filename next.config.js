/** @type {import('next').NextConfig} */

const withPWA = require('next-pwa')({
  dest: 'public',
  register:true,
  disable: process.env.NODE_ENV === 'development'
});

const nextConfig = withPWA({
  reactStrictMode: true,
  images: {
    domains: ["cdn.ednaapp.net", "s3-alpha-sig.figma.com"],
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/account/login",
        permanent: false,
      },
    ];
  }
})

module.exports = nextConfig;