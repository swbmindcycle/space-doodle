/* eslint-disable no-undef */
// -- AWS AMPLIFY CONFIGURATION PARAMETERS --
// ------------------------------------------
// ## These configuration parameters are dynamically generated at build ##
// ## They are passed from environmental variables in the CDK Amplify App ##
// ## This configuration file is rebuilt using those env variables every time it's deployed ##
// ------------------------------------------
const AmplifyConfig = {
  // Existing Auth
  Auth: {
    // REQUIRED only for Federated Authentication - Amazon Cognito Identity Pool ID
    identityPoolId: process.env.REACT_APP_IDENTITY_POOL_ID,

    // REQUIRED - Amazon Cognito Region
    region: process.env.REACT_APP_REGION, // Replace with the region you deployed CDK with

    // OPTIONAL - Amazon Cognito Federated Identity Pool Region
    // Required only if it's different from Amazon Cognito Region
    identityPoolRegion: process.env.REACT_APP_REGION,

    // REQUIRED - Amazon Cognito User Pool ID
    userPoolId: process.env.REACT_APP_USER_POOL_ID, // Replace with your User Pool ID

    // REQUIRED - Amazon Cognito Web Client ID (26-char alphanumeric string)
    userPoolWebClientId: process.env.REACT_APP_USER_POOL_WEB_CLIENT_ID, // Replace with your User Pool Web Client ID

    // OPTIONAL - Enforce user authentication prior to accessing AWS resources or not
    mandatorySignIn: true,

    // Amplify Quicksight Integration
    quicksightAccountId: process.env.REACT_APP_QUICKSIGHT_ACCOUNT_ID,
    quicksightDashboards: process.env.REACT_APP_TEST_KITCHEN_DASHBOARD_ID,
  },
};

export { AmplifyConfig };
