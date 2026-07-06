import { useCallback, useRef, useState } from 'react';
import { PermissionsAndroid, Platform, StyleSheet, View } from 'react-native';
import WebView from 'react-native-webview';
import Geolocation from '@react-native-community/geolocation';
import { KAKAO_MAP_API_KEY } from '../config';
import { buildMapHTML } from '../map/kakaoMapHtml';

async function requestLocationPermission(): Promise<boolean> {
  if (Platform.OS !== 'android') {
    return true;
  }
  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  );
  return granted === PermissionsAndroid.RESULTS.GRANTED;
}

function MapScreen() {
  const webviewRef = useRef<WebView>(null);
  const [mapReady, setMapReady] = useState(false);

  const showUserLocation = useCallback(() => {
    Geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        webviewRef.current?.injectJavaScript(
          `addUserMarker(${latitude}, ${longitude}, true); true;`,
        );
      },
      error => console.warn('위치 조회 실패', error),
      { enableHighAccuracy: true, timeout: 15000 },
    );
  }, []);

  const handleMessage = useCallback(
    (event: { nativeEvent: { data: string } }) => {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'ready') {
        setMapReady(true);
        requestLocationPermission().then(granted => {
          if (granted) {
            showUserLocation();
          }
        });
      } else if (data.type === 'error') {
        console.warn('Kakao Map 에러:', data.message);
      }
    },
    [showUserLocation],
  );

  return (
    <View style={styles.container}>
      <WebView
        ref={webviewRef}
        originWhitelist={['*']}
        source={{ html: buildMapHTML(KAKAO_MAP_API_KEY) }}
        onMessage={handleMessage}
        javaScriptEnabled
        domStorageEnabled
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default MapScreen;