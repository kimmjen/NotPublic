export const messages = {
    ko: {
        Header: {
            title: "NotPublic",
            subtitle: "데이터 재난 상황판",
            beta: "베타 v0.1.0"
        },
        ImpactStats: {
            leaked_label: "총 유출된 개인정보",
            companies_label: "피해 기업",
            risk_label: "현재 위협 단계",
            risk_high: "심각",
            risk_warning: "경고",
            risk_info: "주의"
        },
        Timeline: {
            end_text: "최근 사건 목록 끝",
            detected_on: "탐지일",
            view_defense: "내 방어책 확인하기",
            viewing_defense: "방어책 확인 중",
            records: "건"
        },
        IncidentDetail: {
            report_label: "사건 상세",
            analysis_title: "정보",
            exposed_data: "유출된 정보",
            action_plan: "대응 방안",
            action_1: "동일한 비밀번호를 사용하는 사이트의 비밀번호 변경",
            action_2: "2단계 인증(2FA) 설정 활성화",
            action_3: "금융 거래 내역 모니터링 및 의심 활동 신고",
            status_label: "현재 상황",
            status_desc: "해당 기업은 유출 사실을 인지하고 조사를 진행 중입니다. 피해 고객에게 개별 통지가 발송되었습니다.",
            download_btn: "전체 분석 리포트 다운로드"
        },
        GlobalInsights: {
            title: "글로벌 대응 사례",
            cases: {
                eu: {
                    title: "GDPR & 잊혀질 권리",
                    desc: "사용자 동의 없는 데이터 수집에 대해 강력한 처벌을 부과하며, 시민에게 데이터 삭제 권한을 부여합니다."
                },
                usa: {
                    title: "Equifax 선례",
                    desc: "대규모 유출 사고 이후, 신용 동결 의무화 및 무료 신원 모니터링이 표준 대응책으로 자리 잡았습니다."
                },
                japan: {
                    title: "개인정보보호법(APPI)",
                    desc: "위탁 업체의 실수에 대해서도 원청 기업에 엄격한 관리 감독 책임을 묻습니다."
                },
                singapore: {
                    title: "PDPA 의무 통지",
                    desc: "데이터 침해 사고 발생 시 당국과 피해자에게 72시간 내 의무적으로 통지해야 합니다."
                }
            }
        },
        Ticker: {
            warning: "현재 대한민국 국민 {count}명의 개인정보가 위협받고 있습니다."
        }
    },
    en: {
        Header: {
            title: "NotPublic",
            subtitle: "Data Disaster Status Board",
            beta: "Beta v0.1.0"
        },
        ImpactStats: {
            leaked_label: "Total Records Leaked",
            companies_label: "Affected Companies",
            risk_label: "Current Risk Level",
            risk_high: "HIGH",
            risk_warning: "WARNING",
            risk_info: "INFO"
        },
        Timeline: {
            end_text: "End of recent incidents",
            detected_on: "Detected on",
            view_defense: "View Defense Strategy",
            viewing_defense: "Viewing Strategy",
            records: "Records"
        },
        IncidentDetail: {
            report_label: "Incident Detail",
            analysis_title: "",
            exposed_data: "Exposed Data",
            action_plan: "Action Plan",
            action_1: "Change your password immediately if you used the same one elsewhere.",
            action_2: "Enable 2FA (Two-Factor Authentication) on your account.",
            action_3: "Monitor your bank statements for suspicious activity.",
            status_label: "Status",
            status_desc: "The company has acknowledged the breach and is investigating the extent of the damage. Official notifications have been sent.",
            download_btn: "Download Full Breach Report"
        },
        GlobalInsights: {
            title: "How the World Fights Back",
            cases: {
                eu: {
                    title: "GDPR & Right to be Forgotten",
                    desc: "Strict regulations enforcing user consent and heavy fines. Citizens have the absolute right to data deletion."
                },
                usa: {
                    title: "The Equifax Precedent",
                    desc: "After massive breaches, mandatory credit freezes and free identity monitoring became defense standards."
                },
                japan: {
                    title: "APPI Vendor Supervision",
                    desc: "Holds companies strictly liable for third-party mishaps, forcing rigorous supply chain security audits."
                },
                singapore: {
                    title: "PDPA Mandatory Notification",
                    desc: "Organizations must notify the PDPC and affected individuals of data breaches within 72 hours."
                }
            }
        },
        Ticker: {
            warning: "Currently, the personal information of {count} citizens is under threat."
        }
    }
};
