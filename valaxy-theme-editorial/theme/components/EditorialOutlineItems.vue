<script setup lang="ts">
import type { useOutline } from 'valaxy'

type OutlineItem = ReturnType<typeof useOutline>['headers']['value'][number]
defineProps<{ items: OutlineItem[], navigate: (event: Event) => void }>()
</script>

<template>
  <ul>
    <li v-for="item in items" :key="item.link">
      <a :href="item.link" @click="navigate">{{ item.title }}</a>
      <EditorialOutlineItems v-if="item.children?.length" :items="item.children" :navigate="navigate" />
    </li>
  </ul>
</template>
