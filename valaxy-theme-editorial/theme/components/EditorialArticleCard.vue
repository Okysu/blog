<script setup lang="ts">
import type { Post } from 'valaxy'
import { plainText, postTags } from '../client/posts'

defineProps<{ post: Post, featured?: boolean }>()
</script>

<template>
  <article class="ed-post-row" :class="{ 'ed-post-featured': featured }">
    <div class="ed-post-side">
      <span v-if="featured" class="ed-feature-label">{{ post.top ? '置顶手记' : '最新手记' }}</span>
      <EditorialDate :date="post.date" />
    </div>
    <div class="ed-post-summary">
      <div class="ed-post-meta">
        <span v-if="post.top && !featured" class="ed-pinned">置顶</span>
        <RouterLink v-for="tag in postTags(post.tags).slice(0, 2)" :key="tag" class="ed-tag" :to="{ path: '/tags/', query: { tag } }">
          {{ tag }}
        </RouterLink>
      </div>
      <h2>
        <RouterLink :to="post.path || '/'">
          {{ post.title || '无题' }}
        </RouterLink>
      </h2>
      <p v-if="plainText(post.excerpt || post.description)" class="ed-excerpt">
        {{ plainText(post.excerpt || post.description) }}
      </p>
      <RouterLink v-if="featured" class="ed-read-more" :to="post.path || '/'">
        读这篇文章 <span aria-hidden="true">↗</span>
      </RouterLink>
    </div>
    <span v-if="!featured" class="ed-row-arrow" aria-hidden="true">↗</span>
  </article>
</template>
