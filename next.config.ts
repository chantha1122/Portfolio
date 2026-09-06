import type { NextConfig } from "next";

import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const securityHeaders = [
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },

  {
    key: "X-Frame-Options",
    value: "DENY",
  },

  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },

  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  },

  {
    key: "Cross-Origin-Opener-Policy",
    value: "same-origin",
  },

  {
    key: "X-DNS-Prefetch-Control",
    value: "off",
  },
];

const nextConfig: NextConfig = {
  reactCompiler: true,

  experimental: {
    globalNotFound: true,

    serverActions: {
      bodySizeLimit: "25mb",
    },

    proxyClientMaxBodySize: "25mb",
  },

  async headers() {
    return [
      {
        source: "/:path*",

        headers: [
          ...securityHeaders,

          ...(process.env.NODE_ENV === "production"
            ? [
                {
                  key: "Strict-Transport-Security",
                  value: "max-age=31536000; includeSubDomains",
                },
              ]
            : []),
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
