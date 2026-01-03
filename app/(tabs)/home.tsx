import FloatingNewPostButton from "@/components/atoms/FloatingButton";
import PostCard from "@/components/molecules/PostCard";
import { colors } from "@/constants/theme";
import { getCommentsCount } from "@/services/comments";
import { getLikes } from "@/services/likes";
import { getPosts } from "@/services/posts";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from "react-native";

interface Post {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  author: { id: string; username: string };
}

interface PostWithCounts extends Post {
  likes: number;
  comments: number;
}

export default function HomeScreen() {
  const [posts, setPosts] = useState<PostWithCounts[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      loadPosts(); // questa funzione verrà eseguita ogni volta che torno sulla Home
    }, [])
  );

  // fuori dal'use effect per poterla sfruttare nel refresh
  async function loadPosts() {
    try {
      setLoading(true);
      setError(null);

      const data = await getPosts();

      const postsWithCounts = await Promise.all(
        data.map(async (post: Post) => {
          const [likes, comments] = await Promise.all([
            getLikes(post.id),
            getCommentsCount(post.id),
          ]);
          return { ...post, likes: likes || 0, comments: comments || 0 };
        })
      );
      setPosts(postsWithCounts);
    } catch (err: any) {
      setError(err.message || "Errore nel caricamento dei post");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPosts();
  }, []);


  if (loading || loading && posts.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.onPrimary} />
        <Text style={styles.loadingText}>Caricamento feed...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text style={{ color: "red" }}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>

      <View style={styles.header}>
        <Pressable onPress={loadPosts} style={{ marginHorizontal: 8, }}>
          <Ionicons name="logo-twitter" size={40} color={colors.onPrimary} />
        </Pressable>
      </View>

      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <PostCard {...item} />}
        contentContainerStyle={styles.containerList}

        // Gestione lista vuota
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={{ color: colors.textSecondary }}>Nessun post disponibile</Text>
          </View>
        }

        // Pull to refresh
        refreshing={loading}
        onRefresh={loadPosts}
      />
      <FloatingNewPostButton />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    paddingTop: 20,
    backgroundColor: colors.background,
  },
  header: {
    marginTop: 60,
    alignItems: "center",
    padding: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#dddddd7f'
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
  containerList: {
    paddingBottom: 70, // Spazio extra in fondo
    padding: 15
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100
  }
});
