import { logout as apiLogout, getMe } from "@/services/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { createContext, useContext, useEffect, useState } from "react";

interface User {
    id: string;
    username: string;
    email: string;
    bio?: string;
    has_otp?: boolean;
}

interface AuthContextValue {
    user: User | null;
    authToken: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    login: (token: string, userObj: User) => Promise<void>;
    logout: () => Promise<void>;
    setUser: (u: User | null) => void;
    refreshUser: () => Promise<User | null>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// provider dell'auth context
export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [authToken, setAuthToken] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    //const isAuthenticated = !!authToken && !!user;
    const isAuthenticated = !!authToken;

    function normalizeUser(u: any): User {
        return {
            ...u,
            id: String(u.id),
        };
    }

    /* Recupero sessione da AsyncStorage */
    useEffect(() => {
        async function restoreSession() {
            try {
                const storedToken = await AsyncStorage.getItem("authToken");
                const storedUser = await AsyncStorage.getItem("user");

                if (storedToken && storedUser) {
                    setAuthToken(storedToken);
                    setUser(normalizeUser(JSON.parse(storedUser)));
                }
            } catch (e) {
                console.error("Errore restore session", e);
            } finally {
                setLoading(false);
            }
        }

        restoreSession();
    }, []);

    /* Se token ma non user --> chiamata /me */
    useEffect(() => {
        async function fetchUser() {
            if (!authToken || user) return;

            try {
                const res = await getMe();
                const normalized = normalizeUser(res.user);
                setUser(normalized);
                await AsyncStorage.setItem("user", JSON.stringify(normalized));
            } catch (err) {
                console.warn("Token non valido, logout.");
                await handleLogout();
            }
        }

        fetchUser();
    }, [authToken, user]);

    /* LOGIN */
    async function login(token: string, userObj: User) {
        setLoading(true);
        const normalized = normalizeUser(userObj);
        try {
            await Promise.all([
                AsyncStorage.setItem("authToken", token),
                AsyncStorage.setItem("user", JSON.stringify(normalized))
            ]);

            setAuthToken(token);
            setUser(normalized);

            router.replace("/(tabs)/home");

        } catch (err) {
            console.error("Errore login:", err);
        } finally {
            setLoading(false);
        }
    }

    /* LOGOUT */
    async function handleLogout() {
        setLoading(true);
        try {
            await apiLogout();
        } catch {
            console.warn("Logout server failed, continuing");
        }
        await AsyncStorage.multiRemove(["authToken", "user"]);
        setAuthToken(null);
        setUser(null);

        router.replace("/");
        setLoading(false);
    }

    /* REFRESH USER */
    async function refreshUser(): Promise<User | null> {
        try {
            const res = await getMe();
            const normalized = normalizeUser(res.user);

            setUser(normalized);
            await AsyncStorage.setItem("user", JSON.stringify(normalized));

            return normalized;
        } catch (err) {
            console.error("refreshUser failed", err);
            setUser(null);
            await AsyncStorage.removeItem("user");
            return null;
        }
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                authToken,
                isAuthenticated,
                loading,
                login,
                logout: handleLogout,
                setUser,
                refreshUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

// hook che mi permette di usare il context
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used inside AuthProvider");
    return context;
}
