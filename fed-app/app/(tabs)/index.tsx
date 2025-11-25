import React, { useState, useEffect, useRef } from 'react';
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
  Platform,
  Animated
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { API_CONFIG } from '@/config';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  const [showSplash, setShowSplash] = useState(true);
  const [selectedImage, setSelectedImage] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [symptomText, setSymptomText] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // 스플래시 화면 4초 표시
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 4000);

    // 권한 요청
    (async () => {
      const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
      const { status: mediaStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (cameraStatus !== 'granted' || mediaStatus !== 'granted') {
        Alert.alert('권한 필요', '카메라와 갤러리 접근 권한이 필요합니다.');
      }
    })();

    return () => clearTimeout(timer);
  }, []);

  // 카메라로 촬영
  const takePhoto = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
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
        mediaTypes: ['images'],
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
    if (!selectedImage && !symptomText.trim()) {
      Alert.alert('알림', '피부 사진을 업로드하거나 증상을 입력해주세요.');
      return;
    }

    setLoading(true);
    setResult('');

    try {
      const formData = new FormData();

      if (selectedImage) {
        // 이미지 파일 추가
        const imageUri = selectedImage.uri;
        const filename = imageUri.split('/').pop() || 'image.jpg';
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : 'image/jpeg';

        formData.append('image', {
          uri: Platform.OS === 'ios' ? imageUri.replace('file://', '') : imageUri,
          name: filename,
          type: type,
        } as any);
      }

      // 설명 추가
      formData.append('description', symptomText);

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
    } catch (error: any) {
      console.error('API Error:', error);
      Alert.alert('오류', 'API 요청 중 오류가 발생했습니다.\n' + (error.message || ''));
    } finally {
      setLoading(false);
    }
  };

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.iconContainer}>
            <Ionicons name="medical" size={22} color="#FFFFFF" />
          </View>
          <Text style={styles.title}>피부 진단</Text>
        </View>
        <Text style={styles.subtitle}>피부 사진을 촬영하고 증상을 설명해주세요</Text>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* 이미지 업로드 영역 */}
        <View style={styles.imageUploadContainer}>
          <View style={styles.imageBox}>
            {selectedImage ? (
              <>
                <Image source={{ uri: selectedImage.uri }} style={styles.uploadedImage} />
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => setSelectedImage(null)}
                >
                  <Text style={styles.deleteButtonText}>✕</Text>
                </TouchableOpacity>
              </>
            ) : (
              <View style={styles.imagePlaceholder}>
                <View style={styles.dashedBorder} />
                <View style={styles.placeholderIcon}>
                  <Ionicons name="image-outline" size={40} color="#10B981" />
                </View>
                <Text style={styles.placeholderText}>피부 사진을 업로드하세요</Text>
                <Text style={styles.placeholderSubtext}>정면에서 촬영하면 더 정확해요</Text>
              </View>
            )}
          </View>
        </View>

        {/* 버튼 그룹 */}
        <View style={styles.buttonGroup}>
          <TouchableOpacity style={[styles.actionButton, styles.cameraButton]} onPress={takePhoto}>
            <Ionicons name="camera" size={20} color="#FFFFFF" />
            <Text style={styles.buttonText}>카메라 촬영</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, styles.galleryButton]} onPress={pickImage}>
            <Ionicons name="images" size={20} color="#FFFFFF" />
            <Text style={styles.buttonText}>갤러리 선택</Text>
          </TouchableOpacity>
        </View>

        {/* 증상 설명 입력 */}
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>
            증상 설명 <Text style={styles.optionalText}>(선택)</Text>
          </Text>
          <TextInput
            style={styles.textInput}
            placeholder="예: 볼 부분이 빨갛고 가려워요"
            placeholderTextColor="#D1D5DB"
            value={symptomText}
            onChangeText={setSymptomText}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* 진단하기 버튼 */}
        <TouchableOpacity
          style={[styles.diagnoseButton, loading && styles.diagnoseButtonDisabled]}
          onPress={diagnose}
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <>
              <Ionicons name="sparkles" size={22} color="#FFFFFF" />
              <Text style={styles.diagnoseText}>AI 진단 시작하기</Text>
            </>
          )}
        </TouchableOpacity>

        {/* 결과 표시 */}
        {result ? (
          <View style={styles.resultContainer}>
            <Text style={styles.resultTitle}>진단 결과</Text>
            <Text style={styles.resultText}>{result}</Text>
          </View>
        ) : null}

        {/* 안내 문구 */}
        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>
            본 서비스는 참고용이며, 정확한 진단은{'\n'}전문 의료기관을 방문해주세요
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

