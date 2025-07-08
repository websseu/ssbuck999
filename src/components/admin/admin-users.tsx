import React, { useCallback, useEffect, useState } from 'react'
import {
  Loader2,
  Search,
  CheckCircle,
  XCircle,
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
  Eye,
  Trash2,
  Crown,
  User,
  Frown,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Input } from '../ui/input'
import {
  deleteUser,
  getAllUsersPage,
  toggleUserRole,
  toggleUserStatus,
} from '@/lib/actions/user.action'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { formatDateTime } from '@/lib/utils'
import { toast } from 'sonner'
import DialogUserDelete from '../dialog/dialog-user-delete'
import DialogUserDetail from '../dialog/dialog-user-detail'

interface User {
  _id: string
  name: string
  email: string
  role?: string
  visitCount: number
  isActive: boolean
  emailVerified: boolean
  createdAt: string
}

interface PaginationInfo {
  currentPage: number
  totalPages: number
  totalCount: number
  limit: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')

  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [pagination, setPagination] = useState<PaginationInfo | null>(null)

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<User | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const [detailDialogOpen, setDetailDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [roleChanging, setRoleChanging] = useState<string | null>(null)
  const [statusChanging, setStatusChanging] = useState<string | null>(null)

  // 데이터 가져오기
  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true)

      const result = await getAllUsersPage(
        currentPage,
        pageSize,
        debouncedSearchTerm || undefined
      )

