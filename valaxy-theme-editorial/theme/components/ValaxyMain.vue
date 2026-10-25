<script setup lang="ts">
import type { PageData, Post } from 'valaxy'
import { useSiteConfig } from 'valaxy'

defineProps<{ frontmatter: Post, data?: PageData }>()
const site = useSiteConfig()
</script>

<template>
  <div class="ed-main">
    <slot name="main">
      <slot name="main-header" />
      <slot name="main-header-after" />
      <slot name="main-content">
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
