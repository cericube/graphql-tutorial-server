// src/utils/error.ts
import { GraphQLError } from 'graphql';

export class NotFoundError extends GraphQLError {
  constructor(entity: string, id: number | string) {
    super(`${entity} ID ${id}번 항목에러을 찾을 수 없습니다.`, {
      extensions: {
        code: 'NOT_FOUND',
        http: { status: 404 },
        entity,
        id,
      },
    });
  }
}

// // 커스텀 에러 클래스를 정의하는 파일입니다.

// export class AppError extends Error {
//   public statusCode: number; // HTTP 상태 코드
//   public isOperational: boolean; // 운영상 에러 여부

//   // 에러 메시지, 상태 코드, 운영상 에러 여부를 받아 초기화합니다.
//   constructor(message: string, statusCode: number, isOperational = true) {
//     super(message);
//     this.name = new.target.name; // 에러 클래스 이름(AppError)
//     this.statusCode = statusCode;
//     this.isOperational = isOperational;
//     Error.captureStackTrace(this, this.constructor); // 스택 트레이스 캡처
//   }
// }

// // 리소스를 찾을 수 없을 때 사용하는 에러 클래스입니다.
// export class NotFoundError extends AppError {
//   // 기본 메시지는 'Resource not found'이며, 상태 코드는 404입니다.
//   constructor(message: string = 'Resource not found') {
//     super(message, 404);
//   }
// }
