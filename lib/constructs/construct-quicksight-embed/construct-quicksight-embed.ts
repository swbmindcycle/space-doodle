import { Construct } from "constructs";
import { aws_iam as iam, CfnOutput, RemovalPolicy } from "aws-cdk-lib";
import { aws_codecommit as codecommit } from "aws-cdk-lib";
import * as Amplify from "@aws-cdk/aws-amplify-alpha";

interface QuicksightEmbedProps {
  quicksightAccountId: string;
  quicksightDashboardId: string;
}

export class QuicksightEmbed extends Construct {
  constructor(scope: Construct, id: string, props: QuicksightEmbedProps) {
    super(scope, id);

    // create quicksight IAM role

    // create quicksight embed access policy
    const quicksightEmbedPolicy = new iam.Policy(
      this,
      "QuicksightEmbedPolicy",
      {
        statements: [
          new iam.PolicyStatement({
            resources: [
              `arn:aws:quicksight:us-east-2:${props.quicksightAccountId}:dashboard/${props.quicksightDashboardId}`,
            ],
            actions: ["quicksight:GetDashboardEmbedUrl"],
            effect: iam.Effect.ALLOW,
          }),
        ],
      }
    );

    //
    const quicksightEmbedRole = new iam.Role(this, "QuicksightEmbedRole", {
      assumedBy: new iam.ServicePrincipal("quicksight.amazonaws.com"),
      description: "An example IAM role in AWS CDK",
    });

    quicksightEmbedRole.attachInlinePolicy(quicksightEmbedPolicy);
  }
}
