// 0 游戏的初始化
// 0.1 获取<canvas>元素,并且创建画布对象
var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
// 0.2 定义5个常量,分别表示游戏的5个阶段
const START = 0;	// 第一阶段:欢迎阶段
const STARTTING = 1;// 第二阶段:过渡动画阶段
const RUNNING = 2;	// 第三阶段:运行阶段
const PAUSED = 3;	// 第四阶段:暂停阶段
const GAMEOVER = 4;	// 第五阶段:结束阶段
// 0.3 定义游戏的状态,表示当前是哪个阶段
var state = START;
// 0.4 获取当前画布的宽度和高度
const WIDTH = canvas.width;
const HEIGHT = canvas.height;
var life = 3;
var score = 0;

// 1 完成游戏的开始(欢迎)阶段
// 1.1 完成背景图片的绘制及移动的效果
// 1.1.1 加载游戏背景图片
var bg = new Image();
bg.src = "images/background.png";
// 1.1.2 初始化游戏背景图片的数据
var SKY = {
    imgs: bg,//背景图片
    width: 750,
    height: 852
}
// 1.1.3 创建背景图片的构造器
function Sky(config) {
    // 定义属性
    this.imgs = config.imgs;
    this.width = config.width;
    this.height = config.height;
    // 定义绘制的第一张图片的y值
    this.y1 = -this.height;
    // 定义绘制的第二张图片的y值
    this.y2 = 0;
    // 定义用于控制背景图片移动速度
    this.time = 0;
    // 定义绘制方法
    this.paint = function () {
        context.drawImage(this.imgs, 0, this.y1);// 第一张
        context.drawImage(this.imgs, 0, this.y2);// 第二张
    }
    // 定义移动方法
    this.step = function () {
        this.time++;
        if (this.time % 5 == 0) {
            // 两张图片向下移动 - y++
            this.y1++;
            this.y2++;
        }
        // 判断两张图片是否移出画面
        if (this.y1 > HEIGHT) {
            this.y1 = -this.height;
        }
        if (this.y2 > HEIGHT) {
            this.y2 = -this.height;
        }
    }
}
// 1.1.4 创建背景图片的对象
var sky = new Sky(SKY);

// 1.2 完成游戏LOGO图片的绘制
// 1.2.1 加载游戏LOGO图片
var logo = new Image();
logo.src = "images/start.png";

// 1-2 从第一阶段到第二阶段
canvas.onclick = function () {
    // 保证游戏当前是第一阶段
    if (state == START) {
        state = STARTTING;
    }
}

// 2. 完成游戏的第二阶段(过渡阶段)
// 2.1 加载动画图片
var loadings = [];
loadings[0] = new Image();
loadings[0].src = "images/game_loading1.png";
loadings[1] = new Image();
loadings[1].src = "images/game_loading2.png";
loadings[2] = new Image();
loadings[2].src = "images/game_loading3.png";
loadings[3] = new Image();
loadings[3].src = "images/game_loading4.png";
// 2.2 初始化动画图片的数据内容
var LOADING = {
    imgs: loadings,
    width: 186,
    height: 38,
    sum: loadings.length
}
// 2.3 创建动画图片的构造器
function Loading(config) {
    this.imgs = config.imgs;
    this.width = config.width;
    this.height = config.height;
    this.sum = config.sum;
    // 定义存储图片数组的索引值
    this.index = 0;
    // 定义切换动画图片速度
    this.time = 0;
    // 定义绘制方法
    this.paint = function () {
        context.drawImage(this.imgs[this.index], 0, HEIGHT - this.height);
    }
    // 定义动画方法
    this.step = function () {
        this.time++;
        if (this.time % 20 == 0) {
            // 切换数组的角标
            this.index++;
        }
        // 判断this.index == 4,游戏进入到第三阶段
        if (this.index == this.sum) {
            // 游戏进入到第三阶段
            state = RUNNING;
        }
    }
}
// 2.4 创建动画图片的对象
var loading = new Loading(LOADING);

