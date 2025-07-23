<template>
    <div>
        <!-- 상단 타이틀 -->
        <div class="flex items-center gap-1 text-sm font-semibold text-gray-900 mb-2">
            <Smile class="w-4 h-4 text-gray-500" />
            <span>나의 당첨 가능성</span>
        </div>

        <!-- 카드 본문 -->
        <div class="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
            <!-- 이모티콘 -->
            <div class="text-2xl mb-2">🧑‍🏫</div>

            <!-- 제목 -->
            <p class="text-sm font-semibold text-gray-800 mb-1">당첨 가능성을 알아볼까요?</p>

            <!-- 설명 -->
            <p class="text-xs text-gray-500 leading-relaxed mb-4">
                해당 청약에 관심이 있으시군요!<br />
                지비가 회원님의 청약 당첨 가능성을 알려드려요.
            </p>
            <!-- 버튼 -->
            <button
            class="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2.5 rounded-md
                    flex items-center justify-center gap-1"
            >
            <Sparkles class="w-4 h-4" />
            당첨 가능성 확인하기
            </button>
        </div>
    </div>
</template>

<script setup>
import { Smile, Sparkles } from 'lucide-vue-next'
</script>
