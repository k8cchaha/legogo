<template>
  <div v-if="showModal" class="modal-overlay">
    <div class="modal">
      <img :src="imgSrc" width="100%"/>
      
      <div class="modal-buttons">
        <button @click="closeModal">取消</button>
        <button v-if="!isSelected" @click="confirm(true)">加入購物車</button>
        <button v-else @click="confirm(false)" class="remove">移除</button>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  props: {
    imgSrc: {
      type: String
    },
    isSelected: {
      type: Boolean
    }
  },
  data() {
    return {
      showModal: false,
    };
  },
  methods: {
    openModal() {
      this.showModal = true;
    },
    confirm(isAdd) {
      this.$emit('updateSelected', isAdd);
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
  width: 100%;
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
  width: 40%;
  margin-right: 20px;
}

.modal-buttons button:last-child {
  background-color: var(--primary-color);
  color: white;
}

.modal-buttons button:last-child.remove {
  background-color: red;
  color: white;
}
</style>