      if (result.success) {
        setUsers(result.users)
        setPagination(result.pagination!)
        setError(null)
      } else {
        setError(result.error || '데이터를 불러오는데 실패했습니다.')
      }
    } catch (err) {
      setError('데이터를 불러오는 중 오류가 발생했습니다.')
      console.error('사용자 데이터 로딩 오류:', err)
    } finally {
      setIsLoading(false)
    }
  }, [currentPage, pageSize, debouncedSearchTerm])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  // 검색 디바운스
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
      setCurrentPage(1)
    }, 1000)
    return () => clearTimeout(timer)
  }, [searchTerm])

  // 상세정보 다이얼로그 열기
  const handleDetailClick = (user: User) => {
    setSelectedUser(user)
    setDetailDialogOpen(true)
  }

  // 삭제 다이얼로그 열기
  const handleDeleteClick = (user: User) => {
    setUserToDelete(user)
    setDeleteDialogOpen(true)
  }

  // 삭제 확인
  const handleDeleteConfirm = async () => {
    if (!userToDelete) return

    try {
      setIsDeleting(true)
      const result = await deleteUser(userToDelete._id)

      if (result.success) {
        toast.success('삭제 완료', { description: result.message })

        setUsers((prevUsers) =>
          prevUsers.filter((user) => user._id !== userToDelete._id)
        )

        // 전체 회원 수 감소
        setPagination((prev) =>
          prev ? { ...prev, totalCount: prev.totalCount - 1 } : prev
        )

        if (users.length === 1 && currentPage > 1) {
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
      setUserToDelete(null)
    }
  }

  // 다이얼로그 상태 변경
  const handleDialogOpenChange = (open: boolean) => {
    if (!open && !isDeleting) {
      setDeleteDialogOpen(false)
      setUserToDelete(null)
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

  // 역할 변경 핸들러
  const handleRoleChange = async (user: User) => {
    setRoleChanging(user._id)
    try {
      const result = await toggleUserRole(user._id)
      if (result.success) {
        toast.success('역할 변경 완료', { description: result.message })
        setUsers((prev) =>
          prev.map((u) =>
            u._id === user._id ? { ...u, role: result.role } : u
          )
        )
      } else {
        toast.error('역할 변경 실패', { description: result.error })
      }
    } catch {
      toast.error('역할 변경 실패', { description: '오류가 발생했습니다.' })
    } finally {
      setRoleChanging(null)
    }
  }

  // 상태 변경 핸들러
  const handleStatusChange = async (user: User) => {
    setStatusChanging(user._id)
    try {
      const result = await toggleUserStatus(user._id)
      if (result.success) {
        toast.success('상태 변경 완료', { description: result.message })
        setUsers((prev) =>
          prev.map((u) =>
            u._id === user._id ? { ...u, isActive: result.isActive } : u
          )
        )
      } else {
        toast.error('상태 변경 실패', { description: result.error })
      }
    } catch {
      toast.error('상태 변경 실패', { description: '오류가 발생했습니다.' })
    } finally {
      setStatusChanging(null)
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className='text-xl font-gmarket text-green-700 flex items-center gap-2'>
            회원 관리({pagination?.totalCount ?? 0})
          </CardTitle>
          <CardDescription>
            회원을 관리하고 삭제 및 상태 변경을 할 수 있습니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            <div className='flex gap-3 flex-row justify-between items-end'>
              {/* 검색영역 */}
              <div className='relative w-full sm:w-80 flex gap-2'>
                <Search className='absolute left-3 top-2.5 h-4 w-4 text-muted-foreground' />
                <Input
                  placeholder='사용자, 이메일 검색'
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
              </div>

              {/* 페이지 갯수 설정 */}
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

            {isLoading ? (
              <div className='flex justify-center items-center py-8 mt-8'>
                <Loader2 className='h-8 w-8 animate-spin text-primary' />
                <span className='ml-2'>데이터를 불러오는 중...</span>
              </div>
            ) : error ? (
              <div className='bg-destructive/10 p-4 rounded-md text-destructive text-center'>
                <p className='font-medium'>{error}</p>
                <Button onClick={fetchUsers} variant='outline' className='mt-2'>
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
                        <TableHead>이름</TableHead>
                        <TableHead>이메일</TableHead>
                        <TableHead className='text-center'>인증</TableHead>
                        <TableHead className='text-center'>역할</TableHead>
                        <TableHead className='text-center'>상태</TableHead>
                        <TableHead className='text-center'>방문수</TableHead>
                        <TableHead className='text-center'>가입일</TableHead>
                        <TableHead className='text-center'>관리</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.length > 0 ? (
                        users.map((user, index) => (
                          <TableRow
                            key={user._id}
                            className='text-muted-foreground'
                          >
                            <TableCell className='text-center'>
                              {(currentPage - 1) * pageSize + index + 1}
                            </TableCell>
                            <TableCell className='font-medium text-muted-foreground'>
                              {user.name}
                            </TableCell>
                            <TableCell className='text-muted-foreground'>
                              <div className='flex items-center gap-2'>
                                <span>{user.email}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              {user.emailVerified ? (
                                <span
                                  title='이메일 인증 완료'
                                  className='flex items-center justify-center gap-1'
                                >
                                  인증 완료
                                  <CheckCircle className='h-4 w-4 text-green-500' />
                                </span>
                              ) : (
                                <span
                                  title='이메일 인증 필요'
                                  className='flex items-center justify-center gap-1'
                                >
                                  인증 안됨
                                  <XCircle className='h-4 w-4 text-red-500' />
                                </span>
                              )}
                            </TableCell>
                            <TableCell className='text-center'>
                              <Badge
                                className={
                                  user.role === 'admin'
                                    ? 'text-red-700 border-red-700 hover:bg-red-200 cursor-pointer'
                                    : 'text-blue-700 border-blue-300 hover:bg-blue-200 cursor-pointer'
                                }
                                variant='outline'
                                onClick={
                                  roleChanging === user._id
                                    ? undefined
                                    : () => handleRoleChange(user)
                                }
                                style={{
                                  opacity: roleChanging === user._id ? 0.6 : 1,
                                }}
                                title='클릭 시 역할이 변경됩니다.'
                              >
                                {roleChanging === user._id ? (
                                  <Loader2 className='h-3 w-3 animate-spin mr-1' />
                                ) : user.role === 'admin' ? (
                                  <Crown className='h-3 w-3' />
                                ) : (
                                  <Frown className='h-3 w-3' />
                                )}
                                {roleChanging === user._id
                                  ? '변경 중...'
                                  : user.role === 'admin'
                                  ? '관리자'
                                  : '사용자'}
                              </Badge>
                            </TableCell>
                            <TableCell className='text-center'>
                              <Badge
                                variant={
                                  user.isActive ? 'outline' : 'destructive'
                                }
                                className={'cursor-pointer'}
                                onClick={
                                  statusChanging === user._id
                                    ? undefined
                                    : () => handleStatusChange(user)
                                }
                                style={{
                                  opacity:
                                    statusChanging === user._id ? 0.6 : 1,
                                }}
                                title='클릭 시 상태가 변경됩니다.'
                              >
                                {statusChanging === user._id ? (
                                  <Loader2 className='h-3 w-3 animate-spin mr-1' />
                                ) : null}
                                {statusChanging === user._id
                                  ? '변경 중...'
                                  : user.isActive
                                  ? '활성'
                                  : '비활성'}
                              </Badge>
                            </TableCell>
                            <TableCell className='text-center text-muted-foreground'>
                              {user.visitCount}
                            </TableCell>
                            <TableCell className='text-center text-sm'>
                              <Badge variant='outline'>
                                {formatDateTime(user.createdAt)}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className='flex items-center justify-center gap-1'>
                                <Button
                                  variant='ghost'
                                  size='sm'
                                  title='상세정보'
                                  onClick={() => handleDetailClick(user)}
                                >
                                  <Eye className='h-4 w-4' />
                                </Button>
                                <Button
                                  variant='ghost'
                                  size='sm'
                                  title='삭제하기'
                                  onClick={() => handleDeleteClick(user)}
                                >
                                  <Trash2 className='h-4 w-4' />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={8}
                            className='text-center py-6 text-muted-foreground'
                          >
                            등록된 회원이 없습니다.
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
      <DialogUserDelete
        open={deleteDialogOpen}
        onOpenChange={handleDialogOpenChange}
        name={userToDelete?.name ?? ''}
        onDeleteConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
      />

      {/* 사용자 상세 다이얼로그 */}
      <DialogUserDetail
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
        user={selectedUser}
      />
    </>
  )
}