// 3. 完成游戏的第三阶段(运行阶段)
// 3.1 我方飞机的逻辑
// 3.1.1 加载我方飞机的图片
var heros = [];
heros[0] = new Image();
heros[0].src = "images/hero1.png";
heros[1] = new Image();
heros[1].src = "images/hero2.png";
heros[2] = new Image();
heros[2].src = "images/hero_blowup_n1.png";
heros[3] = new Image();
heros[3].src = "images/hero_blowup_n2.png";
heros[4] = new Image();
heros[4].src = "images/hero_blowup_n3.png";
heros[5] = new Image();
heros[5].src = "images/hero_blowup_n4.png";
// 3.1.2 初始化我方飞机的数据内容
var HERO = {
    imgs: heros,
    width: 99,
    height: 124,
    sum: heros.length,
    length: 2
}
// 3.1.3 创建我方飞机的构造器
function Hero(config) {
    this.imgs = config.imgs;
    this.width = config.width;
    this.height = config.height;
    this.sum = config.sum;
    // 定义存储图片的数组索引值
    this.index = 0;
    // 定义绘制我方飞机的坐标值
    this.x = (WIDTH - this.width) / 2;
    this.y = HEIGHT - this.height - 30;
    // 定义创建子弹速度
    this.time = 0;
    this.down = false;
    this.length = config.length;
    // 定义绘制方法
    this.paint = function () {
        
        context.drawImage(this.imgs[this.index], this.x, this.y);
    }
    // 定义动画方法
    this.step = function () {
        // 控制this.index的值 - 0和1之间的切换
        /* 0 1 2(0)
        this.index++;
        if(this.index == 2){
            this.index = 0;
        }*/
        if (this.down) {
            this.index++;
            if (this.index == this.sum) {
                if (life > 0) {
                    //重新创建我方飞机
                    hero = new Hero(HERO);
                } else {
                    state = GAMEOVER;
                }
                this.index = this.sum - 1;
            }
        } else {
            // 0 1 2(0)
            this.index++;
            this.index = this.index % 2;
        }
    }

    // 增加我方飞机的射击方法
    this.shoot = function () {
        this.time++;
        if (this.time % 20 == 0) {
            // 创建子弹对象,并且添加到数组中
            var bullet = new Bullet(BULLET);
            bullets[bullets.length] = bullet;
        }
    }
    //增加我方飞机被撞击后的逻辑
    this.bang = function () {
        life--;
        this.down = true;
        this.index = this.length;
    }
}

// 3.1.4 创建我方飞机的对象
var hero = new Hero(HERO);
// 3.1.5 为<canvas>元素绑定mousemove事件
canvas.onmousemove = function (event) {
    if (state == RUNNING) {
        // a. 获取鼠标的当前坐标值(x,y)
        var x = event.offsetX;
        var y = event.offsetY;
        // b. 将鼠标的当前坐标值,赋值给我方飞机的坐标值
        hero.x = x - hero.width / 2;
        hero.y = y - hero.height / 2;
    }
}
// 3.2 完成子弹的逻辑
// 3.2.1 加载子弹图片
// 3.2.2 初始化子弹的数据内容
var bullet = new Image();
bullet.src = "images/bullet.png";
var BULLET = {
    imgs: bullet,
    width: 9,
    height: 21
}
// 3.2.3 创建子弹的构造器
function Bullet(config) {
    this.imgs = config.imgs;
    this.width = config.width;
    this.height = config.height;
    // 定义子弹的坐标值
    this.x = hero.x + hero.width / 2 - this.width / 2;
    this.y = hero.y - this.height - 10;
    this.canDelete = false;//
    // 定义绘制子弹的方法
    this.paint = function () {
        context.drawImage(this.imgs, this.x, this.y);//中单排子弹
        // context.drawImage(this.imgs,this.x-5,this.y);//双排子弹
        // context.drawImage(this.imgs,this.x+5,this.y);//双排子弹
        // context.drawImage(this.imgs,this.x-35,this.y+50);//左单排子弹
        // context.drawImage(this.imgs,this.x+35,this.y+50);//右单排子弹
    }
    // 定义移动子弹的方法
    this.step = function () {
        this.y -= 2;
    }
    this.bang = function () {
        this.canDelete = true;
    }
}
// 3.2.4 创建用于存储子弹对象的数组
var bullets = [];
// 3.2.5 定义用于绘制所有子弹的函数
function paintBullets() {
    for (var i = 0; i < bullets.length; i++) {
        bullets[i].paint();
    }
}
// 3.2.6 定义用于移动所有子弹的函数
function stepBullets() {
    for (var i = 0; i < bullets.length; i++) {
        bullets[i].step();
    }
}
// 3.2.7 定义用于移出子弹的函数
function delBullets() {
    // 遍历所有的子弹
    for (var i = 0; i < bullets.length; i++) {
        // 判断子弹 y <= -子弹的高度
        if (bullets[i].y <= -bullets[i].height || bullets[i].canDelete) {
            bullets.splice(i, 1);
        }
    }
}
// 3.3 完成敌方飞机的逻辑
// 3.3.1 加载敌方飞机的图片
var enemies1 = [];//小飞机
enemies1[0] = new Image();
enemies1[0].src = "images/enemy1.png";
enemies1[1] = new Image();
enemies1[1].src = "images/enemy1_down1.png";
enemies1[2] = new Image();
enemies1[2].src = "images/enemy1_down2.png";
enemies1[3] = new Image();
enemies1[3].src = "images/enemy1_down3.png";
enemies1[4] = new Image();
enemies1[4].src = "images/enemy1_down4.png";
var enemies2 = [];//中飞机
enemies2[0] = new Image();
enemies2[0].src = "images/enemy2.png";
enemies2[1] = new Image();
enemies2[1].src = "images/enemy2_down1.png";
enemies2[2] = new Image();
enemies2[2].src = "images/enemy2_down2.png";
enemies2[3] = new Image();
enemies2[3].src = "images/enemy2_down3.png";
enemies2[4] = new Image();
enemies2[4].src = "images/enemy2_down4.png";
var enemies3 = [];//大飞机
enemies3[0] = new Image();
enemies3[0].src = "images/enemy3_n1.png";
enemies3[1] = new Image();
enemies3[1].src = "images/enemy3_n2.png";
enemies3[2] = new Image();
enemies3[2].src = "images/enemy3_down1.png";
enemies3[3] = new Image();
enemies3[3].src = "images/enemy3_down2.png";
enemies3[4] = new Image();
enemies3[4].src = "images/enemy3_down3.png";
enemies3[5] = new Image();
enemies3[5].src = "images/enemy3_down4.png";
enemies3[6] = new Image();
enemies3[6].src = "images/enemy3_down5.png";
enemies3[7] = new Image();
enemies3[7].src = "images/enemy3_down6.png";

