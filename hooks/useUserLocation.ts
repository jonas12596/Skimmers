import * as Location from 'expo-location';

const getUserLocation = async () => {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    console.warn('Permission denied');
    return null;
  }

  const location = await Location.getCurrentPositionAsync({});
  return location.coords;
};