import { defineStore } from 'pinia';
import { ref, reactive } from 'vue';

export const useUserStore = defineStore('user', () => {
  const isLogin = ref(false);
  const userName = ref('');
  const userPickup = ref('');
  const userList = reactive([]);

  const setUserInfo = (value) => {
    userName.value = value.name;
    userPickup.value = value.pickup;
    userList.length = 0;
    userList.push(...value.list);
    isLogin.value = true;

    localStorage.setItem('user2', JSON.stringify(value));
  };

  const logout = () => {
    userName.value = '';
    isLogin.value = false;
    localStorage.removeItem('user2')
  }

  return {
    userName,
    userPickup,
    userList,
    setUserInfo,
    isLogin,
    logout
  };
});