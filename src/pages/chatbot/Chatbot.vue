<template>
    <div class="flex flex-col min-h-screen bg-gray-50 pt-14">
        <BackHeader title="챗봇" />

        <!-- 대화 스크롤 영역 (하단 여백만 고정) -->
        <div
            class="flex-1 min-h-0 overflow-y-auto px-4 py-4 space-y-3 pb-[132px]"
            ref="containerRef"
            :style="{ scrollPaddingBottom: '160px' }"
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
        <div class="fixed left-0 right-0 bottom-[72px] px-4 py-2">
            <div class="mx-auto max-w-screen-md">
                <div
                    class="rounded-2xl border border-gray-200 bg-white/90 backdrop-blur-sm shadow-sm px-3 py-2"
                >
                    <div class="flex gap-2 overflow-x-auto no-scrollbar">
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

const chatLog = ref([
    { sender: 'bot', message: '안녕하세요! 청약 관련해서 무엇이든 물어보세요 😊' },
])
const userInput = ref('')
const quickQuestions = ref(['청약 일정 알려줘', '가점 계산 방법', '내 조건에 맞는 공고'])

const containerRef = ref(null)
const bottomAnchor = ref(null)

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
)

const sendMessage = async (text) => {
    const msg = (text ?? userInput.value).trim()
    if (!msg) return
    chatLog.value.push({ sender: 'user', message: msg })
    userInput.value = ''
    await scrollToBottom()
    setTimeout(async () => {
        chatLog.value.push({
            sender: 'bot',
            message: `“${msg}”에 대한 정보를 정리 중이에요. 잠시만요!`,
        })
        await scrollToBottom()
    }, 600)
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
