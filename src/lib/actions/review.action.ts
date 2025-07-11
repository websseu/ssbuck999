'use server'

import { revalidatePath } from 'next/cache'
import { connectToDatabase } from '../db'
import Review from '../db/models/review.model'
import { ReviewInputSchema, ReviewUpdateSchema } from '../validator'
import type { IReviewInput, IReviewUpdateInput } from '../type'

// 1. createReview : 리뷰 생성하기
// 2. getAllReviews : 모든 리뷰 가져오기
// 3. getAllReviewsPage : 모든 리뷰 가져오기(페이지, 검색)
// 4. getReviewsByPostId : 특정 게시글의 리뷰들 가져오기
// 5. updateReview : 리뷰 수정하기
// 6. deleteReview : 리뷰 삭제하기 (soft delete)
// 7. toggleReviewStatus : 리뷰 활성화/비활성화 토글
// 8. getReviewStats : 리뷰 통계 가져오기

// 리뷰 생성하기
export async function createReview(data: IReviewInput) {
  try {
    // 데이터베이스 연결
    await connectToDatabase()

    // 입력 데이터 유효성 검사
    const validatedData = ReviewInputSchema.parse(data)

    // 동일한 사용자가 같은 게시글에 이미 리뷰를 작성했는지 확인
    const existingReview = await Review.findOne({
      postId: validatedData.postId,
      userId: validatedData.userId,
      isDeleted: false,
      parentId: { $exists: false }, // 대댓글이 아닌 원본 리뷰만 체크
    })

    if (existingReview) {
      return {
        success: false,
        error: '이미 이 게시글에 리뷰를 작성하셨습니다.',
      }
    }

    // 새 리뷰 생성
    const newReview = await Review.create(validatedData)

    // 캐시 갱신
    revalidatePath('/admin')
    revalidatePath(`/posts/${validatedData.postId}`)

    return {
      success: true,
      message: '리뷰가 성공적으로 작성되었습니다.',
      review: JSON.parse(JSON.stringify(newReview)),
    }
  } catch (error) {
    console.error('리뷰 작성 중 오류 발생:', error)
    return {
      success: false,
      error: '리뷰 생성 중 오류가 발생했습니다.',
    }
  }
}

// 모든 리뷰 가져오기(관리자용)
export async function getAllReviews() {
  try {
    // 데이터베이스 연결
    await connectToDatabase()

    // 모든 리뷰 조회 (삭제된 것도 포함)
    const reviews = await Review.find().sort({ createdAt: -1 }).lean()

    // JSON 직렬화
    const serialized = JSON.parse(JSON.stringify(reviews))

    return {
      success: true,
      reviews: serialized,
    }
  } catch (error) {
    console.error('리뷰 목록 조회 중 오류 발생:', error)
    return {
      success: false,
      error: '리뷰 목록을 불러오는 중 오류가 발생했습니다.',
    }
  }
}

// 모든 리뷰 가져오기(페이지, 검색)
export async function getAllReviewsPage(
  page = 1,
  limit = 10,
  searchQuery?: string,
  postIdFilter?: string,
  userIdFilter?: string,
  ratingFilter?: number
) {
  try {
    await connectToDatabase()
    const skip = (page - 1) * limit

    // 검색 및 필터 조건 설정
    const searchConditions: Record<string, unknown>[] = []

    // 텍스트 검색 조건
    if (searchQuery) {
      searchConditions.push({
        content: { $regex: searchQuery, $options: 'i' },
      })
    }

    // 게시글 ID 필터
    if (postIdFilter) {
      searchConditions.push({
        postId: postIdFilter,
      })
    }

    // 사용자 ID 필터
    if (userIdFilter) {
      searchConditions.push({
        userId: userIdFilter,
      })
    }

    // 평점 필터
    if (ratingFilter) {
      searchConditions.push({
        rating: ratingFilter,
      })
    }

    // 최종 검색 조건
    const finalSearchCondition =
      searchConditions.length > 0 ? { $and: searchConditions } : {}

    // 총 개수 조회
    const totalCount = await Review.countDocuments(finalSearchCondition)

    // 페이지네이션된 데이터 조회
    const reviews = await Review.find(finalSearchCondition)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()

    // 페이지네이션 정보 계산
    const totalPages = Math.ceil(totalCount / limit)
    const hasNextPage = page < totalPages
    const hasPrevPage = page > 1

    return {
      success: true,
      reviews: JSON.parse(JSON.stringify(reviews)),
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        limit,
        hasNextPage,
        hasPrevPage,
      },
    }
  } catch (error) {
    console.error('리뷰 조회 오류:', error)
    return {
      success: false,
      error: '리뷰 데이터를 불러오는데 실패했습니다.',
    }
  }
}

