import React, { useCallback, useEffect, useState } from 'react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { getAllStoresPage, deleteStore } from '@/lib/actions/store.action'
import {
  Loader2,
  Search,
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
  Eye,
  Trash2,
  MapPin,
  Pencil,
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
import { Badge } from '../ui/badge'
import DialogStoreDetail from '../dialog/dialog-store-detail'
import DialogStoreDelete from '../dialog/dialog-store-delete'
import DialogStoreAdd from '../dialog/dialog-store-add'
import DialogStoreEdit from '../dialog/dialog-store-edit'
import { toast } from 'sonner'

interface Store {
  _id: string
  storeId: string
  name: string
  address: string
  location: string
  latitude: string
  longitude: string
  parking: string
  since: string
  phone: string
  tags: string[]
  images: string[]
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

export default function AdminStores() {
  const [stores, setStores] = useState<Store[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')

  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [pagination, setPagination] = useState<PaginationInfo | null>(null)

  const [detailDialogOpen, setDetailDialogOpen] = useState(false)
  const [selectedStore, setSelectedStore] = useState<Store | null>(null)

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [storeToDelete, setStoreToDelete] = useState<Store | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [storeToEdit, setStoreToEdit] = useState<Store | null>(null)

  // 데이터 가져오기
  const fetchStores = useCallback(async () => {
    try {
      setIsLoading(true)

      const result = await getAllStoresPage(
        currentPage,
        pageSize,
        debouncedSearchTerm || undefined
      )

      if (result.success) {
        setStores(result.stores)
        setPagination(result.pagination!)
        setError(null)
      } else {
        setError(result.error || '데이터를 불러오는데 실패했습니다.')
      }
    } catch (err) {
      setError('데이터를 불러오는 중 오류가 발생했습니다.')
      console.error('매장목록 데이터 로딩 오류:', err)
    } finally {
      setIsLoading(false)
    }
  }, [currentPage, pageSize, debouncedSearchTerm])

  useEffect(() => {
    fetchStores()
  }, [fetchStores])

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

  const handleDeleteConfirm = async () => {
    if (!storeToDelete) return
    setIsDeleting(true)
    try {
      const result = await deleteStore(storeToDelete.storeId)
      if (result.success) {
        toast.success('매장 삭제가 완료되었습니다.')
        setStores((prev) => prev.filter((s) => s._id !== storeToDelete._id))
        setDeleteDialogOpen(false)
        setStoreToDelete(null)
      } else {
        toast.error('매장 삭제 중 오류가 발생했습니다.', {
          description: result.error,
        })
      }
    } catch {
      toast.error('매장 삭제 중 오류가 발생했습니다.', {
        description: '오류가 발생했습니다.',
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-xl font-gmarket text-green-700 flex items-center gap-2'>
          매장 관리({pagination?.totalCount || 0})
        </CardTitle>
        <CardDescription>
          스타벅스 매장을 관리하고 삭제할 수 있습니다.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          <div className='flex gap-3 flex-row justify-between items-end'>
            {/* 검색영역 */}
            <div className='relative w-full sm:w-80 flex gap-2'>
              <Search className='absolute left-3 top-2.5 h-4 w-4 text-muted-foreground' />
              <Input
                placeholder='매장명, 주소, 지역, 스토어ID, 태그'
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
            <div className='flex items-center gap-2'>
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

              {/* 스토어 추가하기 버튼 */}
              <Button
                onClick={() => setAddDialogOpen(true)}
                className='bg-green-700 hover:bg-green-800 h-9'
              >
                스토어 추가하기
              </Button>
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
              <Button onClick={fetchStores} variant='outline' className='mt-2'>
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
                      <TableHead>매장명</TableHead>
                      <TableHead>지역</TableHead>
                      <TableHead>주소</TableHead>
                      <TableHead className='text-center'>스토어ID</TableHead>
                      <TableHead>태그</TableHead>
                      <TableHead className='text-center'>오픈일</TableHead>
                      <TableHead className='text-center'>관리</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stores.length > 0 ? (
                      stores.map((store, index) => {
                        return (
                          <TableRow
                            key={store._id}
                            className='text-muted-foreground'
                          >
                            <TableCell className='text-center'>
                              {(currentPage - 1) * pageSize + index + 1}
                            </TableCell>
                            <TableCell className='font-medium'>
                              {store.name}
                            </TableCell>

                            <TableCell>
                              <div className='flex items-center gap-1'>
                                <MapPin className='h-3 w-3' />
                                {store.location}
                              </div>
                            </TableCell>
                            <TableCell className='max-w-xs truncate'>
                              {store.address}
                            </TableCell>
                            <TableCell className='text-center'>
                              <Badge variant='outline' className='text-xs'>
                                {store.storeId}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className='flex gap-1 overflow-hidden'>
                                {store.tags.map((tag, tagIndex) => (
                                  <Badge
                                    key={tagIndex}
                                    variant='outline'
                                    className='text-xs flex-shrink-0'
                                  >
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </TableCell>
                            <TableCell className='text-center'>
                              <Badge variant='secondary' className='text-xs'>
                                {store.since}
                              </Badge>
                            </TableCell>
                            <TableCell className='text-center'>
                              <div className='flex items-center justify-center gap-1'>
                                <Button
                                  variant='ghost'
                                  size='sm'
                                  title='상세정보'
                                  onClick={() => {
                                    setSelectedStore(store)
                                    setDetailDialogOpen(true)
                                  }}
                                >
                                  <Eye className='h-4 w-4' />
                                </Button>
                                <Button
                                  variant='ghost'
                                  size='sm'
                                  title='수정하기'
                                  onClick={() => {
                                    setStoreToEdit(store)
                                    setEditDialogOpen(true)
                                  }}
                                >
                                  <Pencil className='h-4 w-4' />
                                </Button>
                                <Button
                                  variant='ghost'
                                  size='sm'
                                  title='삭제하기'
                                  onClick={() => {
                                    setStoreToDelete(store)
                                    setDeleteDialogOpen(true)
                                  }}
                                >
                                  <Trash2 className='h-4 w-4' />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        )
                      })
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={10}
                          className='text-center py-6 text-muted-foreground'
                        >
                          등록된 매장이 없습니다.
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

      {/* 매장 상세 다이얼로그 */}
      <DialogStoreDetail
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
        store={selectedStore}
      />

      {/* 매장 삭제 다이얼로그 */}
      <DialogStoreDelete
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title={storeToDelete?.name}
        onDeleteConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
      />

      {/* 스토어 추가 다이얼로그 */}
      <DialogStoreAdd
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onSuccess={fetchStores}
      />

      {/* 스토어 수정 다이얼로그 */}
      <DialogStoreEdit
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        store={storeToEdit}
        onEditSuccess={fetchStores}
      />
    </Card>
  )
}
