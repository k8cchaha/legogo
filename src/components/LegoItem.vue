<template>
  <div class="photo-item">
    <img :src="item.image" :alt="item.name">
    <div class="photo-info">
      <h3>{{ item.name }}</h3>
      <p>Series: {{ item.series }}</p>
      <p>Price: {{ item.price }}</p>
      <p>Condition: {{ item.condition }}</p>
      <p>Tags: <span v-for="tag in item.tags" :key="tag">{{ tag }}</span></p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LegoItem',
  props: {
    item: Object,
  }
}
</script>

<style scoped>
.photo-item {
  border: 1px solid #ccc;
  padding: 10px;
}
.photo-item img {
  width: 100%;
  height: auto;
}
.photo-info {
  margin-top: 10px;
}
</style>