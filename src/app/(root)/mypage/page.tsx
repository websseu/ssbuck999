import React from 'react'
import { ArrowLeft, Flower2, Settings, Heart, Coffee, Star } from 'lucide-react'
import Link from 'next/link'

export default function MyPage() {
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
            <span className='sr-only'>뒤로가기</span>
          </Link>
          <h1 className='font-gmarket font-bold text-xl text-green-700'>
            마이 페이지
          </h1>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className='max-w-4xl mx-auto p-4'>
        {/* 프로필 섹션 */}
        <div className='bg-white rounded border border-gray-200 p-6 mb-6'>
          <div className='text-center mb-6'>
            <div className='w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4'>
              <Flower2 className='w-10 h-10 text-green-600' />
            </div>
            <h2 className='font-gmarket font-bold text-xl text-gray-900 mb-2'>
              커피러버
            </h2>
            <p className='text-gray-600 font-nanum'>
              스타벅스 애호가 • 2025년 1월 가입
            </p>
          </div>

          {/* 통계 */}
          <div className='grid grid-cols-3 gap-4 text-center'>
            <div>
              <div className='text-2xl font-bold text-green-600 mb-1'>12</div>
              <div className='text-sm text-gray-600 font-nanum'>방문</div>
            </div>
            <div>
              <div className='text-2xl font-bold text-blue-600 mb-1'>8</div>
              <div className='text-sm text-gray-600 font-nanum'>리뷰</div>
            </div>
            <div>
              <div className='text-2xl font-bold text-purple-600 mb-1'>5</div>
              <div className='text-sm text-gray-600 font-nanum'>즐겨찾기</div>
            </div>
          </div>
        </div>

        {/* 메뉴 섹션 */}
        <div className='bg-white rounded border border-gray-200 p-6 mb-6'>
          <h3 className='font-gmarket font-bold text-lg text-gray-900 mb-4'>
            내 활동
          </h3>

          <div className='space-y-3'>
            <Link
              href='/records'
              className='flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors'
            >
              <div className='flex items-center gap-3'>
                <Coffee className='w-5 h-5 text-green-600' />
                <span className='font-nanum text-gray-900'>방문 기록</span>
              </div>
              <ArrowLeft className='w-4 h-4 text-gray-400 rotate-180' />
            </Link>

            <Link
              href='/favorites'
              className='flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors'
            >
              <div className='flex items-center gap-3'>
                <Heart className='w-5 h-5 text-red-500' />
                <span className='font-nanum text-gray-900'>즐겨찾기</span>
              </div>
              <ArrowLeft className='w-4 h-4 text-gray-400 rotate-180' />
            </Link>

            <Link
              href='/reviews'
              className='flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors'
            >
              <div className='flex items-center gap-3'>
                <Star className='w-5 h-5 text-yellow-500' />
                <span className='font-nanum text-gray-900'>내 리뷰</span>
              </div>
              <ArrowLeft className='w-4 h-4 text-gray-400 rotate-180' />
            </Link>

            <Link
              href='/settings'
              className='flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors'
            >
              <div className='flex items-center gap-3'>
                <Settings className='w-5 h-5 text-gray-600' />
                <span className='font-nanum text-gray-900'>설정</span>
              </div>
              <ArrowLeft className='w-4 h-4 text-gray-400 rotate-180' />
            </Link>
          </div>
        </div>

        {/* 최근 활동 */}
        <div className='bg-white rounded border border-gray-200 p-6 mb-6'>
          <h3 className='font-gmarket font-bold text-lg text-gray-900 mb-4'>
            최근 활동
          </h3>

          <div className='space-y-4'>
            <div className='flex items-start gap-3 p-3 rounded-lg bg-gray-50'>
              <div className='w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0'>
                <Coffee className='w-4 h-4 text-green-600' />
              </div>
              <div className='flex-1'>
                <p className='font-nanum text-sm text-gray-900 mb-1'>
                  스타벅스 강남점 방문 기록을 추가했습니다
                </p>
                <p className='text-xs text-gray-500'>2시간 전</p>
              </div>
            </div>

            <div className='flex items-start gap-3 p-3 rounded-lg bg-gray-50'>
              <div className='w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0'>
                <Star className='w-4 h-4 text-blue-600' />
              </div>
              <div className='flex-1'>
                <p className='font-nanum text-sm text-gray-900 mb-1'>
                  스타벅스 홍대점에 5점 리뷰를 작성했습니다
                </p>
                <p className='text-xs text-gray-500'>1일 전</p>
              </div>
            </div>

            <div className='flex items-start gap-3 p-3 rounded-lg bg-gray-50'>
              <div className='w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0'>
                <Heart className='w-4 h-4 text-red-600' />
              </div>
              <div className='flex-1'>
                <p className='font-nanum text-sm text-gray-900 mb-1'>
                  스타벅스 이태원점을 즐겨찾기에 추가했습니다
                </p>
                <p className='text-xs text-gray-500'>3일 전</p>
              </div>
            </div>
          </div>
        </div>

        {/* 로그아웃 버튼 */}
        <div className='text-center'>
          <button className='bg-red-600 text-white px-6 py-3 rounded-lg font-nanum font-semibold hover:bg-red-700 transition-colors'>
            로그아웃
          </button>
        </div>
      </main>
    </div>
  )
}
