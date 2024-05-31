<template>
  <div v-if="showModal" class="modal-overlay">
    <div class="modal">
      <h2>登入</h2>
      <div>
        <label for="user-account">帳號：</label>
        <input id="user-account" type="text" v-model="username" placeholder="請輸入帳號" />
      </div>
      <div>
        <label for="user-password">密碼：</label>
        <input id="user-password" type="password" v-model="password" placeholder="請輸入密碼" />
      </div>
      
      
      <div class="modal-buttons">
        <button @click="closeModal">取消</button>
        <button @click="login" :disabled="!username || !password">確認</button>
      </div>
    </div>
  </div>
</template>

<script>
import { useUserStore } from '../stores/useUserStore';
import { userList } from '../data/userxx12.js';
import { placeList } from '../data/placex2.js';

export default {
  data() {
    return {
      showModal: false,
      username: '',
      password: '',
      userStore: useUserStore(),
      userList: userList,
      placeList: placeList
    };
  },
  methods: {
    openModal() {
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
      this.username = '';
      this.password = '';
    },
    login() {
      let isSuccess = false;
      for (let i = 0; i < this.userList.length; i++) {
        if (this.userList[i].account.toLowerCase() === this.username.toLowerCase() && this.userList[i].password == this.password) {
          let fromSet = []
          if (this.userList[i].set) {
            const totalSet = this.userList[i].set.split(';');
            for (let i = 0; i < totalSet.length; i++) {
              for (let j = 0; j < this.placeList.length; j++) {
                if (totalSet[i] === this.placeList[j].name) {
                  fromSet.push(...this.placeList[j].list)
                }
              }
            }
          }
          if (this.userList[i].set === '全') {
            const allLego = JSON.parse(localStorage.getItem('lego3'));
            fromSet.push(...allLego.map((item)=>Number(item.set)))
          }
          if (this.userList[i].not !== '') {
            const idx = fromSet.indexOf(Number(this.userList[i].not));
            fromSet.splice(idx, 1);
          }
          
          this.userStore.setUserInfo({
            name: `嗨! ${this.userList[i].name}`,
            pickup: this.userList[i].pickup == '1'? true : false,
            list: [...this.userList[i].list.map((item)=>Number(item)), ...fromSet]
          });
          
          isSuccess = true;
          this.closeModal();
          break;
        }
      }
      if (!isSuccess) {
        alert('抱歉!錯誤的帳號或密碼, 請聯繫 Alex')
      }
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
  color: var(--primary-color);
  margin-top: 0;
  text-align: center;
}
.modal input {
  font-size: 18px;
  line-height: 30px;
  width: 160px;
  margin-bottom: 10px;
}
.modal label {
  color: black;
}

.modal-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}

.modal-buttons button {
  padding: 10px 30px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.modal .modal-buttons button:disabled, .modal .modal-buttons button[disabled] {
  background-color: gray;
  cursor: no-drop;
}

.modal-buttons button:first-child {
  border: 1px solid  var(--primary-color);
  background-color: white;
  color: var(--primary-color);
  margin-right: 15px;
}

.modal-buttons button:last-child {
  background-color: var(--primary-color);
  color: white;
  margin-left: 15px;
}
</style>