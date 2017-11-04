const simpleOauthModule = require('simple-oauth2');
const randomstring = require('randomstring');

const oauth2 = simpleOauthModule.create({
  client: {
    id: process.env.OAUTH_CLIENT_ID,
    secret: process.env.OAUTH_CLIENT_SECRET
  },
  auth: {
    tokenHost: 'https://github.com',
    tokenPath: '/login/oauth/access_token',
    authorizePath: '/login/oauth/authorize'
  }
});

// Authorization uri definition
const authorizationUri = oauth2.authorizationCode.authorizeURL({
  scope: 'repo,user',
  state: randomstring.generate(32)
});

module.exports = {
  login: (event, context, cb) => {
    cb(null, {
      statusCode: 200,
      headers: { 'Content-Type': 'text/html' },
      body: '<a href="/auth">Login with GitHub</a>'
    });
  },
  auth: (event, context, cb) => {
    Promise.resolve(event)
      .then(() => cb(null, {
        statusCode: 302,
        headers: { Location: authorizationUri }
      }))
      .catch(cb);
  },
  callback: (event, context, cb) => {
    const options = { code: event.queryStringParameters.code };

    oauth2.authorizationCode.getToken(options, (error, result) => {
      let mess, content;

      if (error) {
        console.error('Access Token Error', error.message);
        mess = 'error';
        content = JSON.stringify(error);
      } else {
        const token = oauth2.accessToken.create(result);
        mess = 'success';
        content = {
          token: token.token.access_token,
          provider: 'github'
        };
      };

      const script = `
      <script>
      (function() {
        function receiveMessage(e) {
          console.log("receiveMessage %o", e);
          // send message to main window with da app
          window.opener.postMessage(
            'authorization:github:${mess}:${JSON.stringify(content)}',
            e.origin
          );
        }
        window.addEventListener("message", receiveMessage, false);
        // Start handshare with parent
        console.log("Sending message: %o", "github");
        window.opener.postMessage("authorizing:github", "*");
        })()
      </script>`;

      cb(null, {
        statusCode: 200,
        headers: { 'Content-Type': 'text/html' },
        body: script
      });
    });
  },
  success: (event, context, cb) => {
    cb(null, {
      statusCode: 200,
      headers: { 'Content-Type': 'text/html' },
      body: ''
    });
  }
};
