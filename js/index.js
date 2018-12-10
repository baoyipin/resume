let loadingRender = (function () {
    let $loadingBox = $(".loadingBox");
    let $run = $loadingBox.find(".run");
    //计算加载进度，控制滚动条宽度
    let imgList = ["img/icon.png","img/zf_concatAddress.png",
        "img/zf_concatInfo.png","img/zf_concatPhone.png",
        "img/zf_course.png","img/zf_course1.png",
        "img/zf_course2.png","img/zf_course3.png",
        "img/zf_course4.png","img/zf_course5.png",
        "img/zf_course6.png","img/zf_cube1.png",
        "img/zf_cube2.png","img/zf_cube3.png",
        "img/zf_cube4.png","img/zf_cube5.png",
        "img/zf_cube6.png","img/zf_cubeBg.jpg",
        "img/zf_cubeTip.png","img/zf_emploment.png",
        "img/zf_messageArrow1.png","img/zf_messageArrow2.png",
        "img/zf_messageChat.png","img/zf_messageKeyboard.png",
        "img/zf_messageLogo.png","img/zf_messageStudent.png",
        "img/zf_outline.png","img/zf_phoneBg.jpg",
        "img/zf_phoneDetail.png","img/zf_phoneListen.png",
        "img/zf_phoneLogo.png","img/zf_return.png",
        "img/zf_style1.jpg","img/zf_style2.jpg",
        "img/zf_style3.jpg","img/zf_styleTip1.png",
        "img/zf_styleTip2.png","img/zf_teacher1.png",
        "img/zf_teacher2.png","img/zf_teacher3.jpg",
        "img/zf_teacher4.png","img/zf_teacher5.png",
        "img/zf_teacher6.png","img/zf_teacherTip.png"];
    let total = imgList.length;
    let cur = 0;
    let computedBar = function () {
        imgList.forEach(function (item) {
            let tempImg = new Image;
            tempImg.src = item;
            tempImg.onload=function () {
                cur ++;
                tempImg = null;
                run();
            }
        })
    };
    let run =function () {
        $run.css("width",cur/total*100+"%");
        if (cur>=total){
            let delayTimer = setTimeout(()=>{
                $loadingBox.remove();
                phoneRender.init();
                clearTimeout(delayTimer)
            },1000)
        }
    };
    return {
        init:function () {
            $loadingBox.css("display","block");
            computedBar();
        }
    }
})();

