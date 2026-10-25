<script setup lang="ts">
import { useAppStore, useSiteConfig } from 'valaxy'
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useThemeConfig } from '../composables'
import EditorialLink from './EditorialLink.vue'

const site = useSiteConfig()
const theme = useThemeConfig()
const app = useAppStore()
const route = useRoute()
const open = ref(false)
const menuButton = ref<HTMLButtonElement>()
function closeMenu() {
  if (open.value) {
    open.value = false
    menuButton.value?.focus()
  }
}
watch(() => route.path, () => {
  open.value = false
})
</script>

<template>
  <header class="ed-nav" @keydown.esc="closeMenu">
    <RouterLink to="/" class="ed-wordmark" aria-label="返回首页">
      {{ theme.wordmark || site.author.name || site.title }}<span aria-hidden="true">.</span>
    </RouterLink>
    <button ref="menuButton" class="ed-menu-button" aria-controls="editorial-navigation" :aria-expanded="open" @click="open = !open">
      {{ open ? '收起' : '菜单' }}
    </button>
    <nav id="editorial-navigation" class="ed-nav-links" :class="{ 'is-open': open }" aria-label="主导航">
      <EditorialLink v-for="item in theme.nav" :key="item.link" :to="item.link">
        {{ item.text }}
      </EditorialLink>
    </nav>
    <button class="ed-appearance" aria-label="切换浅色与深色外观" title="切换外观" @click="app.toggleDark()">
      <svg class="ed-moon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
        <path d="M20.9 13.2A9 9 0 0 1 10.8 3.1 9 9 0 1 0 20.9 13.2Z" />
      </svg>
      <svg class="ed-sun" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
        <circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" />
      </svg>
    </button>
  </header>
</template>
