'use client'

import { Medal, Send } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { Button } from '../ui/button'
import { ContactSchema } from '@/lib/validator'
import { createContact } from '@/lib/actions/contact.action'
import type { IContactInput } from '@/lib/type'
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
} from '@/components/ui/dialog'

interface DialogContactProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function DialogContact({
  open,
  onOpenChange,
}: DialogContactProps) {
  const form = useForm<IContactInput>({
    resolver: zodResolver(ContactSchema),
    defaultValues: {
      email: '',
      message: '',
    },
  })

  const onSubmit = async (data: IContactInput) => {
    const res = await createContact(data)

    if (res.success) {
      toast.success('문의가 성공적으로 전송되었습니다.')
      form.reset()
      onOpenChange(false)
    } else {
      toast.error('문의 전송에 실패했습니다. 다시 시도해주세요.')
      console.error(res.message)
    }
  }

  // 모달이 닫힐 때 폼 초기화
  const handleOpenChange = (newOpen: boolean) => {
    // 제출 중이 아닐 때만 모달 닫기 허용
    if (!form.formState.isSubmitting) {
      if (!newOpen) {
        // 모달이 닫힐 때 폼 초기화
        form.reset()
      }
      onOpenChange(newOpen)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader className='border-b pb-6'>
          <DialogTitle className='flex items-center font-black text-green-700 justify-center gap-1 text-xl'>
            <Medal className='h-5 w-5' />
            문의하기
          </DialogTitle>
          <DialogDescription className='text-center'>
            24시간 이내에 빠르게 답변드릴게요.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            {/* 이메일 */}
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='font-nanum font-bold'>이메일</FormLabel>
                  <FormControl>
                    <Input
                      type='email'
                      placeholder='이메일을 입력해주세요'
                      className='font-nanum'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className='font-nanum' />
                </FormItem>
              )}
            />

            {/* 문의 내용 */}
            <FormField
              control={form.control}
              name='message'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='font-nanum font-bold'>
                    문의 내용
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      rows={6}
                      placeholder='문의 내용을 입력해주세요'
                      className='font-nanum resize-none'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className='font-nanum' />
                </FormItem>
              )}
            />

            {/* 제출 버튼 */}
            <div className='flex justify-center font-nanum'>
              <Button
                type='submit'
                disabled={form.formState.isSubmitting}
                className='w-full bg-green-700 hover:bg-green-800'
              >
                <Send />
                {form.formState.isSubmitting ? '문의 중...' : '문의하기'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
