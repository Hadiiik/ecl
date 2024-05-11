function generateArrayIdFromArray(stringsArray:string[]) {
    // يمكنك استخدام أي طريقة تحويل القيم إلى سلسلة واحدة هنا، مثلاً join()
    const arrayString = stringsArray.join(',');
    // يمكنك استخدام دالة تجزئة النصوص (hash function) لتوليد ID فريدة
    const arrayId = hashString(arrayString);
    return arrayId;
}

// دالة تجزئة النصوص لتحويل النص إلى رقم هش فريد
function hashString(str:string) {
    let hash = 0;
    if (str.length == 0) return hash;
    for (let i = 0; i < str.length; i++) {
        let char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // تحسين عملية التجزئة لتجنب أي تداخل بين الأرقام
    }
    return hash.toString();
}

export default generateArrayIdFromArray;