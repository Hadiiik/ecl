import InputField from '@/app/files/ecl-dashboard/components/InputFiled'
import React, { useRef } from 'react'

interface CategoryInputParams {
  title: string;
  value: string | '';
  onChange: Function;
  avalibaleCategoriesArry: string[] | [''];
  selectOnChange: Function;
}

const CategoryInput = ({ title, value, onChange, avalibaleCategoriesArry, selectOnChange, key }: CategoryInputParams) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleAddValue = (e: React.ChangeEvent<HTMLSelectElement>) => {
    selectOnChange(e);
    if (inputRef.current) {
      inputRef.current.value = e.currentTarget.value;
    }
  };

  return (
    <>
      <div className='flex flex-row justify-between'>
        <InputField title={title} type='text' onChange={onChange} refrence={inputRef} value={value} key={key} />
        <select
          onChange={(e) => handleAddValue(e)}
          className='w-1/4 px-10 py-4 mt-8 text-gray-800 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-indigo-500 focus:ring focus:ring-indigo-200 h-2 m-4'
        >
          <option disabled selected>اختيار تصنيف</option>
          {avalibaleCategoriesArry?.map((category, index) => (
            <option key={index}>{category}</option>
          ))}
        </select>
      </div>
    </>
  );
};

export default CategoryInput;