'use client'
import React, { use, useEffect, useRef, useState } from 'react'
import Card from './Card'
import InputFiled from './InputFiled'
import Button from './Button';
import supabase from '@/utils/supabase';
import Image from 'next/image';

//notice the diffrince betwen fullCategoryPath & FullCategoryPath
//nothing important just dont want to rewrite some stuff
interface category{
  name:string;
  parentCategoryName:string|null;
}


const FileUploadForm = () => {
  const [categoriesArry,setCategoriesArry]=useState<category[]>([{name:"",parentCategoryName:null}])
  const [avalibaleCategoriesArry,setavAlibaleCategoriesArry] = useState<string[]>([''])
  const [FullCategoryPath,setFullCategoryPath]=useState('')
  const [formError,setFormError] = useState(true);
  useEffect(()=>{
    //fetch categories:
    const getCtegoriesArry = async ()=>{
      const {data,error} = await supabase
      .from('category')
      .select('name')
      if(data){
        
        const ctegories= data.map(a=>a.name);
        setavAlibaleCategoriesArry(ctegories)
      }
      console.log('done fetching avvialble cats')

    }
    getCtegoriesArry();
    
  },[])
  //functions:

  const handelAddCategory = ()=>{
    const emptyCategory:category={name:'',parentCategoryName:categoriesArry[categoriesArry.length-1].name};
    const copiedArry =[...categoriesArry];
    copiedArry.push(emptyCategory);
    setCategoriesArry(copiedArry);
    console.log(categoriesArry);
  }
const checkFormError = ()=>{
  console.log('checking for errors')
  for(let i=0;i<categoriesArry.length;i++){
    if(categoriesArry[i].name==''){
      setFormError(true);
      console.log(categoriesArry[i]);
      return;
    }else{
      setFormError(false);
    }
  }
}

  const handelAddFile = async () => {
    /*if(formError){
      alert('error')
      console.log('error')
      return
    }*/
    //adding the category sequense
    try {
        const promises = categoriesArry.map(async category => {
            const { data, error } = await supabase
                .from('category')
                .insert({'name':category.name});
            if (error) {
                throw new Error(error.message);
            }
            return data;
        });

        const results = await Promise.all(promises);
        console.log(results);
    } catch (error) {
        console.error('Error adding rows:', error);
    }
    setFileName('');
    setCategoriesArry([{parentCategoryName:null,name:""}]);
    inputRef.current[0].value='';
    if(fileInputRef.current.value)
      fileInputRef.current.value = '';
    const addFileToStorage = async () => {
      let formData = new FormData();
      formData.append('document', fileInputRef.current.files[0]);
      
      try {
        let telgramBot = '';
        let chatId = '';
        let res = await fetch(`https://api.telegram.org/bot${telgramBot}/sendDocument?chat_id=${chatId}`, {
          method: "POST",
          body: formData
        });
        
        if (res.ok) {
          setUploadedFilesCount(uploadedFilesCount+1);
          return await res.json(); // إضافة القوسين لاستدعاء الدالة res.json()
        }
        
        return null;
      } catch (error) {
        return error;
      }
    }
    addFileToStorage()
      .then(async res => {
        if(res.result&&res.result.document){
          const {data,error} = await supabase
          .from('files')
          .insert({'file_name':res.result.document.file_name,'FullCategoryPath':FullCategoryPath,'file_id':res.result.document.file_id})
        }
      })
      .catch(error => console.error(error)); // يمكنك استخدام .catch() للتعامل مع الأخطاء
}
//use efect to handel forming the path of the categories each time the addfile is triiged
//avoided using it inside of add file because the setfullpath was being delead
useEffect(()=>{
  let copiedArry = [...categoriesArry];
  copiedArry = copiedArry.map(category=>category.name);
  const ctegoryPath = copiedArry.join('/');
  setFullCategoryPath(ctegoryPath);
  console.log(FullCategoryPath);
},[handelAddFile])


  const inputRef = useRef([]);
  const handelAddValue = (e:React.ChangeEvent<HTMLInputElement>,index:number)=>{
    const copiedArry = [...categoriesArry];
    copiedArry[index].name=e.currentTarget.value;
    console.log(copiedArry[index].name);
    setCategoriesArry(copiedArry);
    inputRef.current[index].value=e.currentTarget.value;
    
  }

  const handelDelete = ()=>{
    if(categoriesArry.length>1){
    const copiedArry = [...categoriesArry];
    copiedArry.pop();
    setCategoriesArry(copiedArry);
    console.log(copiedArry);
    }

  }

// adding the file methods:
  const[fileName,setFileName]=useState("")
  const fileInputRef = useRef()
  const handelSetFileName= (e:React.ChangeEvent<HTMLInputElement>)=>{
    const path = e.currentTarget.value;
    setFileName(path.substring(path.lastIndexOf('\\')+1));
    
  }


//uploaded files count
const [uploadedFilesCount,setUploadedFilesCount] = useState(0);


  return (
    <>
    <Card title='' bgColor='' >
      
    <div className='  flex  items-center justify-center pt-4 w-full'>
        <input
         type="file"
        className="flex justify-end   text-sm  text-slate-700 bg-blue-300 rounded-md
        file:mr-4 file:py-2 file:px-4 file:rounded-md
        file:border-0 file:text-sm file:font-semibold
        file:bg-blue-500 file:text-blue-100
        hover:file:bg-blue-600 cursor-pointer"
        onChange={(e)=>handelSetFileName(e)}
        ref={fileInputRef}
        />
     </div>

    {fileName!=""&& <InputFiled title='اسم الملف' value={fileName} onChange={(e:React.ChangeEvent<HTMLInputElement>)=>{
      const name = e.currentTarget.value;
      setFileName(name);
    }}/>}



    </Card>


    <div className='   w-full flex flex-col md:flex-row  items-center justify-around '>
      
      <Card title='اضافة ملف:' bgColor='bg-gray-400'>
      
    

        {
          categoriesArry.map(
            (category:category,index)=> <div key={index} className='flex flex-row items-center justify-around'>
              <InputFiled  refrence={(element) => inputRef.current[index] = element}  title={`تصنيف ${index+1}`} 
              onChange={(e:React.ChangeEvent<HTMLInputElement>)=>{
                
                const copiedArry =[...categoriesArry];
                copiedArry[index].name=e.currentTarget.value;
                setCategoriesArry(copiedArry);
              }}
                />
                <select onChange={(e)=>handelAddValue(e,index)} className=' block w-1/4 px-10 py-4 mt-2 text-gray-800 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-indigo-500 focus:ring focus:ring-indigo-200 h-2 '>
                  <option disabled selected>اختيار تصنيف</option>
                  {
                    avalibaleCategoriesArry?.map((category,op_index)=><option key={op_index} value={category} >{category}</option>)
                  }
                  
                </select>
              </div>
          )
        }
        <div className='flex   flex-col  sm:flex-row items-center justify-around'>
         <div className='flex '> 
        <Image  width={30} height={30} src={'/delete.svg'} alt='delete' className=' cursor-pointer mx-4' onClick={handelDelete}/>
        <Button title='اضافة تصنيف' color='bg-blue-400' clickEvent={handelAddCategory}/>
        </div>
        
        <Button title='اضافة ملف' color='bg-blue-500' clickEvent={()=>{
          checkFormError();
          handelAddFile();
        }} />
        
        </div>
      </Card>
      
    </div>
    <div className=' flex  justify-center p-2'>
        {uploadedFilesCount>0&&<p className=' text-green-500 hover:text-green-600'>{` تم رفع بنجاح ${uploadedFilesCount} ملفات`}</p>}
      </div>
    </>
  )
}

export default FileUploadForm
