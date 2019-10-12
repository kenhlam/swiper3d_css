function SwiperAniamte() {
    this.defaultOpt = {
        wrapClass: '',
        panelClass: "",
        $wrap: '',
        $panel: '',
        wW: '',
        pW: '',
        panelCount: 3,//单屏面签数量
        r: 100,//旋转半径 
        gap: 10,//页签半径
        paddingTop: 20,
        paddingLeft: 20,
        showDirection: 'horizon',//显示方向
        moveDirection: 'l_r',//从左向右 从右向左  从上到下 从下到上
        effect: 'linear',//运动效果
        interval: 1000,
        limitPosition: 0,
        step: 100,
        point: [],//点位
        animatePointCount: 0, //l运动位置点数
        viewPointCount: 0,//n可视个数
        id: "ccccc"
        // l运动位置点数 n可视个数  p = []点位
        // var w = $(".swiper_panel").width();
        // var n = Math.ceil($(".panel_wrap").width() / w);
        // var l = Math.max($(".swiper_panel").length + 1, n);
        // var p = [];

    }


    this.createSwiper = function (opt) {
        this.opt = $.extend(true, this.defaultOpt, opt);
        this.opt.$wrap = $('.' + this.opt.wrapClass);
        this.opt.$panel = $('.' + this.opt.panelClass);
        this.opt.wW = this.opt.$wrap.width();
        this.opt.pW = this.opt.$panel.width();

        this.opt.viewPointCount = Math.ceil(this.opt.wW / this.opt.pW);
        this.opt.animatePointCount = Math.max(this.opt.$panel.length + 1, this.opt.viewPointCount);
        this.opt.$panel.css({
            position: "absolute",
            left: "0",
            top: "0"
        })
    }
    this.createAnimationPath = function () {
        var self = this;
        for (var i = 0; i < this.opt.animatePointCount; i++) {
            if (i < this.opt.viewPointCount) {
                this.opt.point.push(i * (this.opt.pW + this.opt.gap));
            } else if (i >= this.opt.viewPointCount) {
                this.opt.point.push( -     (this.opt.animatePointCount - i) * (this.opt.pW + this.opt.gap)    );
            }
        }
        console.log(this.opt.point);
        var styleStr = "<style id='" + self.opt.id + "'>";
        self.opt.$panel.each(function (i, v) {//循环DOM
            // 循环P点
            var $this = $(this);
            var p = self.opt.point;
            $.each(p, function (j, t) {
                var startP;
                var id = $this.attr("id") + "_" + j;
                startP = (j + i) % p.length;
                // endP = (j + i + 1) % p.length;
                styleStr += `@keyframes ${id} {
                        0% {
                          transform: translate(${p[startP]}px, 0px) rotate(0deg) scale(1)
                        }
    
                        100% {
                          transform: translate(${p[startP] + self.opt.pW + self.opt.gap}px, 0px) rotate(0deg) scale(1)
                        }
                      }`;
            });

        });
        styleStr += "</style>";
        $("#"+self.opt.id).remove();
        $("body").append(styleStr);

    }
    this.startAnimation = function () {
        this.createAnimationPath();
        var id, self = this, idx;
        this.opt.$panel.each(function (i, v) {
            id = $(this).attr('id');
            if($("#" + id).attr("idx") == undefined){
                idx = 0;
            }else{
                idx = Number( $("#" + id).attr("idx") ) + 1;
            }
            $("#" + id).attr("idx", idx);
            $("#" + id).css('animation-name', id + "_" + idx);
            $("#" + id).off("animationend").on("animationend", function () {
                self.changeAnimationName($(this));
            })
            // self.changeAnimationName($(this));
            // idx++;

        });
    }
    this.changeAnimationName = function ($dom) {
        var self = this;
        var oldIdx = Number($dom.attr("idx"));
        if(!oldIdx || oldIdx != self.opt.point.length - 1){
            idx = 0;
        }else{
            idx = oldIdx + 1;
        }
        if (oldIdx != self.opt.point.length - 1) {
            idx = oldIdx + 1;
        } else {
         
            
        }
        id = $dom.attr('id');
        $dom.attr("idx", idx);
        $dom.css('animation-name', id + "_" + idx);
        $dom.off("animationend").on("animationend", function () {
            self.changeAnimationName($(this));
        })
    }

    this.stopeAnimation = function () {
        this.opt.$panel.off("animationend");
    }

}
SwiperAniamte.prototype = {

}
// transition	简写属性，用于在一个属性中设置四个过渡属性。	3
// transition-property	规定应用过渡的 CSS 属性的名称。	3
// transition-duration	定义过渡效果花费的时间。默认是 0。	3
// transition-timing-function	规定过渡效果的时间曲线。默认是 "ease"。	3
// transition-delay	规定过渡效果何时开始。默认是 0。

// 所有的2D转换方法组合在一起： matrix()  旋转、缩放、移动以及倾斜元素matrix(scale.x ,, , scale.y , translate.x, translate.y)      
// 改变起点位置 transform-origin: bottom left;  transform: 30deg 1.5 30deg 20deg 100px 200px;
// transition:property duration timing-function delay;

// property:CSS的属性，例如：width height 为none时停止所有的运动，可以为transform
// duration:持续时间
// timing-function:ease等
// delay:延迟