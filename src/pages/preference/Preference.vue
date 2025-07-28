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
                >선호 평수 (복수 선택 가능)</label
            >
            <div class="grid grid-cols-3 gap-2 text-sm">
                <button
                    v-for="option in areaOptions"
                    :key="option.value"
                    @click="toggleArea(option.value)"
                    :class="[
                        'px-3 py-2 rounded-full border',
                        selectedAreas.includes(option.value)
                            ? 'bg-primary text-white'
                            : 'bg-white text-gray-600',
                    ]"
                >
                    {{ option.label }}
                </button>
            </div>
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
            <label class="text-sm font-semibold text-gray-800 block mb-2"
                >주택 유형 (복수 선택 가능)</label
            >
            <div class="grid grid-cols-3 gap-2 text-sm">
                <button
                    v-for="type in houseTypes"
                    :key="type"
                    @click="toggleType(type)"
                    :class="[
                        'px-3 py-2 rounded-full border',
                        selectedTypes.includes(type)
                            ? 'bg-primary text-white'
                            : 'bg-white text-gray-600',
                    ]"
                >
                    {{ type }}
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
import { districts } from '@/data/districts'
import { areaOptions } from '@/data/area'

const router = useRouter()
const preferenceStore = usePreferenceStore()

const cities = Object.keys(districts)

const selectedCity = ref('')
const selectedDistrict = ref('')
const selectedRegions = ref([])
const filteredDistricts = computed(() => districts[selectedCity.value] || [])
const showRegionError = ref(false)

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

const selectedAreas = ref([])
const toggleArea = (val) => {
    const exists = selectedAreas.value.includes(val)
    if (exists) {
        selectedAreas.value = selectedAreas.value.filter((a) => a !== val)
    } else {
        selectedAreas.value.push(val)
    }
}

const expandAreaRanges = (ranges) => {
    return ranges.map((val) => Number(val))
}

const priceMin = ref(null)
const priceMax = ref(null)

const houseTypes = ['아파트', '오피스텔', '도시형 생활주택']
const selectedTypes = ref([])
const toggleType = (type) => {
    if (selectedTypes.value.includes(type)) {
        selectedTypes.value = selectedTypes.value.filter((v) => v !== type)
    } else {
        selectedTypes.value.push(type)
    }
}

const onSubmit = () => {
    if (selectedRegions.value.length === 0) {
        showRegionError.value = true
        return
    }

    showRegionError.value = false

    const expandedSizes = expandAreaRanges(selectedAreas.value)
    const region = selectedRegions.value[0]

    // ✅ 디폴트 보정
    const finalAreas = expandedSizes.length > 0 ? expandedSizes : [] // 선택 없으면 전체
    const finalPriceRange =
        priceMin.value || priceMax.value ? [priceMin.value, priceMax.value] : [null, null]
    const finalTypes = selectedTypes.value.length > 0 ? selectedTypes.value : [] // 전체 포함

    preferenceStore.setPreference({
        city: region.city,
        district: region.district,
        areas: finalAreas,
        priceRange: finalPriceRange,
        types: finalTypes,
    })

    alert('설정이 저장되었습니다.')
    router.push('/')
}
</script>

<style scoped>
.bg-primary {
    @apply bg-[#5A78FF];
}
</style>
