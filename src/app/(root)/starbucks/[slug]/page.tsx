import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPostBySlug, incrementViews } from '@/lib/actions/post.action'
import PostDetail from '@/components/post/post-detail'

type StarbucksDetailProps = {
  params: Promise<{
    slug: string
  }>
}

// 동적 메타데이터 생성
export async function generateMetadata(
  props: StarbucksDetailProps
): Promise<Metadata> {
  const params = await props.params
  const { slug } = params
  const result = await getPostBySlug(slug)

  if (!result.success) {
    return {
      title: '게시글을 찾을 수 없습니다 | SSBUCK999',
    }
  }

  const post = result.post

  return {
    title: `${post.title} | 스타벅스`,
    description: post.description || '스타벅스 매장 정보와 리뷰를 확인하세요.',
    keywords: [
      '스타벅스',
      '스타벅스 후기',
      '스타벅스 리뷰',
      'SSBUCK999',
      `${post.title} 스타벅스`,
    ],
  }
}

export default async function StarbucksDetailPage(props: StarbucksDetailProps) {
  const params = await props.params
  const { slug } = params
  const result = await getPostBySlug(slug)

  if (!result.success) {
    notFound()
  }

  const { post, store } = result

  // 조회수 증가 (비동기로 실행, 결과를 기다리지 않음)
  incrementViews(slug)

  return <PostDetail post={post} store={store} />
}
