function Sliderwing() {
    this.default = {
        maxZIndex: 99,
        id: 'ccxvvv',//传入id

        scale: 0.8,
        direction: 'v',//h  v  横纵向
        animationDir: 't_b',//l_r  r_l  从左一右
        animation_fn: 'linear',
        animation_time: '1000',//动画时间
        auto: true,

        interval_time: 2000,
        handleDirection: ''

    };
}
Sliderwing.prototype = {
    init: function (opt) {
        this.opt = $.extend(true, this.default, opt);
        this.opt.$panel = $("." + this.opt.panelClass);
        this.opt.len = this.opt.$panel.length;
        this.opt.pW = this.opt.$panel.outerWidth();
        this.opt.pH = this.opt.$panel.outerHeight();
        this.opt.wW = $('.' + this.opt.wrapClass).outerWidth();
        this.opt.wH = $('.' + this.opt.wrapClass).outerHeight();
        this.opt.handleDirection = this.opt.animationDir;
        this.opt.disIdx = Math.floor(this.opt.count / 2);//中间panel
        this.opt.pointArr = this.getPointArr();
        this.addStyleSheet();
        // 初始化样式  时间  运动效果
        this.opt.$panel.css({
            'left': 0,
            'top': 0,
            'opacity': 0,
            'position': 'absolute',
            'animation-fill-mode': 'both',
            'animation-duration': this.opt.animation_time + 'ms',
            'animation-timing-function': this.opt.animation_fn
        });

    },

    initAnimation: function () {
        var self = this, nextAnimationDir;
        if (self.opt.animationDir == 'l_r' || self.opt.animationDir == 't_b') {
            nextAnimationDir = 'l_r';
        } else {
            nextAnimationDir = 'r_l'
        }
        // 初始化渲染动画
        self.opt.$panel.each(function (i) {
            $(this).attr('idx', i);
            $(this).css('animation-name', self.opt.id + '_' + nextAnimationDir + '_' + i);
        });
        self.setOnPlayParam();
        if (self.opt.auto) {
            self.startAnimation();
        }

    },
    startAnimation: function () {
        var self = this;

        self.changeAnimationNames();
        self.opt.$panel.eq(0).off("animationend").on("animationend", function () {
            self.changeAnimationNames();
        });

    },
    // 右方
    next: function () {
        var self = this, isReverse;
        if (self.opt.direction == 'h') {
            isReverse = self.isReverse('l_r');
        } else {
            isReverse = self.isReverse('t_b');
        }
        this.opt.$panel.each(function () {
            var oldIdx = ~~$(this).attr('idx');
            var idx;
            if (isReverse) {
                idx = oldIdx;
            } else {
                idx = (oldIdx + 1) % self.opt.$panel.length;
            }
            $(this).attr("idx", idx);
            $(this).css('animation-name', self.opt.id + '_l_r_' + idx);
        });
        self.setOnPlayParam();
        self.stopAnimation();
        clearInterval(self.opt.timer);
        if (self.opt.auto) {
            self.opt.timer = setTimeout(self.startAnimation.bind(self), ~~self.opt.animation_time + self.opt.interval_time);
        }
        
    },
    // 左方
    prev: function () {
        var self = this, isReverse;
        if (self.opt.direction == 'h') {
            isReverse = self.isReverse('r_l');
        } else {
            isReverse = self.isReverse('b_t');
        }
        this.opt.$panel.each(function () {
            var oldIdx = ~~$(this).attr('idx');
            if (isReverse) {
                idx = oldIdx;
            } else {
                if (oldIdx != 0) {
                    idx = oldIdx - 1;
                } else {
                    idx = self.opt.$panel.length - 1;
                }
            }
            $(this).attr("idx", idx);
            $(this).css('animation-name', self.opt.id + '_r_l_' + idx);
        });
        self.setOnPlayParam();
        self.stopAnimation();
        clearInterval(self.opt.timer);
        if (self.opt.auto) {
            self.opt.timer = setTimeout(self.startAnimation.bind(self), ~~self.opt.animation_time + self.opt.interval_time);
        }
    },
    isReverse: function (dir) {
        // 切换运动方向  返回true
        if (this.opt.handleDirection == dir) {
            return false;
        }
        this.opt.handleDirection = dir;
        return true;
    },
    changeAnimationNames: function () {
        var self = this, animationDir = self.opt.animationDir, isReverse = self.isReverse(animationDir);
        var nextAnimationDir = (animationDir == 'l_r' || animationDir == 't_b') ? 'l_r' : 'r_l';
        clearInterval(self.opt.timer);
        if (self.opt.auto) {
            self.opt.timer = setTimeout(function(){
                self.opt.$panel.each(function () {
                    var idx;
                    var oldIdx = Number($(this).attr("idx"));
                    // 运动反向时，不改变idx
                    if (isReverse) {
                        idx = oldIdx;
                    } else {
                        // 从左到右 累加
                        if (animationDir == 'l_r' || animationDir == 't_b') {
                            if (oldIdx != self.opt.$panel.length - 1) {
                                idx = oldIdx + 1;
                            } else {
                                idx = 0;
                            }
                        } else if (animationDir == 'r_l' || animationDir == 'b_t') {
                            // 从右到左累减
                            if (oldIdx != 0) {
                                idx = oldIdx - 1;
                            } else {
                                idx = self.opt.$panel.length - 1;
                            }
        
                        }
                    }
                    $(this).attr("idx", idx);
                    $(this).css('animation-name', self.opt.id + '_' + nextAnimationDir + '_' + idx);
        
                });
                self.setOnPlayParam();
            }, self.opt.interval_time);
        }

       
    },
    skipToPanel: function (idx) {
        // 点击那一panel的idx  name设置为this.opt.disIdx  其它依次推
        var self = this, dis, $panel = self.opt.$panel, l = $panel.length, newIdx, preDomIdx, behindDomIdx;
        self.opt.handleDirection = self.opt.animationDir;
        dis = idx - self.opt.disIdx;

        $panel.each(function (i) {
            if (self.opt.animationDir == 'l_r' || self.opt.animationDir == 't_b') {
                newIdx = Math.abs(i - dis + l) % l;
                $(this).attr("idx", newIdx);
                $(this).css('animation-name', self.opt.id + '_l_r_' + newIdx);
            } else if (self.opt.animationDir == 'r_l' || self.opt.animationDir == 'b_t') {
                newIdx = Math.abs(i - dis + l + 1) % l;
                $(this).attr("idx", newIdx);
                $(this).css('animation-name', self.opt.id + '_r_l_' + newIdx);
            }

        });
        self.setOnPlayParam();
        self.stopAnimation();
        clearInterval(self.opt.timer);
        if (self.opt.auto) {
            self.opt.timer = setTimeout(self.startAnimation.bind(self), ~~self.opt.animation_time + self.opt.interval_time);
        }
    },
    setOnPlayParam: function () {
        var idx = this.opt.$panel.filter('[idx="' + this.opt.disIdx + '"]').index();
        if (this.opt.handleDirection == 'r_l' || this.opt.handleDirection == 'b_t') {
            idx = (idx + 1) % this.opt.$panel.length;
        }
        $(".pagenator").css('background', 'transparent').eq(idx).css('background', 'red');
    },
    stopAnimation: function () {
        this.opt.$panel.off("animationend");
    },

    getPointArr: function () {
        var arr = [], x = 0, y = 0, opacity = 1, zIndex, scale;
        // if (this.opt.direction == 'h') {//方向不同，位置不同
        for (var i = 0; i < this.opt.count; i++) {
            // count  显示的panel数  其它panel隐藏
            zIndex = this.opt.maxZIndex - Math.abs(i - this.opt.disIdx);
            scale = Math.pow(this.opt.scale, Math.abs(i - this.opt.disIdx));

            // 横向和纵向
            if (this.opt.direction == 'h') {
                if (i <= this.opt.disIdx) {//中心分界前后位置计算不同
                    x = this.opt.wW / 2 - this.getlWByIdx(i, 'width');
                } else {
                    x = this.opt.wW / 2 + this.getlWByIdx(i, 'width') - this.opt.pW;
                }
            } else {
                if (i <= this.opt.disIdx) {//中心分界前后位置计算不同
                    y = this.opt.wH / 2 - this.getlWByIdx(i, 'height');
                } else {
                    y = this.opt.wH / 2 + this.getlWByIdx(i, 'height') - this.opt.pH;
                }
            }

            arr.push({ x: x, y: y, scale: scale, zIndex: zIndex, opacity: opacity });
        }
        // 添加最左右位置点
        if (this.opt.direction == 'h') {
            arr.push({ x: arr[arr.length - 1].x + this.opt.pW, y: 0, scale: 0, zIndex: -1, opacity: 0 });//最右 最下
            arr.push({ x: arr[0].x - this.opt.pW, y: 0, scale: 0, zIndex: -1, opacity: 0 });//最左 最上
        } else {
            arr.push({ x: 0, y: arr[arr.length - 1].y + this.opt.pH, scale: 0, zIndex: -1, opacity: 0 });//最右 最下
            arr.push({ x: 0, y: arr[0].y - this.opt.pH, scale: 0, zIndex: -1, opacity: 0 });//最左 最上
        }

        // }
        console.log(arr)
        return arr;
    },
    getlWByIdx: function (idx, type) {
        // 第idx 到 中间位置的累加长度/高度  最后一panel不计算缩放，保证从  50% 50%缩放时剧中
        var sW = 0;
        var cDis = Math.abs(this.opt.disIdx - idx);
        var w = (type == 'width' ? this.opt.pW : this.opt.pH);
        for (var i = 0; i <= cDis; i++) {
            if (i == cDis) {
                sW += w * Math.pow(this.opt.scale, 0);
            } else {
                sW += w * Math.pow(this.opt.scale, i);
            }
        }
        return sW / 2;
    },

    addStyleSheet: function () {
        // 每一帧的运画 count + 1   0入场 1是1到2  2是2到3。。。。。。count + 1是出场
        // 运动方向不同，styleSheet不同，但同时有前后翻页，故styleSheet正反向动画都要生成
        // 注意  l_r 和t_b 所有逻辑一至，只有位置点的x y 对换了  故t_b使用l_r的样式名，只有生成getArrPoint时点位变化下。
        var style = `<style id=${this.opt.id}_style>`;
        var firstP = this.opt.pointArr[this.opt.pointArr.length - 1];//最左上
        var lastP = this.opt.pointArr[this.opt.pointArr.length - 2];//最右下
        var startP, endP;
        for (var i = 0; i <= this.opt.$panel.length; i++) {

            // i==0 入场name  ${this.opt.id}_0
            if (i == 0) {
                startP = firstP;
            } else {
                startP = this.opt.pointArr[i - 1];
            }
            // 出场 name  ${this.opt.id}_${this.opt.count}
            if (i == this.opt.count) {
                endP = lastP;
            } else {
                endP = this.opt.pointArr[i];
            }

            // 构造超显示后的DOM动画  为了绑定animationEnd动画，运动完的panel不能静止。   由于每一panel的配置不同，执行运动完成不同步，故不能动态改变执行animationEnd的DOM
            if (i > this.opt.count) {
                startP = endP = firstP;
                endP.x = firstP.x - 1;
            }
            // 从左到右路径 l_r
            style +=
                `@keyframes ${this.opt.id}_l_r_${i} {  
                            0% {
                                z-index:${startP.zIndex};
                                opacity:${startP.opacity};
                                transform: translate(${startP.x}px, ${startP.y}px) rotate(0deg) scale(${startP.scale} )
                            }
                            100% {
                                z-index:${endP.zIndex};
                                opacity:${endP.opacity};
                                transform: translate(${endP.x}px, ${endP.y}px) rotate(0deg) scale(${endP.scale})
                            }
                        }`;

            style +=
                `@keyframes ${this.opt.id}_r_l_${i} {
                        0% {
                            z-index:${endP.zIndex};
                            opacity:${endP.opacity};
                            transform: translate(${endP.x}px, ${endP.y}px) rotate(0deg) scale(${endP.scale} )
                        }
                        100% {
                            z-index:${startP.zIndex};
                            opacity:${startP.opacity};
                            transform: translate(${startP.x}px, ${startP.y}px) rotate(0deg) scale(${startP.scale})
                        }
                    }`;
        }

        style += '</style>';
        $("#" + this.opt.id + "_style").remove();
        $("head").append(style);
    }

};


