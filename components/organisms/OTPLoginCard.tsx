import { colors } from "@/constants/theme";
import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import Button from "../button";

interface OTPLoginCardProps {
    onVerify: (otp: string) => Promise<void>;
    onBack: () => void;
}

export function OTPLoginCard({ onVerify, onBack }: OTPLoginCardProps) {
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        try {
            setLoading(true);
            await onVerify(otp);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.card}>
            <Text style={styles.title}>Verifica OTP</Text>
            <Text style={styles.description}>
                Inserisci il codice OTP da Google Authenticator
            </Text>

            <Text style={styles.label}>Codice OTP</Text>
            <TextInput
                placeholder="123456"
                placeholderTextColor={colors.textSecondary}
                value={otp}
                onChangeText={setOtp}
                keyboardType="numeric"
                style={styles.input}
            />
            <Text style={styles.bottomDescription}>Inserisci il codice a 6 cifre da Google Authenticator </Text>
            <View style={styles.buttonsContainer}>
                <Button
                    variant="primary"
                    onPress={handleSubmit}
                    disabled={loading}
                    style={styles.button}
                >
                    {loading ? "Verifica..." : "Verifica e Accedi"}
                </Button>
                <Button variant="secondary" onPress={onBack} style={styles.button}>
                    Torna indietro
                </Button>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        width: "100%",
        maxWidth: 400,
        backgroundColor: colors.card,
        padding: 20,
        borderRadius: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
    },
    title: {
        fontSize: 26,
        fontWeight: "bold",
        color: colors.textPrimary,
        textAlign: "center",
        marginBottom: 5,
    },
    description: {
        fontSize: 15,
        color: colors.textSecondary,
        textAlign: "center",
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 12,
        paddingVertical: 10,
        paddingHorizontal: 15,
        marginBottom: 10,
        backgroundColor: colors.inputBackground,
        color: colors.textPrimary,
    },
    button: {
        width: "100%",
    },
    label: {
        color: colors.textPrimary,
        marginBottom: 5,
    },
    bottomDescription: {
        fontSize: 15,
        color: colors.textSecondary,
        marginBottom: 20,
    },
    buttonsContainer: {
        marginTop: 10,
        width: '100%',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: 0,
    }
});
