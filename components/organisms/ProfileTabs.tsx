import CommentCard from "@/components/molecules/CommentCard";
import PostCard from "@/components/molecules/PostCard";
import { colors } from "@/constants/theme";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type TabKey = "posts" | "comments" | "likes";

interface Props {
    posts: any[];
    comments: any[];
    likes: any[];
    commentsCount: number;
}

export default function ProfileTabs({
    posts,
    comments,
    likes,
    commentsCount,
}: Props) {
    const [activeTab, setActiveTab] = useState<TabKey>("posts");

    function TabButton({
        label,
        count,
        tab,
    }: {
        label: string;
        count: number;
        tab: TabKey;
    }) {
        const isActive = activeTab === tab;

        return (
            <Pressable
                onPress={() => setActiveTab(tab)}
                style={[
                    styles.tabButton,
                    isActive && styles.tabButtonActive,
                ]}
            >
                <Text
                    style={[
                        styles.tabText,
                        isActive && styles.tabTextActive,
                    ]}
                >
                    {label} ({count})
                </Text>
            </Pressable>
        );
    }

    return (
        <View style={styles.container}>
            {/* HEADER TABS */}
            <View style={styles.tabsHeader}>
                <TabButton label="Post" count={posts.length} tab="posts" />
                <TabButton label="Commenti" count={commentsCount} tab="comments" />
                <TabButton label="Mi piace" count={likes.length} tab="likes" />
            </View>

            {/* CONTENT */}
            <View style={styles.content}>
                {activeTab === "posts" && (
                    posts.length === 0 ? (
                        <Empty text="Non hai ancora pubblicato post." />
                    ) : (
                        posts.map((p) => (
                            <View key={p.id} style={styles.item}>
                                <PostCard {...p} />
                            </View>
                        ))
                    )
                )}

                {activeTab === "comments" && (
                    comments.length === 0 ? (
                        <Empty
                            text="Ancora nessun commento"
                            subtitle="I commenti che pubblichi appariranno qui."
                        />
                    ) : (
                        comments.map((c) => (
                            <View key={c.id} style={styles.item}>
                                <CommentCard
                                    id={c.id}
                                    content={c.content}
                                    created_at={c.created_at}
                                    author={c.author}
                                    likes={c.likes ?? 0}
                                />
                            </View>
                        ))
                    )
                )}

                {activeTab === "likes" && (
                    likes.length === 0 ? (
                        <Empty
                            text="Ancora nessun like"
                            subtitle="I post a cui metti mi piace appariranno qui."
                        />
                    ) : (
                        likes.map((l) => (
                            <View key={l.id} style={styles.item}>
                                <PostCard {...l} />
                            </View>
                        ))
                    )
                )}
            </View>
        </View>
    );
}

function Empty({ text, subtitle }: { text: string; subtitle?: string }) {
    return (
        <View style={styles.empty}>
            <Text style={styles.emptyText}>{text}</Text>
            {subtitle && <Text style={styles.emptySub}>{subtitle}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 16,
    },
    tabsHeader: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: "#dddddd40",
    },
    tabButton: {
        flex: 1,
        paddingVertical: 12,
        alignItems: "center",
    },
    tabButtonActive: {
        borderBottomWidth: 3,
        borderBottomColor: colors.primary,
    },
    tabText: {
        fontSize: 15,
        color: colors.textSecondary,
        fontWeight: "500",
    },
    tabTextActive: {
        color: colors.textPrimary,
        fontWeight: "700",
    },
    content: {
        marginTop: 12,
        margin: 15,
    },
    item: {
        padding: 0,
    },
    empty: {
        alignItems: "center",
        marginTop: 24,
    },
    emptyText: {
        color: colors.textSecondary,
        fontSize: 16,
        marginTop: 20,
    },
    emptySub: {
        color: colors.textSecondary,
        fontSize: 13,
        marginTop: 4,
        textAlign: "center",
    },
});
