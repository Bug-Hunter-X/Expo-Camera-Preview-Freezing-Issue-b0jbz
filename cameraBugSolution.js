import * as React from 'react';
import { Camera, CameraType } from 'expo-camera';
import { useState, useEffect, useRef } from 'react';

const CameraScreen = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(CameraType.back);
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleTakePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        console.log('Photo taken:', photo);
      } catch (error) {
        console.error('Error taking picture:', error);
      }
    }
  };

  const handleCameraRelease = () => {
    if (cameraRef.current) {
      cameraRef.current.stopRecording();
      cameraRef.current = null; // release camera reference
    }
  }

  if (hasPermission === null) {
    return <View />; // Or a loading indicator
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <View style={{ flex: 1 }}>
      <Camera style={{ flex: 1 }} type={type} ref={cameraRef} >
        <View
          style={{
            flex: 1,
            backgroundColor: 'transparent',
            flexDirection: 'row',
          }}>
          <TouchableOpacity
            style={{
              position: 'absolute',
              bottom: 20,
              left: 20,
            }}
            onPress={() => {
              setType(
                type === CameraType.back ? CameraType.front : CameraType.back
              );
            }}>
            <Text style={{ color: '#fff' }}>Flip</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              position: 'absolute',
              bottom: 20,
              right: 20,
            }}
            onPress={handleTakePicture}>
            <Text style={{ color: '#fff' }}>Take Picture</Text>
          </TouchableOpacity>
        </View>
      </Camera>
    </View>
  );};

  useEffect(() => {
      return handleCameraRelease; // Clean up on unmount
  }, []);

  export default CameraScreen;
}