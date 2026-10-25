<template>
  <Layout>
    <main class="ed-archive">
      <header class="ed-page-header">
        <p class="ed-eyebrow">
          BY TOPIC
        </p><h1>标签</h1><p class="ed-subtitle">
          顺着一个词，找到相关的思考。
        </p>
      </header>
      <RouterView />
      <EditorialPostList searchable taxonomy="tags" />
    </main>
  </Layout>
</template>
