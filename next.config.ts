import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  // Descomentar y ajustar la siguiente línea si la URL será github.io/Chiks-web
  // basePath: "/Chiks-web",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
