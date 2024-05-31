<template>
  <div v-if="showModal" class="modal-overlay">
    <div class="modal">
      <h2>登出</h2>
      <span>確定要登出嗎？</span>
      <div class="modal-buttons">
        <button @click="closeModal">取消</button>
        <button @click="logout">確認</button>
      </div>
    </div>
  </div>
</template>

<script>
import { useUserStore } from '../stores/useUserStore';

export default {
  data() {
    return {
      showModal: false,
      userStore: useUserStore()
    };
  },
  methods: {
    openModal() {
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
    logout() {
      this.userStore.logout()
      this.closeModal();
    }
  }
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  background: white;
  padding: 20px 40px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.modal h2 {
  color: var(--text-color);
  margin-top: 0;
  text-align: center;
}
.modal input {
  font-size: 18px;
  line-height: 30px;
  width: 200px;
}

.modal-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.modal-buttons button {
  padding: 10px 30px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.modal-buttons button:first-child {
  border: 1px solid  red;
  background-color: white;
  color: red;
  margin-right: 15px;
}

.modal-buttons button:last-child {
  background-color: red;
  color: white;
  margin-left: 15px;
}

span {
  color: var(--text-color);
}
</style>