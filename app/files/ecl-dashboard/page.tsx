'use client'
import supabase from '@/utils/supabase'
import  { useState } from 'react'
import FileUploadForm from './components/FileUploadForm'

supabase

const page = () => {

  return (
    <>
    
    <FileUploadForm/>
    </>
  )
}

export default page
