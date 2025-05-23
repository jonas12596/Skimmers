// app/(tabs)/profile.tsx
import { View, Text, Button } from 'react-native';

export default function ProfileScreen() {
  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 12 }}>Your Profile</Text>
      <Text>Name: Jane Doe</Text>
      <Text>Reports Submitted: 3</Text>
      <Text>Trust Score: 87%</Text>
      <Button title="Log Out" onPress={() => {}} />
    </View>
  );
}