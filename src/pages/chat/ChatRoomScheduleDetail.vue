<template>
  <div class="chatroom-info-container">
    <div class="info-header">
      <div class="back-wrapper">
        <img class="back-icon" src="../../assets/images/arrow.svg" @click="goBack" />
        <!-- <button class="back-button" >뒤로</button> -->
      </div>

      <span class="room-title">서울숲에서 같이 멍멍이 산책시킬 사람 !!</span>
    </div>

    <!-- 왼쪽 화살표 -->
    <div class="schedule-back">
      <img src="../../assets/images/arrow.svg" alt="뒤로가기" />
    </div>

    <!-- 컨텐츠 카드 (참여자 정보 포함) -->
    <div class="schedule-content-card">
      <!-- 일정 정보 -->
      <div class="schedule-info">
        <h2 class="schedule-title">
          {{ chatStore.ChatRoomScheculeDetail.title }}
        </h2>
        <div class="schedule-row">
          <span class="label">시간</span>
          <span class="value">{{ chatStore.ChatRoomScheculeDetail.time }}</span>
        </div>
        <div class="schedule-row">
          <span class="label">장소</span>
          <span class="value">{{ chatStore.ChatRoomScheculeDetail.place }}</span>
        </div>
        <div class="schedule-row">
          <span class="label">메모</span>
          <div class="memo-box">
            {{ chatStore.ChatRoomScheculeDetail.memo }}
          </div>
        </div>
      </div>

      <!-- 참여자 정보 (읽기용) -->
      <div class="scrollable participant-section">
        <div class="participant-title">참여자</div>
        <div class="participant-box">
          <div
            class="participant-name"
            v-for="chatRoomUser in chatStore.ChatRoomScheculeDetail.participants"
          >
            {{ chatRoomUser.userName }}
          </div>
        </div>
      </div>
    </div>

    <!-- ✅ 전체를 하나의 div로 감싸고 v-if를 적용 -->
    <div v-if="!chatStore.isParticipating">
      <div class="participant-title">참여 동물 선택</div>

      <div class="scrollable animal-select-card">
        <label
          class="participant-item"
          v-for="pet in chatStore.ChatRoomScheculeDetail.pets"
          :key="pet.idx"
        >
          <input type="checkbox" :value="pet.idx" v-model="selectedAnimals" />
          <span class="checkmark"></span>
          <span class="participant-name">{{ pet.petName }}</span>
        </label>
      </div>

      <div class="modal-actions">
        <button class="cancel-button" @click="goBack">취소</button>
        <button class="confirm-button" @click="goComplete">참여</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useChatStore } from "../../stores/useChatStore.js";
const chatStore = useChatStore();
const route = useRoute();
const router = useRouter();
const chatroomIdx = route.params.chatroomIdx;
const scheduleIdx = route.params.scheduleIdx;
const selectedAnimals = ref([]);
watch(selectedAnimals, (newVal) => {
  console.log("선택된 idx 배열:", newVal);
});
// 뒤로 가기
const goBack = () => {
  router.go(-1); // 또는 window.history.back()
};

const goComplete = async () => {
  if (selectedAnimals.value.length === 0) {
    alert("참여할 반려동물을 선택해주세요!");
    return;
  }

  try {
    await chatStore.submitScheduleParticipation(chatroomIdx, scheduleIdx, selectedAnimals.value);
    router.push(`/chatroom/${chatroomIdx}/chatroom-schedule`);
  } catch (e) {
    alert("참여 중 문제가 발생했습니다. 다시 시도해주세요.");
  }
};

onMounted(async () => {
  await Promise.all([
    // chatStore.getUserPets(),
    // chatStore.fetchUsers(chatroomIdx),
    chatStore.getChatroomScheduleDetail(chatroomIdx, scheduleIdx),
    // chatStore.getMyInfo(),
  ]);

  console.log(chatStore.ChatRoomScheculeDetail.isParticipating);
});
</script>

<style scoped>
@import "./chat-base.css";
.schedule-back {
  position: absolute;
  left: -40px;
  top: 8px;
}

.schedule-content-card {
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  padding: 32px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 32px;
  width: 80%;
  align-self: center;
  max-height: 720px;
}

.schedule-info {
  display: flex;
  flex-direction: column;
  gap: 24px; /* 각 row 사이 간격 */
  padding: 0; /* 상하 여백 필요시 조절 가능 */
}

.schedule-title {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 8px;
  color: #000;
}

.schedule-row {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.label {
  font-size: 13px;
  font-weight: 400;
  color: #888; /* 연한 회색 텍스트 */
}

.value {
  color: var(--gray900, #080606);
  font-feature-settings: "liga" off, "clig" off;
  font-family: Inter;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  letter-spacing: 0.46px;
}

.memo-box {
  background-color: #f5f5f5;
  padding: 16px;
  border-radius: 8px;
  font-size: 14px;
  color: #333;
  line-height: 1.5;
  border: 1px solid #e0e0e0;
}

.participant-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 200px; /* ✅ 필수 */
}

.participant-title {
  font-weight: bold;
  font-size: 14px;
  color: #000;
}

.participant-box {
  border: 1px solid #aaa;
  border-radius: 8px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: #fff;
}

.participant-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  cursor: pointer;
  user-select: none;
}

.submit-button {
  align-self: center;
  padding: 8px 16px;
  background-color: #aaa;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}

/* ✅ 기본 체크박스 숨기기 */
.participant-item input[type="checkbox"] {
  display: none;
}

/* ✅ 커스텀 체크박스 박스 */
.checkmark {
  width: 18px;
  height: 18px;
  border: 2px solid #6a0104;
  border-radius: 4px;
  background-color: #fff;
  position: relative;
  box-sizing: border-box;
}

/* ✅ 체크되었을 때 */
.participant-item input[type="checkbox"]:checked + .checkmark {
  background-image: url("../../assets/images/material-symbols_check-rounded.svg");
  background-repeat: no-repeat;
  background-position: center;
  background-size: 12px 12px;
  border-color: #6a0104;
}

/* ✅ 텍스트 */
.participant-name {
  color: #000;
  font-family: "Noto Sans Kannada UI";
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
}

.animal-select-card {
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 24px;
  background-color: #fff;
  margin-top: 16px;
  display: flex; /* ✅ 추가 */
  flex-direction: column; /* ✅ 세로 나열 */
  gap: 30px;
  width: 100%;
  max-width: 500px; /* 가로 더 넓게 */
  min-height: 150px; /* 세로 최소 높이 설정 */
  margin-left: auto;
  margin-right: auto;
}

.modal-actions {
  margin-top: 24px; /* ✅ 위에 공간 확보 */
  display: flex;
  justify-content: center;
  gap: 12px;
}
</style>
