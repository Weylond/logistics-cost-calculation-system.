export default async function api<T>(url: string, method: string, body: object): Promise<T> {
    const response = await fetch(url, {
        body: JSON.stringify(body),
        method: method
    })
    if (!response.ok) {
        throw new Error(response.statusText)
    }
    return await (response.json() as Promise<T>)
}