// 스플래시 화면 컴포넌트
const SplashScreen = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        delay: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1000,
        delay: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.splashContainer}>
      <View style={styles.splashBackground}>
        <View style={styles.splashCircle1} />
        <View style={styles.splashCircle2} />
      </View>

      <Animated.View
        style={[
          styles.splashContent,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }
        ]}
      >
        <Text style={styles.splashEmoji}>🩺</Text>
        <Text style={styles.splashTitle1}>당신의 피부를</Text>
        <Text style={styles.splashTitle2}>AI가 분석합니다</Text>
        <Text style={styles.splashSubtitle}>
          작은 변화도 놓치지 않는{'\n'}당신만의 피부 건강 파트너
        </Text>

        <View style={styles.loadingDots}>
          <View style={[styles.dot, styles.dot1]} />
          <View style={[styles.dot, styles.dot2]} />
          <View style={[styles.dot, styles.dot3]} />
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  // 메인 컨테이너
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  // 헤더
  header: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 24,
    paddingTop: 56,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(243, 244, 246, 0.5)',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 8,
  },
  iconContainer: {
    width: 40,
    height: 40,
    backgroundColor: '#6EE7B7', // 연한 초록색
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  iconText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1F2937',
  },
  subtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },

  // 스크롤뷰
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },

  // 이미지 업로드
  imageUploadContainer: {
    marginBottom: 20,
  },
  imageBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  uploadedImage: {
    width: '100%',
    aspectRatio: 1,
    resizeMode: 'cover',
  },
  deleteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  deleteButtonText: {
    fontSize: 16,
    color: '#6B7280',
  },
  imagePlaceholder: {
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    position: 'relative',
  },
  dashedBorder: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    bottom: 16,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: 'rgba(16, 185, 129, 0.3)',
    borderRadius: 16,
  },
  placeholderIcon: {
    width: 80,
    height: 80,
    backgroundColor: '#F0FDF4',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  placeholderText: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  placeholderSubtext: {
    fontSize: 12,
    color: '#D1D5DB',
  },

  // 버튼 그룹
  buttonGroup: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  cameraButton: {
    backgroundColor: '#7DD3FC', // 연한 하늘색
  },
  galleryButton: {
    backgroundColor: '#6EE7B7', // 연한 초록색
  },
  buttonIcon: {
    fontSize: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },

  // 입력 섹션
  inputSection: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B5563',
    marginBottom: 12,
    marginLeft: 4,
  },
  optionalText: {
    color: '#D1D5DB',
    fontWeight: '400',
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F3F4F6',
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    color: '#1F2937',
    minHeight: 112,
    textAlignVertical: 'top',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },

  // 진단 버튼
  diagnoseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6EE7B7', // 연한 초록색
    paddingVertical: 20,
    borderRadius: 16,
    gap: 12,
    marginBottom: 32,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  diagnoseButtonDisabled: {
    backgroundColor: '#D1D5DB',
    shadowOpacity: 0.1,
  },
  diagnoseIcon: {
    fontSize: 24,
  },
  diagnoseText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },

  // 결과 컨테이너
  resultContainer: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
  },
  resultText: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
  },

  // 안내 문구
  disclaimer: {
    alignItems: 'center',
    paddingBottom: 24,
  },
  disclaimerText: {
    fontSize: 12,
    color: '#D1D5DB',
    textAlign: 'center',
    lineHeight: 18,
  },

  // 스플래시 화면
  splashContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    position: 'relative',
  },
  splashBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  splashCircle1: {
    position: 'absolute',
    top: '25%',
    right: -80,
    width: 256,
    height: 256,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderRadius: 128,
  },
  splashCircle2: {
    position: 'absolute',
    bottom: '25%',
    left: -80,
    width: 288,
    height: 288,
    backgroundColor: 'rgba(14, 165, 233, 0.1)',
    borderRadius: 144,
  },
  splashContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  splashEmoji: {
    fontSize: 80,
    marginBottom: 32,
  },
  splashTitle1: {
    fontSize: 28,
    fontWeight: '300',
    color: '#4B5563',
    marginBottom: 12,
  },
  splashTitle2: {
    fontSize: 28,
    fontWeight: '600',
    color: '#10B981',
    marginBottom: 24,
  },
  splashSubtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 22,
  },
  loadingDots: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 64,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    opacity: 0.6,
  },
  dot1: {
    backgroundColor: '#10B981',
  },
  dot2: {
    backgroundColor: '#0EA5E9',
  },
  dot3: {
    backgroundColor: '#10B981',
  },
});
