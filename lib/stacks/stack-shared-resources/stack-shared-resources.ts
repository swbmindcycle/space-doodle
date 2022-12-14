import { Stack, StackProps } from "aws-cdk-lib";
import { SigningProfile } from "aws-cdk-lib/aws-signer";
import { Construct } from "constructs";
import { CognitoAuth } from "../../constructs/construct-cognito-auth/construct-cognito-auth";

export interface SharedResourcesStackProps extends StackProps {
  adminEmail: string;
}

export class SharedResourcesStack extends Stack {
  public readonly cognito: CognitoAuth;

  constructor(scope: Construct, id: string, props: SharedResourcesStackProps) {
    super(scope, id, props);

    this.cognito = new CognitoAuth(this, "CognitoAuth", {
      adminEmail: props.adminEmail,
    });
  }
}
