#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { Aspects } from "aws-cdk-lib";
import { WebStack } from "../lib/stacks/stack-web/stack-web";
import { SharedResourcesStack } from "../lib/stacks/stack-shared-resources/stack-shared-resources";

const app = new cdk.App();

const appEnv = {
  region: app.node.tryGetContext("awsRegion")
    ? app.node.tryGetContext("awsRegion")
    : process.env.CDK_DEFAULT_REGION,
  account: process.env.CDK_DEFAULT_ACCOUNT,
};

const adminEmail = app.node.tryGetContext("adminEmail");
const projectName = app.node.tryGetContext("projectName");

const sharedResources = new SharedResourcesStack(app, "SharedResourcesStack", {
  env: appEnv,
  adminEmail: adminEmail,
});

const cognito = sharedResources.cognito;

// EnergyKit Web Stack
const webOption = app.node.tryGetContext("deployWebStack");
console.log(`Web deployment option is set to: ${webOption}`);
if (webOption === true) {
  new WebStack(app, "WebStack", {
    env: appEnv,
    adminEmail: app.node.tryGetContext("adminEmail"),
    cognito: cognito,
  });
}

cdk.Tags.of(app).add("application", app.node.tryGetContext("projectName"));
