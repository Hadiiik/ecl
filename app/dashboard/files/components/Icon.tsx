import Image from 'next/image'


const Icon = ({src,alt}:any) => {
  return (
    <Image width={30} height={30} src={src} alt={alt} className=' cursor-pointer'  />
  )
}

export default Icon
