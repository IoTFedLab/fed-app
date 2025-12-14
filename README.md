# [Team 8] 사물인터넷 Lab-02 연합학습 논문 구현 

## 목차
[1. 프로젝트 소개](#1.프로젝트-소개)
- [a.레포지토리 설명](##a.레포지토리-설명)
- [b.프로젝트 설명](##b.프로젝트-설명)


## 1.프로젝트 소개
### a. 레포지토리 설명
|Name|Description|Link|
|:-:|:-:|:-:|
|federated-iot-project|중앙 모델 도메인 학습용 코드|[federated-iot-project](https://github.com/IoTFedLab/federated-iot-project)|
|flower-server|연합학습용 flower 관련 코드|[flower-server](https://github.com/IoTFedLab/flower-server)|
|fed-app|애플리케이션 코드(프론트엔드)|[fed-app](https://github.com/IoTFedLab/fed-app)|
|fed-api|모델 로드 및 db 연결용 api 서버(백엔드)|[fed-api](https://github.com/IoTFedLab/fed-api)|
<!--여기에 설명 추후 적어야함...-->

### b. 프로젝트 설명
  
## 2.팀원 소개

<div align="center">
  
|이민지|한소연|이시우|
|:-:|:-:|:-:|
|<img src="https://avatars.githubusercontent.com/u/175521353?v=4" width=100 height=100>|<img src="https://avatars.githubusercontent.com/u/162886838?v=4" width=100 height=100>|<img src="https://avatars.githubusercontent.com/u/232974722?v=4" width=100 height=100>|
|[@Minter-v1](https://github.com/Minter-v1)<br/><ul align="center"><li>프로젝트 총괄</li><li>학습 인프라 설계 및 구현</li></ul>|[@Soyeon Han](https://github.com/Han-soyeon)<br/><ul><li>애플리케이션 디자인</li><li>애플리케이션 구현</li></ul>|[@ceeeu](https://github.com/ceeeu)<br/><ul align="center"><li>api 서버 설계</li><li>데이터베이스 관련 작업</li></ul>|

</div>

## 3.기술스택
![My Skills](https://go-skill-icons.vercel.app/api/icons?i=pytorch,reactnative,fastapi,pinecone,python,javascript,typescript,expo)
<!-- 플라워 로고 -->
<!-- 역할별로 로고 분리하면 좋을 듯 -->

## 4.시스템 아키텍쳐
![시스템 아키텍쳐](./docs_asset/SA.jpg)
![alt text](https://file%2B.vscode-resource.vscode-cdn.net/Users/minji/Desktop/WorkSpace/fed-app/docs_asset/SA.jpg)
## 5.애플리케이션 구동법
> expo go를 모바일에 선행적으로 설치합니다. 배포된 서버가 아닌 **로컬 서버 구동**을 원칙으로 합니다.
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

## 6.추가 자료(발표 자료)
<!--발표 자료랑 실제 애플리케이션 캡쳐본 넣으면 좋을 것 같음-->
> [발표자료 바로가기](./docs_asset/[사물인터넷-오후반]_팀8_프로젝트2_발표자료.pdf)
![cover](./docs_asset/cover.png)</br>



## 7.별첨
<!-- 원본 논문 링크 -->
<!-- 허깅페이스 링크 -->
<!-- 고려대 모델 링크 -->
<!-- 데이터셋 링크 -->