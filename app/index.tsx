import { colors } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import Button from '../components/button';

export default function IndexScreen() {
    const { isAuthenticated, loading } = useAuth();

    useEffect(() => {
        if (!loading && isAuthenticated) {
            router.replace("/(tabs)/home"); // redirect alla home
        }
    }, [isAuthenticated, loading]);
    if (loading || isAuthenticated) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color={colors.onPrimary} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <View style={styles.iconContainer}>
                    <Ionicons name="logo-twitter" size={100} color={colors.onPrimary}></Ionicons>
                </View>
                <Text style={styles.title}>
                    Benvenuto sul tuo{"\n"}
                    <Text style={styles.boldText}>miniTwitter</Text>
                </Text>
            </View>
            {/* pulsante per fase di sviluppo */}
            {/*
            <View style={styles.tempButtonContainer}>
                <Button variant="secondary"
                    style={styles.tempButton}
                    onPress={() => router.push('/(tabs)/home')}>
                    Home</Button>
            </View>
            */}
            <View style={styles.buttonsContainer}>
                <Button variant="primary"
                    onPress={() => router.push('/(auth)/login')}>
                    Log in</Button>
                <Button variant="secondary"
                    onPress={() => router.push('/(auth)/register')}>
                    Sign Up</Button>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        justifyContent: 'center',
        paddingHorizontal: 20,
        paddingBottom: 60,
    },
    iconContainer: {
        marginBottom: 10,
        alignItems: 'center',
    },
    headerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        color: colors.textPrimary,
        fontSize: 32,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    boldText: {
        color: colors.onPrimary,
        fontWeight: '900',
    },
    buttonsContainer: {
        flexDirection: 'row',
        marginBottom: 10,
        gap: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tempButtonContainer: {
        flexDirection: 'row',
        marginBottom: 60,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tempButton: {
        backgroundColor: colors.onPrimary2,
    },
    centerContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.background,
    },
});