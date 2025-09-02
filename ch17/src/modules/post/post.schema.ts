// /src/modules/post/post.schema.ts

export const postTypeDefs = /* GraphQL */ `
  """
  게시글 데이터 구조 정의
  - createdAt: ISO-8601 형식의 DateTime 스칼라(서버에 별도 정의 필요)
  - author: User 타입과의 관계 필드 (작성자 정보)
  """
  type Post {
    id: Int!
    title: String!
    content: String!
    published: Boolean!
    createdAt: DateTime!
    author: User!
  }

  """
  게시글 필터링 조건 입력 타입
  - 이 타입은 '중첩 가능한 논리 트리'입니다.
  - 같은 객체 레벨에서 여러 필드를 함께 주면 암묵적으로 AND(모두 만족)으로 취급됩니다.
    예) { title: "GraphQL", published: true } == (title contains "GraphQL") AND (published == true)
  - title: 기본적으로 '부분 일치(contains, case-insensitive)'로 가정 (구현에 따라 exact/startsWith 등으로 변경 가능)
  - published: 정확 일치 (true/false)
  - 비워 두거나 모두 null/미지정이면 필터 없음 → 전체 목록 대상
  """
  input PostFilterInput {
    """
    AND: 모든 하위 조건 그룹을 '모두 만족'해야 합니다(교집합).
    - 배열의 각 요소는 또 하나의 PostFilterInput(조건 묶음)입니다.
    - 중첩 가능: (A OR B) AND (C OR (NOT D)) 같은 표현을 트리로 구성
    - 예)
      AND: [
        { published: true },
        { OR: [ { title: "GraphQL" }, { title: "Prisma" } ] }
      ]
      -> published == true AND (title contains "GraphQL" OR title contains "Prisma")
    """
    AND: [PostFilterInput!]

    """
    OR: 하위 조건 그룹 중 '하나 이상 만족'하면 됩니다(합집합).
    - 여러 검색어를 넓게 매칭할 때 유용
    - 예)
      OR: [
        { title: "GraphQL" },
        { title: "Prisma" }
      ]
      -> title contains "GraphQL" OR title contains "Prisma"
    """
    OR: [PostFilterInput!]

    """
    NOT: 하위 조건 그룹을 '부정'합니다.
    - 각 요소는 독립적으로 부정되며(권장 구현: 모두 부정 AND 결합), 특정 조건을 제외할 때 사용
    - 예)
      NOT: [
        { published: false },         # '비공개'를 제외
        { title: "draft" }            # 제목에 'draft'가 포함된 것 제외
      ]
      -> NOT(published == false) AND NOT(title contains "draft")
    - De Morgan 법칙에 따라 AND/OR와 중첩 조합하여 강력한 제외 필터를 구성할 수 있음
    """
    NOT: [PostFilterInput!]

    """
    제목 필터
    - 기본 가정: 부분 일치(contains, case-insensitive)
    - 구현 팁:
      - Prisma 사용 시: { title: { contains: value, mode: "insensitive" } }
      - 정확 일치가 필요하면 주석에 맞춰 리졸버에서 equals로 변경
    """
    title: String

    """
    공개 여부 필터 (정확 일치)
    - true: 공개 글만, false: 비공개 글만
    """
    published: Boolean
  }

  """
  정렬 방향
  - asc: 오름차순, desc: 내림차순
  """
  enum SortOrder {
    asc
    desc
  }

  """
  정렬 기준 및 방향
  - field: 정렬할 컬럼명("title", "createdAt", "published" 등)
    * 문자열 오타를 방지하려면 Enum 기반 필드를 권장(예: PostSortableField)
  - order: asc/desc
  - 미지정 시 서버 기본값 사용(예: createdAt desc)
  """
  input PostSortInput {
    field: String!
    order: SortOrder!
  }

  """
  게시글 목록 조회
  - filter: 조건 검색(미지정 시 전체 대상)
  - sort: 정렬 옵션(미지정 시 서버 기본값)
  """
  type Query {
    posts(
      filter: PostFilterInput # 게시글 필터링 조건
      sort: PostSortInput # 게시글 정렬 옵션
    ): [Post!]!
  }
`;
