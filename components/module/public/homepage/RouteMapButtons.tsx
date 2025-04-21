import Fancybox from '@/components/custom/FancyBox'
import Modal from '@/components/custom/Modal'
import { Button } from '@/components/ui/button'
import { IImage } from '@/types'
import { Image as ImageIcon } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'


export default function RouteMapButtons({routeImages}:{routeImages:IImage[]}) {
    const [showRouteModal, setShowRouteModal] = useState(false)
    const [showImageModal, setShowImageModal] = useState(false)
  return (
    <>
    <div className="w-full flex flex-col lg:flex-row gap-4 mt-6">
      {/* View Animated Route Button */}
      <Button
        onClick={() => setShowRouteModal(true)}
        className="w-full lg:w-1/2 px-6 py-10 text-lg flex items-center justify-between gap-3 bg-gradient-to-r from-[#F2C94C] to-[#F2994A]  hover:from-[#F2C94C] hover:to-[#F2994A] rounded-2xl shadow-lg text-white font-semibold text-[20px]"
      >
        <img
          src="/assets/pin.gif"
          alt="Car animation"
          className="w-14 h-14 md:w-14 md:h-14"
        />
        Animated Route
      </Button>

      {/* View Map Images Button */}
      <Button
        onClick={() => setShowImageModal(true)}
        className="w-full lg:w-1/2 px-8 py-10 text-lg font-semibold flex items-center justify-between gap-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 rounded-2xl shadow-lg text-[20px]"
      >
        <ImageIcon height={200} width={200} className="!w-8 !h-8 md:!w-8 md:!h-8" />
        Map Images
      </Button>
    </div>
     <Modal
     isOpen={showRouteModal}
     onClose={() => setShowRouteModal(false)}
     title="Animated Route"
   >
     <div className="flex justify-center items-center">
       <Image
         src="/assets/pin.gif"
         alt="Car Animation"
         className="w-64 h-auto"
         width={256}
         height={256}
         priority
       />
     </div>
   </Modal>

   {/* Image Gallery Modal */}
   <Modal
     isOpen={showImageModal}
     onClose={() => setShowImageModal(false)}
     title="Route Gallery"
   >
     <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
         <Fancybox
           mode="group"
           openIndex={0}
           slides={routeImages.map((img) => ({src: img.imageUrl, title: img.imageTitle, description: img.imageDetail}))}
           onClose={() => setShowImageModal(false)}
         />
            </div>
        </Modal>
        </>
        )
}
