import axios from 'axios'
import oktaAuth from '../oktaAuth'

const CRYPTOCOMPARE_API_URI = "https://min-api.cryptocompare.com"
const COINMARKETCAP_API_URI = "https://api.coinmarketcap.com/v1/ticker/"

const sleep = ms => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

const addAuthHeader = () => {
  return {
    headers: {
      'Authorization': 'Bearer '
        + oktaAuth.client.tokenManager.get('access_token').accessToken
    }
  }
}

export const actions = {
  checkLoggedIn({ commit }) {
    if (oktaAuth.client.tokenManager.get('access_token')) {
      let idToken = oktaAuth.client.tokenManager.get('id_token')
      commit('loggedIn', idToken.claims)
    }
  },

  async login({ dispatch, commit }, data) {
    await commit('toggleProcessingMessage', true)

    let authResponse
    try {
      authResponse = await oktaAuth.client.signIn({
        username: data.email,
        password: data.password
      });
    }
    catch (err) {

      let message = 'Failed to login, check credentials and try again.' // || err.message
      await commit('toggleProcessingMessage', false)

      dispatch('loginFailed', message)

      console.log(err)
      return
    }

    let tokens
    try {
      tokens = await oktaAuth.client.token.getWithoutPrompt({
        responseType: ['id_token', 'token'],
        scopes: ['openid', 'email', 'profile'],
        sessionToken: authResponse.sessionToken,
      })
    }
    catch (err) {
      let message = 'An error occurred during authorization, try again.' // || err.message
      await commit('toggleProcessingMessage', false)
      
      dispatch('loginFailed', message)

      console.log(err)
      return
    }

    // Verify ID token validity
    try {
      await oktaAuth.client.token.verify(tokens[0])
    } catch (err) {
      await commit('toggleProcessingMessage', false)

      dispatch('loginFailed', 'An error occurred during authorization, try again.')

      console.error('id_token failed validation')
      return
    }

    oktaAuth.client.tokenManager.add('id_token', tokens[0]);
    oktaAuth.client.tokenManager.add('access_token', tokens[1]);

    await commit('toggleProcessingMessage', false)
    commit('loggedIn', tokens[0].claims)
  },

  async loginFailed({ commit }, message) {
    commit('loginError', message)
    await sleep(3000)
    commit('loginError', null)
  },

  async logout({ commit }) {
    oktaAuth.client.tokenManager.clear()
    await oktaAuth.client.signOut()
    commit('loggedOut')
  },

  async signup({ dispatch, commit }, data) {
    await commit('toggleProcessingMessage', true)

    try {
      await axios.post('/api/user/create', data)
    }
    catch (err) {
      await commit('toggleProcessingMessage', false)

      let message = "Failed to sign up, check data and try again." // || err.reasonPhrase
      dispatch('signupFailed', message)
      return
    }
    await commit('toggleProcessingMessage', false)
    
    await dispatch('signupSuccess')

    commit('signedUp')
  },

  async signupSuccess({ commit }) {
    commit('toggleRegisteredMessage', true)
    await sleep(2000)
    commit('toggleRegisteredMessage', false)
  },

  async signupFailed({ commit }, message) {
    commit('signupError', message)
    await sleep(3000)
    commit('signupError', null)
  },

  async counterChange({ commit }, count) {
    commit('counterChanged', count)
  },

  async getCoinMetaData({ dispatch, commit }, count = null) {
    let coinMetaData
    await axios.get(CRYPTOCOMPARE_API_URI + "/data/all/coinlist")
      .then(resp => {
        coinMetaData = resp.data.Data
      })
      .catch(err => {
        console.error(err)
      });

    await commit('loadCoinMetaData', coinMetaData)
    await dispatch('getCoinData', count)
  },

  async getCoinData({ commit }, count = null) {
    let coinData = {}
    let suffix = "";

    if (count) {
      suffix = "?limit=" + count;
    }

    await axios.get(COINMARKETCAP_API_URI + suffix)
      .then(resp => {
        coinData = resp.data
      })
      .catch(err => {
        console.error(err)
      });

    await commit('loadCoinData', coinData)
  },

  async getPurchaseCoins({ commit }) {
    let data = {}
    await axios.get(COINMARKETCAP_API_URI)
      .then(resp => {
        data = resp.data
      })
      .catch(err => {
        console.error(err)
      });

    await commit('loadPurchaseCoins', data)
  },

  async updatePrices({ commit, dispatch }, count) {
    await commit('toggleUpdateMessage', true)
    await dispatch('getCoinMetaData', count)
    await commit('toggleUpdateMessage', false)
  },

  async updatePurchaseCoins({ dispatch, commit }) {
    await commit('toggleUpdateMessage', true)
    await dispatch('getPurchaseCoins')
    await commit('mapCoins')
    await commit('toggleUpdateMessage', false)
  },

  async getCalculation({ commit }) {
    await commit('toggleUpdateMessage', true)
 
    let response = await axios.get('/api/calculation', addAuthHeader())

    if (response && response.data) {
      let calculation = response.data
      await commit('loadCalculation', calculation)
    }
    await commit('toggleUpdateMessage', false)
  },

  async saveCalculation({ commit, dispatch }, data) {
    await commit('toggleProcessingMessage', true)
    await commit('disablePurchases', data)

    await axios.post(
      '/api/calculation',
      data,
      addAuthHeader())

    await commit('toggleProcessingMessage', false)
    await dispatch('saveSuccess')
  },

  async saveSuccess({ commit }) {
    commit('toggleSavedMessage', true)
    await sleep(1000)
    commit('toggleSavedMessage', false)
  },

  async removePurchase({ commit }, data) {
    await commit('removePurchase', data)
  }
}