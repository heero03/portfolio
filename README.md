# 조은일 — 2D 애니메이션 포트폴리오

Google Sites의 공개 콘텐츠를 옮긴 정적 포트폴리오입니다. 페이지는 HTML, CSS, JavaScript와 로컬 이미지를 사용하며 별도 서버 프로그램이 필요하지 않습니다.

- `index.html`: 대표 작업물, 3개 애니메이션 작업, 사용 도구, 연락처
- `about.html`: 소개, skills, 업무 경력, 학력
- `projects.html`: Goddess order 영상과 project 'ZERO' 이미지
- `assets/`: 사용자가 제공한 이미지와 실제 뷰어에서 캡처한 작업물 이미지
- `assets/ssp-pc.png`, `assets/ssp-boss.png`: 각 SSP 뷰어의 실제 1920×1080 장면 캡처
- `viewers/spine-pair/`: gal_test와 witch_test를 재생하는 새 Spine 일러스트 뷰어의 WebGL 빌드

작업물은 PC SSP ANIMATION → BOSS SSP ANIMATION → 새 Spine 일러스트 뷰어 순서입니다. 대표 작업물은 새 Spine 일러스트 뷰어이며 목록의 같은 플레이어로 연결됩니다. 일반 PC에서는 페이지가 열리면 Sites에 게시된 두 SSP 뷰어와 `viewers/spine-pair/`의 새 뷰어, 총 세 개를 자동으로 불러옵니다. 모바일·터치 기기 또는 폭 900px 이하로 연 페이지에서는 미리보기를 먼저 표시하고, ‘여기서 재생’이나 전체화면을 누른 작업물 하나만 불러옵니다. 다른 작업물을 선택하면 이전 뷰어를 종료하여 동시 실행을 막습니다. 이 정책은 페이지를 여는 시점에 정하므로 화면 회전이나 전체화면 전환으로 바뀌지 않습니다. ‘재생 종료’로 멈춘 작업물은 ‘여기서 재생’으로 다시 불러올 수 있습니다. 개별 Unity 뷰어도 데이터와 메모리를 많이 사용하므로 모든 휴대전화에서 실행을 보장하지는 않습니다.

- [PC SSP ANIMATION](https://pc-ssp-animation.millialdo82.chatgpt.site): LISBETH, VIOLET, JAN, ETNA, ASHERAD, SARAH, SIBYLLA, RAYRING의 8종.
- [BOSS SSP ANIMATION](https://boss-ssp-animation.millialdo82.chatgpt.site): PARMANA, ELENARRUND, VIRTUS, PAZIONA, INGRID, FOREST_BEAST의 6종.

두 SSP 뷰어는 지정한 리소스만 포함한 별도 빌드이며 CS와 나머지 캐릭터는 포함하지 않습니다. 기존 SSP 뷰어의 목록·타임라인·재생·확대/축소·방향 전환 기능을 유지합니다. 이전 통합 SSP 공개 뷰어는 포트폴리오 목록에서만 교체합니다.

기존 Spine 인게임 픽셀·일러스트·픽업 가챠 뷰어는 포트폴리오 목록과 대표 작업물에서만 제외했습니다. 기존 외부 공개 주소의 빌드는 삭제하거나 덮어쓰지 않습니다.

두 SSP 뷰어와 새 Spine 일러스트 뷰어는 카드와 전체화면의 실제 표시 크기에 맞춰 iframe 영역을 갱신합니다. SSP 픽셀 리소스는 nearest 방식으로 표시하고, 전체화면에서 렌더링 해상도를 갱신하여 선명도를 유지합니다. 새 Spine 일러스트 뷰어는 화면의 픽셀 배율을 최대 2배까지 반영하며 같은 플레이어가 해상도와 글자를 다시 갱신합니다. 각 뷰어의 기존 구성과 검은 여백은 유지됩니다.

전체화면 전환과 복귀는 같은 뷰어를 유지합니다. 브라우저가 전체화면을 지원하지 않으면 페이지 안에서 크게 펼칩니다. 전체화면 닫기 버튼으로 돌아올 수 있습니다. ‘재생이 안 되나요?’에는 다시 불러오기와 원래 주소 링크가 있습니다. JavaScript가 꺼져 있어도 원래 주소에 접근할 수 있습니다.

프로젝트의 YouTube 영상은 별도의 외부 임베드이며 자동 재생하지 않습니다. 뷰어와 영상에는 인터넷 연결 및 외부 서비스 이용 가능 상태가 필요합니다. 이 저장소에는 새 일러스트 뷰어의 배포용 WebGL 파일이 포함되며 Unity 프로젝트 원본은 포함되지 않습니다.

GitHub Pages는 `main` 브랜치의 루트(`/`)를 게시하도록 설정합니다. `.nojekyll`이 있어 별도 Jekyll 처리를 하지 않습니다. 모든 내부 경로가 상대 경로이므로 프로젝트 저장소 하위 주소에서도 동작합니다.

원본: https://sites.google.com/view/heero03portfolio/홈

콘텐츠·이미지·애니메이션의 기존 권리는 원 권리자에게 있습니다. 이 저장소는 별도의 재사용 라이선스를 부여하지 않습니다.
