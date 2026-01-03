import { colors } from "@/constants/theme";
import { useAuth } from "@/context/AuthContext";
import { getLikeStatus, likePost, unlikePost } from "@/services/likes";
import { deletePost, updatePost } from "@/services/posts";
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, KeyboardAvoidingView, Modal, Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import Markdown from "react-native-markdown-display";


interface PostCardProps {
    id: string;
    user_id: string;
    content: string;
    created_at: string;
    likes?: number;
    comments?: number;
    author: { id: string; username: string };
}

export default function PostCard({ id, content, created_at, likes = 0, comments = 0, author, }: PostCardProps) {
    const router = useRouter();
    const { user } = useAuth();
    const isOwner = user?.id === author.id;

    const [hasLiked, setHasLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(likes);
    const [postContent, setPostContent] = useState(content);
    const [openEdit, setOpenEdit] = useState(false);
    const [draft, setDraft] = useState(content);
    const [loading, setLoading] = useState(false);


    // Caricamento stato like
    useEffect(() => {
        if (!user) return;
        let active = true;
        const loadStatus = async () => {
            try {
                const status = await getLikeStatus(id, user.id);
                if (active) {
                    setHasLiked(status.liked);
                    setLikeCount(status.like_count);
                }
            } catch (err) {
                console.error("Errore caricamento stato like", err);
            }
        };
        loadStatus();
        return () => { active = false };
    }, [user, id]);

    const handleLike = async () => {
        if (!user) return;
        try {
            if (hasLiked) {
                await unlikePost(id);
                setHasLiked(false);
                setLikeCount(likeCount - 1);
            } else {
                await likePost(id);
                setHasLiked(true);
                setLikeCount(likeCount + 1);
            }
        } catch (err) {
            console.error("Errore like", err);
        }
    };

    const handleDelete = () => {
        Alert.alert(
            "Elimina post",
            "Sei sicuro di voler eliminare questo post?",
            [
                { text: "Annulla", style: "cancel" },
                {
                    text: "Elimina",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await deletePost(id);
                            router.push('/home');
                        } catch (err) {
                            console.error("Errore eliminando post", err);
                        }
                    }
                }
            ]
        );
    };

    const handleSave = async () => {
        try {
            setLoading(true);
            await updatePost(id, { content: draft });
            setPostContent(draft);
            setOpenEdit(false);
        } catch (err) {
            console.error("Errore aggiornando post", err);
        } finally {
            setLoading(false);
        }
    };
    // ogni volta che apro il modale riparto dal contenuto salvato
    useEffect(() => {
        if (openEdit) {
            setDraft(postContent);
        }
    }, [openEdit, postContent]);

    const handleCloseEdit = () => {
        if (isModified) {
            Alert.alert(
                "Modifiche non salvate",
                "Vuoi uscire senza salvare?",
                [
                    { text: "Annulla", style: "cancel" },
                    { text: "Esci", style: "destructive", onPress: () => setOpenEdit(false) }
                ]
            );
        } else {
            setOpenEdit(false);
        }
    };
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const monthNames = ["gen", "feb", "mar", "apr", "mag", "giu", "lug", "ago", "set", "ott", "nov", "dic"];
        const day = date.getDate();
        const month = monthNames[date.getMonth()];
        const hours = date.getHours().toString().padStart(2, "0");
        const minutes = date.getMinutes().toString().padStart(2, "0");
        return `${day} ${month}, ${hours}:${minutes}`;
    };

    const isModified = draft.trim() !== postContent.trim() && draft.trim().length > 0;

    return (
        <Pressable style={styles.card} onPress={() => router.push(`/post/${id}`)}>
            <View style={styles.header}>
                <Pressable onPress={() => router.push(`/user/${author.username}`)}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>{author.username.charAt(0).toUpperCase()}</Text>
                    </View>
                </Pressable>
                <View>
                    <Pressable onPress={() => router.push(`/user/${author.username}`)}>
                        <Text style={styles.username}>@{author.username}</Text>
                    </Pressable>
                    <Text style={styles.date}>{formatDate(created_at)}</Text>
                </View>
                {isOwner && (
                    <Pressable onPress={handleDelete} style={styles.deleteButton}>
                        <Ionicons name="trash-outline" size={20} color="red" />
                    </Pressable>
                )}
            </View>

            <Markdown
                style={{
                    body: { color: "#000", fontSize: 15 },
                    strong: { fontWeight: "700" },
                    em: { fontStyle: "italic" },
                }}
            >
                {postContent}
            </Markdown>

            <View style={styles.footer}>
                <Pressable onPress={handleLike} style={styles.footerButton} disabled={user!.id == author.id ? true : false}>
                    <Ionicons
                        name={hasLiked ? "heart" : "heart-outline"}
                        size={20}
                        color={hasLiked ? "red" : "gray"}
                    />
                    <Text>{likeCount > 0 && likeCount}</Text>
                </Pressable>
                <View style={styles.footerButton}>
                    <Ionicons name="chatbubble-outline" size={20} color="gray" />
                    {comments > 0 && <Text>{comments}</Text>}
                </View>

                {isOwner && (
                    <Pressable onPress={() => setOpenEdit(true)} style={styles.editButton}>
                        <Ionicons name="pencil-outline" size={22} color={colors.background2} />
                    </Pressable>
                )}
            </View>

            {/* MODALE DI MODIFICA */}
            <Modal
                visible={openEdit}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setOpenEdit(false)}
            >
                <View style={styles.modalOverlay}>
                    <KeyboardAvoidingView
                        behavior={Platform.OS === "ios" ? "padding" : "height"}
                        style={styles.modalContent}
                    >
                        <Text style={styles.modalTitle}>Modifica il tuo post</Text>

                        <TextInput
                            style={styles.modalTextInput}
                            multiline
                            value={draft}
                            onChangeText={setDraft}
                            autoFocus={true}
                        />

                        <View style={styles.modalActions}>
                            <Pressable
                                onPress={() => handleCloseEdit()}
                                style={{
                                    flex: 1,
                                    padding: 15,
                                    paddingHorizontal: 16,
                                    paddingVertical: 14,
                                    borderRadius: 8,
                                    alignItems: "center",
                                    backgroundColor: "#f0f0f0",
                                }}
                            >
                                <Text style={{ color: "#000", fontWeight: "600" }}>Annulla</Text>
                            </Pressable>

                            <Pressable
                                onPress={handleSave}
                                disabled={!isModified}
                                style={{
                                    flex: 1,
                                    padding: 15,
                                    alignItems: "center",
                                    alignSelf: "flex-end",
                                    backgroundColor: colors.primary,
                                    paddingHorizontal: 16,
                                    paddingVertical: 14,
                                    borderRadius: 8,
                                    opacity: !isModified ? 0.5 : 1,
                                }}
                            >
                                <Text style={{ color: colors.textPrimary, fontWeight: "600" }}>
                                    {loading ? "Salvando..." : "Salva"}
                                </Text>
                            </Pressable>
                        </View>
                    </KeyboardAvoidingView>
                </View>
            </Modal>
        </Pressable >
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#fff",
        padding: 15,
        marginVertical: 5,
        borderRadius: 12,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 5,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#ccc",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 10,
    },
    avatarText: {
        fontWeight: "bold",
        color: "#fff",
    },
    username: { fontWeight: "bold" },
    date: { fontSize: 12, color: "gray" },
    footer: { flexDirection: "row", gap: 15, marginTop: 10 },
    footerButton: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
    },

    textInput: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 10,
        marginBottom: 5,
    },
    deleteButton: {
        marginLeft: "auto",
        marginRight: 4
    },
    editButton: {
        marginLeft: "auto",
        marginRight: 4
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)", // Sfondo semitrasparente
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    modalContent: {
        width: "100%",
        backgroundColor: "white",
        borderRadius: 20,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        marginBottom: 100,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 15,
        textAlign: "center",
    },
    modalTextInput: {
        borderWidth: 1,
        borderColor: "#eee",
        borderRadius: 10,
        padding: 15,
        minHeight: 120,
        textAlignVertical: "top",
        fontSize: 16,
        marginBottom: 20,
    },
    modalActions: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 10,
        paddingBottom: 15,
    },
});
