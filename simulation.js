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

function draw(){

    RX = new Array();
    RY = new Array();
    VX = new Array();
    VY = new Array();
    RAN = new Array();

    var n;
    var partnr = new Array();
        var d;
        var ndens;
        var vdens;
        var temp;
        var coltim = new Array();
        var tstep;
        var tij;
        var tim;
        var timbig;
        var dsp;
        var rx0 = new Array();
        var ry0 = new Array();
        var i;
        var j;
        var k;
        var ii;
        var ncol;
        var ncolmx;
        var nbump;
        var op;
        var inp;
        var onoi;


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
      console.log('RAN[%d]の中身 = %f \n',onoi,RAN[onoi]);
    }
    NRAN   = 1 ;



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
      console.log('%d個目の初期速度:VX:%lf VY=%lf \n',onoi,VX[onoi],VY[onoi]);
    }

        var canvas = document.getElementById('tutorial');
        if (canvas.getContext){
            var ctx = canvas.getContext('2d');
            //輪郭線による描画
            ctx.beginPath();
            ctx.moveTo(50,50);
            ctx.lineTo(360,200);
            ctx.lineTo(140,250);
            ctx.closePath();
            ctx.stroke();

            //塗り潰しによる描画
            ctx.beginPath();
            ctx.moveTo(50,250);
            ctx.lineTo(160,20);
            ctx.lineTo(340,50);
            ctx.closePath();
            ctx.fill();
        }
}


//functions


//初期位置を設定する
function iniposit(n, ndens ){
    var  rxi, ryi, rx0, ry0, a , ax , ay , c1 ;
    var     i , j , kx , ky , k  , p , iface ;
    

    //set mol. at close-packed lattice points(最密格子上に分子を設置する)
    a  = Math.sqrt(  (2/Math.sqrt(3))/ndens  ) ;
    p  = Math.sqrt( n/4 );
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
