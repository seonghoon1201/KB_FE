<template>
    <div class="bg-white min-h-screen px-4 pb-6 pt-[70px]">
        <BackHeader title="선호 설정" />

        <!-- 설명 박스 -->
        <div
            class="bg-[#F6F8FF] text-center p-3 rounded-xl text-sm text-gray-600 mb-6 leading-relaxed"
        >
            <p class="font-semibold text-[#5A78FF]">🎯 맞춤형 추천을 위한 설정</p>
            <p class="mt-1 text-xs">
                선호하는 지역과 평수를 설정하면<br />더 정확한 청약 추천을 받을 수 있어요.
            </p>
        </div>

        <!-- 선호 지역 -->
        <div class="mb-5">
            <label class="text-sm font-semibold text-gray-800 mb-1 block">
                선호 지역 (복수 선택 가능)
                <span class="text-red-500">*</span>
                <span class="text-xs text-red-500">(필수)</span>
            </label>
            <div class="space-y-2">
                <select v-model="selectedCity" class="w-full border rounded px-3 py-2 text-sm">
                    <option disabled value="">시/도를 선택해주세요</option>
                    <option v-for="city in cities" :key="city">{{ city }}</option>
                </select>
                <!-- 군/구 선택 -->
                <select
                    v-model="selectedDistrict"
                    class="w-full border rounded px-3 py-2 text-sm"
                    @change="addSelectedRegion"
                >
                    <option disabled value="">군/구를 선택해주세요</option>
                    <option value="전체">전체</option>
                    <option v-for="gu in filteredDistricts" :key="gu" :value="gu">{{ gu }}</option>
                </select>
            </div>

            <!-- 선택된 지역 목록 -->
            <div v-if="selectedRegions.length > 0" class="mt-3 flex flex-wrap gap-2 text-xs">
                <div
                    v-for="(region, index) in selectedRegions"
                    :key="index"
                    class="flex items-center bg-[#E8EAFE] text-[#5A78FF] px-2 py-1 rounded-full"
                >
                    <span>{{ region.city }} {{ region.district }}</span>
                    <button
                        @click="removeSelectedRegion(index)"
                        class="ml-1 text-[#5A78FF] font-bold"
                    >
                        ✕
                    </button>
                </div>
                <span class="text-gray-400 ml-2">{{ selectedRegions.length }}개 선택됨</span>
            </div>

            <!-- ❗ 필수 에러 메시지 -->
            <p v-if="showRegionError" class="text-red-500 text-xs mt-2">
                선호 지역은 반드시 한 곳 이상 선택해야 합니다.
            </p>
        </div>

        <!-- 선호 평수 -->
        <div class="mb-5">
            <label class="text-sm font-semibold text-gray-800 block mb-2"
                >선호 평수 (1개만 선택 가능)
                <span class="text-red-500">*</span>
                <span class="text-xs text-red-500">(필수)</span>
            </label>
            <div class="grid grid-cols-3 gap-2 text-sm">
                <button
                    v-for="option in formattedAreaOptions"
                    :key="option.value"
                    @click="toggleArea(option.value)"
                    :class="[
                        'px-3 py-2 rounded-full border',
                        isSelected(option.value)
                            ? 'bg-primary text-white'
                            : 'bg-white text-gray-600',
                    ]"
                >
                    <span class="block text-center whitespace-pre-line leading-tight">
                        {{ option.labelMultiline }}
                    </span>
                </button>
            </div>
            <!-- ❗ 평수 필수 에러 -->
            <p v-if="showAreaError" class="text-red-500 text-xs mt-2">
                선호 평수는 반드시 선택해야 합니다.
            </p>
        </div>

        <!-- 희망 가격대 -->
        <div class="mb-5">
            <label class="text-sm font-semibold text-gray-800 block mb-2"
                >희망 가격대 (만원 단위)</label
            >
            <div class="flex items-center gap-2">
                <input
                    v-model.number="priceMin"
                    type="number"
                    class="w-full border rounded px-3 py-2 text-sm"
                    placeholder="최소 금액"
                />
                <span class="text-gray-500">~</span>
                <input
                    v-model.number="priceMax"
                    type="number"
                    class="w-full border rounded px-3 py-2 text-sm"
                    placeholder="최대 금액"
                />
            </div>
        </div>

        <!-- 주택 유형 -->
        <div class="mb-6">
            <label class="text-sm font-semibold text-gray-800 block mb-2">
                주택 유형 (복수 선택 가능)
            </label>
            <div class="grid grid-cols-3 gap-2 text-sm">
                <button
                    v-for="type in houseTypes"
                    :key="type.value"
                    @click="toggleType(type.value)"
                    :class="[
                        'px-3 py-2 rounded-full border',
                        selectedTypes.includes(type.value)
                            ? 'bg-primary text-white'
                            : 'bg-white text-gray-600',
                    ]"
                >
                    {{ type.label }}
                </button>
            </div>
        </div>

        <!-- 설정 완료 -->
        <button
            class="w-full bg-primary text-white py-3 rounded text-sm font-semibold"
            @click="onSubmit"
        >
            설정 완료
        </button>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import BackHeader from '@/components/common/BackHeader.vue'
