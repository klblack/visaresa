/** @type {import('next').NextConfig} */
const nextConfig = {
  // 本番環境での詳細エラーを抑制
  reactStrictMode: true,
  images: {
    // 国旗画像用の外部ドメインを許可
    remotePatterns: [
      {
        protocol: "https",
        hostname: "flagcdn.com",
      },
    ],
  },
};

module.exports = nextConfig;
