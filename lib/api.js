// export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.twitter.server.jetop.com/api";
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://192.168.1.70:4000/api"; // il mio backend

// ---------------------------------------------------
// WRAPPER GENERALE DELLE API
// ---------------------------------------------------
export async function apiFetch(path, options = {}) {
    const res = await fetch(`${API_BASE_URL}${path}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {})
        }
    });

    // Risposte senza corpo
    if (res.status === 204 || res.status === 205) return {};

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
        const err = new Error(data.error || "Errore API");
        err.status = res.status;
        throw err;
    }

    return data;
}
