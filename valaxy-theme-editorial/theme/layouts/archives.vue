<template>
  <Layout>
    <main class="ed-archive">
      <header class="ed-page-header">
        <p class="ed-eyebrow">
          THE ARCHIVE
        </p><h1>文章</h1><p class="ed-subtitle">
          技术、生活，以及还没有想明白的事。
        </p>
      </header>
      <RouterView />
      <EditorialPostList searchable />
    </main>
  </Layout>
</template>
