export type RequestOptions = RequestInit;

export const request = async <T>(url: string, options?: RequestOptions): Promise<T> => {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}; 