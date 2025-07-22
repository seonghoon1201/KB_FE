<template>
    <div class="flex flex-col items-center justify-center min-h-screen bg-white text-center px-6">
        <BackHeader />
        <main
            class="flex-1 w-full px-4 py-6 space-y-6 overflow-y-auto pb-20 mt-[60px] border border-black"
        >
            <FullCalendar :options="calendarOptions" />
            <h1 class="text-xl font-semibold text-gray-800 mb-2">[달력 페이지]</h1>
            <p class="text-gray-500">이 페이지는 아직 작업 중입니다.</p>
        </main>
        <BottomNavBar />
    </div>
</template>
<script setup>
import BackHeader from '@/components/common/BackHeader.vue'
import BottomNavBar from '@/components/common/BottomNavbar.vue'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'

const calendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
}
</script>
