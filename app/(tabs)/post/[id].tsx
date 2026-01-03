import FloatingNewPostButton from "@/components/atoms/FloatingButton";
import HeaderBack from "@/components/atoms/HeaderBack";
import CommentCard from "@/components/molecules/CommentCard";
import PostCard from "@/components/molecules/PostCard";
import { colors } from "@/constants/theme";
import { useAuth } from "@/context/AuthContext";
import { createComment, getComments } from "@/services/comments";
import { getLikes } from "@/services/likes";
import { getPost } from "@/services/posts";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

export default function PostScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { user, isAuthenticated } = useAuth();

    const [post, setPost] = useState<any>(null);
    const [comments, setComments] = useState<any[]>([]);
    const [likes, setLikes] = useState(0);

    const [newComment, setNewComment] = useState("");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!id) return;

        async function load() {
            try {
                setLoading(true);

                const postData = await getPost(id);
                const [likesCount, commentsData] = await Promise.all([
                    getLikes(id),
                    getComments(id),
                ]);

                setPost({
                    ...postData,
                    author: postData.author ?? {
                        id: "unknown",
                        username: "unknown",
                    },
                });

                setLikes(likesCount);
                setComments(commentsData.items.reverse());
            } finally {
                setLoading(false);
            }
        }

        load();
    }, [id]);

    async function handleAddComment() {
        if (!newComment.trim() || !id) return;

        try {
            setSubmitting(true);
            const comment = await createComment(id, newComment.trim());
            setComments((prev) => [
                {
                    ...comment,
                    author: {
                        id: user!.id,
                        username: user!.username,
                    },
                },
                ...prev,
            ]);
            setNewComment("");
        } finally {
            setSubmitting(false);
        }
    }

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color={colors.onPrimary} />
                <Text style={styles.loadingText}>Caricamento post...</Text>
            </View>
        );
    }

    if (!post) {
        return <Text style={{ marginTop: 40, padding: 40, textAlign: "center", color: colors.textSecondary }}>Post non trovato</Text>;
    }
    const isDisabled = !isAuthenticated || submitting || newComment.trim().length === 0;
    return (
        <View style={styles.container}>
            <HeaderBack title="Post" />
            <FlatList
                data={comments}
                contentContainerStyle={{ padding: 16, paddingBottom: 70 }}
                keyExtractor={(item) => item.id}
                ListHeaderComponent={
                    <>
                        {/* POST */}
                        <PostCard
                            id={post.id}
                            content={post.content}
                            user_id={post.user_id}
                            likes={likes}
                            comments={comments.length}
                            created_at={post.created_at}
                            author={post.author}
                        />

                        {/* FORM COMMENTO */}
                        <View style={styles.commentForm}>
                            <TextInput
                                placeholder="Scrivi un commento..."
                                placeholderTextColor={'grey'}
                                value={newComment}
                                onChangeText={setNewComment}
                                multiline
                                style={styles.input}
                            />

                            <Pressable
                                onPress={handleAddComment}
                                disabled={isDisabled}
                                style={{
                                    alignSelf: "flex-end",
                                    backgroundColor: colors.onPrimary,
                                    paddingHorizontal: 16,
                                    paddingVertical: 12,
                                    borderRadius: 8,
                                    opacity: isDisabled ? 0.5 : 1
                                }}
                            >
                                <Text style={{ color: "white", fontWeight: "600", fontSize: 15 }}>
                                    {submitting ? "Invio..." : "Commenta"}
                                </Text>
                            </Pressable>
                        </View>
                    </>
                }
                renderItem={({ item }) => (
                    <CommentCard
                        id={item.id}
                        content={item.content}
                        author={item.author}
                        created_at={item.created_at}
                    />
                )}
                ListEmptyComponent={
                    <Text style={styles.info}>
                        Ancora nessun commento. Sii il primo a commentare!
                    </Text>
                }
            />
            <FloatingNewPostButton />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 60,
        backgroundColor: colors.background,
    },
    info: {
        textAlign: "center",
        marginTop: 20,
        color: colors.textSecondary
    },
    commentForm: {
        paddingVertical: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: "#dddddd71",
        color: colors.textPrimary,
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
    },
    centerContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.background,
        padding: 20,
    },
    loadingText: {
        marginTop: 15,
        fontSize: 16,
        color: colors.textSecondary,
    },
});
