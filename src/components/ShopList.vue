<template>
  <div class="form-container">
    <form>
    <!-- <form @submit.prevent="submitForm"> -->
      <table>
        <thead>
          <tr>
            <th>圖片</th>
            <th>編號</th>
            <th>名稱</th>
            <th>售價</th>
            <th>全新</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in displayList" :key="item.set+item.new">
            <td class="img-cell"><img :src="useSmallPic(item.mainImg)" alt=""></td>
            <td style="text-align: center;">{{ item.set }}</td>
            <td>{{ item.title }}</td>
            <td style="text-align: right;">{{ item.price }}</td>
            <td style="text-align: center;">
                {{ isNew(item.new) }} 
                <div class="tooltip" v-if="item.note">
                  <span class="info-icon">i</span>
                  <span class="tooltiptext">{{ item.note }}</span>
                </div>
            </td>
          </tr>
          <tr>
            <td colspan="5" style="text-align: center;">
              {{pickupStr}} | 總售價: {{total}} | 報價: <span style="color: red; font-weight: bold;">{{price}}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </form>
  </div>
</template>

<script>
import { useUserStore } from '../stores/useUserStore';

export default {
  name: 'ShopList',
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
      userStore: useUserStore()
    };
  },
  computed: {
    displayList() {
      if (this.isMyList && this.userStore.isLogin) {
        return this.list.filter((item)=>{
          return this.userStore.userList.includes(Number(item.set)) && (item.new || (!item.new && item.only))
        });
      } else {
        if (this.category) {
          return this.list.filter((item)=>{
            return item.theme.includes(this.category)
          });
        } else {
          return this.list;
        }
      }
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
    }
  }
};
</script>

<style scoped>
.form-container {
  /* max-width: 600px; */
  margin: 0 auto;
  padding: 20px;
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
  padding: 10px;
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