// 3.3.2 初始化敌方飞机的数据内容
var ENEMY1 = {
    imgs: enemies1,
    width: 57,
    height: 51,
    sum: enemies1.length,
    length: 1,
    type: 0,//敌方飞机的类型
    life: 1,
    score: 1
}
var ENEMY2 = {
    imgs: enemies2,
    width: 69,
    height: 95,
    sum: enemies2.length,
    length: 1,
    type: 1, //敌方飞机的类型
    life: 3,
    score: 5
}
var ENEMY3 = {
    imgs: enemies3,
    width: 169,
    height: 258,
    sum: enemies3.length,
    length: 2,
    type: 2, //敌方飞机的类型
    life: 10,//敌方飞机的生命值
    score: 10
}
// 3.3.3 创建敌方飞机的构造器
function Enemy(config) {
    this.imgs = config.imgs;
    this.width = config.width;
    this.height = config.height;
    this.sum = config.sum;
    this.type = config.type;
    this.life = config.life;
    // 定义绘制敌方飞机的坐标值
    this.x = Math.random() * (WIDTH - this.width);
    this.y = -this.height;
    // 定义敌方飞机的速度
    this.time = 0;
    // 定义数组的索引值
    this.index = 0;
    this.down = false;//true表示执行爆破动画
    this.canDelete = false;//true表示删除
    this.length = config.length;//定义图片的
    this.score = config.score;//定义敌方飞机对应得分
    // 定义绘制方法
    //index角标越界的错
    this.paint = function () {
        context.drawImage(this.imgs[this.index], this.x, this.y);
    }
    // 定义移动方法
    this.step = function () {
        //判断this.down的值
        if (this.down) {
            //操作this.down的值
            //切换爆破动画的图片角标++
            this.time++;
            if (this.time % 5 == 0) {
                this.index++;
            }
            /*if(this.type==2){//this.index=this.length;与这个意思一样
                this.index=2;
            }else{
                this.index=1;
            }*/
            //判断爆破动画是否执行完毕
            if (this.index == this.sum) {
                this.canDelete = true;
                this.index = this.sum - 1;
                score += this.score;
            }
        } else {
            // 敌方飞机自上向下移动
            this.time++;
            switch (this.type) {
                case 0://小飞机
                    this.y++;
                    break;
                case 1://中飞机
                    if (this.time % 2 == 0) {
                        this.y++;
                    }
                    break;
                case 2://大飞机
                    this.index++;
                    this.index = this.index % 2;
                    if (this.time % 5 == 0) {
                        this.y++;
                    }
                    break;
            }
        }
    }
    //判断一个敌机是否被撞击的方法
    this.hit = function (compant) {
        return compant.x + compant.width > this.x &&
            compant.y < this.y + this.height &&
            compant.x < this.x + this.width &&
            compant.y + hero.height > this.y;
    }
    this.bang = function () {
        //敌方飞机的生命值-1
        this.life--;
        if (this.life == 0) {
            //执行爆破动画
            this.down = true;
            this.index = this.length;
        }
    }
}
// 3.3.4 创建用于存储敌方飞机的数组
var enemies = [];
// 3.3.5 创建用于创建敌方飞机的函数
function createEmeies() {
    /*
     * 创建敌方飞机 - 小、中、大
     * * 创建一个 0-100 的随机整数
     * * 小飞机 - 数量最多
     *   * 0-90 几率
     * * 中飞机 - 数量居中(比小飞机数量少)
     *   * 90-99 几率
     * * 大飞机 - 数量最少
     *   * 人为规定逻辑 - 只能出现一个
     */
    // a. 创建一个 0-100 的随机整数
    var num = Math.floor(Math.random() * 100);
    if (num <= 80) {// 小飞机
        var enemy = new Enemy(ENEMY1);
        enemies[enemies.length] = enemy;
    } else if (num < 90) {//中飞机
        var enemy = new Enemy(ENEMY2);
        enemies[enemies.length] = enemy;
    } else {
        //判断数组的第一个位置如果不是大飞机,创建大飞机添加到数组的第一个位置上(enemies[0])
        if (enemies.length > 0 && enemies[0].type != 2) {//创建大飞机
            var enemy = new Enemy(ENEMY3);
            enemies.splice(0, 0, enemy);
        }
    }
}
// 3.3.6 创建用于绘制所有敌方飞机的函数
function paintEnemies() {
    for (var i = 0; i < enemies.length; i++) {
        enemies[i].paint();
    }
}
// 3.3.7 创建用于移动所有敌方飞机的函数
function stepEnemies() {
    for (var i = 0; i < enemies.length; i++) {
        enemies[i].step();
    }
}
// 3.3.8 创建移出敌方飞机的函数
function delEnemies() {
    for (var i = 0; i < enemies.length; i++) {
        if (enemies[i].y > HEIGHT || enemies[i].canDelete) {
            enemies.splice(i, 1);
        }
    }
}

