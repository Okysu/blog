<script setup lang="ts">
import friends from '../public/l.json'
</script>

<template>
  <EditorialFriendList :links="friends" random />
</template>
