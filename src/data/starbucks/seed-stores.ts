import { cwd } from 'process'
import { loadEnvConfig } from '@next/env'
import { connectToDatabase } from '@/lib/db'

import Store from '@/lib/db/models/store.model'
import { busanStoresData } from './data-busan-stores'
import { chungbukStoresData } from './data-chungbuk-stores'
import { daeguStoresData } from './data-daegu-stores'
import { daejeonStoresData } from './data-daejeon-stores'
import { gwangjuStoresData } from './data-gwangju-stores'
import { incheonStoresData } from './data-incheon-stores'
import { jejuStoresData } from './data-jeju-stores'
import { jeolbukStoresData } from './data-jeolbuk-stores'
import { jeolnamStoresData } from './data-jeolnam-stores'

loadEnvConfig(cwd())

const main = async () => {
  try {
    await connectToDatabase(process.env.MONGODB_URI)

    // 기존 데이터 전체 삭제 (한 번만)
    await Store.deleteMany()

    // 모든 데이터 합치기
    const allStores = [
      ...busanStoresData,
      ...chungbukStoresData,
      ...daeguStoresData,
      ...daejeonStoresData,
      ...gwangjuStoresData,
      ...incheonStoresData,
      ...jejuStoresData,
      ...jeolbukStoresData,
      ...jeolnamStoresData,
    ]

    // 한 번에 insert
    const createdStores = await Store.insertMany(allStores)

    console.log({
      createdStores,
      message: '데이터 입력이 완료되었습니다.',
    })
    process.exit(0)
  } catch (error) {
    console.error(error)
    throw new Error('데이터 입력이 실패하였습니다.')
  }
}

main()
