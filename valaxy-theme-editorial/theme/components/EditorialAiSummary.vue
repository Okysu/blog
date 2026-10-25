<script setup lang="ts">
defineProps<{ summary: string }>()
</script>

<template>
  <aside class="ed-ai-summary" aria-label="AI 摘要">
    <p class="ed-ai-summary-label">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5Z" /></svg>
      AI 摘要
    </p>
    <p class="ed-ai-summary-text">
      {{ summary }}
    </p>
  </aside>
</template>
