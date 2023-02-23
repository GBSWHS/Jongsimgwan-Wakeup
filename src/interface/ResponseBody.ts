export interface ResponseBody<T> {
  success: boolean
  body?: T
  reason?: string
}
