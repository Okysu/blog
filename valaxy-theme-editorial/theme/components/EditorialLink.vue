<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ to: string }>()
const external = computed(() => /^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(props.to))
</script>

<template>
  <a v-if="external" :href="to"><slot /></a>
  <RouterLink v-else :to="to">
    <slot />
  </RouterLink>
</template>
