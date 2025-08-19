// /src/modules/user/user.service.ts

// User 데이터 타입 정의
// - 실제 서비스에서는 DB 모델 또는 Prisma Schema와 매핑될 수 있음
type User = {
  id: string; // 고유 식별자
  name: string; // 사용자 이름
  email: string; // 사용자 이메일
};

// 사용자 관련 비즈니스 로직을 담당하는 서비스 클래스
// - 메모리 배열을 데이터 저장소로 사용 (학습/테스트용)
// - 실무에서는 DB 접근 코드(ORM, SQL 쿼리 등)로 대체 가능
export class UserService {
  // 메모리 기반 사용자 목록 저장소
  private users: User[] = [];

  // ID 생성을 위한 카운터 (DB 사용 시 자동 증가 컬럼/UUID로 대체)
  private idCounter = 1;

  /**
   * 사용자 생성
   * @param name - 사용자 이름
   * @param email - 사용자 이메일
   * @returns 생성된 사용자 객체
   */
  createUser(name: string, email: string): User {
    const newUser = { id: String(this.idCounter++), name, email };
    this.users.push(newUser);
    return newUser;
  }

  /**
   * ID로 사용자 조회
   * @param id - 조회할 사용자 ID
   * @returns 사용자 객체 또는 undefined (없으면)
   */
  getUser(id: string): User | undefined {
    return this.users.find((user) => user.id === id);
  }

  /**
   * 전체 사용자 목록 조회
   * @returns 사용자 배열
   */
  listUser(): User[] {
    return this.users;
  }

  /**
   * 사용자 정보 수정
   * @param id - 수정할 사용자 ID
   * @param name - 변경할 이름 (선택)
   * @param email - 변경할 이메일 (선택)
   * @returns 수정된 사용자 객체
   * @throws 사용자 미존재 시 에러 발생
   */
  updateUser(id: string, name?: string, email?: string): User {
    const user = this.getUser(id);
    if (!user) throw new Error('User not found'); // 존재하지 않으면 예외 발생
    if (name) user.name = name; // name이 전달되면 변경
    if (email) user.email = email; // email이 전달되면 변경
    return user;
  }

  /**
   * 사용자 삭제
   * @param id - 삭제할 사용자 ID
   * @returns 삭제 성공 여부 (true: 삭제됨, false: 해당 ID 없음)
   */
  deleteUser(id: string): boolean {
    const index = this.users.findIndex((user) => user.id === id);
    if (index === -1) return false; // 삭제 대상이 없으면 false 반환
    this.users.splice(index, 1); // 해당 인덱스에서 1개 요소 제거
    return true;
  }
}
