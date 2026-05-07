import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/api/assessments": [
      "./node_modules/@sparticuz/chromium/**/*",
    ],
  },
};

export default nextConfig;
