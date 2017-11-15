
const tileAmt = 8;
const initPieceAmt = 12;
let runner;

//Arrays
let boardArr = [];
let lightArr = [];
let darkArr = [];

function createBoardArr(){
  for(var i = tileAmt; i >= 1; i--){
    for(var j = 1; j <= tileAmt; j++){
      const tmpObj = new Object;
      tmpObj.val = "tile";
      tmpObj.empty = true;
      tmpObj.x = i;
      tmpObj.y = String.fromCharCode(64+j);
      tmpObj.tileLocation = tmpObj.x + tmpObj.y;
      if(i % 2 == 0){
        if(j % 2 == 0){ tmpObj.color = "dark";}
        else{ tmpObj.color = "light";}
      }else{
        if(j % 2 !== 0){ tmpObj.color = "dark";}
        else{ tmpObj.color = "light";}
      }
      if(tmpObj.color == "dark"){tmpObj.legalPlay = true;}
      else{tmpObj.legalPlay = false;}
      boardArr.push(tmpObj);
    }
  }
}

function createColorArr(color){

  if(color == 'light'){ runner = boardArr.length-1}
  else{ runner = 0;}
  for(var i = 0; i < initPieceAmt; i++){
    const tmpPce = new Object;
    tmpPce.val = "piece";
    tmpPce.color = color;
    tmpPce.crowned = false;
    while(!boardArr[runner].empty || !boardArr[runner].legalPlay){
      if(color == 'light'){ runner--}
      else{ runner++}
    }
    tmpPce.tileLocation = boardArr[runner].tileLocation;
    tmpPce.x = boardArr[runner].x;
    tmpPce.y = boardArr[runner].y;
    boardArr[runner].empty = false;
    if(color == 'light'){ lightArr.push(tmpPce);}
    else{ darkArr.push(tmpPce);}
  }
}

function buildBoard(){
  for(var i = 0; i < boardArr.length; i++){
    const deTile = document.createElement('div');
    deTile.classList = "allTile " + boardArr[i].color+'Tile';
    deTile.id = boardArr[i].tileLocation + "Tile";
    app.appendChild(deTile);
    console.log(deTile);
  }
}

(function init(){
  createBoardArr();
  createColorArr('light');
  createColorArr('dark');
  buildBoard();
})()

console.log(boardArr);
