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

// 条件付きフェッチ
export const useConditionalFetch = <T>(key: string, fnCond: () => boolean) => {
  const { data, error } = useSWR<T>(fnCond() ? key : null, getRequest)
  return {
    data,
    isError: !!error,
    isLoading: !data && !error,
  }
}
