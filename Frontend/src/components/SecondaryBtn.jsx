const SecondaryBtn = ({btnLabel, onClick, type}) => {
    return ( 
        <>
           <button
            onClick={onClick} 
            type={type}
            className="btn bg-allWhite hover:bg-blue-200 hover:text-allBlue text-base font-lsRegular text-allBlack btn-lg">{btnLabel}</button>  
        </>
     );
}
 
export default SecondaryBtn;