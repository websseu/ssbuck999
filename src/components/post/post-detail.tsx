'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { toast } from 'sonner'
import { formatDateTime } from '@/lib/utils'
import { createReview, getReviewsByPostId } from '@/lib/actions/review.action'
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
  Star,
  Loader2,
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

interface Review {
  _id: string
  postId: string
  userId: string
  content: string
  rating: number
  isDeleted: boolean
  parentId?: string
  createdAt: string
  updatedAt: string
  replies?: Review[]
}

interface Session {
  user?: {
    id?: string
    name?: string
    email?: string
    image?: string
  }
}

interface PostDetailProps {
  post: Post
  store?: Store | null
  session?: Session | null
}

export default function PostDetail({ post, store, session }: PostDetailProps) {
  const router = useRouter()

  const [reviews, setReviews] = useState<Review[]>([])
  const [reviewContent, setReviewContent] = useState('')
  const [reviewRating, setReviewRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoadingReviews, setIsLoadingReviews] = useState(true)
  const [averageRating, setAverageRating] = useState(0)
  const [totalReviews, setTotalReviews] = useState(0)

  // 리뷰 목록 가져오기
  const fetchReviews = async () => {
    try {
      setIsLoadingReviews(true)
      const result = await getReviewsByPostId(post._id)
      if (result.success && result.reviews) {
        setReviews(result.reviews)
        // totalCount가 없을 경우 reviews 배열 길이 사용
        setTotalReviews(result.totalCount || result.reviews.length)

        // 평균 평점 계산
        if (result.reviews.length > 0) {
          const totalRating = result.reviews.reduce(
            (sum: number, review: Review) => sum + review.rating,
            0
          )
          setAverageRating(
            Math.round((totalRating / result.reviews.length) * 10) / 10
          )
        } else {
          setAverageRating(0)
        }
      }
    } catch (error) {
      console.error('리뷰 로딩 오류:', error)
      toast.error('리뷰를 불러오는 중 오류가 발생했습니다.')
    } finally {
      setIsLoadingReviews(false)
    }
  }

  useEffect(() => {
    fetchReviews()
  }, [post._id])

  // 리뷰 제출
  const handleSubmitReview = async () => {
    if (!session?.user?.id) {
      toast.error('로그인이 필요합니다.')
      return
    }

    if (!reviewContent.trim()) {
      toast.error('리뷰 내용을 입력해주세요.')
      return
    }

    if (reviewRating === 0) {
      toast.error('평점을 선택해주세요.')
      return
    }

    setIsSubmitting(true)
    try {
      const result = await createReview({
        postId: post._id,
        userId: session.user.id,
        content: reviewContent.trim(),
        rating: reviewRating,
      })

      if (result.success) {
        toast.success('리뷰가 성공적으로 작성되었습니다!')
        setReviewContent('')
        setReviewRating(0)
        setHoverRating(0)
        fetchReviews() // 리뷰 목록 새로고침
      } else {
        toast.error(result.error || '리뷰 작성에 실패했습니다.')
      }
    } catch (error) {
      toast.error('리뷰 작성 중 오류가 발생했습니다.')
      console.error('리뷰 작성 오류:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // 별점 렌더링
  const renderStars = (
    rating: number,
    interactive = false,
    size = 'h-5 w-5'
  ) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`${size} cursor-pointer transition-colors ${
          i < (interactive ? hoverRating || reviewRating : rating)
            ? 'fill-yellow-400 text-yellow-400'
            : 'text-gray-300 hover:text-yellow-400'
        }`}
        onClick={interactive ? () => setReviewRating(i + 1) : undefined}
        onMouseEnter={interactive ? () => setHoverRating(i + 1) : undefined}
        onMouseLeave={interactive ? () => setHoverRating(0) : undefined}
      />
    ))
  }

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
      <Card className='mt-8 pb-0'>
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
                      className='aspect-[4/3] overflow-hidden rounded'
                    >
                      <Image
                        src={image || '/placeholder.svg'}
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

          {/* 리뷰 섹션 */}
          <div className='space-y-3 p-6'>
            <div className='flex items-center justify-between'>
              <h3 className='text-lg font-semibold text-gray-800 flex items-center gap-2'>
                리뷰
              </h3>
              {totalReviews > 0 && (
                <div className='flex items-center gap-2'>
                  <div className='flex items-center gap-1'>
                    {renderStars(averageRating, false, 'h-4 w-4')}
                  </div>
                  <span className='text-sm text-muted-foreground'>
                    {averageRating} ({totalReviews}개)
                  </span>
                </div>
              )}
            </div>
            <Separator />

            {/* 리뷰 목록 */}
            {isLoadingReviews ? (
              <div className='flex justify-center items-center py-8'>
                <Loader2 className='h-6 w-6 animate-spin' />
                <span className='ml-2 text-sm text-muted-foreground'>
                  리뷰를 불러오는 중...
                </span>
              </div>
            ) : reviews.length > 0 ? (
              <div className='space-y-4'>
                {reviews.map((review) => (
                  <div
                    key={review._id}
                    className='border rounded-lg p-4 space-y-2'
                  >
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center gap-2'>
                        <Avatar className='h-8 w-8'>
                          <AvatarImage src='/face/default.jpg' />
                          <AvatarFallback>
                            <User className='h-4 w-4' />
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className='text-sm font-medium'>{review.userId}</p>
                          <div className='flex items-center gap-1'>
                            {renderStars(review.rating, false, 'h-3 w-3')}
                          </div>
                        </div>
                      </div>
                      <span className='text-xs text-muted-foreground'>
                        {formatDateTime(review.createdAt)}
                      </span>
                    </div>
                    <p className='text-sm text-gray-700 leading-relaxed'>
                      {review.content}
                    </p>

                    {/* 대댓글 */}
                    {review.replies && review.replies.length > 0 && (
                      <div className='ml-6 mt-3 space-y-2'>
                        {review.replies.map((reply) => (
                          <div
                            key={reply._id}
                            className='bg-gray-50 rounded p-3'
                          >
                            <div className='flex items-center justify-between mb-2'>
                              <div className='flex items-center gap-2'>
                                <Avatar className='h-6 w-6'>
                                  <AvatarImage src='/face/default.jpg' />
                                  <AvatarFallback>
                                    <User className='h-3 w-3' />
                                  </AvatarFallback>
                                </Avatar>
                                <span className='text-xs font-medium'>
                                  {reply.userId}
                                </span>
                              </div>
                              <span className='text-xs text-muted-foreground'>
                                {formatDateTime(reply.createdAt)}
                              </span>
                            </div>
                            <p className='text-xs text-gray-600'>
                              {reply.content}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className='text-sm text-muted-foreground pb-4'>
                아직 리뷰가 없습니다. 첫 번째 리뷰를 작성해보세요!
              </div>
            )}

            {/* 리뷰 작성 */}
            {session?.user ? (
              <div className='space-y-3 border-t pt-4'>
                <h4 className='font-medium text-gray-800'>리뷰 작성</h4>
                <div className='flex gap-3'>
                  <Avatar className='h-8 w-8'>
                    <AvatarImage
                      src={session.user.image || '/face/default.jpg'}
                    />
                    <AvatarFallback>
                      <User className='h-4 w-4' />
                    </AvatarFallback>
                  </Avatar>
                  <div className='flex-1 space-y-3'>
                    {/* 평점 선택 */}
                    <div className='flex items-center gap-2'>
                      <span className='text-sm font-medium'>평점:</span>
                      <div className='flex items-center gap-1'>
                        {renderStars(reviewRating, true)}
                      </div>
                      {reviewRating > 0 && (
                        <span className='text-sm text-muted-foreground'>
                          ({reviewRating}점)
                        </span>
                      )}
                    </div>

                    {/* 리뷰 내용 */}
                    <Textarea
                      placeholder='리뷰를 작성해주세요...'
                      className='min-h-[80px] resize-none'
                      value={reviewContent}
                      onChange={(e) => setReviewContent(e.target.value)}
                      maxLength={1000}
                    />

                    <div className='flex justify-between items-center'>
                      <span className='text-xs text-muted-foreground'>
                        {reviewContent.length}/1000
                      </span>
                      <Button
                        size='sm'
                        className='bg-green-700 hover:bg-green-600'
                        onClick={handleSubmitReview}
                        disabled={
                          isSubmitting ||
                          !reviewContent.trim() ||
                          reviewRating === 0
                        }
                      >
                        {isSubmitting ? (
                          <Loader2 className='h-4 w-4 mr-1 animate-spin' />
                        ) : (
                          <Send className='h-4 w-4 mr-1' />
                        )}
                        리뷰 작성
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className='text-center py-4 border-t'>
                <p className='text-sm text-muted-foreground mb-2'>
                  리뷰를 작성하려면 로그인이 필요합니다.
                </p>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => router.push('/auth/signin')}
                >
                  로그인하기
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  )
}
