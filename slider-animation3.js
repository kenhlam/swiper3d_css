function Sliderwing() {
    this.default = {

        id: 'ccxvvv',//传入id
        scale: 1,
        animationDir: 'l_r',//l_r  r_l  从左一右
        animation_fn: 'ease',
        animation_time: '6000',//动画时间
        auto: false,
        rotate: 50,
        wRotate: 10,//包围盒旋转角度
        perspective: 1200,
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
        this.opt.translateZ = this.opt.minTranslateZ = this.opt.pW / (2 * Math.tan(this.opt.rotate / 2 * Math.PI / 180));
        this.opt.wW = $('.' + this.opt.wrapClass).outerWidth();
        this.opt.wH = $('.' + this.opt.wrapClass).outerHeight();
        this.opt.handleDirection = this.opt.animationDir;
        this.opt.disIdx = this.getDisIdx();//中间panel
        // 计算是否偏移包围盒
        this.opt.wRotate = this.opt.count % 2 ? 0 : this.opt.rotate / 2;
        this.opt.pointArr = this.getPointArr();
        this.addStyleSheet();
        // 初始化样式  时间  运动效果
        
			
        this.opt.$panel.css({
            'opacity': 0,
            'transform-origin': '50% 50%',
            'backface-visibility': 'visible',
            'animation-fill-mode': 'forwards',
            'animation-duration': this.opt.animation_time + 'ms',
            'animation-timing-function': this.opt.animation_fn
        });
        // 补充样式
        $(".wrap").css({
            'backface-visibility': 'visible',
            'position':'absolute',
            'transform-style':'preserve-3d',
            top: ($(".newwarp").height() - this.opt.pH) / 2,
            left: ($(".newwarp").width() - this.opt.pW) / 2,
            width: this.opt.pW,
            height: this.opt.pH,
            transform: `perspective(${this.opt.perspective}px) rotateX(0deg) rotateY(${-this.opt.wRotate}deg)`
        });

    },

    initAnimation: function () {
        var self = this, nextAnimationDir;
        if (self.opt.animationDir == 'l_r') {
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
        isReverse = self.isReverse('l_r');
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
        clearTimeout(self.opt.timer);
        if (self.opt.auto) {
            self.opt.timer = setTimeout(self.startAnimation.bind(self), ~~self.opt.animation_time + self.opt.interval_time);
        }

    },
    // 左方
    prev: function () {
        var self = this, isReverse;
        isReverse = self.isReverse('r_l');

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
        clearTimeout(self.opt.timer);
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
        var nextAnimationDir = animationDir == 'l_r' ? 'l_r' : 'r_l';
        clearInterval(self.opt.timer);
        if (self.opt.auto) {
            self.opt.timer = setTimeout(function () {
                self.opt.$panel.each(function () {
                    var idx;
                    var oldIdx = Number($(this).attr("idx"));
                    // 运动反向时，不改变idx
                    if (isReverse) {
                        idx = oldIdx;
                    } else {
                        // 从左到右 累加
                        if (animationDir == 'l_r') {
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
            if (self.opt.animationDir == 'l_r') {
                newIdx = Math.abs(i - dis + l) % l;
                $(this).attr("idx", newIdx);
                $(this).css('animation-name', self.opt.id + '_l_r_' + newIdx);
            } else if (self.opt.animationDir == 'r_l') {
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
        if (this.opt.handleDirection == 'r_l') {
            idx = (idx + 1) % this.opt.$panel.length;
        }
        $(".pagenator").css('background', 'transparent').eq(idx).css('background', 'red');
    },
    stopAnimation: function () {
        this.opt.$panel.off("animationend");
    },

    getPointArr: function () {
        var arr = [], opacity = 1, scale, rotate = 0,count = this.opt.count;
        if(count%2 == 0){
            count++;
        }
        for (var i = 0; i < count; i++) {
            // count  显示的panel数  其它panel隐藏

            scale = this.getScaleByIdx(i);
            // 横向和纵向
            if (i <= this.opt.disIdx) {//中心分界前后位置计算不同
                // x = this.opt.wW / 2 - this.getlWByIdx(i, 'width');

                rotate = -this.getRotateByIdx(i);
            } else {
                // x = this.opt.wW / 2 + this.getlWByIdx(i, 'width') - this.opt.pW;

                rotate = this.getRotateByIdx(i);
            }

            arr.push({ scale: scale, rotate: rotate, opacity: opacity });
        }
        // 添加最左右位置点

        arr.push({ scale: arr[arr.length - 1].scale, rotate: arr[arr.length - 1].rotate + this.opt.rotate, opacity: 0 ,translateZ:this.opt.translateZ});//最右 
        arr.push({ scale: arr[0].scale, rotate: arr[0].rotate - this.opt.rotate, opacity: 0 ,translateZ:this.opt.translateZ});//最左 
        // }
        console.log(arr)
        return arr;
    },
    getDisIdx: function () {
        // 倚数时缩 偶数时 
        if (this.opt.count % 2) {
            return  Math.floor(Math.min(this.opt.count, this.opt.len) / 2);//中间panel
        }
        return  Math.floor(Math.min(this.opt.count - 1, this.opt.len) / 2);//中间panel
    },
    getScaleByIdx: function (i) {

        if (this.opt.count % 2) {
            scale = Math.pow(this.opt.scale, Math.abs(i - this.opt.disIdx));
        } else {
            var scaleIdx = i - this.opt.disIdx
            if (scaleIdx > 0) {
                scaleIdx--;

            }
            scale = Math.pow(this.opt.scale, Math.abs(scaleIdx));
        }
        return scale;
    },
    getlWByIdx: function (idx, type) {
        // 第idx 到 中间位置的累加长度/高度  最后一panel不计算缩放，保证从  50% 50%缩放时剧中
        var cDis = Math.abs(this.opt.disIdx - idx);
        var w = (type == 'width' ? this.opt.pW : this.opt.pH);
        return ((w + this.opt.gap) * cDis + w / 2);

    },
    getRotateByIdx: function (idx) {
        var cDis = Math.abs(this.opt.disIdx - idx);
        return cDis * this.opt.rotate;

    },

    addStyleSheet: function () {
        // 每一帧的运画 count + 1   0入场 1是1到2  2是2到3。。。。。。count + 1是出场
        // 运动方向不同，styleSheet不同，但同时有前后翻页，故styleSheet正反向动画都要生成
        var style = `<style id=${this.opt.id}_style>`;
        var firstP = this.opt.pointArr[this.opt.pointArr.length - 1];//最左
        var lastP = this.opt.pointArr[this.opt.pointArr.length - 2];//最右
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
                // endP.x = firstP.x - 1;
            }
            // 从左到右路径 l_r
            style +=
                `@keyframes ${this.opt.id}_l_r_${i} {  
                            0% {
                               
                                opacity:${startP.opacity};
                                
                                transform: rotateY(${startP.rotate}deg) translateZ(${startP.translateZ || this.opt.translateZ}px) scale(${startP.scale});
                            }
                            100% {
                                
                                opacity:${endP.opacity};
                                
                                transform: rotateY(${endP.rotate}deg)  translateZ(${endP.translateZ ||this.opt.translateZ}px)  scale(${endP.scale});
                            }
                        }`;

            style +=
                `@keyframes ${this.opt.id}_r_l_${i} {
                        0% {
                            
                            opacity:${endP.opacity};
                            transform: rotateY(${endP.rotate}deg) translateZ(${this.opt.translateZ}px) scale(${endP.scale});
                        }
                        100% {
                           
                            opacity:${startP.opacity};
                           
                            transform: rotateY(${startP.rotate}deg)  translateZ(${this.opt.translateZ}px)  scale(${startP.scale});
                        }
                    }`;
        }

        style += '</style>';
        $("#" + this.opt.id + "_style").remove();
        $("head").append(style);
    },
    setScale: function (s) {
        var stepZ = this.opt.minTranslateZ/10;
        if (s) {
            this.opt.translateZ = ~~this.opt.translateZ + stepZ;
        } else {

            this.opt.translateZ = ~~this.opt.translateZ - stepZ;
        }
        this.opt.translateZ = Math.max(this.opt.translateZ, this.opt.minTranslateZ)
        // this.opt.translateZ =0
        this.addStyleSheet();
    }

};


