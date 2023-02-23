export interface ResponseBody<T> {
  success: boolean
  body?: T
  message?: string
}