// 특정 게시글의 리뷰들 가져오기
export async function getReviewsByPostId(
  postId: string,
  includeDeleted = false
) {
  try {
    // 데이터베이스 연결
    await connectToDatabase()

    // 게시글 ID 유효성 검사
    if (!postId) {
      return {
        success: false,
        error: '게시글 ID가 필요합니다.',
      }
    }

    // 검색 조건 설정
    const searchCondition: Record<string, unknown> = { postId }
    if (!includeDeleted) {
      searchCondition.isDeleted = false
    }

    // 리뷰 조회 (대댓글 포함, 계층 구조로 정렬)
    const reviews = await Review.find(searchCondition)
      .sort({ createdAt: -1 })
      .lean()

    // 리뷰를 계층 구조로 정리 (부모 댓글과 대댓글 분리)
    const parentReviews = reviews.filter((review) => !review.parentId)
    const childReviews = reviews.filter((review) => review.parentId)

    // 부모 댓글에 대댓글 연결
    const reviewsWithReplies = parentReviews.map((parent) => ({
      ...parent,
      replies: childReviews.filter(
        (child) => child.parentId === (parent._id as string)
      ),
    }))

    return {
      success: true,
      reviews: JSON.parse(JSON.stringify(reviewsWithReplies)),
      totalCount: parentReviews.length,
      totalReplies: childReviews.length,
    }
  } catch (error) {
    console.error('게시글 리뷰 조회 중 오류 발생:', error)
    return {
      success: false,
      error: '리뷰를 불러오는 중 오류가 발생했습니다.',
    }
  }
}

// 리뷰 수정하기
export async function updateReview(data: IReviewUpdateInput) {
  try {
    // 데이터베이스 연결
    await connectToDatabase()

    // 입력 데이터 유효성 검사
    const validatedData = ReviewUpdateSchema.parse(data)
    const { id, ...updateData } = validatedData

    // 리뷰 존재 확인
    const existingReview = await Review.findById(id)
    if (!existingReview) {
      return {
        success: false,
        error: '수정하려는 리뷰를 찾을 수 없습니다.',
      }
    }

    // 삭제된 리뷰는 수정 불가
    if (existingReview.isDeleted) {
      return {
        success: false,
        error: '삭제된 리뷰는 수정할 수 없습니다.',
      }
    }

    // 리뷰 수정 (updatedAt 자동 설정)
    const updatedReview = await Review.findByIdAndUpdate(
      id,
      {
        ...updateData,
        updatedAt: new Date(),
      },
      { new: true }
    )

    // 캐시 갱신
    revalidatePath('/admin')
    if (updatedReview?.postId) {
      revalidatePath(`/posts/${updatedReview.postId}`)
    }

    return {
      success: true,
      message: '리뷰가 성공적으로 수정되었습니다.',
      review: JSON.parse(JSON.stringify(updatedReview)),
    }
  } catch (error) {
    console.error('리뷰 수정 중 오류 발생:', error)
    return {
      success: false,
      error: '리뷰 수정 중 오류가 발생했습니다.',
    }
  }
}

// 리뷰 삭제하기 (soft delete)
export async function deleteReview(reviewId: string) {
  try {
    // 데이터베이스 연결
    await connectToDatabase()

    // 리뷰 ID 유효성 검사
    if (!reviewId) {
      return {
        success: false,
        error: '삭제할 리뷰 ID가 필요합니다.',
      }
    }

    // 리뷰 존재 확인
    const existingReview = await Review.findById(reviewId)
    if (!existingReview) {
      return {
        success: false,
        error: '삭제하려는 리뷰를 찾을 수 없습니다.',
      }
    }

    // Soft delete (isDeleted를 true로 설정)
    const deletedReview = await Review.findByIdAndUpdate(
      reviewId,
      {
        isDeleted: true,
        updatedAt: new Date(),
      },
      { new: true }
    )

    // 해당 리뷰의 대댓글들도 함께 삭제
    await Review.updateMany(
      { parentId: reviewId },
      {
        isDeleted: true,
        updatedAt: new Date(),
      }
    )

    // 캐시 갱신
    revalidatePath('/admin')
    if (deletedReview?.postId) {
      revalidatePath(`/posts/${deletedReview.postId}`)
    }

    return {
      success: true,
      message: '리뷰가 성공적으로 삭제되었습니다.',
    }
  } catch (error) {
    console.error('리뷰 삭제 중 오류 발생:', error)
    return {
      success: false,
      error: '리뷰 삭제 중 오류가 발생했습니다.',
    }
  }
}

