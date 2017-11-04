# Serverless Netlify OAuth Provider

Based on [`vencax/netlify-cms-github-oauth-provider`](https://github.com/vencax/netlify-cms-github-oauth-provider), sets up a GitHub OAuth provider for Netlify CMS authentication.

## Setup

Set up `serverless` according to [their documentation](https://github.com/serverless/serverless#quick-start). Then install dependencies with `npm install`, and deploy the initial application with `sls deploy`. In the command line output you'll see the URL of your endpoint (something like https://{API_ID}.execute-api.us-east-1.amazonaws.com/dev/). Copy the `.env.yml.sample` to `.env.yml`, and change `CALLBACK_BASE` to that URL without the trailing slash.

Then, create a GitHub OAuth app according to the [GitHub developer documentation](https://developer.github.com/apps/building-integrations/setting-up-and-registering-oauth-apps/registering-oauth-apps/). The callback URL should be the API Gateway endpoint followed by `/callback`. Add the client ID and secret to `.env.yml`.

You'll need to add `base_url` to your CMS config file, which will be the same as the `CALLBACK_BASE` (still not including a trailing slash).