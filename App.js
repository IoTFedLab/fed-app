import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Alert,
  Platform
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as SplashScreen from 'expo-splash-screen';
import axios from 'axios';
import { API_CONFIG } from './config';

// 스플래시 화면 유지
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [description, setDescription] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // 권한 요청
        const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
        const { status: mediaStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        
        if (cameraStatus !== 'granted' || mediaStatus !== 'granted') {
          Alert.alert('권한 필요', '카메라와 갤러리 접근 권한이 필요합니다.');
        }
        
        // 초기화 완료 후 스플래시 숨김
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        setIsReady(true);
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  // 카메라로 촬영
  const takePhoto = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        setSelectedImage(result.assets[0]);
        setResult('');
      }
    } catch (error) {
      Alert.alert('오류', '카메라 실행 중 오류가 발생했습니다.');
    }
  };

  // 갤러리에서 선택
  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        setSelectedImage(result.assets[0]);
        setResult('');
      }
    } catch (error) {
      Alert.alert('오류', '갤러리 실행 중 오류가 발생했습니다.');
    }
  };

  // API로 진단 요청
  const diagnose = async () => {
    if (!selectedImage) {
      Alert.alert('알림', '먼저 피부 사진을 선택해주세요.');
      return;
    }

    if (!description.trim()) {
      Alert.alert('알림', '증상 설명을 입력해주세요.');
      return;
    }

    setLoading(true);
    setResult('');

    try {
      const formData = new FormData();
      
      // 이미지 파일 추가
      const imageUri = selectedImage.uri;
      const filename = imageUri.split('/').pop();
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image/jpeg';

      formData.append('image', {
        uri: Platform.OS === 'ios' ? imageUri.replace('file://', '') : imageUri,
        name: filename,
        type: type,
      });

      // 설명 추가
      formData.append('description', description);

      // API 요청
      const response = await axios.post(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.MODELS}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          timeout: 30000,
        }
      );

      // 응답 처리
      if (response.data && response.data.diagnosis) {
        setResult(response.data.diagnosis);
      } else {
        setResult('진단 결과를 받지 못했습니다.');
      }
    } catch (error) {
      console.error('API Error:', error);
      Alert.alert('오류', 'API 요청 중 오류가 발생했습니다.\n' + (error.message || ''));
    } finally {
      setLoading(false);
    }
  };

  if (!isReady) {
    return null;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🩺 피부 진단 앱</Text>
        <Text style={styles.subtitle}>피부 사진을 촬영하고 증상을 설명해주세요</Text>
      </View>

      {/* 이미지 프리뷰 */}
      <View style={styles.imageContainer}>
        {selectedImage ? (
          <Image source={{ uri: selectedImage.uri }} style={styles.image} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.placeholderText}>📷</Text>
            <Text style={styles.placeholderSubtext}>사진을 선택해주세요</Text>
          </View>
        )}
      </View>

      {/* 버튼 영역 */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={takePhoto}>
          <Text style={styles.buttonText}>📸 카메라 촬영</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.buttonSecondary]} onPress={pickImage}>
          <Text style={styles.buttonText}>🖼️ 갤러리 선택</Text>
        </TouchableOpacity>
      </View>

      {/* 증상 설명 입력 */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>증상 설명</Text>
        <TextInput
          style={styles.input}
          placeholder="예: 빨갛고 가려움"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={3}
        />
      </View>

      {/* 진단 버튼 */}
      <TouchableOpacity
        style={[styles.diagnoseButton, loading && styles.diagnoseButtonDisabled]}
        onPress={diagnose}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.diagnoseButtonText}>🔍 진단하기</Text>
        )}
      </TouchableOpacity>

      {/* 결과 표시 */}
      {result ? (
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>진단 결과</Text>
          <Text style={styles.resultText}>{result}</Text>
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#4A90E2',
    padding: 20,
    paddingTop: 60,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  imageContainer: {
    margin: 20,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    width: '100%',
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e8e8e8',
  },
  placeholderText: {
    fontSize: 60,
    marginBottom: 10,
  },
  placeholderSubtext: {
    fontSize: 16,
    color: '#666',
  },
  buttonContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 10,
  },
  button: {
    flex: 1,
    backgroundColor: '#4A90E2',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonSecondary: {
    backgroundColor: '#50C878',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  inputContainer: {
    margin: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  diagnoseButton: {
    backgroundColor: '#FF6B6B',
    marginHorizontal: 20,
    padding: 18,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  diagnoseButtonDisabled: {
    backgroundColor: '#ccc',
  },
  diagnoseButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resultContainer: {
    margin: 20,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#4A90E2',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  resultText: {
    fontSize: 16,
    color: '#555',
    lineHeight: 24,
  },
});

