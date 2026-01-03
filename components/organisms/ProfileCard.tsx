import { colors } from "@/constants/theme";
import { useAuth } from "@/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";

interface Props {
    username: string;
    email: string;
    bio: string;
}

export default function ProfileCard({ username, email, bio }: Props) {
    const { logout } = useAuth();
    const handleLogout = () => {
        Alert.alert(
            "Logout",
            "Sei sicuro di voler uscire dal tuo account?",
            [
                {
                    text: "Annulla",
                    style: "cancel"
                },
                {
                    text: "Esci",
                    style: "destructive", // Rende il testo rosso su iOS
                    onPress: async () => {
                        try {
                            await logout();
                            // Expo Router gestisce il redirect per la logica di autenticazione nel Root Layout
                        } catch (err) {
                            console.error("Errore durante il logout", err);
                        }
                    }
                }
            ]
        );
    };
    const router = useRouter();

    return (
        <View style={styles.card}>
            <Text style={styles.title}>Informazioni utente</Text>
            <Text style={styles.subtitle}>I tuoi dati personali</Text>

            <Text style={styles.label}>Username</Text>
            <Text style={styles.value}>@{username}</Text>

            <Text style={styles.label}>Email</Text>
            <Text style={styles.value}>{email}</Text>

            <Text style={styles.label}>Bio</Text>
            <Text style={styles.bio}>
                {bio.trim() ? bio : "Nessuna bio aggiunta."}
            </Text>

            <Pressable
                style={styles.primaryButton}
                onPress={() => router.replace("/profile/edit")}
            >
                <Text style={styles.buttonText}>Modifica profilo</Text>
            </Pressable>

            <Pressable style={styles.logoutButton} onPress={handleLogout}>
                <Ionicons name="log-out-outline" size={20} marginRight={4} color={"white"} />
                <Text style={styles.buttonText}>Esci dall'account</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.background2,
        borderRadius: 12,
        padding: 16,
        margin: 15,
        marginBottom: 16,
    },
    title: {
        fontSize: 22,
        fontWeight: "700",
        color: colors.textPrimary,
    },
    subtitle: {
        color: colors.textSecondary,
        marginBottom: 12,
    },
    label: {
        color: colors.textSecondary,
        fontSize: 15,
        marginTop: 12,
    },
    value: {
        fontSize: 16,
        fontWeight: 500,
        color: colors.textPrimary,
    },
    bio: {
        fontStyle: "italic",
        fontSize: 15,
        color: colors.textPrimary,
    },
    primaryButton: {
        marginTop: 16,
        backgroundColor: colors.onPrimary2,
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
    },
    logoutButton: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 8,
        backgroundColor: "#8a2222ff",
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 15
    },
});
