import { Construct } from 'constructs';
import { aws_iam as iam, CfnOutput, RemovalPolicy } from 'aws-cdk-lib';
import { aws_codecommit as codecommit } from 'aws-cdk-lib';
import * as Amplify from "@aws-cdk/aws-amplify-alpha"

interface AmplifyDeployProps {
  appPath: string;
  repoName: string;
  region: string;
  envVariables: any;

}

export class AmplifyDeploy extends Construct {
  public repository: codecommit.Repository;
  public amplifyApp: Amplify.App;
  public repositoryNameString: string;
  public branchOutput: any;

  constructor(scope: Construct, id: string, props: AmplifyDeployProps) {
    super(scope, id)
        
        // create a codecommit repository and 
        this.repository = new codecommit.Repository(this, 'AmplifyCodeCommitRepository', {
            repositoryName: props.repoName,
            description: "Amplify Web Application Deployment Repository",
            code: codecommit.Code.fromDirectory(props.appPath, 'dev')
        });

        // define an amplify app
        this.amplifyApp = new Amplify.App(this, props.repoName, {
          description: "Sample AWS Amplify Application deployed with CDK",
          sourceCodeProvider: new Amplify.CodeCommitSourceCodeProvider({
            repository: this.repository,
          },
          ),
          environmentVariables: props.envVariables,
          customRules: []

        })

        this.amplifyApp.addCustomRule(Amplify.CustomRule.SINGLE_PAGE_APPLICATION_REDIRECT) // adds support for amplify single page react application delivery


        const devBranch = this.amplifyApp.addBranch('dev');

        this.amplifyApp.applyRemovalPolicy(RemovalPolicy.DESTROY);
    }
}
