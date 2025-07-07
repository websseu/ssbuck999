'use client'

import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Separator } from '../ui/separator'
import { DialogDescription } from '@radix-ui/react-dialog'
import {
  Mail,
  MessageSquare,
  Clock,
  CheckCircle,
  Calendar,
  Angry,
  Send,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../ui/dialog'

interface ContactType {
  _id: string
  email: string
  message: string
  status: '대기중' | '확인완료' | '답장완료'
  createdAt: string
  updatedAt: string
}

interface DialogContactDetailProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  contact: ContactType | null
}

export default function DialogContactDetail({
  open,
  onOpenChange,
  contact,
}: DialogContactDetailProps) {
  if (!contact) return null

  // 상태 뱃지 렌더링
  const renderStatusBadge = (status: string) => {
    const statusConfig = {
      대기중: {
        icon: <Clock className='w-3 h-3' />,
        className: 'bg-yellow-100 text-yellow-800 border-yellow-300',
        text: '대기중',
      },
      확인완료: {
        icon: <CheckCircle className='w-3 h-3' />,
        className: 'bg-blue-100 text-blue-800 border-blue-300',
        text: '확인완료',
      },
      답장완료: {
        icon: <MessageSquare className='w-3 h-3' />,
        className: 'bg-green-100 text-green-800 border-green-300',
        text: '답장완료',
      },
    }

    const config =
      statusConfig[status as keyof typeof statusConfig] ||
      statusConfig['대기중']

    return (
      <Badge className={config.className}>
        {config.icon}
        {config.text}
      </Badge>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-2xl'>
        <DialogHeader className='border-b pb-4'>
          <DialogTitle className='flex items-center font-black text-green-700 justify-center gap-1 text-xl'>
            <Angry className='h-5 w-5' />
            문의 사항
          </DialogTitle>
          <DialogDescription className='text-center text-sm'>
            문의 사항 상세 정보입니다.
          </DialogDescription>
        </DialogHeader>
        <div className='space-y-2 text-sm max-h-[60vh] overflow-y-auto'>
          {/* 문의자 정보 */}
          <div className='flex items-start gap-2'>
            <Mail className='h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0' />
            <div className='min-w-0 flex-1'>
              <span className='font-medium text-gray-700'>이메일:</span>
              <span className='ml-2 text-gray-900 break-words'>
                {contact.email}
              </span>
            </div>
          </div>

          <Separator />

          {/* 문의 내용 */}
          <div className='flex items-start gap-2'>
            <MessageSquare className='h-4 w-4 text-green-600 mt-0.5 flex-shrink-0' />
            <div className='min-w-0 flex-1'>
              <span className='font-medium text-gray-700'>문의 내용:</span>
              <div className='mt-2 p-3 bg-gray-50 rounded-lg '>
                <p className='text-gray-900 whitespace-pre-wrap break-words leading-6'>
                  {contact.message}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* 상태 정보 */}
          <div className='flex items-center gap-2'>
            <CheckCircle className='h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0' />
            <div className='min-w-0 flex-1'>
              <span className='font-medium text-gray-700'>처리 상태:</span>
              <span className='ml-2'>{renderStatusBadge(contact.status)}</span>
            </div>
          </div>

          <Separator />

          {/* 날짜 정보 */}
          <div className='flex items-start gap-2'>
            <Calendar className='h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0' />
            <div className='min-w-0 flex-1'>
              <span className='font-medium text-gray-700'>접수일:</span>
              <span className='ml-2 text-gray-900'>
                {new Date(contact.createdAt).toLocaleDateString()}{' '}
                {new Date(contact.createdAt).toLocaleTimeString()}
              </span>
            </div>
          </div>
          <div className='flex items-start gap-2'>
            <Calendar className='h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0' />
            <div className='min-w-0 flex-1'>
              <span className='font-medium text-gray-700'>최근 수정:</span>
              <span className='ml-2 text-gray-900'>
                {new Date(contact.updatedAt).toLocaleDateString()}{' '}
                {new Date(contact.updatedAt).toLocaleTimeString()}
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
