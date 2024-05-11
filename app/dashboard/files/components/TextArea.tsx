import React from 'react';

interface TextAreaProps {
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void; // تحديد نوع المعامل e
}

const TextArea = ({ onChange }: TextAreaProps) => {
  const handelChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e);
  };

  return (
    <div>
      <label className="block mb-2 text-sm font-medium text-white">وصف الملف</label>
      <textarea
        id="message"
        rows={2}
        className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
        placeholder="كلمات مفتاحية و وصف الملف"
        onChange={handelChange}
      ></textarea>
    </div>
  );
};

export default TextArea;