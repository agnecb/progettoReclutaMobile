import { apiFetch } from "@/lib/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

/* AUTH FETCH  */
/* funzione dedicata che estende la apiFetch per l'autenticazione
 * authFetch = apiFetch + token JWT automatico
 * Usa sessionStorage.getItem("authToken")
 */
export async function authFetch(path, options = {}) {
    const token = await AsyncStorage.getItem("authToken");

    return apiFetch(path, {
        ...options,
        headers: {
            ...(options.headers || {}),
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        }
    });
}


/* ----- AUTH ENDPOINTS ----- */

/* LOGIN FASE 1 - Richiede username + password
 * Ritorna { temp_token } se OTP abilitata
 */
export async function login(username, password) {
    return apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
    });
}

/**
 * LOGIN FASE 2 - Verifica OTP
 * Riceve temp_token e codice OTP
 * Ritorna access_token (JWT finale)
 */
export async function verifyOtp(tempToken, otpCode) {
    return apiFetch("/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            temp_token: tempToken,
            otp_token: otpCode,
        }),
    });
}

/**
 * REGISTRAZIONE
 */
export async function signup({ username, email, password }) {
    return apiFetch("/auth/register", {
        method: "POST",
        body: JSON.stringify({ username, email, password }),
    });
}

/**
 * SETUP OTP (recupera QR code, secret, ecc.)
 */
export async function setupOtp() {
    return authFetch("/auth/otp/setup", {
        method: "GET",
    });
}

/**
 * STATO OTP (attiva/disattiva)
 */
export function getOtpStatus() {
    return authFetch("/auth/otp/status", {
        method: "GET",
    });
}

/**
 * GET CURRENT USER (richiede JWT)
 */
export async function getMe() {
    return authFetch("/auth/me", {
        method: "GET",
    });
}

/**
 * LOGOUT
 * Rimuove il token e chiama l'endpoint /auth/logout
 */
export function logout() {
    // Backend logout
    apiFetch("/auth/logout", { method: "POST" }).catch(() => { });

    // Logout locale
    if (typeof window !== "undefined") {
        sessionStorage.removeItem("authToken");
    }
}
