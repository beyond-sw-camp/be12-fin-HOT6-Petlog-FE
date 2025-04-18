<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const route = useRoute();

const petId = route.params.petId; // 📌 URL에서 petId 추출
let card = ref(null);  // 'let'으로 변경하여 재할당 가능하게 만듦
const profileImage = ref('');

const calculateAge = (birthDate) => {
  const birth = new Date(birthDate);  // birth는 변경되지 않으므로 const로 유지
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();  // age는 let으로 선언하여 변경 가능하게 만듦
  let month = today.getMonth() - birth.getMonth();  // month도 let으로 선언하여 변경 가능하게 만듦
  if (month < 0 || (month === 0 && today.getDate() < birth.getDate())) {
    age--;  // 이제 age를 변경할 수 있음
  }
  return age;  // 정상적으로 age 반환
};

onMounted(async () => {
  try {
    const response = await axios.get(`/api/pet/${petId}`);
    console.log('🐾 상세 정보:', response.data);  // 받은 데이터 출력
    
    // profileImageUrl과 나이 계산 등의 값도 확인하기
    const imageUrl = response.data.profileImageUrl ? `http://localhost:8080${response.data.profileImageUrl}` : "/default-profile.png";

    card.value = {
      name: response.data.name,
      age: calculateAge(response.data.birthDate), 
      breed: response.data.breed,
      gender: response.data.gender,
      birthDate: response.data.birthDate,
      specificInformation: response.data.specificInformation,
      profileImageUrl: imageUrl,
      isNeutering: response.data.isNeutering,
      status: response.data.status
    };

    profileImage.value = response.data.profileImageUrl;
  } catch (e) {
    console.error('🐾 상세 불러오기 실패:', e);
  }
});

// ✅ 수정 이동
const goToEdit = () => {
  router.push(`/mypage/card/change/${petId}`);
};

// ✅ 목록 이동
const goToList = () => {
  router.push('/mypage/cardlist');
};

// ✅ 삭제 요청
const deleteCard = async () => {
  const confirmDelete = window.confirm('정말 삭제하시겠습니까?');
  if (confirmDelete) {
    try {
      // petId를 포함한 DELETE 요청
      await axios.delete(`/api/pet/${petId}`);
      alert('삭제되었습니다.');
      router.push('/mypage/cardlist');  // 삭제 후 이동
    } catch (error) {
      console.error('삭제 실패:', error);
      alert('삭제 중 오류가 발생했습니다.');
    }
  }
};
</script>

<template>
  <div class="card-detail" v-if="card">
    <button @click="goToList" class="back-button">← 목록으로</button>

    <div class="card-container">
      <div class="card-actions">
        <button class="edit-btn" @click="goToEdit">✏️</button>
        <button class="delete-btn" @click="deleteCard">🗑️</button>
      </div>

      <div class="profile-section">
  <img :src="profileImage" alt="프로필 이미지" class="profile-img" />
  <h2 class="name">{{ card.name }}</h2>
  <p class="sub-info">
    <span class="gender" :class="{ male: card.gender === '남' || card.gender === 'male', female: card.gender === '여' || card.gender === 'female' }">
      {{ card.gender === '남' || card.gender === 'male' ? '♂' : '♀' }}
    </span>
  </p>
</div>

      <div class="info-box">
        <p><strong>생일</strong> <span>{{ card.birthDate }}</span></p>
        <p><strong>중성화 여부</strong> 
          <span v-if="card.isNeutering">✅</span>
          <span v-else>❌</span>
        </p>
        <p><strong>나이</strong> <span>{{ card.age }}살</span></p>
        <p><strong>품종</strong> <span>{{ card.breed }}</span></p>
        <p><strong>상태</strong> <span>{{ card.status || '정보 없음' }}</span></p>
        <p class="notes" v-if="card.specificInformation">
          <strong>특이사항</strong>
          <span v-html="card.specificInformation.replace(/\n/g, '<br>')"></span>
        </p>
        <p class="notes" v-else>
          <strong>특이사항</strong>
          <span>없음</span>
        </p>
      </div>
    </div>
  </div>

  <div v-else style="padding: 20px;">
    <p>로딩 중입니다...</p>
  </div>
</template>

<style scoped>
.card-detail {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  padding: 20px;
}

.back-button {
  align-self: flex-start;
  background: none;
  border: none;
  color: #333;
  font-size: 16px;
  cursor: pointer;
  padding: 10px 30px 10px 5px; 
  margin-left: 170px;
}

.card-container {
  position: relative;
  background: #fdf6e3;
  border-radius: 16px;
  padding: 20px;
  width: 400px;
  text-align: center;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
}

.card-actions {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  gap: 8px;
}

.edit-btn, .delete-btn {
  border: none;
  background: none;
  font-size: 18px;
  cursor: pointer;
}

.profile-section {
  text-align: center;
  margin-bottom: 10px;
}

.profile-img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 10px;
}

.name {
  font-size: 22px;
  font-weight: 700;
  margin: 0;
  margin-bottom: 10px;
}

.sub-info {
  font-size: 14px;
  color: #666;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}

.age-circle {
  background-color: #f2b900;
  border-radius: 50%;
  padding: 5px 10px;
  font-weight: bold;
}

.breed {
  font-style: italic;
  color: #444;
}

.gender {
  font-size: 18px;
}

.male {
  color: blue;
}

.female {
  color: red;
}

.info-box {
  background: #f9f9f9;
  border-radius: 10px;
  padding: 15px;
  text-align: left;
  font-size: 14px;
  margin-top: 10px;
}

.info-box p {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 12px 0;
}

.notes {
  align-items: flex-start;
}

.notes span {
  text-align: right;
  white-space: pre-line;
  max-width: 60%;
}
</style>