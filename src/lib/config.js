const config = {
  env: {
    apiEndpoint: process.env.NEXT_PUBLIC_API_ENDPOINT,
    prodApiEndpoint: process.env.NEXT_PUBLIC_PROD_API_ENDPOINT,
    databaseUrl: process.env.DATABASE_URL,
    resendToken: process.env.RESEND_TOKEN,
    imagekit: {
      publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
      urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT,
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    },
    upstash: {
      redisUrl: process.env.UPSTASH_REDIS_REST_URL,
      redisToken: process.env.UPSTASH_REDIS_REST_TOKEN,
      qstashUrl: process.env.QSTASH_URL,
      qstashToken: process.env.QSTASH_TOKEN,
    },
    stripe: {
      publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
      secretKey: process.env.STRIPE_SECRET,
      webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
    },
  },
};

export default config;
