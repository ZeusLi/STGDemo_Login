
var bcx=null;
//使用vuejs排版业务逻辑
var main = new Vue({
    //绑定业务根元素
    el:'#main',
    //元素中需要使用到的数据
    data:{
        //状态控制显示
        //是否开始游戏
        isgame:false,
        /* 
        login代表登陆页面
        logup代表注册页面
        menu菜单
        trade交易所
        usercenter用户中心
        */
        now:'index',

        account_name:"",
        pwd:"",
        //公钥
        publickey:'',
        //控制遮罩层
        isshow:false,
        isinfo:false,
        //账户私钥
        //私钥
        accountprivatekey:'',
        //已拥有的飞机列表
        nowlists:['1'],
        //当前进行游戏的飞机
        nowplant:1,
        //当前已经拥有的飞机名称
        nowlistname:['维拉托尔级'],
        //当前已经拥有的飞机价格
        nowlistprice:[0],
        //存入账户信息
        //账户id
        accountinfo:{
            account_name:""
        },
        //判断是不是存储过一次信息
        islogin:false,
        NHAssets:[],
        loading:false,
        loadingText:"Loading..."
    },
    created(){
        this.init();
    },
    //元素方法
    methods:{
        init(){
           bcx=new BCX({
                ws_node_list:[	
                    {url:"ws://47.93.62.96:8049",name:"Cocos - China - Xiamen"} ,
                ],
                networks:[
                    {
                        core_asset:"COCOS",
                        chain_id:"7d89b84f22af0b150780a2b121aa6c715b19261c8b7fe0fda3a564574ed7d3e9" 
                    }
                ], 
                faucet_url:"http://47.93.62.96:8041",
                auto_reconnect:true
           });

        },
        //login
        login(){
            this.loading=true;
            //登录
             bcx.passwordLogin({
                account:this.account_name,
                password:this.pwd
            }).then(res=>{
                this.loading=false;
                if(res.code==1){
                    this.now = 'menu';
                    this.accountinfo=res.data;
                    sessionStorage.accountinfo=res.data;
                    this.getData(false);
                }else{
                    alert(res.message)
                }
            })
        },
        //获取并保存账户信息
        getData(ii = false){
            bcx.queryAccountNHAssets({
                account:this.accountinfo.account_name,
                page:1,
                pageSize:10
            }).then(res=>{
                console.info("res",res);
                if(res.code==1){
                    this.NHAssets=res.data;
                    // this.total=res.total

                   if(ii){
                     this.now = 'choiseplant';
                   }
                }
            })
      
        },
        //返回按钮
        back(){
            this.now == "login" || this.now == "logup"?
                this.now = 'index' : this.now = 'menu';                
        },
        //跳到选择飞机
        choiseplant(){
            this.getData(true);
        },
        //进行飞机选择
        change(v){
            console.log(v);
            if (this.nowlists.join(',').indexOf(v)==-1){
                alert('您暂未拥有该飞机!请返回购买飞机后刷新');
            }else{
                this.nowplant=v;
            }
        },
        //开始游戏
        playgame(){
            if(this.nowplant==2){
                heros[0] = new Image();
                heros[0].src = "images/hero_1.png";
                heros[1] = new Image();
                heros[1].src = "images/hero_2.png";
                heros[2] = new Image();
                heros[2].src = "images/hero_1_blowup_n1.png";
                heros[3] = new Image();
                heros[3].src = "images/hero_1_blowup_n2.png";
                heros[4] = new Image();
                heros[4].src = "images/hero_1_blowup_n3.png";
                heros[5] = new Image();
                heros[5].src = "images/hero_1_blowup_n4.png";
                // var bullet = new Image();
                bullet.src = "images/bullet.png";
            } else if (this.nowplant == 1){
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
                // var bullet = new Image();
                bullet.src = "images/bullet.png";
            }else{
                heros[0] = new Image();
                heros[0].src = "images/hero_3.png";
                heros[1] = new Image();
                heros[1].src = "images/hero_4.png";
                heros[2] = new Image();
                heros[2].src = "images/hero_2_blowup_n1.png";
                heros[3] = new Image();
                heros[3].src = "images/hero_2_blowup_n2.png";
                heros[4] = new Image();
                heros[4].src = "images/hero_2_blowup_n3.png";
                heros[5] = new Image();
                heros[5].src = "images/hero_2_blowup_n4.png";
                // var bullet = new Image();
                bullet.src = "images/bullet-.png";
            }
            this.isgame = true;
            document.getElementById('hidepanel').style.display = 'none';
            document.getElementById('main').style.display = 'none';
        }
    }
})