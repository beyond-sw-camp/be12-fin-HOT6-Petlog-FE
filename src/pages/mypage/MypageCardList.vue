<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';  
import { useMypageCard } from '../../stores/useMypageCard.js';
import { storeToRefs } from 'pinia';
import PetCard from '../../pages/mypage/components/MypagePetCard.vue';

// store에서 pets를 가져오기 위해 store 연결
const store = useMypageCard();
const { fetchPets } = store;
const { pets } = storeToRefs(store); // 반응형 연결

const router = useRouter();

// 세션에서 user 객체를 가져오고, 그 안에서 idx 값을 추출하는 함수
function getSessionUserIdx() {
  const user = sessionStorage.getItem("user"); // 세션 스토리지에서 user 값을 가져옴
  if (user) {
    const parsedUser = JSON.parse(user);
    return parsedUser.idx; // user가 존재하면 그 안에서 idx 값을 반환
  }
  return null; // user가 없다면 null 반환
}

const isLoading = ref(true);  // 로딩 상태 변수

// 반려동물 목록을 해당 userId에 맞게 가져오기
const fetchPetsData = async (userId) => {
  try {
    const response = await axios.get(`/api/pet/user/${userId}`);  // 백엔드 경로와 일치하도록 수정
    pets.value = response.data;  // 응답받은 반려동물 목록을 pets 배열에 저장
    console.log("반려동물 목록:", pets.value);
  } catch (error) {
    console.error("반려동물 목록 조회 실패:", error);
    alert("반려동물 목록을 불러오는 데 실패했습니다.");
  } finally {
    isLoading.value = false;  // 로딩 완료
  }
};

// 사용자 정보 로드 후 반려동물 목록 가져오기
onMounted(() => {
  const userId = getSessionUserIdx(); // 현재 로그인한 유저의 idx를 가져옴
  
  if (!userId) {
    console.error("세션에 유저 정보가 없습니다.");
    alert("로그인 정보가 없습니다.");
    router.push("/user/login");
    return;
  }

  // 반려동물 목록을 해당 userId에 맞게 가져오기
  fetchPetsData(userId); // store에서 fetchPets 메서드를 사용하여 데이터 불러오기
});

const goToCreateCard = () => {
  router.push('/mypage/card/create'); // 반려동물 카드 추가 페이지로 이동
};

const goToDetail = (pet) => {
  router.push(`/mypage/card/detail/${pet.idx}`); // 반려동물 카드 상세 페이지로 이동
};
</script>


<template>
  <div class="container">
    <div class="header">
      <h2 class="title">내 반려동물</h2>
      <button class="add-button" @click="goToCreateCard">➕</button>
    </div>

    <div class="pet-cards" v-if="pets.length">
  <PetCard
    v-for="pet in pets"
    :key="pet.idx"
    :pet="{
      ...pet,
      image: pet.profileImageUrl || '/default-profile.png'
    }"
    @click="() => goToDetail(pet)"
  />
</div>
    <div v-else style="margin-top: 150px;">반려동물이 없습니다.</div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  padding-left: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 1000px;
  margin-bottom: 20px;
  position: absolute;
  top: 0;
}

.title {
  font-size: 32px;
  font-weight: bold;
  margin-left: 70px;
}

.add-button {
  width: 40px;
  height: 40px;
  font-size: 20px;
  background: white;
  border: 2px solid black;
  border-radius: 50%;
  cursor: pointer;
  margin: 0 20px 0 80px; 
}

.pet-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  justify-content: center;
  max-width: 800px;
  margin-top: 50px;
}
</style>
