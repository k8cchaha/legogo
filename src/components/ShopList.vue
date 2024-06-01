<template>
  <div class="form-container">
    <form>
    <!-- <form @submit.prevent="submitForm"> -->
      <table>
        <thead>
          <tr>
            <th></th>
            <th>圖片</th>
            <th>編號</th>
            <th>名稱</th>
            <th>售價</th>
            <th>全新</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in displayList" :key="item.set+item.new" @click="selectedRow(index)">
            <td class="check">
              <input type="checkbox" v-model="item.selected" :disabled="item.soldout" style="cursor: pointer;">
            </td>
            <td class="img-cell"><img :src="useSmallPic(item.mainImg)" alt=""></td>
            <td style="text-align: center;" :class="{ soldout: item.soldout}">{{ item.set }}</td>
            <td :class="{ soldout: item.soldout}">{{ item.title }}</td>
            <td style="text-align: right;" :class="{ soldout: item.soldout}">{{ item.price }}</td>
            <td style="text-align: center;">
                <span v-if="item.soldout" style="color: red;">售出</span>
                <span v-else>{{ isNew(item.new) }}</span>
                <div class="tooltip" v-if="item.note">
                  <span class="info-icon">i</span>
                  <span class="tooltiptext">{{ item.note }}</span>
                </div>
            </td>
          </tr>
          <!-- <tr>
            <td colspan="5" style="text-align: center;">
              {{pickupStr}} | 總售價: {{total}} | 報價: <span style="color: red; font-weight: bold;">{{price}}</span>
            </td>
          </tr> -->
        </tbody>
      </table>
    </form>
    
  </div>
  <div class="cart-container" @click="openCart">
    <button class="cart-button">
      購物車
      <span class="badge">{{ selectedList.length }}</span> <!-- 顯示購買的個數 -->
    </button>
  </div>
  <div>
    <ResultModal ref="resultModal" :list="selectedList"/>
  </div>

</template>

<script>
import { useUserStore } from '../stores/useUserStore';
import ResultModal from './ResultModal.vue';

export default {
  name: 'ShopList',
  components: {
    ResultModal
  },
  props: {
    list: {
      type: Array,
      default: function () {
        return []
      }
    },
    isMyList: Boolean,
    category: String
  },
  data() {
    return {
      isOpen: false,
      selectedOption: null,
      userStore: useUserStore(),
      resultModal: null,
    };
  },
  computed: {
    displayList() {
      if (this.category) {
        if (this.category === 'All') {
          return this.list;
        }
        return this.list.filter((item)=>{
          return item.theme.includes(this.category)
        });
      } else {
        return this.list;
      }
    },
    selectedList() {
      return this.list.filter((item)=>item.selected)
    },
    pickupStr() {
      return (this.userStore.pickup)? '自取: 可': '自取: 無'
    },
    total() {
      return this.displayList.reduce((prev, curr)=>{
        console.log(prev)
        return prev + curr.price
      }, 0)
    },
    price() {
      let totalTemp = this.total;
      let discount = 0;
      if (totalTemp >= 1000000) {
        discount += 100000;
        totalTemp-= 1000000;
      }
      if (totalTemp >= 750000) {
        discount += 65000;
        totalTemp -= 750000;
      }
      if (totalTemp >= 500000) {
        discount += 40000;
        totalTemp -= 500000;
      }
      if (totalTemp >= 250000) {
        discount += 18000;
        totalTemp -= 250000;
      }
      if (totalTemp >= 100000) {
        discount += 5000;
        totalTemp -= 100000;
      }
      if (totalTemp >= 100000) {
        discount += 5000;
        totalTemp -= 100000;
      }
      if (totalTemp >= 50000) {
        discount += 2000;
        totalTemp -= 50000;
      }
      if (totalTemp >= 30000) {
        discount += 1000;
        totalTemp -= 30000;
      }
      if (totalTemp >= 10000) {
        discount += 300;
        totalTemp -= 10000;
      }
      if (totalTemp >= 5000) {
        discount += 100;
        totalTemp -= 5000;
      }

      // pickup
      let remainTotal = this.total - discount;
      let pickupDiscount = 0;
      if (this.userStore.pickup) {
        if (remainTotal > 250000) {
          pickupDiscount = remainTotal * 0.01
        } else if (remainTotal > 100000) {
          pickupDiscount = 1500
        } else if (remainTotal > 50000) {
          pickupDiscount = 1000
        } else if (remainTotal > 10000 ) {
          pickupDiscount = 500
        } else if (remainTotal > 5000) {
          pickupDiscount = 200
        }
      }
      
      return this.lastNumToZero(this.numberComma(Math.floor(this.total - (discount + pickupDiscount))))
    }
  },
  methods: {
    openCart() {
      if (this.selectedList.length === 0) {
        alert('您尚未選購商品');
        return;
      }
      
      this.$refs.resultModal.openModal();
    },
    useSmallPic(url) {
      return url.replace('large', 'thumb').replace('jpg', 'png')
    },
    isNew(num) {
      return num > 0 ? '是': '否'
    },
    numberComma(num) {
      let comma=/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g
      return num.toString().replace(comma, ',')
    },
    lastNumToZero(numberString) {
      let numberArray = numberString.split('');
      numberArray[numberArray.length - 1] = '0';
      return numberArray.join('');
    },
    selectedRow(idx) {
      if (!this.displayList[idx].soldout) {
        this.displayList[idx].selected = !this.displayList[idx].selected;
      }
    }
  }
};
</script>

