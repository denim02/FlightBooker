// Helper method to get the value of a cookie
export const getCookieValue = (name: string) => (
    document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)')?.pop() || ''
)

// Helper method to remove a cookie
export const removeCookie = (name: string) => {
    document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}