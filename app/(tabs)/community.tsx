import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FontAwesome5, MaterialIcons, Feather } from "@expo/vector-icons";

const VALIDATION_THRESHOLD = 3; // number of validations needed to verify report

const dummyStories = [
  { id: "s0", name: "You", avatar: "https://randomuser.me/api/portraits/lego/1.jpg", isNew: false, isYou: true },
  { id: "s1", name: "Alex", avatar: "https://randomuser.me/api/portraits/men/32.jpg", isNew: true },
  { id: "s2", name: "Jenna", avatar: "https://randomuser.me/api/portraits/women/45.jpg", isNew: true },
  { id: "s3", name: "Mike", avatar: "https://randomuser.me/api/portraits/men/86.jpg", isNew: false },
];

const dummyReports = [
  {
    id: "1",
    title: "Skimmer found at Shell - 9th Ave",
    time: "2h ago",
    user: { name: "Alex B", avatar: "https://randomuser.me/api/portraits/men/32.jpg" },
    hasPhoto: true,
    hasLocation: true,
    likes: 12,
    comments: 3,
    validations: 2,
  },
  {
    id: "2",
    title: "Suspicious device at Chase ATM - 34th St",
    time: "5h ago",
    user: { name: "Jenna S", avatar: "https://randomuser.me/api/portraits/women/45.jpg" },
    hasPhoto: false,
    hasLocation: true,
    likes: 7,
    comments: 1,
    validations: 1,
  },
  {
    id: "3",
    title: "Possible skimmer reported at CVS - Lexington",
    time: "1d ago",
    user: { name: "Mike T", avatar: "https://randomuser.me/api/portraits/men/86.jpg" },
    hasPhoto: true,
    hasLocation: false,
    likes: 21,
    comments: 6,
    validations: 0,
  },
  {
    id: "4",
    title: "Skimmer removed from Bank of America - 5th Ave",
    time: "3h ago",
    user: { name: "Sarah L", avatar: "https://randomuser.me/api/portraits/women/22.jpg" },
    hasPhoto: true,
    hasLocation: true,
    likes: 15,
    comments: 4,
    validations: 4,
  },
  // ... add validations for other reports similarly
];

const StoryItem = React.memo(({ item }: any) => (
  <TouchableOpacity style={styles.storyBubble}>
    <View style={item.isNew ? styles.gradientBorder : styles.storyAvatarWrapper}>
      <Image source={{ uri: item.avatar }} style={styles.storyAvatar} />
    </View>
    <Text style={styles.storyName}>{item.isYou ? "Your Story" : item.name}</Text>
  </TouchableOpacity>
));

const ReportCard = React.memo(({ item, onValidate }: any) => {
  const [liked, setLiked] = useState(false);
  const [validated, setValidated] = useState(false);

  const toggleLike = () => setLiked((prev) => !prev);
  const handleValidate = () => {
    if (!validated) {
      setValidated(true);
      onValidate(item.id);
    }
  };

  const isVerified = item.validations >= VALIDATION_THRESHOLD;

  return (
    <View style={styles.card}>
      <View style={styles.userRow}>
        <Image source={{ uri: item.user.avatar }} style={styles.avatar} />
        <Text style={styles.username}>{item.user.name}</Text>
        <View style={styles.spacer} />
        <Text style={styles.time}>{item.time}</Text>
      </View>

      <Text style={styles.reportText}>{item.title}</Text>

      <View style={styles.flagsRow}>
        {item.hasPhoto && (
          <View style={styles.flagBadge}>
            <MaterialIcons name="photo-camera" size={16} color="#2ecc71" />
            <Text style={styles.flagText}>Photo</Text>
          </View>
        )}
        {item.hasLocation && (
          <View style={styles.flagBadge}>
            <FontAwesome5 name="map-marker-alt" size={16} color="#e74c3c" />
            <Text style={styles.flagText}>Location</Text>
          </View>
        )}
        {isVerified && (
          <View style={[styles.flagBadge, { backgroundColor: "#2ecc71" }]}>
            <Feather name="check-circle" size={16} color="#fff" />
            <Text style={[styles.flagText, { color: "#fff" }]}>Verified</Text>
          </View>
        )}
      </View>

      <View style={styles.actionsRow}>
        <TouchableOpacity onPress={toggleLike} style={styles.actionButton}>
          <Feather name="heart" size={18} color={liked ? "#e74c3c" : "#888"} />
          <Text style={styles.actionText}>{liked ? item.likes + 1 : item.likes}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={() => alert("Comments feature coming soon.")}>
          <Feather name="message-circle" size={18} color="#888" />
          <Text style={styles.actionText}>{item.comments}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={() => alert("Share feature coming soon.")}>
          <Feather name="share-2" size={18} color="#888" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.validateButton, validated && styles.validateButtonDisabled]}
          onPress={handleValidate}
          disabled={validated}
        >
          <Text style={[styles.validateButtonText, validated && styles.validateButtonTextDisabled]}>
            {validated ? "Validated" : "Validate"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
});

