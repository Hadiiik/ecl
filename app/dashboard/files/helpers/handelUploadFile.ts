import supabase from "@/utils/supabase";

interface Category{
    category_name:string|"",
    parent_category_name:string|null,
  }
const handelUploadFile =  async (categoriesArry:Category[],fileInputRef: any ,pendingFiles:string[],setPendingFiles:Function,uploadedFileCount:number,setUploadedFileCount:Function,keyWords:string)=>{
    //checking if any field is empty
    for(let i=0;i<categoriesArry.length;i++){
        if(categoriesArry[i].category_name==''){
            alert('يرجى تعبئة حقول الادخال بشكل صحيح!')
            return
        }
    }
    if(!fileInputRef.current.files[0]){
      alert("يرجى اختيار ملف واحد على الأقل !!")
      return;
    }
    handelUploadCategory(categoriesArry);
    //full category path:
    keyWords = keyWords.trim();
    
    console.log(keyWords)
    let fullCategory = [...categoriesArry];
    fullCategory = [...fullCategory.map(category=>category.category_name)];
    fullCategory.push(keyWords)
    fullCategory = fullCategory.join('/');
    console.log('full categ ')
    console.log(fullCategory);

    //seting pending files arry
    let c_pendingFiles = [...pendingFiles];
    for(let i=0;i<fileInputRef.current.files.length;i++){
        const file_size = fileInputRef.current.files[i].size;
        
        if(file_size/(1024*1024)>20){
          alert('حجم الملف كبير!! يرجى اختيار ملف اصغر من 20 ميجا بايت');
          return;
        }
        c_pendingFiles.unshift(fileInputRef.current.files[i].name);
    }
    setPendingFiles(c_pendingFiles)

    //upload files to telegram
    for(let j=0;j<fileInputRef.current.files.length;j++){
        let res = await addFileToStorage(fileInputRef,j);
        const file_id = res.result.document.file_id;
        const file_name = res.result.document.file_name;
        // add file id with the same full category string to supabase
        const {data,error} = await supabase
        .from('files')
        .insert({'file_name':file_name,'file_id':file_id,'full_category_path':fullCategory})
        c_pendingFiles.pop();
        //setpnedingfiles dosent woork derictly eith c_pendingfiles but it work with this arry copy!
        const arry = [...c_pendingFiles];
        setPendingFiles(arry);
        setUploadedFileCount(pre=>pre+1);
    }
    
}


const handelUploadCategory = async (categoriesArry:Category[])=>{
    try {
        const promises = categoriesArry.map(async category => {
            const { data, error } = await supabase
                .from('categories')
                .insert({'category_name':category.category_name,'parent_category_name':category.parent_category_name});
            if (error) {
                throw new Error(error.message);
            }
            return data;
        });

        const results = await Promise.all(promises);
    } catch (error) {
        console.error('Error adding rows:', error);
    }
}
const addFileToStorage = async (fileInputRef:any,i:number) => {
    let formData = new FormData();
    formData.append('document', fileInputRef.current.files[i]);
    
    try {
      let telgramBot = '6678759621:AAE7lqLJx9uR-EbyYWwYokk-aZS4W9PF7Jg';
      let chatId = '-1002134183114';
      let res = await fetch(`https://api.telegram.org/bot${telgramBot}/sendDocument?chat_id=${chatId}`, {
        method: "POST",
        body: formData
      });
      
      if (res.ok) {
        return await res.json(); 
      }
      
      return null;
    } catch (error) {
      return error;
    }
  }

export default handelUploadFile;