// 리뷰 활성화/비활성화 토글
export async function toggleReviewStatus(reviewId: string) {
  try {
    // 데이터베이스 연결
    await connectToDatabase()

    // 리뷰 ID 유효성 검사
    if (!reviewId) {
      return {
        success: false,
        error: '리뷰 ID가 필요합니다.',
      }
    }

    // 리뷰 존재 확인
    const existingReview = await Review.findById(reviewId)
    if (!existingReview) {
      return {
        success: false,
        error: '리뷰를 찾을 수 없습니다.',
      }
    }

    // 삭제 상태 토글
    const updatedReview = await Review.findByIdAndUpdate(
      reviewId,
      {
        isDeleted: !existingReview.isDeleted,
        updatedAt: new Date(),
      },
      { new: true }
    )

    // 캐시 갱신
    revalidatePath('/admin')
    if (updatedReview?.postId) {
      revalidatePath(`/posts/${updatedReview.postId}`)
    }

    return {
      success: true,
      message: `리뷰가 ${
        updatedReview?.isDeleted ? '비활성화' : '활성화'
      }되었습니다.`,
      isDeleted: updatedReview?.isDeleted,
    }
  } catch (error) {
    console.error('리뷰 상태 변경 중 오류 발생:', error)
    return {
      success: false,
      error: '리뷰 상태 변경 중 오류가 발생했습니다.',
    }
  }
}

// 리뷰 통계 가져오기
export async function getReviewStats(postId?: string) {
  try {
    // 데이터베이스 연결
    await connectToDatabase()

    // 검색 조건 설정
    const matchCondition: Record<string, unknown> = { isDeleted: false }
    if (postId) {
      matchCondition.postId = postId
    }

    // 통계 집계
    const stats = await Review.aggregate([
      { $match: matchCondition },
      {
        $group: {
          _id: null,
          totalReviews: { $sum: 1 },
          averageRating: { $avg: '$rating' },
          ratingDistribution: {
            $push: '$rating',
          },
        },
      },
    ])

    if (stats.length === 0) {
      return {
        success: true,
        stats: {
          totalReviews: 0,
          averageRating: 0,
          ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
        },
      }
    }

    // 평점 분포 계산
    const ratingCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    stats[0].ratingDistribution.forEach((rating: number) => {
      ratingCounts[rating as keyof typeof ratingCounts]++
    })

    return {
      success: true,
      stats: {
        totalReviews: stats[0].totalReviews,
        averageRating: Math.round(stats[0].averageRating * 10) / 10, // 소수점 1자리
        ratingDistribution: ratingCounts,
      },
    }
  } catch (error) {
    console.error('리뷰 통계 조회 중 오류 발생:', error)
    return {
      success: false,
      error: '리뷰 통계를 불러오는 중 오류가 발생했습니다.',
    }
  }
}

// 하드 삭제 (관리자 전용)
export async function hardDeleteReview(reviewId: string) {
  try {
    // 데이터베이스 연결
    await connectToDatabase()

    // 리뷰 ID 유효성 검사
    if (!reviewId) {
      return {
        success: false,
        error: '삭제할 리뷰 ID가 필요합니다.',
      }
    }

    // 리뷰 존재 확인
    const existingReview = await Review.findById(reviewId)
    if (!existingReview) {
      return {
        success: false,
        error: '삭제하려는 리뷰를 찾을 수 없습니다.',
      }
    }

    // 대댓글들도 함께 하드 삭제
    await Review.deleteMany({ parentId: reviewId })

    // 리뷰 하드 삭제
    await Review.findByIdAndDelete(reviewId)

    // 캐시 갱신
    revalidatePath('/admin')

    return {
      success: true,
      message: '리뷰가 완전히 삭제되었습니다.',
    }
  } catch (error) {
    console.error('리뷰 하드 삭제 중 오류 발생:', error)
    return {
      success: false,
      error: '리뷰 삭제 중 오류가 발생했습니다.',
    }
  }
}
