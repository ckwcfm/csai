/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    serverComponentsExternalPackages: ['@smithy', 'util-stream'],
  },
}

export default nextConfig

// export default nextConfig
// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   output: 'standalone',
//   webpack: (config) => {
//     config.resolve = {
//       ...config.resolve,
//       fallback: {
//         ...config.resolve.fallback,
//         '@smithy/util-utf8': false,
//         '@smithy/util-base64': false,
//         '@smithy/util-stream': false,
//         '@smithy/util-buffer-from': false,
//         crypto: false,
//         stream: false,
//       },
//     }
//     return config
//   },
//   transpilePackages: ['@aws-sdk', '@smithy'],
// }

// export default nextConfig

// export default nextConfig
// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   output: 'standalone',
//   serverComponentsExternalPackages: [
//     '@aws-sdk/client-s3',
//     '@smithy/util-base64',
//     '@smithy/util-utf8',
//   ],
//   webpack: (config, { isServer }) => {
//     if (!isServer) {
//       // Client-side specific config
//       config.resolve = {
//         ...config.resolve,
//         '@smithy/util-utf8': false,
//         '@smithy/util-base64': false,
//         '@smithy/util-stream': false,
//         '@smithy/util-buffer-from': false,
//         punycode: false,
//         crypto: false,
//         stream: false,
//         buffer: false,
//         util: false,
//         path: false,
//         process: false,
//       }
//     }
//     return config
//   },
//   transpilePackages: ['@aws-sdk', '@smithy'],
// }

// export default nextConfig
