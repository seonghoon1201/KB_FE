<template>
  <MainHeader />
  <BackHeader />
  <PrimaryButton />
  <RouterView />
</template>

<script setup>
import { RouterView } from 'vue-router'
import MainHeader from './components/common/MainHeader.vue'
import BackHeader from './components/common/BackHeader.vue'
import PrimaryButton from './components/common/PrimaryButton.vue'
</script>
