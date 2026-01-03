import { LoginCard } from "@/components/organisms/LoginCard";
import { OTPLoginCard } from "@/components/organisms/OTPLoginCard";
import { colors } from "@/constants/theme";
import { useAuth } from "@/context/AuthContext";
import { API_BASE_URL } from "@/lib/api";
import { verifyOtp } from "@/services/auth";
import { useState } from "react";
import { Alert, StyleSheet } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function LoginScreen() {
    const { login } = useAuth();

    const [tempToken, setTempToken] = useState<string | null>(null);

    // Login con username/password
    const handleLoginSuccess = async (username: string, password: string) => {
        try {
            const res = await fetch(`${API_BASE_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || "Errore login");

            if (data.requires_otp) {
                setTempToken(data.temp_token); // mostra OTP
            } else {
                login(data.token, data.user);
            }
        } catch (err: any) {
            Alert.alert("Errore Login", err.message);
        }
    };

    // Verifica OTP
    const handleBackToLogin = () => setTempToken(null);

    const handleOTPVerify = async (otp: string) => {
        if (!tempToken) return;
        try {
            const res = await verifyOtp(tempToken, otp);
            login(res.token, res.user);

        } catch (err: any) {
            Alert.alert("Errore OTP", err.message);
        }
    };


    return (
        <KeyboardAwareScrollView
            style={{ backgroundColor: colors.background }}
            contentContainerStyle={styles.container}
            keyboardShouldPersistTaps="handled"
            enableOnAndroid
            extraScrollHeight={20}
            endFillColor={colors.background}
        >
            {tempToken ? (
                <OTPLoginCard
                    onBack={handleBackToLogin}
                    onVerify={handleOTPVerify}
                />
            ) : (
                <LoginCard onLoginSuccess={handleLoginSuccess} />
            )}
        </KeyboardAwareScrollView>
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        paddingHorizontal: 20,
        justifyContent: "center",
    },
});