import { usePreferenceStore } from '@/stores/preference'
import { useRecommendationStore } from '@/stores/recommendation'
import { districts } from '@/data/districts'
import { areaOptions } from '@/data/area'
import api from '@/api/axios'

const router = useRouter()
const preferenceStore = usePreferenceStore()
const recommendationStore = useRecommendationStore()

const cities = Object.keys(districts)

const selectedCity = ref('')
const selectedDistrict = ref('')
const selectedRegions = ref([])
const filteredDistricts = computed(() => districts[selectedCity.value] || [])
const showRegionError = ref(false)
const showAreaError = ref(false)

const formattedAreaOptions = computed(() =>
    areaOptions.map((o) => ({
        ...o,
        labelMultiline: o.label.replace(' ', '\n'),
    })),
)

const addSelectedRegion = () => {
    if (!selectedCity.value || !selectedDistrict.value) return

    // 🔹 이미 'OO 전체' 선택된 경우 → 개별 구 추가 X
    const hasCityAll = selectedRegions.value.some(
        (item) => item.city === selectedCity.value && item.district === '전체',
    )
    if (hasCityAll && selectedDistrict.value !== '전체') {
        alert(`이미 ${selectedCity.value} 전체가 선택되어 있어요.`)
        return
    }

    // 🔹 '전체' 선택 시 → 기존 해당 시의 개별 구 모두 제거 후 '전체' 하나만 추가
    if (selectedDistrict.value === '전체') {
        // 기존 같은 시의 개별 구 제거
        selectedRegions.value = selectedRegions.value.filter(
            (item) => item.city !== selectedCity.value,
        )

        // '전체'가 이미 있지 않다면 추가
        const alreadyAll = selectedRegions.value.some(
            (item) => item.city === selectedCity.value && item.district === '전체',
        )
        if (!alreadyAll) {
            selectedRegions.value.push({ city: selectedCity.value, district: '전체' })
        }
    } else {
        // 🔹 개별 구 추가 (단, 같은 시의 전체가 이미 있으면 막음은 위에서 처리)
        const duplicate = selectedRegions.value.some(
            (item) => item.city === selectedCity.value && item.district === selectedDistrict.value,
        )
        if (!duplicate) {
            selectedRegions.value.push({
                city: selectedCity.value,
                district: selectedDistrict.value,
            })
        }
    }

    selectedDistrict.value = ''
}

const removeSelectedRegion = (index) => {
    selectedRegions.value.splice(index, 1)
}

// 단일 선택
const selectedArea = ref(null) // 예: [60, 85] 또는 null
const equalsRange = (a, b) =>
    Array.isArray(a) && Array.isArray(b) && a.length === b.length && a.every((v, i) => v === b[i])
