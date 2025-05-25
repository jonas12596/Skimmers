import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather, FontAwesome5 } from "@expo/vector-icons";

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();

  const user = {
    name: "You",
    avatar: "https://randomuser.me/api/portraits/lego/1.jpg",
    bio: "SkimHunter. Reporting skimmers to protect the city.",
    reports: 12,
    validations: 37,
    joined: "April 2024",
  };

  return (
    <ScrollView
      contentContainerStyle={[styles.container, { paddingTop: insets.top + 16 }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.profileCard}>
        <Image source={{ uri: user.avatar }} style={styles.avatar} />
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.bio}>{user.bio}</Text>

        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{user.reports}</Text>
            <Text style={styles.statLabel}>Reports</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{user.validations}</Text>
            <Text style={styles.statLabel}>Validations</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{user.joined}</Text>
            <Text style={styles.statLabel}>Joined</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.editButton}>
          <Feather name="edit" size={16} color="#fff" />
          <Text style={styles.editText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings</Text>
        <TouchableOpacity style={styles.row}>
          <FontAwesome5 name="user-shield" size={16} color="#ccc" />
          <Text style={styles.rowText}>Privacy</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.row}>
          <Feather name="settings" size={16} color="#ccc" />
          <Text style={styles.rowText}>Preferences</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.row}>
          <Feather name="log-out" size={16} color="#e74c3c" />
          <Text style={[styles.rowText, { color: "#e74c3c" }]}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    backgroundColor: "#000",
  },
  profileCard: {
    backgroundColor: "#1a1a1a",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    marginBottom: 24,
  },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "#444",
  },
  name: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },
  bio: {
    color: "#aaa",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 16,
  },
  stat: {
    alignItems: "center",
    flex: 1,
  },
  statValue: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  statLabel: {
    color: "#888",
    fontSize: 12,
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#2ecc71",
    borderRadius: 20,
  },
  editText: {
    color: "#fff",
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "500",
  },
  section: {
    backgroundColor: "#1a1a1a",
    borderRadius: 16,
    padding: 16,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  rowText: {
    marginLeft: 12,
    fontSize: 14,
    color: "#ccc",
  },
});