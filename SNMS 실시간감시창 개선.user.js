// ==UserScript==
// @name         SNMS 실시간감시창 개선_Test
// @version      1.6
// @description  SNMS에 GPT, SOP 연결
// @author       junhh
// @match        https://*/fault/realtime/list.do
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// ==/UserScript==

(function () {
    'use strict';
  //https://*/fault/realtime/list.do
  //*://*/


// SNMS에 접속이 되지 않는 경우 SOP 제공하는 함수 => 접속불가등 대형장애 SOP 제공 링크 및 맵핑 수정 필요!!!
function showErrorMessage() {
    const messageDiv = document.createElement('div');
    messageDiv.textContent = '웹페이지에 접속이 되질 않습니다. 아래 프로세스를 따르세요';
    messageDiv.style.position = 'fixed';
    messageDiv.style.top = '50%';
    messageDiv.style.left = '50%';
    messageDiv.style.transform = 'translate(-50%, -50%)';
    messageDiv.style.backgroundColor = 'rgba(255, 0, 0, 0.8)';
    messageDiv.style.color = 'white';
    messageDiv.style.padding = '20px';
    messageDiv.style.borderRadius = '10px';
    messageDiv.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
    messageDiv.style.fontSize = '18px';
    messageDiv.style.textAlign = 'center';

    // 추가 문구와 하이퍼링크를 위한 div 생성
    const additionalInfo = document.createElement('div');
    additionalInfo.style.marginTop = '10px'; // 상단 문구와 간격 설정
    additionalInfo.innerHTML = `
        1. 방화벽체크 SOP : <a href="http://example.com/sop" style="color: yellow; text-decoration: underline;" target="_blank">[SOP 확인]</a><br>
        2. 네트워크 연결 상태 확인 : <a href="http://example.com/network-check" style="color: yellow; text-decoration: underline;" target="_blank">[연결 상태 확인]</a><br>
        3. 시스템 로그 확인 가이드 : <a href="http://example.com/system-log" style="color: yellow; text-decoration: underline;" target="_blank">[로그 가이드]</a>
    `;

    // messageDiv에 추가 문구 추가
    messageDiv.appendChild(additionalInfo);

    document.body.appendChild(messageDiv);
}

// 페이지 상태를 감지하여 showErrorMessage 실행 함수
function checkPageStatus() {
        // 특정 DOM 요소가 있는지 확인 (예: 'list_table')
        console.log("checkPageStatus 실행");
        const listTable = document.getElementById('list_table');

        // DOM 요소가 없거나 페이지가 비어있으면 에러 메시지 표시
        if (!listTable) {
            console.warn('필수 DOM 요소를 찾을 수 없습니다. 에러 메시지를 표시합니다.');
            showErrorMessage();
        }
}

// SOP 모음 연결해주는 함수 => SOP 모음 링크 수정 필요
function ShowSOPAll() {
    // 'cri' 클래스를 가진 li 요소를 찾기
    const ariElement = document.querySelector('.cri');
    if (ariElement) {
        // 'ari' 요소 앞에 새로운 'li' 태그 삽입
        const newButtonHTML = `<li class="sopall" tabindex="0">SOP모음</li>`;
        ariElement.insertAdjacentHTML('beforebegin', newButtonHTML);

        // 새로 추가된 'sopall' 요소를 선택
        const sopall = ariElement.previousElementSibling;

        // 클릭 이벤트: 클립보드 복사 + 팝업 메시지
        sopall.addEventListener('click', () => {
            const url = `https://lgupluscorp.sharepoint.com/sites/a_191/New/Forms/view.aspx?id=%2Fsites%2Fa%5F191%2FNew%2F%ED%94%8C%EB%9E%AB%ED%8F%BC%2FIDC&viewid=1a19c7bf%2D77bd%2D47ea%2Db3dd%2D9cd9b93f1536`;

            navigator.clipboard.writeText(url).then(() => {
                // 팝업 메시지 생성
                const popup = document.createElement('div');
                popup.innerText = '링크가 복사되었습니다!';
                popup.style.position = 'fixed';
                popup.style.top = '20px';
                popup.style.left = '50%';
                popup.style.transform = 'translateX(-50%)';
                popup.style.backgroundColor = '#333';
                popup.style.color = '#fff';
                popup.style.padding = '10px 20px';
                popup.style.borderRadius = '10px';
                popup.style.zIndex = 9999;
                popup.style.fontSize = '14px';
                popup.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
                document.body.appendChild(popup);

                // 2초 후 팝업 제거
                setTimeout(() => {
                    document.body.removeChild(popup);
                }, 2000);
            }).catch(err => {
                console.error('클립보드 복사 실패:', err);
            });
        });

        // 버튼에 스타일 적용
        sopall.style.backgroundColor = '#4CAF50'; // 배경 초록색
        sopall.style.color = 'white'; // 글자 색 하얀색
        sopall.style.width = '65.97px'; // 버튼 너비
        sopall.style.height = '20px'; // 버튼 높이
        sopall.style.border = 'none'; // 테두리 없앰
        sopall.style.borderRadius = '5px'; // 둥근 모서리
        sopall.style.cursor = 'pointer'; // 포인터 커서
        sopall.style.fontSize = '14px'; // 글자 크기
        sopall.style.textAlign = 'center'; // 글자 가운데 정렬
        sopall.style.lineHeight = '20px'; // 텍스트 수직 가운데 정렬
        sopall.style.outline = 'none'; // 포커스 시 외곽선 없애기
        sopall.style.transition = 'all 0.3s'; // 전환 효과
        sopall.style.marginRight = '3px';

        // 버튼에 hover 효과 적용
        sopall.addEventListener('mouseover', () => {
            sopall.style.transform = 'scale(0.9)';
        });

        sopall.addEventListener('mouseout', () => {
            sopall.style.transform = 'scale(1)';
        });

        // 키보드 포커스 스타일
        sopall.addEventListener('focus', () => {
            sopall.style.boxShadow = '0 0 5px rgba(0, 0, 0, 0.3)';
        });

        sopall.addEventListener('blur', () => {
            sopall.style.boxShadow = 'none';
        });
    } else {
        console.warn("ari 클래스가 있는 li 요소를 찾을 수 없습니다.");
    }
}

// 테이블 헤더 추가 함수 (GPT, SOP)
function addHeader(columnIndex, textContent) {
        const listTable = document.getElementById('list_table');
        if (listTable) {
            const headerRow = listTable.querySelector('tr');
            if (headerRow) {
                const newHeaderCell = headerRow.insertCell(columnIndex);
                newHeaderCell.textContent = textContent;
                newHeaderCell.style.width = '80px';
                newHeaderCell.style.color = 'blue';
                newHeaderCell.style.backgroundColor = '#E9E9E9';
            }
        } else {
            console.warn('list_table을 찾을 수 없습니다.');
        }
}

// 테이블 열 안에 버튼 추가 함수 (GPT바로가기, SOP바로가기) => SOP 맵핑시 아래 함수 내용 수정!!!
function addColumn(columnIndex, type) {
        const dataDiv = document.getElementById('menu_v');
        if (!dataDiv) {
            console.warn('menu_v를 찾을 수 없습니다.');
            return;
        }

        const dataTables = dataDiv.querySelectorAll('table#content_0');
        if (dataTables.length === 0) {
            console.warn('content_0 테이블을 찾을 수 없습니다.');
            return;
        }

        dataTables.forEach((dataTable) => {
            const dataRows = dataTable.querySelectorAll('tr');
            dataRows.forEach((row) => {
                const newCell = row.insertCell(columnIndex);
                newCell.style.width = '80px';

                const ErrorContent = row.cells[9]?.textContent || '';
                const Devicename = row.cells[5]?.textContent || '';
                const IPaddr = row.cells[6]?.textContent || '';

                if (type === 'SOP') {
                    // URL 매핑 테이블
                    let url = null;

                    if(Devicename === 'NPOAP_NEW' && /Oracle\s*Alert\s*log\s*Check/i.test(ErrorContent)){
                         url = 'https://lgupluscorp.sharepoint.com/:p:/s/IDCNW/EePEt9bAeihDuUUoVP33ACwBl7ooE29HV9gCxz7GF4e0hA?e=0Q0qmS'; //고객지원포탈_ORA_장애처리_SOP
                       } else if(Devicename === 'NPOAP_NEW' && /Oracle\s*Tablespace\s*Check/i.test(ErrorContent)){
                         url = 'https://lgupluscorp.sharepoint.com/:p:/s/IDCNW/EfodNciRp0VAo3NXAXYDnnsBIkaalzXkMiEa-BvQJQFXnA?e=gyHubg'; //고객지원포탈_MAX_WARN_장애처리
                       } else if(Devicename === 'NPOAP_NEW' && ( /oracle\s*process\s*down/i.test(ErrorContent) || /Ping/i.test(ErrorContent))){
                         url = 'https://lgupluscorp.sharepoint.com/:p:/s/IDCNW/EYacsv8Y2VhPpBIJnsR-6fEBON66zWlnarTz0AoCNqzNWQ?e=S0I9OU'; //고객지원포탈 DB 응답지연 장애처리 SOP
                       } else if(Devicename === 'K8_SNMS_WEB' && /ava\s*프로세스\s*Down/i.test(ErrorContent)){
                         url = 'https://lgupluscorp.sharepoint.com/:p:/s/IDCNW/EVLKtcF0BaZEhtd2vvkKPwcB1IO1DW2mk9RK8_dkyXJaCw?e=owDcSv'; //평촌 SNMS 웹서비스 장애처리 SOP
                       } else if((Devicename === 'mydomo_New' || Devicename === 'NPOAP_NEW') && (/CPU\s*LOAD\s*AVG/i.test(ErrorContent) || /CPU\s*사용율/i.test(ErrorContent) || /java\s*프로세스/i.test(ErrorContent))){
                         url = 'https://lgupluscorp.sharepoint.com/:p:/s/IDCNW/ETnJKGlVvNtGp25FlrKgjTQBTvKQOkez5JXTTx6WBnX8jQ?e=2layP3'; //고객지원포탈 웹페이지 접속지연 장애처리 SOP
                       } else if((Devicename === 'NPOTM_collect1' || Devicename === 'NPOTM_collect2') && /AGENT(9755)\s*IS\s*DOWN/i.test(ErrorContent)){
                         url = 'https://lgupluscorp.sharepoint.com/:p:/s/IDCNW/EWzgI9HgSLFEqgGpukLXM4MBC-FmXQDUkU43N0m9Nw5xgA?e=RZ2q1x'; //고객지원포탈(일반회선) 리부팅현상 장애처리 SOP
                       }
                  else{
                    url = 'https://lgupluscorp.sharepoint.com/sites/a_191/New/Forms/view.aspx?id=%2Fsites%2Fa%5F191%2FNew%2F%ED%94%8C%EB%9E%AB%ED%8F%BC%2FIDC&viewid=1a19c7bf%2D77bd%2D47ea%2Db3dd%2D9cd9b93f1536'
                  }

                    if (url) {
                        const button = document.createElement('button');
                        button.textContent = '링크복사';
                        button.style.width = '70px';
                        button.style.backgroundColor = '#696969';
                        button.style.color = 'white';
                        button.style.border = 'none';
                        button.style.cursor = 'pointer';

                        button.addEventListener('mouseover', () => {
                            button.style.backgroundColor = '#FFA500';
                        });

                        button.addEventListener('mouseout', () => {
                            button.style.backgroundColor = '#696969';
                        });

                      button.addEventListener('click', (event) => {
                          event.preventDefault(); // ← 이 한 줄이 리프레시 방지

    navigator.clipboard.writeText(url).then(() => {
        const popup = document.createElement('div');
        popup.innerText = '링크가 복사되었습니다!';
        popup.style.position = 'fixed';
        popup.style.top = '20px';
        popup.style.left = '50%';
        popup.style.transform = 'translateX(-50%)';
        popup.style.backgroundColor = '#333';
        popup.style.color = '#fff';
        popup.style.padding = '10px 20px';
        popup.style.borderRadius = '10px';
        popup.style.zIndex = 9999;
        popup.style.fontSize = '14px';
        popup.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
        document.body.appendChild(popup);

        setTimeout(() => {
            document.body.removeChild(popup);
        }, 2000);
    }).catch(err => {
        console.error('클립보드 복사 실패:', err);
    });
});


                        newCell.appendChild(button);
                    } else {
                        newCell.textContent = 'SOP없음';
                        newCell.style.color = 'gray';
                        newCell.style.textAlign = 'center';
                    }
                }

                if (type === 'GPT') {
                    const button = document.createElement('button');
                    button.textContent = '바로가기';
                    button.style.width = '70px';
                    button.style.backgroundColor = '#696969';
                    button.style.color = 'white';
                    button.style.border = 'none';
                    button.style.cursor = 'pointer';

                    button.addEventListener('mouseover', () => {
                        button.style.backgroundColor = '#0000FF';
                    });

                    button.addEventListener('mouseout', () => {
                        button.style.backgroundColor = '#696969';
                    });

                    button.addEventListener('click', () => {
                        const url = `https://chat.openai.com/?prompt=${encodeURIComponent("아래 서버 장비의 오류 알람에 대해 점검방법(명령어)와 해결방법을 상세히 알려줘\n 알람내용: " + ErrorContent)}`;
                        window.open(url, '_blank');
                    });

                    newCell.appendChild(button);
                }
            });
        });
}
// XHR 요청 완료 감지 및 함수 호출 -> 열 제목과 열 내용 (GPT,SOP) 실행

const originalOpen = XMLHttpRequest.prototype.open;

XMLHttpRequest.prototype.open = function (method, url, async, user, password) {

        this.addEventListener('load', () => {

            if (this.status === 200) {

                console.log('XHR 요청 완료');

                const listTable = document.getElementById('list_table');

                const SOPALL = document.querySelector('.sopall');

                // 헤더 유무 확인 후 헤더 추가

                if (listTable) {

                    const headerRow = listTable.querySelector('tr');

                    if (headerRow) {

                        const headers = Array.from(headerRow.cells).map(cell => cell.textContent);

                        if (!headers.includes('GPT 연결')) {

                            addHeader(3, 'GPT 연결');

                        }

                        if (!headers.includes('SOP 연결')) {

                            addHeader(4, 'SOP 연결');

                        }

                    }

                }

                if(!SOPALL) {

                  ShowSOPAll();

                }

                // 2초 뒤 열 안에 버튼 추가

                setTimeout(() => {

                    addColumn(3, 'GPT');

                    addColumn(4, 'SOP');

                }, 3000);

            }

        });

        originalOpen.call(this, method, url, async, user, password);

};

// 페이지 로드 시 초기 실행 -> GPT연결, SOP 연결

window.addEventListener('load', () => {

        setTimeout(() => {

            addHeader(3, 'GPT 연결');

            addHeader(4, 'SOP 연결');

            addColumn(3, 'GPT');

            addColumn(4, 'SOP');

        }, 3000);

});

// 페이지 로드 상태를 감지 -> ShowSOPAll & checkPageStatus

window.addEventListener('load', () => {

    setTimeout(() => {

            ShowSOPAll();

            checkPageStatus();

        }, 4000); // 4초 후 확인

});

// DOMContentLoaded를 활용한 초기 감지 -> ShowSOPAll & checkPageStatus

document.addEventListener('DOMContentLoaded', () => {

        // 페이지 초기 상태 확인

        setTimeout(() => {

            ShowSOPAll();

            checkPageStatus();

        }, 1000); // 1초 후 확인

    });

})();
