<script setup lang="ts">
import { usePostList } from 'valaxy'
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { plainText, postTags } from '../client/posts'

const props = defineProps<{ searchable?: boolean, limit?: number, taxonomy?: 'tags' | 'categories' }>()
const source = usePostList()
const route = useRoute()
const router = useRouter()
const facet = computed(() => props.taxonomy === 'categories' ? 'categories' : 'tags')
const queryKey = computed(() => props.taxonomy === 'categories' ? 'category' : 'tag')
const query = ref('')
const selectedQuery = computed(() => route.query[queryKey.value])
const localTag = ref('')
const tag = computed(() => props.taxonomy
  ? typeof selectedQuery.value === 'string' ? selectedQuery.value : ''
  : localTag.value)
function setTag(value: string) {
  localTag.value = value
  if (props.taxonomy)
    router.replace({ query: { ...route.query, [queryKey.value]: value || undefined } })
}
const expandedTags = ref(false)
const published = computed(() => source.value.filter(post => !post.draft && !post.hide))
const tags = computed(() => [...new Set(published.value.flatMap(post => postTags(post[facet.value])))].sort())
const visibleTags = computed(() => expandedTags.value ? tags.value : tags.value.slice(0, 7))
const filtered = computed(() => {
  const search = query.value.trim().toLocaleLowerCase()
  const result = published.value.filter(post =>
    (!tag.value || postTags(post[facet.value]).includes(tag.value))
    && (!search || [post.title, plainText(post.excerpt), plainText(post.description), ...postTags(post.tags), ...postTags(post.categories)]
      .join(' ')
      .toLocaleLowerCase()
      .includes(search)),
  )
  return props.limit ? result.slice(0, Math.max(1, props.limit)) : result
})
function reset() {
  query.value = ''
  setTag('')
}
</script>

<template>
  <section class="ed-posts" aria-label="文章列表">
    <form v-if="searchable" role="search" class="ed-search" @submit.prevent>
      <label class="ed-sr-only" for="editorial-search">搜索文章</label>
      <div class="ed-search-line">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 4 4" /></svg>
        <input id="editorial-search" v-model="query" type="search" placeholder="找一个词，重访一段思考…" autocomplete="off">
        <button v-if="query" type="button" class="ed-clear-search" aria-label="清除关键词" @click="query = ''">
          ×
        </button>
        <span class="ed-search-hint" aria-hidden="true">SEARCH</span>
      </div>
      <div class="ed-tag-filters" role="group" :aria-label="taxonomy === 'categories' ? '按分类筛选' : '按标签筛选'">
        <button type="button" :aria-pressed="!tag" @click="setTag('')">
          全部
        </button>
        <button v-for="item in visibleTags" :key="item" type="button" :aria-pressed="tag === item" @click="setTag(tag === item ? '' : item)">
          {{ item }}
        </button>
        <button v-if="tags.length > 7" type="button" class="ed-more-tags" :aria-expanded="expandedTags" @click="expandedTags = !expandedTags">
          {{ expandedTags ? '收起 −' : '更多 +' }}
        </button>
      </div>
      <p v-if="tag && !visibleTags.includes(tag)" class="ed-filter-note">
        正在筛选：{{ tag }} <button type="button" @click="setTag('')">
          清除
        </button>
      </p>
    </form>
    <div class="ed-section-heading">
      <h2><span class="ed-section-index" aria-hidden="true">{{ searchable ? 'INDEX' : '01' }}</span>{{ searchable ? '所有文字' : '在这里，慢慢写' }}</h2>
      <span v-if="searchable" role="status" aria-live="polite">{{ filtered.length }} / {{ published.length }} 篇</span>
      <RouterLink v-else to="/archives/">
        浏览归档 <span aria-hidden="true">↗</span>
      </RouterLink>
    </div>
    <ul v-if="filtered.length" class="ed-post-list">
      <li v-for="(post, index) in filtered" :key="post.path">
        <EditorialArticleCard :post="post" :featured="!searchable && index === 0" />
      </li>
    </ul>
    <div v-else class="ed-empty">
      <span class="ed-empty-mark" aria-hidden="true">∅</span>
      <h3>{{ query || tag ? '还没有找到这段文字' : '这里的文字，还在路上。' }}</h3>
      <p>{{ query || tag ? '换一个关键词，或看看全部文章。' : '等一段经历，值得被记下来。' }}</p>
      <button v-if="query || tag" class="ed-text-button" @click="reset">
        清除筛选 →
      </button>
    </div>
  </section>
</template>
