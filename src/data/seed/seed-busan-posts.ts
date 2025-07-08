import { cwd } from 'process'
import { loadEnvConfig } from '@next/env'
import { connectToDatabase } from '@/lib/db'
import { busanPostsData } from '../data-busan-posts'
import Post from '@/lib/db/models/post.model'

loadEnvConfig(cwd())

const main = async () => {
  try {
    await connectToDatabase(process.env.MONGODB_URI)

    await Post.deleteMany()
    const createdPost = await Post.insertMany(busanPostsData)

    console.log({
      createdPost,
      message: '데이터 입력이 완료되었습니다.',
    })
    process.exit(0)
  } catch (error) {
    console.error(error)
    throw new Error('데이터 입력이 실패하였습니다.')
  }
}

main()
