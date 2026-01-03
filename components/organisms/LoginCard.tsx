import { colors } from "@/constants/theme";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import Button from "../button";

interface LoginCardProps {
    onLoginSuccess: (username: string, password: string) => Promise<void>;
}

export function LoginCard({ onLoginSuccess }: LoginCardProps) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        setLoading(true);
        await onLoginSuccess(username, password);
        setLoading(false);
    };

    return (
        <View>
            <View style={styles.card}>
                <Text style={styles.title}>Accedi</Text>
                <Text style={styles.description}>
                    Inserisci le tue credenziali per accedere
                </Text>

                <Text style={styles.label}>Username</Text>
                <TextInput
                    placeholder="Username"
                    placeholderTextColor={colors.textSecondary}
                    value={username}
                    onChangeText={setUsername}
                    style={styles.input}
                />

                <Text style={styles.label}>Password</Text>
                <TextInput
                    placeholder="Password"
                    placeholderTextColor={colors.textSecondary}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    style={styles.input}
                />

                <Button variant="primary" onPress={handleSubmit} disabled={loading} style={styles.button}>
                    {loading ? "Attendere..." : "Continua"}
                </Button>
                <View style={styles.registerContainer}>
                    <Text style={styles.registerText}>Non hai un account?</Text>
                    <Pressable onPress={() => router.push('/(auth)/register')}>
                        <Text style={styles.registerLink}> Registrati</Text>
                    </Pressable>
                </View>
            </View>
            {/* pulsante per fase di sviluppo */}
            {/* 
            <View style={styles.buttonsContainer}>
                <Button
                    style={styles.tempButton}
                    variant="secondary"
                    onPress={() => router.replace('/(tabs)/home')}
                >
                    Home
                </Button>
            </View>
            */}
        </View>
    );
}


const styles = StyleSheet.create({
    card: {
        width: '100%',
        maxWidth: 400,
        backgroundColor: colors.card,   // sfondo card dal tema
        padding: 20,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
    },

    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: colors.textPrimary,
        textAlign: 'center',
        marginBottom: 5,
    },

    description: {
        fontSize: 15,
        color: colors.textSecondary,
        textAlign: 'center',
        marginBottom: 20,
    },

    input: {
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 12,
        paddingVertical: 10,
        paddingHorizontal: 15,
        marginBottom: 15,
        backgroundColor: colors.inputBackground,
        color: colors.textPrimary,
    },
    label: {
        color: colors.textPrimary,
        marginBottom: 5,
    },
    button: {
        width: '100%',
        marginTop: 10,
    },

    buttonText: {
        color: colors.onPrimary,
        fontSize: 16,
        fontWeight: 'bold',
    },

    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 0,
    },
    tempButton: {
        backgroundColor: colors.background,
    },

    registerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    registerText: {
        color: colors.textPrimary,
        fontSize: 14,
    },
    registerLink: {
        color: colors.onPrimary,
        fontSize: 14,
        fontWeight: 'bold',
    },
});
