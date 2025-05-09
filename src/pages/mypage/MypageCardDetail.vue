<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { usePetStore } from '../../stores/usePetStore'

const store = usePetStore();
const router = useRouter();
const route = useRoute();

const petId = route.params.petId;
let card = ref(null);
const profileImage = ref('');

const calculateAge = (birthDate) => {
  const birth = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  let month = today.getMonth() - birth.getMonth();
  if (month < 0 || (month === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
};

onMounted(async () => {
  try {
    const data = await store.fetchPetById(petId);

    const imageUrl = data.profileImageUrl
      ? data.profileImageUrl.startsWith('http')
        ? data.profileImageUrl
        : `http://localhost:8080${data.profileImageUrl}`
      : '/default-profile.png';

    card.value = {
      name: data.name,
      age: calculateAge(data.birthDate),
      breed: data.breed,
      gender: data.gender,
      birthDate: data.birthDate,
      specificInformation: data.specificInformation,
      profileImageUrl: imageUrl,
      isNeutering: data.isNeutering,
      status: data.status
    };

    profileImage.value = imageUrl;
  } catch (e) {
    console.error('🐾 상세 불러오기 실패:', e);
  }
});


const goToEdit = () => {
  router.push(`/mypage/card/change/${petId}`);
};

const goToList = () => {
  router.push('/mypage/cardlist');
};

const deleteCard = async () => {
  const confirmDelete = window.confirm('정말 삭제하시겠습니까?');
  if (confirmDelete) {
    try {
      await store.deletePet(petId); // ✅ store 사용
      alert('삭제되었습니다.');
      router.push('/mypage/cardlist');
    } catch (error) {
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