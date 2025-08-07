<!-- components/FilterModal.vue -->
<template>
    <div
        v-if="props.visible"
        class="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-end justify-center"
        @click.self="close"
    >
        <div class="w-full bg-white rounded-t-xl p-4 max-h-[90vh] overflow-y-auto">
            <h2 class="text-lg font-semibold text-gray-800 mb-4">필터 설정</h2>

            <!-- 지역 선택 -->
            <label class="text-sm font-semibold text-gray-800 mb-1 block">지역</label>
            <div class="space-y-2 mb-3">
                <!-- 시/도 선택 -->
                <select
                    :value="props.selectedCity"
                    @change="
                        (e) => emit('update', { field: 'selectedCity', value: e.target.value })
                    "
                    class="w-full border rounded px-3 py-2 text-sm"
                >
                    <option disabled value="">시/도를 선택해주세요</option>
                    <option v-for="city in cities" :key="city">{{ city }}</option>
                </select>

                <!-- 군/구 선택 -->
                <select
                    :value="props.selectedDistrict"
                    @change="handleDistrictChange"
                    class="w-full border rounded px-3 py-2 text-sm"
                >
                    <option disabled value="">군/구를 선택해주세요</option>
                    <option value="__all__">전체</option>
                    <option v-for="gu in filteredDistricts" :key="gu">{{ gu }}</option>
                </select>
            </div>

            <div v-if="selectedRegions.length" class="flex flex-wrap gap-2 text-xs mb-3">
                <div
                    v-for="(region, index) in selectedRegions"
                    :key="index"
                    class="flex items-center bg-[#E8EAFE] text-[#5A78FF] px-2 py-1 rounded-full"
                >
                    <span>
                        {{ region.city }}
                        {{ region.district === '__all__' ? '전체' : region.district }}
                    </span>
                    <button
                        @click="removeSelectedRegion(index)"
                        class="ml-1 text-[#5A78FF] font-bold"
                    >
                        ✕
                    </button>
                </div>
            </div>

            <!-- 평수 -->
            <label class="text-sm font-semibold text-gray-800 block mt-3 mb-1">평수</label>
            <div class="grid grid-cols-3 gap-2 text-xs mb-4">
                <button
                    v-for="option in areaOptions"
                    :key="option.value"
                    @click="toggleArea(option.value)"
                    :class="[
                        'px-3 py-2 rounded-full border',
                        selectedAreas.some((a) => a.toString() === option.value.toString())
                            ? 'bg-blue-500 text-white'
                            : 'bg-white text-gray-600',
                    ]"
                >
                    {{ option.label }}

                    <!-- {{ option.label }}<br> ({{ option.pyeong }}) -->
                </button>
            </div>

            <!-- 가격 -->
            <label class="text-sm font-semibold text-gray-800 block mb-2"
                >가격대 (만원 단위)</label
            >
            <div class="flex items-center gap-2 mb-6">
                <input
                    :value="priceMin"
                    @input="(e) => emit('update', { field: 'priceMin', value: +e.target.value })"
                    type="number"
                    class="w-full border rounded px-3 py-2 text-sm"
                    placeholder="최소 금액"
                />
                <span class="text-gray-500">~</span>
                <input
                    :value="priceMax"
                    @input="(e) => emit('update', { field: 'priceMax', value: +e.target.value })"
                    type="number"
                    class="w-full border rounded px-3 py-2 text-sm"
                    placeholder="최대 금액"
                />
            </div>

            <button
                @click="apply"
                class="w-full bg-blue-500 text-white font-semibold py-3 rounded text-sm hover:bg-blue-600"
            >
                필터 적용
            </button>
        </div>
    </div>
</template>

<script setup>
import { computed, defineProps, defineEmits } from 'vue'
import { districts } from '@/data/districts'
import { areaOptions } from '@/data/area'

const props = defineProps({
    visible: Boolean,
    selectedRegions: Array,
    selectedAreas: Array,
    priceMin: Number,
    priceMax: Number,
    selectedCity: String,
    selectedDistrict: String,
})

const emit = defineEmits(['update:visible', 'apply', 'update'])

const close = () => emit('update:visible', false)

const cities = Object.keys(districts)
const filteredDistricts = computed(() => districts[props.selectedCity] || [])

const addSelectedRegion = () => {
    console.log('📍 city:', props.selectedCity, 'district:', props.selectedDistrict)

    if (!props.selectedCity) {
        console.warn('🚫 시 정보가 비어있음')
        return
    }

    // 군/구를 선택하지 않은 경우 district는 빈 문자열로 처리
    const district = props.selectedDistrict || ''

    const duplicate = props.selectedRegions.some(
        (item) => item.city === props.selectedCity && item.district === district,
    )

    if (!duplicate) {
        emit('update', {
            field: 'selectedRegions',
            value: [...props.selectedRegions, { city: props.selectedCity, district }],
        })
    }

    // 군/구 초기화
    emit('update', { field: 'selectedDistrict', value: '' })
}

// const handleDistrictChange = (e) => {
//   const district = e.target.value
//   emit('update', { field: 'selectedDistrict', value: district })

//   // 약간의 지연 후 호출
//   setTimeout(() => {
//     addSelectedRegion()
//   }, 0)
// }

const handleDistrictChange = (e) => {
    const district = e.target.value
    emit('update', { field: 'selectedDistrict', value: district })

    // 전체 선택인 경우
    if (district === '__all__') {
        if (!props.selectedCity) return

        const combined = [
            // 다른 시의 선택은 유지하고
            ...props.selectedRegions.filter((r) => r.city !== props.selectedCity),
            // 현재 시 전체를 나타내는 한 개만 추가
            { city: props.selectedCity, district: '__all__' },
        ]

        emit('update', { field: 'selectedRegions', value: combined })

        return
    }

    // 일반 구 선택
    setTimeout(() => {
        addSelectedRegion()
    }, 0)
}

// const onChangeCity = (e) => {
//     emit('update', { field: 'selectedCity', value: e.target.value })

//     // 약간의 지연 후 호출
//     setTimeout(() => {
//         addSelectedRegion()
//     }, 0)
// }

// const onChangeRegion = (e) => {
//     emit('update', { field: 'selectedRegion', value: e.target.value })
// }

const removeSelectedRegion = (index) => {
    const updated = [...props.selectedRegions]
    updated.splice(index, 1)
    emit('update', { field: 'selectedRegions', value: updated })
}

const toggleArea = (val) => {
    const valStr = val.toString()
    const exists = props.selectedAreas.some((a) => a.toString() === valStr)
    const updated = exists
        ? props.selectedAreas.filter((a) => a.toString() !== valStr)
        : [...props.selectedAreas, [...val]] // 깊은 복사
    emit('update', { field: 'selectedAreas', value: updated })
}

const apply = () => {
    emit('apply')
    close()
}
</script>
