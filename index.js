var imgdata;
var img;
var go_stop=0;
var src;
var canvas;
var ctx;
var palette=[
	[0,0,0,255]
	,[128,128,128,255]
	,[192,192,192,255]
	,[255,255,255,255]
]

var CELL_SIZE = 16;
var _CELL_SIZE = 1/CELL_SIZE;
var dst_width =(320 * _CELL_SIZE|0)+1;
var CELL_ROW = (240 * _CELL_SIZE|0)+1;
var CELL_COL = (320 * _CELL_SIZE|0)+1;


var dst = new Int8Array(CELL_COL  * ((240 * _CELL_SIZE|0)+1));


class Square{
	constructor(){
		this.idx=0;
		this.x=0;
		this.y=0;
		this.t=0;

		this.status = 0;
	}
	move(){
		this.t++;
		if(this.t ==6){
			var idx = this.y*CELL_COL+this.x;
			dst[idx]--;
		}else if(this.t>8){
			this.status = 0;
		}
	}
	draw(){

	var x = this.x;
	var y =  this.y;
	var r = 8-this.t;

	var bold = 4;
	if(this.t<bold*0.5){
		return;
}

	ctx.fillRect(x*CELL_SIZE+r,y*CELL_SIZE+r,CELL_SIZE-r*2,bold);
	ctx.fillRect(x*CELL_SIZE+r,(y+1)*CELL_SIZE-bold-r,CELL_SIZE-r*2,bold);

	ctx.fillRect(x*CELL_SIZE+r,y*CELL_SIZE+r,bold,CELL_SIZE-r*2);
	ctx.fillRect((x+1)*CELL_SIZE-bold-r,y*CELL_SIZE+r,bold,CELL_SIZE-r*2);


	}
}
var squares = new Array(256);
for(var i=0;i<squares.length;i++){
	squares[i] = new Square();
}


function createSquare(){
	for(var i=0;i<squares.length;i++){
		square=squares[i];
		if(square.status===0){
			square.status=1;
		square.t = 0;

		square.x = Math.random()*CELL_COL >>0;
		square.y = Math.random()*CELL_ROW >>0;
break;
		}
}
}
function main2(){
		for(var i=0;i<dst.length;i++){
			dst[i]++;
		}
	rendering();
}
var step_count=0;
function main(){
	go_stop=!go_stop;
}
function step(){


	for(var i=0;i<3;i++){
		createSquare();
	}
	for(var i=0;i<squares.length;i++){
		var square=squares[i];
		if(square.status===0)continue;
		square.move();
	}

	rendering();
}
function loop(){
	window.requestAnimationFrame(loop);
	if(!go_stop){
		return;
	}
	step_count++;
	if(step_count<4){
		return;
	}
	step_count=0;

	step();

}
function reset(){
	canvas.width = img.naturalWidth
	canvas.height = img.naturalHeight

CELL_SIZE = (canvas.width /16)|0;
_CELL_SIZE = 1/CELL_SIZE;
dst_width =(canvas.width* _CELL_SIZE|0)+1;
CELL_ROW = (canvas.height* _CELL_SIZE|0)+1;
CELL_COL = (canvas.width* _CELL_SIZE|0)+1;


	src = new Int8Array(canvas.width*canvas.height);

	dst = new Int8Array(CELL_COL  * CELL_ROW);

		ctx.drawImage(img,0,0);
		imgdata = ctx.getImageData(0,0,canvas.width,canvas.height);
		var sidd = imgdata.data;

		for(var i=0;i<src.length;i++){
			var pidx = i<<2;

			var R= Math.pow(sidd[pidx+0]/255,2.2)
			var G =Math.pow(sidd[pidx+1]/255,2.2)
			var B = Math.pow(sidd[pidx+2]/255,2.2);
			var mono = 0.2126*R + 0.7152*G + 0.0722*B
			mono = Math.pow(mono,1/2.2)*255;
			src[i]= 0
			for(var j=1;j<4;j++){
				if(mono<64*j+2){
					break;
				}
				src[i]= j

			}		
		}

		for(var i=0;i<dst.length;i++){
			dst[i]= 0;
		}



		for(var i=0;i<dst.length;i++){
			dst[i]=0;
		}
	for(var i=0;i<squares.length;i++){
		var square=squares[i];
		square.status=0;
	}
	rendering();
}
function rendering(){
	var width = canvas.width;
	var data = imgdata.data;
	for(var y = 0;y<canvas.height;y++){
	for(var x = 0;x<canvas.width;x++){
		var i = (y*_CELL_SIZE|0) *CELL_COL + (x*_CELL_SIZE|0);
		var idx2 = (y*width+x);
		var idx = (y*width+x)<<2;

		palette_index = dst[i]+src[idx2];
		palette_index = Math.max(Math.min(3,palette_index),0);
		var p = palette[palette_index];

	data[idx] = p[0];
	data[idx+1] =p[1];
	data[idx+2] = p[2];
	data[idx+3] = p[3];
}
}

	ctx.putImageData(imgdata,0,0);


	ctx.fillStyle="rgb(128,128,128)";
	for(var i=0;i<squares.length;i++){
		var square=squares[i];
		if(square.status===0)continue;
		square.draw();
	}
}



window.onload=()=>{
canvas = document.getElementById("c");
ctx = canvas.getContext("2d");


img =document.getElementById("img");


}
function fileload(){
	img.src = URL.createObjectURL(event.target.files[0]);
	img.onload=()=>{
		reset();
	}
}

loop();