// 创建用于判断敌方飞机是否被撞击的函数
function checkHit() {
    // a. 遍历存储敌方飞机的数组
    for (var i = 0; i < enemies.length; i++) {
        // b. 获取每个敌方飞机
        var enemy = enemies[i];
        // c. 判断我方飞机是否撞击敌方飞机
        if (enemy.hit(hero)) {
            // 判断bang()方法是否执行
            if (!enemy.down && !hero.down) {
                // 处理敌方飞机被撞击后的逻辑
                enemy.bang();
                // 处理我方飞机被撞击后的逻辑
                hero.bang();
            }
        }
        /*
         * d. 判断子弹是否撞击敌方飞机
         *  * 遍历所有的子弹(存储子弹的数组)
         *  * 判断每个子弹是否撞击敌方飞机
         */
        for (var j = 0; j < bullets.length; j++) {
            // 获取每个子弹
            var bullet = bullets[j];
            if (enemy.hit(bullet)) {
                if (!enemy.down && !bullet.canDelete) {
                    // 处理敌方飞机被撞击后的逻辑
                    enemy.bang();
                    // 处理子弹被撞击后的逻辑
                    bullet.bang();
                }
            }
        }
    }
}
// 3.3.10 创建绘制游戏得分和我方飞机生命值的函数
function paintText() {
    context.font = "bold 24px 微软雅黑";
    context.fillText("SCORE: " + score, 10, 30);
    context.fillText("LIFE: " + life, 400, 30);
}
//完成游戏暂停阶段
canvas.onmouseover = function () {
    if (state == PAUSED) {
        state = RUNNING;
    }
}
//鼠标离开游戏画面-暂停
canvas.onmouseout = function () {
    if (state == RUNNING) {
        state = PAUSED;
    }
}



