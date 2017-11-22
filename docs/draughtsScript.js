
const tileAmt = 8;
const initPieceAmt = 12;
let runner;
let lightMustTake = false;
let darkMustTake = false;
let anotherMove = false;

let whiteTurn = true;
let direction;
let pieceSelectedBool = false;
let pieceSelectedInfo;


//Arrays
let boardArr = [];
let lightArr = [];
let darkArr = [];
let highlightedTiles = [];
let anotherMoveArr = [];
let anotherMoveArrTaken = [];
let takenPieceArr = [];


//Creates information for objects within the boardArr array
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

//Creates both color arrays
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

//Creates the board from the boardArr array
function buildBoard(){
  for(var i = 0; i < boardArr.length; i++){
    const deTile = document.createElement('div');
    deTile.classList = "allTile " + boardArr[i].color+'Tile';
    deTile.id = boardArr[i].tileLocation + "Tile";
    app.appendChild(deTile);
  }
}

//Places  pieces in their initials positions on board
function initPieceLoc(arr){
  for(var i = 0; i < arr.length; i++){
    buildPiece(arr[i]);
  }
}

//Function takes passed data value and turns it into pieces on board
function buildPiece(piece){

  const tmpPce = document.createElement('div');
  tmpPce.classList = "allPiece " + piece.color + "Piece";
  if(piece.color == 'light'){tmpPce.style.cursor="pointer"}
  tmpPce.id = piece.tileLocation + 'Piece';

  if(!anotherMove){
    tmpPce.addEventListener('click', function(){movePiece(piece);})

  }
  else{
    tmpPce.style.boxShadow="3px 3px 2px black";
  }
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

//Changes object values to corresponding new position values
function movePiece(pieceInfo){

  if(!pieceSelectedBool || pieceSelectedInfo == pieceInfo){
    highlightMove(pieceInfo);

    if(pieceSelectedBool == false){pieceSelectedInfo = pieceInfo}
    else{pieceSelectedInfo = undefined}
    pieceSelectedBool = !pieceSelectedBool;
  }
}

//Adds event listeners to spaces where movement is possible
function highlightMove(pieceInfo){

  let pieceToTake = false;
  let pieceTakingDir = undefined;
  let takenPiece = undefined;
  let takenPiece2 = undefined;
  if(pieceInfo.color == 'light'){ direction = 1 }
  else{ direction = -1 }
  if(!pieceSelectedBool){ document.getElementById(pieceInfo.tileLocation+'Piece').style.boxShadow="3px 3px 2px black" }
  else{ document.getElementById(pieceInfo.tileLocation+'Piece').style.boxShadow="none"}

  //Piece able to be taken

  if((pieceInfo.color == 'light' && whiteTurn) || (pieceInfo.color =='dark' && !whiteTurn)){
    for(var i = 0; i < boardArr.length; i++){

      if((boardArr[i].x == pieceInfo.x+direction) && (boardArr[i].y.charCodeAt(0) == pieceInfo.y.charCodeAt(0)-1 ||
       boardArr[i].y.charCodeAt(0) == pieceInfo.y.charCodeAt(0)+1) && (boardArr[i].currPieceLight == -pieceInfo.currPieceLight)){
       if(boardArr[i].y.charCodeAt(0) < pieceInfo.y.charCodeAt(0)){pieceTakingDir = -1;}
       else{pieceTakingDir = 1;}


       for(var j = 0; j < boardArr.length; j++){
         let holder = j;
         if((boardArr[j].x == pieceInfo.x+(direction*2)) && (boardArr[j].y.charCodeAt(0) == pieceInfo.y.charCodeAt(0)+(pieceTakingDir*2)) &&
          boardArr[j].empty){
            for(var n = 0; n < pieceInfo.oppColor.length; n++){
              if(boardArr[i].tileLocation == pieceInfo.oppColor[n].tileLocation){
                takenPiece = n;
              }
            }
            let takenHolder = i;
            if(!pieceSelectedBool){
              highlightedTiles.push(boardArr[j]);
              document.getElementById(boardArr[j].tileLocation+'Tile').style.backgroundColor="#848EA1";
              document.getElementById(boardArr[j].tileLocation+'Tile').addEventListener('click', function(){
                updatePiece(pieceInfo, boardArr[holder], boardArr[takenHolder], takenPiece);
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

      /////////////////////////////////////////

      if(pieceInfo.crowned){
        if((boardArr[i].x == pieceInfo.x-direction) && (boardArr[i].y.charCodeAt(0) == pieceInfo.y.charCodeAt(0)-1 ||
         boardArr[i].y.charCodeAt(0) == pieceInfo.y.charCodeAt(0)+1) && (boardArr[i].currPieceLight == -pieceInfo.currPieceLight)){
           if(boardArr[i].y.charCodeAt(0) < pieceInfo.y.charCodeAt(0)){pieceTakingDir = -1;}
           else{pieceTakingDir = 1;}


           for(var j = 0; j < boardArr.length; j++){
             let holder = j;
             if((boardArr[j].x == pieceInfo.x+(-direction*2)) && (boardArr[j].y.charCodeAt(0) == pieceInfo.y.charCodeAt(0)+(pieceTakingDir*2)) &&
              boardArr[j].empty){
                for(var n = 0; n < pieceInfo.oppColor.length; n++){
                  if(boardArr[i].tileLocation == pieceInfo.oppColor[n].tileLocation){
                    takenPiece2 = n;
                  }
                }
                let takenHolder = i;
                if(!pieceSelectedBool){
                  highlightedTiles.push(boardArr[j]);
                  document.getElementById(boardArr[j].tileLocation+'Tile').style.backgroundColor="#848EA1";
                  document.getElementById(boardArr[j].tileLocation+'Tile').addEventListener('click', function(){
                    updatePiece(pieceInfo, boardArr[holder], boardArr[takenHolder], takenPiece2);
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
      }
    }
  }


  //Piece unable to be taken
    if((!pieceToTake) && (((whiteTurn && pieceInfo.color == 'light') && !lightMustTake) || ((!whiteTurn && pieceInfo.color == 'dark') && !darkMustTake ))){
      for(var i = 0; i < boardArr.length; i++){
        let holder = i;
        if((boardArr[i].x == pieceInfo.x+direction) && (boardArr[i].y.charCodeAt(0) == pieceInfo.y.charCodeAt(0)-1 ||
         boardArr[i].y.charCodeAt(0) == pieceInfo.y.charCodeAt(0)+1) && boardArr[i].empty){
          if(!pieceSelectedBool){
            highlightedTiles.push(boardArr[i]);
            document.getElementById(boardArr[i].tileLocation+'Tile').style.backgroundColor="#848EA1";
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

//Function that gets event listener places on tiles and uses it to update values for involved pieces
function updatePiece(checkerPos, tilePos, takenPos, takeThisPiece){

  anotherMove = false;

  for(var i = 0; i < boardArr.length;i++){
    if(checkerPos.tileLocation == boardArr[i].tileLocation){
      boardArr[i].currPieceLight = 0;
      boardArr[i].empty = true;
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

  for(var i = 0; i < anotherMoveArr.length; i++){
    document.getElementById(anotherMoveArr[i].tileLocation+'Tile').style.backgroundColor="#A67D5D";
    let el = document.getElementById(anotherMoveArr[i].tileLocation+'Tile');
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
  anotherMoveArr = [];
  anotherMoveArrTaken = [];
  takenPieceArr = [];
  pieceSelectedBool = false;
  pieceSelectedInfo = undefined;




  if(takenPos){
    if(checkerPos.color == 'light'){darkArr.splice(takeThisPiece, 1);}
    else{lightArr.splice(takeThisPiece, 1);}
  }

  if(takenPos){
    currScan(checkerPos);
  }

  buildPiece(checkerPos);



  //New Stuff
  if(lightArr.length == 0){
    alert('Dark Wins');
    console.log('Dark Wins')
  }
  else if(darkArr.length == 0){
    alert('Light Wins');
    console.log('Light Wins')
  }
  else{
    if(!anotherMove){
      whiteTurn = !whiteTurn;
      textHelp();
      if(whiteTurn){scanner(lightArr)}
      else{scanner(darkArr)}
    }
    else {
      captureAgain(checkerPos);
    }
  }

}

//Function allows for further moves upon capture of oppenent and further captures available
function captureAgain(piece){

  for(var i = 0; i < anotherMoveArr.length; i++){
    let tempHold = i;
    document.getElementById(anotherMoveArr[i].tileLocation+'Tile').style.backgroundColor="#848EA1";
    document.getElementById(anotherMoveArr[i].tileLocation+'Tile').addEventListener('click', function(){
      updatePiece(piece, anotherMoveArr[tempHold], anotherMoveArrTaken[tempHold], takenPieceArr[tempHold]);
    });
    pieceToTake = true;
  }

}

//Scans board for further capture after first capture
function currScan(piece){

  let pieceTakeDir2;
  anotherMove = false;

  for(var i = 0; i < boardArr.length; i++){
    if((boardArr[i].x == piece.x+direction) && (boardArr[i].y.charCodeAt(0) == piece.y.charCodeAt(0)-1 ||
     boardArr[i].y.charCodeAt(0) == piece.y.charCodeAt(0)+1) && (boardArr[i].currPieceLight == -piece.currPieceLight)){
       if(boardArr[i].y.charCodeAt(0) < piece.y.charCodeAt(0)){pieceTakingDir2 = -1;}
       else{pieceTakingDir2 = 1;}

       for(var j = 0; j < boardArr.length; j++){

         if((boardArr[j].x == piece.x+(direction*2)) && (boardArr[j].y.charCodeAt(0) == piece.y.charCodeAt(0)+(pieceTakingDir2*2)) &&
          boardArr[j].empty){
            for(var n = 0; n < piece.oppColor.length; n++){
              if(boardArr[i].tileLocation == piece.oppColor[n].tileLocation){
                takenPieceArr.push(n);
              }
            }

            anotherMove = true;
            anotherMoveArrTaken.push(boardArr[i]);
            anotherMoveArr.push(boardArr[j]);
          }
       }

     }

     if(piece.crowned){
       if((boardArr[i].x == piece.x-direction) && (boardArr[i].y.charCodeAt(0) == piece.y.charCodeAt(0)-1 ||
        boardArr[i].y.charCodeAt(0) == piece.y.charCodeAt(0)+1) && (boardArr[i].currPieceLight == -piece.currPieceLight)){

          if(boardArr[i].y.charCodeAt(0) < piece.y.charCodeAt(0)){pieceTakingDir2 = -1;}
          else{pieceTakingDir2 = 1;}

          for(var j = 0; j < boardArr.length; j++){
            if((boardArr[j].x == piece.x+(-direction*2)) && (boardArr[j].y.charCodeAt(0) == piece.y.charCodeAt(0)+(pieceTakingDir2*2)) &&
             boardArr[j].empty){
               for(var n = 0; n < piece.oppColor.length; n++){
                 if(boardArr[i].tileLocation == piece.oppColor[n].tileLocation){
                   takenPieceArr.push(n);
                 }
               }

               anotherMove = true;
               anotherMoveArrTaken.push(boardArr[i]);
               anotherMoveArr.push(boardArr[j]);
             }
          }
        }
     }
  }
}

//Scans board for any available capture before movement
function scanner(arr){

  lightMustTake = false;
  darkMustTake = false;

  let direc;
  let pieceTakingDir;

  if(arr[0].color == 'light'){ direc = 1 }
  else{ direc = -1;}

  for(var a = 0; a < arr.length; a++){
    for(var i = 0; i < boardArr.length; i++){

      if((boardArr[i].x == arr[a].x+direc) && (boardArr[i].y.charCodeAt(0) == arr[a].y.charCodeAt(0)-1 ||
       boardArr[i].y.charCodeAt(0) == arr[a].y.charCodeAt(0)+1) && (boardArr[i].currPieceLight == -arr[a].currPieceLight) ){
         if(boardArr[i].y.charCodeAt(0) < arr[a].y.charCodeAt(0)){pieceTakingDir = -1;}
         else{pieceTakingDir = 1;}

         for(var j = 0; j < boardArr.length; j++){
           if((boardArr[j].x == arr[a].x+(direc*2)) && (boardArr[j].y.charCodeAt(0) == arr[a].y.charCodeAt(0)+(pieceTakingDir*2)) && boardArr[j].empty){

              if(arr[a].color == 'light' && boardArr[i].currPieceLight == -1){lightMustTake = true;  }
              else if(arr[a].color == 'dark'&& boardArr[i].currPieceLight == 1){darkMustTake = true;  }
            }
        }
      }

      if(arr[a].crowned){
        if((boardArr[i].x == arr[a].x-direc) && (boardArr[i].y.charCodeAt(0) == arr[a].y.charCodeAt(0)-1 ||
         boardArr[i].y.charCodeAt(0) == arr[a].y.charCodeAt(0)+1) && (boardArr[i].currPieceLight == -arr[a].currPieceLight)){
           if(boardArr[i].y.charCodeAt(0) < arr[a].y.charCodeAt(0)){pieceTakingDir = -1;}
           else{pieceTakingDir = 1;}

           for(var j = 0; j < boardArr.length; j++){
             if((boardArr[j].x == arr[a].x-(direc*2)) && (boardArr[j].y.charCodeAt(0) == arr[a].y.charCodeAt(0)+(pieceTakingDir*2)) && boardArr[j].empty){

               if(arr[a].color == 'light' && boardArr[i].currPieceLight == -1){lightMustTake = true;  }
               else if(arr[a].color == 'dark'&& boardArr[i].currPieceLight == 1){darkMustTake = true; }

             }
         }
       }
      }
    }
  }

  textHelp();
}

//Adds text area to body
function textAr(){
  const textArea1 = document.createElement('div');
  textArea1.id = "textArea";
  document.body.appendChild(textArea1);
  const textMover = document.createElement('h1');
  textMover.id = 'textMove';
  textArea1.appendChild(textMover);
  const textMandatory = document.createElement('h2');
  textMandatory.id = "textMand";
  textArea1.appendChild(textMandatory);
}

//Changes innerHTML and style of text in text area to match checker game
function textHelp(){

  if(whiteTurn){
    document.getElementById('textMove').innerHTML = 'Light Move';
    document.getElementById('textMove').style.color = "white";

  }
  else{
    document.getElementById('textMove').innerHTML = 'Dark Move';
    document.getElementById('textMove').style.color= 'black';
  }
  if(lightMustTake || darkMustTake){
    document.getElementById('textMand').innerHTML = 'Mandatory Take';
    if(whiteTurn){
      document.getElementById('textMand').style.color = "white";
    }
    else{
      document.getElementById('textMand').style.color = "black";
    }
  }
  else{
    document.getElementById('textMand').innerHTML = '';
  }
}


//Initializes everything
(function init(){
  createBoardArr();
  createColorArr('light');
  createColorArr('dark');
  buildBoard();
  initPieceLoc(lightArr);
  initPieceLoc(darkArr);
  textAr();
  textHelp();
})()
