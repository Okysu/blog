<script setup lang="ts">
import { computed } from 'vue'
import { isNativeLink, nativeLinkHref } from '../client/links'

const props = defineProps<{ to: string }>()
const native = computed(() => isNativeLink(props.to))
const href = computed(() => nativeLinkHref(props.to, import.meta.env.BASE_URL))
</script>

<template>
  <a v-if="native" :href="href"><slot /></a>
  <RouterLink v-else :to="to">
    <slot />
  </RouterLink>
</template>
