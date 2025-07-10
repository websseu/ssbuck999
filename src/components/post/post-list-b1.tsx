'use client'

import { useCallback, useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { getAllPostsPage } from '@/lib/actions/post.action'
import {
  Loader2,
  Search,
  ChevronLeft,
  ChevronRight,
  Eye,
  Heart,
  Calendar,
  Filter,
  Grid,
  List,
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { formatDateTime } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'

interface Post {
  _id: string
  title: string
  slug: string
  category: string
  components?: string
  description?: string
  contents?: string
  image?: string
  tags?: string[]
  isPublished: boolean
  author?: string
  storeId?: string
  numViews: number
  numLikes: number
  createdAt: string
  updatedAt: string
}

interface PaginationInfo {
  currentPage: number
  totalPages: number
  totalCount: number
  limit: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export default function PostList() {
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState<PaginationInfo | null>(null)
  const [sortBy, setSortBy] = useState('latest')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const pageSize = 20

  // 검색어 디바운싱
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
      setCurrentPage(1)
    }, 500)

    return () => clearTimeout(timer)
  }, [searchTerm])

  // 데이터 가져오기
  const fetchPosts = useCallback(async () => {
    try {
      setIsLoading(true)
      const result = await getAllPostsPage(
        currentPage,
        pageSize,
        debouncedSearchTerm || undefined
      )

      if (result.success) {
        // 공개된 포스트만 필터링
        const publishedPosts = result.posts.filter(
          (post: Post) => post.isPublished
        )
        setPosts(publishedPosts)
        setPagination(result.pagination!)
        setError(null)
      } else {
        setError(result.error || '데이터를 불러오는데 실패했습니다.')
      }
    } catch (err) {
      setError('데이터를 불러오는 중 오류가 발생했습니다.')
      console.error('포스트 로딩 오류:', err)
    } finally {
      setIsLoading(false)
    }
  }, [currentPage, debouncedSearchTerm])

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  // 정렬된 포스트 가져오기
  const getSortedPosts = () => {
    let sortedPosts = [...posts]

    switch (sortBy) {
      case 'latest':
        sortedPosts.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        break
      case 'oldest':
        sortedPosts.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        )
        break
      case 'popular':
        sortedPosts.sort((a, b) => b.numViews - a.numViews)
        break
      case 'liked':
        sortedPosts.sort((a, b) => b.numLikes - a.numLikes)
        break
    }

    if (categoryFilter !== 'all') {
      sortedPosts = sortedPosts.filter((post) =>
        post.category.toLowerCase().includes(categoryFilter.toLowerCase())
      )
    }

    return sortedPosts
  }

  // 카테고리 목록 가져오기
  const getCategories = () => {
    const categories = [...new Set(posts.map((post) => post.category))]
    return categories
  }

  // 페이지 이동
  const goToPage = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const sortedPosts = getSortedPosts()

  return (
    <div className='space-y-6'>
      {/* 검색 및 필터 영역 */}
      <Card>
        <CardContent className='p-6'>
          <div className='flex flex-col lg:flex-row gap-4 items-center'>
            {/* 검색 */}
            <div className='relative flex-1 w-full'>
              <Search className='absolute left-3 top-2.5 h-4 w-4 text-muted-foreground' />
              <Input
                placeholder='제목, 카테고리, 태그로 검색...'
                className='pl-9'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* 필터 옵션들 */}
            <div className='flex gap-2 flex-wrap'>
              {/* 카테고리 필터 */}
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className='w-40'>
                  <Filter className='w-4 h-4 mr-2' />
                  <SelectValue placeholder='카테고리' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>전체 카테고리</SelectItem>
                  {getCategories().map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* 정렬 */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className='w-32'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='latest'>최신순</SelectItem>
                  <SelectItem value='oldest'>오래된순</SelectItem>
                  <SelectItem value='popular'>조회수순</SelectItem>
                  <SelectItem value='liked'>좋아요순</SelectItem>
                </SelectContent>
              </Select>

              {/* 뷰 모드 */}
              <div className='flex border rounded-md'>
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size='sm'
                  onClick={() => setViewMode('grid')}
                  className='rounded-r-none'
                >
                  <Grid className='w-4 h-4' />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size='sm'
                  onClick={() => setViewMode('list')}
                  className='rounded-l-none'
                >
                  <List className='w-4 h-4' />
                </Button>
              </div>
            </div>
          </div>

          {/* 검색 결과 정보 */}
          {pagination && (
            <div className='mt-4 text-sm text-muted-foreground'>
              총 {pagination.totalCount}개의 글 중 {sortedPosts.length}개 표시
            </div>
          )}
        </CardContent>
      </Card>

      {/* 포스트 목록 */}
      {isLoading ? (
        <div className='flex justify-center items-center py-12'>
          <Loader2 className='h-8 w-8 animate-spin text-green-600' />
          <span className='ml-2 text-muted-foreground'>
            글을 불러오는 중...
          </span>
        </div>
      ) : error ? (
        <Card className='border-red-200'>
          <CardContent className='p-8 text-center'>
            <p className='text-red-600 font-medium mb-4'>{error}</p>
            <Button onClick={fetchPosts} variant='outline'>
              다시 시도
            </Button>
          </CardContent>
        </Card>
      ) : sortedPosts.length === 0 ? (
        <Card>
          <CardContent className='p-8 text-center'>
            <p className='text-muted-foreground'>검색 결과가 없습니다.</p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* 그리드 뷰 */}
          {viewMode === 'grid' && (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
              {sortedPosts.map((post) => (
                <Card
                  key={post._id}
                  className='hover:shadow-lg transition-shadow duration-200 py-0'
                >
                  <div className='relative'>
                    {post.image ? (
                      <Image
                        src={post.image || '/placeholder.svg'}
                        alt={post.title}
                        width={400}
                        height={200}
                        className='w-full h-48 object-cover'
                      />
                    ) : (
                      <div className='w-full h-48 bg-gradient-to-br from-green-100 to-green-200 rounded flex items-center justify-center'>
                        <span className='text-green-600 text-4xl'>☕</span>
                      </div>
                    )}
                    <Badge className='absolute top-2 right-2 bg-transparent'>
                      <span className='text-2xl'>🇰🇷</span>
                      {/* {post.category}*/}
                    </Badge>
                  </div>

                  <CardHeader className='pb-2'>
                    <CardTitle className='text-lg line-clamp-2 hover:text-green-700'>
                      <Link href={`/posts/${post.slug}`}>{post.title}</Link>
                    </CardTitle>
                    {post.description && (
                      <CardDescription className='line-clamp-2'>
                        {post.description}
                      </CardDescription>
                    )}
                  </CardHeader>

                  <CardContent className='pt-0'>
                    {/* 태그 */}
                    {post.tags && post.tags.length > 0 && (
                      <div className='flex flex-wrap gap-1 mb-3'>
                        {post.tags.slice(0, 3).map((tag) => (
                          <Badge
                            key={tag}
                            variant='secondary'
                            className='text-xs'
                          >
                            #{tag}
                          </Badge>
                        ))}
                        {post.tags.length > 3 && (
                          <Badge variant='secondary' className='text-xs'>
                            +{post.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}

                    {/* 메타 정보 */}
                    <div className='flex items-center justify-between text-sm text-muted-foreground'>
                      <div className='flex items-center gap-3'>
                        <div className='flex items-center gap-1'>
                          <Eye className='w-3 h-3' />
                          <span>{post.numViews}</span>
                        </div>
                        <div className='flex items-center gap-1'>
                          <Heart className='w-3 h-3' />
                          <span>{post.numLikes}</span>
                        </div>
                      </div>
                      <div className='flex items-center gap-1'>
                        <Calendar className='w-3 h-3' />
                        <span>
                          {formatDateTime(post.createdAt).split(' ')[0]}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* 리스트 뷰 */}
          {viewMode === 'list' && (
            <div className='space-y-4'>
              {sortedPosts.map((post) => (
                <Card
                  key={post._id}
                  className='hover:shadow-md transition-shadow duration-200'
                >
                  <CardContent className='p-6'>
                    <div className='flex gap-4'>
                      {/* 이미지 */}
                      <div className='flex-shrink-0'>
                        {post.image ? (
                          <Image
                            src={post.image || '/placeholder.svg'}
                            alt={post.title}
                            width={120}
                            height={80}
                            className='w-30 h-20 object-cover rounded'
                          />
                        ) : (
                          <div className='w-30 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded flex items-center justify-center'>
                            <span className='text-green-600 text-xl'>☕</span>
                          </div>
                        )}
                      </div>

                      {/* 내용 */}
                      <div className='flex-1 min-w-0'>
                        <div className='flex items-start justify-between mb-2'>
                          <h3 className='text-lg font-semibold line-clamp-1 hover:text-green-700'>
                            <Link href={`/posts/${post.slug}`}>
                              {post.title}
                            </Link>
                          </h3>
                          <Badge className='ml-2 bg-green-600'>
                            {post.category}
                          </Badge>
                        </div>

                        {post.description && (
                          <p className='text-muted-foreground line-clamp-2 mb-3'>
                            {post.description}
                          </p>
                        )}

                        {/* 태그 */}
                        {post.tags && post.tags.length > 0 && (
                          <div className='flex flex-wrap gap-1 mb-3'>
                            {post.tags.slice(0, 5).map((tag) => (
                              <Badge
                                key={tag}
                                variant='secondary'
                                className='text-xs'
                              >
                                #{tag}
                              </Badge>
                            ))}
                          </div>
                        )}

                        {/* 메타 정보 */}
                        <div className='flex items-center justify-between text-sm text-muted-foreground'>
                          <div className='flex items-center gap-4'>
                            <div className='flex items-center gap-1'>
                              <Eye className='w-3 h-3' />
                              <span>{post.numViews}</span>
                            </div>
                            <div className='flex items-center gap-1'>
                              <Heart className='w-3 h-3' />
                              <span>{post.numLikes}</span>
                            </div>
                            <div className='flex items-center gap-1'>
                              <Calendar className='w-3 h-3' />
                              <span>{formatDateTime(post.createdAt)}</span>
                            </div>
                          </div>
                          {post.storeId && (
                            <Badge variant='outline' className='text-xs'>
                              {post.storeId}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* 페이지네이션 */}
          {pagination && pagination.totalPages > 1 && (
            <Card>
              <CardContent className='p-4'>
                <div className='flex items-center justify-center gap-2'>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={!pagination.hasPrevPage}
                  >
                    <ChevronLeft className='w-4 h-4 mr-1' />
                    이전
                  </Button>

                  <div className='flex gap-1'>
                    {Array.from(
                      { length: Math.min(5, pagination.totalPages) },
                      (_, i) => {
                        const pageNum =
                          Math.max(
                            1,
                            Math.min(pagination.totalPages - 4, currentPage - 2)
                          ) + i

                        if (pageNum > pagination.totalPages) return null

                        return (
                          <Button
                            key={pageNum}
                            variant={
                              pageNum === currentPage ? 'default' : 'outline'
                            }
                            size='sm'
                            onClick={() => goToPage(pageNum)}
                            className='w-10'
                          >
                            {pageNum}
                          </Button>
                        )
                      }
                    )}
                  </div>

                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={!pagination.hasNextPage}
                  >
                    다음
                    <ChevronRight className='w-4 h-4 ml-1' />
                  </Button>
                </div>

                <div className='text-center text-sm text-muted-foreground mt-2'>
                  {currentPage} / {pagination.totalPages} 페이지
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  )
}
