<template>
    <div class="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <!-- 상단 헤더 -->
        <div class="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-slate-200">
            <div class="max-w-screen-sm mx-auto px-4">
                <BackHeader title="알림 상세" />
            </div>
        </div>

        <!-- 본문 -->
        <main class="max-w-screen-sm mx-auto mt-10 px-4 py-6">
            <!-- 카드 -->
            <section
                class="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden"
                aria-labelledby="notice-title"
            >
                <!-- 카드 헤더 -->
                <div class="px-5 py-4 sm:px-6 flex items-start gap-3">
                    <div class="shrink-0 mt-0.5">
                        <!-- 종 아이콘 -->
                        <svg class="h-6 w-6 text-sky-600" viewBox="0 0 24 24" fill="none">
                            <path
                                d="M14 20a2 2 0 1 1-4 0"
                                stroke="currentColor"
                                stroke-width="1.5"
                                stroke-linecap="round"
                            />
                            <path
                                d="M6 10a6 6 0 1 1 12 0c0 4 2 5 2 5H4s2-1 2-5Z"
                                stroke="currentColor"
                                stroke-width="1.5"
                                stroke-linejoin="round"
                            />
                        </svg>
                    </div>
                    <div class="flex-1 min-w-0">
                        <h1
                            id="notice-title"
                            class="text-base sm:text-lg font-semibold tracking-[-0.01em] text-slate-900 line-clamp-2"
                        >
                            {{ notice.title || '알림 제목' }}
                        </h1>
                        <div
                            class="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500"
                        >
                            <span class="inline-flex items-center gap-1">
                                <!-- 달력 아이콘 -->
                                <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none">
                                    <path
                                        d="M7 3v3M17 3v3M3 9h18M5 6h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z"
                                        stroke="currentColor"
                                        stroke-width="1.5"
                                        stroke-linecap="round"
                                    />
                                </svg>
                                <span class="tabular-nums">{{ notice.date || '----.--.--' }}</span>
                            </span>
                            <span class="text-slate-300 select-none">·</span>
                            <span class="inline-flex items-center gap-1">
                                <!-- 시계 아이콘 -->
                                <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none">
                                    <path
                                        d="M12 8v4l3 2"
                                        stroke="currentColor"
                                        stroke-width="1.5"
                                        stroke-linecap="round"
                                    />
                                    <circle
                                        cx="12"
                                        cy="12"
                                        r="9"
                                        stroke="currentColor"
                                        stroke-width="1.5"
                                    />
                                </svg>
                                <span>{{ notice.timeAgo || '방금 전' }}</span>
                            </span>

                            <!-- 상태 배지(예: 새 알림) — 데이터가 있으면 표시 -->
                            <span
                                v-if="!notice.read"
                                class="ml-1 inline-flex items-center rounded-full bg-sky-50 px-2 py-0.5 text-[11px] font-medium text-sky-700 ring-1 ring-inset ring-sky-100"
                            >
                                새 알림
                            </span>
                        </div>
                    </div>
                    <button
                        class="text-xs text-red-500 font-medium hover:underline"
                        @click="deleteItem"
                    >
                        삭제
                    </button>
                </div>

                <!-- 구분선 -->
                <div
                    class="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"
                ></div>

                <!-- 콘텐츠 -->
                <div class="px-5 py-4 sm:px-6">
                    <!-- 로딩 스켈레톤: 데이터 없을 때만 보여줌 -->
                    <div v-if="!notice || !notice.content" class="space-y-3 animate-pulse">
                        <div class="h-3 w-5/6 rounded bg-slate-200"></div>
                        <div class="h-3 w-11/12 rounded bg-slate-200"></div>
                        <div class="h-3 w-4/5 rounded bg-slate-200"></div>
                        <div class="h-3 w-2/3 rounded bg-slate-200"></div>
                    </div>

                    <!-- 본문 -->
                    <div v-else class="prose prose-slate max-w-none">
                        <p class="text-sm leading-7 text-slate-700 whitespace-pre-wrap">
                            {{ notice.content }}
                        </p>
                    </div>

                    <!-- 
                    isRouting false
                        link 있음 => 외부 링크
                        link 없음 => 없음

                    isRouting true
                        link 있음 => 내부 링크
                        link 없음 => 없음
                    -->

                    <!-- 링크 프리뷰 -->
                    <div v-if="notice.link" class="mt-5">
                        <!-- 내부 링크 -> houseType으로 아파트 상세정보인지, 오피스텔 상세정보인지 구분 -->
                        <div v-if="notice.routing">
                            <!-- 내부 아파트 링크 -->
                            <router-link
                                v-if="notice.houseType === 'APT'"
                                :to="{ name: 'SubscriptionDetail', params: { id: notice.link } }"
                                class="group block rounded-xl border border-slate-200 hover:border-sky-300 hover:shadow-md transition-all"
                            >
                                <div class="px-4 py-3 flex items-center gap-3">
                                    <div class="shrink-0">
                                        <!-- 링크 아이콘 -->
                                        <svg
                                            class="h-5 w-5 text-sky-600 group-hover:translate-x-0.5 transition-transform"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                        >
                                            <path
                                                d="M10 14a3 3 0 0 1 0-4l4-4a3 3 0 1 1 4 4l-1 1"
                                                stroke="currentColor"
                                                stroke-width="1.5"
                                                stroke-linecap="round"
                                            />
                                            <path
                                                d="M14 10a3 3 0 0 1 0 4l-4 4a3 3 0 0 1-4-4l1-1"
                                                stroke="currentColor"
                                                stroke-width="1.5"
                                                stroke-linecap="round"
                                            />
                                        </svg>
                                    </div>
                                    <div class="flex-1 min-w-0">
                                        <p class="text-sm font-medium text-slate-900 truncate">
                                            내부 아파트 링크 이동
                                        </p>
                                        <p class="text-xs text-slate-500 truncate">
                                            더 자세한 내용을 확인하세요
                                        </p>
                                    </div>
                                    <div class="shrink-0">
                                        <svg
                                            class="h-5 w-5 text-slate-400 group-hover:text-sky-600 transition-colors"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                        >
                                            <path
                                                d="M9 5l7 7-7 7"
                                                stroke="currentColor"
                                                stroke-width="1.5"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                            />
                                        </svg>
                                    </div>
                                </div>
                            </router-link>
                            <!-- 내부 오피스텔 링크 -->
                            <router-link
                                v-else
                                :to="{ name: 'EtcSubscriptionDetail', params: { id: notice.link } }"
                                class="group block rounded-xl border border-slate-200 hover:border-sky-300 hover:shadow-md transition-all"
                            >
                                <div class="px-4 py-3 flex items-center gap-3">
                                    <div class="shrink-0">
                                        <!-- 링크 아이콘 -->
                                        <svg
                                            class="h-5 w-5 text-sky-600 group-hover:translate-x-0.5 transition-transform"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                        >
                                            <path
                                                d="M10 14a3 3 0 0 1 0-4l4-4a3 3 0 1 1 4 4l-1 1"
                                                stroke="currentColor"
                                                stroke-width="1.5"
                                                stroke-linecap="round"
                                            />
                                            <path
                                                d="M14 10a3 3 0 0 1 0 4l-4 4a3 3 0 0 1-4-4l1-1"
                                                stroke="currentColor"
                                                stroke-width="1.5"
                                                stroke-linecap="round"
                                            />
                                        </svg>
                                    </div>
                                    <div class="flex-1 min-w-0">
                                        <p class="text-sm font-medium text-slate-900 truncate">
                                            내부 오피스텔 링크 이동
                                        </p>
                                        <p class="text-xs text-slate-500 truncate">
                                            더 자세한 내용을 확인하세요
                                        </p>
                                    </div>
                                    <div class="shrink-0">
                                        <svg
                                            class="h-5 w-5 text-slate-400 group-hover:text-sky-600 transition-colors"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                        >
                                            <path
                                                d="M9 5l7 7-7 7"
                                                stroke="currentColor"
                                                stroke-width="1.5"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                            />
                                        </svg>
                                    </div>
                                </div>
                            </router-link>
                        </div>
                        <!-- 외부 링크 -> 그냥 a 태그로 바로 링크로 이동 -->
                        <a
                            v-else
                            :href="notice.link"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="group block rounded-xl border border-slate-200 hover:border-sky-300 hover:shadow-md transition-all"
                        >
                            <div class="px-4 py-3 flex items-center gap-3">
                                <div class="shrink-0">
                                    <!-- 링크 아이콘 -->
                                    <svg
                                        class="h-5 w-5 text-sky-600 group-hover:translate-x-0.5 transition-transform"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                    >
                                        <path
                                            d="M10 14a3 3 0 0 1 0-4l4-4a3 3 0 1 1 4 4l-1 1"
                                            stroke="currentColor"
                                            stroke-width="1.5"
                                            stroke-linecap="round"
                                        />
                                        <path
                                            d="M14 10a3 3 0 0 1 0 4l-4 4a3 3 0 0 1-4-4l1-1"
                                            stroke="currentColor"
                                            stroke-width="1.5"
                                            stroke-linecap="round"
                                        />
                                    </svg>
                                </div>
                                <div class="flex-1 min-w-0">
                                    <p class="text-sm font-medium text-slate-900 truncate">
                                        외부 링크 이동
                                    </p>
                                    <p class="text-xs text-slate-500 truncate">
                                        더 자세한 내용을 확인하세요
                                    </p>
                                </div>
                                <div class="shrink-0">
                                    <svg
                                        class="h-5 w-5 text-slate-400 group-hover:text-sky-600 transition-colors"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                    >
                                        <path
                                            d="M9 5l7 7-7 7"
                                            stroke="currentColor"
                                            stroke-width="1.5"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                        />
                                    </svg>
                                </div>
                            </div>
                        </a>
                    </div>
                </div>

                <!-- 카드 푸터(선택): 간단한 안내 -->
                <div
                    class="px-5 py-3 sm:px-6 bg-slate-50/60 border-t border-slate-200 text-[11px] text-slate-500"
                >
                    추가 문의사항은 zibits@gmail.com으로 연락주세요.
                </div>
            </section>
        </main>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useNotificationStore } from '@/stores/notificationStore'
import BackHeader from '@/components/common/BackHeader.vue'

// ✅ 예시: route param 기반 알림 ID 가져오기
const route = useRoute()
const router = useRouter()
const notificationId = route.params.id
const store = useNotificationStore()

const notice = ref({})

const deleteItem = async () => {
    const response = await store.deleteItem(notice.value.id)

    response && router.back()
}

onMounted(async () => {
    console.log('detial : ', store.getItem(notificationId))
    notice.value = await store.getItem(notificationId)
    console.log('notice.value : ', notice.value)
})
</script>
