
const tileAmt = 8;
const initPieceAmt = 12;
let runner;

let whiteTurn = true;
let direction;

let pieceSelectedBool = false;
let pieceSelectedInfo;


//Arrays
let boardArr = [];
let lightArr = [];
let darkArr = [];
let highlightedTiles = [];

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
  }
}

function initPieceLoc(arr){
  for(var i = 0; i < arr.length; i++){
    buildPiece(arr[i]);
  }
}

function buildPiece(piece){

  const tmpPce = document.createElement('div');
  tmpPce.classList = "allPiece " + piece.color + "Piece";
  if(piece.color == 'light'){tmpPce.style.cursor="pointer"}
  tmpPce.id = piece.tileLocation + 'Piece';
  tmpPce.addEventListener('click', function(){movePiece(piece)})
  document.getElementById(piece.tileLocation+'Tile').appendChild(tmpPce);

}

function movePiece(pieceInfo){

  if(!pieceSelectedBool || pieceSelectedInfo == pieceInfo){
    highlightMove(pieceInfo);

    if(pieceSelectedBool == false){pieceSelectedInfo = pieceInfo}
    else{pieceSelectedInfo = undefined}
    pieceSelectedBool = !pieceSelectedBool;
  }
}

function highlightMove(pieceInfo){
  console.log(pieceInfo);

  if(pieceInfo.color == 'light'){ direction = 1 }
  else{ direction = -1 }
  if(!pieceSelectedBool){ document.getElementById(pieceInfo.tileLocation+'Piece').style.boxShadow="3px 3px 2px black" }
  else{ document.getElementById(pieceInfo.tileLocation+'Piece').style.boxShadow="none"}

  for(var i = 0; i < boardArr.length; i++){
    if(!pieceInfo.crowned){
      if((boardArr[i].x == pieceInfo.x+direction) && (boardArr[i].y.charCodeAt(0) == pieceInfo.y.charCodeAt(0)-1 ||
       boardArr[i].y.charCodeAt(0) == pieceInfo.y.charCodeAt(0)+1) && boardArr[i].empty){
        if(!pieceSelectedBool){
          highlightedTiles.push(boardArr[i]);
          document.getElementById(boardArr[i].tileLocation+'Tile').style.backgroundColor="#848EA1";
          document.getElementById(boardArr[i].tileLocation+'Tile').addEventListener('click', function(){updatePiece(pieceInfo, boardArr[i])})
        }else{
          document.getElementById(boardArr[i].tileLocation+'Tile').style.backgroundColor="#A67D5D";
          highlightedTiles = [];
        }
      }
    }
  }
}

function updatePiece(checkerPos, tilePos){
  console.log('yay');
}

(function init(){
  createBoardArr();
  createColorArr('light');
  createColorArr('dark');
  buildBoard();
  initPieceLoc(lightArr);
  initPieceLoc(darkArr);
})()
