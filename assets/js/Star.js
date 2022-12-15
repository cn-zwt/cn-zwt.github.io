//宇宙特效
"use strict";
var canvas = document.getElementById('canvas'),
	ctx = canvas.getContext('2d'),
	w = canvas.width = window.innerWidth,//1536
	h = canvas.height = window.innerHeight,//316

	hue = 217,
	stars = [],
	count = 0,
	maxStars = 1300;//星星数量

var canvas2 = document.createElement('canvas'),
	ctx2 = canvas2.getContext('2d');
canvas2.width = 100;
canvas2.height = 100;
var half = canvas2.width / 2,
	gradient2 = ctx2.createRadialGradient(half, half, 0, half, half, half);
gradient2.addColorStop(0.025, '#CCC');
gradient2.addColorStop(0.1, 'hsl(' + hue + ', 61%, 33%)');
gradient2.addColorStop(0.25, 'hsl(' + hue + ', 64%, 6%)');
gradient2.addColorStop(1, 'transparent');

ctx2.fillStyle = gradient2;
ctx2.beginPath();
ctx2.arc(half, half, half, 0, Math.PI * 2);
ctx2.fill();

// End cache

function random(min, max) {
	if (arguments.length < 2) {
		max = min;
		min = 0;
	}

	if (min > max) {
		var hold = max;
		max = min;
		min = hold;
	}

	return Math.floor(Math.random() * (max - min + 1)) + min;
}

//轨道
function maxOrbit(x, y) {
	var max = Math.max(x, y),//1536,316
		diameter = Math.round(Math.sqrt(max * max + max * max));//2172,Math.round:四舍五入; Math.sqrt:开根号
	return diameter / 2;//1086
	//星星移动范围，值越大范围越小，
}

var Star = function () {

	this.orbitRadius = random(maxOrbit(w, h));//orbit:轨道,0~1086
	this.radius = random(60, this.orbitRadius) / 8;
	//星星大小
	this.orbitX = w / 2;//768
	this.orbitY = h / 2;//158
	this.timePassed = random(0, maxStars);//0~1300
	this.speed = random(this.orbitRadius) / 50000;
	//星星移动速度
	this.alpha = random(2, 10) / 10;

	count++;
	stars[count] = this;
}

Star.prototype.draw = function () {
	var x = Math.sin(this.timePassed) * this.orbitRadius + this.orbitX,
		y = Math.cos(this.timePassed) * this.orbitRadius + this.orbitY,
		twinkle = random(10);

	if (twinkle === 1 && this.alpha > 0) {
		this.alpha -= 0.05;
	} else if (twinkle === 2 && this.alpha < 1) {
		this.alpha += 0.05;
	}

	ctx.globalAlpha = this.alpha;
	ctx.drawImage(canvas2, x - this.radius / 2, y - this.radius / 2, this.radius, this.radius);
	this.timePassed += this.speed;
}

for (var i = 0; i < maxStars; i++) {
	new Star();
}

function animation() {
	ctx.globalCompositeOperation = 'source-over';//后绘制的图形位于先绘制的图形上方
	ctx.globalAlpha = 0.5; //尾巴,透明度
	ctx.fillStyle = 'hsla(' + hue + ', 64%, 6%, 2)';//H:色相,S:饱和度,L:明度;
	ctx.fillRect(0, 0, w, h)

	ctx.globalCompositeOperation = 'lighter';//后绘制的图形与先绘制的图形重叠部分的值相加,使该部分变亮。
	for (var i = 1, l = stars.length; i < l; i++) {
		stars[i].draw();//star原型上的方法
	};

	window.requestAnimationFrame(animation);
}

animation();
