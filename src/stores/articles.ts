import { articleAll } from '@/api/articles/all'
import { articleId } from '@/api/articles/id'
import type { Article } from '@/models/article'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useArticlesStore = defineStore('articles', () => {
  const articles = ref<Article[] | null>([])

  const getArticles = computed<Article[] | null>(() => articles.value)

  async function getAllArticles() {
    try {
      const resp = await articleAll()
      const articleArray = resp.data
      articles.value = articleArray
    } catch (err) {
      console.error(err)
    }
  }

  async function getArticleById(id: number): Promise<Article | null> {
    try {
      const resp = await articleId(id)
      return resp.data as Article
    } catch (err) {
      console.error(err)
      return null
    }
  }

  function clearArticles() {
    articles.value = []
  }

  return { getAllArticles, getArticleById, clearArticles, getArticles }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useArticlesStore, import.meta.hot))
  console.log(`🍍 "${useArticlesStore.$id}" store successfully loaded`)
}
