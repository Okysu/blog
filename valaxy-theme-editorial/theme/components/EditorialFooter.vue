<script setup lang="ts">
import { useSiteConfig } from 'valaxy'
import { useThemeConfig } from '../composables'

const site = useSiteConfig()
const theme = useThemeConfig()
// A single configured year avoids server/client date differences at New Year.
</script>

<template>
  <footer class="ed-footer">
    <div>
      <span v-if="theme.footer.since">© {{ theme.footer.since }} · </span>{{ site.author.name }}<p v-if="theme.footer.text">
        {{ theme.footer.text }}
      </p>
    </div>
    <div class="ed-footer-links">
      <a v-if="theme.footer.beian" href="https://beian.miit.gov.cn/" rel="noreferrer">{{ theme.footer.beian }}</a>
      <a href="https://valaxy.site">Valaxy</a><span aria-hidden="true">/</span><span>Editorial</span>
    </div>
  </footer>
</template>
