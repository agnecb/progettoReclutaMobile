import { colors } from "@/constants/theme";
import { useAuth } from "@/context/AuthContext";
import { getUser, updateUser } from "@/services/users";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

export default function ProfileEditScreen() {
    const router = useRouter();
    const { user, refreshUser } = useAuth();

    const [username, setUsername] = useState("");
    const [bio, setBio] = useState("");
    const [loading, setLoading] = useState(true); // loading iniziale
    const [saving, setSaving] = useState(false); // per il pulsante Salva
    const [error, setError] = useState<string | null>(null);

    const [initialData, setInitialData] = useState<{ username: string; bio: string }>({ username: "", bio: "" });

    // Carica i dati dal DB ogni volta che la pagina entra in focus
    useFocusEffect(
        useCallback(() => {
            if (!user) return;

            let active = true;

            const loadUser = async () => {
                try {
                    setLoading(true);
                    const data = await getUser(user.id); // dal DB
                    if (!active) return;

                    const bioValue = data.bio ?? "";
                    setUsername(data.username);
                    setBio(bioValue);

                    // Salvo i valori iniziali per controllare modifiche
                    setInitialData({ username: data.username, bio: bioValue });
                } catch (err) {
                    console.error("Errore caricando utente:", err);
                    Alert.alert("Errore", "Impossibile caricare i dati del profilo");
                } finally {
                    if (active) setLoading(false);
                }
            };
            loadUser();

            return () => { active = false; };
        }, [user?.id])
    );

    const handleSave = async () => {
        if (!user) return;

        setSaving(true);
        setError(null);

        try {
            await updateUser(user.id, { username, bio });
            await refreshUser(); // aggiorno il contesto globale
            router.replace("/profile");
        } catch (err: any) {
            setError(err.message || "Errore durante l'aggiornamento");
        } finally {
            setSaving(false);
        }
    };

    const handleCloseEdit = () => {
        const isModified =
            username.trim() !== initialData.username.trim() ||
            bio.trim() !== initialData.bio.trim();

        if (isModified) {
            Alert.alert(
                "Modifiche non salvate",
                "Hai apportato delle modifiche. Vuoi davvero uscire senza salvare?",
                [
                    { text: "Rimani qui", style: "cancel" },
                    {
                        text: "Esci senza salvare",
                        style: "destructive",
                        onPress: () => router.replace("/profile"),
                    },
                ]
            );
        } else {
            router.replace("/profile");
        }
    };
    const isModified = username !== initialData.username || bio !== initialData.bio;
    const isEmpty = username.trim().length === 0;

    if (loading) {
        return (
            <View style={[styles.flex, { justifyContent: "center", alignItems: "center" }]}>
                <ActivityIndicator size="large" color={colors.onPrimary2} />
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={styles.flex}
        >
            <View style={styles.container}>
                <View style={styles.card}>
                    <Text style={styles.title}>Modifica profilo</Text>

                    {/* USERNAME */}
                    <View style={styles.field}>
                        <Text style={styles.label}>Username</Text>
                        <TextInput
                            value={username}
                            onChangeText={setUsername}
                            style={styles.input}
                            autoCapitalize="none"
                        />
                    </View>

                    {/* BIO */}
                    <View style={styles.field}>
                        <Text style={styles.label}>Bio</Text>
                        <TextInput
                            value={bio}
                            onChangeText={setBio}
                            style={[styles.input, styles.textarea]}
                            multiline
                            numberOfLines={5}
                        />
                    </View>

                    {error && <Text style={styles.error}>{error}</Text>}

                    {/* ACTIONS */}
                    <View style={styles.actions}>
                        <Pressable
                            onPress={handleCloseEdit}
                            disabled={saving}
                            style={styles.cancelButton}
                        >
                            <Text style={styles.cancelText}>Annulla</Text>
                        </Pressable>

                        <Pressable
                            onPress={handleSave}
                            disabled={saving || !isModified || isEmpty}
                            style={({ pressed }) => [
                                styles.saveButton,
                                pressed && styles.pressed,
                                (!isModified || isEmpty || saving) && styles.disabled,
                            ]}
                        >
                            <Text style={styles.saveText}>
                                {saving ? "Salvando..." : "Salva"}
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    flex: { flex: 1, backgroundColor: colors.background, justifyContent: "center" },
    container: { padding: 16, justifyContent: "center" },
    card: { backgroundColor: colors.card, borderRadius: 12, padding: 16 },
    title: { fontSize: 20, fontWeight: "700", color: colors.textPrimary, marginBottom: 20 },
    field: { marginBottom: 16 },
    label: { color: colors.textSecondary, fontSize: 14, marginBottom: 6 },
    input: {
        backgroundColor: colors.background,
        borderWidth: 1,
        borderColor: "#ffffff20",
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        color: colors.textPrimary,
        fontSize: 15,
    },
    textarea: { height: 120, textAlignVertical: "top" },
    error: { color: "#ff6b6b", marginBottom: 12, fontSize: 14 },
    actions: { flexDirection: "row", gap: 12, marginTop: 8 },
    saveButton: {
        flex: 1,
        backgroundColor: colors.onPrimary2,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: "center",
    },
    saveText: { color: "#fff", fontWeight: "600", fontSize: 15 },
    cancelButton: {
        flex: 1,
        backgroundColor: "#636363d2",
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: "center",
    },
    cancelText: { color: "#fff", fontWeight: "600", fontSize: 15 },
    pressed: { opacity: 0.85 },
    disabled: { opacity: 0.6 },
});