export default function CommunityScreen() {
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);
  const [reports, setReports] = useState(dummyReports);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setReports([...dummyReports]); // Simulate refresh
      setRefreshing(false);
    }, 1500);
  }, []);

  const onValidateReport = (id: string) => {
    setReports((prev) =>
      prev.map((report) =>
        report.id === id
          ? { ...report, validations: report.validations + 1 }
          : report
      )
    );
  };

  const renderStory = ({ item }: any) => <StoryItem item={item} />;
  const renderReport = ({ item }: any) => <ReportCard item={item} onValidate={onValidateReport} />;

  return (
    <View style={[styles.container, { paddingTop: insets.top + 16 }]}>
      <FlatList
        data={reports}
        keyExtractor={(item) => item.id}
        renderItem={renderReport}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#2ecc71" />}
        ListHeaderComponent={
          <View style={styles.storiesSticky}>
            <FlatList
              data={dummyStories}
              keyExtractor={(item) => item.id}
              renderItem={renderStory}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.storiesContainer}
            />
          </View>
        }
        ListEmptyComponent={<Text style={styles.emptyState}>No reports yet. Be the first to report an issue!</Text>}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[0]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: "#000",
  },
  listContent: {
    paddingBottom: 40,
  },
  storiesContainer: {
    paddingBottom: 16,
  },
  storiesSticky: {
    backgroundColor: "#000",
  },
  storyBubble: {
    alignItems: "center",
    marginRight: 16,
  },
  storyAvatarWrapper: {
    width: 58,
    height: 58,
    borderRadius: 29,
    borderWidth: 2,
    borderColor: "#444",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  gradientBorder: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 3,
    borderColor: "#e74c3c",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  storyAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },
  storyName: {
    color: "#fff",
    fontSize: 12,
    maxWidth: 70,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#1a1a1a",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
  },
  username: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  spacer: {
    flex: 1,
  },
  time: {
    color: "#aaa",
    fontSize: 12,
  },
  reportText: {
    color: "#eee",
    fontSize: 16,
    marginBottom: 12,
  },
  flagsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  flagBadge: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: "#333",
    marginRight: 8,
  },
  flagText: {
    color: "#ddd",
    fontSize: 12,
    marginLeft: 4,
  },
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },
  actionText: {
    color: "#aaa",
    marginLeft: 6,
    fontSize: 14,
  },
  validateButton: {
    marginLeft: "auto",
    backgroundColor: "#e74c3c",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  validateButtonDisabled: {
    backgroundColor: "#555",
  },
  validateButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  validateButtonTextDisabled: {
    color: "#bbb",
  },
  emptyState: {
    color: "#888",
    fontSize: 16,
    textAlign: "center",
    marginTop: 40,
  },
});