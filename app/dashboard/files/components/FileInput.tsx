import React from 'react'

const FileInput = ({fileInputRef}) => {
  return (
    <div className=' flex  items-center justify-center pt-4 w-full py-2'>
      <input
        ref={fileInputRef}
         type="file" multiple
        className="flex justify-end   text-sm  text-slate-700 bg-blue-300 rounded-md
        file:mr-4 file:py-2 file:px-4 file:rounded-md
        file:border-0 file:text-sm file:font-semibold
        file:bg-blue-500 file:text-blue-100
        hover:file:bg-blue-600 cursor-pointer"
        />
    </div>
  )
}

export default FileInput