//绘制暂停图标
var paused = new Image();
paused.src = "images/game_pause_nor.png";
var d = 1;
//完成游戏结束的阶段
function gameOver() {
    context.font = "bold 48px 微软雅黑";
    context.fillText("GAME OVER", WIDTH / 2 - 150, HEIGHT / 2);
    if(d = 1){
        main.isgame=false;
        state = START;
        document.getElementById('hidepanel').style.display = 'block';
        d++;
        loading.index = 0;
        life = 3;

        main.now = 'menu';
        score = 0;
    }
}
// 定义综合速度
var time = 0;
// 定义游戏的核心控制器
setInterval(function () {
    /*
    if(state==START){
        sky.paint();//绘制背景图片
        sky.step();//移动背景图片
        context.drawImage(logo,20,0);//绘制LOGO
    }else if(state==STARTTING){
	
    }*/
    sky.paint();//绘制背景图片
    sky.step();//移动背景图片
    switch (state) {
        case START:
            context.drawImage(logo, 20, 0);//绘制LOGO
            break;
        case STARTTING:
            loading.paint();//绘制动画图片
            loading.step();//切换动画图片
            break;
        case RUNNING:
            hero.paint();//绘制我方飞机
            hero.step();//控制我方飞机动画
            hero.shoot();//我方飞机的射击功能
            paintBullets();//绘制所有子弹
            stepBullets();//移动所有子弹
            delBullets();//移出子弹
            time++;
            if (time % 50 == 0) {
                createEmeies();//创建敌方飞机
            }
            paintEnemies();//绘制敌方飞机
            stepEnemies();//移动敌方飞机
            delEnemies();
            checkHit();//爆破方法
            paintText();//绘制得分和生命值
            break;
        case PAUSED:
            hero.paint();
            paintBullets();
            paintEnemies();
            paintText();
            context.drawImage(paused, WIDTH / 2 - 30, HEIGHT / 2 - 22.5);
            break;
        case GAMEOVER:
            hero.paint();
            paintBullets();
            paintEnemies();
            paintText();
            gameOver();
            break;
    }
}, 10);


var najax = {
    go: function (obj) {//原生js实现ajax
        var xhr = this.createXmlHttp();
        if (!xhr) {
            alert("您的系统或浏览器不支持XMLHttpRequest对象！");
            return;
        }

        var _user = window.localStorage.getItem("userData");

        if (_user && obj.data) {
            _user=JSON.parse(_user);
            obj.data.mobile = _user.mobile;
            obj.data.token = encodeURIComponent(_user.token);
        }


        obj.url += (obj.url.indexOf("?") >= 0 ? "&" : "?") + ("rand=" + Math.random());
        obj.data = this.urlParamsFormat(obj.data);
        obj.async = typeof obj.async == "undefined" ? true : obj.async;
        obj.method = typeof obj.method == "undefined" ? "get" : obj.method;

        if (obj.method === "get") {
            obj.url +="&"+obj.data;
        }

        xhr.open(obj.method, obj.url, obj.async);// false是同步 true是异步

        if (obj.method === "post") {
            xhr.setRequestHeader("Authorization", "YnVmZW5nQDIwMThidWZlbmc=");
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.send(obj.data);
        } else {
            xhr.send(null);
        }

        // 异步
        if (obj.async) {
            // 异步的时候需要触发onreadystatechange事件
            xhr.onreadystatechange = function () {
                // 执行完成
                if (xhr.readyState == 4) {
                    callBack();
                }
            }
        } else { // 同步
            callBack();
        }

        // 返回数据
        function callBack() {
            // 判断是否返回正确
            if (xhr.status == 200) {
                obj.success(xhr.responseText);
                var data;
                try{
                    data = JSON.parse(xhr.responseText);
                    if(data.code+""=="21"){
                        $common.showAlertSmall("登录超时,请重新登录");
                        window.localStorage.setItem("userData","");
                        setTimeout(function(){window.location.reload();},1000);
                    }
                }catch(e){

                }
            } else {
                var msg = "网络繁忙，请稍后再试或联系管理员。" + "xhr.status：" + xhr.status + "，xhr.statusText：" + xhr.statusText
                obj.error ? obj.error(msg) : alert(msg);
            }
        }
    },

    createXmlHttp: function () {//根据不同的浏览器使用相应的方式来创建异步对象
        var xhobj = false;
        try { xhobj = new XMLHttpRequest(); }
        catch (e1) {
            try {
                xhobj = new ActiveXObject("Msxml2.XMLHTTP"); //iemsxml3.0+
            } catch (e2) {
                try {
                    xhobj = new ActiveXObject("Micsoft.XMLHTTP"); //iemsxml2.6
                }
                catch (e3) {
                    xhobj = false;
                }
            }
        }
        if (!xhobj && typeof XMLHttpRequest != 'undefined') {//Firefox,Opera 8.0+,Safari.谷歌浏览器
            xhobj = new XMLHttpRequest();
        }
        return xhobj;
    },

    urlParamsFormat: function (data) {
        var arr = [];
        for (var keyName in data) {
            arr.push(encodeURIComponent(keyName) + "=" + encodeURIComponent(data[keyName]));
        }
        return arr.join("&");
    }
}