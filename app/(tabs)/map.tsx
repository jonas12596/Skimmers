import React, { useState } from 'react';
import MapView, { Marker, Region } from 'react-native-maps';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
  GestureResponderEvent,
} from 'react-native';
import RNModal from 'react-native-modal';
import { Feather } from '@expo/vector-icons';

type Report = {
  id: string;
  title: string;
  message: string;
  latitude: number;
  longitude: number;
  weight: number;
};

const sampleReports: Report[] = [
  { id: '1', title: 'Skimmer Alert', message: 'Spotted near ATM', latitude: 40.748817, longitude: -73.985428, weight: 1 },
  { id: '2', title: 'Skimmer Confirmed', message: 'Confirmed device', latitude: 40.7527, longitude: -73.9772, weight: 3 },
  { id: '3', title: 'Suspicious Device', message: 'Suspicious card reader', latitude: 40.7495, longitude: -73.9879, weight: 2 },
  { id: '4', title: 'Skimmer Removed', message: 'Device removed by store', latitude: 40.7471, longitude: -73.9903, weight: 1 },
  { id: '5', title: 'Skimmer Alert', message: 'Weird attachment', latitude: 40.7519, longitude: -73.9894, weight: 1 },
  { id: '6', title: 'Skimmer Alert', message: 'Alert from user report', latitude: 40.7463, longitude: -73.9835, weight: 2 },
  { id: '7', title: 'Confirmed Skimmer', message: 'Police involved', latitude: 40.7456, longitude: -73.9807, weight: 4 },
  { id: '8', title: 'Suspicious Reader', message: 'Gas station reader looks tampered', latitude: 40.7502, longitude: -73.9796, weight: 2 },
  { id: '9', title: 'Device Spotted', message: 'Loose reader', latitude: 40.748, longitude: -73.9821, weight: 1 },
  { id: '10', title: 'Skimmer Activity', message: 'Multiple reports nearby', latitude: 40.7499, longitude: -73.9887, weight: 3 },
];

export default function MapScreen() {
  const [region, setRegion] = useState<Region>({
    latitude: 40.75,
    longitude: -73.98,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isLayerModalVisible, setLayerModalVisible] = useState(false);

  const handleMarkerPress = (report: Report) => () => {
    setSelectedReport(report);
  };

  const handleClose = (event: GestureResponderEvent) => {
    setSelectedReport(null);
  };

  const toggleLayerModal = () => setLayerModalVisible(!isLayerModalVisible);

  return (
    <View style={{ flex: 1 }}>
      <MapView style={{ flex: 1 }} region={region}>
        {sampleReports.map((report) => (
          <Marker
            key={report.id}
            coordinate={{ latitude: report.latitude, longitude: report.longitude }}
            title={report.title}
            description={report.message}
            onPress={handleMarkerPress(report)}
            pinColor={
              report.weight >= 3 ? '#E63946' : // strong red for confirmed
                report.weight === 2 ? '#F4A261' : // warm orange for suspicious
                  '#2A9D8F' // teal for low weight/alert
            }
          />
        ))}
      </MapView>

      {/* Map Layers Button */}
      <TouchableOpacity style={styles.layerButton} onPress={toggleLayerModal} activeOpacity={0.8}>
        <Feather name="layers" size={18} color="#fff" />
        <Text style={styles.layerText}>Map Layers</Text>
        <Feather name={isLayerModalVisible ? "chevron-up" : "chevron-down"} size={18} color="#fff" />
      </TouchableOpacity>

      {/* Report Detail Modal */}
      <Modal
        visible={!!selectedReport}
        animationType="fade"
        transparent
        onRequestClose={() => setSelectedReport(null)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={handleClose}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{selectedReport?.title}</Text>
            <Text style={styles.modalMessage}>{selectedReport?.message}</Text>
            <Text style={styles.modalCoords}>
              Lat: {selectedReport?.latitude.toFixed(4)}, Lng: {selectedReport?.longitude.toFixed(4)}
            </Text>

            <View style={styles.commentsBox}>
              <Text style={styles.commentsTitle}>Comments</Text>
              <Text style={styles.commentsPlaceholder}>Coming soon...</Text>
            </View>

            <TouchableOpacity onPress={() => setSelectedReport(null)} style={styles.closeButtonTouchable}>
              <Feather name="x" size={24} color="#555" />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Layer Modal */}
      <RNModal
        isVisible={isLayerModalVisible}
        onBackdropPress={toggleLayerModal}
        style={styles.layerModal}
        swipeDirection="down"
        onSwipeComplete={toggleLayerModal}
      >
        <View style={styles.layerModalContent}>
          <Text style={styles.modalTitle}>Select Map Layers</Text>

          <TouchableOpacity style={styles.option}>
            <Feather name="check-circle" size={18} color="#fff" style={styles.optionIcon} />
            <Text style={styles.optionText}>Confirmed Skimmers</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.option}>
            <Feather name="alert-triangle" size={18} color="#fff" style={styles.optionIcon} />
            <Text style={styles.optionText}>Unverified Reports</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.option}>
            <Feather name="shield" size={18} color="#fff" style={styles.optionIcon} />
            <Text style={styles.optionText}>Safe Locations</Text>
          </TouchableOpacity>
        </View>
      </RNModal>
    </View>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalContent: {
    backgroundColor: '#222',
    padding: 24,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 12,
    position: 'relative',
    height: '30%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 12,
  },
  modalMessage: {
    fontSize: 16,
    color: '#444',
    lineHeight: 22,
    backgroundColor: '#222',
  },
  modalCoords: {
    marginTop: 12,
    color: '#666',
    fontSize: 13,
    fontWeight: '500',
  },
  closeButtonTouchable: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 6,
    borderRadius: 18,
  },
  commentsBox: {
    marginTop: 24,
    padding: 14,
    backgroundColor: '#F7FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  commentsTitle: {
    fontWeight: '700',
    color: '#2D3748',
    marginBottom: 6,
    fontSize: 15,
  },
  commentsPlaceholder: {
    fontStyle: 'italic',
    color: '#A0AEC0',
    fontSize: 13,
  },

  closeButton: {
    marginTop: 16,
    textAlign: 'center',
    color: 'blue',
    fontWeight: 'bold',
  },

  layerButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    zIndex: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 10,
  },
  layerText: {
    color: '#FFF',
    marginHorizontal: 10,
    fontWeight: '400',
    fontSize: 16,
  },

  layerModal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  layerModalContent: {
    backgroundColor: '#000',
    paddingVertical: 24,
    paddingHorizontal: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  optionIcon: {
    paddingTop: 18,
    paddingBottom: 18,
    marginRight: 14,
  },
  optionText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '400',
  },
});