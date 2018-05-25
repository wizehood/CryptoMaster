<template>
    <div class="purchase-form">
      
      <h4>
        <router-link to="/">Home</router-link> > Purchases
      </h4>

      <div class="navigation">
        <router-link to="/logout">Logout</router-link> 
      </div>

      <div v-if="purchases !== null">
        <p>{{name}}, what did you purchase?</p>
        <div class="purchase-list">
          <ul>
            <li :key="index" v-for="(purchase, index) of purchases">
              <input type="number" value="0" v-model="purchase.amount" min="0" :disabled="!purchase.enabled" />
              <select :key="index" v-model="purchase.name" @change="coinChanged({selectedIndex: $event.target.selectedIndex, index: index})" :disabled="!purchase.enabled">
                <option :key="coin.id" :value="coin.id" v-for="coin in purchaseCoins">{{coin.name}} (${{coin.price_usd}})</option>
              </select>
              <span>at $</span>
              <input type="number" value="0" v-model="purchase.price" min="0" :disabled="!purchase.enabled" />
              <button @click="removePurchase({index: index, enabled:purchase.enabled})">&#10006;</button>
            </li>
          </ul>
        </div>

        <button @click="addPurchase">Add new</button>
        <button v-if="purchases.length" @click="updatePrices">Update prices</button>
        <span v-if="isUpdating">Updating...</span>

        <div v-if="purchases.length" class="purchase-list">
          <div>  
            <p>Profit per purchase:</p>
            <ul>
              <li :key="index" v-for="(purchase, index) of purchases">
                  <span>{{format(purchase.amount)}}</span> {{tempCoins[purchase.name].symbol}} at {{format(purchase.price, "$")}}:          
                  <p class="indented-text">{{format(getProfit(purchase), "$")}} ({{format(getPurchasePercent(purchase))}}%)</p>
              </li>
            </ul>
            <span>Total value: {{format(getTotalValue(), "$")}}</span>
          </div>

          <div class="adjustment-form">
            <span>Make a manual correction to your investment: $</span>
            <input type="number" v-model="adjustment" />
          </div>

          <div class="total-form">
            <span>You invested a total of </span>
            <span>{{format(getInvestment(), "$")}} for a profit of</span> 
            <b v-bind:style="{color: profitColor}">{{format(getTotalProfit(), "$")}} ({{getProfitPercent()}}%)</b>
          </div>
        </div>

        <button v-if="purchases.length" @click="saveCalculation({purchases:purchases, adjustment:adjustment})">Save data</button>
        <span v-if="isProcessing">Processing...</span>
        <b v-if="isSaved">Saved!</b>

      </div>
      <div v-else>
        <span>Loading API data, please wait...</span>
      </div> 
    </div>
</template>

<script>
import { mapActions } from "vuex";
import { mapMutations } from "vuex";

export default {
  data() {
    return {
      profitColor: "black"
    };
  },
  created() {
    this.updatePrices();
  },
  mounted() {
    if(!this.purchases.length){
      this.$store.dispatch("getCalculation");
    }
  },
  computed: {
    purchaseCoins() {
      return this.$store.state.purchaseCoins;
    },
    tempCoins() {
      return this.$store.state.tempCoins;
    },
    calculation(){
      return this.$store.state.calculation;
    },
    purchases() {
      return this.$store.state.calculation.purchases;
    },
    adjustment: {
      get() {
        return this.$store.state.calculation.adjustment;
      },
      set(value) {
        this.$store.commit("updateAdjustment", value);
      }
    },
    isProcessing() {
      return this.$store.state.isProcessing;
    },
    isUpdating() {
      return this.$store.state.isUpdating;
    },
    isSaved() {
      return this.$store.state.isSaved;
    },
    name() {
      return this.$store.state.userName;
    }
  },
  methods: {
    updatePrices() {
      this.$store.dispatch("updatePurchaseCoins");
    },
    saveCalculation() {
      this.$store.dispatch("saveCalculation", this.calculation);
    },
    coinChanged(data) {
      this.$store.commit("coinChanged", data);
    },
    addPurchase() {
      this.$store.commit("addPurchase");
    },
    removePurchase(data) {
      this.$store.commit("removePurchase", data);
      if (!data.enabled) {
        this.$store.dispatch("saveCalculation", this.calculation);
      }
    },
    getProfit(purchase) {
      return (
        (this.tempCoins[purchase.name].price_usd - purchase.price) *
        purchase.amount
      );
    },
    getPurchasePercent(purchase) {
      return (
        this.tempCoins[purchase.name].price_usd * 100 / purchase.price -
        100
      ).toFixed(2);
    },
    getTotalValue() {
      var total = 0;

      this.purchases.forEach(purchase => {
        total += this.tempCoins[purchase.name].price_usd * purchase.amount;
      });

      return total;
    },
    getInvestment() {
      var investment = 0;

      this.purchases.forEach(purchase => {
        investment += purchase.price * purchase.amount;
      });

      return parseFloat(investment) + parseFloat(this.adjustment);
    },
    getTotalProfit() {
      var total = 0;

      this.purchases.forEach(purchase => {
        total += this.getProfit(purchase);
      });

      if (total < 0) {
        this.profitColor = "red";
      } else if (total > 0) {
        this.profitColor = "limegreen";
      } else {
        this.profitColor = "black";
      }

      return total;
    },
    getProfitPercent() {
      let profitPercent = (
        this.getTotalProfit() *
        100 /
        this.getInvestment()
      ).toFixed(2);

      return profitPercent;
    },
    format(number, symbol = "") {
      var n = +number;
      var sign = n < 0 ? "-" : "";
      var i = String(parseInt((n = Math.abs(n).toFixed(2))));
      var j = (j = i.length) > 3 ? j % 3 : 0;
      return (
        sign +
        symbol +
        (j ? i.substr(0, j) + "," : "") +
        i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + ",") +
        ("." +
          Math.abs(n - i)
            .toFixed(2)
            .slice(2))
      );
    }
  }
};
</script>

<style scoped>
.purchase-form {
  width: 720px;
}

.indented-text {
  font-weight: bold;
  text-indent: 2.5em;
}

.adjustment-form {
  margin-top: 1em;
}

.total-form {
  margin-top: 1em;
}

.purchase-list {
  margin: 2em 0 1.5em 0;
}

h4 {
  text-align: center;
  margin-bottom: 2em;
}

div.navigation {
  text-align: right;
}

li {
  margin-top: 0.5em;
  list-style-position: inside;
}

input,
select,
button {
  height: 2em;
}

select {
  width: 270px;
}
</style>