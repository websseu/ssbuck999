import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Separator } from '../ui/separator'
import { DialogDescription } from '@radix-ui/react-dialog'
import {
  MapPin,
  Phone,
  Calendar,
  Tag,
  Image as ImageIcon,
  Hash,
  Building,
  Navigation,
  Send,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../ui/dialog'
import Image from 'next/image'

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

interface DialogStoreDetailProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  store: Store | null
}

export default function DialogStoreDetail({
  open,
  onOpenChange,
  store,
}: DialogStoreDetailProps) {
  if (!store) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-2xl'>
        <DialogHeader className='border-b pb-4'>
          <DialogTitle className='flex items-center font-black text-green-700 justify-center gap-1 text-xl'>
            <Building className='h-5 w-5' />
            매장 정보
          </DialogTitle>
          <DialogDescription className='text-center text-sm text-muted-foreground'>
            매장 상세 정보입니다.
          </DialogDescription>
        </DialogHeader>
        <div className='space-y-2 text-sm max-h-[60vh] overflow-y-auto'>
          {/* 매장명 */}
          <div className='flex items-start gap-2'>
            <Building className='h-4 w-4 text-green-600 mt-0.5 flex-shrink-0' />
            <div className='min-w-0 flex-1'>
              <span className='font-medium text-gray-700'>매장명:</span>
              <span className='ml-2 text-gray-900 font-semibold'>
                {store.name}
              </span>
            </div>
          </div>

          <Separator />

          {/* 스토어ID */}
          <div className='flex items-start gap-2'>
            <Hash className='h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0' />
            <div className='min-w-0 flex-1 flex items-center'>
              <span className='font-medium text-gray-700'>스토어ID:</span>
              <Badge variant='outline' className='ml-2'>
                {store.storeId}
              </Badge>
            </div>
          </div>

          <Separator />

          {/* 주소 */}
          <div className='flex items-start gap-2'>
            <MapPin className='h-4 w-4 text-red-600 mt-0.5 flex-shrink-0' />
            <div className='min-w-0 flex-1'>
              <span className='font-medium text-gray-700'>주소:</span>
              <span className='ml-2 text-gray-900 break-words leading-6'>
                {store.address}
              </span>
            </div>
          </div>

          <Separator />

          {/* 지역 */}
          <div className='flex items-start gap-2'>
            <MapPin className='h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0' />
            <div className='min-w-0 flex-1'>
              <span className='font-medium text-gray-700'>지역:</span>
              <span className='ml-2 text-gray-900'>{store.location}</span>
            </div>
          </div>

          <Separator />

          {/* 좌표 */}
          <div className='flex items-start gap-2'>
            <Navigation className='h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0' />
            <div className='min-w-0 flex-1 leading-6'>
              <span className='font-medium text-gray-700'>좌표:</span>
              <div className='text-gray-900'>
                <div>위도: {store.latitude}</div>
                <div>경도: {store.longitude}</div>
              </div>
            </div>
          </div>

          <Separator />

          {/* 주차 정보 */}
          <div className='flex items-start gap-2'>
            <MapPin className='h-4 w-4 text-green-600 mt-0.5 flex-shrink-0' />
            <div className='min-w-0 flex-1'>
              <span className='font-medium text-gray-700'>주차 정보:</span>
              <span className='ml-2 text-gray-900 break-words leading-6'>
                {store.parking}
              </span>
            </div>
          </div>

          <Separator />

          {/* 오픈일 */}
          <div className='flex items-start gap-2'>
            <Calendar className='h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0' />
            <div className='min-w-0 flex-1'>
              <span className='font-medium text-gray-700'>오픈일:</span>
              <Badge variant='secondary' className='ml-2'>
                {store.since}
              </Badge>
            </div>
          </div>

          <Separator />

          {/* 전화번호 */}
          <div className='flex items-start gap-2'>
            <Phone className='h-4 w-4 text-green-600 mt-0.5 flex-shrink-0' />
            <div className='min-w-0 flex-1'>
              <span className='font-medium text-gray-700'>전화번호:</span>
              <span className='ml-2 text-gray-900'>{store.phone}</span>
            </div>
          </div>

          <Separator />

          {/* 태그 */}
          {store.tags && store.tags.length > 0 && (
            <>
              <div className='flex items-start gap-2'>
                <Tag className='h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0' />
                <div className='min-w-0 flex-1 flex items-center'>
                  <span className='font-medium text-gray-700'>태그:</span>
                  <div className='ml-2 flex flex-wrap gap-1'>
                    {store.tags.map((tag, index) => (
                      <Badge key={index} variant='outline' className='text-xs'>
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* 이미지 */}
          {store.images && store.images.length > 0 && (
            <>
              <div className='flex items-start gap-2'>
                <ImageIcon className='h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0' />
                <div className='min-w-0 flex-1'>
                  <span className='font-medium text-gray-700'>이미지:</span>
                  <div className='text-gray-900'>
                    <div className='mt-2 grid grid-cols-2 gap-2'>
                      {store.images.map((image, index) => (
                        <div
                          key={index}
                          className='relative aspect-video bg-gray-100 rounded overflow-hidden'
                        >
                          <Image
                            src={image}
                            alt={`${store.name} 이미지 ${index + 1}`}
                            className='w-full h-full object-cover'
                            width={400}
                            height={300}
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.style.display = 'none'
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* 생성일 */}
          <div className='flex items-start gap-2'>
            <Calendar className='h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0' />
            <div className='min-w-0 flex-1'>
              <span className='font-medium text-gray-700'>생성일:</span>
              <span className='ml-2 text-gray-900'>
                {new Date(store.createdAt).toLocaleDateString()}{' '}
                {new Date(store.createdAt).toLocaleTimeString()}
              </span>
            </div>
          </div>

          <Separator />

          {/* 수정일 */}
          <div className='flex items-start gap-2'>
            <Calendar className='h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0' />
            <div className='min-w-0 flex-1'>
              <span className='font-medium text-gray-700'>수정일:</span>
              <span className='ml-2 text-gray-900'>
                {new Date(store.updatedAt).toLocaleDateString()}{' '}
                {new Date(store.updatedAt).toLocaleTimeString()}
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
