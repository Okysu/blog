<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = defineProps<{ name: string, src?: string }>()
const element = ref<HTMLElement>()
const requested = ref(false)
const loaded = ref(false)
const failed = ref(false)
let observer: IntersectionObserver | undefined
let firstFrame = 0
let secondFrame = 0
let mounted = false

function cleanup() {
  observer?.disconnect()
  cancelAnimationFrame(firstFrame)
  cancelAnimationFrame(secondFrame)
}
function schedule() {
  cleanup()
  requested.value = false
  loaded.value = false
  failed.value = false
  if (!props.src)
    return
  // Give the new page a paint before starting optional avatar requests.
  firstFrame = requestAnimationFrame(() => {
    secondFrame = requestAnimationFrame(() => {
      if (!element.value)
        return
      if (typeof IntersectionObserver === 'undefined') {
        requested.value = true
        return
      }
      observer = new IntersectionObserver((entries) => {
        if (entries.some(entry => entry.isIntersecting)) {
          requested.value = true
          observer?.disconnect()
        }
      }, { rootMargin: '120px' })
      observer.observe(element.value)
    })
  })
}
onMounted(() => {
  mounted = true
  schedule()
})
watch(() => props.src, () => {
  if (mounted)
    schedule()
})
onBeforeUnmount(cleanup)
</script>

<template>
  <span ref="element" class="ed-friend-avatar" aria-hidden="true">
    {{ name.trim().slice(0, 1) }}
    <img
      v-if="requested && !failed" :src="src" alt="" width="40" height="40"
      loading="lazy" decoding="async" fetchpriority="low" :class="{ 'is-loaded': loaded }"
      @load="loaded = true" @error="failed = true"
    >
  </span>
</template>
