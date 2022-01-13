const API_BASE_PATH = 'http://localhost:1234'

export const getRequest = async <T>(url: string): Promise<T> => {
  try {
    const res = await fetch(API_BASE_PATH + url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    return res.json()
  } catch (err) {
    console.error(err)
    throw err
  }
}

export const postRequest = async <P, T>(url: string, param: P): Promise<T> => {
  try {
    const res = await fetch(API_BASE_PATH + url, {
      method: 'POST',
      body: JSON.stringify(param),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    return res.json()
  } catch (err) {
    console.error(err)
    throw err
  }
}
