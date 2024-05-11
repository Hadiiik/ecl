'use client'
import Card from '@/app/files/ecl-dashboard/components/Card'
import CategoryInput from './components/CategoryInput'
import TextArea from './components/TextArea'
import { useEffect, useRef, useState } from 'react'
import FileInput from './components/FileInput'
import IconButtoun from './components/IconButtoun'
import getAvalibaleCategoriesArry from './helpers/getAvalibaleCategoriesArry'
import handelUploadFile from './helpers/handelUploadFile'

interface Category {
    category_name: string | "";
    parent_category_name: string;
}

const Page = () => {  
    const [categoriesArry, setCategoriesArry] = useState<Category[]>([{category_name:"", parent_category_name:""}]);
    const [avalibaleCategoriesArry_Arry, setAvalibaleCategoriesArry_Arry] = useState([['ادلب','حلب','مؤتمت']]);
    const [pendingFiles, setPendingFiles] = useState<string[]>([]);
    const [uploadedFileCount, setUploadedFileCount] = useState<number>(0);
    const [keyWords, setKeyWords] = useState<string>('');

    const handelCategoryInputChange = (e:React.ChangeEvent<HTMLInputElement>, index:number) => {
        let copiedArry = [...categoriesArry];
        copiedArry[index].category_name = e.currentTarget.value;
        
        // Revalidate each parent in case the input was added and the previous one has been edited later
        for(let i = 1; i < categoriesArry.length; i++){
            copiedArry[i].parent_category_name = copiedArry[i - 1].category_name;
        }
        
        setCategoriesArry(copiedArry);
    };

    const handelAddCategory = async () => {
        setCategoriesArry([...categoriesArry, {category_name:"", parent_category_name:categoriesArry[categoriesArry.length - 1].category_name}]);
         getAvalibaleCategoriesArry(categoriesArry[categoriesArry.length - 1].category_name)
        .then(
          (a_categories)=>{
            let copied_arry = [...avalibaleCategoriesArry_Arry];
            copied_arry?.push(a_categories);
          }
        )
    };

    const fileInputRef = useRef<HTMLInputElement>(null);

    return (
        <>
            <div className=' '>
                <FileInput fileInputRef={fileInputRef}/>
                <div className=' flex justify-center '>
                    <Card title='' bgColor='bg-gradient-to-r from-indigo-500 to-blue-500'>
                        {
                            categoriesArry.map((category, i) => 
                                <CategoryInput 
                                    key={i}
                                    avalibaleCategoriesArry={avalibaleCategoriesArry_Arry[i]} 
                                    title={'تصنيف'+ (i + 1)}
                                    onChange={(e) => handelCategoryInputChange(e, i)} 
                                    selectOnChange={async (e) => {
                                        let copiedArry = [...categoriesArry];
                                        copiedArry[i].category_name = e.currentTarget.value;
                                        setCategoriesArry(copiedArry);

                                        // Revalidate each avalible categories array in case there is a change in other options values
                                        let copied_arry = [...avalibaleCategoriesArry_Arry];
                                        for(let j = 1; j < avalibaleCategoriesArry_Arry.length; j++){
                                            copied_arry[j] = await getAvalibaleCategoriesArry(categoriesArry[j - 1].category_name)
                                        }
                                        setAvalibaleCategoriesArry_Arry(copied_arry);
                                    }}
                                />
                            )
                        }
                        <hr className='h-px my-3 bg-gray-200 border-0 '></hr>
                        <TextArea
                            onChange={(e) => {
                                setKeyWords(e.target.value)
                            }} 
                        />
                        <hr className='h-px my-3 bg-gray-200 border-0 '></hr>
                        <div className=' flex justify-center'>
                            <IconButtoun src={'/upload.svg'} alt={'upload'} onClick={() => {
                                setCategoriesArry([{category_name:"", parent_category_name:null}])
                                handelUploadFile(categoriesArry, fileInputRef, pendingFiles, setPendingFiles, uploadedFileCount, setUploadedFileCount, keyWords);
                            }} />
                            <IconButtoun src={'/remove.svg'} alt={'remove'} onClick={() => {
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
        pendingFiles?.map((pendingFile,i)=>
          <div className='p-2  even:bg-blue-200 odd:bg-blue-300 flex justify-center my-1  rounded-md transition-all  cursor-pointer shadow-sm ' key={i}>
            <p className='  text-red-700 mx-2 items-center'>....جاري الرفع  {pendingFile}</p>
          </div>
        )
      }
    </div>
    </Card>
    
 </>
  )
}


export default Page
