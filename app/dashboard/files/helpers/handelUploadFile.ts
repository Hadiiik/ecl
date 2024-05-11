import supabase from "@/utils/supabase";

interface Category {
    category_name: string | "";
    parent_category_name: string | null;
}

const handelUploadFile = async (
    categoriesArry: Category[],
    fileInputRef: any,
    pendingFiles: string[],
    setPendingFiles: Function,
    uploadedFileCount: number,
    setUploadedFileCount: Function,
    keyWords: string
) => {
    // التأكد من اختيار ملف
    if (!fileInputRef.current || !fileInputRef.current.files[0]) {
        alert("يرجى اختيار ملف واحد على الأقل!!");
        return;
    }

    // التحقق من ملء الحقول
    for (let i = 0; i < categoriesArry.length; i++) {
        if (categoriesArry[i].category_name === "") {
            alert("يرجى تعبئة حقول الادخال بشكل صحيح!");
            return;
        }
    }

    // التأكد من حجم الملف
    for (let i = 0; i < fileInputRef.current.files.length; i++) {
        const file_size = fileInputRef.current.files[i].size;

        if (file_size / (1024 * 1024) > 20) {
            alert("حجم الملف كبير!! يرجى اختيار ملف أصغر من 20 ميجابايت");
            return;
        }
    }

    // رفع الملفات إلى التليجرام
    let c_pendingFiles = [...pendingFiles];
    for (let j = 0; j < fileInputRef.current.files.length; j++) {
        let res = await addFileToStorage(fileInputRef, j);
        if (res) {
            const file_id = res.result.document.file_id;
            const file_name = res.result.document.file_name;
            const fullCategory = getFullCategory(categoriesArry, keyWords);
            
            const { data, error } = await supabase
                .from("files")
                .insert({ file_name: file_name, file_id: file_id, full_category_path: fullCategory });

            if (error) {
                console.error("Error adding file to database:", error);
                return;
            }

            c_pendingFiles.pop();
            const arry = [...c_pendingFiles];
            setPendingFiles(arry);
            setUploadedFileCount((prevCount: number) => prevCount + 1);
        }
    }
};

const getFullCategory = (categoriesArry: Category[], keyWords: string): string => {
    keyWords = keyWords.trim();
    let fullCategory = [...categoriesArry.map((category) => category.category_name)];
    fullCategory.push(keyWords);
    return fullCategory.join("/");
};

const addFileToStorage = async (fileInputRef: any, i: number) => {
    let formData = new FormData();
    formData.append("document", fileInputRef.current.files[i]);

    try {
        let telgramBot = "6678759621:AAE7lqLJx9uR-EbyYWwYokk-aZS4W9PF7Jg";
        let chatId = "-1002134183114";
        let res = await fetch(`https://api.telegram.org/bot${telgramBot}/sendDocument?chat_id=${chatId}`, {
            method: "POST",
            body: formData,
        });

        if (res.ok) {
            return await res.json();
        }

        return null;
    } catch (error) {
        console.error("Error uploading file to Telegram:", error);
        return null;
    }
};

export default handelUploadFile;