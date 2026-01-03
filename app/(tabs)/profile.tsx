import FloatingNewPostButton from "@/components/atoms/FloatingButton";
import ProfileCard from "@/components/organisms/ProfileCard";
import ProfileTabs from "@/components/organisms/ProfileTabs";
import { colors } from "@/constants/theme";
import { useAuth } from "@/context/AuthContext";
import { getCommentsByUser, getCommentsCount, getCommentsCountByUser } from "@/services/comments";
import { getLikes, getUserLikedPostIds } from "@/services/likes";
import { getPost, getUserPosts } from "@/services/posts";
import { getUser } from "@/services/users";
import { useEffect, useState } from "react";
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";

export default function ProfileScreen() {
  const { user: authUser, loading: authLoading } = useAuth();

  const [user, setUser] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [comments, setComments] = useState<any[]>([]);
  const [likes, setLikes] = useState<any[]>([]);
  const [commentsCount, setCommentsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [refreshing, setRefreshing] = useState(false);

  async function loadProfile(isPullRefresh = false) {
    if (!authUser) {
      setLoading(false);
      return;
    }

    try {
      // Se è un refresh manuale non blocco l'intera UI
      if (isPullRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      // Dati Utente
      const freshUser = await getUser(authUser.id);
      setUser(freshUser);

      // Post dell'utente
      const userPosts = await getUserPosts(authUser.id);
      const postsWithCounts = await Promise.all(
        userPosts.map(async (post: any) => {
          const [likesCount, commsCount] = await Promise.all([
            getLikes(post.id),
            getCommentsCountByUser(post.id),
          ]);
          return { ...post, likes: likesCount, comments: commsCount };
        })
      );
      setPosts(postsWithCounts);

      // Commenti
      const userComments = await getCommentsByUser(authUser.id);
      setComments(userComments);
      setCommentsCount(userComments.length);

      // Like messi dall'utente
      const likedIds = await getUserLikedPostIds(authUser.id);
      const likedPosts = await Promise.all(
        likedIds.map(async (postId: string) => {
          const post = await getPost(postId);
          const [likesCount, commsCount] = await Promise.all([
            getLikes(post.id),
            getCommentsCount(post.id),
          ]);
          return { ...post, likes: likesCount, comments: commsCount };
        })
      );
      setLikes(likedPosts);

    } catch (err: any) {
      setError(err.message || "Errore nel caricamento del profilo");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    if (authLoading) return;
    loadProfile();
  }, [authUser, authLoading]);


  if (authLoading || loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.onPrimary} />
        <Text style={styles.loadingText}>Caricamento profilo...</Text>
      </View>
    );
  }

  if (!authUser) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Devi essere loggato per vedere il profilo.</Text>
      </View>
    );
  }
  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={[styles.errorText, { color: "red" }]}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.textHeader}>Profile</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => loadProfile(true)} 
            tintColor={colors.onPrimary}  // ios
            colors={[colors.onPrimary]}   // android
          />
        }
      >
        <ProfileCard
          username={user.username}
          email={user.email}
          bio={user.bio || ""}
        />

        <ProfileTabs
          posts={posts}
          comments={comments}
          likes={likes}
          commentsCount={commentsCount}
        />

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
  content: {
    paddingBottom: 120,
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
  errorText: {
    fontSize: 16,
    textAlign: "center",
    color: colors.textPrimary,
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
