import * as sst from "sst";

export default {
  config(_input) {
    return {
      name: "project-management-app",
      region: "us-east-1",
    };
  },
  stacks(app) {
    app.stack(async function Site({ stack }) {
      // Create a VPC
      const vpc = new sst.aws.Vpc(stack, "MyVpc");

      // Create an ECS Cluster
      const cluster = new sst.aws.Cluster(stack, "MyCluster", { vpc });

      // Create an S3 Bucket for file uploads
      const bucket = new sst.aws.Bucket(stack, "MyBucket", {
        access: "public",
      });

      // Create a Fargate Service for the T3 Stack app
      new sst.aws.Service(stack, "MyService", {
        cluster,
        loadBalancer: {
          ports: [{ listen: "80/http", forward: "3000/http" }],
        },
        dev: {
          command: "npm run dev",
        },
        link: [bucket], // Link the S3 bucket to the service
      });

      stack.addOutputs({
        BucketName: bucket.bucketName,
      });
    });
  },
} satisfies sst.SSTConfig;