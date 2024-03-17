/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: false,
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "cdn.shopify.com",
			},
			{
				protocol: "https",
				hostname: "cdn-amz.woka.io",
			},
			{
				protocol: "https",
				hostname: "img.tgdd.vn",
			},
			{
				protocol: "https",
				hostname: "res.cloudinary.com",
			},
		],
	},
}

module.exports = nextConfig
