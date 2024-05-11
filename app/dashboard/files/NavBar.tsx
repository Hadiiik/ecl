import Link from 'next/link'
import React from 'react'
import Icon from './components/Icon'

const NavBar = () => {
  return (
    <nav className=' flex justify-between p-3 bg-blue-800  '>
        <h1 className=' text-white font-extrabold'>ECLlogo</h1>
        <div className=' flex justify-center flex-row-reverse '>
        <div className=' flex flex-row-reverse px-3'>
          <Icon src='/home.svg'/>
          <Link href={'/'} className='hidden md:flex hover:font-bold py-2 px-4  transition-all'>الصفحة الرئيسية</Link>
          </div>
        </div>
    </nav>
  )
}

export default NavBar
