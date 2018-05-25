<template>
  <div>
    <h2>Crypto Master</h2>

    <div class="row">
      <div v-if="loggedIn" class="col">
        <router-link to="/logout">Logout</router-link> 
        <router-link to="/purchases">Purchases</router-link> 
      </div>
      <div v-else class="col">
        <router-link to="/signup">Signup</router-link> 
        <router-link to="/login">Login</router-link> 
      </div>
    </div>
    
    <div class="jumbotron col-md-6 offset-md-3">
      <p>
        This website indexes cryptocurrencies by market cap and gives an easy way to compare cryptocurrency performance
        and rank over the last week. You can also log in using your credentials and check the status of your cryptoinvestments.
      </p>
      <p>
        Coindata taken from coinmarketcap.com
      </p>        
    </div>

    <div class="countSelector">
      <span>Show top</span>
      <select :value="coinCount" @change="counterChanged($event.target.value)">
        <option :key="value" :value="value" v-for="value in counter">{{value}}</option>
      </select>
      <button @click="updatePrices">Update prices</button>
      <span v-if="isUpdating">Updating...</span>
    </div>

    <table class="table table-hover">
      <thead>
        <tr>
          <td>Rank</td>
          <td>Name</td>
          <td>Symbol</td>
          <td>Price (USD)</td>
          <td>1H</td>
          <td>1D</td>
          <td>1W</td>
          <td>Market Cap (USD)</td>
        </tr>
      </thead>
      <tbody>
        <tr :key="coin.id" v-for="coin in coinData">
          <td>{{ coin.rank }}</td>
          <td>
            <img :src="getCoinImage(coin.symbol)"> {{ coin.name }}</td>
          <td>{{ coin.symbol }}</td>
          <td>{{ coin.price_usd | currency }}</td>
          <td :style="getColor(coin.percent_change_1h)">
            <span v-if="coin.percent_change_1h > 0">+</span>{{ coin.percent_change_1h }}%
          </td>
          <td :style="getColor(coin.percent_change_24h)">
            <span v-if="coin.percent_change_24h > 0">+</span>{{ coin.percent_change_24h }}%
          </td>
          <td :style="getColor(coin.percent_change_7d)">
            <span v-if="coin.percent_change_7d > 0">+</span>{{ coin.percent_change_7d }}%
          </td>
          <td>{{ coin.market_cap_usd | currency }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
const CRYPTOCOMPARE_URI = "https://www.cryptocompare.com";

export default {
  data() {
    return {
      counter: [10, 20, 50, 100],
    };
  },
  created() {
    this.$store.dispatch("getCoinMetaData", this.coinCount);
    // setInterval(
    //   () => this.$store.dispatch("getCoinMetaData", this.count),
    //   5000
    // );
  },
  computed: {
    coinData() {
      return this.$store.state.coinData;
    },
    coinMetaData() {
      return this.$store.state.coinMetaData;
    },
    loggedIn() {
      return this.$store.state.loggedIn;
    },
    isUpdating() {
      return this.$store.state.isUpdating;
    },
    coinCount(){      
      return this.$store.state.coinCount;
    }
  },
  methods: {
    getCoinImage: function(symbol) {
      //Symbol hack
      symbol = symbol === "MIOTA" ? "IOT" : symbol;
      symbol = symbol === "VERI" ? "VRM" : symbol;
      symbol = symbol === "ETHOS" ? "BQX" : symbol;

      let imagePath = "";
      if (this.coinMetaData[symbol]) {
        imagePath = this.coinMetaData[symbol].ImageUrl;
      }

      return CRYPTOCOMPARE_URI + imagePath;
    },
    getColor: num => {
      return num > 0 ? "color:green" : "color:red";
    },
    counterChanged(count) {
      this.$store.dispatch("counterChange", count);
      this.$store.dispatch("getCoinMetaData", this.coinCount);
    },
    updatePrices() {
      this.$store.dispatch("updatePrices", this.coinCount);
    }
  }
};
</script>

<style scoped>
body {
  font-size: 1.8em;
}

h2 {
  text-align: center;
}

a {
  float: right;
  margin-right: 1em;
}

select,
button {
  height: 24px;
}

.countSelector {
  margin: 0 0 1.5em 0.8em;
}

.indented-text {
  padding-left: 2em;
}

td img {
  width: 25px;
}
</style>