const isSelected = (val) => equalsRange(selectedArea.value, val)
const toggleArea = (val) => {
    // 같은 걸 다시 누르면 해제(원치 않으면 해제 로직 제거)
    selectedArea.value = isSelected(val) ? null : val
}

const priceMin = ref(null)
const priceMax = ref(null)

const houseTypes = [
    { label: '아파트', value: 'APT' },
    { label: '오피스텔', value: '오피스텔' },
]
const selectedTypes = ref([])
const toggleType = (value) => {
    if (selectedTypes.value.includes(value)) {
        selectedTypes.value = selectedTypes.value.filter((v) => v !== value)
    } else {
        selectedTypes.value.push(value)
    }
}

const onSubmit = async () => {
    // 1) 필수: 지역
    if (selectedRegions.value.length === 0) {
        showRegionError.value = true
        return
    }
    showRegionError.value = false

    // 2) 필수: 평수
    if (!Array.isArray(selectedArea.value) || selectedArea.value.length !== 2) {
        showAreaError.value = true
        return
    }
    showAreaError.value = false

    // 3) 희망 가격대 기본값: 0 ~ 1000억 (만원 단위 그대로 전송)
    // int32 안전 범위 내에서 클램프 (최대 2,147,483,647)
    const INT32_MAX = 2_147_483_647
    const DEFAULT_MIN_MANWON = 0
    const DEFAULT_MAX_MANWON = 10_000_000 // 1000억 = 10,000,000 (만원)

    const toSafeInt = (v, fallback = 0) => {
        const n = Number.isFinite(Number(v)) ? Number(v) : fallback
        return Math.max(0, Math.min(n, INT32_MAX))
    }

    const hopeMinMan = toSafeInt(priceMin.value ?? DEFAULT_MIN_MANWON)
    const hopeMaxMan = toSafeInt(priceMax.value ?? DEFAULT_MAX_MANWON)

    // 4) 주택 유형: 미선택이면 둘 다 보냄
    const typesToSend =
        selectedTypes.value.length > 0 ? selectedTypes.value : houseTypes.map((h) => h.value)

    // 5) 지역: '전체'는 gun_gu 생략
    const regionsToSend = selectedRegions.value.map((r) => {
        const obj = { si: r.city }
        if (r.district && r.district !== '전체') obj.gun_gu = r.district
        return obj
    })

    // 6) 페이로드
    const preferenceData = {
        selected_homesize: [
            {
                min_homesize: Number(selectedArea.value[0]),
                max_homesize: Number(selectedArea.value[1]),
            },
        ],
        selected_hometype: typesToSend.map((t) => ({ selected_house_secd: t })),
        selected_region: regionsToSend,
        user_info: {
            hope_min_price: hopeMinMan,
            hope_max_price: hopeMaxMan,
        },
    }

    // 7) 간단 유효성
    if (preferenceData.user_info.hope_min_price > preferenceData.user_info.hope_max_price) {
        alert('희망 가격의 최소값이 최대값보다 큽니다.')
        return
    }

    try {
        await api.post('/user/preferences', preferenceData, {
            headers: { 'Content-Type': 'application/json' },
        })
        // ✅ 전역에 '설정됨' 표시
        // ✅ 전역에 즉시 저장(폼 -> 스토어), persist + local backup
        preferenceStore.setFromClient({
            regions: regionsToSend.map((r) => ({ city: r.si, district: r.gun_gu || '전체' })),
            area: [Number(selectedArea.value[0]), Number(selectedArea.value[1])],
            types: typesToSend,
            priceRange: [hopeMinMan, hopeMaxMan], // 만원 단위
        })
        // ✅ 추천 미리 불러오기(홈 가자마자 로딩 없이 보이도록)
        await recommendationStore.fetch()
        alert('설정이 저장되었습니다.')
        router.push('/home')
    } catch (error) {
        console.error('선호 정보 저장 실패:', error?.response?.data || error)
        alert('저장에 실패했습니다. 다시 시도해주세요.')
    }
}
</script>

<style scoped>
.bg-primary {
    @apply bg-[#5A78FF];
}
</style>
