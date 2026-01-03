import OTPSignUpCard from "@/components/organisms/OTPSignUpCard";
import SignUpCard from "@/components/organisms/SignUpCard";
import { colors } from "@/constants/theme";
import { signup } from "@/services/auth";
import { router } from "expo-router";
import { useState } from "react";
import { StyleSheet } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";


export default function RegisterScreen() {
    const [step, setStep] = useState<"form" | "otp">("form");
    const [otpSecret, setOtpSecret] = useState("");
    const [qrUrl, setQrUrl] = useState("");

    const handleSignUp = async (data: { username: string; email: string; password: string }) => {
        try {
            const res = await signup(data);

            // Se il backend ha risposto con errore
            if (!res.user || !res.otp_secret) {
                throw new Error(res.error || "Errore registrazione");
            }

            // Salvo otp secret e URL per QR code
            setOtpSecret(res.otp_secret);
            const otpauth = `otpauth://totp/${encodeURIComponent(res.user.username)}?secret=${res.otp_secret}&issuer=MiniTwitter`;
            setQrUrl(otpauth);

            setStep("otp");
        } catch (err: any) {
            alert(err.message);
        }
    };

    const handleContinue = () => {
        router.push("/(auth)/login");
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
            {step === "form" && <SignUpCard onSubmit={handleSignUp} />}
            {step === "otp" && <OTPSignUpCard otpSecret={otpSecret} qrCodeUrl={qrUrl} onContinue={handleContinue} />}
        </KeyboardAwareScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
});
