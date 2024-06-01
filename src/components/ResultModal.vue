<template>
  <div v-if="showModal" class="modal-overlay">
    <div class="modal">
      <table>
        <thead>
          <tr>
            <th>編號</th>
            <th>名稱</th>
            <th>售價</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in list" :key="item.set+item.new">
            <td style="text-align: center;" :class="{ soldout: item.soldout}">{{ item.set }}</td>
            <td :class="{ soldout: item.soldout}">{{ item.title }}</td>
            <td style="text-align: right;" :class="{ soldout: item.soldout}">{{ item.price }}</td>
          </tr>
        </tbody>
      </table>
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div>
          <button style="width: 75px;" @click="copyItems">複製選購商品</button>
        </div>
        <div style="border: 1px solid black; padding: 5px 15px; border-radius: 5px;">
          <div>
            總售價：{{ total }}
          </div>
          <div style="color: red">
            折扣價：{{ discount }}
          </div>
        </div>
      </div>
      <div class="modal-buttons">
        <!-- <button @click="closeModal">返回</button> -->
        <button @click="confirm">確認</button>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  props: {
    list: {
      type: Array,
      default: function () {
        return []
      }
    },
  },
  data() {
    return {
      showModal: false,
      username: '',
      password: '',
    };
  },
  computed: {
    total() {
      return this.list.reduce((prev, current)=>{
        return prev + current.price
      }, 0)
    },
    discount() {
      let totalTemp = this.total;
      let discount = 0;
      if (totalTemp >= 1000000) {
        discount += 100000;
        totalTemp-= 1000000;
      }
      if (totalTemp >= 750000) {
        discount += 65000;
        totalTemp -= 750000;
      }
      if (totalTemp >= 500000) {
        discount += 40000;
        totalTemp -= 500000;
      }
      if (totalTemp >= 250000) {
        discount += 18000;
        totalTemp -= 250000;
      }
      if (totalTemp >= 100000) {
        discount += 5000;
        totalTemp -= 100000;
      }
      if (totalTemp >= 100000) {
        discount += 5000;
        totalTemp -= 100000;
      }
      if (totalTemp >= 50000) {
        discount += 2000;
        totalTemp -= 50000;
      }
      if (totalTemp >= 30000) {
        discount += 1000;
        totalTemp -= 30000;
      }
      if (totalTemp >= 10000) {
        discount += 300;
        totalTemp -= 10000;
      }
      if (totalTemp >= 5000) {
        discount += 100;
        totalTemp -= 5000;
      }
      return this.total - discount;
    }
  },
  methods: {
    openModal() {
      this.showModal = true;
    },
    confirm() {
      this.showModal = false;
    },
    closeModal() {
      this.showModal = false;
    },
    copyItems() {
      let text = '';
      text = this.list.reduce((prev, current)=>{
        return prev + current.set + ';';
      }, '');
      this.copyToClipboard(text)
    },
    copyToClipboard(text) {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
        alert('已複製！請聯繫 Alex 確認購買');
      } catch (err) {
        console.error('無法複製文字', err);
      }
      document.body.removeChild(textarea);
    }
  }
};
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
  margin: 15px 0;
}

th, td {
  border: 1px solid #ccc;
  padding: 10px;
  text-align: left;
}

th {
  text-align: center;
}
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
  overflow: auto;
  min-width: 300px;
  max-width: 80%;
  max-height: 80%;
  background: white;
  padding: 20px 20px;
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
  margin-top: 20px;
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