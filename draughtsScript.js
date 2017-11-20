
//Next step is to edit highlightMove function to allow the taking over of pieces in opposite direction while in crowned mode

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
    if(color == 'light'){ tmpPce.currPieceLight = 1; tmpPce.oppColor = darkArr; lightArr.push(tmpPce);}
    else{ tmpPce.currPieceLight = -1; tmpPce.oppColor = lightArr; darkArr.push(tmpPce);}
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
  tmpPce.addEventListener('click', function(){movePiece(piece);})
  if(piece.crowned){
    tmpPce.innerHTML = "&#9813";
  }
  for(var i = 0; i < boardArr.length; i++){
    if((boardArr[i].tileLocation == piece.tileLocation) && piece.color == 'light'){
      boardArr[i].currPieceLight = 1;
    }
    else if((boardArr[i].tileLocation == piece.tileLocation) && piece.color == 'dark'){
      boardArr[i].currPieceLight = -1;
    }
  }
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
  //console.log(pieceInfo);

  let pieceToTake = false;
  let pieceTakingDir = undefined;
  let takenPiece = undefined;
  if(pieceInfo.color == 'light'){ direction = 1 }
  else{ direction = -1 }
  if(!pieceSelectedBool){ document.getElementById(pieceInfo.tileLocation+'Piece').style.boxShadow="3px 3px 2px black" }
  else{ document.getElementById(pieceInfo.tileLocation+'Piece').style.boxShadow="none"}

  //Piece able to be taken
  for(var i = 0; i < boardArr.length; i++){
    if((boardArr[i].x == pieceInfo.x+direction) && (boardArr[i].y.charCodeAt(0) == pieceInfo.y.charCodeAt(0)-1 ||
     boardArr[i].y.charCodeAt(0) == pieceInfo.y.charCodeAt(0)+1) && (boardArr[i].currPieceLight == -pieceInfo.currPieceLight)){
     if(boardArr[i].y.charCodeAt(0) < pieceInfo.y.charCodeAt(0)){pieceTakingDir = -1;}
     else{pieceTakingDir = 1;}

      for(var n = 0; n < pieceInfo.oppColor.length; n++){
        //console.log(pieceInfo.oppColor[n]);
        if(pieceInfo.oppColor.tileLocation == boardArr[i].tileLocation){
          takenPiece = n;
        }
      }
      boardArr[i].tileLocation

     for(var j = 0; j < boardArr.length; j++){
       let holder = j;
       if((boardArr[j].x == pieceInfo.x+(direction*2)) && (boardArr[j].y.charCodeAt(0) == pieceInfo.y.charCodeAt(0)+(pieceTakingDir*2)) &&
        boardArr[j].empty){
          let takenHolder = i;
          if(!pieceSelectedBool){
            highlightedTiles.push(boardArr[j]);
            document.getElementById(boardArr[j].tileLocation+'Tile').style.backgroundColor="#848EA1";
            document.getElementById(boardArr[j].tileLocation+'Tile').addEventListener('click', function(){
              updatePiece(pieceInfo, boardArr[holder], boardArr[takenHolder]);
              if(pieceInfo.color == 'light'){darkArr.splice(takenPiece, 1);}

              else if(pieceInfo.color == 'dark'){lightArr.splice(takenPiece, 1);}

            });

            pieceToTake = true;
          }
          else{
            document.getElementById(boardArr[j].tileLocation+'Tile').style.backgroundColor="#A67D5D";
            el = document.getElementById(boardArr[j].tileLocation+'Tile');
            elClone = el.cloneNode(true);
            app.replaceChild(elClone, el);
            highlightedTiles = [];
          }
        }
      }


    }


    /////////////////////////////////////
    //////////////////////////////////////
    /////////////////////////////////////////

    if(pieceInfo.crowned){
      if((boardArr[i].x == pieceInfo.x-direction) && (boardArr[i].y.charCodeAt(0) == pieceInfo.y.charCodeAt(0)-1 ||
       boardArr[i].y.charCodeAt(0) == pieceInfo.y.charCodeAt(0)+1) && (boardArr[i].currPieceLight == -pieceInfo.currPieceLight)){
         if(boardArr[i].y.charCodeAt(0) < pieceInfo.y.charCodeAt(0)){pieceTakingDir = -1;}
         else{pieceTakingDir = 1;}

         for(var n = 0; n < pieceInfo.oppColor.length; n++){
           //console.log(pieceInfo.oppColor[n]);
           if(pieceInfo.oppColor.tileLocation == boardArr[i].tileLocation){
             takenPiece = n;
           }
         }
         boardArr[i].tileLocation

         for(var j = 0; j < boardArr.length; j++){
           let holder = j;
           if((boardArr[j].x == pieceInfo.x+(-direction*2)) && (boardArr[j].y.charCodeAt(0) == pieceInfo.y.charCodeAt(0)+(pieceTakingDir*2)) &&
            boardArr[j].empty){
              let takenHolder = i;
              if(!pieceSelectedBool){
                highlightedTiles.push(boardArr[j]);
                document.getElementById(boardArr[j].tileLocation+'Tile').style.backgroundColor="#848EA1";
                document.getElementById(boardArr[j].tileLocation+'Tile').addEventListener('click', function(){updatePiece(pieceInfo, boardArr[holder], boardArr[takenHolder])});
                if(pieceInfo.color == 'light'){darkArr.splice(takenPiece, 1);}
                else{lightArr.splice(takenPiece, 1);}
                pieceToTake = true;
              }
              else{
                document.getElementById(boardArr[j].tileLocation+'Tile').style.backgroundColor="#A67D5D";
                el = document.getElementById(boardArr[j].tileLocation+'Tile');
                elClone = el.cloneNode(true);
                app.replaceChild(elClone, el);
                highlightedTiles = [];
              }
            }
          }
       }
    }
  }

  //Piece unable to be taken
    if(!pieceToTake){
      for(var i = 0; i < boardArr.length; i++){
        let holder = i;
        if((boardArr[i].x == pieceInfo.x+direction) && (boardArr[i].y.charCodeAt(0) == pieceInfo.y.charCodeAt(0)-1 ||
         boardArr[i].y.charCodeAt(0) == pieceInfo.y.charCodeAt(0)+1) && boardArr[i].empty){
          if(!pieceSelectedBool){
            highlightedTiles.push(boardArr[i]);
            document.getElementById(boardArr[i].tileLocation+'Tile').style.backgroundColor="#848EA1";
            //console.log(boardArr[i]);
            document.getElementById(boardArr[i].tileLocation+'Tile').addEventListener('click', function(){updatePiece(pieceInfo, boardArr[holder])})
          }else{
            document.getElementById(boardArr[i].tileLocation+'Tile').style.backgroundColor="#A67D5D";
            el = document.getElementById(boardArr[i].tileLocation+'Tile');
            elClone = el.cloneNode(true);
            app.replaceChild(elClone, el);
            highlightedTiles = [];
          }
        }


        if(pieceInfo.crowned){
          if((boardArr[i].x == pieceInfo.x-direction) && (boardArr[i].y.charCodeAt(0) == pieceInfo.y.charCodeAt(0)-1 ||
           boardArr[i].y.charCodeAt(0) == pieceInfo.y.charCodeAt(0)+1) && boardArr[i].empty){
             if(!pieceSelectedBool){
               highlightedTiles.push(boardArr[i]);
               document.getElementById(boardArr[i].tileLocation+'Tile').style.backgroundColor="#848EA1";
               //console.log(boardArr[i]);
               document.getElementById(boardArr[i].tileLocation+'Tile').addEventListener('click', function(){updatePiece(pieceInfo, boardArr[holder])})
             }else{
               document.getElementById(boardArr[i].tileLocation+'Tile').style.backgroundColor="#A67D5D";
               el = document.getElementById(boardArr[i].tileLocation+'Tile');
               elClone = el.cloneNode(true);
               app.replaceChild(elClone, el);
               highlightedTiles = [];
             }
           }
        }
      }
    }
  }



