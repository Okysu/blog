<script setup lang="ts">
import { useThemeConfig } from '../composables'

const theme = useThemeConfig()
</script>

<template>
  <EditorialPostList :limit="theme.homePostCount" />
</template>

<route lang="yaml">
meta:
  layout: home
</route>
