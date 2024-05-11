'use client'
import Card from '@/app/files/ecl-dashboard/components/Card'
import CategoryInput from './components/CategoryInput'
import TextArea from './components/TextArea'
import { useEffect, useRef, useState } from 'react'
import FileInput from './components/FileInput'
import IconButtoun from './components/IconButtoun'
import getAvalibaleCategoriesArry from './helpers/getAvalibaleCategoriesArry'
import handelUploadFile from './helpers/handelUploadFile'
interface Category{
  category_name:string|"",
  parent_category_name:string|null,
}
const Main = () => {  
  const [categoriesArry,setCategoriesArry] = useState<Category[]>([{category_name:"",parent_category_name:null}])
  const [avalibaleCategoriesArry_Arry,setAvalibaleCategoriesArry_Arry] = useState([['ادلب','حلب','مؤتمت']])
  const [pendingFiles,setPendingFiles] = useState<string[]>([])
  const [uploadedFileCount,setUploadedFileCount] = useState(0)
  const [keyWords,setKeyWords] = useState('')

  const handelCategoryInputChange = (e:React.ChangeEvent<HTMLInputElement>,index:number)=>{
    let copiedArry = [...categoriesArry];
    copiedArry[index].category_name = e.currentTarget.value;
    //revalidate each parent in case the input was added and the privous one has been edited later
    for(let i=1;i<categoriesArry.length;i++){
      copiedArry[i].parent_category_name = copiedArry[i-1].category_name;
    }
    setCategoriesArry(copiedArry);
  }
  const handelAddCategory = async ()=>{
    setCategoriesArry([...categoriesArry,{category_name:"",parent_category_name:categoriesArry[categoriesArry.length-1].category_name}]);
    const a_categories = await getAvalibaleCategoriesArry(categoriesArry[categoriesArry.length-1].category_name);
    setAvalibaleCategoriesArry_Arry([...avalibaleCategoriesArry_Arry,a_categories])
  }
  const fileInputRef = useRef(null)
  return (
<>

<div className=' '>
<FileInput fileInputRef={fileInputRef}/>
<div className=' flex justify-center '>
    <Card title='' bgColor='bg-gradient-to-r from-indigo-500 to-blue-500'>
        
        {
          categoriesArry.map((category,i)=><CategoryInput key={i}
           avalibaleCategoriesArry={avalibaleCategoriesArry_Arry[i]} 
           title={'تصنيف'+(i+1)}
            onChange={(e)=>handelCategoryInputChange(e,i)} 
            selectOnChange={async (e)=>{
              let copiedArry = [...categoriesArry];
              copiedArry[i].category_name = e.currentTarget.value;
              setCategoriesArry(copiedArry);
              //re valditae each avalibe categoreies arry in case there is a change in other options values:
              //looping for each ele in AvalibaleCategoriesArry_Arry and re set it if there where a change in the database
              //this maybe not efficent for many requests , 
              //NEED EFFICENCEY TESSSSSST !!!!
              let copied_arry = [...avalibaleCategoriesArry_Arry];
              for(let j=1;j<avalibaleCategoriesArry_Arry.length;j++){
                copied_arry[j] = await getAvalibaleCategoriesArry(categoriesArry[j-1].category_name)
              }
              setAvalibaleCategoriesArry_Arry(copied_arry);
            }}
             />)
        }
        <hr className='h-px my-3 bg-gray-200 border-0 '></hr>
        <TextArea
        onChange={
          (e)=>{
            setKeyWords(e.target.value)
          }
        } 
        />
        <hr className='h-px my-3 bg-gray-200 border-0 '></hr>
        <div className=' flex justify-center'>
          <IconButtoun src={'/upload.svg'} alt={'upload'} onClick={  ()=>{
            setCategoriesArry([{category_name:"",parent_category_name:null}])
            handelUploadFile(categoriesArry,fileInputRef,pendingFiles,setPendingFiles,uploadedFileCount,setUploadedFileCount,keyWords);
          }} />
          <IconButtoun src={'/remove.svg'} alt={'remove'} onClick={()=>{
            if(categoriesArry.length <=1)
              return;
            let copiedArry = [...categoriesArry];
            copiedArry.pop();
            setCategoriesArry(copiedArry);
          }} />
          <IconButtoun src={'/add.svg'} alt={'add'} onClick={handelAddCategory}/>
          
        </div>
    </Card>
</div>
</div>
<Card>
{uploadedFileCount>0&&<p className=' text-green-600 flex justify-center m-2  transition-all'>تم رفع {uploadedFileCount}  ملف بنجاح</p>}
  {pendingFiles.length>0&&<p className=' text-red-800 flex justify-center m-2 transition-all'>....جاري رفع {pendingFiles.length} ملف</p>}
  <div  className='  flex justify-center flex-col  my-2 max-h-64 overflow-y-scroll transition-all'>
      {
        pendingFiles?.map(pendingFile=>
          <div className='p-2  even:bg-blue-200 odd:bg-blue-300 flex justify-center my-1  rounded-md transition-all  cursor-pointer shadow-sm '>
            <p className='  text-red-700 mx-2 items-center'>....جاري الرفع  {pendingFile}</p>
          </div>
        )
      }
    </div>
    </Card>
    
 </>
  )
}


export default Main
