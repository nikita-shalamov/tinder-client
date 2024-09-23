export interface IRequest {
        url: string
        method?: "GET" | "POST" | "PUT" | "DELETE";
        body?: object | FormData | null | string
        headers?: Record<string, string>
        token?: string | null
}