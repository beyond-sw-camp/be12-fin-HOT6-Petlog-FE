<script setup>
import { watch, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useScheduleStore } from "../../../stores/useScheduleStore";
import { formatTimeRange, formatToMonthDay, formatDateTime } from "../../../utils/dateFormat";
import DeleteModal from "../../common/components/DeleteModal.vue";
import EditItem from "./EditItem.vue";

const route = useRoute();
const router = useRouter();
const scheduleStore = useScheduleStore();

const item = ref(null);

const isEditMode = ref(false);
const isDeleteModalOpen = ref(false);
const isLoading = ref(true);

const handleBackClick = () => {
  router.push("/schedule/detail");
};

const handleEditClick = () => {
  isEditMode.value = true;
};

const handleDeleteClick = () => {
  isDeleteModalOpen.value = true;
};

const onCloseEditMode = () => {
  isEditMode.value = false;
};
const onCloseModal = () => {
  isDeleteModalOpen.value = false;
};

const handlePlaceClick = () => {
  window.open(`http://place.map.kakao.com/${item.value.placeId}`, "_blank");
};

const fetchScheduleDetail = async () => {
  const result = await scheduleStore.getScheduleDetail(route.params?.id);

  if (result.isSuccess) {
    item.value = result.result;
    console.log(item);
  }

  isLoading.value = false;
};

onMounted(fetchScheduleDetail);

watch(
  () => route.params.id,
  () => {
    fetchScheduleDetail();
  }
);
</script>

<template>
  <EditItem v-if="isEditMode && item" :item="item" :onClose="onCloseEditMode" />
  <div v-else>
    <button class="back_btn" @click="handleBackClick">
      <img src="/src/assets/icons/arrow_left.svg" alt="back" class="back_img" />
      <span>목록으로</span>
    </button>

    <div v-if="item" class="detail_box">
      <div class="detail_header">
        <div class="category_box">
          <div class="color_circle" :style="{ backgroundColor: item.color }"></div>
          {{ item.categoryName }}
        </div>
        <div>
          <img src="/src/assets/icons/share.svg" alt="share" class="header_icon" />
          <img
            @click="handleEditClick"
            src="/src/assets/icons/edit.svg"
            alt="edit"
            class="header_icon"
          />
          <img
            @click="handleDeleteClick"
            src="/src/assets/icons/delete.svg"
            alt="delete"
            class="header_icon"
          />
        </div>
      </div>
      <h2 class="title">{{ item.title }}</h2>
      <div class="content_box">
        <p>시간</p>
        <div>
          {{
            item.endAt ? formatTimeRange(item.startAt, item.endAt) : formatDateTime(item.startAt)
          }}
        </div>
      </div>
      <div v-if="item.placeName" class="content_box">
        <p>장소</p>
        <div class="place_box" @click="handlePlaceClick">
          <img src="/src/assets/icons/place.svg" alt="place" />
          {{ item.placeName }}
        </div>
      </div>
      <div class="content_box">
        <p>메모</p>
        <div class="memo_box">{{ item.memo }}</div>
      </div>
      <div v-if="item.recurring" class="content_box">
        <p>반복</p>
        <span>{{ item.repeatCount + item.repeatCycle }}마다 반복</span>
        <p class="repeat_end">반복 종료</p>
        <span>{{ formatToMonthDay(item.repeatEndAt) }}</span>
      </div>
    </div>
  </div>

  <DeleteModal v-if="isDeleteModalOpen" :onClose="onCloseModal" :item="item" />
</template>

<style scoped>
.back_btn {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  margin-bottom: 15px;
}

.back_img {
  width: 17px;
  height: 17px;
}

.back_btn > span {
  font-size: 14px;
}

.detail_box {
  display: flex;
  flex-direction: column;
  gap: 23px;
  border-radius: 16px;
  background: #fff;
  box-shadow: 2px 2px 3px 0px rgba(0, 0, 0, 0.15);
  padding: 20px 30px 30px;
}

.detail_header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detail_header > div {
  display: flex;
  align-items: center;
  gap: 5px;
}

.header_icon {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.category_box {
  font-size: 14px;
}

.color_circle {
  width: 9px;
  height: 9px;
  border-radius: 99px;
}

.title {
  font-size: 18px;
  font-weight: bold;
}

.content_box > p {
  font-size: 12px;
  color: var(--gray600);
  margin-bottom: 7px;
}

.place_box {
  width: fit-content;
  display: flex;
  align-items: center;
  gap: 3px;
  white-space: nowrap;
  border: 1px solid var(--gray400);
  border-radius: 8px;
  padding: 7px 15px 7px 10px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 14px;
}

.place_box:hover {
  background-color: var(--gray200);
}

.memo_box {
  border-radius: 8px;
  padding: 14px 16px;
  background-color: var(--gray100);
  font-size: 14px;
  min-height: 96px;
}

.v_switch {
  height: 60px;
}

.repeat_end {
  margin-top: 23px;
}
</style>
