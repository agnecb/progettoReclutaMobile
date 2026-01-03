import { colors } from "@/constants/theme";
import { useAuth } from "@/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { router } from "expo-router";
import { StyleSheet, TouchableOpacity } from "react-native";

export default function FloatingNewPostButton() {
    const { user } = useAuth();
    const navigation = useNavigation();

    if (!user) return null;

    return (
        <TouchableOpacity
            style={styles.floatingButton}
            onPress={() => router.push("/post/")} 
        >
            <Ionicons name="create-outline" size={30} color="white" />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    floatingButton: {
        position: "absolute",
        bottom: 20,
        right: 20,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: colors.onPrimary, // bg-blue-500
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
    },
});
