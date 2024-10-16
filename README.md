# 2024 서울 지능형 사물인터넷(AIoT) 해커톤 대회 출품작 - 따릉이 회수 시스템(가제)

### 출품분야: 아두이노 활용 시제품 제작

#### --------------------

### 팀명: CLUE(Comprehensive Lost Unit Examiner)

#### --------------------

### 주요 기능

#### - 각 공원마다 설치되어 있는 CCTV를 활용하여 실시간으로 따릉이 객체를 탐지

#### 만약 해당 CCTV의 화면에 따릉이가 일정 시간(1분으로 구현) 이상 존재 시, 해당 CCTV의 위치를 서버로 전송한 뒤 '유실 의심물'로 선정하고, 이후 한번 더 감지 시 '유실물'로 표시

#### 관리 페이지의 경우, 서울시 공원으로 지정된 130여 개의 공원 리스트가 유실물을 발견한 CCTV가 많은 순으로 출력되며, 특정 공원 클릭 시 해당 공원의 지도와 함께 발견된 유실물들, 그리고 그 유실물을 발견한 CCTV의 마커가 나타남.

#### 하단의 DataGrid에 존재하는 CCTV를 클릭 시, Drawer 창이 열리며 해당 CCTV의 실시간 영상 및 CCTV가 발견한 유실물들과 그에 대한 정보가 표시

#### Drawer 클릭 시, 하단 DataGrid의 데이터 Row에서 나타나는 '확인' 버튼을 통해 해당 감지된 유실 따릉이의 이미지를 볼 수 있고, '회수' 버튼을 통해 회수한 유실물의 데이터를 화면에서 지울 수 있음.

#### 단, 회수된 따릉이는 '회수 시간'과 함께 Firebase 서버 내에서 여전히 남아있게 됨

#### Drawer에서 '정보 업데이트' 버튼 클릭 시 Firebase로부터 업데이트된 값들이 Drawer 내 DataGrid에 갱신되어 표시됨

#### CCTV는 회전형과 고정형 두 가지가 존재하며, 'CCTV 범위 확인' 버튼을 통해 해당 CCTV가 감지하는 범위를 알 수 있음

#### 혼잡도 파악 버튼 클릭 후 공원 선택 시, 실시간 영상 스트리밍에서 YOLOv5 인물 탐지를 통해 파악되는 인원의 수에 따라 혼잡/보통/원활 3단계로 구분함

#### 혼잡도 파악 공원 목록에서는 우측 상단의 검색 기능을 통해 input값이 일치하는 공원을 직접 검색할 수 있음

#### 공원별 CCTV Drawer에서는 실시간 혼잡도 Line Chart를 통해 10초 단위의 평균 인원 카운트를, 실시간 트렌드 Chart를 통해 분 단위의 인구 혼잡도를 파악 가능

#### --------------------

### Used Technologies

#### 1. React

#### 2. FireBase

#### 3. TensorFlow Light(TFLite)

#### 4. YOLOv5

#### 5. RaspBerryPi 4

#### 6. MQTT(Message Queuing Telemetry transport) Protocol

#### --------------------

### 프로토타입 시연 영상 링크:
#### https://youtu.be/f8VLiJ7wRhE

### 최종 시연 영상 링크:
#### https://youtu.be/SIyrcX0qS9I

#### --------------------

### Team Participation

#### 조민성 - FrontEnd

#### 김민재 - Firebase DB & MQTT Server

#### 김진성 - UI/UX

#### 박정수 - Machine Learning & MQTT Server
