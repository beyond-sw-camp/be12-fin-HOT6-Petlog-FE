<script setup>
import { ref } from 'vue'

const boardTypes = [
  { value: 'free', label: '자유 게시판' },
  { value: 'info', label: '정보 공유' },
  { value: 'promotion', label: '분양 홍보' }
]

const categories = ['강아지', '고양이', '물고기', '햄스터', '도마뱀']

const form = ref({
  boardType: '',
  category: '',
  title: '',
  content: '',
  images: []
})

const previewImages = ref([])

const handleFileChange = (event) => {
  const files = Array.from(event.target.files)
  form.value.images = files

  previewImages.value = []
  files.forEach(file => {
    const reader = new FileReader()
    reader.onload = (e) => {
      previewImages.value.push(e.target.result)
    }
    reader.readAsDataURL(file)
  })
}

const handleCancel = () => {
  form.value = {
    boardType: '',
    category: '',
    title: '',
    content: '',
    images: []
  }
  previewImages.value = []
}

const handleSubmit = () => {
  const payload = {
    ...form.value,
    imageCount: form.value.images.length
  }
}

</script>
<template>
  <div class="container">
    <!-- 게시판 선택 -->
    <div class="board_select">
      <label class="section_title">게시판 선택</label>
      <div class="radio_group">
        <label v-for="item in boardTypes" :key="item.value" class="radio_option">
          <input
            type="radio"
            :value="item.value"
            v-model="form.boardType"
            name="boardType"
          />
          {{ item.label }}
        </label>
      </div>
    </div>

    <!-- 카테고리 선택 -->
    <div class="form_group">
      <label>카테고리</label>
      <select v-model="form.category">
        <option disabled value="">카테고리를 선택하세요.</option>
        <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
      </select>
    </div>

    <!-- 제목 입력 -->
    <div class="form_group">
      <label>제목</label>
      <input type="text" v-model="form.title" placeholder="제목을 입력해주세요." />
    </div>

    <!-- 내용 입력 -->
    <div class="form_group">
      <label>내용</label>
      <textarea v-model="form.content" placeholder="내용을 입력해주세요." rows="8" />
    </div>

    <!-- 이미지 업로드 -->
    <div class="form_group">
      <label>사진 등록</label>
      <input type="file" multiple @change="handleFileChange" />
      <div v-if="previewImages.length > 0" class="image_preview">
        <div v-for="(img, index) in previewImages" :key="index">
          <img :src="img" class="preview" />
        </div>
      </div>
    </div>

    <!-- 버튼 영역 -->
    <div class="actions">
      <button @click="handleCancel" class="cancel">취소</button>
      <button @click="handleSubmit" class="submit">등록</button>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 1200px;
  margin: 40px auto;
  padding: 20px;
  font-family: sans-serif;
}

.section_title {
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 20px;
  display: block;
}

.board_select {
  margin-bottom: 24px;
  border-bottom: 1px solid #ccc;
  padding-bottom: 12px;
}

.radio_group {
  display: flex;
  gap: 20px;
  align-items: center;
}

.radio_option {
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 5px;
}

.form_group {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
}

label {
  font-weight: bold;
  margin-bottom: 8px;
}

input[type="text"],
textarea,
select {
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 4px;
}

input[type="file"] {
  margin-top: 8px;
}

.image_preview {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
}

.preview {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid #ddd;
}

.actions {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 30px;
}

button {
  padding: 10px 20px;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
}

.cancel {
  background-color: white;
  color: #963a3a;
  border: 1px solid #963a3a;
}

.cancel:hover {
  background-color: #963a3a;
  color: white;
}

.submit {
  background-color: #963a3a;
  color: white;
  border: none;
}
</style>
