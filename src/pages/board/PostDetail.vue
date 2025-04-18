<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBoardStore } from '/src/stores/useBoardStore'
import { useCommentStore } from '/src/stores/useCommentStore'
import { useUserStore } from '/src/stores/useUserStore'
import CommentCard from './components/CommentCard.vue'

const route = useRoute()
const router = useRouter()
const boardStore = useBoardStore()
const commentStore = useCommentStore()
const userStore = useUserStore()

const postIdx = Number(route.params.idx)
const boardType = route.params.boardType
const post = ref(null)

const isOwner = computed(() =>
  userStore.nickname &&
  post.value?.writer &&
  userStore.nickname === post.value.writer
)

onMounted(async () => {
  post.value = await boardStore.getPostDetail(postIdx)
  await commentStore.fetchComments(postIdx)
})

const goToModify = () => {
  router.push({
    path: `/board/${boardType}/post/${postIdx}/modify`,
    state: { post: post.value }
  })
}

const handleDelete = async () => {
  const confirmed = window.confirm('정말로 삭제하시겠습니까?')
  if (!confirmed) return
  try {
    await boardStore.deletePost(postIdx)
    alert('삭제되었습니다')
    router.push(`/board/${boardType}`)
  } catch (e) {
    alert('삭제 중 오류가 발생했습니다')
  }
}

const newComment = ref('')
const addComment = async () => {
  if (!newComment.value.trim()) return
  await commentStore.addComment({
    postIdx: postIdx,
    userIdx: userStore.userIdx,
    writer: userStore.nickname,
    text: newComment.value
  })
  newComment.value = ''
}
</script>

<template>
  <div v-if="post" class="wrapper">
    <div class="post_box">
      <div class="post_title">
        <span class="text">{{ post.title }}</span>
      </div>

      <div class="user_info_line">
        <div class="user_info">
          <img class="profile_img" :src="post.profileImageUrl || '/src/assets/images/default.png'" alt="프로필 이미지" />

          <span class="nickname">{{ post.writer }}</span>
          <span class="divider">ㅣ</span>
          <span class="date">{{ post.createdAt }}</span>
        </div>

        <div class="icons" v-if="isOwner">
          <img src="/src/assets/icons/write.png" class="icon_btn" alt="수정 아이콘" @click="goToModify" />
          <img src="/src/assets/icons/x-button.png" class="icon_btn" alt="삭제 아이콘" @click="handleDelete" />
        </div>
      </div>

      <hr class="divider_line" />

      <div class="content_area">
  <div v-if="post.imageUrls && post.imageUrls.length > 0">
    <img
      v-for="(img, i) in post.imageUrls"
      :key="i"
      :src="img"
      class="dog_img"
      alt="게시글 이미지"
    />
  </div>
  <p class="description">{{ post.content || '게시글 내용이 없습니다.' }}</p>
</div>

    </div>
  </div>

  <div class="comment_section">
    <label class="comment_label">
      <img class="label_icon" src="/src/assets/icons/write-letter.png" alt="댓글 아이콘" />
      댓글
    </label>

    <div class="input_area">
      <input
        type="text"
        class="comment_input"
        placeholder="댓글을 작성해주세요."
        v-model="newComment"
        :disabled="!userStore.isLogin"
      />
      <button class="submit_btn" @click="addComment" :disabled="!userStore.isLogin">등록</button>
    </div>

    <CommentCard
      v-for="comment in commentStore.comments"
      :key="comment.idx"
      :comment="comment"
      :post-idx="postIdx"
      :current-user-idx="userStore.idx"
    />
  </div>
</template>


<style scoped>
.wrapper {
  max-width: 1000px;
  margin: 0 auto; 
  padding: 20px;
  background: #fff;
}

.post_box {
  position: relative;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 40px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}

.post_title {
  display: flex;
  align-items: center;
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 16px;
}

.dog_img {
  width: 100%;
  max-width: 260px;
  border-radius: 8px;
  margin-bottom: 16px;
}
.user_info_line {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.user_info {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #444;
}

.profile_img,
.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  margin-right: 10px;
}

.nickname {
  font-weight: 600;
  color: #333;
}

.date {
  color: #888;
  font-size: 13px;
}

.divider {
  margin: 0 6px;
  color: #999;
}

.icons {
  display: flex;
  gap: 15px;
}

.icon_btn {
  width: 16px;
  height: 16px;
  margin-left: 8px;
  cursor: pointer;
}

.divider_line {
  border-top: 1px solid #e0e0e0;
  margin: 10px 0 20px;
}

.content_area {
  margin-bottom: 20px;
}

.dog_img {
  width: 260px;
  border-radius: 6px;
  margin-bottom: 12px;
}

.description {
  font-size: 16px;
  line-height: 1.6;
  margin-bottom: 10px;
}

.comment_section {
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

.comment_label {
  display: block;
  font-weight: bold;
  margin-bottom: 30px;
}

.input_area {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
}

.comment_input {
  flex: 1;
  padding: 12px 20px;
  border: 1px solid #ddd;
  border-radius: 999px;
  font-size: 14px;
  outline: none;
}

.submit_btn {
  margin-left: 10px;
  background: #6A0104;
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
}

.submit_btn:hover {
  background: #800000;
}

.comment_card {
  background: #f1f1f1;
  padding: 16px;
  border-radius: 20px;
  margin-bottom: 16px;
}

.comment_header {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  font-size: 14px;
  color: #333;
}

.comment_text {
  font-size: 15px;
  color: #222;
  line-height: 1.5;
}

.label_icon {
  width: 35px;
  height: 35px;
  margin-left: 3px;
  vertical-align: middle;
}

.edit_input {
  width: 100%;
  padding: 14px 16px;
  font-size: 15px;
  border-radius: 6px;
  border: 1px solid #ccc;
  margin-top: 6px;
  box-sizing: border-box;
}

.edit_buttons {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-bottom: 6px;
}

.edit_save,
.edit_cancel {
  font-size: 14px;
  font-weight: bold;
  color: #6c7dc6;
  cursor: pointer;
}
</style>