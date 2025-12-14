# [Team 8] 사물인터넷 Lab-02 연합학습 논문 구현 
![cover](./asset_)
## 목차
- [1. 프로젝트 소개](#1-프로젝트-소개)
  - [a. 레포지토리 설명](#a-레포지토리-설명)
  - [b. 프로젝트 설명](#b-프로젝트-설명)
- [2. 팀원 소개](#2-팀원-소개)
- [3. 기술 스택](#3-기술스택)
- [4. 시스템 아키텍처](#4-시스템-아키텍쳐)
- [5. 데이터셋 구성 및 통계](#5-데이터셋-구성-및-통계)
  - [a. 전체 데이터 분포](#a-전체-데이터-분포)
  - [b. Central Learning (중앙 모델 사전 학습) 데이터 구성](#b-central-learning-중앙-모델-사전-학습-데이터-구성)
  - [c. Federated Learning 데이터 구성](#c-federated-learning-데이터-구성)
  - [d. 클라이언트(사용자)별 데이터 분배](#d-클라이언트사용자별-데이터-분배)
- [6. 애플리케이션 구동법](#6-애플리케이션-구동법)
  - [a. 백엔드 구동](#a-백엔드-구동)
  - [b. 프론트엔드 구동](#b-프론트엔드-구동)
  - [c. 애플리케이션 화면 예시](#c-애플리케이션-화면-예시)
- [7. 참고 자료](#7-참고-자료)



## 1. 프로젝트 소개
### a. 레포지토리 설명
|Name|Description|Link|
|:-:|:-:|:-:|
|federated-iot-project|중앙 모델 도메인 학습용 코드|[federated-iot-project](https://github.com/IoTFedLab/federated-iot-project)|
|flower-server|연합학습용 flower 관련 코드|[flower-server](https://github.com/IoTFedLab/flower-server)|
|fed-app|애플리케이션 코드(프론트엔드)|[fed-app](https://github.com/IoTFedLab/fed-app)|
|fed-api|모델 로드 및 db 연결용 api 서버(백엔드)|[fed-api](https://github.com/IoTFedLab/fed-api)|


### b. 프로젝트 설명
#### 1) 배경
본 프로젝트는 **연합학습(Federated Learning)을 기반으로 한 피부 질환 이미지 분류 모바일 애플리케이션**을 구현하는 것을 목표로 한다. 피부 질환 이미지는 얼굴 및 신체 부위가 직접 노출되는 민감 의료 정보에 해당하여, 기존의 중앙집중식 데이터 수집·학습 방식에는 법적·윤리적 제약이 존재한다. 이로 인해 대규모 데이터 확보가 어렵고, 실제 사용자 환경을 반영한 모델 학습에 한계가 존재한다.<br/>
또한 피부 질환의 정확한 진단을 위해서는 병원 방문이 필수적인 경우가 많아, 시간·비용·거리로 인한 의료 접근성 문제 역시 지속적으로 제기되어 왔다. 이러한 배경에서 본 프로젝트는 개인정보를 보호하면서도 사용자 접근성을 개선할 수 있는 새로운 학습·서비스 구조를 제안한다.

#### 2) 수행 방식
본 프로젝트는 사용자 기기에서 직접 데이터를 학습하고, 원본 이미지를 서버로 전송하지 않는 **연합학습** 구조를 채택하였다.
각 클라이언트는 로컬 데이터로 모델을 학습한 뒤, **모델 가중치만 중앙 서버로 전달**하며, 서버는 이를 집계하여 글로벌 모델을 업데이트한다. 이 과정에서 Federated Averaging(FedAvg) 및 FedProx 알고리즘을 적용하여, 클라이언트 간 데이터 분포 차이(Non-IID 문제)를 완화하고 학습 안정성을 확보하였다.

#### 3) 기술적 특징
- **피부질환 도메인 특화 중앙모델 파인튜닝**<br/>
기존 ImageNet으로 사전 학습된 모델은 피부 질환 이미지 분류에서 29%의 정확도를 보여, 해당 도메인에 적합하지 않은 것으로 판단하였다. 이에 따라, 전체 데이터셋의 70%를 중앙 모델 fine-tuning용으로 사용하여, 모델을 피부질환 도메인에 특화시켰다. 그 결과, 기존 29%에서 86%로 피부질환 이미지 분류에 대한 성능을 비약적으로 향상시켰다.

- **Pytorch 기반 학습 환경**<br/>
기존 TensorFlow/TFLite 중심 연구의 구조적 한계를 극복하기 위해, 확장성과 실험 효율이 높은 PyTorch 기반으로 전체 학습 파이프라인을 재구성하였다.

- **멀티모달 보완 구조**<br/>
이미지 분류 정확도의 한계를 보완하기 위해, 증상 설명 텍스트를 임베딩하여 이미지–텍스트 간 의미 유사도 기반 보조 판단 구조를 도입한다.

## 2. 팀원 소개

<div align="center">
  
|이민지|한소연|이시우|
|:-:|:-:|:-:|
|<img src="https://avatars.githubusercontent.com/u/175521353?v=4" width=100 height=100>|<img src="https://avatars.githubusercontent.com/u/162886838?v=4" width=100 height=100>|<img src="https://avatars.githubusercontent.com/u/232974722?v=4" width=100 height=100>|
|[@Minter-v1](https://github.com/Minter-v1)<br/><ul align="center"><li>프로젝트 총괄</li><li>학습 인프라 설계 및 구현</li></ul>|[@Soyeon Han](https://github.com/Han-soyeon)<br/><ul><li>애플리케이션 디자인</li><li>애플리케이션 구현</li></ul>|[@ceeeu](https://github.com/ceeeu)<br/><ul align="center"><li>api 서버 설계</li><li>데이터베이스 관련 작업</li></ul>|

</div>

## 3. 기술스택
### 기술 스택별 역할 구분

본 프로젝트는 연합학습 기반 모바일 애플리케이션 구현을 목표로 하며,  
시스템을 **모델 학습·연합학습 / 백엔드 서버 / 모바일 애플리케이션** 영역으로 구분하고  
각 영역의 역할에 따라 기술 스택을 분리하여 설계하였다.

---

#### 1) 모델 학습 및 연합학습 영역  
<p>
  <img src="https://go-skill-icons.vercel.app/api/icons?i=pytorch" height="32"/>
  <img src="https://github.com/user-attachments/assets/ebf8fcb3-c6be-4d9f-ba99-5c7b8d21c1cf" height="32"/>
</p>

- **PyTorch**
  - 피부 질환 이미지 분류 모델 학습 및 fine-tuning 수행
  - 중앙 모델(Central Learning) 사전 학습을 통한 도메인 특화 모델 구축
  - 클라이언트 로컬 학습 과정에서 모델 가중치 업데이트 처리
- **Flower**
  - 연합학습 서버 구성 및 클라이언트 관리
  - 클라이언트별 학습된 모델 가중치 수집
  - FedAvg, FedProx 알고리즘 기반 글로벌 모델 집계 및 갱신

---

#### 2) 백엔드 API 및 서버 영역  
<img src="https://go-skill-icons.vercel.app/api/icons?i=fastapi,pinecone,python" height="32"/>

- **FastAPI**
  - 학습 완료 모델 로드 및 추론 API 제공
  - 모바일 애플리케이션 요청 처리
  - 입력된 피부 이미지 기반 질환 분류 결과 반환
- **Pinecone (Vector DB)**
  - 증상 설명 텍스트 임베딩 벡터 저장
  - 이미지 분류 결과와 텍스트 간 의미 유사도 기반 보조 판단 수행
- **Python**
  - 모델 추론, 서버 로직 및 데이터 처리 전반에 사용

---

#### 3) 모바일 애플리케이션 영역  
<img src="https://go-skill-icons.vercel.app/api/icons?i=reactnative,expo,typescript,javascript" height="32"/>

- **React Native / Expo**
  - 크로스 플랫폼 기반 모바일 애플리케이션 UI 구현
  - 피부 이미지 촬영·업로드 및 증상 입력 인터페이스 제공
  - 질환 분류 결과 시각화 및 사용자 피드백 출력
- **TypeScript / JavaScript**
  - 애플리케이션 상태 관리 및 화면 전환 로직 구현
  - 백엔드 API와의 통신 및 데이터 처리

---

#### 4) 공통 개발 및 협업 환경  
<img src="https://go-skill-icons.vercel.app/api/icons?i=github,notion,figma,jira" height="32"/>

- **GitHub**
  - 코드 버전 관리 및 팀원 간 협업
  - 기능 단위 개발 및 변경 이력 관리
- **Notion,jira**
  - 트러블 슈팅 및 가이드 문서 작업용으로 활용(notion)
  - 이슈 생성 및 작업 트래킹용으로 활용(jira)

## 4. 시스템 아키텍쳐
![시스템 아키텍쳐](./docs_asset/SA.jpg)

## 5. 데이터셋 구성 및 통계
본 프로젝트는 AI-Hub 안면부 피부질환 이미지 데이터셋을 기반으로 진행되었다. 데이터셋은 정면 및 측면 이미지를 모두 포함하며, 총 6가지 피부 질환 클래스로 구성된다. 사용된 데이터의 상세 통계는 아래 섹션에서 확인할 수 있으며, 기타 메타데이터는 [7.참고 자료](#7-참고-자료)를 참고해 주십시오.

---

### a. 전체 데이터 분포

| 질병명 | 측면 | 정면 | Total |
|---|---:|---:|---:|
| 정상 | 800 | 800 | 1600 |
| 여드름 | 800 | 800 | 1600 |
| 주사 | 800 | 800 | 1600 |
| 아토피 | 800 | 800 | 1600 |
| 건선 | 800 | 800 | 1600 |
| 지루 | 800 | 800 | 1600 |
| 총합 |  |  |       9600 |

### b. Central Learning (중앙 모델 사전 학습) 데이터 구성

중앙 모델은 전체 데이터셋의 약 70% (6,720장) 를 사용하여  
피부질환 도메인에 특화된 fine-tuning을 수행하였다.

| 질병 구분 | 수량 |
|---|---:|
| 건선_정면 | 560 |
| 건선_측면 | 560 |
| 주사_정면 | 560 |
| 주사_측면 | 560 |
| 지루_정면 | 560 |
| 지루_측면 | 560 |
| 정상_정면 | 560 |
| 정상_측면 | 560 |
| 여드름_정면 | 560 |
| 여드름_측면 | 560 |
| 아토피_정면 | 560 |
| 아토피_측면 | 560 |
| 총합 | 6720 |


### c. Federated Learning 데이터 구성

연합학습 단계에서는 중앙 학습에 사용되지 않은  
전체 데이터의 30% (2,880장) 를 사용하였다.

| 질병 구분 | 수량 |
|---|---:|
| 건선_정면 | 240 |
| 건선_측면 | 240 |
| 주사_정면 | 240 |
| 주사_측면 | 240 |
| 지루_정면 | 240 |
| 지루_측면 | 240 |
| 정상_정면 | 240 |
| 정상_측면 | 240 |
| 여드름_정면 | 240 |
| 여드름_측면 | 240 |
| 아토피_정면 | 240 |
| 아토피_측면 | 240 |
| 총합 | 2880 |

---

### d. 클라이언트(사용자)별 데이터 분배

연합학습 환경을 가정하여, 각 클라이언트는  
동일한 수의 데이터를 보유하도록 균등 분배하였다.

| 질병 구분 | 민지 | 시우 | 소연 |
|---|---:|---:|---:|
| 건선_정면 | 80 | 80 | 80 |
| 건선_측면 | 80 | 80 | 80 |
| 주사_정면 | 80 | 80 | 80 |
| 주사_측면 | 80 | 80 | 80 |
| 지루_정면 | 80 | 80 | 80 |
| 지루_측면 | 80 | 80 | 80 |
| 정상_정면 | 80 | 80 | 80 |
| 정상_측면 | 80 | 80 | 80 |
| 여드름_정면 | 80 | 80 | 80 |
| 여드름_측면 | 80 | 80 | 80 |
| 아토피_정면 | 80 | 80 | 80 |
| 아토피_측면 | 80 | 80 | 80 |
| 총합 | 960 | 960 | 960 |




## 6. 애플리케이션 구동법
> Expo를 모바일에 선행적으로 설치합니다. 배포된 서버가 아닌 **로컬 서버 구동**을 원칙으로 합니다.
### a. 백엔드 구동
#### 1) 환경변수 등록
> 벡터 DB는 외부에 공개되지 않습니다.
실제 멀티모달 서비스 테스트가 필요한 경우, 별도 요청 시 API를 발급해 드립니다.
```bash
PINECONE_API_KEY="YOUR_KEY"
PINECONE_ENVIRONMENT="YOUR_LOCATION"
PINECONE_INDEX_NAME="YOUT_INDEX_NAME"
IMAGE_MODEL_PATH=models/best_model.pt
DISEASE_CLASSES=["건선", "아토피", "여드름", "정상", "주사", "지루"]
```
#### 2) 실행
> http://127.0.0.1/8000/docs 혹은 http://localhost:8000/docs 로 swagger 문서 확인 가능합니다.(단일 엔드포인트: model)
```bash
# 의존성 설치
pip install -r requirements.txt

# 루트에서 실행
uvicron app.main:app --reload
```
### b. 프론트엔드 구동

#### 1) 환경변수 등록
```bash
EXPO_PUBLIC_BASE_URL="http://YOUR_IP:8000"
```
#### 2) 실행
```bash
# 의존성 설치
npm install

# 디렉터리 이동
cd fed-app

# 애플리케이션 실행 후 플랫폼 선택
npm start or expo go

# 각 플랫폼 별로 실행
npm ios
npm android
npm web
```

### c. 애플리케이션 화면 예시

다음은 본 프로젝트에서 구현한 모바일 애플리케이션의 실제 실행 화면이다.  
사용자는 피부 사진 촬영 또는 업로드를 통해 질환 분석을 요청할 수 있으며,  
필요에 따라 증상 설명을 함께 입력할 수 있다.

<p align="center">
  <img src="https://github.com/user-attachments/assets/39ac420c-7a8d-4c86-8625-31550d20ae2b" width="280"/>
  <img src="https://github.com/user-attachments/assets/c52c0ad2-0067-4244-8493-e2525c2dd7e9" width="280"/>
</p>

- **애플리케이션 시작 화면(좌)**  
  애플리케이션 실행 시 표시되는 초기 화면으로,  
  AI 기반 피부 질환 분석 서비스의 목적과 기능을 직관적으로 안내한다.

- **피부 진단 요청 화면(우)**  
  사용자는 카메라 촬영 또는 갤러리 선택을 통해 피부 이미지를 입력할 수 있으며,  
  증상 설명을 선택적으로 입력하여 분석 정확도를 보완할 수 있다.  
  입력된 데이터는 서버에 원본 이미지로 저장되지 않으며,  
  모델 추론 결과만을 기반으로 진단 결과를 제공한다.


## 7. 참고 자료
<!-- 원본 논문 링크 -->
[송현진, 문현수, 이영석.
「연합학습 기반 피부 질환 이미지 분류 모바일 어플리케이션」,
한국소프트웨어종합학술대회 논문집, 2021, pp. 1220–1222.](https://www.dbpia.co.kr/journal/articleDetail?nodeId=NODE11035999)
<!-- 허깅페이스 링크 -->
[사용한 pytorch로 포팅된 mobilenet_v3](https://huggingface.co/timm/mobilenetv3_small_100.lamb_in1k)
<!-- 고려대 모델 링크 -->
[한국어 특화 임베딩 모델(KURE)](https://huggingface.co/nlpai-lab/KURE-v1)
<!-- 데이터셋 링크 -->
[ai-hub 안면부 피부질환 데이터셋](https://www.aihub.or.kr/aihubdata/data/view.do?currMenu=115&topMenu=100&aihubDataSe=data&dataSetSn=71863)
