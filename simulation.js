//define
const PI = 3.141592653589793;
const NN = 201;

//衝突数の設定
const NNCOLMX = 2001;
const NRANMX = 100001;

//positions of molecules(分子iの位置ベクトルのx,y成分)
var RX, RY;

//velocities of molecules(分子iの速度ベクトルのx,y成分)
var VX, VY;

//x- and y-length of simulation region(長方形シミュレーション領域のx,y成分)
var XL, YL ;

//random number ( the range is from 0. to 1.0 )(0~1に分布する一様乱数列)
var RAN;

//NRAN:number of random numbers used(使用済みの乱数の数),IX:乱数の生成に使用する
var NRAN, IX ;

//粒子数
var n;

//各々の履歴が入る
var positionHistory;




//canvas
var canvas;
var ctx;

var tempNumber;



function draw(){

    RX = new Array();
    RY = new Array();
    VX = new Array();
    VY = new Array();
    RAN = new Array();
    positionHistory = new Array();
    var partnr = new Array();
        var d, ndens, vdens, temp, i, j, k, ii, ncol, ncolmx, nbump, op, inp, onoi, tstep, tij, tim, timbig, dsp;
        var coltim = new Array();
        var rx0 = new Array();
        var ry0 = new Array();



  //////////////////////////////////////////////////////////////
  //parameter (1)
  //////////////////////////////////////////////////////////////


    //n:系の分子数を表す,n=16,36,64,100,144,196,256,324,400,484...
    n = 36;
    
    //分子の面積分率(0.3で気相、0.5で液層、0.7で固層)
    vdens  = 0.7;

    //系の設定温度,T
    temp   = 5.0;
    
    //分子の直径
    d      = 1.;
    
    //分子の数密度
    ndens  = vdens*(4./PI) ;
    
    //分子直径の二乗
    dsq    = d*d ;

    //
    timbig = 1.e10 ;
    
    /*--- parameter (2) ---*/
    ncolmx =  500 ;
    inp    = 0 ;
    /*--- parameter (3) ---*/
    IX     = 0 ;
    
    rancal() ;
    console.log('RAN[]の要素数=%d',RAN.length);

    for (onoi = 1; onoi<=100; onoi ++) {
      //console.log('RAN[%d]の中身 = %f \n',onoi,RAN[onoi]);
    }
    NRAN   = 1 ;



  //canvasの設定
  canvas = document.getElementById('drawView');
  if (!canvas.getContext){
    alert("fail to load");
  }
  ctx = new Array();

  for (var i = 1; i < n; i++) {
     ctx[i] = canvas.getContext('2d');
  }


  //////////////////////////////////////////////////////////////
  //initial configuration(初期設定)
  //////////////////////////////////////////////////////////////
    
    
  //set initial positions(初期位置の指定)
  iniposit( n, ndens ) ;

    //各々の分子の初期位置
    for (onoi = 1; onoi<=n; onoi ++) {
      console.log('%d個目の初期位置:X:%lf Y=%lf \n',onoi,RX[onoi],RY[onoi]);
    }


  // set initial velocities (初期速度の設定)
  inivel( n, temp ) ;

  //各々の分子の初期速度
  for (onoi = 1; onoi<=n; onoi ++) {
    //console.log('%d個目の初期速度:VX:%lf VY=%lf \n',onoi,VX[onoi],VY[onoi]);
  }


  //scale velocities(系の分子数が合うようにスケーリングする)
  scalevel( n, temp ) ;


  // cal collision time for each moledcule(衝突するまでの時間を求める)
  for( i=1 ; i<=n ; i++ ) {
    collist( n, dsq, i, coltim, partnr ) ;
  }


  /*--- initialization ---*/
  tim   = 0. ; nbump = 0  ;


    
    /*----------------------------------------------------------------*/
    /*----------------------    equilibration   ----------------------*/
    /*----------------------------------------------------------------*/
    
    for ( ncol=1 ; ncol<=ncolmx ; ncol++ ) {
        
        /*--- locate minimum collision time ---*/
        tij = timbig ;
        
        for (onoi = 1; onoi <= coltim.length; onoi++) {
            //console.log("coltim[%d]の中身=%lf ",onoi,coltim[onoi]);
        }

        for ( k=1 ; k<=n ; k++ ) {
            if ( coltim[k] < tij ) {
                tij = coltim[k] ;
                i   = k ;
            }
        }
        /*--- coll. for i and j ---*/
        tstep  = tij ;
        j      = partnr[i] ;
        tim   += tstep ;
        nbump +=  1 ;
        /*--- advance particle position ---*/
        for ( k=1 ; k<=n ; k++ ) {
            coltim[k] += - tstep ;
            RX[k]     += VX[k]*tstep ;
            RY[k]     += VY[k]*tstep ;
            RX[k]     += - Math.floor( RX[k]/XL - 0.5 )*XL ;
            RY[k]     += - Math.floor( RY[k]/YL - 0.5 )*YL ;
        }
        /*--- compute coll. dynamics ---*/
        bump( d, i, j ) ;
        /*---  for those mol. whose pointers ---*/
        /*---     are i-th or j-th mol.      ---*/
        collist( n, dsq, i, coltim, partnr ) ;
        collist( n, dsq, j, coltim, partnr ) ;
        for( k=1 ; k<=n ; k++ ) {
            if( (partnr[k] == i) || (partnr[k] == j) )
                collist( n, dsq, k, coltim, partnr ) ;
        }
        /*--- for data output ---*/

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
            //console.log("あれ:X:%lf Y=%lf ",RX[k],RY[k]);
            //rx0[k][ncol] = RX[k] ;
            //ry0[k][ncol] = RY[k] ;
            

            console.log("%d個目の分子の軌跡:X:%lf Y=%lf ",k,RX[k],RY[k]);
                //setTimeout(aaa(RX[k],RY[k]), 3000);
            
        }
        positionHistory[ncol] = principlePositions;
    }

    tempNumber = 1;
   // aaa();
    console.log("positionHistory.length%d ",positionHistory.length);
    console.log("positionHistory.length[1]%d ",positionHistory[1].length);
    console.log("長さx%lf ",positionHistory[5][3]["x"]);
    console.log("長さy%lf ",positionHistory[5][3]["y"]);

            //輪郭線による描画
            /*
            ctx.beginPath();
            ctx.fillStyle = 'rgb(192, 80, 77)'; // 赤
            ctx.arc(70, 70, 60, 0, Math.PI*2, false);
            ctx.closePath();
            ctx.fill();

            ctx.clearRect(0, 0, 500, 500);

            ctx.translate(70,70);


            ctx.beginPath();
            ctx.fillStyle = 'rgb(192, 80, 77)'; // 赤
            ctx.arc(70, 70, 60, 0, Math.PI*2, false);
            ctx.closePath();
            ctx.fill();
*/

            //setTimeout(aaa, 1000);
