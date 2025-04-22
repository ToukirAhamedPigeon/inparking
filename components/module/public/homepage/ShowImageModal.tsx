'use client';

import React, { useState } from 'react';
import { IImage } from '@/types';
import { Button } from '@/components/ui/button';
import { ImageIcon } from 'lucide-react';
import Modal from '@/components/custom/Modal';
import Fancybox from '@/components/custom/FancyBox';

export default function ShowImageModal({images, title}:{images:IImage[], title:string}){
    const [showImageModal, setShowImageModal] = useState(false);
    return (
        (images.length > 0) && (
        <>
        <div className="flex justify-center mt-4">
            <Button variant="info" onClick={() => setShowImageModal(true)} className="flex items-center w-full"><ImageIcon className="w-4 h-4 mr-2" /> {title}</Button>
        </div>
        <Modal
     isOpen={showImageModal}
     onClose={() => setShowImageModal(false)}
     title={title}
     bgColor="transparent"
   >
     <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
         <Fancybox
           mode="group"
           openIndex={0}
           slides={images.map((img) => ({src: img.imageUrl, title: img.imageTitle, description: img.imageDetail}))}
           onClose={() => setShowImageModal(false)}
         />
            </div>
        </Modal>
        </>)
    );
};