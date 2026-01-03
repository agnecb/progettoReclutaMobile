import { apiFetch } from "../lib/api";
import { authFetch } from "@/services/auth";

// ========== POSTS API ==========

// GET /posts  → Lista post --> funziona (feed)
export async function getPosts() {
    const data = await apiFetch(`/posts`);
    return data.items.map(post => ({
        id: post.id,
        content: post.content,
        created_at: post.created_at,
        user_id: post.user_id,
        author: post.users ? {
            id: post.users.id,
            username: post.users.username
        } : undefined,
        likes: 0,                     // placeholder
        comments: 0                   // placeholder
    }));
}


// GET /posts/{id} → Post singolo --> funziona
export async function getPost(id) {
    const post = await apiFetch(`/posts/${id}`);
    return {
        id: post.id,
        user_id: post.user_id,
        content: post.content,
        created_at: post.created_at,
        author: post.users ? {
            id: post.users.id,
            username: post.users.username
        } : undefined
    };
}

// GET /posts --> lista filtrata per user_id --> funziona
export async function getUserPosts(user_id) {
    const res = await apiFetch(`/posts?user_id=${user_id}`);
    return res.items.map(post => ({
        id: post.id,
        content: post.content,
        created_at: post.created_at,
        user_id: post.user_id,
        author: post.users ? {
            id: post.users.id,
            username: post.users.username
        } : undefined,
        likes: 0,                     // placeholder
        comments: 0                   // placeholder
    }));
}

// GET /posts --> conteggio filtrato per user_id
export async function getUserPostsCount(user_id) {
    const data = await apiFetch(`/posts?user_id=${user_id}&count=true`);
    return data.count;
}


// POST /posts → Creazione nuovo post
export async function createPost(postData) {
    return authFetch('/posts', {
        method: 'POST',
        body: JSON.stringify(postData),
    });
}


// PATCH /posts/{id} → Aggiornamento post --> fallisce senza autenticazione!! giustamente
export async function updatePost(id, updateData) {
    return authFetch(`/posts/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(updateData),
    });
}


// DELETE /posts/{id}
export async function deletePost(id) {
    return authFetch(`/posts/${id}`, {
        method: 'DELETE',
    });
}
