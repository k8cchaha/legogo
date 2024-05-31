<template>
  <Navbar />
  <div class="main-container">
    <router-view />
  </div>
  <Footer />
</template>

<script>
import Navbar from './components/Navbar.vue';
import Footer from './components/Footer.vue';
import { onMounted, onUnmounted } from 'vue';
import { useDeviceStore } from './stores/useDeviceStore';

export default {
  components: {
    Navbar,
    Footer
  }, 
  setup() {
    const deviceStore = useDeviceStore();

    const checkIsMobile = () => {
      deviceStore.setIsMobile(window.innerWidth < 768);
    };

    onMounted(() => {
      checkIsMobile();
      window.addEventListener('resize', checkIsMobile);
    });

    onUnmounted(() => {
      window.removeEventListener('resize', checkIsMobile);
    });
  },
}
</script>

<style>
  .main-container {
    padding: 50px 20px 0 20px;
  }

  h1 {
    text-align: center;
    font-family: 'Comic Neue', cursive;
    margin: 15px 0 10px 0;
  }
</style>