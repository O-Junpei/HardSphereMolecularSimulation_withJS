//系の分子数,n=16,36,64,100,144,196,256,324,400,484...
const PRINCIPLE_NUMBER = 36;

//系の温度
const SYSTEM_TEMP = 3;

//系の一片の長さ
const SYSTEM_LENGTH = 500;

//positions of molecules(分子iの位置ベクトルのx,y成分)
var RX, RY;

//velocities of molecules(分子iの速度ベクトルのx,y成分)
var VX, VY;


//分子数
var n;

//系の温度
var temperature;
//各々の履歴が入る
var positionHistory;

//canvas
var canvas,ctx,canvasClear;

//粒子の色の情報が入る配列
var colors;


function draw(){

  //配列の初期化
  generateAry();

  //---parameter (1)　---
  //n:系の分子数
  n = PRINCIPLE_NUMBER;
 
  //系の温度
  temperature = SYSTEM_TEMP;

  //canvas関連の初期設定
  setCanvas() ;

  //canvasに枠を作成する。
  makeFrame();

  //粒子用の色を作成
  makeColors();


　　//--- initial configuration(初期設定) ---//
  //set initial positions(初期位置の指定)
  iniposit(n) ;

  // set initial velocities (初期速度の設定)
  inivel(n,temperature) ;

  showPrinciple(0);

  //繰り返し処理
  var count = 1;
  var countup = function(){
  
    //消して枠を作る
    canvasClear.clearRect(0, 0, 500, 500);
    makeFrame();
    calcPositions(count);
    showPrinciple(count);
    count ++;
  　 setTimeout(countup, 1000);
　 } 
　 countup();

}


function generateAry(){
  RX = new Array();
  RY = new Array();
  VX = new Array();
  VY = new Array();
  positionHistory = new Array();
  ctx = new Array();
  colors = new Array();
}



function setCanvas(){
  //canvasの設定
  canvas = document.getElementById('drawView');
  if (!canvas.getContext){
    alert("fail to load");
  }
  for (var i = 0; i < n; i++) {
    ctx[i] = canvas.getContext('2d');
  }
  canvasClear = canvas.getContext('2d');
}

function makeFrame(){
  var frames = canvas.getContext('2d');
  frames.beginPath();
  frames.fillRect(0, 0, 500, 5);
  frames.fillRect(0, 0, 5, 500);
  frames.fillRect(0, 495, 500, 5);
  frames.fillRect(495, 0, 5, 500);
}

function makeColors(){
  for (var i = 0; i < n; i++) {
    var red = Math.round(Math.random() * 255);
    var redStr = String(red);
    var green = Math.round(Math.random() * 255);
    var greenStr = String(green);
    var blue = Math.round(Math.random() * 255);
    var blueStr = String(blue);
    var color = "rgb(" + red +"," + greenStr + "," + blueStr+")";
    colors[i] = color;
    console.log("%s" , color);
  }
}

function showPrinciple(t){

  for (var i = 0; i < n; i++) {

    var x = positionHistory[t][i]["x"];
    var y = positionHistory[t][i]["y"];

    ctx[i].beginPath();
    ctx[i].arc(x, y, 5, 0, Math.PI*2, false);
    ctx[i].fillStyle = colors[i];
    ctx[i].closePath();
    ctx[i].fill();
  }
}

//+++ fun scalevel +++//
function scalevel(n, temp ){
  var  vxi, vyi, velx, vely, tx, ty, t ;
  var  c1 ,i;
  //--- zero total momentum ---//
  velx = 0. ;  vely = 0. ;
  for( i=1 ; i<=n ; i++ ) {
    vxi   = VX[i] ;
    vyi   = VY[i] ;
    velx += vxi ;
    vely += vyi ;
  }
  velx = velx/n ;
  vely = vely/n ;
    
  for( i=1 ; i<=n ; i++ ) {
    VX[i] += - velx ;
    VY[i] += - vely ;
  }
  //--- correct velocities to satisfy ---//
  //-   specified temperature           -//
  tx = 0. ; ty = 0. ;
  for ( i=1 ; i<=n ; i++ ) {
    vxi  = VX[i] ;
    vyi  = VY[i] ;
    tx += vxi*vxi ;
    ty += vyi*vyi ;
  }
    tx = tx/n ;
    ty = ty/n ;
    t = ( tx + ty )/2. ;
    c1 = Math.sqrt( temp/t) ;
    for ( i=1 ; i<=n ; i++ ) {
        vxi   = VX[i] ;
        vyi   = VY[i] ;
        VX[i] *= c1 ;
        VX[i] *= c1 ;
    }
}


//初期位置を設定する
function iniposit(n){

  var firstDistance = SYSTEM_LENGTH / (Math.sqrt(n)+1);

  //X軸方向の初期位置指定
  for (var i = 0; i < n; i++) {
    RX[i] = Math.floor(i / Math.sqrt(n))*firstDistance + firstDistance;
  }

  //Y軸方向の初期位置指定
  for (i = 0; i < n; i++) {
    RY[i] = Math.floor(i % Math.sqrt(n))*firstDistance + firstDistance;
  }

  for (var i = 0; i < n; i++) {
    console.log("RX[%d]=:%f,RY[%d]=:%f" , i, RX[i] , i, RY[i]);
  }

  var positions = new Array();
  for (var i = 0; i < n; i++) {
    position = new Object();
    position['x'] = RX[i];
    position['y'] = RY[i];
    positions[i] = position;
  }

  positionHistory[0] = positions;
  //console.log("%f" , positionHistory[0][1]['y']);
}


// fun inivel初期速度の設定
function inivel(n,temperature){

  //ボックスミュラー法によるガウス関数分布乱数の生成
    var vxi , vyi, velLimit;
    
    velLimit = temperature * SYSTEM_LENGTH/10 ;
    
    for (var i=0 ; i<n ; i++ ) {

      vxi   = Math.sqrt(-2*temperature*Math.log( Math.random()))*Math.cos(2*Math.PI*( Math.random() )) ;
      vyi   = Math.sqrt(-2*temperature*Math.log( Math.random()))*Math.sin(2*Math.PI*( Math.random() )) ;
        
      //画面サイズから大きく外れる速度の粒子は再計算する
      if( (vxi*vxi+vyi*vyi) >= velLimit ){
        i--; 
        continue;
      };

      VX[i] = vxi ;
      VY[i] = vyi ;
    }
}

//tから1秒後の位置を求める
function calcPositions(t){
  var positions = new Array();

  for (var i = 0; i < n; i++) {
    var xNew = positionHistory[(t-1)][i]["x"] + VX[i];
    var yNew = positionHistory[(t-1)][i]["y"] + VY[i];

    position = new Object();
    position['x'] = xNew;
    position['y'] = yNew;
    positions[i] = position;
  }

  positionHistory[t] = positions;
}

