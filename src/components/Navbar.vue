<template>
  <header>
    <div class="logo" @click="goHome">Alex的收藏</div>
    <nav v-if="!isMobile">
      <router-link to="/">HOME</router-link> | 
      <router-link to="/lego">LEGO</router-link> | 
      <router-link to="/card">NBA CARD</router-link> | 
      <router-link to="/gk">GK</router-link> | 
      <router-link to="/toys">TOYS</router-link>
    </nav>
    <div class="info">
      <button class="login" @click="openModal" v-if="!loginUser">登入</button>
      <div class="user-name" v-else>
        <span @click="openLogout">{{ loginUser }}</span>
      </div>
      <!-- <router-link to="/about" class="about" v-if="!isMobile">About Me</router-link> -->
      <button class="menu-button" @click="toggleMenu" v-show="isMobile">☰</button>
      <DrawerMenu :visible="menuOpen && isMobile" @update:visible="menuOpen = $event" />
    </div>
    <LoginModal ref="loginModal" />
    <LogoutModal ref="logoutModal" />
  </header>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useDeviceStore } from '../stores/useDeviceStore';
import { useUserStore } from '../stores/useUserStore';
import DrawerMenu from './DrawerMenu.vue';
import LoginModal from './LoginModal.vue';
import LogoutModal from './LogoutModal.vue';

export default {
  name: 'Navbar',
  components: {
    DrawerMenu,
    LoginModal,
    LogoutModal
  },
  setup() {
    const router = useRouter();
    const menuOpen = ref(false);
    const userOpen = ref(false);
    const deviceStore = useDeviceStore();
    const userStore = useUserStore();
    const isMobile = computed(() => deviceStore.isMobile);
    const loginUser = computed(() => userStore.userName);
    const loginModal = ref(null);
    const logoutModal = ref(null);

    function goHome() {
      router.push('/');
    }

    function toggleMenu() {
      menuOpen.value = !menuOpen.value;
    }

    function openLogout() {
      logoutModal.value.openModal();
    }

    function openModal() {
      loginModal.value.openModal();
    }

    onMounted(() => {
      if (localStorage.getItem('user2')) {
        userStore.setUserInfo(JSON.parse(localStorage.getItem('user2')))
      }
    })

    return { goHome, toggleMenu, openModal, openLogout, menuOpen, userOpen, isMobile, loginModal, logoutModal, loginUser};
  }
}
</script>

<style scoped>
header {
  height: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: var(--primary-color);
  color: white;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
}

.logo {
  font-size: 24px;
  cursor: pointer;
  flex-grow: 0;
}

nav {
  display: flex;
  justify-content: center;
  flex-grow: 1; /* Ensures that nav takes up the available space */
}

nav a {
  margin: 0 10px;
  text-decoration: none;
  color: white;
}

nav a:hover {
  color: var(--secondary-color);
}

nav router-link:hover {
  text-decoration: underline;
}

.about {
  text-decoration: none;
  color: white;
}

.about:hover {
  text-decoration: underline;
}

.router-link-active {
  color: var(--secondary-color);
  font-weight: bold;
}

.login {
  padding: 5px 20px;
  background-color: white;
  border: solid 1px var(--secondary-color);
  color: var(--secondary-color);
}
.login:hover {
  background-color: var(--secondary-color);
  color:white;
}
.info {
  display: flex;
  align-items: center;
}
.user-name {
  margin-right: 10px;
  cursor: pointer;
  position: relative;
}

@media (max-width: 768px) {
  .login {
    margin-right: 10px;
  }
}
</style>