<template>
  <div>
    <div class="filter">
      <div>
        <!-- <button type="button" :class="{ select: mode === 'place' }" @click="switchMode('place')">場景模式</button> -->
        <button type="button" :class="{ select: mode === 'data' }" @click="switchMode('data')">樂高清單</button>
      </div>
      <!-- <div v-if="mode === 'place'">
        <div class="dropdown-set">
          <div class="dropdown-title">場景切換：</div>
          <Dropdown :list="placeList" @updateSelectPlace="updateSelectPlace"/>
        </div>
      </div> -->
      <div>
        <input type="checkbox" id="filterOut" v-model="filterSoldout">
        <label for="filterOut" style="margin-right: 10px">隱藏售出</label>
      </div>
      <div class="sub-filter">
        <select v-model="selectCategory" id="categoryList" :disabled="isMyList && userStore.isLogin">
          <option v-for="item in legoCategory" :value="item.key">{{ item.name }}</option>
        </select>
      </div>
    </div>
    <div v-show="mode === 'place'">
      <div class="content">
        <div class="main-pic">
          <img :src="selectedPlace.imgUrl" />
        </div>
        <div class="gap"></div>
        <div class="sub-pic">
          <div>
            <div>
              <label for="detailList">圖中盒組列表： </label>
            </div>
            <select v-model="selectDetail" id="detailList">
              <option v-for="(item, index) in selectedPlace.detailList" :value="index">{{ item.set }} {{ item.title }}</option>
            </select>
            <div v-if="selectedPlace.detailList" class="detail-view">
              <img class="main-img" :src="selectDetailObj.mainImg" alt="">
              <div class="sub-imgs">
                <img v-for="imgUrl in selectDetailObj.subImgs" :src="imgUrl" :key="imgUrl" alt=""
                 @click="clickSubImg(imgUrl)">
              </div>
              <div class="detail-title">{{ selectDetailObj.name }}</div>
              <hr>
              <div>
                <b>系列：</b>
                <span>{{ displayTheme }}</span>
              </div>
            </div>
          </div>
          <div class="next">
            <button @click="next">下一筆</button>
          </div>
        </div>
      </div>
    </div>
    <div v-show="mode === 'data'" class="data-view">
      <ShopList :list="allLego" :isMyList="isMyList" :category="selectCategory" :hideOut="filterSoldout"/>
    </div>
    <!-- <div v-show="mode === 'data'" class="photo-grid" :style="{ gridTemplateColumns: `repeat(${photosPerRow}, 1fr)` }">
      <ShopList />
      <LegoItem v-for="item in legoList" :key="item.id" :item="item" />
    </div> -->
  </div>
</template>

<script>
import LegoItem from '../components/LegoItem.vue';
import Dropdown from '../components/Dropdown.vue';
import { mapState } from 'pinia';
import { useDeviceStore } from '../stores/useDeviceStore';
import { useUserStore } from '../stores/useUserStore';
import { legoList } from '../data/lego.js';
import { placeList } from '../data/placex2.js';
import ShopList from '../components/ShopList.vue';

