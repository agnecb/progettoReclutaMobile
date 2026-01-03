// profilo utente
import FloatingNewPostButton from "@/components/atoms/FloatingButton";
import HeaderBack from "@/components/atoms/HeaderBack";
import PostCard from "@/components/molecules/PostCard";
import { colors } from "@/constants/theme";
import { getComments } from "@/services/comments";
import { getLikes } from "@/services/likes";
import { getUserPosts } from "@/services/posts";
import { getUserByUsername, getUserStats } from "@/services/users";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";

interface Post {
    id: string;
    user_id: string;
    content: string;
    created_at: string;
    likes?: number;
    comments?: number;
    author: { id: string; username: string };
}

interface User {
    id: string;
    username: string;
    bio?: string | null;
    created_at: string;
}

export default function UserProfileScreen() {
    const { username } = useLocalSearchParams<{ username: string }>();
    const [user, setUser] = useState<User | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);
    const [stats, setStats] = useState<{ posts: number; likes: number; comments: number } | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadData() {
            try {
                setLoading(true);
                setError(null);

                const u = await getUserByUsername(username);
                if (!u) {
                    setError("Utente non trovato");
                    return;
                }
                setUser(u);

                const statsData = await getUserStats(u.id);
                setStats(statsData);

                const userPosts = await getUserPosts(u.id);
                const postsWithCounts = await Promise.all(
                    userPosts.map(async (post: Post) => {
                        const [likes, commentsData] = await Promise.all([
                            getLikes(post.id),
                            getComments(post.id),
                        ]);
                        return { ...post, likes, comments: commentsData.count };
                    })
                );
                setPosts(postsWithCounts);
            } catch (err: any) {
                setError(err.message || "Errore nel caricamento");
            } finally {
                setLoading(false);
            }
        }

        if (username) loadData();
    }, [username]);

    const formatJoinDate = (dateString: string) => {
        const date = new Date(dateString);
        const months = ["gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno", "luglio", "agosto", "settembre", "ottobre", "novembre", "dicembre"];
        return `${months[date.getMonth()]} ${date.getFullYear()}`;
    };

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color={colors.onPrimary} />
                <Text style={styles.loadingText}>Caricamento profilo...</Text>
            </View>
        );
    }
    if (error) return <Text style={{ textAlign: "center", marginTop: 20, color: "red" }}>{error}</Text>;
    if (!user) return <Text style={{ textAlign: "center", marginTop: 20 }}>Utente non trovato</Text>;

    return (
        <View style={styles.container}>
            <HeaderBack title={user.username} />
            <ScrollView contentContainerStyle={{ paddingVertical: 16, padding: 10, paddingBottom: 70 }}>

                {/* Header */}
                <View style={styles.header}>

                    {/* Avatar */}
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>
                            {user.username.charAt(0).toUpperCase()}
                        </Text>
                    </View>

                    <Text style={styles.username}>{user.username}</Text>
                    <Text style={styles.tag}>@{user.username}</Text>
                    {user.bio && <Text style={styles.bio}>{user.bio}</Text>}
                    <Text style={styles.date}>Si è unito a {formatJoinDate(user.created_at)}</Text>

                </View>

                {/* Stats */}
                <View style={styles.stats}>
                    <View style={{ alignItems: "center" }}>
                        <Text style={styles.statsNumber}>{stats?.posts ?? 0}</Text>
                        <Text style={{ color: colors.textSecondary }}>Post</Text>
                    </View>
                    <View style={{ alignItems: "center" }}>
                        <Text style={styles.statsNumber}>{stats?.comments ?? 0}</Text>
                        <Text style={{ color: colors.textSecondary }}>Commenti</Text>
                    </View>
                    <View style={{ alignItems: "center" }}>
                        <Text style={styles.statsNumber}>{stats?.likes ?? 0}</Text>
                        <Text style={{ color: colors.textSecondary }}>Mi piace</Text>
                    </View>
                </View>

                {/* Lista post */}
                <View>
                    <Text style={styles.postNumber}>Post ({posts.length})</Text>
                    {posts.map((post) => (
                        <PostCard key={post.id} {...post} />
                    ))}
                </View>

            </ScrollView>
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
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: colors.background2,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 5,
    },
    avatarText: {
        fontWeight: "600",
        fontSize: 35,
        color: colors.onPrimary,
    },
    header: {
        alignItems: "center",
        marginBottom: 16
    },
    username: {
        fontWeight: "bold",
        fontSize: 22,
        color: colors.textPrimary,
    },
    tag: {
        fontSize: 15,
        color: colors.textSecondary,
        marginVertical: 3,
    },
    bio: {
        color: colors.textSecondary,
        fontStyle: "italic",
        textAlign: "center",
        marginVertical: 4
    },
    date: {
        color: colors.textSecondary,
        marginTop: 4
    },
    stats: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        paddingHorizontal: 30,
        marginVertical: 16
    },
    postNumber: {
        color: colors.textPrimary,
        textAlign: "center",
        fontSize: 18,
        marginTop: 10,
        fontWeight: "500",
        marginBottom: 5,
    },
    statsNumber: {
        fontWeight: "bold",
        color: colors.textPrimary,
        fontSize: 18
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