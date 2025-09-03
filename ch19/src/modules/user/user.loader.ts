import DataLoader from 'dataloader';
import { User } from '../../generated/prisma';
import { UserService } from './user.service';

/**
 * 사용자 전용 DataLoader 생성 함수입니다.
 *
 * 목적:
 * - GraphQL의 Nested Resolver 구조에서 발생하는 N+1 문제를 해결합니다.
 * - 동일 요청 내에서 사용자 ID별 요청을 모아 하나의 쿼리로 처리(batch).
 * - 동일 키로 중복 조회될 경우 캐시된 값을 재사용(cache).
 *
 * 사용 조건:
 * - 반드시 요청(Request) 단위로 생성해야 합니다.
 *   (ex. createContext() 내부에서 호출)
 *
 * @param userService 사용자 데이터를 조회하는 서비스 객체
 * @returns 사용자 ID 기반의 DataLoader 인스턴스
 */
export function createUserLoader(userService: UserService) {
  return new DataLoader<number, User>(
    /**
     * 배치 함수 (batchLoadFn)
     * - 같은 이벤트 루프 안에서 호출된 .load(id) 요청들을 수집하여 한 번의 함수로 처리합니다.
     * - 입력된 ID 순서를 그대로 보존하여 결과 배열을 반환해야 합니다.
     * - 누락된 ID에 대해서는 해당 위치에 Error 객체를 반환해야 합니다.
     */
    async (ids: readonly number[]) => {
      // 1. 중복 제거 (같은 ID가 여러 번 요청될 수 있음)
      const uniqueIds = Array.from(new Set(ids));

      // 2. 사용자 일괄 조회 (서비스 계층 통해)
      const users = await userService.findUsersByIds(uniqueIds);

      // 3. 조회된 수가 예상보다 적은 경우 경고 로그 출력 (누락된 ID 존재 가능성)
      if (users.length !== uniqueIds.length) {
        console.warn(
          `[DataLoader:userById] 일부 사용자 ID가 조회되지 않았습니다. (요청 ${uniqueIds.length}개, 결과 ${users.length}개)`
        );
      }

      // 4. 빠른 매핑을 위한 Map 생성 (id → User)
      const userMap = new Map(users.map((user) => [user.id, user]));

      // 5. 요청된 ID 순서대로 결과를 정렬하여 반환
      return ids.map((id) => {
        const foundUser = userMap.get(id);
        if (!foundUser) {
          // 누락된 ID에 대해서는 Error 객체를 반환 (전체 throw 지양)
          console.warn(`[DataLoader:userById] User not found for id=${id}`);
          return new Error(`User not found for id=${id}`);
        }
        return foundUser;
      });
    },
    {
      /**
       * 요청 단위 캐싱 활성화
       * - 같은 요청 내 동일한 ID에 대해 중복 쿼리를 방지합니다.
       * - 요청이 종료되면 캐시는 자동으로 폐기됩니다.
       */
      cache: true,

      // maxBatchSize: 100, // (선택) 한 번에 처리할 최대 ID 수 제한
    }
  );
}
