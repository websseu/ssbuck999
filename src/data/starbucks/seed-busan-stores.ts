import { cwd } from 'process'
import { loadEnvConfig } from '@next/env'
import { connectToDatabase } from '@/lib/db'
import { busanStoresData } from '../starbucks/data-busan-stores'
import Store from '@/lib/db/models/store.model'

loadEnvConfig(cwd())

const main = async () => {
  try {
    await connectToDatabase(process.env.MONGODB_URI)

    await Store.deleteMany()
    const createdStore = await Store.insertMany(busanStoresData)

    console.log({
      createdStore,
      message: '데이터 입력이 완료되었습니다.',
    })
    process.exit(0)
  } catch (error) {
    console.error(error)
    throw new Error('데이터 입력이 실패하였습니다.')
  }
}

main()
