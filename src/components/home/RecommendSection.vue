<template>
    <div class="bg-white p-4 rounded-xl border shadow-sm">
        <div class="flex justify-between items-center mb-3">
            <h2 class="text-lg font-bold">맞춤형 청약 추천</h2>
            <Cog class="w-4 h-4 text-gray-500 cursor-pointer" @click="goToPreference" />
        </div>

        <!-- ✅ 선호 설정된 경우 -->
        <div v-if="localRecommendList.length > 0" class="space-y-3">
            <!-- <div
        v-for="item in recommendList"
        :key="item.id"
        class="border rounded-lg p-3 flex gap-3 items-center"
      >
        <img
          :src="`/src/assets/images/${item.image}`"
          class="w-16 h-16 rounded object-cover"
        />
        <div>
          <p class="font-semibold">{{ item.name }}</p>
          <p class="text-sm text-gray-500">{{ item.location }}</p>
        </div>
      </div> -->

            <!-- 선호 불러오기 api완성되면 정보 넣기! -->
            <SubscriptionCard
                v-for="item in localRecommendList"
                :key="item.id"
                :subscription="item"
            />
        </div>

        <!-- ❌ 선호 설정 안 된 경우 -->
        <div v-else class="bg-[#FFF7E7] rounded-xl p-4 text-center flex flex-col items-center">
            <Settings class="w-10 h-10 text-gray-500 mb-2" />
            <p class="text-lg font-bold text-gray-800">선호 설정이 필요해요!</p>
            <p class="text-sm text-gray-500 mt-1 leading-relaxed">
                선호하는 지역과 평수를 설정하면<br />
                맞춤형 청약 추천을 받을 수 있어요
            </p>

            <button
                @click="goToPreference"
                class="mt-3 w-full bg-[#F2954B] text-white py-2 text-sm rounded flex justify-center items-center gap-1"
            >
                <Settings class="w-4 h-4" /> 선호 설정하기
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Cog, Settings } from 'lucide-vue-next'
import SubscriptionCard from '../subscription/SubscriptionCard.vue'

const router = useRouter()

const props = defineProps({
  isPreferenceSet: Boolean,
  recommendList: {
    type: Array,
    default: () => [],
  },
})

const dummyData = [
  {
    id: 'dummy1',
    house_nm: '힐스테이트 강남',
    city: '서울특별시',
    district: '강남구',
    pblanc_no: '99990001',
    application_period: '2025.09.01 ~ 2025.09.05',
    house_type: 'APT',
    min_area: '59.00',
    max_area: '84.00',
    min_price: '65000',
    max_price: '85000',
    is_favorite: false,
  },
  {
    id: 'dummy2',
    house_nm: '자이 마포',
    city: '서울특별시',
    district: '마포구',
    pblanc_no: '99990002',
    application_period: '2025.08.10 ~ 2025.08.12',
    house_type: 'APT',
    min_area: '74.00',
    max_area: '101.00',
    min_price: '70000',
    max_price: '90000',
    is_favorite: true,
  },
]

const localRecommendList = ref(
  props.recommendList.length > 0 ? props.recommendList : dummyData
)

watch(
  () => props.recommendList,
  (newVal) => {
    localRecommendList.value = newVal.length > 0 ? newVal : dummyData
  },
  { deep: true }
)

const goToPreference = () => {
  router.push('/preference')
}
</script>