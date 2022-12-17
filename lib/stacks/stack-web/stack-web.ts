import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { aws_iam as iam, CfnOutput, Stack } from "aws-cdk-lib";
import { aws_s3 as s3 } from "aws-cdk-lib";
import { aws_codecommit as codecommit } from "aws-cdk-lib";
import * as path from "path";
import { AmplifyDeploy } from "../../constructs/construct-amplify-deploy/construct-amplify-deploy";
import { CognitoAuth } from "../../constructs/construct-cognito-auth/construct-cognito-auth";
import { QuicksightEmbed } from "../../constructs/construct-quicksight-embed/construct-quicksight-embed";
import { custom_resources as cr } from "aws-cdk-lib";

interface WebStackProps extends cdk.StackProps {
  adminEmail: string;
  cognito: CognitoAuth;
  quicksightDashboard: string;
}

export class WebStack extends cdk.Stack {
  public amplifyDeployment: AmplifyDeploy;
  public cognito: CognitoAuth;

  constructor(scope: Construct, id: string, props: WebStackProps) {
    super(scope, id, props);

    const cognito = props.cognito;

    this.amplifyDeployment = new AmplifyDeploy(this, "AmplifyDeployment", {
      appPath: path.join(__dirname, "../../../resources/web-app/appa-web"),
      repoName: this.node.tryGetContext("projectName"),
      region: this.region,
      envVariables: {
        REGION: this.region,
        IDENTITY_POOL_ID: cognito.identityPoolIdOutputIdTransfer,
        USER_POOL_ID: cognito.userPoolIdOutputTransfer,
        USER_POOL_WEB_CLIENT_ID: cognito.userPoolClientIdOutputTransfer,
        QUICKSIGHT_ACCOUNT_ID: Stack.of(this).account,
        QUICKSIGHT_DASHBOARD_ID: props.quicksightDashboard,
      },
    });

    const codeArtifactPolicy = new iam.PolicyDocument({
      statements: [
        new iam.PolicyStatement({
          actions: [
            "codeartifact:List*",
            "codeartifact:Describe*",
            "codeartifact:Get*",
            "codeartifact:Read*",
          ],
          resources: ["*"],
        }),
      ],
    });

    const amplifyRole = new iam.Role(this, "AmplifyArtifactRole", {
      assumedBy: new iam.ServicePrincipal("amplify.amazonaws.com"),
      description: "Role for amplify to access codeartifact",
      inlinePolicies: {
        // 👇 attach the Policy Document as inline policies
        CodeArtifactAccess: codeArtifactPolicy,
      },
    });

    const codebuildRole = new iam.Role(this, "CodebuildArtifactRole", {
      assumedBy: new iam.ServicePrincipal("codebuild.amazonaws.com"),
      description: "Role for amplify to access codeartifact",
      inlinePolicies: {
        // 👇 attach the Policy Document as inline policies
        CodeArtifactAccess: codeArtifactPolicy,
      },
    });

    const quicksightEmbed = new QuicksightEmbed(this, "QuicksightEmbed", {
      quicksightAccountId: Stack.of(this).account,
      quicksightDashboardId: props.quicksightDashboard,
      cognitoAuth: props.cognito,
    });

    const pushAmplify = new cr.AwsCustomResource(this, "StartJob", {
      onUpdate: {
        // will also be called for a CREATE event
        service: "Amplify",
        action: "startJob",
        parameters: {
          appId: this.amplifyDeployment.amplifyApp.appId /* required */,
          branchName: "dev" /* required */,
          jobType: "RELEASE",
        },
        physicalResourceId: cr.PhysicalResourceId.of(Date.now().toString()), // Update physical id to always fetch the latest version
      },
      policy: cr.AwsCustomResourcePolicy.fromSdkCalls({
        resources: cr.AwsCustomResourcePolicy.ANY_RESOURCE,
      }),
    });

    new CfnOutput(this, "WebAppRepositoryCloneUrl", {
      value: this.amplifyDeployment.repository.repositoryCloneUrlHttp,
      description: "WebAppRepositoryLink",
      exportName: "WebAppRepositoryLink",
    });

    new CfnOutput(this, "WebAppId", {
      value: this.amplifyDeployment.amplifyApp.appId,
      description: "WebAppRepository",
      exportName: "WebAppRepository",
    });

    new CfnOutput(this, "AmplifyLink", {
      value: `https://${this.amplifyDeployment.amplifyApp.env.region}.console.aws.amazon.com/amplify/home?region=${this.amplifyDeployment.amplifyApp.env.region}#/${this.amplifyDeployment.amplifyApp.appId}`,
      description: "AmplifyLink",
      exportName: "AmplifyLink",
    });

    new CfnOutput(this, "WebAppDomain", {
      value: `https://dev.${this.amplifyDeployment.amplifyApp.defaultDomain}`,
      description: "WebAppDomain",
      exportName: "WebAppDomain",
    });

    cdk.Tags.of(this).add("component", "amplifyDeployment");
  }
}
