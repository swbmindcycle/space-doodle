import { Construct } from "constructs";
import { aws_iam as iam, CfnOutput, RemovalPolicy } from "aws-cdk-lib";
import { CognitoAuth } from "../construct-cognito-auth/construct-cognito-auth";
import { aws_lambda as lambda } from "aws-cdk-lib";
import { PythonFunction } from "@aws-cdk/aws-lambda-python-alpha";
import { aws_apigateway as apigateway } from "aws-cdk-lib";
import * as cdk from "aws-cdk-lib";
import * as path from "path";

interface QuicksightEmbedProps {
  quicksightAccountId: string;
  quicksightDashboardId: string;
  cognitoAuth: CognitoAuth;
}

export class QuicksightEmbed extends Construct {
  public readonly quicksightEmbedApi: apigateway.RestApi;
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
    // const quicksightEmbedRole = new iam.Role(this, "QuicksightEmbedRole", {
    //   assumedBy: new iam.ServicePrincipal("amplify.amazonaws.com"),
    //   description: "This role grants Quicksight embed to the Amplify service",
    // });

    // quicksightEmbedRole.attachInlinePolicy(quicksightEmbedPolicy);

    // const amplifyWebIdentityRole = new iam.Role(
    //   this,
    //   "AmplifyWebIdentityRole",
    //   {
    //     assumedBy: new iam.WebIdentityPrincipal(
    //       "cognito-identity.amazonaws.com",
    //       {
    //         identityProviderUrl: `https://cognito-idp.${
    //           cdk.Stack.of(this).region
    //         }.amazonaws.com/${props.cognitoAuth.userPool.userPoolId}`,
    //       }
    //     ),
    //   }
    // );

    const quicksightAmplifyLambdaExecutionPolicy = new iam.PolicyDocument({
      statements: [
        new iam.PolicyStatement({
          resources: ["*"],
          actions: [
            "quicksight:GenerateEmbedUrlForRegisteredUser",
            "quicksight:SearchDashboards",
            "quicksight:DescribeUser",
            "quicksight:RegisterUser",
            "quicksight:CreateGroup",
            "quicksight:CreateGroupMembership",
            "logs:CreateLogGroup",
            "logs:CreateLogStream",
            "logs:PutLogEvents",
          ],
          effect: iam.Effect.ALLOW,
        }),
      ],
    });

    const lambdaExecutionRole = new iam.Role(this, "LambdaQESExecutionRole", {
      assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
      inlinePolicies: {
        QsLambdaExecutionPolicy: quicksightAmplifyLambdaExecutionPolicy,
      },
    });

    const quicksightEmbedLambda = new PythonFunction(this, "lambda-function", {
      runtime: lambda.Runtime.PYTHON_3_8,
      memorySize: 1024,
      timeout: cdk.Duration.seconds(30),
      index: "main.py",
      handler: "lambda_handler",
      entry: path.join(__dirname, "./lambda"),
      environment: {
        REGION: cdk.Stack.of(this).region,
        AVAILABILITY_ZONES: JSON.stringify(
          cdk.Stack.of(this).availabilityZones
        ),
        CognitoClientId: props.cognitoAuth.userPoolClient.userPoolClientId,
        CognitoDomainUrl: `https://cognito-idp.${
          cdk.Stack.of(this).region
        }.amazonaws.com/${props.cognitoAuth.userPool.userPoolId}`,
        RoleArn: lambdaExecutionRole.roleArn,
        DashboardRegion: cdk.Stack.of(this).region,
        AWS_DATA_PATH: ".",
      },
    });

    this.quicksightEmbedApi = new apigateway.RestApi(this, "api", {
      description: "API for Quicksight embed auth",
      deployOptions: {
        stageName: "dev",
      },
      // 👇 enable CORS
      defaultCorsPreflightOptions: {
        allowHeaders: [
          "Content-Type",
          "X-Amz-Date",
          "Authorization",
          "X-Api-Key",
        ],
        allowMethods: ["OPTIONS", "GET", "POST", "PUT", "PATCH", "DELETE"],
        allowCredentials: true,
        allowOrigins: ["http://localhost:3000"],
      },
    });

    const qsEmbed = this.quicksightEmbedApi.root.addResource("qs-embed");

    // 👇 integrate GET /todos with getTodosLambda
    qsEmbed.addMethod(
      "GET",
      new apigateway.LambdaIntegration(quicksightEmbedLambda, { proxy: true })
    );
  }
}
