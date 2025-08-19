// src/modules/user/user.service.ts
export class UserService {
  // 단일 사용자 조회
  getUserById(id: string) {
    // 실무에서는 DB 조회 로직이 들어감
    return { id, name: '홍길동', age: 29, height: 175.5, isActive: true };
  }

  // 사용자 생성
  createUser(name: string, age: number, height: number) {
    // 추가 유효성 검사 (Custom Scalar에서 막히지 않는 로직 처리)
    if (age < 0 || age > 120) {
      throw new Error('나이는 0~120세 범위여야 합니다.');
    }

    // DB 저장 로직 대신 샘플 데이터 반환
    return { id: 'u124', name, age, height, isActive: true };
  }
}
