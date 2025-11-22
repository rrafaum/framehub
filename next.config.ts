import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.tmdb.org', // Essencial para os cartazes dos filmes (TMDB)
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com', // Para fotos de perfil do GitHub
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // Caso use fotos do Google no futuro
      },
    ],
  },
};

export default nextConfig;