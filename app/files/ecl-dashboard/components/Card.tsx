import { ChildProps } from 'postcss';
import React from 'react';
interface CardParams{
    children:React.ReactNode;
    bgColor:string|'';
    title:string|'';
}
const Card = ({ children, bgColor, title }: CardParams) => {
  return (
    <div className="w-full p-2 flex justify-center mx-3 drop-shadow-md md:mx-5 lg:m-1 transition-all">
      <div className={`  ${bgColor}   rounded-lg p-4 flex flex-col items-center w-auto  justify-center`}>
        <p className="text-lg font-bold mb-4">{title}</p>
        <div className="flex-grow">{children}</div>
      </div>
    </div>
  );
};

export default Card;