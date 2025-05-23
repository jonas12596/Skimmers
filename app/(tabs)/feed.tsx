// app/(tabs)/feed.tsx
import { View, Text, FlatList } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';

const dummyReports = [
    { id: '1', title: 'Skimmer found at Shell - 9th Ave', time: '2h ago' },
    { id: '2', title: 'Suspicious device at Chase ATM - 34th St', time: '5h ago' },
    { id: '3', title: 'Possible skimmer reported at CVS - Lexington', time: '1d ago' },
];

export default function FeedScreen() {
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.container, { paddingTop: insets.top + 16 }]}>
            <Text style={styles.title}>🚨 Recent Reports</Text>
            <FlatList
                data={dummyReports}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>{item.title}</Text>
                        <Text style={styles.cardTime}>{item.time}</Text>
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        backgroundColor: '#000',
    },
    title: {
        fontSize: 28,
        fontWeight: '600',
        marginBottom: 20,
        color: '#fff',
    },
    listContent: {
        paddingBottom: 40,
    },
    card: {
        backgroundColor: '#f9f9f9',
        padding: 16,
        borderRadius: 16,
        marginBottom: 14,
        shadowColor: '#fff',
        shadowOpacity: 0.05,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2, // For Android subtle shadow
    },
    cardTitle: {
        fontSize: 17,
        fontWeight: '500',
        color: '#222',
        marginBottom: 4,
    },
    cardTime: {
        fontSize: 13,
        color: '#888',
    },
});