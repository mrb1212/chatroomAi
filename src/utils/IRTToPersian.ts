const IRTToPersian = (IRT : number) => {

        var persianText = ""

        var million = Math.trunc(IRT/1000000)
        let numWithOutMillion = IRT - million*1000000
        let thousand = Math.trunc(numWithOutMillion/1000)
        let numWithOutThousand = IRT - million*1000000 - thousand*1000

        if(million !== 0){
            persianText =  million + "  " + "میلیون "
        }
        if(thousand !== 0){
            persianText = (persianText ? persianText : " " ) + "  " + thousand + " " + "هزار " 
        }
        if(numWithOutThousand !== 0){
            persianText = (persianText ? persianText : " ") + "  " + numWithOutThousand + "  " + "تومان"
        }else {
            persianText = (persianText ? persianText + " " + "تومان" : " ") 
        }

        return persianText
    
  };

  export default IRTToPersian