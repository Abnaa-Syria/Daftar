const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface FetchOptions extends RequestInit {
  token?: string;
}

async function fetchApi<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { token, headers: customHeaders, ...rest } = options;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...customHeaders as Record<string, string>,
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers,
    ...rest,
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "حدث خطأ");
  return json;
}

// Public API
export const publicApi = {
  getHomepage: () => fetchApi<ApiResponse>("/public/homepage"),
  getBreaking: () => fetchApi<ApiResponse>("/public/breaking"),
  getSections: () => fetchApi<ApiResponse>("/public/sections"),
  getSection: (slug: string, page = 1) => fetchApi<ApiResponse>(`/public/sections/${slug}?page=${page}`),
  getArticles: (params?: Record<string, string>) => {
    const query = params ? "?" + new URLSearchParams(params).toString() : "";
    return fetchApi<ApiResponse>(`/public/articles${query}`);
  },
  getArticle: (slug: string) => fetchApi<ApiResponse>(`/public/articles/${slug}`),
  getRelated: (slug: string) => fetchApi<ApiResponse>(`/public/articles/${slug}/related`),
  getMostRead: (limit = 10) => fetchApi<ApiResponse>(`/public/most-read?limit=${limit}`),
  getSeries: (slug: string) => fetchApi<ApiResponse>(`/public/series/${slug}`),
  getInfographics: () => fetchApi<ApiResponse>("/public/infographics"),
  getInfographic: (slug: string) => fetchApi<ApiResponse>(`/public/infographics/${slug}`),
  getSpecialFiles: () => fetchApi<ApiResponse>("/public/special-files"),
  getSpecialFile: (slug: string) => fetchApi<ApiResponse>(`/public/special-files/${slug}`),
  getAuthors: () => fetchApi<ApiResponse>("/public/authors"),
  getAuthor: (slug: string, page = 1) => fetchApi<ApiResponse>(`/public/authors/${slug}?page=${page}`),
  getTags: () => fetchApi<ApiResponse>("/public/tags"),
  getTag: (slug: string, page = 1) => fetchApi<ApiResponse>(`/public/tags/${slug}?page=${page}`),
  search: (params: Record<string, string>) => {
    const query = new URLSearchParams(params).toString();
    return fetchApi<ApiResponse>(`/public/search?${query}`);
  },
  getPage: (slug: string) => fetchApi<ApiResponse>(`/public/pages/${slug}`),
  getSettings: () => fetchApi<ApiResponse>("/public/settings"),
  getMenus: (location?: string) => fetchApi<ApiResponse>(`/public/menus${location ? `?location=${location}` : ""}`),
};

// Admin API
export const adminApi = {
  // Auth
  login: (email: string, password: string) =>
    fetchApi<ApiResponse>("/admin/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }),
  getMe: (token: string) =>
    fetchApi<ApiResponse>("/admin/auth/me", { token }),
  refresh: (refreshToken: string) =>
    fetchApi<ApiResponse>("/admin/auth/refresh", { method: "POST", body: JSON.stringify({ refreshToken }) }),

  // Generic CRUD helper
  crud: (resource: string, token: string) => ({
    list: (params?: Record<string, string>) => {
      const query = params ? "?" + new URLSearchParams(params).toString() : "";
      return fetchApi<ApiResponse>(`/admin/${resource}${query}`, { token });
    },
    get: (id: number) => fetchApi<ApiResponse>(`/admin/${resource}/${id}`, { token }),
    create: (data: unknown) => fetchApi<ApiResponse>(`/admin/${resource}`, { token, method: "POST", body: JSON.stringify(data) }),
    update: (id: number, data: unknown) => fetchApi<ApiResponse>(`/admin/${resource}/${id}`, { token, method: "PUT", body: JSON.stringify(data) }),
    remove: (id: number) => fetchApi<ApiResponse>(`/admin/${resource}/${id}`, { token, method: "DELETE" }),
  }),

  // Media
  uploadMedia: async (token: string, file: File, alt?: string) => {
    const formData = new FormData();
    formData.append("file", file);
    if (alt) formData.append("alt", alt);
    const res = await fetch(`${API_BASE}/admin/media/upload`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    return res.json();
  },

  // Settings
  getSettings: (token: string) => fetchApi<ApiResponse>("/admin/settings", { token }),
  upsertSetting: (token: string, setting: { key: string; value: string; group?: string }) =>
    fetchApi<ApiResponse>("/admin/settings", { token, method: "POST", body: JSON.stringify(setting) }),
  updateSettings: (token: string, settings: { key: string; value: string; group?: string }[]) =>
    fetchApi<ApiResponse>("/admin/settings/bulk", { token, method: "PUT", body: JSON.stringify({ settings }) }),
  deleteSetting: (token: string, key: string) =>
    fetchApi<ApiResponse>(`/admin/settings/${encodeURIComponent(key)}`, { token, method: "DELETE" }),

  // Homepage reorder
  reorderHomepage: (token: string, moduleIds: number[]) =>
    fetchApi<ApiResponse>("/admin/homepage-modules/reorder/bulk", { token, method: "PUT", body: JSON.stringify({ moduleIds }) }),
};

interface ApiResponse {
  success: boolean;
  message: string;
  data: unknown;
  meta?: { page: number; limit: number; total: number; totalPages: number };
}

export type { ApiResponse };
