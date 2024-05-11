import supabase from "@/utils/supabase";

const getAvalibaleCategoriesArry = async (parent_category_name: string): string[] =>{
    const { data, error } = await supabase
        .from('categories')
        .select('category_name')
        .eq('parent_category_name', parent_category_name);
        
    if (error) {
        console.log(error);
        return ;
    }

    if (data && data.length > 0) {
        return data.map((entry: any) => entry.category_name);
    }

    return [];
}
export default getAvalibaleCategoriesArry;