//showAllPrinciple();
//ctx[n].clearRect(0, 0, 500, 500);

　var count = 0;
　var countup = function(){
  ctx[1].clearRect(0, 0, 500, 500);
  showAllPrinciple();
　//　console.log(count++);
　　setTimeout(countup, 1000);
　} 
　countup();
}

function showAllPrinciple(){

    for (var i = 1; i < n; i++) {
        showPrinciple(i);
    }
      tempNumber ++;
}



function showPrinciple(n){

    console.log("tempNumber=%lf,n=%lf",tempNumber,n);
    if (!positionHistory[tempNumber][n]["x"]) {
        console.log("aaaaaaaaaaaaaaa");
    }

    if (!positionHistory[tempNumber][n]["y"]) {
        console.log("aaaaaaaaaaaaaaa");
    }

    var x = positionHistory[tempNumber][n]["x"]*50;
    var y = positionHistory[tempNumber][n]["y"]*50;
   // x = 30;
   // y = 30;
  //ctx[n].clearRect(0, 0, 500, 500);
  ctx[n].beginPath();
  ctx[n].fillStyle = 'rgb(192, 80, 77)'; // 赤
  ctx[n].arc(x, y, 5, 0, Math.PI*2, false);
  ctx[n].closePath();
  ctx[n].fill();
  //ctx.translate(30,30);
  //ctx.translate(-positionHistory[tempNumber][3]["x"]*10,-positionHistory[tempNumber][3]["y"]*10);


  /*if (tempNumber < positionHistory.length) {
    alert("aaa");
    setTimeout(aaa(), 1000);

  }*/
}




