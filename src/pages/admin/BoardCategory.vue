<template>
  <div class="record-manager">
    <div class="main-content">
      <div class="header">
        <h1>게시판 카테고리</h1>
        <button class="create-button" @click="showCreateModal = true">
          <span class="plus-icon">+</span>
          만들기
        </button>
      </div>

      <div class="category-list">
        <CategoryItem
          v-for="(category, index) in categories"
          :key="index"
          :category="category"
          :index="index"
          @edit="editCategory"
          @delete="deleteCategory"
        />
      </div>
    </div>

    <div v-if="showCreateModal" class="modal-overlay">
      <div class="modal">
        <h2>새 카테고리 만들기</h2>
        <div class="form-group">
          <label for="categoryName">카테고리 이름</label>
          <input type="text" id="categoryName" v-model="newCategory.name" placeholder="카테고리 이름을 입력하세요" />
        </div>
        <div class="modal-actions">
          <button class="cancel-button" @click="showCreateModal = false">취소</button>
          <button class="save-button" @click="createCategory">저장</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useCategoryStore } from '../../stores/useCategoryStore.js'
import { useRouter } from 'vue-router'
import { ref, computed } from 'vue'
import CategoryItem from './components/CategoryItem.vue'

export default {
  name: 'BoardCategoryManager',
  components: {
    CategoryItem
  },
  setup() {
    const store = useCategoryStore()
    const router = useRouter()

    const showCreateModal = ref(false)
    const newCategory = ref({
      name: ''
    })

    const categories = computed(() => store.boardCategories)

    const createCategory = async () => {
      if (newCategory.value.name.trim()) {
        await store.addCategory('BOARD_CATEGORY', { ...newCategory.value })
        showCreateModal.value = false
        newCategory.value = { name: '' }
      }
    }

    const editCategory = (index) => {
      const category = store.boardCategories[index]
      router.push({
        path: '/admin/category/board/fix',
        query: {
          name: category.name
        }
      })
    }

    const deleteCategory = async (index) => {
      const category = store.boardCategories[index]
      if (confirm(`${category.name} 카테고리를 삭제하시겠습니까?`)) {
        await store.deleteCategory('BOARD_CATEGORY', category)
      }
    }

    return {
      categories,
      showCreateModal,
      newCategory,
      createCategory,
      editCategory,
      deleteCategory
    }
  }
}
</script>

<style scoped>
.record-manager {
  display: flex;
  min-height: 100vh;
  font-family: 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif;
}

.main-content {
  flex: 1;
  padding: 20px;
  background-color: #f9f9f9;
  max-width: 700px; 
  margin-left: 100px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

h1 {
  font-size: 20px;
  font-weight: 600;
  margin: 0;
}

.create-button {
  display: flex;
  align-items: center;
  background-color: white;
  border: 1px solid #eaeaea;
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.create-button:hover {
  background-color: #f5f5f5;
}

.plus-icon {
  margin-right: 4px;
  font-size: 16px;
}

.category-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* 모달 스타일 */
.modal-overlay {
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

.modal {
  background-color: white;
  border-radius: 8px;
  padding: 24px;
  width: 400px;
  max-width: 90%;
}

h2 {
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 18px;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
}

input {
  width: 100%;
  padding: 10px;
  border: 1px solid #eaeaea;
  border-radius: 4px;
  font-size: 14px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 24px;
}

.cancel-button {
  padding: 8px 16px;
  background-color: white;
  border: 1px solid #eaeaea;
  border-radius: 4px;
  cursor: pointer;
}

.save-button {
  padding: 8px 16px;
  background-color: #2196f3;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.save-button:hover {
  background-color: #1976d2;
}
</style>
