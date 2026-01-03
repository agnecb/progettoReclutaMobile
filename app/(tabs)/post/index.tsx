// creare nuovo post - app/(tabs)/post/index.tsx
import FloatingNewPostButton from "@/components/atoms/FloatingButton";
import HeaderBack from "@/components/atoms/HeaderBack";
import { colors } from "@/constants/theme";
import { useAuth } from "@/context/AuthContext";
import { createPost } from "@/services/posts";
import { useRouter } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

export default function NewPostScreen() {
    const { user, isAuthenticated } = useAuth();
    const router = useRouter();

    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);

    const handlePublish = async () => {
        if (!user || !content.trim()) return;

        try {
            setLoading(true);
            await createPost({ user_id: user.id, content });
            router.push('/home');
        } catch (err) {
            console.error("Errore creando post:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <HeaderBack title="Nuovo Post" />

            <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
                {!isAuthenticated ? (
                    <Text style={{ textAlign: "center", marginTop: 50, color: "gray" }}>
                        Per pubblicare qualcosa devi essere loggato
                    </Text>
                ) : (
                    <View style={{ gap: 12 }}>
                        <Text style={styles.title}>Cosa vuoi condividere?</Text>
                        <TextInput
                            placeholder="Scrivi il tuo post..."
                            placeholderTextColor={'grey'}
                            value={content}
                            onChangeText={setContent}
                            multiline
                            style={{
                                borderWidth: 1,
                                borderColor: "#ccc",
                                borderRadius: 8,
                                padding: 12,
                                minHeight: 120,
                                fontSize: 15,
                                textAlignVertical: "top",
                                color: colors.textPrimary
                            }}
                        />

                        <Text style={{ fontSize: 12, color: "gray" }}>
                            Supporta Markdown: **grassetto**, _corsivo_, liste, ecc.
                        </Text>

                        <Pressable
                            onPress={handlePublish}
                            disabled={loading || !content.trim()}
                            style={{
                                backgroundColor: colors.onPrimary,
                                paddingVertical: 12,
                                paddingHorizontal: 16,
                                borderRadius: 8,
                                alignSelf: "flex-end",
                                opacity: loading || !content.trim() ? 0.5 : 1
                            }}
                        >
                            <Text style={{ color: "white", fontWeight: "600", fontSize: 15 }}>
                                {loading ? "Pubblicazione..." : "Pubblica"}
                            </Text>
                        </Pressable>
                    </View>
                )}
            </ScrollView>

            <FloatingNewPostButton />
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 60,
        backgroundColor: colors.background,
    },
    title: {
        fontWeight: "bold",
        fontSize: 18,
        color: colors.textPrimary,
        marginTop: 10,
    }
});