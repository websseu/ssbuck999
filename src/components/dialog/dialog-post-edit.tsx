'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Badge } from '../ui/badge'
import {
  FerrisWheel,
  BookOpen,
  Tag,
  Hash,
  Globe,
  Send,
  Eye,
} from 'lucide-react'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../ui/dialog'
import { Textarea } from '../ui/textarea'
import { Switch } from '../ui/switch'
import { Separator } from '../ui/separator'
import { updatePost } from '@/lib/actions/post.action'
import { PostInputSchema } from '@/lib/validator'
import type { IPostInput } from '@/lib/type'

interface DialogPostEditProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  post: (IPostInput & { _id: string }) | null
  onEditSuccess?: () => void
}

export default function DialogPostEdit({
  open,
  onOpenChange,
  post,
  onEditSuccess,
}: DialogPostEditProps) {
  const form = useForm<IPostInput>({
    resolver: zodResolver(PostInputSchema),
    defaultValues: post || {
      title: '',
      slug: '',
      category: '',
      description: '',
      isPublished: true,
      storeId: '',
      numViews: 0,
      numLikes: 0,
    },
  })

  // post가 바뀔 때마다 폼 값 동기화
  useEffect(() => {
    if (post) {
      form.reset(post)
    }
  }, [post, form])

  const onSubmit = async (data: IPostInput) => {
    if (!post?._id) return
    try {
      const result = await updatePost({ ...data, id: post._id })
      if (result.success) {
        toast.success('글이 성공적으로 수정되었습니다.')
        onEditSuccess?.()
        onOpenChange(false)
        form.reset()
      } else {
        toast.error(result.error || '글 수정 중 오류가 발생했습니다.')
      }
    } catch (error) {
      console.error('글 수정 중 오류:', error)
      toast.error('글 수정 중 오류가 발생했습니다.')
    }
  }

  const handleDialogClose = (isOpen: boolean) => {
    if (!isOpen) {
      form.reset(post || undefined)
    }
    onOpenChange(isOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className='max-w-2xl'>
        <DialogHeader className='border-b pb-4'>
          <DialogTitle className='flex items-center font-black text-green-700 justify-center gap-1 text-xl'>
            <FerrisWheel className='h-5 w-5' />글 수정
          </DialogTitle>
          <DialogDescription className='text-center text-sm text-muted-foreground'>
            게시글 정보를 수정할 수 있습니다.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className='space-y-2 text-sm max-h-[60vh] overflow-y-auto pt-2'>
              {/* 제목 */}
              <div className='flex items-center gap-2'>
                <BookOpen className='h-4 w-4 text-green-600 mt-0.5 flex-shrink-0' />
                <div className='min-w-0 flex-1 mr-1'>
                  <FormField
                    control={form.control}
                    name='title'
                    render={({ field }) => (
                      <FormItem className='flex flex-row items-center gap-2 w-full mb-0'>
                        <FormLabel className='whitespace-nowrap flex-[2_2_0%] text-right pr-3'>
                          제목
                        </FormLabel>
                        <div className='flex-[8_8_0%]'>
                          <FormControl>
                            <Input
                              placeholder='제목을 입력하세요'
                              {...field}
                              className='h-9'
                            />
                          </FormControl>
                          <FormMessage className='mt-2' />
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <Separator />
              {/* 슬러그 */}
              <div className='flex items-center gap-2'>
                <Hash className='h-4 w-4 text-purple-600 flex-shrink-0' />
                <div className='min-w-0 flex-1 mr-1'>
                  <FormField
                    control={form.control}
                    name='slug'
                    render={({ field }) => (
                      <FormItem className='flex flex-row items-center gap-2 w-full mb-0'>
                        <FormLabel className='whitespace-nowrap flex-[2_2_0%] text-right pr-3'>
                          슬러그
                        </FormLabel>
                        <div className='flex-[8_8_0%]'>
                          <FormControl>
                            <Input
                              placeholder='URL 슬러그'
                              {...field}
                              className='h-9'
                            />
                          </FormControl>
                          <FormMessage className='mt-2' />
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <Separator />
              {/* 카테고리 */}
              <div className='flex items-center gap-2'>
                <Tag className='h-4 w-4 text-blue-600 flex-shrink-0' />
                <div className='min-w-0 flex-1 mr-1'>
                  <FormField
                    control={form.control}
                    name='category'
                    render={({ field }) => (
                      <FormItem className='flex flex-row items-center gap-2 w-full mb-0'>
                        <FormLabel className='whitespace-nowrap flex-[2_2_0%] text-right pr-3'>
                          카테고리
                        </FormLabel>
                        <div className='flex-[8_8_0%]'>
                          <FormControl>
                            <Input
                              placeholder='카테고리'
                              {...field}
                              className='h-9'
                            />
                          </FormControl>
                          <FormMessage className='mt-2' />
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <Separator />

              {/* 스토어ID */}
              <div className='flex items-center gap-2'>
                <Hash className='h-4 w-4 text-red-400 flex-shrink-0' />
                <div className='min-w-0 flex-1 mr-1'>
                  <FormField
                    control={form.control}
                    name='storeId'
                    render={({ field }) => (
                      <FormItem className='flex flex-row items-center gap-2 w-full mb-0'>
                        <FormLabel className='whitespace-nowrap flex-[2_2_0%] text-right pr-3'>
                          스토어ID
                        </FormLabel>
                        <div className='flex-[8_8_0%]'>
                          <FormControl>
                            <Input
                              placeholder='연결할 스토어ID (선택)'
                              {...field}
                              className='h-9'
                            />
                          </FormControl>
                          <FormMessage className='mt-2' />
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <Separator />
              {/* 설명 */}
              <div className='flex items-center gap-2'>
                <BookOpen className='h-4 w-4 text-gray-500 flex-shrink-0' />
                <div className='min-w-0 flex-1 mr-1'>
                  <FormField
                    control={form.control}
                    name='description'
                    render={({ field }) => (
                      <FormItem className='flex flex-row items-center gap-2 w-full mb-0'>
                        <FormLabel className='whitespace-nowrap flex-[2_2_0%] text-right pr-3'>
                          설명
                        </FormLabel>
                        <div className='flex-[8_8_0%]'>
                          <FormControl>
                            <Textarea
                              placeholder='글 설명을 입력하세요 (선택)'
                              rows={3}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className='mt-2' />
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <Separator />
              {/* 조회수 */}
              <div className='flex items-center gap-2'>
                <Eye className='h-4 w-4 text-green-600 flex-shrink-0' />
                <div className='min-w-0 flex-1 mr-1'>
                  <FormField
                    control={form.control}
                    name='numViews'
                    render={({ field }) => (
                      <FormItem className='flex flex-row items-center gap-2 w-full mb-0'>
                        <FormLabel className='whitespace-nowrap flex-[2_2_0%] text-right pr-3'>
                          조회수
                        </FormLabel>
                        <div className='flex-[8_8_0%]'>
                          <FormControl>
                            <Input
                              type='number'
                              min={0}
                              {...field}
                              className='h-9'
                            />
                          </FormControl>
                          <FormMessage className='mt-2' />
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <Separator />

              {/* 좋아요 */}
              <div className='flex items-center gap-2'>
                <Send className='h-4 w-4 text-red-600 flex-shrink-0' />
                <div className='min-w-0 flex-1 mr-1'>
                  <FormField
                    control={form.control}
                    name='numLikes'
                    render={({ field }) => (
                      <FormItem className='flex flex-row items-center gap-2 w-full mb-0'>
                        <FormLabel className='whitespace-nowrap flex-[2_2_0%] text-right pr-3'>
                          좋아요
                        </FormLabel>
                        <div className='flex-[8_8_0%]'>
                          <FormControl>
                            <Input
                              type='number'
                              min={0}
                              {...field}
                              className='h-9'
                            />
                          </FormControl>
                          <FormMessage className='mt-2' />
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <Separator />

              {/* 공개여부 */}
              <div className='flex items-center gap-2 pt-2'>
                <Globe className='h-4 w-4 text-orange-600 flex-shrink-0' />
                <div className='min-w-0 flex-1 flex items-center mr-1'>
                  <FormField
                    control={form.control}
                    name='isPublished'
                    render={({ field }) => (
                      <FormItem className='flex flex-row items-center gap-2 w-full mb-0'>
                        <FormLabel className='mr-2 flex-[2_2_0%] text-right pr-3'>
                          공개여부
                        </FormLabel>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                        <Badge
                          variant={field.value ? 'outline' : 'destructive'}
                          className='ml-2'
                        >
                          {field.value ? '공개' : '비공개'}
                        </Badge>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
            <DialogFooter className='sm:justify-center border-t pt-4 mt-4'>
              <Button
                type='submit'
                disabled={form.formState.isSubmitting}
                className='w-full bg-green-700 hover:bg-green-800'
              >
                {form.formState.isSubmitting ? (
                  <>
                    <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2'></div>
                    수정 중...
                  </>
                ) : (
                  <>
                    <Send /> 글 수정
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
