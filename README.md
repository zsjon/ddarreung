![image](https://github.com/user-attachments/assets/4f8a9fb9-9d3c-42f8-81cd-21216e13ec2d)# 2024 서울 지능형 사물인터넷(AIoT) 해커톤 대회 출품작 - 따릉이 회수 시스템(가제)

### 출품분야: 아두이노 활용 시제품 제작

#### --------------------

### 팀명: CLUE(Comprehensive Lost Unit Examiner)

#### --------------------

### 주요 기능

#### - 각 공원마다 설치되어 있는 CCTV를 활용하여 1시간마다 촬영중인 사진을 촬영

#### 만약 해당 CCTV의 화면에 따릉이가 일정 시간 이상 존재 시, 해당 CCTV의 위치를 서버로 전송한 뒤 '유실 의심물'로 선정하고, 이후 한번 더 감지 시 '유실물'로 표시

#### 관리 페이지의 경우, 서울시 공원으로 지정된 130여 개의 공원 리스트가 유실물을 발견한 CCTV가 많은 순으로 출력되며, 특정 공원 클릭 시 해당 공원의 지도와 함께 발견된 유실물들, 그리고 그 유실물을 발견한 CCTV의 마커가 나타남.

#### 하단의 표에 존재하는 CCTV를 클릭 시, Drawer 창이 열리며 해당 CCTV가 발견한 유실물들과 그 정보가 표시되며, '회수' 버튼을 통해 회수한 유실물의 데이터를 화면에서 지울 수 있음.

#### 단, 회수된 따릉이는 '회수 시간'과 함께 Firebase 서버 내에서 여전히 남아있게 됨.

#### CCTV는 회전형과 고정형 두 가지가 존재하며, 두 시야각이 겹치는 경우 중복 객체를 인식할 수 있음.

#### --------------------

### Used Technologies

#### 1. React

#### 2. FireBase

#### 3. TensorFlow Light(TFLite)

#### 4. YOLOv5

#### 5. RaspBerryPi 4

#### 6. MQTT(Message Queuing Telemetry transport)

#### --------------------

### 프로토타입 시연 영상 링크:
#### https://youtu.be/f8VLiJ7wRhE

#### --------------------

### Team Participation

#### 조민성 - FrontEnd

#### 김민재 - Firebase DB & MQTT Server

#### 김진성 - FrontEnd

#### 박정수 - Machine Learning & MQTT Server
