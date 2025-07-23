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
            <label class="text-sm font-semibold text-gray-800 mb-1 block"
                >선호 지역 (복수 선택 가능)</label
            >
            <div class="space-y-2">
                <select v-model="selectedCity" class="w-full border rounded px-3 py-2 text-sm">
                    <option disabled value="">시/도를 선택해주세요</option>
                    <option v-for="city in cities" :key="city">{{ city }}</option>
                </select>
                <select
                    v-model="selectedDistrict"
                    class="w-full border rounded px-3 py-2 text-sm"
                    @change="addSelectedRegion"
                >
                    <option disabled value="">군/구를 선택해주세요</option>
                    <option v-for="gu in filteredDistricts" :key="gu">{{ gu }}</option>
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
import { Cog } from 'lucide-vue-next'
import { usePreferenceStore } from '@/stores/preference'
import { useRouter } from 'vue-router'
import BackHeader from '@/components/common/BackHeader.vue'

const router = useRouter()
const preferenceStore = usePreferenceStore()

const districts = {
    서울특별시: [
        '강남구',
        '강동구',
        '강북구',
        '강서구',
        '관악구',
        '광진구',
        '구로구',
        '금천구',
        '노원구',
        '도봉구',
        '동대문구',
        '동작구',
        '마포구',
        '서대문구',
        '서초구',
        '성동구',
        '성북구',
        '송파구',
        '양천구',
        '영등포구',
        '용산구',
        '은평구',
        '종로구',
        '중구',
        '중랑구',
    ],
    부산광역시: [
        '강서구',
        '금정구',
        '기장군',
        '남구',
        '동구',
        '동래구',
        '부산진구',
        '북구',
        '사상구',
        '사하구',
        '서구',
        '수영구',
        '연제구',
        '영도구',
        '중구',
        '해운대구',
    ],
    대구광역시: ['남구', '달서구', '달성군', '동구', '북구', '서구', '수성구', '중구'],
    인천광역시: [
        '계양구',
        '남동구',
        '동구',
        '미추홀구',
        '부평구',
        '서구',
        '연수구',
        '중구',
        '강화군',
        '옹진군',
    ],
    광주광역시: ['광산구', '남구', '동구', '북구', '서구'],
    대전광역시: ['대덕구', '동구', '서구', '유성구', '중구'],
    울산광역시: ['남구', '동구', '북구', '중구', '울주군'],
    세종특별자치시: ['세종시'],
    경기도: [
        '가평군',
        '고양시',
        '과천시',
        '광명시',
        '광주시',
        '구리시',
        '군포시',
        '김포시',
        '남양주시',
        '동두천시',
        '부천시',
        '성남시',
        '수원시',
        '시흥시',
        '안산시',
        '안성시',
        '안양시',
        '양주시',
        '양평군',
        '여주시',
        '연천군',
        '오산시',
        '용인시',
        '의왕시',
        '의정부시',
        '이천시',
        '파주시',
        '평택시',
        '포천시',
        '하남시',
        '화성시',
    ],
    강원특별자치도: [
        '강릉시',
        '고성군',
        '동해시',
        '삼척시',
        '속초시',
        '양구군',
        '양양군',
        '영월군',
        '원주시',
        '인제군',
        '정선군',
        '철원군',
        '춘천시',
        '태백시',
        '평창군',
        '홍천군',
        '화천군',
        '횡성군',
    ],
    충청북도: [
        '괴산군',
        '단양군',
        '보은군',
        '영동군',
        '옥천군',
        '음성군',
        '제천시',
        '증평군',
        '진천군',
        '청주시',
        '충주시',
    ],
    충청남도: [
        '계룡시',
        '공주시',
        '금산군',
        '논산시',
        '당진시',
        '보령시',
        '부여군',
        '서산시',
        '서천군',
        '아산시',
        '예산군',
        '천안시',
        '청양군',
        '태안군',
        '홍성군',
    ],
    전라북도: [
        '고창군',
        '군산시',
        '김제시',
        '남원시',
        '무주군',
        '부안군',
        '순창군',
        '완주군',
        '익산시',
        '임실군',
        '장수군',
        '전주시',
        '정읍시',
        '진안군',
    ],
    전라남도: [
        '강진군',
        '고흥군',
        '곡성군',
        '광양시',
        '구례군',
        '나주시',
        '담양군',
        '목포시',
        '무안군',
        '보성군',
        '순천시',
        '신안군',
        '여수시',
        '영광군',
        '영암군',
        '완도군',
        '장성군',
        '장흥군',
        '진도군',
        '함평군',
        '해남군',
        '화순군',
    ],
    경상북도: [
        '경산시',
        '경주시',
        '고령군',
        '구미시',
        '군위군',
        '김천시',
        '문경시',
        '봉화군',
        '상주시',
        '성주군',
        '안동시',
        '영덕군',
        '영양군',
        '영주시',
        '영천시',
        '예천군',
        '울릉군',
        '울진군',
        '의성군',
        '청도군',
        '청송군',
        '칠곡군',
        '포항시',
    ],
    경상남도: [
        '거제시',
        '거창군',
        '고성군',
        '김해시',
        '남해군',
        '밀양시',
        '사천시',
        '산청군',
        '양산시',
        '의령군',
        '진주시',
        '창녕군',
        '창원시',
        '통영시',
        '하동군',
        '함안군',
        '함양군',
        '합천군',
    ],
    제주특별자치도: ['서귀포시', '제주시'],
}
const cities = Object.keys(districts)

const selectedCity = ref('')
const selectedDistrict = ref('')
const selectedRegions = ref([])
const filteredDistricts = computed(() => districts[selectedCity.value] || [])

const addSelectedRegion = () => {
    if (!selectedCity.value || !selectedDistrict.value) return
    const duplicate = selectedRegions.value.some(
        (item) => item.city === selectedCity.value && item.district === selectedDistrict.value,
    )
    if (!duplicate) {
        selectedRegions.value.push({ city: selectedCity.value, district: selectedDistrict.value })
    }
    selectedDistrict.value = ''
}

const removeSelectedRegion = (index) => {
    selectedRegions.value.splice(index, 1)
}

const areaOptions = [
    { label: '60㎡ 이하', value: [0, 60] },
    { label: '60㎡ ~ 85㎡', value: [60, 85] },
    { label: '85㎡ ~ 100㎡', value: [85, 100] },
    { label: '100㎡ ~ 135㎡', value: [100, 135] },
    { label: '135㎡ 이상', value: [135, 999] },
]
const selectedAreas = ref([])
const toggleArea = (val) => {
    const key = val.toString()
    const exists = selectedAreas.value.find((a) => a.toString() === key)
    if (exists) {
        selectedAreas.value = selectedAreas.value.filter((a) => a.toString() !== key)
    } else {
        selectedAreas.value.push(val)
    }
}

const expandAreaRanges = (ranges) => {
    const allSizes = []
    ranges.forEach(([min, max]) => {
        for (let i = min + 1; i <= max; i++) {
            allSizes.push(i)
        }
    })
    return allSizes
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
    const expandedSizes = expandAreaRanges(selectedAreas.value)

    const preferenceData = {
        regions: selectedRegions.value,
        areas: expandedSizes,
        priceRange: [priceMin.value, priceMax.value],
        types: selectedTypes.value,
    }

    console.log('저장된 선호 설정:', preferenceData) // 🔍 콘솔에 정보 출력

    preferenceStore.setPreference(preferenceData)
    alert('설정이 저장되었습니다.')

    router.push('/')
}
</script>

<style scoped>
.bg-primary {
    @apply bg-[#5A78FF];
}
</style>
