import { colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Markdown from "react-native-markdown-display";

interface CommentCardProps {
    id: string;
    content: string;
    created_at: string;
    likes?: number;
    author: {
        id: string;
        username: string;
    };
}

function formatDate(dateString: string) {
    const date = new Date(dateString);
    const monthNames = [
        "gen", "feb", "mar", "apr", "mag", "giu",
        "lug", "ago", "set", "ott", "nov", "dic",
    ];

    return `${date.getDate()} ${monthNames[date.getMonth()]
        }, ${date.getHours().toString().padStart(2, "0")}:${date
            .getMinutes()
            .toString()
            .padStart(2, "0")}`;
}

export default function CommentCard({
    content,
    created_at,
    likes = 0,
    author,
}: CommentCardProps) {
    return (
        <View style={styles.container}>
            {/* Avatar */}
            <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                    {author.username.charAt(0).toUpperCase()}
                </Text>
            </View>

            {/* Card */}
            <View style={styles.card}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.username}>@{author.username}</Text>
                    <Text style={styles.date}>{formatDate(created_at)}</Text>
                </View>

                {/* Content */}
                <View style={styles.content}>
                    <Markdown
                        style={{
                            body: { color: colors.textPrimary, fontSize: 15 },
                            strong: { fontWeight: "700" },
                            em: { fontStyle: "italic" },
                        }}
                    >
                        {content}
                    </Markdown>
                </View>

                {/* Footer */}
                <Pressable
                    onPress={() => console.log("Like comment")}
                    style={styles.footer}
                >
                    <Ionicons
                        name="heart-outline"
                        size={16}
                        color="gray"
                    />
                    {likes > 0 && <Text style={styles.likes}>{likes}</Text>}
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        gap: 12,
        paddingVertical: 6,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.background2,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 5,
    },
    avatarText: {
        fontWeight: "600",
        color: colors.onPrimary,
    },
    card: {
        flex: 1,
        padding: 10,
        borderRadius: 12,
        color: colors.textPrimary,
        backgroundColor: colors.background2,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 5,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    username: {
        fontWeight: "600",
        fontSize: 14,
        color: colors.textPrimary,
        //textDecorationLine: 'underline'
    },
    date: {
        fontSize: 12,
        color: "#9ca3af",
    },
    content: {
        marginTop: 2,
        fontSize: 15,
    },
    footer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        marginTop: 5,
    },
    likes: {
        fontSize: 12,
        color: "#9ca3af",
    },
});
