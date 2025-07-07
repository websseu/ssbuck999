import React from 'react'
import { ArrowLeft, Coffee, Calendar, MapPin } from 'lucide-react'
import Link from 'next/link'

export default function RecordsPage() {
  return (
    <div className='min-h-screen bg-gray-50'>
      {/* 헤더 */}
      <header className='bg-white border-b border-gray-200 px-4 py-4'>
        <div className='flex items-center justify-center'>
          <Link
            href='/'
            className='absolute left-4 text-gray-600 hover:text-green-700'
          >
            <ArrowLeft className='w-5 h-5' />
            <span className='font-nanum sr-only'>뒤로가기</span>
          </Link>
          <h1 className='font-gmarket font-bold text-xl text-green-700'>
            기록 관리
          </h1>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className='max-w-4xl mx-auto p-4'>
        <div className='bg-white rounded border border-gray-200 p-6 mb-6'>
          <div className='flex items-center gap-2 mb-4'>
            <Coffee className='w-5 h-5 text-green-600' />
            <h2 className='font-gmarket font-bold text-xl text-gray-900 pt-1'>
              방문 기록
            </h2>
          </div>

          <div className='space-y-4'>
            {/* 샘플 기록 */}
            <div className='border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow'>
              <div className='flex items-start justify-between'>
                <div className='flex-1'>
                  <h3 className='font-nanum font-semibold text-gray-900 mb-1'>
                    스타벅스 강남점
                  </h3>
                  <div className='flex items-center gap-4 text-sm text-gray-600 mb-2'>
                    <div className='flex items-center gap-1'>
                      <Calendar className='w-4 h-4' />
                      <span>2025.01.15</span>
                    </div>
                    <div className='flex items-center gap-1'>
                      <MapPin className='w-4 h-4' />
                      <span>서울 강남구</span>
                    </div>
                  </div>
                  <p className='text-sm text-gray-700'>
                    아메리카노, 카페라떼 주문. 분위기가 좋고 커피 맛이
                    훌륭했어요!
                  </p>
                </div>
                <div className='text-right'>
                  <span className='inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full'>
                    방문완료
                  </span>
                </div>
              </div>
            </div>

            <div className='border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow'>
              <div className='flex items-start justify-between'>
                <div className='flex-1'>
                  <h3 className='font-nanum font-semibold text-gray-900 mb-1'>
                    스타벅스 홍대점
                  </h3>
                  <div className='flex items-center gap-4 text-sm text-gray-600 mb-2'>
                    <div className='flex items-center gap-1'>
                      <Calendar className='w-4 h-4' />
                      <span>2025.01.10</span>
                    </div>
                    <div className='flex items-center gap-1'>
                      <MapPin className='w-4 h-4' />
                      <span>서울 마포구</span>
                    </div>
                  </div>
                  <p className='text-sm text-gray-700'>
                    시즌 한정 음료 시음. 새로운 메뉴가 정말 맛있었습니다!
                  </p>
                </div>
                <div className='text-right'>
                  <span className='inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full'>
                    리뷰완료
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 통계 섹션 */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-6'>
          <div className='bg-white rounded-lg border border-gray-200 p-4 text-center'>
            <div className='text-2xl font-bold text-green-600 mb-1'>12</div>
            <div className='text-sm text-gray-600 font-nanum'>총 방문 횟수</div>
          </div>
          <div className='bg-white rounded-lg border border-gray-200 p-4 text-center'>
            <div className='text-2xl font-bold text-blue-600 mb-1'>8</div>
            <div className='text-sm text-gray-600 font-nanum'>리뷰 작성</div>
          </div>
          <div className='bg-white rounded-lg border border-gray-200 p-4 text-center'>
            <div className='text-2xl font-bold text-purple-600 mb-1'>5</div>
            <div className='text-sm text-gray-600 font-nanum'>즐겨찾기</div>
          </div>
        </div>

        {/* 액션 버튼 */}
        <div className='text-center'>
          <button className='bg-green-700 text-white px-6 py-3 rounded font-nanum font-semibold hover:bg-green-800 transition-colors'>
            새 기록 추가
          </button>
        </div>
      </main>
    </div>
  )
}
