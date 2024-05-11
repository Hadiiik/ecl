import React from 'react'

interface FileInputProps {
  fileInputRef: React.RefObject<HTMLInputElement>; // تحديد نوع البيانات الخاص بـ fileInputRef
}

const FileInput = ({ fileInputRef }: FileInputProps) => {
  return (
    <div className=' flex  items-center justify-center pt-4 w-full py-2'>
      <input type='file' ref={fileInputRef} className='hidden' />
    </div>
  );
}

export default FileInput;