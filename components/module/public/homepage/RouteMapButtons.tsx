import { Button } from '@/components/ui/button'
import { MapPinned, Image as ImageIcon } from 'lucide-react'


export default function RouteMapButtons() {
  return (
    <div className="w-full flex flex-col lg:flex-row gap-4 mt-6">
      {/* View Animated Route Button */}
      <Button
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
        className="w-full lg:w-1/2 px-8 py-10 text-lg font-semibold flex items-center justify-between gap-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 rounded-2xl shadow-lg text-[20px]"
      >
        <ImageIcon height={200} width={200} className="!w-8 !h-8 md:!w-8 md:!h-8" />
        Map Images
      </Button>
    </div>
  )
}
