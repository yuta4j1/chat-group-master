import useSWR from 'swr'
import { getRequest } from '../fetcher'

export const useCustomFetch = <T>(key: string) => {
  const { data, error } = useSWR<T>(key, getRequest)
  return {
    data,
    isError: !!error,
    isLoading: !data && !error,
  }
}
