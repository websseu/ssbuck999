'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  ArrowLeft,
  Heart,
  Share2,
  Bookmark,
  Dessert,
  BellElectric,
  Caravan,
  Fence,
  Send,
  User,
  Ambulance,
  Pizza,
  Armchair,
  HeartHandshake,
} from 'lucide-react'

interface Post {
  _id: string
  title: string
  slug: string
  category?: string
  description?: string
  isPublished: boolean
  storeId?: string
  numViews: number
  numLikes: number
  createdAt: string
  updatedAt: string
}

interface Store {
  _id: string
  storeId: string
  name: string
  address: string
  location: string
  parking: string
  directions: string
  since: string
  phone: string
  tags: string[]
  services: string[]
  facilities: string[]
  images: string[]
  createdAt: string
  updatedAt: string
}

interface PostDetailProps {
  post: Post
  store?: Store | null
}

export default function PostDetail({ post, store }: PostDetailProps) {
  const router = useRouter()

  return (
    <>
      {/* 헤더 */}
      <div className='border-b sticky top-0 z-10 bg-white/80 backdrop-blur-md'>
        <div className='flex items-center justify-between py-4'>
          <Button
            variant='ghost'
            size='icon'
            className='bg-gray-100 hover:bg-gray-200'
            onClick={() => router.back()}
          >
            <ArrowLeft className='h-5 w-5' />
          </Button>
          <h1 className='text-lg font-nanum font-bold truncate mx-4 ml-20'>
            {post.title}
          </h1>
          <div className='flex gap-1'>
            <Button variant='ghost' size='icon' className='bg-gray-100'>
              <Share2 className='h-5 w-5' />
            </Button>

            <Button variant='ghost' size='icon' className='bg-gray-100'>
              <Heart className='h-5 w-5 transition-all duration-200' />
            </Button>

            <Button variant='ghost' size='icon' className='bg-gray-100'>
              <Bookmark className='h-5 w-5 transition-all duration-200' />
            </Button>
          </div>
        </div>
      </div>

      {/* 게시글 상세 정보 */}
      <Card className='mt-8'>
        <CardHeader>
          {/* 제목 */}
          <h1 className='text-xl font-bold text-green-800 leading-tight'>
            {post.title}
          </h1>
          <p className='text-sm text-muted-foreground'>{post.description}</p>
        </CardHeader>

        <Separator />

        <CardContent className='p-0'>
          {/* 스토어 이미지 */}
          {store && store.images && store.images.length > 0 && (
            <div className='border-b pb-6'>
              <div className='p-6 py-0'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                  {store.images.map((image, index) => (
                    <div
                      key={index}
                      className='aspect-[4/3]  overflow-hidden rounded'
                    >
                      <Image
                        src={image}
                        width={600}
                        height={400}
                        alt={`${store.name} 이미지 ${index + 1}`}
                        className='w-full h-full object-cover hover:scale-105 transition-transform duration-300'
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 스토어 정보 */}
          {store && (
            <div className='border-b pb-2'>
              <div className='p-6 space-y-4'>
                <h3 className='text-lg font-semibold text-gray-800 flex items-center gap-2'>
                  매장 정보
                </h3>

                <div className='space-y-2 text-sm'>
                  {/* 매장명 */}
                  <div className='flex items-start gap-2'>
                    <Ambulance className='h-4 w-4 text-green-600 mt-0.5 flex-shrink-0' />
                    <div className='min-w-0 flex-1'>
                      <span className='font-medium text-gray-700'>매장명:</span>
                      <span className='ml-2 text-gray-900 break-words'>
                        {store.name}
                      </span>
                    </div>
                  </div>

                  <Separator />

                  {/* 주소 */}
                  <div className='flex items-start gap-2'>
                    <Dessert className='h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0' />
                    <div className='min-w-0 flex-1'>
                      <span className='font-medium text-gray-700'>주소:</span>
                      <span className='ml-2 text-gray-900 break-words'>
                        {store.address}
                      </span>
                    </div>
                  </div>

                  <Separator />

                  {/* 오시는길 */}
                  <div className='flex items-start gap-2'>
                    <HeartHandshake className='h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0' />
                    <div className='min-w-0 flex-1'>
                      <span className='font-medium text-gray-700'>
                        오시는길:
                      </span>
                      <span className='ml-2 text-gray-900 break-words'>
                        {store.directions}
                      </span>
                    </div>
                  </div>

                  <Separator />

                  {/* 전화 */}
                  <div className='flex items-start gap-2'>
                    <BellElectric className='h-4 w-4 text-red-600 mt-0.5 flex-shrink-0' />
                    <div className='min-w-0 flex-1'>
                      <span className='font-medium text-gray-700'>전화:</span>
                      <span className='ml-2 text-gray-900'>{store.phone}</span>
                    </div>
                  </div>

                  <Separator />

                  {/* 주차 */}
                  <div className='flex items-start gap-2'>
                    <Caravan className='h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0' />
                    <div className='min-w-0 flex-1'>
                      <span className='font-medium text-gray-700'>주차:</span>
                      <span className='ml-2 text-gray-900 leading-6'>
                        {store.parking}
                      </span>
                    </div>
                  </div>

                  <Separator />

                  {/* 태그 */}
                  {store.tags && store.tags.length > 0 && (
                    <>
                      <div className='flex items-center gap-2'>
                        <Fence className='h-4 w-4 text-green-600 flex-shrink-0' />
                        <div className='min-w-0 flex-1 flex items-center'>
                          <span className='font-medium text-gray-700'>
                            태그:
                          </span>
                          <div className='ml-2 flex flex-wrap gap-1'>
                            {store.tags.map((tag, index) => (
                              <Badge
                                key={index}
                                variant='secondary'
                                className='bg-green-50 text-green-700 hover:bg-green-100'
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <Separator />
                    </>
                  )}

                  {/* 서비스 */}
                  {store.services && store.services.length > 0 && (
                    <>
                      <div className='flex items-center gap-2'>
                        <Pizza className='h-4 w-4 text-blue-600 flex-shrink-0' />
                        <div className='min-w-0 flex-1 flex items-center'>
                          <span className='font-medium text-gray-700'>
                            서비스:
                          </span>
                          <div className='ml-2 flex flex-wrap gap-1'>
                            {store.services.map((service, index) => (
                              <Badge
                                key={index}
                                variant='secondary'
                                className='bg-blue-50 text-blue-700 hover:bg-blue-100'
                              >
                                {service}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <Separator />
                    </>
                  )}

                  {/* 시설 */}
                  {store.facilities && store.facilities.length > 0 && (
                    <div className='flex items-center gap-2'>
                      <Armchair className='h-4 w-4 text-purple-600 flex-shrink-0' />
                      <div className='min-w-0 flex-1 flex items-center'>
                        <span className='font-medium text-gray-700'>시설:</span>
                        <div className='ml-2 flex flex-wrap gap-1'>
                          {store.facilities.map((facility, index) => (
                            <Badge
                              key={index}
                              variant='secondary'
                              className='bg-purple-50 text-purple-700 hover:bg-purple-100'
                            >
                              {facility}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 댓글 섹션 */}
          <div className='space-y-3 p-6'>
            <h3 className='text-lg font-semibold text-gray-800 flex items-center gap-2'>
              리뷰
            </h3>

            <Separator />

            {/* 댓글 목록 */}
            <div className='text-sm text-muted-foreground pb-4'>
              아직 리뷰가 없습니다. 첫 번째 리뷰를 작성해보세요!
            </div>

            {/* 댓글 작성 */}
            <div className='space-y-3'>
              <div className='flex gap-3'>
                <Avatar className='h-8 w-8'>
                  <AvatarImage src='/face/default.jpg' />
                  <AvatarFallback>
                    <User className='h-4 w-4' />
                  </AvatarFallback>
                </Avatar>
                <div className='flex-1 space-y-2'>
                  <Textarea
                    placeholder='댓글을 작성해주세요...'
                    className='min-h-[80px] resize-none'
                  />
                  <div className='flex justify-end'>
                    <Button
                      size='sm'
                      className='bg-green-700 hover:bg-green-600'
                    >
                      <Send className='h-4 w-4 mr-1' />
                      댓글 작성
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
