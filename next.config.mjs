import { fileURLToPath } from 'url';
import path from 'path';

// Get the directory name using ESM compatible approach
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Use serverExternalPackages to tell Next.js to treat these packages as external
  // This prevents the node: scheme errors by not bundling these packages
  serverExternalPackages: [
    'firebase-admin',
    'google-auth-library',
    'gcp-metadata',
    'google-logging-utils'
  ],
  experimental: {
    // Add any experimental features here if needed
  }
}

export default nextConfig