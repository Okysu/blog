<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'

interface FriendLink {
  url: string
  name: string
  blog?: string
  desc?: string
  avatar?: string
}

const props = withDefaults(defineProps<{ links: FriendLink[], random?: boolean }>(), { random: false })
const entries = ref([...props.links])
watch(() => props.links, (links) => {
  entries.value = [...links]
})
onMounted(() => {
  if (!props.random)
    return
  const result = [...props.links]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  entries.value = result
})
function hideBrokenAvatar(event: Event) {
  (event.target as HTMLImageElement).hidden = true
}
</script>

<template>
  <ul v-if="entries.length" class="ed-friends">
    <li v-for="friend in entries" :key="friend.url">
      <a :href="friend.url" target="_blank" rel="noopener noreferrer" class="ed-friend">
        <span class="ed-friend-avatar" aria-hidden="true">{{ friend.name.slice(0, 1) }}<img v-if="friend.avatar" :src="friend.avatar" alt="" loading="lazy" decoding="async" @error="hideBrokenAvatar"></span>
        <span class="ed-friend-copy"><strong>{{ friend.blog || friend.name }}</strong><span v-if="friend.blog && friend.blog !== friend.name" class="ed-friend-name">{{ friend.name }}</span><span v-if="friend.desc" class="ed-friend-description">{{ friend.desc }}</span></span>
        <span class="ed-friend-arrow" aria-hidden="true">↗</span>
      </a>
    </li>
  </ul>
  <p v-else class="ed-empty">
    暂时没有友链。
  </p>
</template>
