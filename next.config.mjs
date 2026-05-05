/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true
  },
  turbopack: {
    root: process.cwd()
  },
  experimental: {
    workerThreads: true,
    webpackBuildWorker: false,
    parallelServerBuildTraces: false
  }
};

export default nextConfig;
