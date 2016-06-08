//define
const NN = 201;

//衝突数の設定
const NNCOLMX = 2001;
const NRANMX = 100001;

//positions of molecules(分子iの位置ベクトルのx,y成分)
var RX, RY;

//velocities of molecules(分子iの速度ベクトルのx,y成分)
var VX, VY;

//x- and y-length of simulation region(長方形シミュレーション領域のx,y成分)
//var XL, YL ;
/*
//random number ( the range is from 0. to 1.0 )(0~1に分布する一様乱数列)
var RAN;

//NRAN:number of random numbers used(使用済みの乱数の数),IX:乱数の生成に使用する
var NRAN, IX ;
*/
//分子数
var n;

//各々の履歴が入る
var positionHistory;

//canvas
var canvas,ctx;

//粒子の色の情報が入る配列
var colors;


var tempNumber;

function draw(){

  //配列の初期化
  generateAry();

  //乱数生成
  rancal();

  //---parameter (1)　---
  //n:系の分子数を表す,n=16,36,64,100,144,196,256,324,400,484...
  n = 36;
 

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
  inivel(n) ;

  showPrinciple(0);


  //ctx[0].clearRect(0, 0, 500, 500);



  var count = 1;
  var countup = function(){
  
    //消して枠を作る
    ctx[0].clearRect(0, 0, 500, 500);
    makeFrame();
    calcPositions(count);
    showPrinciple(count);
    count ++;
  　 setTimeout(countup, 1000);
　 } 
　 countup();




  // cal collision time for each moledcule(衝突するまでの時間を求める)
  /*
  for( i=1 ; i<=n ; i++ ) {
    collist( n, dsq, i, coltim, partnr ) ;
  }
}\



  // cal collision time for each moledcule(衝突するまでの時間を求める)
  for( i=1 ; i<=n ; i++ ) {
    collist( n, dsq, i, coltim, partnr ) ;
  }

  //--- initialization ---//
  tim   = 0. ; nbump = 0  ;

　　//----------------------    equilibration   ----------------------//

    
　　for ( ncol=1 ; ncol<=ncolmx ; ncol++ ) {
    //--- locate minimum collision time ---//
    tij = timbig ;
    for ( k=1 ; k<=n ; k++ ) {
      if ( coltim[k] < tij ) {
        tij = coltim[k] ;
          i  = k ;
        }
      }
    //--- coll. for i and j ---//
    tstep  = tij ;
    j      = partnr[i] ;
    tim   += tstep ;
    nbump +=  1 ;

    //--- advance particle position ---//
    for ( k=1 ; k<=n ; k++ ) {
      coltim[k] += - tstep ;
      RX[k]     += VX[k]*tstep ;
      RY[k]     += VY[k]*tstep ;
      RX[k]     += - Math.floor( RX[k]/XL - 0.5 )*XL ;
      RY[k]     += - Math.floor( RY[k]/YL - 0.5 )*YL ;
    }
    //--- compute coll. dynamics ---//
    bump( d, i, j ) ;
    //---  for those mol. whose pointers ---//
    //---     are i-th or j-th mol.      ---//
    collist( n, dsq, i, coltim, partnr ) ;
    collist( n, dsq, j, coltim, partnr ) ;
    for( k=1 ; k<=n ; k++ ) {
      if( (partnr[k] == i) || (partnr[k] == j) )
        collist( n, dsq, k, coltim, partnr ) ;
    }
    //--- for data output ---//

    var principlePositions = new Array();
    for( k=1 ; k<=n ; k++ ) {
      var rxNcolAry = new Array();
      var ryNcolAry = new Array();
      var positions = new Object();
      rxNcolAry[ncol] = RX[k];
      rx0[k] = rxNcolAry[ncol] ;
      ryNcolAry[ncol] = RX[k];
      ry0[k] = ryNcolAry[ncol] ;

      positions['x'] = RX[k];
      positions['y'] = RY[k];
      principlePositions[k] = positions;
    }
    positionHistory[ncol] = principlePositions;
  }

*/
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



/*
function showAllPrinciple(){
    for (var i = 1; i < n; i++) {
        showPrinciple(i);
    }
      tempNumber ++;
}
*/
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

  var firstDistance = 500 / (Math.sqrt(n)+1);

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
function inivel(n){

  //ボックスミュラー法によるガウス関数分布乱数の生成

  for (var i = 0; i < n; i++) {
    var x = Math.random();
    var y = Math.random();

    VX[i] = Math.sqrt(-Math.log(x)) * Math.cos(2*Math.PI*y);
    VY[i] = Math.sqrt(-Math.log(x)) * Math.sin(2*Math.PI*y);
  }



  /*
    var     i ;
    var  c0 , c1 , c2 , c3 , t , vxi , vyi ;
    
    c0 = 2*Math.PI ;
    c3 = temp*3.5*3.5 ;
    t  = temp ;
    
    for ( i=1 ; i<=n ; i++ ) {
      NRAN += 1  ;
      c1    =  Math.sqrt(-2*t*Math.log( RAN[NRAN]));
      NRAN += 1 ;
      c2    = c0*( RAN[NRAN] ) ;
      vxi   = c1*Math.cos(c2) ;
      vyi   = c1*Math.sin(c2) ;
        
      if( (vxi*vxi+vyi*vyi) >= c3 ){
        i--; 
        continue;
      };
      VX[i] = vxi ;
      VY[i] = vyi ;
    }*/

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

  console.log("%f" , positionHistory[t][0]['x']);

}




//+++ fun collist +++//
function collist(n, dsq, i, coltim, partnr ){
    var  rxi, ryi, rxij, ryij ;
    var  vxi, vyi, vxij, vyij ;
    var  rijsq, vijsq, bij, tij, discr ;
    var  timbig ,j;
    
    timbig=10000000000 ;

    coltim[i] = timbig ;  partnr[i] = n ;
    rxi = RX[i] ; ryi = RY[i] ;
    vxi = VX[i] ; vyi = VY[i] ;
    
    for ( j=1 ; j<=n ; j++ ) {
      if ( j == i )  continue ;
      test = RX[j] ;
      rxij = rxi - test;
      ryij = ryi - RY[j] ;
      rxij = rxij - Math.floor(rxij/XL)*XL ;
      ryij = rxij - Math.floor(ryij/YL)*YL ;
      vxij = vxi - VX[j] ;
      vyij = vyi - VY[j] ;
      bij  = rxij*vxij + ryij*vyij ;
        
      if( bij < 0 ) {
        rijsq = rxij*rxij + ryij*ryij ;
        vijsq = vxij*vxij + vyij*vyij ;
        discr = bij*bij - vijsq*( rijsq-dsq ) ;
        if( discr > 0 ) {
          tij = (-bij - Math.sqrt(discr) )/vijsq ;
          if( tij < coltim[i] ) {
          coltim[i] = tij ;
          partnr[i] = j ;
          }
        }
      }
      coltim[j] = j ;
      partnr[j] = j ;
    }
}


//+++ fun bump +++//
function bump( d, i, j ){
    var  rxij , ryij , vxij , vyij , rij , factor ;
    var  cx   , cy ;
    
    rxij  = RX[i] - RX[j] ;
    ryij  = RY[i] - RY[j] ;
    rxij += - Math.floor( rxij/XL)*XL ;
    ryij += - Math.floor( ryij/YL)*YL ;
    rij   = Math.sqrt( rxij*rxij + ryij*ryij ) ;
    vxij  = VX[i] - VX[j] ;
    vyij  = VY[i] - VY[j] ;
    
    factor= ( rxij*vxij + ryij*vyij ) / d ;
    cx    = factor*rxij/rij ;
    cy    = factor*ryij/rij ;
    
    VX[i] += - cx ;
    VX[j] += + cx ;
    VY[i] += - cy ;
    VY[j] += + cy ;
}


//--- rancal ---//
function rancal(){
    for (i=1 ; i<NRANMX ; i++ ) {
        //RAN[i] = Math.random() 
    }
}