let phoneRender = (function () {
    let $phoneBox = $(".phoneBox");

    let $time = $phoneBox.find(".time");
    let $listen = $(".listen");
    let $detail = $(".detail");
    let $listenTouch = $listen.find(".touch");
    let $detailTouch = $detail.find(".touch");
    let audioBell = $("#audioBell")[0];
    let audioSay = $("#audioSay")[0];
    let $phonePlan = $.Callbacks();

    /*控制盒子隐藏*/
    $phonePlan.add(function () {
        $listen.remove();
        $detail.css("transform","translateY(0)");
    });
    /*控制say播放*/
    $phonePlan.add(()=>{
        audioBell.pause();
        audioSay.play();
        $time.css("display","block");
        audioSay.loop = false;
        let timer = setInterval(() => {
            //获取总时间和已经播放的时间 单位是s
            let duration = audioSay.duration,
                current = audioSay.currentTime;

            let minute = Math.floor(current / 60);//算出分钟
            let second = Math.floor(current - minute * 60);//除了分钟以外剩下的值

            minute < 10 ? minute = "0" + minute : null;
            second < 10 ? second = "0" + second : null;

            $time.text(`${minute}:${second}`);

            //播放结束
            audioSay.addEventListener("ended",function () {
                clearInterval(timer);
                enterNext();
            });
            /*if (current >= duration) {

            }*/
        }, 1000)
    });
    /*进入message*/
    $phonePlan.add(() => $detailTouch.tap(enterNext));
    let enterNext = function () {
        audioSay.pause();
        $phoneBox.remove();
        messageRender.init();
    };
    /*let timer = null;
    let clock = function () {
        $time.css("display","block");
        let start = 0;
        timer = setInterval(()=>{
            $time.text("00:"+(start>=10?++start:"0"+(++start)));
        },1000);
    };
    $phonePlan.add(clock);
    let stop = function () {
        $phoneBox.remove();
        messageRender.init();
    };
    let autoStop = function () {
        audioSay.loop = false;
        audioSay.addEventListener("ended",()=>{
            clearInterval(timer);
            stop();
        });
    };
    autoStop();
    let manualStop = function () {
        $detailTouch.on("tap",function (e) {
                $phoneBox.remove();
                messageRender.init();
                clearInterval(timer);
        })
    };
    manualStop();*/

    return {
        init:function () {
            $phoneBox.css("display","block");
            audioBell.play();
            $listenTouch.tap($phonePlan.fire);
        }
    }
})();
//phoneRender.init();
let messageRender = (function () {
    let $messageBox = $(".messageBox");
    let $loadingBox = $(".loadingBox");
    let $phoneBox = $(".phoneBox");
    let $chatRoom = $messageBox.find(".chatRoom");
    let $chatList = $messageBox.find("li");
    let $keyboard  = $messageBox.find(".keyboard");
    let $keyboardText = $messageBox.find("span");
    let $submit = $keyboard.find(".submit");
    let musicAudio = $("#musicAudio")[0];
    let $plan = $.Callbacks();
    let step = -1;
    let autoTimer = null;
    let interval = 1000;
    let moveUp = 0;
    $plan.add(()=>{
        autoTimer = setInterval(()=>{
            step++;
            let $cur=$chatList.eq(step);
            $cur.css({
                opacity:1,
                transform:'translateY(0)'
            })
            //第三天展示之后立即调取键盘
            if (step === 2){//不需要继续展示
                clearInterval(autoTimer);
                $cur.one("transitionend",()=>{
                    $keyboard.css({
                        transform:"translateY(0)"
                    }).one("transitionend",textInput)
                })
            }
            //ul整体上移
            if (step >= 4){
                moveUp+=$cur[0].offsetHeight;
                $chatRoom.css({
                    transform:`translateY(-${moveUp}px)`
                });
                if (step>=$chatList.length-1){
                    clearInterval(autoTimer);
                   let delayTimer = setTimeout(()=>{
                       musicAudio.pause();
                       $messageBox.remove();
                       cubeRender.init();
                       clearTimeout(delayTimer);
                   },interval);
                }
            }
        },interval)
    });
    let textInput = ()=>{
        let text = $keyboardText.html();
        $keyboardText.css("display","block").html("");
        let timer = null;
        let n = -1;
        timer = setInterval(()=>{
            n++;
            if (n>=text.length){
                clearInterval(timer);
                $submit.tap(()=>{
                    $keyboardText.css("display","none");
                    $keyboard.css({
                        transform:"translateY(3.7rem)"
                    });
                    $plan.fire();
                });
                return;
            }
            $keyboardText[0].innerHTML+=text[n];
            $submit.css("display","block")
        },200)
    };
    return {
        init:function () {
            $messageBox.css("display","block");
            $loadingBox.css("display","none");
            $phoneBox.css("display","none");
            musicAudio.play();
            $plan.fire();
        }
    }
})();
//messageRender.init();
let cubeRender = (function () {
    let $cubeBox = $(".cubeBox"),
        $cube = $(".cube");
    let touchBegin = function (e) {
        let $this = $(this),
            point = e.changedTouches[0];
        $this.attr({
            strX:point.clientX,
            strY:point.clientY,
            isMove:false,
            changeX:0,
            changeY:0
        })
    };
    let touching = function (e) {
        let $this = $(this),
            point = e.changedTouches[0];
        let changeX = point.clientX - parseFloat($this.attr("strX"));
        let changeY = point.clientY - parseFloat($this.attr("strY"));
        if(Math.abs(changeX)>10 || Math.abs(changeY)>10){
            $this.attr({
                isMove:true,
                changeX:changeX,
                changeY:changeY
            })
        }
    };
    let touchEnd = function (e) {
        let $this = $(this),
            point = e.changedTouches[0];
        let rotateX = parseFloat($this.attr("rotateX")),
            rotateY = parseFloat($this.attr("rotateY")),
            changeX = parseFloat($this.attr("changeX")),
            changeY = parseFloat($this.attr("changeY")),
            isMove = $this.attr("isMove");
        if (!isMove) return;
        rotateX = rotateX - changeY/3;
        rotateY = rotateY + changeX/3;
        $this.css({
            transform:`scale(.6) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        }).attr({
            rotateX:rotateX,
            rotateY:rotateY
        })
    };

    return {
        init:function () {
            $cubeBox.css("display","block");
            $cube.attr({
                rotateX:-30,
                rotateY:45
            }).on({
                touchstart:touchBegin,
                touchmove:touching,
                touchend:touchEnd
            });
            //每个页面的点击效果
            $cube.find("li").tap(function () {
                $cubeBox.css("display","none");
                let index = $(this).index();
                detailRender.init(index);
            })
        }


    }
})();
//cubeRender.init();
let detailRender = (function () {
    let $detailBox = $(".detailBox"),
        $returnLink = $(".returnLink"),
        $cubeBox = $(".cubeBox"),
        $makisuBox = $("#makisuBox"),
        swiper = null;
    let change = function (example) {
        //example.activeIndex
        //example.sliders;存储当前所有活动块
       // example.sliders[example.activeIndex]当前活动块
        let slideAry = example.slides,
            activeIndex = example.activeIndex;
        //page1动画
        if (activeIndex === 0){
            $makisuBox.makisu({
                selector:"dd",
                speed:.6,
                overlap:.6
            });
            $makisuBox.makisu("open")
        }else {
            $makisuBox.makisu({
                selector:"dd",
                speed:0,
                overlap:0
            });
            $makisuBox.makisu("close")
        }
        //给当前page设置ID，其他page移除ID，用于当前page的动画
        [].forEach.call(slideAry,(item,index)=>{
            if (index === activeIndex){
                item.id = "page" +(index+1);
                return;
            }
            item.id = null;
        })
    };
    return {
        init:function (index = 0) {
            $detailBox.css("display","block");
            //初始化swiper
            if (!swiper){
                swiper = new Swiper(".swiper-container",{
                    effect:"coverflow",
                    onInit:change,
                    onTransitionEnd:change
                });
                //return点击事件
                $returnLink.tap(()=>{
                    $detailBox.css("display","none");
                    $cubeBox.css("display","block");
                })
            }
            index = index>5?5:index;
            swiper.slideTo(index,0);

        }
    }
})();
//detailRender.init(1);
loadingRender.init();
