import PostList from '@/components/post/post-list'

export default function HomePage() {
  return (
    <div className='py-8'>
      <div className='text-center mb-8'>
        <h1 className='text-4xl font-poppins font-black text-green-800 mb-2 uppercase'>
          ☕ Starbucks
        </h1>
      </div>
      <PostList />
    </div>
  )
}
