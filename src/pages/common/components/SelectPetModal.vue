<script setup>
import { ref } from "vue";

const props = defineProps({
  onClose: Function,
  onSelect: Function,
  fromSchedule: Boolean,
});

const emit = defineEmits(["update:selectedPet"]);

const pets = ref([
  { imageUrl: "/src/assets/images/dog1.png", name: "봄" },
  { imageUrl: "/src/assets/images/dog2.jpeg", name: "구름" },
  { imageUrl: "/src/assets/images/cat1.jpg", name: "솜" },
  { imageUrl: "/src/assets/images/cat2.jpg", name: "빙봉" },
]);

const selectPet = (pet) => {
  props.onSelect(pet);
  props.onClose();
};
</script>

<template>
  <div class="modal_overlay">
    <div class="modal_content" @click.stop="handleModalContentClick">
      <div class="modal_title">
        <h2>반려동물 선택</h2>
        <img class="close_btn" src="/src/assets/icons/cancel.png" alt="close" @click="props.onClose()" />
      </div>

      <v-divider class="line"></v-divider>
      <div class="modal_body">
        <ul class="pet_list">
          <li class="pet_box" v-if="props.fromSchedule" @click="selectPet({})">
            <div class="profile_box">
              <span>전체</span>
            </div>
          </li>
          <li v-for="pet in pets" class="pet_box" :key="pet.name" @click="selectPet(pet)">
            <div class="profile_box">
              <img :src="pet.imageUrl" alt="option.name" class="profile_img" />
              <span>{{ pet.name }}</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal_overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal_content {
  background-color: var(--background-color);
  padding: 28px 31px;
  width: 524px;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
}

.modal_title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 5px;
}

.modal_title > h2 {
  font-size: 23px;
  font-family: Cafe24Ssurround;
}

.close_btn {
  width: 25px;
  height: 25px;
  cursor: pointer;
}

.line {
  margin: 4px 0;
}

.modal_body {
  height: 300px;
  overflow-y: auto;
}

.pet_list {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.pet_box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 25px;
  border-radius: 16px;
  cursor: pointer;
}

.pet_box:first-child {
  height: 64px;
}

.pet_box:hover {
  background-color: var(--gray300);
}

.profile_box {
  display: flex;
  align-items: center;
  gap: 15px;
}

.profile_img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
}

.profile_box > span {
  font-size: 18px;
  font-family: Cafe24Ssurround;
  line-height: normal;
}
</style>
