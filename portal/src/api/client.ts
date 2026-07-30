/** Cliente HTTP da Learn Code API — gere o token JWT e os erros de forma central. */

const BASE_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:8001/api';

const TOKEN_KEY = 'lc-token';

export const getToken = (): string | null => localStorage.getItem(TOKEN_KEY);
export const setToken = (token: string): void => localStorage.setItem(TOKEN_KEY, token);
export const clearToken = (): void => localStorage.removeItem(TOKEN_KEY);

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

/** Mensagens amigáveis para estados sem `detail` da API (ex.: infra mal configurada). */
const FRIENDLY_MESSAGES: Record<number, string> = {
  400: 'Pedido inválido. Verifique os dados e tente novamente.',
  403: 'Não tem permissão para esta operação.',
  404: 'Serviço indisponível de momento. Tente novamente em instantes.',
  405: 'Serviço indisponível de momento. Tente novamente em instantes.',
  409: 'Esta operação já não é possível — actualize a página.',
  500: 'Ocorreu um erro no servidor. Tente novamente em instantes.',
  502: 'O servidor está temporariamente indisponível. Tente novamente em instantes.',
  503: 'O servidor está temporariamente indisponível. Tente novamente em instantes.',
};

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> | undefined),
  };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  let response: Response;
  try {
    response = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  } catch {
    throw new ApiError(0, 'Sem ligação ao servidor. Verifique a sua internet e tente novamente.');
  }

  if (response.status === 401) {
    clearToken();
    throw new ApiError(401, 'Sessão expirada. Inicie sessão novamente.');
  }
  if (!response.ok) {
    let detail = FRIENDLY_MESSAGES[response.status] ?? 'Ocorreu um erro inesperado. Tente novamente.';
    try {
      const body = await response.json();
      if (typeof body.detail === 'string') detail = body.detail;
    } catch {
      /* corpo não-JSON — mantém a mensagem amigável */
    }
    throw new ApiError(response.status, detail);
  }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export const http = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'POST', body: body !== undefined ? JSON.stringify(body) : undefined }),
  patch: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
};

/** Download autenticado (ex.: PDF do contrato). */
export async function downloadFile(path: string, filename: string): Promise<void> {
  const token = getToken();
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!response.ok) throw new ApiError(response.status, 'Não foi possível transferir o ficheiro.');
  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
