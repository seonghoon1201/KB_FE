<!-- 기본 버튼 컴포넌트 -->
<template>
  <button
    class="bg-[#00AEFF] text-white font-bold rounded-lg px-6 py-3 text-center"
    @click="button.click"
  >
    {{ button.name }}
  </button>
</template>
<script setup>
import { reactive } from 'vue'

let button = reactive({
  name: 'button name',
  click: () => {
    console.log('button click')
  },
})
</script>
<style></style>
