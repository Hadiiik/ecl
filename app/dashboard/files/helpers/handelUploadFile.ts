import supabase from "@/utils/supabase";

interface Category {
    category_name: string | "";
    parent_category_name: string | null;
}

const handelUploadFile = async (
    categoriesArry: Category[],
    fileInputRef: React.RefObject<HTMLInputElement>, // تحديد نوع المتغير
    pendingFiles: string[],
    setPendingFiles: React.Dispatch<React.SetStateAction<string[]>>, // تحديد نوع المتغير
    uploadedFileCount: number,
    setUploadedFileCount: React.Dispatch<React.SetStateAction<number>>, // تحديد نوع المتغير
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
    if (!fileInputRef.current?.files[0]) {
        alert("يرجى اختيار ملف واحد على الأقل!!");
        return;
    }

    // تحميل الفئات إلى قاعدة البيانات
    handelUploadCategory(categoriesArry);

    // معالجة مسار الفئة الكاملة
    keyWords = keyWords.trim();
    let fullCategory = categoriesArry.map(category => category.category_name);
    fullCategory.push(keyWords);
    const fullCategoryString = fullCategory.join('/');

    // تحميل الملفات إلى تلغرام وحفظ المعلومات في قاعدة البيانات
    for (let j = 0; j < fileInputRef.current.files.length; j++) {
        const res = await addFileToStorage(fileInputRef, j);
        if (res.result && res.result.document) {
            const file_id = res.result.document.file_id;
            const file_name = res.result.document.file_name;

            // إضافة معرف الملف واسم الملف إلى قاعدة البيانات
            const { data, error } = await supabase
                .from('files')
                .insert({ 'file_name': file_name, 'file_id': file_id, 'full_category_path': fullCategoryString });

            if (error) {
                console.error('Error adding file to database:', error);
                return;
            }

            // تحديث قائمة الملفات المعلقة وعدد الملفات المحملة
            const arry = [...pendingFiles];
            arry.pop();
            setPendingFiles(arry);
            setUploadedFileCount(prevCount => prevCount + 1);
        } else {
            console.error('Error uploading file:', res);
        }
    }
}

// تحميل الفئات إلى قاعدة البيانات
const handelUploadCategory = async (categoriesArry: Category[]) => {
    try {
        const promises = categoriesArry.map(async category => {
            const { data, error } = await supabase
                .from('categories')
                .insert({ 'category_name': category.category_name, 'parent_category_name': category.parent_category_name });

            if (error) {
                console.error('Error adding category to database:', error);
                throw new Error(error.message);
            }

            return data;
        });

        await Promise.all(promises);
    } catch (error) {
        console.error('Error adding rows:', error);
    }
}

// تحميل الملفات إلى تلغرام
const addFileToStorage = async (fileInputRef: React.RefObject<HTMLInputElement>, i: number) => {
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