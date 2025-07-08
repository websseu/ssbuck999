'use server'

import { revalidatePath } from 'next/cache'
import { connectToDatabase } from '../db'
import Store from '../db/models/store.model'
import { StoreInputSchema, StoreUpdateSchema } from '../validator'
import { IStoreInput, IStoreUpdateInput } from '../type'

// 1. createStore : 스토어 생성하기
// 2. getAllStores : 모든 스토어 가져오기
// 3. getAllStoresPage : 모든 스토어 가져오기(페이지, 검색)
// 4. getPublishedStoresPage : 게시된 스토어만 가져오기(페이지, 검색)
// 5. getStoreBySlug : 슬러그로 스토어 가져오기
// 6. deleteStore : 스토어 삭제하기
// 7. updateStore : 스토어 수정하기
// 8. incrementStoreViews : 조회수 증가

// 스토어 생성하기
export async function createStore(data: IStoreInput) {
  try {
    // 데이터베이스 연결
    await connectToDatabase()

    // 입력 데이터 유효성 검사
    const validatedData = StoreInputSchema.parse(data)

    // 스토어 ID 중복 확인
    const existingStore = await Store.findOne({
      storeId: validatedData.storeId,
    })
    if (existingStore) {
      return {
        success: false,
        error: '이미 사용 중인 스토어 ID입니다. 다른 ID를 사용해주세요.',
      }
    }

    // 새 스토어 생성
    const newStore = await Store.create(validatedData)

    // 캐시 갱신
    revalidatePath('/admin')

    return {
      success: true,
      message: '스토어가 성공적으로 생성되었습니다.',
      store: JSON.parse(JSON.stringify(newStore)),
    }
  } catch (error) {
    console.error('스토어 생성 중 오류 발생:', error)

    return {
      success: false,
      error: '스토어 생성 중 오류가 발생했습니다.',
    }
  }
}

// 모든 스토어 가져오기(관리자용)
export async function getAllStores() {
  try {
    // 데이터베이스 연결
    await connectToDatabase()

    // 모든 스토어 조회 (isPublished 필터 없이)
    const stores = await Store.find().sort({ createdAt: -1 }).lean()

    // JSON 직렬화
    const serialized = JSON.parse(JSON.stringify(stores))

    return {
      success: true,
      stores: serialized,
    }
  } catch (error) {
    console.error('스토어 목록 조회 중 오류 발생:', error)

    return {
      success: false,
      error: '스토어 목록을 불러오는 중 오류가 발생했습니다.',
    }
  }
}

// 모든 스토어 가져오기(페이지, 검색)
export async function getAllStoresPage(
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
            { name: { $regex: searchQuery, $options: 'i' } },
            { address: { $regex: searchQuery, $options: 'i' } },
            { location: { $regex: searchQuery, $options: 'i' } },
            { storeId: { $regex: searchQuery, $options: 'i' } },
            { tags: { $regex: searchQuery, $options: 'i' } },
          ],
        }
      : {}

    // 총 개수 조회
    const totalCount = await Store.countDocuments(searchCondition)

    // 페이지네이션된 데이터 조회
    const stores = await Store.find(searchCondition)
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
      stores: JSON.parse(JSON.stringify(stores)),
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
    console.error('스토어 조회 오류:', error)
    return {
      success: false,
      error: '스토어 데이터를 불러오는데 실패했습니다.',
    }
  }
}

// 게시된 스토어만 가져오기(페이지, 검색)
export async function getPublishedStoresPage(
  page = 1,
  limit = 10,
  searchQuery?: string
) {
  try {
    await connectToDatabase()

    const skip = (page - 1) * limit

    // 검색 조건 설정 (게시된 스토어만)
    const searchCondition = {
      isPublished: true,
      ...(searchQuery
        ? {
            $or: [
              { name: { $regex: searchQuery, $options: 'i' } },
              { address: { $regex: searchQuery, $options: 'i' } },
              { location: { $regex: searchQuery, $options: 'i' } },
              { storeId: { $regex: searchQuery, $options: 'i' } },
              { tags: { $regex: searchQuery, $options: 'i' } },
            ],
          }
        : {}),
    }

    // 총 개수 조회
    const totalCount = await Store.countDocuments(searchCondition)

    // 페이지네이션된 데이터 조회
    const stores = await Store.find(searchCondition)
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
      stores: JSON.parse(JSON.stringify(stores)),
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
    console.error('스토어 조회 오류:', error)
    return {
      success: false,
      error: '스토어 데이터를 불러오는데 실패했습니다.',
    }
  }
}

