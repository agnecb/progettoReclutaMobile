import { apiFetch } from "../lib/api";
import { authFetch } from "./auth";

// ------------------------------------------------------------
// GET /likes  → lista likes (o conteggio) 
// ------------------------------------------------------------
// GET /likes filtrato per post_id → ritorna count --> funziona
export async function getLikes(postId) {
    const query = `?post_id=${postId}&count=true`;
    const data = await apiFetch(`/likes${query}`);
    return data.count || 0;
}

// GET /likes ritorna la lista di tutti i likes ricevuti per un determinato post 
export async function getLikesList(postId) {
    const query = `?post_id=${postId}`;
    const data = await apiFetch(`/likes${query}`);
    return data.items;
}

// GET /likes filtrato per user_id (conteggio) --> funziona
export async function getUserLikesCount(user_id) {
    const data = await apiFetch(`/likes?user_id=${user_id}&count=true`);
    return data.count;
}
// GET /likes filtrato per user_id (lista) --> funziona
export async function getUserLikes(user_id) {
    const data = await apiFetch(`/likes?user_id=${user_id}`);
    return data.items;
}

// Ritorna solo gli ID dei post a cui l'utente ha messo like
export async function getUserLikedPostIds(user_id) {
    const data = await apiFetch(`/likes?user_id=${user_id}`);
    return data.items.map((like) => like.post_id);
}



// ------------------------------------------------------------
// POST /likes  → metti like a un post (idempotente) 
// body: { post_id }
// ------------------------------------------------------------
export async function likePost(postId) {
    return authFetch("/likes", {
        method: "POST",
        body: JSON.stringify({ post_id: postId })
    });
}

// ------------------------------------------------------------
// DELETE /likes  → rimuove like dell’utente autenticato
// body: { post_id }
// ------------------------------------------------------------
export async function unlikePost(postId) {
    return authFetch("/likes", {
        method: "DELETE",
        body: JSON.stringify({ post_id: postId })
    });
}

export async function getLikeStatus(postId, userId) {
    // 1) total count
    const total = await authFetch(`/likes?post_id=${postId}&count=true`);

    // 2) user liked?
    const userRes = await authFetch(`/likes?post_id=${postId}&user_id=${userId}&count=true`);

    return {
        like_count: total.count,
        liked: userRes.count > 0
    };
}
