# Welcome to Corkally Web CDK App

This is a PoC Web Application for Corkally. It contains:

- Cognito User Auth Pool
- Amplify Web Stack

## 🚀 How to deploy

### Set cdk context parameters

Visit [`cdk.context.json`](cdk.context.json) and update the following values:

```jsonc
{
  "adminEmail": "enter the admin email address here",
  "projectName": "corkallyWeb -- you can update or change this project name",
  "deployWebStack": true,
  "deployQuicksightStack": true,
  "quicksightAccountId": "enter quicksight account id here",
  "quicksightDashboard": "enter quicksight dashboard id here"
}
```

### Check prerequisites

For a full summary or prerequisites visit [AWS CDK Prerequisites](https://docs.aws.amazon.com/cdk/v2/guide/work-with.html#work-with-prerequisites). Please note that to use Quicksight Dashboard integration with this architecture you will need to manually create a Quicksight account and set up Quicksight dashboards using the Quicksight console.

Running this application requires `node`, `aws-cli`, and `aws cdk`

#### To set up `node`:

Visit [nodejs](https://nodejs.org/en/) for directions on installing node for your operating system

#### To set up `aws-cli`:

Visit [AWS CLI](https://aws.amazon.com/cli/) to set up the AWS CLI for your environment

#### To set up `aws cdk`:

```sh
npm install -g aws-cdk
# if the above command gives you a permissions error
sudo npm install -g aws-cdk
```

#### To configure the AWS CLI and assume a role or credentials

```sh
aws configure
```

### Deploy

```sh
cdk deploy --all
```

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## What you will build

This application builds the following AWS CDK stacks:

- WebStack
- SharedResourcesStack

### WebStack

This stack deploys an AWS Amplify application, with a CodeCommit repository that triggers an automatic build and CodePipeline. The Amplify App will be hosted at a dev subdomain. Please note that this domain is ephemeral, so if you destroy the application and rebuild the url will change.

This Stack utilizes the [`AmplifyDeploy` CDK construct](lib/constructs/construct-amplify-deploy/construct-amplify-deploy.ts) and integrates an AWS Cognito User Pool for authorization within the web application. Please note that to add new users you will need to retrieve the [AWS Amplify Domain and URL](https://us-east-2.console.aws.amazon.com/amplify/home?region=us-east-2#/) from the AWS Amplify section of the AWS Console. To add new users please follow the instructions for [creating Cognito user accounts as an administrator](https://docs.aws.amazon.com/cognito/latest/developerguide/how-to-create-user-accounts.html).

### SharedResourcesStack

This stack deploys shared resources that are utilized across all stacks. This will currently include an AWS Cognito User Pool built from the [`CognitoAuth` CDK construct](lib/constructs/construct-cognito-auth/construct-cognito-auth.ts)

## Useful commands

- `npm run build` compile typescript to js
- `npm run watch` watch for changes and compile
- `npm run test` perform the jest unit tests
- `cdk deploy` deploy this stack to your default AWS account/region
- `cdk diff` compare deployed stack with current state
- `cdk synth` emits the synthesized CloudFormation template
