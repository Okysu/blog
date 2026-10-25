<script setup lang="ts">
import { usePostList, useSiteConfig } from 'valaxy'
import { computed } from 'vue'
import { useThemeConfig } from '../composables'

const site = useSiteConfig()
const theme = useThemeConfig()
const posts = usePostList()
const count = computed(() => posts.value.filter(post => !post.draft && !post.hide).length)
</script>

<template>
  <header class="ed-intro">
    <div class="ed-intro-main">
      <p class="ed-eyebrow">
        <span class="ed-dot" aria-hidden="true" />{{ theme.eyebrow }}
      </p>
      <h1>{{ site.title }}</h1>
      <p class="ed-subtitle">
        {{ site.subtitle || site.description }}
      </p>
      <div v-if="site.social?.length" class="ed-social" aria-label="社交链接">
        <EditorialLink v-for="item in site.social" :key="item.link" :to="item.link">
          {{ item.name }} <span aria-hidden="true">↗</span>
        </EditorialLink>
      </div>
    </div>
    <aside v-if="theme.introNote" class="ed-intro-note">
      <span class="ed-note-mark" aria-hidden="true">“</span>
      <p>{{ theme.introNote }}</p>
      <RouterLink to="/archives/">
        {{ String(count).padStart(2, '0') }} 篇记录 <span aria-hidden="true">↗</span>
      </RouterLink>
    </aside>
  </header>
</template>
