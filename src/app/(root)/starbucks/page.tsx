import React from 'react'
import PostList from '@/components/post/post-list'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '스타벅스 매장 정보 | SSBUCK999',
  description:
    '전국 스타벅스 매장 정보와 리뷰를 확인하세요. 매장 위치, 영업시간, 시설 정보 등을 제공합니다.',
  keywords: [
    '스타벅스',
    '매장',
    '카페',
    '위치',
    '영업시간',
    '리뷰',
    'SSBUCK999',
  ],
}

export default function StarbucksPage() {
  return <PostList />
}
