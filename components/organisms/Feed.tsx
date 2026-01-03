import PostCard from "@/components/molecules/PostCard";
import { ScrollView, Text, View } from "react-native";

export interface Author {
  id: string;
  username: string;
}

export interface Post {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  likes: number;
  comments: number;
  author: Author;
}

interface FeedProps {
  posts: Post[];
}

export default function Feed({ posts }: FeedProps) {
  if (posts.length === 0) {
    return (
      <Text style={{ textAlign: "center", marginTop: 20, color: "#999" }}>
        Nessun post disponibile
      </Text>
    );
  }
  return (
    <ScrollView style={{ flex: 1, padding: 10 }}>
      {posts.map((post, i) => (
        <View key={post.id}>
          <PostCard {...post} />
        </View>
      ))}
    </ScrollView>
  );
}
