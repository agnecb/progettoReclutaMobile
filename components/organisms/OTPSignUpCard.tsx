import Button from "@/components/button";
import { colors } from "@/constants/theme";
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Clipboard from 'expo-clipboard';
import { useState } from "react";
import { Linking, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg'; // libreria QR


interface OTPSignUpCardProps {
  otpSecret: string;
  qrCodeUrl: string;
  onContinue: () => void;
}

export default function OTPSignUpCard({ otpSecret, qrCodeUrl, onContinue }: OTPSignUpCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await Clipboard.setStringAsync(otpSecret);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };


  return (
    <View style={styles.card}>
      <Text style={styles.title}>Registrazione completata! 🎉</Text>
      <Text style={styles.description}>Configura l'autenticazione a due fattori</Text>

      <View style={styles.nota}>
        <Text style={styles.notaText}>
          <Text style={styles.notaBold}>Nota: </Text>
          Questo progetto usa un secret OTP condiviso per tutti gli utenti. Configura Google Authenticator una sola volta e potrai accedere con qualsiasi account.
        </Text>
      </View>

      <Text style={styles.step}>Passo 1: Installa Google Authenticator</Text>
      <Pressable
        onPress={() => {
          const url = Platform.select({
            ios: 'https://apps.apple.com/app/google-authenticator/id388497605',
            android: 'https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2',
          });
          if (url) Linking.openURL(url);
        }}
      >
        <Text style={styles.link}>
          Scarica per {Platform.OS === 'ios' ? 'iPhone' : 'Android'} <Ionicons name="open-outline" size={12} color={colors.onPrimary} />
        </Text>
      </Pressable>

      <Text style={styles.step}>Passo 2: Scansiona il QR Code</Text>

      {/* QR Code */}
      <View style={styles.qrContainer}>
        <QRCode value={qrCodeUrl} size={180} />
      </View>

      {/* Secret + Copia */}
      <View style={styles.secretContainer}>
        <TextInput value={otpSecret} editable={false} style={styles.string} />
        <Pressable onPress={handleCopy} style={{ marginTop: 8 }}>
          {copied ? <Ionicons name="checkmark-circle-outline" size={20} color={colors.onPrimary}></Ionicons> : <Ionicons name="copy-outline" size={20} color={colors.onPrimary}></Ionicons>}
        </Pressable>
      </View>

      {/* Continua al Login */}
      <Button variant="primary" onPress={onContinue} style={{ marginTop: 20, width: '100%' }}>
        Continua al Login
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: colors.card,
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  title: { fontSize: 24, fontWeight: "bold", color: colors.textPrimary, textAlign: "center" },
  description: { fontSize: 15, color: colors.textSecondary, textAlign: 'center', marginBottom: 10, marginTop: 10 },
  step: { color: colors.textPrimary, marginTop: 20, fontSize: 17 },
  link: {
    color: colors.onPrimary,
    fontSize: 13,
    marginTop: 8
  },

  qrContainer: {
    alignItems: 'center',
    marginVertical: 15,
  },

  secretContainer: {
    width: '100%',
    marginTop: 10,
    flexDirection: 'row',
    alignContent: 'space-between',
    backgroundColor: colors.inputBackground,
    borderRadius: 8,

  },
  string: {
    color: colors.textPrimary,
    width: '90%',
    padding: 10,
  },

  input: {
    backgroundColor: colors.inputBackground,
    color: colors.textPrimary,
    width: '100%',
    padding: 10,
    borderRadius: 8,
  },

  nota: {
    backgroundColor: colors.background3,
    marginTop: 10,
    marginBottom: 20,
    padding: 15,
    borderRadius: 12,
  },
  notaBold: {
    fontWeight: "bold",
    color: colors.onPrimary
  },
  notaText: {
    color: colors.onPrimary
  },
});