export default {
  name: 'LegoView',
  components: {
    LegoItem,
    Dropdown,
    ShopList
},
  data() {
    return {
      version: '062102',
      mode: 'data',
      photosPerRow: 3,
      legoList: legoList,
      placeList: placeList,
      selectedPlace: placeList[0],
      selectDetail: 0,
      selectDetailIdx: 0,
      tempPerRow: 0,
      allLego: [],
      dataMode: 'myData',
      legoCategory: [
        { name: '全部系列', key: 'All' },
        { name: '蝙蝠俠系列', key: 'Batman' },
        { name: '忍者系列', key: 'Ninjago' },
        { name: '科技系列', key: 'Technic' },
        { name: '星際大戰', key: 'Star Wars' },
        { name: '迪士尼', key: 'Disney' },
        { name: 'CREATOR', key: 'Creator' },
        { name: 'IDEAs', key: 'Ideas' },
        { name: '城市系列', key: 'City' },
        { name: '哈利波特', key: 'Harry Potter' },
        { name: '建築系列', key: 'Architecture' },
        { name: '人偶系列', key: 'Minifigure Series' },
        { name: '街景系列', key: 'Modular Buildings' },
      ],
      // legoCategory: ['All', 'Batman', 'Ninjago', 'Technic', 'Star Wars', 'Disney', 'Creator', 'Ideas', 'City', 'Harry Potter', 'Modular Buildings'],
      isMyList: true,
      selectCategory: 'All',
      userStore: useUserStore(),
      filterSoldout: true
    };
  },
  computed: {
    ...mapState(useDeviceStore, ['isMobile']),
    selectDetailObj() {
      return this.selectedPlace.detailList[this.selectDetail]
    },
    displayTheme() {
      return this.selectDetailObj.theme.join(' & ')
    }
  },
  watch: {
    isMobile: {
      handler(newVal, oldVal) {
        if (newVal) {
          this.tempPerRow = this.photosPerRow;
          this.photosPerRow = 1;
        } else {
          this.photosPerRow = this.tempPerRow? this.tempPerRow: 3;
        }
      },
      immediate: true,
    },
  },
  methods: {
    async getLegoInfo() {
      const imgSource = 'https://www.brickeconomy.com';

      try {
        const sourcePathBase = process.env.NODE_ENV === 'production' ? '/legogo' : '';
        const response = await fetch(sourcePathBase + '/data/legov11.json');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        this.allLego = data.map((obj)=>{
          return {
            selected: false,
            set: obj.Set.split('-')[0],
            name: obj.Name,
            title: obj.Title,
            price: obj.Valuation,
            soldout: obj.Sell? obj.New? (obj.New - obj.Sell <= 0): (obj.Used - obj.Sell <= 0) : false,
            new: obj.New,
            only: obj.only,
            note: obj.note,
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
          localStorage.setItem('version', JSON.stringify(this.version))
        }
      } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
      }
    },
    switchMode(mode){
      this.mode = mode;
    },
    updateSelectPlace(val) {
      this.selectedPlace = val;
      this.updateDetailList()
    },
    updateDetailList() {
      const temp = new Set();
      this.selectedPlace.detailList = []
      this.allLego.forEach((item)=> {
        if (this.selectedPlace.list.includes(Number(item.set))) {
          this.selectedPlace.detailList.push(item);
        }
        temp.add(...item.theme)
      })
      this.selectDetail = 0;
      // this.legoCategory = Array.from(temp)
    },
    clickSubImg(url) {
      const newUrl = url.replace('thumb', 'large').replace('png', 'jpg')
      this.selectDetailObj.mainImg = newUrl;
    },
    next() {
      this.selectDetail = (this.selectDetail == this.selectedPlace.detailList.length-1)? 0 : this.selectDetail+1;
    }
  },
  mounted() {
    let needReload = true;
    if (localStorage && localStorage.getItem('version') && localStorage.getItem('lego')) {
      if (JSON.parse(localStorage.getItem('version')) == this.version) {
        needReload = false;
      }
    }
    if (needReload) {
      this.getLegoInfo();
    } else {
      this.allLego = JSON.parse(localStorage.getItem('lego'));
    }
  },
}
</script>

<style scoped>
.filter {
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.filter button {
  border-radius: 0;
  border: 1px var(--secondary-color) solid;
  color: var(--secondary-color);
  background-color: white;
}
.filter button:hover, .filter button.select {
  background-color: var(--secondary-color);
  color: white;
}
.dropdown-set {
  display: flex;
  align-items: center;
}
.dropdown-title {
  height: 38px;
  line-height: 38px;
  background-color: white;
  border: 1px solid var(--primary-color);
  border-radius: 5px 0 0 5px ;
  padding: 0 10px 0 20px;
}
.photo-grid {
  display: grid;
  gap: 16px;
  margin-top: 10px;
}

.number-row {
  position: absolute;
    right: 20px;
    top: 80px;
}
.content {
  width: 100%;
  margin-top: 10px;
  display: flex;
  align-items: stretch;
}
.main-pic {
  flex: 0 0 70%;
}
.main-pic img {
  width: 100%;
  vertical-align: middle;
}
.gap {
  flex: 0 0 2%;
}
.sub-pic {
  flex: 0 0 28%;
  border: 2px solid var(--primary-color);
  border-radius: 10px;
  padding: 10px;
  box-sizing: border-box;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  max-height: 640px;
}
#detailList {
  margin: 5px 0;
  width: 100%;
  height: 28px;
  font-size: 16px;
}
.detail-view {
  text-align: center;
}
.detail-view .main-img {
  max-width: 100%;
  max-height: 35vh;
}
.detail-view .sub-imgs {
  display: flex;
  flex-wrap: nowrap;
  max-width: 100%;
  overflow-x: auto;
  border: 1px solid var(--primary-color);
  border-radius: 5px;
  padding: 5px;
  height: 72px;
}
.detail-view .sub-imgs img {
  background-color: white;
  margin-right: 10px;
  cursor: pointer;
}
.detail-title {
  font-family: 'Comic Neue', cursive;
  font-weight: 700;
  font-style: normal;
  margin: 10px 5px;
  font-size: 20px;
}
.next {
  display: flex;
  justify-content: center;
  margin-top: 5px;
}
.next button {
  width: 100%;
  height: 35px;
  line-height: 35px;
  padding: 0;
}

hr {
  width: 100%;
  display: block;
  border-style: inset;
  border-width: 1px;
}

.data-view {
  margin-top: 10px;
}

.sub-filter {
  display: flex;
  align-items: center;
}

#categoryList {
  font-size: 16px;
  height: 28px;
  width: 240px;
  margin-right: 10px;
}

@media (max-width: 768px) {
  .number-row {
    display: none;
  }
  .dropdown-set {
    flex-direction: column;
  }
  .dropdown-title {
    width: 158px;
    padding: 0;
    text-align: center;
    border-radius: 5px 5px 0 0;
  }
  .main-pic {
    flex: 0 0 100%;
  }
  .content {
    flex-direction: column;
  }
  .gap {
    flex: none;
    height: 10px;
  }
  .sub-filter {
    flex-direction: column-reverse;
  }
  #categoryList {
    font-size: 14px;
    height: 24px;
    width: 130px;
    margin-right: 0;
  }
}

</style>