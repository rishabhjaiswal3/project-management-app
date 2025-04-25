// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "project-management-app",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "aws",
    };
  },
  async run() {
    // Define a placeholder Supabase URL if needed
    const placeholderSupabaseUrl = "https://project-management-app.supabase.co";
    const placeholdNEXT_AUTH_URL = "https://dlyh0ye5scm9o.cloudfront.net/";
    // Create the Next.js app with environment variables matching your auth setup
    const site = new sst.aws.Nextjs("MyWeb", {
      next: {
        typescript: true,
      },
      environment: {
        // Database connection for Prisma
        DATABASE_URL: process.env.DATABASE_URL || "",
        
        // NextAuth configuration
        AUTH_SECRET: process.env.AUTH_SECRET || "",
        NEXTAUTH_SECRET: process.env.AUTH_SECRET || "", // Ensure both variants are available
        NEXTAUTH_URL: "${site.url}" || placeholdNEXT_AUTH_URL,
        
        // Optional Supabase connection
        SUPABASE_URL: process.env.SUPABASE_URL || placeholderSupabaseUrl,
        
        // tRPC configuration
        TRPC_PUBLIC_URL: "${site.url}/api/trpc",
      },
    });
    
    return {
      siteUrl: site.url,
    };
  },
});