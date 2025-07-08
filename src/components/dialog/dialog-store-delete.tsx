import React from 'react'
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

interface DialogStoreDeleteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  onDeleteConfirm: () => void
  isDeleting: boolean
}

export default function DialogStoreDelete({
  open,
  onOpenChange,
  title,
  onDeleteConfirm,
  isDeleting,
}: DialogStoreDeleteProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className='flex items-center gap-2 text-red-600'>
            매장 삭제 확인
          </AlertDialogTitle>
          <AlertDialogDescription className='text-left'>
            &ldquo;{title}&rdquo; 게시글을 삭제하시겠습니까?
            <span className='text-destructive block pt-1'>
              ⚠️ 이 작업은 되돌릴 수 없습니다.
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>취소</AlertDialogCancel>
          <AlertDialogAction
            onClick={onDeleteConfirm}
            disabled={isDeleting}
            className='bg-red-600 hover:bg-red-700 focus:ring-red-600'
          >
            {isDeleting ? '삭제 중...' : '삭제'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
