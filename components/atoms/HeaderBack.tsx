import { colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

export default function HeaderBack({ title }: { title: string }) {
    const router = useRouter();

    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10, borderBottomWidth: 1, borderBottomColor: '#dddddd7f' }}>
            <Pressable onPress={() => router.back()} style={{ marginHorizontal: 8, }}>
                <Ionicons name="arrow-back" size={24} color="white" />
            </Pressable>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: colors.textPrimary }}>{title}</Text>
        </View>
    );
}