<style scoped>
.check {
  text-align: center; /* 置中對齊 */
  vertical-align: middle; /* 垂直置中 */
}
.check input {
  width: auto;
  transform: scale(1.2);
}

.soldout {
  text-decoration: line-through;
  text-decoration-color: red;
}

.cart-container {
    position: fixed; /* 固定位置 */
    right: 15px; /* 距離右邊20像素 */
    bottom: 10%; /* 距離底部20像素 */
    z-index: 1000; /* 層級 */
  }

  .cart-button {
    background-color: var(--primary-color); /* 綠色背景 */
    color: white; /* 白色文字 */
    border: none; /* 無邊框 */
    padding: 10px 20px; /* 內邊距 */
    text-align: center; /* 文字居中 */
    text-decoration: none; /* 無下劃線 */
    display: inline-block; /* 行內塊 */
    font-size: 16px; /* 字體大小 */
    border-radius: 50px; /* 圓角邊框 */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 投影效果 */
    cursor: pointer; /* 鼠標指針樣式 */
    position: relative; /* 相對定位，方便放置徽章 */
  }

  .cart-button:hover {
    background-color: var(--secondary-color); /* 懸浮時變換背景色 */
  }

  .badge {
    position: absolute; /* 絕對定位 */
    top: -10px; /* 向上移動10像素 */
    right: -10px; /* 向右移動10像素 */
    background-color: red; /* 紅色背景 */
    color: white; /* 白色文字 */
    border-radius: 50%; /* 圓形 */
    padding: 5px 10px; /* 內邊距 */
    font-size: 12px; /* 字體大小 */
  }
.form-container {
  /* max-width: 600px; */
  margin: 0 auto;
  /* padding: 20px; */
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 15px;
}

th, td {
  border: 1px solid #ccc;
  padding: 2px;
  text-align: left;
}

th {
  text-align: center;
}

input {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}

button {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  margin-right: 10px;
}

button:hover {
  background-color: #0056b3;
}

.img-cell {
  max-width: 60px;
}
.img-cell img {
  width: 60px;
}

/* Tooltip container */
.tooltip {
  position: relative;
  display: inline-block;
  border-bottom: 1px dotted black; /* If you want dots under the hoverable text */
}

/* Tooltip text */
.tooltip .tooltiptext {
  visibility: hidden;
  width: 120px;
  background-color: black;
  color: #fff;
  text-align: center;
  padding: 5px 0;
  border-radius: 6px;
  /* Position the tooltip text - see examples below! */
  position: absolute;
  z-index: 1;
  top: -5px;
  right: 105%;
}

/* Show the tooltip text when you mouse over the tooltip container */
.tooltip:hover .tooltiptext {
  visibility: visible;
}

.info-icon {
  display: inline-block;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: var(--primary-color);
  color: white;
  text-align: center;
  line-height: 20px;
  font-family: Arial, sans-serif;
  font-weight: bold;
  font-size: 16px;
  cursor: pointer;
}

@media (max-width: 768px) {
  .login {
    margin-right: 10px;
  }
  .img-cell {
  max-width: 30px;
}
.img-cell img {
  width: 30px;
}
}
</style>