import { Construct } from "constructs";
import { aws_iam as iam, CfnOutput, RemovalPolicy } from "aws-cdk-lib";
import { aws_codecommit as codecommit } from "aws-cdk-lib";
import * as Amplify from "@aws-cdk/aws-amplify-alpha";

interface QuicksightEmbedProps {
  appPath: string;
  repoName: string;
  region: string;
  envVariables: any;
}

export class QuicksightEmbed extends Construct {
  public repository: codecommit.Repository;
  public amplifyApp: Amplify.App;
  public repositoryNameString: string;
  public branchOutput: any;

  constructor(scope: Construct, id: string, props: QuicksightEmbedProps) {
    super(scope, id);

    // create quicksight basic deployment

    // create
  }
}
