import axios, { AxiosError } from 'axios'
import { ref, type Ref } from 'vue'

const apiInstance = axios.create({
  baseURL: 'https://rateengine.ship.cars',
  timeout: 1000,
  withCredentials: false,
  headers: { 'Content-Type': 'application/json' },
})

export const useFetchData = <T>(url: string) => {
  const response = ref<T | null>(null) as Ref<T | null>
  const error = ref<string | null>(null)
  const loading = ref<boolean>(false)

  const fetchData = async () => {
    loading.value = true
    error.value = null

    try {
      const { data } = await apiInstance.get<T>(url)
      response.value = data
    } catch (e) {
      if (e instanceof AxiosError) {
        error.value = e.message || 'An error occurred while fetching data'
      } else {
        error.value = 'An error occurred'
      }
    } finally {
      loading.value = false
    }
  }

  return { fetchData, data: response, error, loading }
}
