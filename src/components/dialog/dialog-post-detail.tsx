import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Separator } from '../ui/separator'
import { DialogDescription } from '@radix-ui/react-dialog'
import {
  BookOpen,
  Tag,
  Eye,
  Calendar,
  Send,
  Globe,
  Hash,
  Heart,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../ui/dialog'

interface PostType {
  _id: string
  title: string
  slug: string
  category: string
  description?: string
  isPublished: boolean
  storeId?: string
  numViews: number
  numLikes: number
  createdAt: string
  updatedAt: string
}

interface DialogPostDetailProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  post: PostType | null
}

export default function DialogPostDetail({
  open,
  onOpenChange,
  post,
}: DialogPostDetailProps) {
  if (!post) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-2xl'>
        <DialogHeader className='border-b pb-4'>
          <DialogTitle className='flex items-center font-black text-green-700 justify-center gap-1 text-xl'>
            <BookOpen className='h-5 w-5' />
            게시글 정보
          </DialogTitle>
          <DialogDescription className='text-center text-sm text-muted-foreground'>
            게시글 상세 정보입니다.
          </DialogDescription>
        </DialogHeader>
        <div className='space-y-2 text-sm max-h-[60vh] overflow-y-auto'>
          {/* 제목 */}
          <div className='flex items-start gap-2'>
            <BookOpen className='h-4 w-4 text-green-600 mt-0.5 flex-shrink-0' />
            <div className='min-w-0 flex-1'>
              <span className='font-medium text-gray-700'>제목:</span>
              <span className='ml-2 text-gray-900 break-words'>
                {post.title}
              </span>
            </div>
          </div>

          <Separator />

          {/* 카테고리 */}
          <div className='flex items-start gap-2'>
            <Tag className='h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0' />
            <div className='min-w-0 flex-1'>
              <span className='font-medium text-gray-700'>카테고리:</span>
              <span className='ml-2 text-gray-900'>{post.category}</span>
            </div>
          </div>

          <Separator />

          {/* 설명 */}
          <div className='flex items-start gap-2'>
            <BookOpen className='h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0' />
            <div className='min-w-0 flex-1'>
              <span className='font-medium text-gray-700'>설명:</span>
              <span className='ml-2 text-gray-900 break-words leading-6'>
                {post.description || <span className='text-gray-400'>-</span>}
              </span>
            </div>
          </div>

          <Separator />

          {/* 슬러그 */}
          <div className='flex items-start gap-2'>
            <Hash className='h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0' />
            <div className='min-w-0 flex-1'>
              <span className='font-medium text-gray-700'>슬러그:</span>
              <span className='ml-2 text-gray-900'>{post.slug}</span>
            </div>
          </div>

          <Separator />

          {/* 스토어ID */}
          <div className='flex items-start gap-2'>
            <Hash className='h-4 w-4 text-red-400 mt-0.5 flex-shrink-0' />
            <div className='min-w-0 flex-1'>
              <span className='font-medium text-gray-700'>스토어ID:</span>
              <span className='ml-2 text-gray-900'>
                {post.storeId || <span className='text-gray-400'>-</span>}
              </span>
            </div>
          </div>

          <Separator />

          {/* 공개여부 */}
          <div className='flex items-center gap-2'>
            <Globe className='h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0' />
            <div className='min-w-0 flex-1 flex items-center'>
              <span className='font-medium text-gray-700'>공개여부:</span>
              <span className='ml-2'>
                <Badge variant={post.isPublished ? 'outline' : 'destructive'}>
                  {post.isPublished ? '공개' : '비공개'}
                </Badge>
              </span>
            </div>
          </div>

          <Separator />

          {/* 조회수 */}
          <div className='flex items-center gap-2'>
            <Eye className='h-4 w-4 text-green-600 mt-0.5 flex-shrink-0' />
            <div className='min-w-0 flex-1'>
              <span className='font-medium text-gray-700'>조회수:</span>
              <span className='ml-2 text-gray-900'>{post.numViews}</span>
            </div>
          </div>

          <Separator />

          {/* 좋아요 */}
          <div className='flex items-center gap-2'>
            <Heart className='h-4 w-4 text-red-600 mt-0.5 flex-shrink-0' />
            <div className='min-w-0 flex-1'>
              <span className='font-medium text-gray-700'>좋아요:</span>
              <span className='ml-2 text-gray-900'>{post.numLikes}</span>
            </div>
          </div>

          <Separator />

          {/* 생성일 */}
          <div className='flex items-start gap-2'>
            <Calendar className='h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0' />
            <div className='min-w-0 flex-1'>
              <span className='font-medium text-gray-700'>생성일:</span>
              <span className='ml-2 text-gray-900'>
                {new Date(post.createdAt).toLocaleDateString()}{' '}
                {new Date(post.createdAt).toLocaleTimeString()}
              </span>
            </div>
          </div>
        </div>

        <DialogFooter className='sm:justify-center border-t pt-4'>
          <Button
            onClick={() => onOpenChange(false)}
            className='w-full bg-green-700 hover:bg-green-800'
          >
            <Send /> 확인 완료
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
