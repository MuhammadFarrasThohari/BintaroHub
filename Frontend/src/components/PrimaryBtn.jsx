const PrimaryBtn = ({btnLabel, onClick, type}) => {
    return ( 
        <>
           <button
            onClick={onClick} 
            type={type}
            className="btn bg-allBlue text-base font-lsRegular text-allWhite btn-lg hover:bg-lightBlue">{btnLabel}</button>  
        </>
     );
}
 
export default PrimaryBtn;