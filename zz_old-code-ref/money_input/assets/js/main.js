$( document ).ready(function() {
    let inputCount = 0;
    let dollarInputs = [];
    let currentAmount = $(".price_in").val();
    
    let parseInput = () =>{
        if(dollarInputs.length <= 3){
            let tempInputs = dollarInputs.slice();
            while(tempInputs.length < 3){
                tempInputs.unshift("0");
            }
            let tempStr = tempInputs.join("");
            let moneyStr = tempStr.substr(0,1) + "." + tempStr.substr(1, tempStr.length);
            $(".price_in").val(moneyStr);

        }else if (dollarInputs.length >3){
            let tempStr = dollarInputs.join("");
            let moneyStr = tempStr.substr(0,tempStr.length-2) + "." + tempStr.substr(tempStr.length-2, tempStr.length);
            
            $(".price_in").val(moneyStr);
        }
    }
    $(".price_in").keypress(e =>{ 
        console.log(e.which);
        e.preventDefault();  
        if ((e.which <= 57 && e.which >= 48) || e.which <= 105 && e.which >=96){
            dollarInputs.push(e.originalEvent.key);
            parseInput();
        }
    });
    $(".price_in").keydown(e =>{
        if (e.which === 8){
            dollarInputs.pop();
            parseInput();
            return false;
        } 
    });
});