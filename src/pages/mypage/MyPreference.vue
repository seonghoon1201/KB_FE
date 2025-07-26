<template>
    <div class="m-4 p-2 mt-16 w-full text-left space-y-6 mx-auto px-6">
        <BackHeader title="나의 선호 정보" />

        <h2 class="text-xl font-bold mb-4">나의 선호 정보</h2>

        <div>
            <p class="text-gray-500 text-sm mb-1">선호 지역</p>
            <p class="text-base font-medium">{{ preference.city }} {{ preference.region }}</p>
        </div>

        <div>
            <p class="text-gray-500 text-sm mb-1">선호 평수</p>
            <p class="text-base font-medium">{{ preference.area }}</p>
        </div>

        <div>
            <p class="text-gray-500 text-sm mb-1">희망 가격대</p>
            <p class="text-base font-medium">
                {{ preference.minPrice.toLocaleString() }}만 원 이상
                {{ preference.maxPrice.toLocaleString() }}만 원 이하
            </p>
        </div>

        <div>
            <p class="text-gray-500 text-sm mb-1">주택 유형</p>
            <p class="text-base font-medium">{{ preference.types.join(', ') }}</p>
        </div>

        <div class="mt-10 flex justify-end">
            <PrimaryButton @click="goToEdit">수정하기</PrimaryButton>
        </div>
    </div>
</template>

<script setup>
import PrimaryButton from '@/components/common/PrimaryButton.vue'
import BackHeader from '@/components/common/BackHeader.vue'
import { useRouter } from 'vue-router'
import { reactive } from 'vue'

const router = useRouter()

const preference = reactive({
    city: '서울특별시',
    region: '강남구',
    area: '60㎡ 초과 ~ 85㎡ 이하',
    minPrice: 40000,
    maxPrice: 100000,
    types: ['아파트', '오피스텔'],
})

const goToEdit = () => {
    router.push('/preference') // 예: 선호 수정 페이지로 이동
}
</script>
