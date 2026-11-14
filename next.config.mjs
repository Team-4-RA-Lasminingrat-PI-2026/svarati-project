/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "vkayqcwkwyowoaylnjhj.supabase.co",
        pathname: "/storage/v1/object/public/articles/**",
      },
    ],
  },
};

export default nextConfig;
