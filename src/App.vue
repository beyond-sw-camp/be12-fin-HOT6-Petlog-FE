<script setup>
import { RouterView, useRoute } from "vue-router";
import Header from "./pages/common/components/Header.vue";
import admin from "./pages/admin/Admin.vue";
import KakaoMap from "./pages/place/KakaoMap.vue";
import NoticeDropdown from "./pages/common/components/NoticeDropdown.vue";

const route = useRoute();
</script>

<template>
  <Header v-if="!route.path.startsWith('/user')" />
  <router-view></router-view>
</template>

<style scoped></style>
