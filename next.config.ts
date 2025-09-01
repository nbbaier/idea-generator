import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	distDir: "./dist",
	basePath: process.env.NEXT_PUBLIC_BASE_PATH,
	images: {
		unoptimized: true,
	},
	trailingSlash: true,
};

export default nextConfig;
