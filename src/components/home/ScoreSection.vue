<template>
    <div class="bg-white p-4 rounded-xl border">
        <h2 class="text-lg font-bold mb-3">내 가점 정보</h2>

        <!-- ✅ 가점 계산된 경우 -->
        <div
            v-if="isScoreCalculated"
            class="bg-[#F5F2FD] rounded-xl p-4 text-center flex flex-col items-center gap-2"
        >
            <!-- 점수 표시 -->
            <div class="flex items-center gap-1 text-xl font-bold text-[#7B61FF]">
                <Target class="w-5 h-5" />
                <span>{{ score.total }}점</span>
                <span class="text-sm text-gray-500">/ 84점 중</span>
            </div>

            <!-- 퍼센트 바 -->
            <div class="w-full h-2 bg-[#E0DFF5] rounded-full overflow-hidden">
                <div
                    class="h-full bg-[#A48BFF] transition-all"
                    :style="{ width: score.percent + '%' }"
                ></div>
            </div>
            <p class="text-sm text-[#A48BFF] font-medium">{{ score.percent.toFixed(1) }}% 달성</p>

            <!-- 메시지 -->
            <div class="flex items-center text-base text-gray-700 gap-1">
                <span>{{ message }}</span>
            </div>

            <!-- 버튼 -->
            <PrimaryButton customClass="bg-[#A48BFF] mt-2 text-lg" @click="goToInfo">
                🧐 현재 정보 확인하기
            </PrimaryButton>
        </div>

        <!-- ❌ 가점 미계산 -->
        <div
            v-else
            class="bg-[#F5F2FD] rounded-xl p-4 text-center flex flex-col items-center gap-2"
        >
            <div class="text-3xl">🤔</div>
            <p class="text-lg font-bold text-gray-800">가점을 계산해 보세요!</p>
            <p class="text-sm text-gray-500 leading-relaxed text-center">
                무주택 기간, 부양가족 수,<br />
                청약통장 가입기간을 입력하면<br />
                내 가점을 확인할 수 있어요
            </p>

            <PrimaryButton customClass="bg-[#A48BFF] mt-2 text-lg" @click="goToScoreInput">
                📝 가점 계산하기
            </PrimaryButton>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import PrimaryButton from '@/components/common/PrimaryButton.vue'
import { Target, Sparkles } from 'lucide-vue-next'

const router = useRouter()

const props = defineProps({
    isScoreCalculated: Boolean,
    score: {
        type: Object,
        default: () => ({
            total: 0,
            percent: 0,
            message: '',
        }),
    },
})

const message = computed(() => {
    const scoreVal = props.score.total
    if (scoreVal >= 69) return '🎯 당첨 가능성이 매우 높아요!'
    else if (scoreVal >= 55) return '👍 청약 당첨 가능성이 높습니다.'
    else if (scoreVal >= 40) return '📈 조금만 더 가점 관리해보세요!'
    else if (scoreVal >= 25) return '📌 꾸준한 납입과 가점 관리를 추천드려요.'
    else return '📝 당첨 가능성이 낮아요. 다른 조건도 함께 고려해보세요.'
})

// 계산하기 또는 다시 계산하기 눌렀을 때 이동
const goToScoreInput = () => {
    router.push('/score/step1')
}

const goToInfo = () => {
    router.push('score/result')
}
</script>
