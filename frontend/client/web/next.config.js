/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  reactStrictMode: true,
  turbopack: {},
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@royalprime/client': path.resolve(__dirname, '../shared-core'),
      '@shared-core': path.resolve(__dirname, '../../shared-core'),
      '@foundation': path.resolve(__dirname, '../../foundation')
    };
    return config;
  }
};

module.exports = nextConfig;
