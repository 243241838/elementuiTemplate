<template>
    <div class="magnifyImg">
        <el-dialog title="图片" :visible.sync="isShow" width="30%" :beforeClose="Close" :close-on-click-modal="false">
            <div class="icon_aa">
                <span class="rotation" @click="rotationImg"><img :src="rotationUrl"></span>
                <el-button icon="plus" @click="minus"></el-button>
                <el-button icon="minus" @click="shrink"></el-button>
            </div>
            <el-button @click="imgLeft()" type="primary" class="left" icon="arrow-left"></el-button>
            <div class="img" ref="imgDivParent">
                <!--DOMMouseScroll 火狐写法-->
                <img :src="'https://img.zhaogu168.com/' + imgsrc + '?x-oss-process=style/zrf'" alt="" ref="imgdIV" @mousedown="mousedown($event)" @mousewheel="onWheelZoom($event)" @DOMMouseScroll="onWheelZoom($event)">
            </div>
            <el-button @click="imgRight()" type="primary" class="right" icon="arrow-right"></el-button>
            <span slot="footer" class="dialog-footer" style="position:fixed; bottom:15px;right:20px;">
                <el-button @click="Close">取 消</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
    data() {
        return {
            imgsrc: '',
            imgIndex: '',
            rotationUrl: require("@res/img/xuanz.png"),
            current: 0,
            scale: 1
        }
    },
    props: {
        isShow: Boolean,
        imgAlertArray: Array,
        index: ''
    },
    watch: {
        imgAlertArray: function(newValue, oldValue) {
            if (newValue.length > 0) {
                this.imgsrc = newValue[this.index].consumeImg;
                this.imgIndex = JSON.parse(JSON.stringify(this.index));
                //还原
                this.$nextTick(() => {
                    var oDiv = this.$refs.imgDivParent;
                    oDiv.style.left = 0;
                    oDiv.style.top = 0;
                    this.current = 0;
                    this.scale = 1;
                    this.$refs.imgdIV.style.transform = 'rotate(0deg)' + 'scale(1)';
                })

            }
        }
    },
    computed: {
    },
    created() {

    },
    mounted() {
    },
    methods: {
        //拖拽
        mousedown(ev) {
            ev.preventDefault(); //解决鼠标单击长时间拖拽移动
            var oDiv = this.$refs.imgDivParent;
            var oEvent = ev;
            var disX = oEvent.clientX - oDiv.offsetLeft;
            var disY = oEvent.clientY - oDiv.offsetTop;
            document.onmousemove = function(ev) {
                oEvent = ev;
                oDiv.style.left = oEvent.clientX - disX + "px";
                oDiv.style.top = oEvent.clientY - disY + "px";
            }
            document.onmouseup = function() {
                document.onmousemove = null;
                document.onmouseup = null;
            }
        },
        //滚轮
        onWheelZoom($event) {
            let e = $event;
            if (e.wheelDelta) {  //判断浏览器IE，谷歌滑轮事件               
                if (e.wheelDelta > 0) { //当滑轮向上滚动时  
                    this.minus();
                }
                if (e.wheelDelta < 0) { //当滑轮向下滚动时  
                    this.shrink()
                }
            } else if (e.detail) {  //Firefox滑轮事件
                if (e.detail > 0) { //当滑轮向上滚动时  
                    this.minus();
                }
                if (e.detail < 0) { //当滑轮向下滚动时  
                    this.shrink()
                }
            }
            document.querySelector('.el-dialog').style.position = 'fixed';
        },
        //放大
        minus() {
            this.scale = this.scale + 0.2;
            if (this.scale >= 5) {
                this.scale = 5;
            }
            this.$refs.imgdIV.style.transform = 'rotate(' + this.current + 'deg) scale(' + this.scale + ')';
        },
        //缩小
        shrink() {
            this.scale = this.scale - 0.2;
            if (this.scale < 1) {
                this.scale = 1;
            }
            this.$refs.imgdIV.style.transform = 'rotate(' + this.current + 'deg) scale(' + this.scale + ')';
        },
        //关闭
        Close() {
            this.$emit('alertClost')
        },
        //向左
        imgLeft() {
            if (this.imgIndex != 0) {
                this.imgIndex--;
                var oDiv = this.$refs.imgDivParent;
                oDiv.style.left = 0;
                oDiv.style.top = 0;
                this.current = 0;
                this.scale = 1;
                this.$refs.imgdIV.style.transform = 'rotate(0deg)' + 'scale(1)';
            }
            this.imgsrc = this.imgAlertArray[this.imgIndex].consumeImg;
        },
        //向右
        imgRight() {
            if (this.imgIndex < this.imgAlertArray.length - 1) {
                this.imgIndex++;
                var oDiv = this.$refs.imgDivParent;
                oDiv.style.left = 0;
                oDiv.style.top = 0;
                this.current = 0;
                this.scale = 1
                this.$refs.imgdIV.style.transform = 'rotate(0deg)' + 'scale(1)';
            }
            this.imgsrc = this.imgAlertArray[this.imgIndex].consumeImg;
        },
        //旋转
        rotationImg() {
            this.current = (this.current + 90) % 360;
            this.scale = 1;
            this.$refs.imgdIV.style.transform = 'rotate(' + this.current + 'deg)' + 'scale(1)';
        }
    },
    filters: {
    }
}
</script>
<style lang="less">
.magnifyImg {
    .el-dialog {
        &.el-dialog--small {
            overflow: hidden;
            position: fixed;
            height:80%;
        }
    }
    .img {
        text-align: center;
        position: relative;
        width: 100%;
        height: 100%;
        img {
            max-width: 100%;
            max-height:70%;
            cursor: move;
            margin: auto;
        }
    }
    .left {
        position: absolute;
        left: 0;
        top: 50%;
        margin-top: -10px;
        z-index: 2;
        font-size: 20px;
        font-weight: bold;
        padding: 15px!important;
    }
    .right {
        position: absolute;
        right: 0;
        top: 50%;
        margin-top: -10px;
        z-index: 2;
        font-size: 20px;
        font-weight: bold;
        padding: 15px!important;
    }
    .icon_aa {
        text-align: center;
        position: relative;
        z-index: 1;
        .rotation {
            img {
                width: 30px;
            }
        }
        button {
            position: relative;
            top: -8px;
            margin-left: 10px;
            border: 0;
            background: transparent;
            font-size: 18px;
            &:hover {
                background: transparent;
            }
        }
    }
    .dialog-footer,.el-dialog__close{
        position: relative;
        z-index: 1;
    }
}
</style>


