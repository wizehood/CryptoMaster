import OktaAuth from '@okta/okta-auth-js'

const org = 'https://dev-740276.oktapreview.com',
      clientId = '0oaf06guckCw8EvFF0h7',
      redirectUri = 'http://localhost:50237',
      authorizationServer = 'default'

const oktaAuthClient = new OktaAuth({
  url: org,
  issuer: authorizationServer,
  clientId,
  redirectUri
})

export default {
  client: oktaAuthClient
}