/*+++ fun scalevel +++*/
function scalevel(n, temp ){
    var  vxi, vyi, velx, vely, tx, ty, t ;
    var  c1 ;
    var     i;
    /*--- zero total momentum ---*/
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
    /*--- correct velocities to satisfy ---*/
    /*-   specified temperature           -*/
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



//functions


//初期位置を設定する
function iniposit(n, ndens ){
    var  rxi, ryi, rx0, ry0, a , ax , ay , c1 ;
    var     i , j , kx , ky , k  , p , iface ;
    

    //set mol. at close-packed lattice points(最密格子上に分子を設置する)
    a  = Math.sqrt(  (2/Math.sqrt(3))/ndens  ) ;
    p  = Math.floor(Math.sqrt( n/4 ));
    XL = Math.sqrt(3)*a*p;
    YL = 2*a*p ;
    


    ax = Math.sqrt(3)*a ;
    ay   =  2.*a ;
    kx = p ; ky = p ;
    c1 = 0.01 ;
    
    // set initial position(初期位置の設定)
    k    =  0 ;
    


    for ( iface=1 ; iface<=4 ; iface++ ) {
        if( iface == 1 ) {
            rx0 = c1 ; ry0 = c1 ;
        } else if( iface == 2 ) {
            rx0 = c1 ; ry0 = a + c1 ;
        } else if( iface == 3 ) {
            rx0 = ax/2. + c1  ;
            ry0 = a/2.  + c1  ;
        } else {
            rx0 = ax/2. + c1  ;
            ry0 = a*3./2. + c1 ;
        }
        for( j=0 ; j<=ky-1 ; j++ ) {
            ryi = j*ay + ry0 ;
            if ( ryi >= YL )    break ;
            for ( i=0 ; i<=kx-1 ; i++ ) {
                rxi = i*ax + rx0 ;
                if ( rxi >= XL )  break ;
                
                k += 1 ;
                RX[k]   =  rxi ;
                RY[k]   =  ryi ;
            }
        }
    }
}



// fun inivel初期速度の設定
function inivel(n, temp ){
    var     i ;
    var  c0 , c1 , c2 , c3 , t , vxi , vyi ;
    
    c0 = 2*PI ;
    c3 = temp*3.5*3.5 ;
    t  = temp ;
    
    for ( i=1 ; i<=n ; i++ ) {
        
        NRAN += 1  ;
        //c1    = Math.sqrt( -2*t*Math.log( RAN[NRAN]) );
        c1    =  -2*t*Math.log( RAN[NRAN]);


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
    }
}



/*+++ fun collist +++*/
function collist(n, dsq, i, coltim, partnr ){
    var  rxi, ryi, rxij, ryij ;
    var  vxi, vyi, vxij, vyij ;
    var  rijsq, vijsq, bij, tij, discr ;
    var  timbig ;
    var     j ;
    
    timbig=10000000000 ;
    
    //console.log("渡された値,n=%f, dsp=%f,i=%f",n,dsq,i);

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


/*+++ fun bump +++*/
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



/*--- rancal ---*/
function rancal(){
    /*
    var aintegmx ;
    var integmx, integst, integ ;
    var i ;
    
    integmx = 2147483647.00000 ;
    integst = 584287.000000     ;
    integ   = 48828125.00000   ;
    
    aintegmx = integmx ;
    
    if ( IX == 0 ) IX = integst ;*/
    for (i=1 ; i<NRANMX ; i++ ) {
        /*IX *= integ ;
        if (IX < 0 )  IX = (IX+integmx)+1 ;
        RAN[i] = IX/aintegmx ;*/
        RAN[i] = Math.random() 
    }
}
