'use server'

import { revalidatePath } from 'next/cache'
import { connectToDatabase } from '../db'
import Post from '../db/models/post.model'
import { PostInputSchema, PostUpdateSchema } from '../validator'
import { IPostInput, IPostUpdateInput } from '../type'

// 1. createPost : 게시글 생성하기
// 2. getAllPosts : 모든글 가져오기
// 3. getAllPostsPage : 모든글 가져오기(페이지, 검색)
// 4. deletePost : 게시글 삭제하기
// 5. updatePost : 게시글 수정하기
// 6. incrementViews : 조회수 증가

// 게시글 생성하기
export async function createPost(data: IPostInput) {
  try {
    // 데이터베이스 연결
    await connectToDatabase()

    // 입력 데이터 유효성 검사
    const validatedData = PostInputSchema.parse(data)

    // 슬러그 중복 확인
    const existingPost = await Post.findOne({ slug: validatedData.slug })
    if (existingPost) {
      return {
        success: false,
        error: '이미 사용 중인 슬러그입니다. 다른 슬러그를 사용해주세요.',
      }
    }

    // 새 포스트 생성
    const newPost = await Post.create(validatedData)

    // 캐시 갱신
    revalidatePath('/admin')

    return {
      success: true,
      message: '포스트가 성공적으로 작성되었습니다.',
      post: JSON.parse(JSON.stringify(newPost)),
    }
  } catch (error) {
    console.error('포스트 작성 중 오류 발생:', error)

    return {
      success: false,
      error: '포스트 생성 중 오류가 발생했습니다.',
    }
  }
}

// 모든 글 가져오기(관리자용)
export async function getAllPosts() {
  try {
    // 데이터베이스 연결
    await connectToDatabase()

    // 모든 게시글 조회 (isPublished 필터 없이)
    const posts = await Post.find().sort({ createdAt: -1 }).lean()

    // JSON 직렬화
    const serialized = JSON.parse(JSON.stringify(posts))

    return {
      success: true,
      posts: serialized,
    }
  } catch (error) {
    console.error('포스트 목록 조회 중 오류 발생:', error)

    return {
      success: false,
      error: '포스트 목록을 불러오는 중 오류가 발생했습니다.',
    }
  }
}

// 모든글 가져오기(페이지, 검색)
export async function getAllPostsPage(
  page = 1,
  limit = 10,
  searchQuery?: string
) {
  try {
    await connectToDatabase()

    const skip = (page - 1) * limit

    // 검색 조건 설정
    const searchCondition = searchQuery
      ? {
          $or: [
            { title: { $regex: searchQuery, $options: 'i' } },
            { category: { $regex: searchQuery, $options: 'i' } },
            { storeId: { $regex: searchQuery, $options: 'i' } },
            { tags: { $regex: searchQuery, $options: 'i' } },
          ],
        }
      : {}

    // 총 개수 조회
    const totalCount = await Post.countDocuments(searchCondition)

    // 페이지네이션된 데이터 조회
    const posts = await Post.find(searchCondition)
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
      posts: JSON.parse(JSON.stringify(posts)),
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
    console.error('포스트 조회 오류:', error)
    return {
      success: false,
      error: '포스트 데이터를 불러오는데 실패했습니다.',
    }
  }
}

// 게시글 삭제하기
export async function deletePost(postId: string) {
  try {
    // 데이터베이스 연결
    await connectToDatabase()

    // 포스트 ID 유효성 검사
    if (!postId) {
      return {
        success: false,
        error: '삭제할 포스트 ID가 필요합니다.',
      }
    }

    // 포스트 존재 확인
    const existingPost = await Post.findById(postId)
    if (!existingPost) {
      return {
        success: false,
        error: '삭제하려는 포스트를 찾을 수 없습니다.',
      }
    }

    // 포스트 삭제
    await Post.findByIdAndDelete(postId)

    // 캐시 갱신
    revalidatePath('/admin')

    return {
      success: true,
      message: '포스트가 성공적으로 삭제되었습니다.',
    }
  } catch (error) {
    console.error('포스트 삭제 중 오류 발생:', error)

    return {
      success: false,
      error: '포스트 삭제 중 오류가 발생했습니다.',
    }
  }
}

// 게시글 수정하기
export async function updatePost(data: IPostUpdateInput) {
  try {
    // 데이터베이스 연결
    await connectToDatabase()

    // 입력 데이터 유효성 검사
    const validatedData = PostUpdateSchema.parse(data)
    const { id, ...updateData } = validatedData

    // 포스트 존재 확인
    const existingPost = await Post.findById(id)
    if (!existingPost) {
      return {
        success: false,
        error: '수정하려는 포스트를 찾을 수 없습니다.',
      }
    }

    // 슬러그 중복 확인 (자신 제외)
    if (updateData.slug) {
      const duplicatePost = await Post.findOne({
        slug: updateData.slug,
        _id: { $ne: id },
      })
      if (duplicatePost) {
        return {
          success: false,
          error: '이미 사용 중인 슬러그입니다. 다른 슬러그를 사용해주세요.',
        }
      }
    }

    // 포스트 수정 (updatedAt 자동 설정)
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      {
        ...updateData,
        updatedAt: new Date(),
      },
      { new: true }
    )

    // 캐시 갱신
    revalidatePath('/admin')
    if (updatedPost?.slug) {
      revalidatePath(`/posts/${updatedPost.slug}`)
    }

    return {
      success: true,
      message: '포스트가 성공적으로 수정되었습니다.',
      post: JSON.parse(JSON.stringify(updatedPost)),
    }
  } catch (error) {
    console.error('포스트 수정 중 오류 발생:', error)

    return {
      success: false,
      error: '포스트 수정 중 오류가 발생했습니다.',
    }
  }
}

// 조회수 증가
export async function incrementViews(slug: string) {
  try {
    // 데이터베이스 연결
    await connectToDatabase()

    // 슬러그 유효성 검사
    if (!slug) {
      return {
        success: false,
        error: '슬러그가 필요합니다.',
      }
    }

    // 조회수 증가
    const updatedPost = await Post.findOneAndUpdate(
      { slug, isPublished: true },
      { $inc: { numviews: 1 } },
      { new: true }
    )

    if (!updatedPost) {
      return {
        success: false,
        error: '포스트를 찾을 수 없습니다.',
      }
    }

    return {
      success: true,
      views: updatedPost.numviews,
    }
  } catch (error) {
    console.error('조회수 증가 중 오류 발생:', error)

    return {
      success: false,
      error: '조회수 증가 중 오류가 발생했습니다.',
    }
  }
}
