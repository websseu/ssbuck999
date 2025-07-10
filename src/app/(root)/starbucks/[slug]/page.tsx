import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPostBySlug, incrementViews } from '@/lib/actions/post.action'
import PostDetail from '@/components/post/post-detail'

interface Props {
  params: {
    slug: string
  }
}

// 동적 메타데이터 생성
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const result = await getPostBySlug(params.slug)

  if (!result.success) {
    return {
      title: '게시글을 찾을 수 없습니다 | SSBUCK999',
    }
  }

  const post = result.post

  return {
    title: `${post.title} | SSBUCK999`,
    description: post.description || '스타벅스 매장 정보와 리뷰를 확인하세요.',
    keywords: ['스타벅스', '매장', '카페', '리뷰', 'SSBUCK999', post.category],
  }
}

export default async function StarbucksDetailPage({ params }: Props) {
  const result = await getPostBySlug(params.slug)

  if (!result.success) {
    notFound()
  }

  const post = result.post
  const store = result.store

  // 조회수 증가 (비동기로 실행, 결과를 기다리지 않음)
  incrementViews(params.slug)

  return <PostDetail post={post} store={store} />
}
