import React from 'react';
const InputField = ({ title, type, value, onChange, placeholder, bgColor ,refrence}: any) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event); //empleminting passing the event parameter to inside 
  };

  return (
    <div className="mb-4 w-full ">
      <label className="block text-sm font-thin mb-2 text-white ">{title}</label>
      <input 
        ref={refrence}
        type={type}
        value={value}
        onChange={handleChange} 
        placeholder={placeholder}
        className={`w-full p-2 rounded bg-gray-200 text-black`}
      />
    </div>
  );
};

export default InputField;