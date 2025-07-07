'use client'

import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Separator } from '../ui/separator'
import { DialogDescription } from '@radix-ui/react-dialog'
import {
  User,
  Mail,
  Shield,
  CheckCircle,
  XCircle,
  Calendar,
  Eye,
  Send,
  Panda,
  Crown,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../ui/dialog'

interface UserType {
  _id: string
  name: string
  email: string
  role?: string
  visitCount: number
  isActive: boolean
  emailVerified: boolean
  createdAt: string
}

interface DialogUserDetailProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: UserType | null
}

export default function DialogUserDetail({
  open,
  onOpenChange,
  user,
}: DialogUserDetailProps) {
  if (!user) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-2xl'>
        <DialogHeader className='border-b pb-4'>
          <DialogTitle className='flex items-center font-black text-green-700 justify-center gap-1 text-xl'>
            <Panda className='h-5 w-5' />
            사용자 정보
          </DialogTitle>
          <DialogDescription className='text-center text-sm text-muted-foreground'>
            사용자 상세 정보입니다.
          </DialogDescription>
        </DialogHeader>
        <div className='space-y-2 text-sm max-h-[60vh] overflow-y-auto'>
          {/* 사용자 이름 */}
          <div className='flex items-start gap-2'>
            {user.role === 'admin' ? (
              <Crown className='h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0' />
            ) : (
              <User className='h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0' />
            )}
            <div className='min-w-0 flex-1'>
              <span className='font-medium text-gray-700'>이름:</span>
              <span className='ml-2 text-gray-900 break-words'>
                {user.name}
              </span>
            </div>
          </div>

          <Separator />

          {/* 이메일 */}
          <div className='flex items-start gap-2'>
            <Mail className='h-4 w-4 text-green-600 mt-0.5 flex-shrink-0' />
            <div className='min-w-0 flex-1'>
              <span className='font-medium text-gray-700'>이메일:</span>
              <span className='ml-2 text-gray-900 break-words'>
                {user.email}
              </span>
            </div>
          </div>

          <Separator />

          {/* 역할 */}
          <div className='flex items-center gap-2'>
            <Shield className='h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0' />
            <div className='min-w-0 flex-1'>
              <span className='font-medium text-gray-700'>역할:</span>
              <span className='ml-2'>
                <Badge
                  className={
                    user.role === 'admin'
                      ? 'text-red-700 border-red-300 hover:bg-red-200'
                      : 'text-blue-700 border-blue-300 hover:bg-blue-200'
                  }
                  variant='outline'
                >
                  {user.role === 'admin' ? '관리자' : '사용자'}
                </Badge>
              </span>
            </div>
          </div>

          <Separator />

          {/* 계정 상태 */}
          <div className='flex items-center gap-2'>
            <Eye className='h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0' />
            <div className='min-w-0 flex-1'>
              <span className='font-medium text-gray-700'>계정 상태:</span>
              <span className='ml-2'>
                <Badge variant={user.isActive ? 'outline' : 'destructive'}>
                  {user.isActive ? '활성' : '비활성'}
                </Badge>
              </span>
            </div>
          </div>

          <Separator />

          {/* 이메일 인증 */}
          <div className='flex items-center gap-2'>
            {user.emailVerified ? (
              <CheckCircle className='h-4 w-4 text-green-600 mt-0.5 flex-shrink-0' />
            ) : (
              <XCircle className='h-4 w-4 text-red-600 mt-0.5 flex-shrink-0' />
            )}
            <div className='min-w-0 flex-1'>
              <span className='font-medium text-gray-700'>이메일 인증:</span>
              <span className='ml-2'>
                <Badge
                  variant='outline'
                  className={
                    user.emailVerified
                      ? 'text-green-700 border-green-300'
                      : 'text-red-700 border-red-300'
                  }
                >
                  {user.emailVerified ? '인증 완료' : '인증 필요'}
                </Badge>
              </span>
            </div>
          </div>

          <Separator />

          {/* 방문 수 */}
          <div className='flex items-start gap-2'>
            <Eye className='h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0' />
            <div className='min-w-0 flex-1'>
              <span className='font-medium text-gray-700'>방문 수:</span>
              <span className='ml-2 text-gray-900'>{user.visitCount}회</span>
            </div>
          </div>

          <Separator />

          {/* 가입일 */}
          <div className='flex items-start gap-2'>
            <Calendar className='h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0' />
            <div className='min-w-0 flex-1'>
              <span className='font-medium text-gray-700'>가입일:</span>
              <span className='ml-2 text-gray-900'>
                {new Date(user.createdAt).toLocaleDateString()}{' '}
                {new Date(user.createdAt).toLocaleTimeString()}
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
