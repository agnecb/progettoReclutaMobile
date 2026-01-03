import { apiFetch } from "../lib/api";
import { authFetch } from "./auth";
import { getCommentsCountByUser } from "./comments";
import { getUserLikesCount } from "./likes";
import { getUserPostsCount } from "./posts";

// ========== USERS API ==========

// GET /users  --> Lista utenti
export async function getUsers({ limit = 20, offset = 0 } = {}) {
    const query = `?limit=${limit}&offset=${offset}`;
    const data = await apiFetch(`/users${query}`);

    return {
        items: data.items.map(u => ({
            id: u.id,
            username: u.username,
            email: u.email,
            bio: u.bio,
            created_at: u.created_at
        })),
        count: data.count,
        limit: data.limit,
        offset: data.offset
    };
}

// GET /users/{id} --> Utente singolo (non espongo l'hashing della password) --> funziona
export async function getUser(id) {
    const u = await apiFetch(`/users/${id}`);
    return {
        id: u.id,
        username: u.username,
        email: u.email,
        bio: u.bio,
        created_at: u.created_at
    };
}

// GET /users?q=username --> per recuperare le informazioni di un utente dato l'username --> funziona
export async function getUserByUsername(username) {
    const data = await apiFetch(`/users?q=${username}`);
    if (!data.items || data.items.length === 0) return null;
    const u = data.items[0];
    return {
        id: u.id,
        username: u.username,
        email: u.email,
        bio: u.bio,
        created_at: u.created_at
    };
}

// funziona! posso usarla anche in profile!!!
export async function getUserStats(user_id) {
    const [posts, likes, comments] = await Promise.all([
        getUserPostsCount(user_id),
        getUserLikesCount(user_id),
        getCommentsCountByUser(user_id)
    ]);

    return { posts, likes, comments };
}

// POST /users --> Creazione nuovo utente
export async function createUser({ username, email, password }) {
    return apiFetch(`/users`, {
        method: "POST",
        body: JSON.stringify({
            username,
            email,
            password
        })
    });
}

// PATCH /users/{id} --> Aggiornamento utente
export async function updateUser(id, updateData) {
    return authFetch(`/users/${id}`, {
        method: "PATCH",
        body: JSON.stringify(updateData),
        headers: {
            "Content-Type": "application/json",
        },
    });
}

// DELETE /users/{id}
export async function deleteUser(id) {
    return apiFetch(`/users/${id}`, {
        method: "DELETE"
    });
}

