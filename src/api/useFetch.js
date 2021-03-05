import useSWR from 'swr'
import { server } from '../../config'

const useFetch = route => {
  const baseUrl = server + '/api'

  const url = baseUrl + route

  const { data, error } = useSWR(
    url,
    async url => {
      const response = await fetch(url)
      const data = await response.json()
      return data
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshWhenHidden: false,
      revalidateOnMount: true
    }
  )

  return { data, error }
}

export default useFetch
