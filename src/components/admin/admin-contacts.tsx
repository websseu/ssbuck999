import React, { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { formatDateTime } from '@/lib/utils'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Badge } from '../ui/badge'
import {
  deleteContact,
  getAllContactsPage,
  updateContactStatus,
} from '@/lib/actions/contact.action'
import {
  Loader2,
  Search,
  Clock,
  Eye,
  CheckCircle,
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
  Trash2,
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import DialogContactDelete from '../dialog/dialog-contact-delete'
import DialogContactDetail from '../dialog/dialog-contact-detail'

interface Contact {
  _id: string
  email: string
  title: string
  message: string
  status: '대기중' | '확인완료' | '답장완료'
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

export default function AdminContact() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')

  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [pagination, setPagination] = useState<PaginationInfo | null>(null)

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [contactToDelete, setContactToDelete] = useState<Contact | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const [detailDialogOpen, setDetailDialogOpen] = useState(false)
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)

  // 데이터 가져오기
  const fetchContacts = useCallback(async () => {
    try {
      setIsLoading(true)

      const result = await getAllContactsPage(
        currentPage,
        pageSize,
        debouncedSearchTerm || undefined
      )

      if (result.success) {
        setContacts(result.contacts)
        setPagination(result.pagination!)
        setError(null)
      } else {
        setError(result.error || '데이터를 불러오는데 실패했습니다.')
      }
    } catch (err) {
      setError('데이터를 불러오는 중 오류가 발생했습니다.')
      console.error('문의사항 데이터 로딩 오류:', err)
    } finally {
      setIsLoading(false)
    }
  }, [currentPage, pageSize, debouncedSearchTerm])

  useEffect(() => {
    fetchContacts()
  }, [fetchContacts])

  // 상태별 배지 스타일
  const getStatusBadge = (status: string) => {
    switch (status) {
      case '대기중':
        return {
          variant: 'outline' as const,
          color: 'text-orange-600 border-orange-600',
          icon: Clock,
        }
      case '확인완료':
        return {
          variant: 'outline' as const,
          color: 'text-blue-600 border-blue-600',
          icon: Eye,
        }
      case '답장완료':
        return {
          variant: 'outline' as const,
          color: 'text-green-600 border-green-600',
          icon: CheckCircle,
        }
      default:
        return {
          variant: 'outline' as const,
          color: 'text-gray-600',
          icon: Clock,
        }
    }
  }

  // 상태별 통계 계산
  const getStatusCounts = () => {
    return {
      waiting: contacts.filter((c) => c.status === '대기중').length,
      confirmed: contacts.filter((c) => c.status === '확인완료').length,
      replied: contacts.filter((c) => c.status === '답장완료').length,
    }
  }

  const statusCounts = getStatusCounts()

  // 상태 변경
  const handleStatusChange = async (
    contact: Contact,
    newStatus: '대기중' | '확인완료' | '답장완료'
  ) => {
    try {
      const result = await updateContactStatus(contact._id, newStatus)

      if (result.success) {
        toast.success('상태 변경 완료', {
          description: result.message,
        })

        // 목록에서 해당 문의사항의 상태 업데이트
        setContacts((prevContacts) =>
          prevContacts.map((c) =>
            c._id === contact._id ? { ...c, status: result.status! } : c
          )
        )
      } else {
        toast.error('상태 변경 실패', {
          description: result.error,
        })
      }
    } catch (error) {
      console.error('상태 변경 중 오류:', error)
      toast.error('상태 변경 실패', {
        description: '문의사항 상태 변경 중 오류가 발생했습니다.',
      })
    }
  }

  // 삭제 다이얼로그 열기
  const handleDeleteClick = (contact: Contact) => {
    setContactToDelete(contact)
    setDeleteDialogOpen(true)
  }

  // 삭제 확인
  const handleDeleteConfirm = async () => {
    if (!contactToDelete) return

    try {
      setIsDeleting(true)
      const result = await deleteContact(contactToDelete._id)

      if (result.success) {
        toast.success('삭제 완료', {
          description: result.message,
        })

        // 목록에서 삭제된 문의사항 제거
        setContacts((prevContacts) =>
          prevContacts.filter((contact) => contact._id !== contactToDelete._id)
        )

        // 현재 페이지에 데이터가 없으면 이전 페이지로 이동
        if (contacts.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1)
        }
      } else {
        toast.error('삭제 실패', {
          description: result.error,
        })
      }
    } catch (error) {
      console.error('삭제 중 오류:', error)
      toast.error('삭제 실패', {
        description: '문의사항 삭제 중 오류가 발생했습니다.',
      })
    } finally {
      setIsDeleting(false)
      setDeleteDialogOpen(false)
      setContactToDelete(null)
    }
  }

  // 다이얼로그 상태 변경
  const handleDialogOpenChange = (open: boolean) => {
    if (!open && !isDeleting) {
      setDeleteDialogOpen(false)
      setContactToDelete(null)
    }
  }

  // 페이지 크기 변경
  const handlePageSizeChange = (newPageSize: string) => {
    setPageSize(Number(newPageSize))
    setCurrentPage(1)
  }

  // 페이지 이동
  const goToPage = (page: number) => {
    setCurrentPage(page)
  }

  // 페이지네이션 버튼 생성
  const renderPaginationButtons = () => {
    if (!pagination) return null

    const buttons = []
    const { currentPage, totalPages } = pagination

    // 이전 페이지들
    const startPage = Math.max(1, currentPage - 2)
    const endPage = Math.min(totalPages, currentPage + 2)

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <Button
          key={i}
          variant={i === currentPage ? 'default' : 'outline'}
          size='sm'
          onClick={() => goToPage(i)}
          className='w-8 h-8 p-0'
        >
          {i}
        </Button>
      )
    }

    return buttons
  }

  // 상세정보 버튼 클릭 핸들러
  const handleDetailClick = (contact: Contact) => {
    setSelectedContact(contact)
    setDetailDialogOpen(true)
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className='text-xl font-gmarket text-green-700 flex items-center gap-2'>
            문의 관리({pagination?.totalCount ?? 0})
          </CardTitle>
          <CardDescription>
            문의를 관리하고 삭제 및 상태 변경을 할 수 있습니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            <div className='flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-end'>
              {/* 검색영역 */}
              <div className='relative w-full sm:w-80 flex gap-2'>
                <Search className='absolute left-3 top-2.5 h-4 w-4 text-muted-foreground' />
                <Input
                  placeholder='제목, 이메일, 내용 검색'
                  className='pl-9 h-9'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      setDebouncedSearchTerm(searchTerm)
                      setCurrentPage(1)
                    }
                  }}
                />
                <Select
                  value={pageSize.toString()}
                  onValueChange={handlePageSizeChange}
                >
                  <SelectTrigger className='w-24 py-4 text-muted-foreground'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='10'>10개</SelectItem>
                    <SelectItem value='20'>20개</SelectItem>
                    <SelectItem value='50'>50개</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* 상태 뱃지 영역 */}
              <div className='flex items-center gap-2 justify-end mt-2'>
                <Badge
                  variant='outline'
                  className='text-orange-600 border-orange-600 h-6'
                >
                  대기중: {statusCounts.waiting}
                </Badge>
                <Badge
                  variant='outline'
                  className='text-blue-600 border-blue-600 h-6'
                >
                  확인완료: {statusCounts.confirmed}
                </Badge>
                <Badge
                  variant='outline'
                  className='text-green-600 border-green-600 h-6'
                >
                  답장완료: {statusCounts.replied}
                </Badge>
              </div>
            </div>

            {isLoading ? (
              <div className='flex justify-center items-center py-8 mt-8'>
                <Loader2 className='h-8 w-8 animate-spin text-primary' />
                <span className='ml-2'>데이터를 불러오는 중...</span>
              </div>
            ) : error ? (
              <div className='bg-destructive/10 p-4 rounded-md text-destructive text-center'>
                <p className='font-medium'>{error}</p>
                <Button
                  onClick={fetchContacts}
                  variant='outline'
                  className='mt-2'
                >
                  다시 시도
                </Button>
              </div>
            ) : (
              <>
                <div className='rounded border'>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className='text-center'>번호</TableHead>
                        <TableHead>이메일</TableHead>
                        <TableHead>제목</TableHead>
                        <TableHead>상태</TableHead>
                        <TableHead>접수일</TableHead>
                        <TableHead className='text-center'>관리</TableHead>
                        <TableHead className='text-center'>변경</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {contacts.length > 0 ? (
                        contacts.map((contact, index) => {
                          const statusInfo = getStatusBadge(contact.status)
                          const StatusIcon = statusInfo.icon

                          return (
                            <TableRow key={contact._id}>
                              <TableCell className='text-center'>
                                {(currentPage - 1) * pageSize + index + 1}
                              </TableCell>
                              <TableCell>
                                <a
                                  href={`mailto:${contact.email}`}
                                  className='hover:underline underline-offset-4 text-muted-foreground'
                                  title={`${contact.email}로 이메일 보내기`}
                                >
                                  {contact.email}
                                </a>
                              </TableCell>
                              <TableCell className='max-w-[300px] truncate text-muted-foreground'>
                                {contact.message}
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant={statusInfo.variant}
                                  className={`${statusInfo.color} cursor-pointer`}
                                >
                                  <StatusIcon className='h-3 w-3' />
                                  {contact.status}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge variant='outline'>
                                  {formatDateTime(contact.createdAt)}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className='flex items-center justify-center gap-1'>
                                  <Button
                                    variant='ghost'
                                    size='sm'
                                    title='상세정보'
                                    onClick={() => handleDetailClick(contact)}
                                  >
                                    <Eye className='h-4 w-4' />
                                  </Button>
                                  <Button
                                    variant='ghost'
                                    size='sm'
                                    title='삭제하기'
                                    onClick={() => handleDeleteClick(contact)}
                                  >
                                    <Trash2 className='h-4 w-4' />
                                  </Button>
                                </div>
                              </TableCell>
                              <TableCell className='mx-auto'>
                                <Select
                                  value={contact.status}
                                  onValueChange={(
                                    value: '대기중' | '확인완료' | '답장완료'
                                  ) => handleStatusChange(contact, value)}
                                >
                                  <SelectTrigger className='w-24 h-6 mx-auto text-xs'>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem
                                      value='대기중'
                                      className='text-xs'
                                    >
                                      대기중
                                    </SelectItem>
                                    <SelectItem
                                      value='확인완료'
                                      className='text-xs'
                                    >
                                      확인완료
                                    </SelectItem>
                                    <SelectItem
                                      value='답장완료'
                                      className='text-xs'
                                    >
                                      답장완료
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </TableCell>
                            </TableRow>
                          )
                        })
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={6}
                            className='text-center py-6 text-muted-foreground'
                          >
                            등록된 문의사항이 없습니다.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>

                <div className='flex justify-center items-center gap-2'>
                  {/* 페이지네이션 */}
                  {pagination && pagination.totalPages > 1 && (
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center gap-2'>
                        <Button
                          variant='outline'
                          size='sm'
                          onClick={() => goToPage(1)}
                          disabled={!pagination.hasPrevPage}
                          className='w-8 h-8 p-0'
                        >
                          <ChevronsLeft className='h-4 w-4' />
                        </Button>

                        <Button
                          variant='outline'
                          size='sm'
                          onClick={() => goToPage(currentPage - 1)}
                          disabled={!pagination.hasPrevPage}
                          className='w-8 h-8 p-0'
                        >
                          <ChevronLeft className='h-4 w-4' />
                        </Button>

                        <div className='flex gap-1'>
                          {renderPaginationButtons()}
                        </div>

                        <Button
                          variant='outline'
                          size='sm'
                          onClick={() => goToPage(currentPage + 1)}
                          disabled={!pagination.hasNextPage}
                          className='w-8 h-8 p-0'
                        >
                          <ChevronRight className='h-4 w-4' />
                        </Button>

                        <Button
                          variant='outline'
                          size='sm'
                          onClick={() => goToPage(pagination.totalPages)}
                          disabled={!pagination.hasNextPage}
                          className='w-8 h-8 p-0'
                        >
                          <ChevronsRight className='h-4 w-4' />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 삭제 확인 다이얼로그 */}
      <DialogContactDelete
        open={deleteDialogOpen}
        onOpenChange={handleDialogOpenChange}
        contact={contactToDelete}
        onDeleteConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
      />

      {/* 문의 상세 다이얼로그 */}
      <DialogContactDetail
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
        contact={selectedContact}
      />
    </>
  )
}
