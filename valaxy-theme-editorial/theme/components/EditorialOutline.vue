<script setup lang="ts">
import { useOutline } from 'valaxy'
import EditorialOutlineItems from './EditorialOutlineItems.vue'

const { headers, handleClick } = useOutline()
</script>

<template>
  <details v-if="headers.length" class="ed-outline" open>
    <summary>
      <span>本文目录<small>ON THIS PAGE</small></span>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
    </summary>
    <nav aria-label="文章目录">
      <EditorialOutlineItems :items="headers" :navigate="handleClick" />
    </nav>
  </details>
</template>
