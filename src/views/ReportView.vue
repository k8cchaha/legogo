<template>
  <h1>Hi I am Alex</h1>
  <div>
    <table>
        <thead>
          <tr>
            <th>圖片</th>
            <th>編號</th>
            <th>名稱</th>
            <th>售價</th>
            <th>全新</th>
            <th>購買人次</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in allLego" :key="item.set+item.new">
            <td class="img-cell"><img :src="item.mainImg" alt="" height="30px"></td>
            <td style="text-align: center;">{{ item.set }}</td>
            <td>{{ item.title }}</td>
            <td style="text-align: right;">{{ item.price }}</td>
            <td style="text-align: center;">
                {{ item.new }} 
            </td>
            <td>
              {{ item.count }}
            </td>
          </tr>
          <tr>
            <td colspan="6">
              <div>有被購買的數量： {{ totalGood.count }} || 有被購買的金額： {{ totalGood.amount }}</div>
              <div>未被購買的數量： {{ totalBad.count }} || 未被購買的金額： {{ totalBad.amount }}</div>
            </td>
          </tr>
        </tbody>
      </table>
  </div>
</template>

<script>
import LegoItem from '../components/LegoItem.vue';
import { useUserStore } from '../stores/useUserStore';
import { legoList } from '../data/lego.js';
import { userList } from '../data/userxx12.js';

export default {
  name: 'LegoView',
  components: {
    LegoItem,
},
  data() {
    return {
      legoList: legoList,
      allLego: [],
      userStore: useUserStore(),
      userList: userList,
      userListNew: [],
      report: [],
      totalGood: {
        count: 0,
        amount: 0
      },
      totalBad: {
        count: 0,
        amount: 0
      }
    };
  },
  methods: {
    async getLegoInfo() {
      const imgSource = 'https://www.brickeconomy.com';

      try {
        const sourcePathBase = process.env.NODE_ENV === 'production' ? '/legogo' : '';
        const response = await fetch(sourcePathBase + '/data/legov4.json');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        this.allLego = data.map((obj)=>{
          return {
            set: obj.Set.split('-')[0],
            name: obj.Name,
            title: obj.Title,
            new: obj.New,
            grown: obj.Growth,
            theme: obj.Theme.replace('Icons', 'CREATOR').split(' \/ '),
            mainImg: imgSource + obj['main-img'],
            subImgs: obj['sub-imgs'].map((url)=>{
              return imgSource + url;
            })
          }
        })

        if (localStorage) {
          localStorage.setItem('lego', JSON.stringify(this.allLego))
        }
        this.doAnalysis();
      } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
      }
    },
    handleUserList() {

    },
    doAnalysis() {
      for (let i = 0; i < this.allLego.length; i++) {
        this.allLego[i].count = 0;
        this.userList.forEach((user)=>{
          user.list.forEach((itemNumber)=>{
            if (itemNumber == this.allLego[i].set) {
              this.allLego[i].count ++;
            }
          })
        })
      }
      
      for (let i = 0; i < this.allLego.length; i++) {
        console.log(this.allLego[i].set)
        console.log(this.totalGood.amount + this.totalBad.amount)

        if (this.allLego[i].new || this.allLego[i].only) {
          if (this.allLego[i].count > 0) {
            this.totalGood.count ++;
            if (this.allLego[i].new) {
              let tempCount = this.allLego[i].count;
              for (let j = 0; j < this.allLego[i].new; j++) {
                if (tempCount <= 0) {
                  break;
                }
                this.totalGood.amount += this.allLego[i].price;
                tempCount--;
              }
            } else {
              this.totalGood.amount += this.allLego[i].price;
            }
          } else {
            this.totalBad.count ++;
            this.totalBad.amount += this.allLego[i].price
          }
        }
      }
    }
  },
  mounted() {
    if (localStorage && localStorage.getItem('lego')) {
      this.allLego = JSON.parse(localStorage.getItem('lego'));
      this.doAnalysis();
    } else {
      this.getLegoInfo();
    }
    
  },
}
</script>