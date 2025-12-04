import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  redirects: async () => {
    return [
      {
        source: '/docs',
        destination: '/docs/fandomjs/installation',
        permanent: true,
      },
      {
        source: '/docs/fandomjs',
        destination: '/docs/fandomjs/installation',
        permanent: true,
      },
    ];
  }
};

export default withMDX(config);
