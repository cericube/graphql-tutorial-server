// src/utils/logger.ts

import path from 'path';
import winston from 'winston';

// 로그 메시지의 공통 포맷 정의
// - timestamp: 로그 발생 시각 추가
// - errors({ stack: true }): 에러 발생 시 스택 트레이스 포함
// - json(): 로그를 JSON 형식으로 출력
const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

// 특정 로그 레벨만 필터링하는 포맷 생성 함수
// - info.level이 인자로 받은 level과 일치할 때만 로그를 남김
const levelFilter = (level: string) =>
  winston.format((info) => {
    console.log(`Filtering log level: ${info.level}`); // 필터링 레벨 출력
    // info.level이 원하는 레벨이면 info 객체 반환, 아니면 로그 무시(false 반환)
    return info.level === level ? info : false;
  })();

// winston 로거 인스턴스 생성
// - level: 'debug'로 설정하여 모든 레벨의 로그를 처리
// - transports: 로그를 출력/저장할 대상(콘솔, 파일 등) 지정
export const logger = winston.createLogger({
  level: 'debug', // 최소 로그 레벨 지정 (debug 이상 모두 기록)
  transports: [
    // 콘솔에 모든 로그를 JSON 포맷으로 출력
    new winston.transports.Console({
      format: logFormat,
    }),

    // info.log 파일에 info 레벨 로그만 기록
    new winston.transports.File({
      filename: path.join('logs', 'info.log'), // 로그 파일 경로
      level: 'info', // info 레벨만 기록
      format: winston.format.combine(levelFilter('info'), logFormat), // info만 필터링 후 포맷 적용
    }),

    // error.log 파일에 error 레벨 로그만 기록
    new winston.transports.File({
      filename: path.join('logs', 'error.log'),
      level: 'error',
      format: winston.format.combine(levelFilter('error'), logFormat),
    }),

    // debug.log 파일에 debug 레벨 로그만 기록
    new winston.transports.File({
      filename: path.join('logs', 'debug.log'),
      level: 'debug',
      format: winston.format.combine(levelFilter('debug'), logFormat),
    }),
  ],
});
