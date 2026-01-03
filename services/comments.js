import { apiFetch } from "../lib/api";
import { authFetch } from "./auth";

// ------------------------------------------------------------
// GET /comments  → lista commenti filtrabile per post_id
// ------------------------------------------------------------
export async function getComments(postId) {
    const query = postId ? `?post_id=${postId}` : "";
    const data = await apiFetch(`/comments${query}`);
    return {
        items: data.items.map(c => ({
            id: c.id,
            post_id: c.post_id,
            user_id: c.user_id,
            content: c.content,
            created_at: c.created_at,
            author: c.users ? {
                id: c.users.id,
                username: c.users.username
            } : undefined
        })),
        count: data.count || 0
    };
}

// GET /comments --> conteggio filtrato per post_id
export async function getCommentsCount(postId) {
    const query = `?post_id=${postId}&count=true`;
    const data = await apiFetch(`/comments${query}`);
    return data.count || 0;
}



// PROVO A PRENDERE I COMMENTI DI UNO USER
export async function getCommentsByUser(userId) {
    const data = await apiFetch(`/comments?limit=5000`); // evita paginazione
    return (data.items || [])
        .filter(c => c.user_id === userId)
        .map(c => ({
            id: c.id,
            post_id: c.post_id,
            user_id: c.user_id,
            content: c.content,
            created_at: c.created_at,
            author: {
                id: c.users.id,
                username: c.users.username,
            }
        }));
}

// GET /comments --> conteggio filtrato per user_id --> !!!! NON funziona perchè lo swagger mostra che si può filtrare per post_id non user...
export async function getCommentsCountByUser(userId) {
    const all = await getCommentsByUser(userId);
    return all.length;
}

// GET /comments/{id} → dettaglio di un singolo commento (id del commento)
export async function getComment(id) {
    const c = await apiFetch(`/comments/${id}`);
    return {
        id: c.id,
        post_id: c.post_id,
        user_id: c.user_id,
        content: c.content,
        created_at: c.created_at,
        user: c.users ? {
            id: c.users.id,
            username: c.users.username
        } : null,
    }
}

// ------------------------------------------------------------
// POST /comments  → crea nuovo commento (autenticato)
// body: { post_id, content }
// ------------------------------------------------------------
export async function createComment(postId, content) {
    return authFetch("/comments", {
        method: "POST",
        body: JSON.stringify({
            post_id: postId,
            content
        })
    });
}

// ------------------------------------------------------------
// PATCH /comments/{id}  → aggiorna commento (owner-only)
// ------------------------------------------------------------
export async function updateComment(id, content) {
    return authFetch(`/comments/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ content })
    });
}

// ------------------------------------------------------------
// DELETE /comments/{id} → elimina commento (owner-only)
// ------------------------------------------------------------
export async function deleteComment(id) {
    return authFetch(`/comments/${id}`, {
        method: "DELETE"
    });
}
