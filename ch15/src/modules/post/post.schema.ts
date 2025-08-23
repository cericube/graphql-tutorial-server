// /src/modules/post/post.schema.ts

export const postTypeDefs = /* GraphQL */ `
  # Query 타입이 반드시 정의되어야 서버가 오류 없이 동작
  # → 현재는 Post에 대한 Query는 없지만, 향후 확장을 고려해 빈 필드 _empty를 임시로 선언
  type Query {
    _empty: String
  }

  # Post 타입: 게시글 엔티티 정의
  # - GraphQL에서 게시글 데이터 구조를 클라이언트와 공유할 때 사용
  # - user: 작성자 (User 타입과의 1:N 관계)
  # - categories: 다수의 카테고리(Category와의 N:M 관계)
  type Post {
    id: Int! # 게시글 고유 ID (기본 키)
    title: String! # 게시글 제목
    user: User! # 게시글 작성자 정보 (User 타입과 연결)
    categories: [Category] # 연결된 카테고리 목록 (복수 가능)
  }

  # CategoryInput: 클라이언트에서 카테고리를 입력할 때 사용하는 구조
  # - createPost에서 categories를 배열로 전달받을 때 사용
  input CategoryInput {
    name: String! # 카테고리 이름 (고유해야 함, connectOrCreate의 where 조건에 사용)
  }

  # CreatePostInput: 클라이언트가 게시글 생성 시 전달해야 하는 입력 구조
  # - title은 필수, userId는 optional (user 생성 방식에 따라 null일 수 있음)
  # - categories는 optional (있으면 connectOrCreate 처리, 없으면 무시)
  input CreatePostInput {
    title: String! # 게시글 제목
    userId: Int # 작성자 ID (기존 유저와 연결할 때 사용)
    categories: [CategoryInput!] # 연결 또는 생성할 카테고리 목록
  }

  # Mutation 정의: 게시글을 생성하는 createPost Mutation
  # - input: CreatePostInput 구조를 따름
  # - 반환값: 생성된 Post 객체 (user, categories 포함 가능)
  type Mutation {
    createPost(input: CreatePostInput!): Post!
  }
`;
