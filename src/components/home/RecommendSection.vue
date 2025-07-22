<template>
  <div class="bg-white p-4 rounded-xl border">
    <h2 class="text-lg font-bold mb-3">맞춤형 청약 추천</h2>
    <div v-if="isPreferenceSet && recommendList.length > 0">
      <div class="space-y-3">
        <div
          v-for="item in recommendList"
          :key="item.id"
          class="border rounded-lg p-3 flex gap-3 items-center"
        >
          <img :src="`/src/assets/images/${item.image}`" class="w-16 h-16 rounded object-cover" />
          <div>
            <p class="font-semibold">{{ item.name }}</p>
            <p class="text-sm text-gray-500">{{ item.location }}</p>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <p class="text-gray-500 text-sm">선호 지역과 평수를 설정하면 나에게 맞는 아파트를 추천해드려요.</p>
      <button class="mt-3 px-4 py-2 text-sm text-white bg-primary rounded">선호 설정하러 가기</button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  isPreferenceSet: Boolean,
  recommendList: Array
})
</script>
