
function SwiperAniamte(opt) {
    //皮肤1
    this.opt = opt;
    this.init();
}

SwiperAniamte.prototype = {
    init: function () {
        this.createSwiper();//初始化参数  包裹DOM
        this.createAnimationPath();//创建运动css
        // this.setStyle();//设置其它按钮样式
        this.initAnimation();
        // this.startAnimation();//开始动画
    },
    destroy: function () {
        this.stopeAnimation();
        $("#" + this.opt.id).remove();
        // $('head .'+this.styleId).remove();
    },
    setOption: function () {

    },
    setStyle: function () {
        var element = this.opt._element;
        var opt = this.opt.plugin.options;
        element.css("width", '600px');
        element.find(".pagenator").css('background-color', opt.paginatorSize);
        element.find(".pagenation_wrap span").css("width", opt.paginationDefaultColor);
        opt.paginatorShow == 'off' ? (element.find(".pagenation_wrap").hide()) : (element.find(".pagenation_wrap").show());
        opt.pageTurnShow == 'off' ? (element.find(".page_turn_wrap").hide()) : (element.find(".page_turn_wrap").show());
    },
    createSwiper: function () {
        this.opt.point = [];
        this.opt.flipState = 'next';//运动方向，默认为next方向
        this.opt.allowHandle = true;
        this.opt.$wrap = $("#" + this.opt.id);
        this.opt.wW = this.opt.$wrap.width() - Number(this.opt.margin_left);
        this.opt.wH = this.opt.$wrap.height() - Number(this.opt.margin_top);
        this.opt.$panel = $("."+this.opt.panelClass, this.opt.$wrap);
        this.opt.pW = $("." + this.opt.classIds[0]).width() + Number(this.opt.gap);
        this.opt.pH = $("." + this.opt.classIds[0]).height() + Number(this.opt.gap);
        this.opt.$panel.css({
            position: "absolute",
            left: "0",
            top: "0"
        });
        this.opt.$panel.wrapAll(`<div id='${this.opt.id}_panel_wrap' style='position:absolute;top:${this.opt.margin_top}px;left:${this.opt.margin_left}px;width:100%;height:100%;overflow:hidden;' ></div>`);

        if (this.opt.direction == 'h') {//横向
            this.opt.viewPointCount = Math.ceil(this.opt.wW / this.opt.pW);//可视个数
        } else {//纵向
            this.opt.viewPointCount = Math.ceil(this.opt.wH / this.opt.pH);
        }

        this.opt.animatePointCount = this.opt.$panel.length;//运动的路径点位个数
    },
    stopeAnimation: function () {
        this.opt.$panel.off("animationend");
    },

    createAnimationPath: function () {
        // 创建CSS

        this.addPathPoint();
        this.addStyleSheet();

    },
    addPathPoint: function () {
        switch (this.opt.direction) {
            case 'h':
                for (var i = 0; i < this.opt.animatePointCount; i++) {
                    if (this.opt.animation_direction_h == 'l_r') {//运动方向
                        if (i < this.opt.viewPointCount) {
                            this.opt.point.push(i * this.opt.pW + Number(this.opt.margin_left));
                        } else {
                            this.opt.point.push(-(this.opt.animatePointCount - i) * this.opt.pW + Number(this.opt.margin_left));
                        }
                    } else {
                        this.opt.point.push(i * this.opt.pW + Number(this.opt.margin_left));
                    }

                }
                break;
            case 'v':
                for (var i = 0; i < this.opt.animatePointCount; i++) {
                    if (this.opt.animation_direction_v == 't_b') {//运动方向
                        if (i < this.opt.viewPointCount) {
                            this.opt.point.push(i * this.opt.pH + Number(this.opt.margin_top));
                        } else {
                            this.opt.point.push(-(this.opt.animatePointCount - i) * this.opt.pH + Number(this.opt.margin_top));
                        }
                    } else {
                        this.opt.point.push(i * this.opt.pW + Number(this.opt.margin_left));
                    }

                }

                break;
        }

        console.log(this.opt.point);
    },
    addStyleSheet: function () {
        var self = this;
        var styleStr = "<style id='" + self.opt.id + "_style'>";
        styleStr +=
            // `#${this.opt.id} .${this.opt.wrapClass} {
            //                 height: 100%;
            //                 width: 568px;
            //                 border: 1px solid blue;
            //                 overflow: hidden;
            //                 position: relative;
            //             }   皮肤设置时专用

            `#${this.opt.id} .${this.opt.panelClass} {
                            animation-fill-mode: both;
                            animation-duration: ${this.opt.animation_time}ms;
                            animation-timing-function: ${this.opt.animation_fn};
                        
                        }
            `;
        switch (this.opt.direction) {
            case 'h':
                self.opt.$panel.each(function (i, v) {//循环DOM
                    // 循环P点
                    var $this = $(this);
                    var p = self.opt.point;
                    $.each(p, function (j, t) {
                        var id = $this.attr("cid") + "_" + j;
                        var startP = p[(j + i) % p.length];
                        var endP = startP + self.opt.pW;

                        if (self.opt.animation_direction_h != 'l_r') {
                            startP = p[(p.length - j + i) % p.length];
                            endP = startP - self.opt.pW;
                        }
                        styleStr += `@keyframes ${id} {
                                        0% {
                                          transform: translate(${startP}px, 0px) rotate(0deg) scale(1)
                                        }
                    
                                        100% {
                                          transform: translate(${endP}px, 0px) rotate(0deg) scale(1)
                                        }
                                      }`;
                                    //   反向后退动画使用
                        styleStr += `@keyframes ${id}_r {
                                        0% {
                                          transform: translate(${endP}px, 0px) rotate(0deg) scale(1)
                                        }
                    
                                        100% {
                                          transform: translate(${startP}px, 0px) rotate(0deg) scale(1)
                                        }
                                      }`;
                    });
                    
                });

                break;
            case 'v':
                self.opt.$panel.each(function (i, v) {//循环DOM
                    // 循环P点
                    var $this = $(this);
                    var p = self.opt.point;
                    var test = '';
                    $.each(p, function (j, t) {
                        var id = $this.attr("cid") + "_" + j;
                        var startP = p[(j + i) % p.length];
                        var endP = startP + self.opt.pH;

                        if (self.opt.animation_direction_v == 'b_t') {
                            startP = p[(p.length - j + i) % p.length];
                            endP = startP - self.opt.pH;
                        }
                        styleStr += `@keyframes ${id} {
                                            0% {
                                              transform: translate(0px, ${startP}px) rotate(0deg) scale(1)
                                            }
                        
                                            100% {
                                              transform: translate(0px, ${endP}px) rotate(0deg) scale(1)
                                            }
                                          }`;
                        //   反向后退动画使用
                        styleStr += `@keyframes ${id}_r {
                            0% {
                              transform: translate(0px, ${endP}px) rotate(0deg) scale(1)
                            }
        
                            100% {
                              transform: translate(0px, ${startP}px) rotate(0deg) scale(1)
                            }
                          }`;
                    });
                    console.log(test)
                });
                break;
        }

        styleStr += "</style>";
        $("#" + self.opt.id + "_style").remove();
        $("body").append(styleStr);
    },
    // 没有自动轮播时，初始化显示效果
    initAnimation:function(){
        var cid, self = this, idx;
        this.opt.$panel.each(function (i, v) {
            cid = $(this).attr('cid');
            var idx = self.opt.$panel.length - 1;
            // if ($("." + cid).attr("idx") == undefined || (Number($("." + cid).attr("idx")) + 1) == self.opt.$panel.length) {
            //     idx = 0;
            // } else {
            //     idx = (Number($("." + cid).attr("idx")) + 1);
            // }
            $("." + cid, self.opt._element).attr("idx", idx);
            $("." + cid, self.opt._element).css('animation-name', cid + "_" + idx);
            self.opt.allowHandle = false;
            $("." + cid, self.opt._element).off("animationend").on("animationend", function () {
                self.opt.allowHandle = true;
                // if (self.opt.auto) {
                //     // self.changeAnimationName($(this));
                // }
            })

        });
    },
    startAnimation: function () {
        var cid, self = this, idx;
        this.opt.$panel.each(function (i, v) {
            cid = $(this).attr('cid');
            if ($("." + cid).attr("idx") == undefined || (Number($("." + cid).attr("idx")) + 1) == self.opt.$panel.length) {
                idx = 0;
            } else {
                idx = (Number($("." + cid).attr("idx")) + 1);
            }
            $("." + cid, self.opt._element).attr("idx", idx);
            $("." + cid, self.opt._element).css('animation-name', cid + "_" + idx);
            self.opt.allowHandle = false;
            $("." + cid, self.opt._element).off("animationend").on("animationend", function () {
                self.opt.allowHandle = true;
                if (self.opt.auto) {
                    self.changeAnimationName($(this));
                }
            })

        });
    },
    next: function () {
        var cid, self = this, idx;
        if(!self.opt.allowHandle) {return;};
        this.opt.$panel.each(function (i, v) {
            cid = $(this).attr('cid');
            if(self.opt.flipState != 'next'){
                idx = Number($("." + cid).attr("idx"));
            }else{
                if ($("." + cid).attr("idx") == undefined || (Number($("." + cid).attr("idx")) + 1) == self.opt.$panel.length) {
                    idx = 0;
                } else {
                    idx = (Number($("." + cid).attr("idx")) + 1);
                }
            }
           
            $("." + cid, self.opt._element).attr("idx", idx);
            $("." + cid, self.opt._element).css('animation-name', cid + "_" + idx);
            self.opt.allowHandle = false;
            $("." + cid, self.opt._element).off("animationend").on("animationend", function () {
                self.opt.allowHandle = true;
                if (self.opt.auto) {
                    self.changeAnimationName($(this));
                }
            })

        });
        self.opt.flipState = 'next';
    },
    prev: function () {
        var cid, self = this, idx;
        if(!self.opt.allowHandle) {return;};
        this.opt.$panel.each(function (i, v) {
            cid = $(this).attr('cid');
            if (self.opt.flipState != 'prev') {
                
                idx = $("." + cid).attr("idx");
                
            } else {
                if (($("." + cid).attr("idx") == undefined) || $("." + cid).attr("idx") - 1 < 0) {
                    idx = self.opt.$panel.length - 1;
                } else {
                    idx = $("." + cid).attr("idx") - 1;
                }
                $("." + cid, self.opt._element).attr("idx", idx);
                self.opt.allowHandle = false;
                $("." + cid, self.opt._element).off("animationend").on("animationend", function () {
                    self.opt.allowHandle = true;
                });
            }
            $("." + cid, self.opt._element).css('animation-name', cid + "_" + idx + "_r");
        });
        self.opt.flipState = 'prev';
    },
    changeAnimationName: function ($dom) {
        var self = this;
        var oldIdx = Number($dom.attr("idx"));
        if (oldIdx != self.opt.point.length - 1) {
            idx = oldIdx + 1;
        } else {
            idx = 0;
        }
        cid = $dom.attr('cid');
        $dom.attr("idx", idx);
        $dom.css('animation-name', cid + "_" + idx);
        $dom.off("animationend").on("animationend", function () {
            self.changeAnimationName($(this));
        })
    }
    

};


