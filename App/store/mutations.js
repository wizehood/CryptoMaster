import router from '../router'

export const state = {
  coinCount: 10,
  userName: null,
  signupError: null,
  loginError: null,
  loggedIn: false,
  isProcessing: false,
  isUpdating: false,
  isRegistered: false,
  isSaved: false,
  coinData: [],
  coinMetaData: [],
  purchaseCoins: [],
  tempCoins: [],
  calculation: { purchases: [], adjustment: 0, },
}

export const mutations = {
  signedUp(state) {
    router.push('/login')
  },

  signupError(state, message) {
    state.signupError = message
  },

  loggedIn(state, data) {
    state.loggedIn = true
    state.userName = (data.name || '').split(' ')[0] || 'Hello'

    let redirectTo = state.route.query.redirect || '/'
    router.push(redirectTo)
  },

  loggedOut(state) {
    state.loggedIn = false
    state.calculation.purchases = [];
    state.calculation.adjustment = 0;
    router.push('/')
  },

  loginError(state, message) {
    state.loginError = message
  },

  counterChanged(state, count) {
    state.coinCount = count
  },

  loadCoinData(state, data) {
    state.coinData = data
  },

  loadCoinMetaData(state, data) {
    state.coinMetaData = data
  },

  loadPurchaseCoins(state, data) {
    state.purchaseCoins = data
  },

  mapCoins(state) {
    state.purchaseCoins.forEach(function (coin) {
      state.tempCoins[coin.id] = coin
    });
  },

  loadCalculation(state, data) {
    state.calculation = data
  },

  updateAdjustment(state, payload) {
    state.calculation.adjustment = payload
  },

  disablePurchases(state, data) {
    state.calculation.purchases.forEach(function (purchase) {
      purchase.enabled = false
    });
  },

  toggleProcessingMessage(state, flag) {
    state.isProcessing = flag
  },

  toggleRegisteredMessage(state, flag) {
    state.isRegistered = flag
  },

  toggleUpdateMessage(state, flag) {
    state.isUpdating = flag
  },

  toggleSavedMessage(state, flag) {
    state.isSaved = flag
  },

  coinChanged(state, payload) {
    state.calculation.purchases[payload.index].price = state.purchaseCoins[payload.selectedIndex].price_usd;
  },

  addPurchase(state) {
    state.calculation.purchases.push({
      name: "bitcoin",
      amount: 1,
      price: state.tempCoins["bitcoin"].price_usd,
      enabled: true
    });
  },

  removePurchase(state, payload) {
    if (state.calculation.purchases.length === 1) {
      state.calculation.adjustment = 0
    }
    state.calculation.purchases.splice(payload.index, 1);
  }
}