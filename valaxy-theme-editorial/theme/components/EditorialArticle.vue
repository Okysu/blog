<script setup lang="ts">
import { useFrontmatter, usePostList } from 'valaxy'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { postTags } from '../client/posts'
import { useThemeConfig } from '../composables'

const props = defineProps<{ post?: boolean }>()
const fm = useFrontmatter()
const theme = useThemeConfig()
const route = useRoute()
const source = usePostList()
const posts = computed(() => source.value.filter(p => !p.draft && !p.hide))
const index = computed(() => posts.value.findIndex(p => p.path === route.path))
const previous = computed(() => index.value < 0 ? undefined : posts.value[index.value + 1])
const next = computed(() => index.value < 0 ? undefined : posts.value[index.value - 1])
</script>

<template>
  <article class="ed-article" :class="{ 'ed-article-post': props.post }">
    <header class="ed-article-header">
      <RouterLink to="/archives/" class="ed-back">
        ← 所有文章
      </RouterLink>
      <div v-if="post" class="ed-article-meta">
        <EditorialDate :date="fm.date" /><RouterLink v-for="item in postTags(fm.tags)" :key="item" :to="{ path: '/tags/', query: { tag: item } }">
          {{ item }}
        </RouterLink><span v-if="fm.draft">草稿预览</span>
      </div>
      <h1>{{ fm.title }}</h1>
      <p v-if="fm.description" class="ed-subtitle">
        {{ fm.description }}
      </p>
    </header>
    <div class="ed-reading-grid" :class="{ 'ed-with-outline': theme.showOutline && fm.outline !== false }">
      <div class="ed-reading">
        <slot />
      </div>
      <aside v-if="theme.showOutline && fm.outline !== false" class="ed-aside">
        <EditorialOutline :key="route.path" />
      </aside>
    </div>
    <nav v-if="post && (previous || next)" class="ed-adjacent" aria-label="相邻文章">
      <RouterLink v-if="previous?.path" :to="previous.path">
        <span>上一篇</span>{{ previous.title }}
      </RouterLink>
      <RouterLink v-if="next?.path" :to="next.path">
        <span>下一篇</span>{{ next.title }}
      </RouterLink>
    </nav>
  </article>
</template>