function updatePiece(checkerPos, tilePos, takenPos){

  for(var i = 0; i < boardArr.length;i++){
    if(checkerPos.tileLocation == boardArr[i].tileLocation){
      boardArr[i].currPieceLight = 0;
      boardArr[i].empty = true;
      //console.log(boardArr[i]);
    }
  }
  document.getElementById(checkerPos.tileLocation+'Tile').removeChild(document.getElementById(checkerPos.tileLocation+'Tile').childNodes[0]);
  checkerPos.tileLocation = tilePos.tileLocation;
  checkerPos.x = tilePos.x;
  checkerPos.y = tilePos.y;
  for(var i = 0; i < highlightedTiles.length; i++){
    document.getElementById(highlightedTiles[i].tileLocation+'Tile').style.backgroundColor="#A67D5D";
    let el = document.getElementById(highlightedTiles[i].tileLocation+'Tile');
    let elClone = el.cloneNode(true);
    app.replaceChild(elClone, el);
  }
  if(takenPos){
    document.getElementById(takenPos.tileLocation+'Tile').removeChild(document.getElementById(takenPos.tileLocation+'Tile').childNodes[0]);
    takenPos.empty = true;
    takenPos.currPieceLight = 0;
  }
  if(checkerPos.color == 'light' && checkerPos.x == 8){checkerPos.crowned = true;}
  if(checkerPos.color == 'dark' && checkerPos.x == 1){checkerPos.crowned = true;}
  tilePos.empty = false;
  highlightedTiles = [];
  pieceSelectedBool = false;
  pieceSelectedInfo = undefined;
  buildPiece(checkerPos);

  //New Stuff
  if(lightArr.length == 0){
    alert('Light Wins');
  }
  else if(darkArr.length == 0){
    alert('Dark Wins');
  }
}

function scanner(arr){
  
}

(function init(){
  createBoardArr();
  createColorArr('light');
  createColorArr('dark');
  buildBoard();
  initPieceLoc(lightArr);
  initPieceLoc(darkArr);
})()