// 스토어 ID로 스토어 가져오기
export async function getStoreById(storeId: string) {
  try {
    await connectToDatabase()

    const store = await Store.findOne({ storeId }).lean()

    if (!store) {
      return {
        success: false,
        error: '스토어를 찾을 수 없습니다.',
      }
    }

    return {
      success: true,
      store: JSON.parse(JSON.stringify(store)),
    }
  } catch (error) {
    console.error('스토어 조회 오류:', error)
    return {
      success: false,
      error: '스토어 데이터를 불러오는데 실패했습니다.',
    }
  }
}

// 스토어 삭제하기
export async function deleteStore(storeId: string) {
  try {
    // 데이터베이스 연결
    await connectToDatabase()

    // 스토어 ID 유효성 검사
    if (!storeId) {
      return {
        success: false,
        error: '삭제할 스토어 ID가 필요합니다.',
      }
    }

    // 스토어 존재 확인
    const existingStore = await Store.findOne({ storeId })
    if (!existingStore) {
      return {
        success: false,
        error: '삭제하려는 스토어를 찾을 수 없습니다.',
      }
    }

    // 스토어 삭제
    await Store.findOneAndDelete({ storeId })

    // 캐시 갱신
    revalidatePath('/admin/stores')

    return {
      success: true,
      message: '스토어가 성공적으로 삭제되었습니다.',
    }
  } catch (error) {
    console.error('스토어 삭제 중 오류 발생:', error)

    return {
      success: false,
      error: '스토어 삭제 중 오류가 발생했습니다.',
    }
  }
}

// 스토어 수정하기
export async function updateStore(data: IStoreUpdateInput) {
  try {
    // 데이터베이스 연결
    await connectToDatabase()

    // 입력 데이터 유효성 검사
    const validatedData = StoreUpdateSchema.parse(data)
    const { id, ...updateData } = validatedData

    // 스토어 존재 확인
    const existingStore = await Store.findById(id)
    if (!existingStore) {
      return {
        success: false,
        error: '수정하려는 스토어를 찾을 수 없습니다.',
      }
    }

    // 스토어 ID 중복 확인 (자신 제외)
    if (updateData.storeId) {
      const duplicateStore = await Store.findOne({
        storeId: updateData.storeId,
        _id: { $ne: id },
      })
      if (duplicateStore) {
        return {
          success: false,
          error: '이미 사용 중인 스토어 ID입니다. 다른 ID를 사용해주세요.',
        }
      }
    }

    // 스토어 수정 (updatedAt 자동 설정)
    const updatedStore = await Store.findByIdAndUpdate(
      id,
      {
        ...updateData,
        updatedAt: new Date(),
      },
      { new: true }
    )

    // 캐시 갱신
    revalidatePath('/admin/stores')

    return {
      success: true,
      message: '스토어가 성공적으로 수정되었습니다.',
      store: JSON.parse(JSON.stringify(updatedStore)),
    }
  } catch (error) {
    console.error('스토어 수정 중 오류 발생:', error)

    return {
      success: false,
      error: '스토어 수정 중 오류가 발생했습니다.',
    }
  }
}

// 조회수 증가
export async function incrementStoreViews(storeId: string) {
  try {
    // 데이터베이스 연결
    await connectToDatabase()

    // 스토어 ID 유효성 검사
    if (!storeId) {
      return {
        success: false,
        error: '스토어 ID가 필요합니다.',
      }
    }

    // 조회수 증가
    const updatedStore = await Store.findOneAndUpdate(
      { storeId, isPublished: true },
      { $inc: { numViews: 1 } },
      { new: true }
    )

    if (!updatedStore) {
      return {
        success: false,
        error: '스토어를 찾을 수 없습니다.',
      }
    }

    return {
      success: true,
      views: updatedStore.numViews,
    }
  } catch (error) {
    console.error('조회수 증가 중 오류 발생:', error)

    return {
      success: false,
      error: '조회수 증가 중 오류가 발생했습니다.',
    }
  }
}
