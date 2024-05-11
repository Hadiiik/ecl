import supabase from "@/utils/supabase";

interface Category {
    category_name: string | "";
    parent_category_name: string | null;
}

const handelUploadFile = async (
    categoriesArry: Category[],
    fileInputRef: React.RefObject<HTMLInputElement>,
    pendingFiles: string[],
    setPendingFiles: React.Dispatch<React.SetStateAction<string[]>>,
    uploadedFileCount: number,
    setUploadedFileCount: React.Dispatch<React.SetStateAction<number>>,
    keyWords: string
) => {
    // التأكد من ملء جميع الحقول
    for (let i = 0; i < categoriesArry.length; i++) {
        if (categoriesArry[i].category_name === "") {
            alert('يرجى تعبئة جميع حقول الإدخال بشكل صحيح!');
            return;
        }
    }

    // التأكد من اختيار ملف
    if (!fileInputRef.current || !fileInputRef.current.files[0]) {
        alert("يرجى اختيار ملف واحد على الأقل!!");
        return;
    }

    handelUploadCategory(categoriesArry);

    // إعداد مسار الفئة الكامل
    keyWords = keyWords.trim();
    let fullCategory = [...categoriesArry.map(category => category.category_name)];
    fullCategory.push(keyWords);
    fullCategory = fullCategory.join('/');

    // تحديث قائمة الملفات المعلقة
    let c_pendingFiles = [...pendingFiles];
    for (let i = 0; i < fileInputRef.current.files.length; i++) {
        const file_size = fileInputRef.current.files[i].size;

        if (file_size / (1024 * 1024) > 20) {
            alert('حجم الملف كبير!! يرجى اختيار ملف أصغر من 20 ميجا بايت');
            return;
        }
        c_pendingFiles.unshift(fileInputRef.current.files[i].name);
    }
    setPendingFiles(c_pendingFiles);

    // رفع الملفات إلى تيليغرام
    for (let j = 0; j < fileInputRef.current.files.length; j++) {
        let res = await addFileToStorage(fileInputRef, j);
        const file_id = res.result.document.file_id;
        const file_name = res.result.document.file_name;

        // إضافة معرف الملف مع نفس السلسلة الكاملة للفئة إلى supabase
        const { data, error } = await supabase
            .from('files')
            .insert({ 'file_name': file_name, 'file_id': file_id, 'full_category_path': fullCategory });

        c_pendingFiles.pop();
        const arry = [...c_pendingFiles];
        setPendingFiles(arry);
        setUploadedFileCount(prev => prev + 1);
    }
};

const handelUploadCategory = async (categoriesArry: Category[]) => {
    try {
        const promises = categoriesArry.map(async category => {
            const { data, error } = await supabase
                .from('categories')
                .insert({ 'category_name': category.category_name, 'parent_category_name': category.parent_category_name });

            if (error) {
                throw new Error(error.message);
            }
            return data;
        });

        const results = await Promise.all(promises);
    } catch (error) {
        console.error('Error adding rows:', error);
    }
};

const addFileToStorage = async (fileInputRef: React.RefObject<HTMLInputElement>, i: number) => {
    let formData = new FormData();
    formData.append('document', fileInputRef.current.files[i]);

    try {
        let telegramBot = '6678759621:AAE7lqLJx9uR-EbyYWwYokk-aZS4W9PF7Jg';
        let chatId = '-1002134183114';
        let res = await fetch(`https://api.telegram.org/bot${telegramBot}/sendDocument?chat_id=${chatId}`, {
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
};

export default handelUploadFile;