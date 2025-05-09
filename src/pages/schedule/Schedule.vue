<script setup>
import { onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useScheduleStore } from "../../stores/useScheduleStore";
import SelectPetModal from "../common/components/SelectPetModal.vue";
import Calendar from "./components/Calendar.vue";
import NewScheduleModal from "./components/NewScheduleModal.vue";
import DetailSchedule from "./DetailSchedule.vue";

const isNewScheduleModalOpen = ref(false);
const isPetModalOpen = ref(false);
const isDetailMode = ref(false);
const isLoading = ref(true);

const selectedPet = ref(null);

const scheduleStore = useScheduleStore();
const router = useRouter();
const route = useRoute();

// 경로 감지
watch(
  () => route.path,
  (newPath) => {
    if (newPath.startsWith("/schedule/detail")) {
      isDetailMode.value = true;
    } else if (newPath === "/schedule") {
      isDetailMode.value = false;
    }
  },
  { immediate: true }
);

const fetchSchedule = async () => {
  const isPetSelected = scheduleStore.currentPet?.idx != null;

  const result = isPetSelected
    ? await scheduleStore.getSchedulesByPet(scheduleStore.currentPet.idx)
    : await scheduleStore.getAllSchedule();

  if (result?.isSuccess) {
    isLoading.value = false;
  }
};

const openDetail = () => {
  isDetailMode.value = true;
};

const closeDetail = () => {
  isDetailMode.value = false;
  router.push("/schedule");
};

const openNewScheduleModal = () => {
  isNewScheduleModalOpen.value = true;
};

const openPetModal = () => {
  isPetModalOpen.value = true;
};

const closeNewScheduleModal = () => {
  isNewScheduleModalOpen.value = false;
};

const closePetModal = () => {
  isPetModalOpen.value = false;
  router.push("/schedule");
};

// 펫 변경 함수
const handlePetSelect = (pet) => {
  selectedPet.value = pet;
  scheduleStore.currentPet = pet;
  closePetModal();
};

const handleScheduleCreated = () => {
  fetchSchedule();
};

onMounted(() => {
  fetchSchedule;
  scheduleStore.type = "SCHEDULE";
});

watch(
  () => scheduleStore.currentPet?.idx, // currentPet의 idx만 추적
  () => {
    fetchSchedule(); // 바뀔 때마다 실행됨!
  },
  { immediate: true } // 초기 실행도 포함하고 싶다면 이 옵션!
);
</script>

<template>
  <div class="container" :class="{ detail_container: isDetailMode }">
    <div class="calendar_section" :class="{ detail_calendar: isDetailMode }">
      <div class="title_box">
        <div
          class="profile_img"
          :style="{
            backgroundImage: selectedPet?.profileImageUrl
              ? `url(${selectedPet.profileImageUrl})`
              : `url('/src/assets/images/default_profile.png')`,
          }"
        ></div>

        <p class="title">
          {{
            scheduleStore.currentPet?.idx == null
              ? "내 일정"
              : `${scheduleStore.currentPet.name}의 일정`
          }}
        </p>
        <img
          class="arrow_down"
          src="/src/assets/icons/arrow_down.png"
          alt="아래쪽"
          @click="openPetModal"
        />
      </div>
      <div class="calendar">
        <Calendar v-if="!isLoading" :onOpenModal="openNewScheduleModal" :onDetail="openDetail" />
      </div>

      <!-- 모달 -->
      <NewScheduleModal
        v-if="isNewScheduleModalOpen"
        :onClose="closeNewScheduleModal"
        :selectedPet="selectedPet"
        @schedule-created="handleScheduleCreated"
      />
      <SelectPetModal
        v-if="isPetModalOpen"
        :onClose="closePetModal"
        :onSelect="handlePetSelect"
        :fromSchedule="true"
      />
    </div>
    <div v-if="isDetailMode" class="detail_section">
      <DetailSchedule :onClose="closeDetail" />
    </div>
  </div>
</template>

<style scoped>
/* 스타일 동일 유지 */
.container {
  margin: 50px 20%;
}

.detail_container {
  display: flex;
  margin: 0 0 0 5%;
  gap: 18px;
}

.calendar_section {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.detail_calendar {
  flex-grow: 7;
  flex-basis: 0;
  margin: 50px 0;
}

.detail_section {
  margin: 0;
  flex-grow: 3;
  flex-basis: 0;
  background-color: rgba(244, 238, 231, 0.37);
}

.title_box {
  display: flex;
  align-items: center;
  gap: 15px;
}

.profile_img {
  background-image: url("/src/assets/images/profile_1.jpg");
  width: 58px;
  height: 58px;
  border-radius: 58px;
  box-shadow: 2px 2px 4px 0px rgba(0, 0, 0, 0.25);
  background-repeat: no-repeat;
  background-size: cover;
}

.title {
  font-family: Cafe24Ssurround;
  font-size: 30px;
}

.arrow_down {
  width: 27px;
  height: 27px;
  cursor: pointer;
  border-radius: 16px;
  transition: all 0.3s;
}

.arrow_down:hover {
  background-color: var(--gray300);
}

.top_box {
  width: 100%;
  display: flex;
  justify-content: flex-end;
}

.create_btn {
  border-radius: 8px;
  border: 1px solid var(--gray400);
  background: #fff;
  box-shadow: 2px 2px 2px 0px rgba(0, 0, 0, 0.25);
  padding: 10px;
  display: flex;
  gap: 5px;
  align-items: center;
  transition: all 0.3s;
  cursor: pointer;
}

.create_btn:hover {
  background-color: var(--gray300);
}

.plus_icon {
  width: 12px;
  height: 12px;
}

.calendar {
  width: 100%;
  margin-top: 30px;
}
</style>
