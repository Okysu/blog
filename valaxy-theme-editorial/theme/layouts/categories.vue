<template>
  <Layout>
    <main class="ed-archive">
      <header class="ed-page-header">
        <p class="ed-eyebrow">
          COLLECTIONS
        </p><h1>分类</h1><p class="ed-subtitle">
          把不同方向的文字，慢慢归在一起。
        </p>
      </header>
      <RouterView />
      <EditorialPostList searchable taxonomy="categories" />
    </main>
  </Layout>
</template>
