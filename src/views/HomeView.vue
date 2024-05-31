<template>
  <div class="home-container">
    <h2 class='welcome pc'>{{ $t('message.welcome_pc') }}</h2>
    <h3 class='welcome mobile'>{{ $t('message.welcome_mobile') }}</h3>
    <div class="photo-grid">
      <CategoryItem v-for="category in categoryList" :key="category.name"
                    :name="category.name" :imgUrl="category.imgUrl" 
                    :color="category.color" :route="category.route"/>
    </div>
  </div>
</template>

<script>
import CategoryItem from '../components/CategoryItem.vue';

export default {
  name: 'HomeView',
  components: {
    CategoryItem
  },
  data() {
    return {
      categoryList: [
        { name: 'LEGO', imgUrl: './imgs/category/lego.webp', color: 'red', route: 'lego' },
        { name: 'NBA CARD', imgUrl: './imgs/category/card.webp', color: 'blue', route: 'card' },
        { name: 'GK', imgUrl: './imgs/category/gk.webp', color: 'green', route: 'gk' },
        { name: 'TOYS', imgUrl: './imgs/category/toys.webp', color: 'orange', route: 'toys' },
      ]
    }
  }
}
</script>

<style scoped>
.welcome {
  text-align: center;
  font-family: 'Comic Neue', cursive;
  font-weight: 700;
  font-style: normal;
  font-size: 46px;
}

.welcome.pc {
  margin: 15px 0 15px 0;
}

.welcome.mobile {
  margin: 10px 0 15px 0;
}

.photo-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 40px;
  max-width: 1100px;
  margin: auto;
}

@media (max-width: 1024px) {
  .photo-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .photo-grid {
    grid-template-columns: 1fr;
  }
  .welcome.pc {
    display: none;
  }
  .welcome.mobile {
    display: block;
  }
}

@media (min-width: 769px) {
  .welcome.pc {
    display: block;
  }
  .welcome.mobile {
    display: none;
  }
  .home-container {
    padding: 0 20px;
  }
}
</style>