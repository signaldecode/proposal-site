# CLAUDE.md (Next.js App Router + TS · Proposal Viewer)

## 목표 (이번 프로젝트는 이것만)

- 제안서 리스트(카드 그리드) 페이지 1개
- 제안서 상세 페이지 1개
  - 상단: 썸네일 + 제목 + 한 줄 설명
  - 하단: PDF를 이미지로 변환한 결과를 "이미지 리스트"로만 렌더링
- 데이터는 **정적 JSON**(하드코딩)으로만 관리
- 스타일은 **SCSS + 토큰**만 사용(인라인 금지)

---

## 기술 스택

- Next.js (App Router)
- React + TypeScript
- SCSS + tokens
- Data: `/src/data/proposals.json`
- Images: `/public/proposals/...`

---

## 라우팅 (필수 2개만)

- `/` : 제안서 리스트 (카드 그리드)
- `/proposals/[slug]` : 제안서 상세

---

## 데이터 규칙 (하드코딩 JSON)

### proposals.json (필수 필드만)
- `slug`: string (유일)
- `title`: string
- `summary`: string (짧게 1줄)
- `thumb`: `{ src: string, alt: string }`
- `pages`: `{ src: string, alt: string }[]`  
  - PDF를 이미지로 변환한 페이지들 (위에서 아래로 순서대로)

> 텍스트/alt는 하드코딩 금지. 전부 JSON에서만 가져온다.

---

## 폴더 구조(최소)

```text
src/
  app/
    (site)/
      layout.tsx
      page.tsx                  # 리스트
      proposals/
        [slug]/
          page.tsx              # 상세
  components/
    ProposalCard.tsx
    ProposalGrid.tsx
    ProposalViewer.tsx          # 상세 하단 이미지 리스트 렌더러
  data/
    proposals.json
assets/
  styles/
    tokens/
      _colors.scss
      _typography.scss
      _spacing.scss
      _z-index.scss
    main.scss
public/
  proposals/
    {proposal-slug}/
      thumb.jpg
      p-001.jpg
      p-002.jpg
      ...
 ```     

## 스타일 규칙(간단)

- inline style 금지
- HEX/px 직접 사용 금지 (토큰만 사용)
- SCSS import 순서: tokens → base → components

---

## A11y 최소 규칙(필수만)
- 모든 이미지에 alt 필수 (JSON에서 가져오기)
- 카드 클릭은 <Link> 사용
- 페이지당 H1 1개
- <main> 사용

---

## SEO 최소 규칙(선택)
- 상세 페이지에서 Metadata API로 title/description만 설정 가능
- OG까지 할 여유 없으면 생략 가능(하지만 가능하면 기본 OG는 넣기)

--- 

## 답변 출력 형식(간단)
1. 해야 할 일 요약
2. 파일 목록
3. 코드
4. proposals.json 예시