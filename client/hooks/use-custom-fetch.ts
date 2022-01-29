import useSWR from 'swr'
import useSWRInfinite from 'swr/infinite'
import { getRequest } from '../fetcher'

export const useCustomFetch = <T>(key: string) => {
  const { data, error } = useSWR<T>(key, getRequest)
  return {
    data,
    isError: !!error,
    isLoading: !data && !error,
  }
}

const getKeyCb =
  (url: string) => (pageIndex: number, previousPageData: any) => {
    if (url === '') return null
    if (pageIndex === 0) {
      return url
    } else {
      if (!previousPageData) return null
      if (previousPageData.cursor === '') {
        // 最終pageまで到達した場合、リクエストを投げない
        return null
      } else {
        return `${url}?cursor=${previousPageData.cursor}`
      }
    }
  }

export const useChannelConversationsHisotryFetch = <T>(chId?: string) => {
  const urlPath = chId ? `/channels/${chId}/conversations` : ''
  const { data, error, size, setSize, mutate } = useSWRInfinite<T>(
    getKeyCb(urlPath),
    getRequest
  )
  return {
    data,
    keyedMutate: mutate,
    isError: !!error,
    isLoading: !data && !error,
    nextFetch: () => setSize(size + 1),
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
