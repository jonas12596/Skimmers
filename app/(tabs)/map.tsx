import React, { useEffect, useRef, useState } from 'react';
import MapView, { Marker, LatLng } from 'react-native-maps';
import * as Location from 'expo-location';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
  Pressable,
  Animated,
} from 'react-native';

type Report = {
  id: string;
  title: string;
  message: string;
  latitude: number;
  longitude: number;
  weight: number;
  approved: boolean;
  autoApproved: boolean;
};

const sampleReports: Report[] = [
  {
    id: '1',
    title: 'Skimmer Alert',
    message: 'Spotted near ATM',
    latitude: 40.8370,
    longitude: -73.9140,
    weight: 1,
    approved: true,
    autoApproved: false
  },
  {
    id: '2',
    title: 'Skimmer Confirmed',
    message: 'Confirmed device',
    latitude: 40.8374,
    longitude: -73.9125,
    weight: 3,
    approved: true,
    autoApproved: true
  },
  {
    id: '3',
    title: 'Suspicious Device',
    message: 'Suspicious card reader',
    latitude: 40.8368,
    longitude: -73.9152,
    weight: 2,
    approved: true,
    autoApproved: false
  },
  {
    id: '4',
    title: 'Skimmer Activity',
    message: 'Multiple reports nearby',
    latitude: 40.8376,
    longitude: -73.9131,
    weight: 3,
    approved: true,
    autoApproved: true
  }
];

export default function MapScreen() {
  const mapRef = useRef<MapView>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [userLocation, setUserLocation] = useState<LatLng | null>(null);

  const approvedReports = sampleReports.filter(r => r.approved === true);
  const nearbyAlerts = approvedReports.filter(r => r.weight >= 1);

  const getColorByWeight = (weight: number) => {
    if (weight >= 3) return '#E63946';
    if (weight === 2) return '#F4A261';
    return '#2A9D8F';
  };
  const getOuterRingColor = (weight: number) => {
    if (weight >= 3) return 'rgba(230, 57, 70, 0.3)';    // red outer ring
    if (weight === 2) return 'rgba(244, 162, 97, 0.3)';  // orange outer ring
    return 'rgba(42, 157, 143, 0.3)';                    // green outer ring
  };

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.warn('Permission to access location was denied');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      setUserLocation({ latitude, longitude });
    })();
  }, []);

  const centerMapOn = (latitude: number, longitude: number) => {
    mapRef.current?.animateToRegion({
      latitude,
      longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    }, 350);
    setDrawerOpen(false);
  };

  if (!userLocation) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: '#fff' }}>Loading map...</Text>
      </View>
    );
  }

  const { latitude, longitude } = userLocation;

  return (
    <View style={{ flex: 1 }}>
      <MapView
        ref={mapRef}
        style={{ flex: 1 }}
        initialRegion={{
          latitude,
          longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {approvedReports.map(report => (
          <Marker
            key={report.id}
            coordinate={{ latitude: report.latitude, longitude: report.longitude }}
            title={report.title}
            description={report.message}
            anchor={{ x: 0.5, y: 0.5 }}
          >
            <View
              style={[
                styles.reportDotOuter,
                { backgroundColor: getOuterRingColor(report.weight) },
              ]}
            >
              <View
                style={[
                  styles.reportDotInner,
                  { backgroundColor: getColorByWeight(report.weight) },
                ]}
              />
            </View>
          </Marker>
        ))}

        {userLocation && (
          <Marker coordinate={userLocation} anchor={{ x: 0.5, y: 0.5 }}>
            <Animated.View style={styles.userDotOuter}>
              <View style={styles.userDotInner} />
            </Animated.View>
          </Marker>
        )}
      </MapView>

      {!drawerOpen && (
        <TouchableOpacity
          style={[
            styles.floatingAlertsButton,
            { backgroundColor: nearbyAlerts.length > 0 ? '#E63946' : '#000' }
          ]}
          onPress={() => setDrawerOpen(true)}
        >
          <Text style={styles.floatingAlertsText}>
            Nearby Alerts ({nearbyAlerts.length})
          </Text>
        </TouchableOpacity>
      )}

      <Modal
        transparent
        animationType="fade"
        visible={drawerOpen}
        onRequestClose={() => setDrawerOpen(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setDrawerOpen(false)} />
        <View style={styles.alertDrawer}>
          <Text style={styles.drawerTitle}>Nearby Alerts</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {nearbyAlerts.length > 0 ? (
              nearbyAlerts.map(alert => (
                <TouchableOpacity
                  key={alert.id}
                  style={styles.alertCard}
                  onPress={() => centerMapOn(alert.latitude, alert.longitude)}
                >
                  <Text style={styles.alertTitle}>{alert.title}</Text>
                  <Text style={styles.alertMessage}>{alert.message}</Text>
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.alertCard}>
                <Text style={styles.alertTitle}>No approved alerts</Text>
                <Text style={styles.alertMessage}>You'll see alerts here once confirmed.</Text>
              </View>
            )}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  floatingAlertsButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#E63946',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    elevation: 6,
  },
  floatingAlertsText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  alertDrawer: {
    width: '100%',
    position: 'absolute',
    bottom: 0,
    backgroundColor: '#111',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    minHeight: 160,
  },
  drawerTitle: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
    marginBottom: 12,
  },
  alertCard: {
    backgroundColor: '#222',
    padding: 10,
    marginRight: 12,
    marginBottom: 24,
    borderRadius: 10,
    minWidth: 180,
  },
  alertTitle: {
    color: '#fff',
    fontWeight: '700',
    marginBottom: 4,
  },
  alertMessage: {
    color: '#ccc',
    fontSize: 12,
  },
  userDotOuter: {
    width: 32,
    height: 32,
    borderRadius: 50,
    backgroundColor: 'rgba(0,122,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userDotInner: {
    width: 20,
    height: 20,
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 10, // width/2
    backgroundColor: '#007AFF',
  },
  reportDotOuter: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)', // soft outer ring
    alignItems: 'center',
    justifyContent: 'center',
  },

  reportDotInner: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderColor: '#fff',
    borderWidth: 1,
    backgroundColor: '#2A9D8F', // default (will be overridden dynamically)
  },
});
