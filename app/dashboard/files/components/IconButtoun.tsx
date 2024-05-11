import Icon from "./Icon";

const IconButtoun = ({onClick,src,alt}:any)=>{
    return(
      <button  className={' bg-violet-300 shadow-md p-2 rounded-md mx-2 hover:bg-violet-500 transition-colors'} onClick={onClick} >
        <Icon src={src} alt={alt}/>
      </button>
    );
  }
export default IconButtoun;