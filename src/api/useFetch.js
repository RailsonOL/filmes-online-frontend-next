import useSWR from 'swr'

const useFetch = route => {
  const baseUrl = process.env.API_URL

  let url = baseUrl + route

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
