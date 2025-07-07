'use client'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Loader2 } from 'lucide-react'

interface DialogUserDeleteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  name: string
  onDeleteConfirm: () => Promise<void>
  isDeleting: boolean
}

export default function DialogUserDelete({
  open,
  onOpenChange,
  name,
  onDeleteConfirm,
  isDeleting,
}: DialogUserDeleteProps) {
  const handleCancel = () => {
    if (!isDeleting) {
      onOpenChange(false)
    }
  }

  const handleConfirm = async () => {
    await onDeleteConfirm()
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>문의사항 삭제</AlertDialogTitle>
          <AlertDialogDescription>
            &ldquo;{name}&rdquo; 사용자를 삭제하시겠습니까?
            <span className='text-destructive block pt-1'>
              이 작업은 되돌릴 수 없습니다.
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel} disabled={isDeleting}>
            취소
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isDeleting}
            className='bg-destructive text-white hover:bg-destructive/90'
          >
            {isDeleting ? (
              <>
                <Loader2 className='h-4 w-4 mr-2 animate-spin' />
                삭제 중...
              </>
            ) : (
              '삭제'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
