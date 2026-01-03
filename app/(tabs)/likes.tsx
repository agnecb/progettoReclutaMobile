import FloatingNewPostButton from "@/components/atoms/FloatingButton";
import PostCard from "@/components/molecules/PostCard";
import { colors } from "@/constants/theme";
import { useAuth } from "@/context/AuthContext";
import { getComments } from "@/services/comments";
import { getLikes } from "@/services/likes";
import { getUserPosts } from "@/services/posts";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";

interface Post {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  author: { id: string; username: string };
}

interface PostWithLikes extends Post {
  likesCount: number;
  commentsCount: number;
}

export default function LikesScreen() {
  const { user, loading: authLoading } = useAuth();

  const [posts, setPosts] = useState<PostWithLikes[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  async function loadLikes(isPullRefresh = false) {
    try {
      // Se è il primo caricamento, mostro lo spinner centrale
      // Se è un pull-to-refresh, uso solo la rotellina della lista
      if (isPullRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const myPosts = await getUserPosts(user!.id);

      const enriched = await Promise.all(
        myPosts.map(async (post: Post) => {
          const [likes, comments] = await Promise.all([
            getLikes(post.id),
            getComments(post.id),
          ]);

          return {
            ...post,
            likesCount: likes || 0,
            commentsCount: comments.count || 0,
          };
        })
      );
      const likedPosts = enriched
        .filter(p => p.likesCount > 0)
        .sort(
          (a, b) =>
            new Date(b.created_at).getTime() -
            new Date(a.created_at).getTime()
        );
      setPosts(likedPosts);
    } catch (err: any) {
      setError(err.message || "Errore nel recupero dei like");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLoading(false);
      return;
    }
    loadLikes();
  }, [user, authLoading]);

  // Componente "notifica like" (box sopra il post, con icone utenti che hanno messo like)
  function LikeNotification({ likes }: { likes: number }) {
    if (likes <= 0) return null;
    const maxVisible = 3;
    const visible = Math.min(likes, maxVisible);
    const remaining = likes - maxVisible;

    return (
      <View style={styles.likeBox}>
        <View style={styles.avatarRow}>
          {Array(visible)
            .fill(null)
            .map((_, idx) => (
              <View key={idx} style={styles.avatar}>
                <Ionicons name="heart-sharp" size={14} color="#fff" />
              </View>
            ))}

          {remaining > 0 && (
            <View style={[styles.avatar, styles.moreAvatar]}>
              <Text style={styles.moreText}>+{remaining}</Text>
            </View>
          )}
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles.likeText}>
            {likes === 1 && "Un utente ha messo \"Mi piace\" al tuo post"}
            {likes === 2 && "Due utenti hanno messo \"Mi piace\" al tuo post"}
            {likes >= 3 && "Tre o più utenti hanno messo \"Mi piace\" al tuo post"}
          </Text>

          <Text style={styles.likeCount}>
            Piace a {likes} utent{likes > 1 ? 'i' : 'e'}
          </Text>
        </View>
      </View>
    );
  }

  // Componente helper per stati vuoti
  function CenteredText({
    text,
    subtitle,
    error,
  }: {
    text: string;
    subtitle?: string;
    error?: boolean;
  }) {
    return (
      <View style={styles.center}>
        <Text style={[styles.centerText, error && { color: "red" }]}>
          {text}
        </Text>
        {subtitle && (
          <Text style={styles.subtitle}>{subtitle}</Text>
        )}
      </View>
    );
  }

  /* UI STATES */
  if (authLoading) {
    return <CenteredText text="Caricamento..." />;
  }

  if (!user) {
    return (
      <CenteredText text="Devi essere loggato per vedere i like ricevuti." />
    );
  }

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.onPrimary} />
        <Text style={styles.loadingText}>Caricamento likes...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <CenteredText text={error} error />
    );
  }

  /* LISTA */
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.textHeader}>Likes</Text>
      </View>

      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ flexGrow: 1, padding: 16, paddingBottom: 120 }}

        ListEmptyComponent={
          // Se non sta caricando nulla e la lista è vuota, mostra il testo
          !loading ? (
            <View style={styles.center}>
              <CenteredText
                text="Ancora nessun like ricevuto"
                subtitle="I like ricevuti ai tuoi post appariranno qui."
              />
            </View>
          ) : null
        }

        renderItem={({ item }) => (
          <View style={styles.postWrapper}>
            <LikeNotification likes={item.likesCount} />
            <PostCard {...item} likes={item.likesCount} comments={item.commentsCount} />
          </View>
        )}

        // PULL TO REFRESH CONFIGURATO
        refreshing={refreshing} 
        onRefresh={() => loadLikes(true)}
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
  postWrapper: {
    marginBottom: 24,
  },
  likeBox: {
    flexDirection: "row",
    justifyContent: "flex-start",
    gap: 10,
    padding: 12,
    borderRadius: 8,
    backgroundColor: colors.background2,
    borderWidth: 1,
    borderColor: "#dddddd40",
    marginBottom: 8,
  },
  likeText: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.textPrimary
  },
  likeCount: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  centerText: {
    fontSize: 16,
    textAlign: "center",
    color: "#9ca3af",
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
  subtitle: {
    fontSize: 13,
    color: "#6b7280",
    marginTop: 6,
    textAlign: "center",
  },
  avatarRow: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#ef4444",
    justifyContent: "center",
    alignItems: "center",
    marginRight: -8,
    borderWidth: 2,
    borderColor: colors.background,
  },
  moreAvatar: {
    backgroundColor: "#334155",
  },
  moreText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  header: {
    marginTop: 0,
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#dddddd7f'
  },
  textHeader: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: 'bold'
  }
});
