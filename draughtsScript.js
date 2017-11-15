
const tileAmt = 8;
let boardArr = [];

function createBoardArr(){

  for(var i = tileAmt; i >= 1; i--){

    for(var j = 0; j < tileAmt; j++){

      const tmpObj = new Object;
      tmpObj.empty = true;
      tmpObj.x = i;
      tmpObj.y = String.fromCharCode(65+j);
      tmpObj.tileLocation = tmpObj.x + tmpObj.y

      boardArr.push(tmpObj);
    }
  }

}

(function init(){
  createBoardArr();

})()

console.log(boardArr);
