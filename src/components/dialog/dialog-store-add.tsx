'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import {
  Drill,
  BookOpen,
  Tag,
  Hash,
  Globe,
  Send,
  MapPin,
  Phone,
  BookImage,
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
import { Separator } from '../ui/separator'
import { createStore } from '@/lib/actions/store.action'
import { StoreInputSchema } from '@/lib/validator'
import type { IStoreInput } from '@/lib/type'
import { useEffect, useState } from 'react'

interface DialogStoreAddProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export default function DialogStoreAdd({
  open,
  onOpenChange,
  onSuccess,
}: DialogStoreAddProps) {
  const [tagInput, setTagInput] = useState('')
  const [imageInputs, setImageInputs] = useState<string[]>([''])

  const form = useForm<IStoreInput>({
    resolver: zodResolver(StoreInputSchema),
    defaultValues: {
      storeId: '',
      name: '',
      address: '',
      location: '',
      latitude: '',
      longitude: '',
      parking: '',
      since: '',
      phone: '',
      tags: [],
      images: [],
    },
  })

  // form과 동기화 (폼 제출 전 항상 최신값 반영)
  useEffect(() => {
    form.setValue('images', imageInputs.filter(Boolean))
  }, [imageInputs, form])

  // 이미지 input 추가
  const handleAddImageInput = () => {
    setImageInputs([...imageInputs, ''])
  }

  // 이미지 input 값 변경
  const handleImageInputChange = (idx: number, value: string) => {
    setImageInputs((inputs) => inputs.map((v, i) => (i === idx ? value : v)))
  }

  // 이미지 input 삭제
  const handleRemoveImageInput = (idx: number) => {
    setImageInputs((inputs) => inputs.filter((_, i) => i !== idx))
  }

  const onSubmit = async (data: IStoreInput) => {
    try {
      const result = await createStore(data)
      if (result.success) {
        toast.success('스토어가 성공적으로 추가되었습니다.')
        onSuccess?.()
        onOpenChange(false)
        form.reset()
      } else {
        toast.error(result.error || '스토어 추가 중 오류가 발생했습니다.')
      }
    } catch (error) {
      console.error('스토어 추가 중 오류:', error)
      toast.error('스토어 추가 중 오류가 발생했습니다.')
    }
  }

  const handleDialogClose = (isOpen: boolean) => {
    if (!isOpen) {
      form.reset()
    }
    onOpenChange(isOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className='max-w-2xl'>
        <DialogHeader className='border-b pb-4'>
          <DialogTitle className='flex items-center font-black text-green-700 justify-center gap-1 text-xl'>
            <Drill className='h-5 w-5' />
            스토어 추가
          </DialogTitle>
          <DialogDescription className='text-center text-sm text-muted-foreground'>
            새로운 매장 정보를 등록할 수 있습니다.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className='space-y-2 text-sm max-h-[60vh] overflow-y-auto pt-2'>
              {/* 매장명 */}
              <div className='flex items-center gap-2'>
                <BookOpen className='h-4 w-4 text-green-600 flex-shrink-0' />
                <div className='min-w-0 flex-1 mr-1'>
                  <FormField
                    control={form.control}
                    name='name'
                    render={({ field }) => (
                      <FormItem className='flex flex-row items-center gap-2 w-full mb-0'>
                        <FormLabel className='whitespace-nowrap flex-[2_2_0%] text-right pr-3'>
                          매장명
                        </FormLabel>
                        <div className='flex-[8_8_0%]'>
                          <FormControl>
                            <Input
                              placeholder='매장명을 입력하세요'
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
                <Hash className='h-4 w-4 text-purple-600 flex-shrink-0' />
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
                              placeholder='스토어ID'
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

              {/* 주소 */}
              <div className='flex items-center gap-2'>
                <MapPin className='h-4 w-4 text-blue-600 flex-shrink-0' />
                <div className='min-w-0 flex-1 mr-1'>
                  <FormField
                    control={form.control}
                    name='address'
                    render={({ field }) => (
                      <FormItem className='flex flex-row items-center gap-2 w-full mb-0'>
                        <FormLabel className='whitespace-nowrap flex-[2_2_0%] text-right pr-3'>
                          주소
                        </FormLabel>
                        <div className='flex-[8_8_0%]'>
                          <FormControl>
                            <Input
                              placeholder='주소'
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

              {/* 지역 */}
              <div className='flex items-center gap-2'>
                <Globe className='h-4 w-4 text-orange-600 flex-shrink-0' />
                <div className='min-w-0 flex-1 mr-1'>
                  <FormField
                    control={form.control}
                    name='location'
                    render={({ field }) => (
                      <FormItem className='flex flex-row items-center gap-2 w-full mb-0'>
                        <FormLabel className='whitespace-nowrap flex-[2_2_0%] text-right pr-3'>
                          지역
                        </FormLabel>
                        <div className='flex-[8_8_0%]'>
                          <FormControl>
                            <Input
                              placeholder='지역'
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

              {/* 위도 */}
              <div className='flex items-center gap-2'>
                <Hash className='h-4 w-4 text-red-400 flex-shrink-0' />
                <div className='min-w-0 flex-1 mr-1'>
                  <FormField
                    control={form.control}
                    name='latitude'
                    render={({ field }) => (
                      <FormItem className='flex flex-row items-center gap-2 w-full mb-0'>
                        <FormLabel className='whitespace-nowrap flex-[2_2_0%] text-right pr-3'>
                          위도
                        </FormLabel>
                        <div className='flex-[8_8_0%]'>
                          <FormControl>
                            <Input
                              placeholder='위도'
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
              {/* 경도 */}
              <div className='flex items-center gap-2'>
                <Hash className='h-4 w-4 text-gray-500 flex-shrink-0' />
                <div className='min-w-0 flex-1 mr-1'>
                  <FormField
                    control={form.control}
                    name='longitude'
                    render={({ field }) => (
                      <FormItem className='flex flex-row items-center gap-2 w-full mb-0'>
                        <FormLabel className='whitespace-nowrap flex-[2_2_0%] text-right pr-3'>
                          경도
                        </FormLabel>
                        <div className='flex-[8_8_0%]'>
                          <FormControl>
                            <Input
                              placeholder='경도'
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
              {/* 주차 */}
              <div className='flex items-center gap-2'>
                <Tag className='h-4 w-4 text-green-600 flex-shrink-0' />
                <div className='min-w-0 flex-1 mr-1'>
                  <FormField
                    control={form.control}
                    name='parking'
                    render={({ field }) => (
                      <FormItem className='flex flex-row items-center gap-2 w-full mb-0'>
                        <FormLabel className='whitespace-nowrap flex-[2_2_0%] text-right pr-3'>
                          주차
                        </FormLabel>
                        <div className='flex-[8_8_0%]'>
                          <FormControl>
                            <Input
                              placeholder='주차 가능 여부'
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

              {/* 오픈연도 */}
              <div className='flex items-center gap-2'>
                <BookOpen className='h-4 w-4 text-blue-600 flex-shrink-0' />
                <div className='min-w-0 flex-1 mr-1'>
                  <FormField
                    control={form.control}
                    name='since'
                    render={({ field }) => (
                      <FormItem className='flex flex-row items-center gap-2 w-full mb-0'>
                        <FormLabel className='whitespace-nowrap flex-[2_2_0%] text-right pr-3'>
                          오픈연도
                        </FormLabel>
                        <div className='flex-[8_8_0%]'>
                          <FormControl>
                            <Input
                              placeholder='오픈연도(예: 2024-02)'
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

              {/* 전화번호 */}
              <div className='flex items-center gap-2'>
                <Phone className='h-4 w-4 text-orange-600 flex-shrink-0' />
                <div className='min-w-0 flex-1 mr-1'>
                  <FormField
                    control={form.control}
                    name='phone'
                    render={({ field }) => (
                      <FormItem className='flex flex-row items-center gap-2 w-full mb-0'>
                        <FormLabel className='whitespace-nowrap flex-[2_2_0%] text-right pr-3'>
                          전화번호
                        </FormLabel>
                        <div className='flex-[8_8_0%]'>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder='전화번호'
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

              {/* 태그 */}
              <div className='flex items-center gap-2'>
                <Tag className='h-4 w-4 text-red-600 flex-shrink-0' />
                <div className='min-w-0 flex-1 mr-1'>
                  <FormField
                    control={form.control}
                    name='tags'
                    render={({ field }) => (
                      <FormItem className='flex flex-row items-center gap-2 w-full mb-0'>
                        <FormLabel className='whitespace-nowrap flex-[2_2_0%] text-right pr-3'>
                          태그
                        </FormLabel>
                        <div className='flex-[8_8_0%] flex flex-col'>
                          <FormControl>
                            <Input
                              value={tagInput}
                              placeholder='태그 (쉼표로 구분)'
                              className='h-9'
                              onChange={(e) => setTagInput(e.target.value)}
                              onBlur={() => {
                                // 포커스 아웃 시 form 값에 반영
                                field.onChange(
                                  tagInput
                                    .split(',')
                                    .map((t) => t.trim())
                                    .filter(Boolean)
                                )
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <Separator />

              {/* 이미지 */}
              <div className='flex items-center gap-2'>
                <BookImage className='h-4 w-4 text-blue-600 flex-shrink-0' />
                <div className='min-w-0 flex-1 mr-1'>
                  <FormItem className='flex flex-row items-center gap-2 w-full mb-0'>
                    <FormLabel className='whitespace-nowrap flex-[2_2_0%] text-right pr-3'>
                      이미지
                    </FormLabel>
                    <div className='flex-[8_8_0%] flex flex-col gap-2'>
                      {imageInputs.map((img, idx) => (
                        <div key={idx} className='flex gap-2 items-center'>
                          <Input
                            value={img}
                            placeholder='이미지 URL'
                            className='h-9'
                            onChange={(e) =>
                              handleImageInputChange(idx, e.target.value)
                            }
                          />
                          {imageInputs.length > 1 && (
                            <Button
                              type='button'
                              size='icon'
                              variant='ghost'
                              onClick={() => handleRemoveImageInput(idx)}
                              className='text-red-600 hover:bg-red-100 bg-red-50 h-9'
                              title='삭제'
                            >
                              ✕
                            </Button>
                          )}
                        </div>
                      ))}

                      <Button
                        type='button'
                        variant='outline'
                        onClick={handleAddImageInput}
                        className='w-fit px-3 py-1 h-9 text-green-700 border-green-600 hover:bg-green-50'
                      >
                        + 이미지 추가
                      </Button>
                      <FormMessage />
                    </div>
                  </FormItem>
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
                    추가 중...
                  </>
                ) : (
                  <>
                    <Send /> 스토어 추가
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
