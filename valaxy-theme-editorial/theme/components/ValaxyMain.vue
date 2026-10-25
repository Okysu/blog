<script setup lang="ts">
import type { PageData, Post } from 'valaxy'
import { useSiteConfig } from 'valaxy'
import { computed } from 'vue'
import { aiSummary } from '../client/posts'
import { useThemeConfig } from '../composables'

const props = defineProps<{ frontmatter: Post, data?: PageData }>()
const site = useSiteConfig()
const theme = useThemeConfig()
const summary = computed(() => theme.value.showAiSummary ? aiSummary(props.frontmatter) : '')
</script>

<template>
  <div class="ed-main">
    <slot name="main">
      <slot name="main-header" />
      <slot name="main-header-after" />
      <slot name="main-content">
        <slot name="ai-summary">
          <EditorialAiSummary v-if="summary" :summary="summary" />
        </slot>
        <div class="markdown-body">
          <ValaxyMd :frontmatter="frontmatter">
            <slot name="main-content-md" />
            <slot />
          </ValaxyMd>
        </div>
        <slot name="main-content-after" />
      </slot>
      <slot name="main-nav-before" />
      <slot name="main-nav" />
      <slot name="main-nav-after" />
      <slot v-if="site.comment.enable && frontmatter.comment !== false" name="comment" />
      <slot name="footer" />
    </slot>
    <slot name="aside" />
  </div>
</template>
