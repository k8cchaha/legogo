<template>
  <div class="dropdown" @click="toggleDropdown">
    <button class="dropdown-toggle">
      {{ selectedOption?.name }}
    </button>
    <ul v-if="isOpen" class="dropdown-menu">
      <li v-for="option in options" :key="option.name" @click="selectOption(option)" class="dropdown-item">
        {{ option.name }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'Dropdown',
  props: {
    list: Array
  },
  data() {
    return {
      isOpen: false,
      selectedOption: null,
      options: this.list
    };
  },
  mounted() {
    this.selectedOption = this.options? this.options[0]: null;
    document.addEventListener('click', this.handleClickOutside);
  },
  beforeDestroy() {
    document.removeEventListener('click', this.handleClickOutside);
  },
  methods: {
    handleClickOutside(event) {
      if (!this.$el.contains(event.target)) {
        this.isOpen = false;
      }
    },
    toggleDropdown() {
      this.isOpen = !this.isOpen;
    },
    selectOption(option) {
      this.selectedOption = option;
      this.$emit('updateSelectPlace', option)
      this.isOpen = false;
    }
  }
};
</script>

<style scoped>
.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown button {
  width: 160px;
  height: 40px;
  line-height: 20px;
}

.dropdown-toggle {
  background-color: #3498db;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 0 5px 5px 0;
  cursor: pointer;
  font-size: 16px;
}

.dropdown-toggle:hover {
  background-color: #2980b9;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 5px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  z-index: 1;
  min-width: 160px;
  padding: 10px 0;
  margin: 5px 0 0 0;
  list-style-type: none;
  max-height: 500px;
  overflow-y: auto;
}

.dropdown-item {
  padding: 10px 20px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.dropdown-item:hover {
  background-color: #f1f1f1;
}

.dropdown-item:active {
  background-color: #3498db;
  color: white;
}

@media (max-width: 768px) {
  .dropdown-toggle {
    border-radius: 0 0 5px 5px;
  }
}
</style>