<template>
    <div class="flex flex-col min-h-screen bg-gray-50 pt-14">
        <BackHeader title="챗봇" />

        <!-- 대화 스크롤 영역 (하단 여백만 고정) -->
        <div
            class="flex-1 min-h-0 overflow-y-auto px-4 py-4 space-y-3"
            ref="containerRef"
            :style="{
                paddingBottom: showQuickQuestions ? '280px' : '120px',
                scrollPaddingBottom: showQuickQuestions ? '160px' : '148px',
            }"
        >
            <div
                v-for="(chat, index) in chatLog"
                :key="index"
                class="flex"
                :class="chat.sender === 'user' ? 'justify-end' : 'justify-start'"
            >
                <div
                    class="max-w-[75%] rounded-2xl px-4 py-2 text-sm shadow"
                    :class="
                        chat.sender === 'user'
                            ? 'bg-blue-600 text-white rounded-br-md'
                            : 'bg-white text-gray-900 border border-gray-200 rounded-bl-md'
                    "
                >
                    <div v-html="chat.message"></div>
                </div>
            </div>

            <!-- 맨 아래 앵커 -->
            <div ref="bottomAnchor" aria-hidden="true"></div>
        </div>

        <!-- 빠른 질문: 입력창 바로 위에 고정 (값만 고정) -->
        <div class="fixed left-0 right-0 bottom-[72px] px-4 transition-all mb-1">
            <div class="mx-auto max-w-screen-md">
                <div
                    class="rounded-2xl border border-gray-200 bg-white/90 backdrop-blur-sm shadow-sm px-3 py-2"
                >
                    <!-- 토글 버튼 -->
                    <div
                        class="flex justify-between items-center mb-1"
                        @click="showQuickQuestions = !showQuickQuestions"
                    >
                        <span class="text-sm font-medium text-gray-700">빠른 질문</span>
                        <button class="text-xs text-gray-500 hover:underline">
                            {{ showQuickQuestions ? '접기 ∨' : '펼치기 ∧' }}
                        </button>
                    </div>

                    <!-- 질문 목록 -->
                    <div
                        v-if="showQuickQuestions"
                        class="flex flex-col gap-2 max-h-[160px] overflow-y-auto no-scrollbar transition-all"
                    >
                        <button
                            v-for="(q, idx) in quickQuestions"
                            :key="idx"
                            @click="sendMessage(q)"
                            class="shrink-0 px-3 py-1.5 rounded-full text-sm bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 active:scale-[0.98] transition whitespace-nowrap"
                        >
                            {{ q }}
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- 입력 바(고정) -->
        <div class="fixed bottom-0 left-0 right-0 bg-white border-t px-3 py-3">
            <div class="mx-auto max-w-screen-md flex items-center gap-2">
                <input
                    v-model="userInput"
                    @keyup.enter="sendMessage(userInput)"
                    placeholder="궁금한 걸 물어보세요"
                    class="flex-1 rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                    @click="sendMessage(userInput)"
                    class="px-4 py-3 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 active:scale-[0.98] transition disabled:opacity-50"
                    :disabled="!userInput?.trim()"
                >
                    전송
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, nextTick, watch, onMounted } from 'vue'
import BackHeader from '@/components/common/BackHeader.vue'
import api from '@/api/axios'

const chatLog = ref([
    { sender: 'bot', message: '안녕하세요! 청약 관련해서 무엇이든 물어보세요 😊' },
])
const userInput = ref('')
const showQuickQuestions = ref(false)
const quickQuestions = ref([
    '청약 자격은 어떻게 되나요?',
    '청약 가점제는 뭔가요?',
    '청약 통장은 꼭 있어야 하나요?',
    '1순위 조건은 뭔가요?',
    '청약 당첨되면 무조건 사야 하나요?',
    '신혼부부 특별 공급이 뭔가요?',
    '당첨 확률을 높이려면 어떻게 해야 하나요?',
    '청약은 어디서 신청 하나요?',
    '청약에 떨어지면 불이익 있나요?',
])

const containerRef = ref(null)
const bottomAnchor = ref(null)

const typeText = async (text, indexInLog) => {
    for (let i = 0; i < text.length; i++) {
        chatLog.value[indexInLog].message += text[i]
        await new Promise((resolve) => setTimeout(resolve, 20)) // 20ms 딜레이
    }
}

const scrollToBottom = async () => {
    await nextTick()
    const el = containerRef.value
    const anchor = bottomAnchor.value

    // 안전하게 anchor가 보이도록 (위쪽 여백 확보)
    anchor?.scrollIntoView({ behavior: 'smooth', block: 'start' })

    // 추가 보정: 강제 스크롤
    if (el) {
        el.scrollTop = el.scrollHeight
        requestAnimationFrame(() => {
            el.scrollTop = el.scrollHeight
        })
    }
}

// 처음/메시지 추가 때마다 최하단으로
onMounted(() => scrollToBottom())
watch(
    () => chatLog.value.length,
    () => scrollToBottom(),
    (showQuickQuestions,
    async () => {
        await scrollToBottom()
    }),
)

const sendToChatbotAPI = async (message) => {
    const res = await api.post('/chatbot', { message })
    return res.data?.response // 백엔드 응답 구조에 따라 조정
}

const sendMessage = async (text) => {
    const msg = (text ?? userInput.value).trim()
    if (!msg) return

    chatLog.value.push({ sender: 'user', message: msg })
    userInput.value = ''
    await scrollToBottom()

    // 로딩 문구 먼저 추가
    const loadingMsg = {
        sender: 'bot',
        message: '지비가 생각하는 중...',
    }
    chatLog.value.push(loadingMsg)
    const botMsgIndex = chatLog.value.length - 1
    await scrollToBottom()

    try {
        const response = await sendToChatbotAPI(msg)
        const finalText = response || '답변을 불러오지 못했습니다.'

        // 잠깐 대기 후 문구 초기화
        await new Promise((resolve) => setTimeout(resolve, 600))
        chatLog.value[botMsgIndex].message = '' // 지우기

        // 한 글자씩 타이핑
        await typeText(finalText, botMsgIndex)
    } catch (e) {
        console.error(e)
        chatLog.value[botMsgIndex].message = '오류가 발생했어요. 잠시 후 다시 시도해주세요.'
    }

    await scrollToBottom()
}
</script>

<style>
.no-scrollbar::-webkit-scrollbar {
    display: none;
}
.no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>
