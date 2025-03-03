import { articleAll } from '@/api/articles/all'
import { articleCreate, type CreateData } from '@/api/articles/create'
import { articleDelete } from '@/api/articles/delete'
import { articleId } from '@/api/articles/id'
import { articleUpdate, type UpdateData } from '@/api/articles/update'
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

  async function updateArticleById(data: UpdateData): Promise<Article | null> {
    try {
      const resp = await articleUpdate(data)
      if (resp.status === 'success') {
        return resp.data as Article
      }
      return null
    } catch (err) {
      console.error(err)
      return null
    } finally {
      clearArticles()
    }
  }

  async function createArticle(data: CreateData): Promise<Article | null> {
    try {
      const resp = await articleCreate(data)
      if (resp.status === 'success') {
        return resp.data as Article
      }
      return null
    } catch (err) {
      console.error(err)
      return null
    } finally {
      clearArticles()
    }
  }

  async function deleteArticle(id: number): Promise<boolean> {
    try {
      const resp = await articleDelete(id)
      if (resp.status === 'success') {
        return true
      }
      return false
    } catch (err) {
      console.error(err)
      return false
    } finally {
      clearArticles()
      await getAllArticles()
    }
  }

  function clearArticles() {
    articles.value = []
  }

  return {
    getAllArticles,
    getArticleById,
    updateArticleById,
    createArticle,
    deleteArticle,
    clearArticles,
    getArticles,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useArticlesStore, import.meta.hot))
  console.log(`🍍 "${useArticlesStore.$id}" store successfully loaded`)
}
