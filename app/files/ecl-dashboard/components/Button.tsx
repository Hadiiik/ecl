"use client"
import React, { MouseEventHandler } from 'react'
interface ButtonParams{
    title:string;
    color:string
    clickEvent:MouseEventHandler;
}
const Button = ({title,color,clickEvent}:ButtonParams) => {
  return (
    <div>
      <button className={`${color} text-white py-2   my-2 mx-1 px-4 rounded-md md:w-full `} onClick={clickEvent}>
        {title}
      </button>
    </div>
  )
}

export default Button
