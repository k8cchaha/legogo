<template>
  <div class="photo-item" @click="$router.push(route)">
    <img :src="imgUrl" :alt="name">
    <div class="page-flip" :style="{ color: activeColor}">{{ name }}</div>
  </div>
</template>

<script>
export default {
  name: 'CategoryItem',
  props: {
    imgUrl: String,
    name: String,
    color: String,
    route: String
  },
  data() {
    return {
      activeColor: this.color
    }
  }
}
</script>

<style scoped>
.photo-item {
  position: relative;
}

.photo-item img {
  width: 100%;
  height: auto;
  transition: transform 0.3s ease;
  cursor: pointer;
  border-radius: 20px;
}

.photo-item:hover img {
  transform: scale(1.05);
}

.page-flip {
  position: absolute;
  bottom: 20px;
  right: 20px;
  background-color: white;
  padding: 5px 10px;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
  font-size: 36px;
  color: black;
  font-family: 'Comic Neue', cursive;
  font-weight: 700;
  cursor: pointer;
}
</style>