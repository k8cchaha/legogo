<template>
  <div v-if="visible" class="drawer-menu">
    <router-link to="/" @click="toggleMenu">HOME</router-link>
    <hr>
    <router-link to="/lego" @click="toggleMenu">LEGO</router-link>
    <router-link to="/card" @click="toggleMenu">NBA CARD</router-link>
    <router-link to="/gk" @click="toggleMenu">GK</router-link>
    <router-link to="/toys" @click="toggleMenu">TOYS</router-link>
    <hr>
    <router-link to="/about" @click="toggleMenu">About Me</router-link>
  </div>
</template>

<script>
export default {
  props: {
    visible: Boolean
  },
  emits: ['update:visible'],
  methods: {
    toggleMenu() {
      this.$emit('update:visible', false);
    }
  }
}
</script>

<style scoped>
.drawer-menu {
  position: absolute;
  top: 55px;
  right: 0;
  width: 150px;
  background-color: var(--primary-color);
  display: flex;
  flex-direction: column;
  padding: 10px 0;
  box-shadow: 0 8px 16px rgba(0,0,0,0.1);
  z-index: 999;
}

.drawer-menu a {
  padding: 10px 20px;
  text-decoration: none;
  color: white;
  font-size: 16px;
}

.drawer-menu a:hover {
  background-color: var(--secondary-color);
}

hr {
  width: 100%;
  display: block;
  border-style: inset;
  border-width: 1px;
}
</style>