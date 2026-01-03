import Button from "@/components/button";
import { colors } from "@/constants/theme";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

interface SignUpCardProps {
    onSubmit: (data: { username: string; email: string; password: string }) => void;
}

export default function SignUpCard({ onSubmit }: SignUpCardProps) {
    const [form, setForm] = useState({ username: "", email: "", password: "", confirm: "" });
    const [loading, setLoading] = useState(false);

    const handleSubmit = () => {
        if (form.password !== form.confirm) {
            alert("Le password non coincidono");
            return;
        }
        setLoading(true);
        onSubmit({ username: form.username, email: form.email, password: form.password });
        setLoading(false);
    };

    return (
        <View>
            <View style={styles.card}>
                <Text style={styles.title}>Crea un account</Text>
                <Text style={styles.description}>
                    Inserisci i tuoi dati per registrarti
                </Text>

                <Text style={styles.label}>Username</Text>
                <TextInput
                    placeholder="Username"
                    placeholderTextColor={colors.textSecondary}
                    value={form.username}
                    onChangeText={(val) => setForm({ ...form, username: val })}
                    style={styles.input}
                />
                <Text style={styles.label}>Email</Text>
                <TextInput
                    placeholder="Email"
                    placeholderTextColor={colors.textSecondary}
                    value={form.email}
                    onChangeText={(val) => setForm({ ...form, email: val })}
                    keyboardType="email-address"
                    style={styles.input}
                />
                <Text style={styles.label}>Password</Text>
                <TextInput
                    placeholder="Password"
                    placeholderTextColor={colors.textSecondary}
                    value={form.password}
                    onChangeText={(val) => setForm({ ...form, password: val })}
                    secureTextEntry
                    style={styles.input}
                />
                <Text style={styles.label}>Conferma Password</Text>
                <TextInput
                    placeholder="Conferma Password"
                    placeholderTextColor={colors.textSecondary}
                    value={form.confirm}
                    onChangeText={(val) => setForm({ ...form, confirm: val })}
                    secureTextEntry
                    style={styles.input}
                />

                <Button variant="primary" onPress={handleSubmit} disabled={loading} style={styles.button}>
                    {loading ? "Attendere..." : "Crea account"}
                </Button>
                <View style={styles.loginContainer}>
                    <Text style={styles.loginText}>Hai già un account?</Text>
                    <Pressable onPress={() => router.push('/(auth)/login')}>
                        <Text style={styles.loginLink}> Accedi</Text>
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
    button: {
        width: '100%',
        marginTop: 10,
    },

    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 4,
        gap: 20,
    },
    tempButton: {
        backgroundColor: colors.background,
    },
    label: {
        color: colors.textPrimary,
        marginBottom: 5,
    },

    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    loginText: {
        color: colors.textPrimary,
        fontSize: 14,
    },
    loginLink: {
        color: colors.onPrimary,
        fontSize: 14,
        fontWeight: 'bold',
    },
});
