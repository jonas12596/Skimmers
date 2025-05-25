import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  Switch,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

export default function ReportScreen() {
  const [reportType, setReportType] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const reportOptions = [
    { label: "Confirmed skimmer", value: "confirmed" },
    { label: "Suspicious device", value: "suspicious" },
    { label: "Skimmer removed", value: "removed" },
    { label: "Unclear issue", value: "unclear" },
  ];

  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.5,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmit = () => {
    if (!reportType || (!description && !image) || !confirmed) {
      Alert.alert("Incomplete", "Please fill all required fields.");
      return;
    }

    // Submit report logic goes here
    Alert.alert("Submitted", "Your report has been submitted.");
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={styles.header}>Report a Skimmer</Text>

      <Text style={styles.label}>Where are you?</Text>
      <TouchableOpacity style={styles.locationBox}>
        <Text style={styles.locationText}>Use current location</Text>
      </TouchableOpacity>

      <Text style={styles.label}>What did you see?</Text>
      {reportOptions.map((option) => (
        <TouchableOpacity
          key={option.value}
          style={[
            styles.option,
            reportType === option.value && styles.selectedOption,
          ]}
          onPress={() => setReportType(option.value)}
        >
          <Text
            style={[
              styles.optionText,
              reportType === option.value && styles.selectedText,
            ]}
          >
            {option.label}
          </Text>
        </TouchableOpacity>
      ))}

      <Text style={styles.label}>Upload a photo (optional)</Text>
      {image && <Image source={{ uri: image }} style={styles.imagePreview} />}
      <TouchableOpacity style={styles.buttonOutline} onPress={handleImagePick}>
        <Text style={styles.buttonText}>Pick an Image</Text>
      </TouchableOpacity>

      <Text style={styles.label}>Description</Text>
      <TextInput
        multiline
        numberOfLines={4}
        placeholder="Describe what you saw..."
        placeholderTextColor="#888"
        style={styles.textInput}
        value={description}
        onChangeText={setDescription}
      />

      <View style={styles.switchContainer}>
        <Switch value={confirmed} onValueChange={setConfirmed} />
        <Text style={styles.switchLabel}>
          I confirm this report is made in good faith.
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.button, !(reportType && (description || image) && confirmed) && { backgroundColor: "#444" }]}
        onPress={handleSubmit}
        disabled={!(reportType && (description || image) && confirmed)}
      >
        <Text style={styles.buttonText}>Submit Report</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#151515",
    padding: 20,
    paddingTop: 72,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
    textAlign: "center", // ensures header text is centered
  },
  label: {
    color: "#aaa",
    marginTop: 20,
    marginBottom: 8,
    fontSize: 16,
    textAlign: "center", // center label text
  },
  locationBox: {
    backgroundColor: "#222",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: "center", // center location text
  },
  locationText: {
    color: "#fff",
    textAlign: "center",
  },
  option: {
    backgroundColor: "#222",
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
    alignItems: "center", // centers text inside TouchableOpacity
  },
  selectedOption: {
    backgroundColor: "#2ecc71",
  },
  optionText: {
    color: "#fff",
    textAlign: "center",
  },
  selectedText: {
    color: "#000",
    fontWeight: "bold",
  },
  textInput: {
    backgroundColor: "#222",
    color: "#fff",
    padding: 12,
    borderRadius: 10,
    textAlignVertical: "top",
    width: "100%", // ensure it uses full width within container
  },
  imagePreview: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#2ecc71",
    padding: 16,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center", // center text in button
  },
  buttonOutline: {
    borderWidth: 1,
    borderColor: "#2ecc71",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    gap: 10,
  },
  switchLabel: {
    color: "#ccc",
    flex: 1,
    fontSize: 14,
  },
});