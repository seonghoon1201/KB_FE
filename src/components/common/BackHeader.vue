<!-- 메인 헤더 컴포넌트 -->

<template>
	<div
		class="flex items-center justify-between w-full h-15 border border-black px-4 py-2 bg-[#DDF1FB]"
	>
		<div><ChevronLeft @click="backClick" /></div>
		<div @click="titleClick">{{ title }}</div>
		<div class="flex items-center space-x-4">
			<div v-if="showAlarm">
				<Bell @click="alarmClick" />
			</div>
			<div v-else class="relative inline-block">
				<BellDot @click="alarmClick" />
				<div
					class="absolute top-2 right-1.5 w-2 h-2 bg-red-500 rounded-full board-2 border-red"
					style="transform: translate(50%, -50%)"
				></div>
			</div>
			<div>
				<Menu @click="menuClick" />
			</div>
		</div>
	</div>
</template>
<script setup>
import { ChevronLeft, Bell, BellDot, Menu } from "lucide-vue-next";
import { ref, reactive } from "vue";

let showAlarm = ref(true);
let title = ref("title11");

const backClick = () => {
	console.log("back button click");
};

const titleClick = () => {
	console.log(`title ${title.value} click`);
};

const alarmClick = () => {
	console.log("alarm click => open alarm");
};

const menuClick = () => {
	console.log("menu click => open menu");
};
</script>
<style></style>
