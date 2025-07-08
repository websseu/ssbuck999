import PostList from '@/components/post/post-list'

export default function HomePage() {
  return (
    <div className='py-8'>
      <div className='text-center mb-8'>
        <h1 className='text-4xl font-poppins font-black text-green-800 mb-2 uppercase'>
          ☕ Starbucks Blog
        </h1>
        <p className='text-muted-foreground text-sm'>
          스타벅스의 다양한 이야기를 만나보세요
        </p>
      </div>
      <PostList />
    </div>
  )
}
