/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      // Decap CMS is a static file at public/admin/index.html. Next serves
      // public files by exact path, so /admin on its own would 404 -- and
      // /admin is what the footer links to. This maps it onto the file.
      { source: "/admin", destination: "/admin/index.html" },
    ];
  },
};

export default nextConfig;
