<template>
  <div class="ed-shell">
    <a class="ed-skip" href="#main-content">跳至正文</a>
    <EditorialNav />
    <div id="main-content" tabindex="-1" class="ed-content">
      <slot><RouterView /></slot>
    </div>
    <EditorialFooter />
  </div>
</template>
