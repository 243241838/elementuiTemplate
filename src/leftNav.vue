<template>
    <div class='leftNav2' :style="leftBackground">
        <!-- <div class="leftNav-img"></div> -->
        <div class="left_login" :class="{Collapse2:isCollapse}">
            <div class="left_logo">
                <img :src="loginUrl" alt="">
            </div>
            <div class="collapseImg" @click="Collapse();" :class="{Collapse3:isCollapse}" v-show="false">
                <img :src="collapseUrl" alt="">
            </div>
        </div>
        <ul class='listBox' :class="{Collapse:isCollapse}">
            <el-menu background-color="#1e282c"   text-color="#b8c7ce"  :collapse-transition="true" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" :collapse="isCollapse" :unique-opened="true">
                <el-submenu :index="item.id + ''" v-for="(item, index) in listInfo" :key="item.id">
                    <template slot="title">
                        <!--<i class="el-icon-menu"></i>-->
                        <i class="nav_img" v-for="logo in nav_logo" v-show="item.label == logo.label"><img :src="logo.url" /></i>
                        <i class="el-icon-message" v-show="item.label == '通知栏目'"></i>
                        <span v-text="item.label"></span>
                    </template>
                    <el-menu-item-group>
                        <template v-for="itm in item.children">
                            <el-menu-item :index="itm.id + ''" v-text="itm.label" v-if="itm.children.length == 0" @click="$router.push(itm.path)"></el-menu-item>
                            <el-submenu :index="itm.id + ''" v-else>
                                <span slot="title" v-text="itm.label"></span>
                                <el-menu-item :index="list.id + ''" v-for="list in itm.children" :key="list.id" v-text="list.label" @click="$router.push(list.url)"> </el-menu-item>
                            </el-submenu>
                        </template>
                    </el-menu-item-group>
                </el-submenu>
            </el-menu>
        </ul>
    </div>
</template>

<script>
import _ from "underscore";
import { authInfo } from "./common/auth.js";
import { mapGetters } from 'vuex';
import ajax from '@utils/config';
export default {
    data() {
        return {
            leftBackground: {
                background: 'url(' + require("@res/img/zuo.png") + ') no-repeat'
            },
            //isCollapse: this.$store.getters.isCollapse,
            activeIndex: '0',
            collapseUrl: require("@res/img/icon-liebiao.png"),
            arrow: require("@res/img/arrow.png"),
            arrowTop: require("@res/img/arrow2.png"),
            loginUrl: require("@res/img/logo_left.png"),
            // listInfo: this.$store.getters.router,
            listInfo1: [],
            nav_logo: [
                { label: '权限', url: require('@res/img/aa1.png') },
                { label: '产品管理', url: require('@res/img/aa2.png') },
                { label: '用户管理', url: require('@res/img/zhongshen.png') },
                { label: '财务数据', url: require('@res/img/caiwu.png') },
                { label: '逾期列表', url: require('@res/img/yuqi.png') },
                { label: '流量管理', url: require('@res/img/pingtaishuju.png') },
                { label: '合同管理', url: require('@res/img/hetong.png') }
            ],
            listInfo: [
                {
                    img: require("@res/img/icon-yewu.png"),
                    label: "权限",
                    path: "/jurisdiction",
                    id: 110000,
                    children: [
                        {
                            path: '/jurisdiction/userGroup',
                            label: '用户组',
                            id: 110001,
                            children: []
                        },
                        {
                            path: '/jurisdiction/user',
                            label: '用户',
                            id: 110003,
                            children: []
                        }
                    ]
                },
                {
                    img: require("@res/img/icon-yewu.png"),
                    label: "产品管理",
                    path: "/product",
                    id: 120000,
                    children: [
                        {
                            path: '/product/putawayManage',
                            label: '上架管理',
                            id: 120001,
                            children: []
                        },
                        {
                            path: '/product/productManage',
                            label: '产品管理',
                            id: 120001,
                            children: []
                        }

                    ]
                },
                {
                    img: require("@res/img/icon-yewu.png"),
                    label: "用户管理",
                    path: "/userManage",
                    id: 130000,
                    children: [
                        {
                            path: '/userManage/userManage',
                            label: '用户管理',
                            id: 130001,
                            children: []
                        },
                        {
                            path: '/userManage/customerManager',
                            label: '客户经理',
                            id: 130002,
                            children: []
                        }

                    ]
                },
                {
                    img: require("@res/img/icon-yewu.png"),
                    label: "流量管理",
                    path: "/fluxManage",
                    id: 140000,
                    children: [
                        {
                            path: '/fluxManage/fluxManage',
                            label: '流量管理',
                            id: 140001,
                            children: []
                        },
                        {
                            path: '/fluxManage/rebateManage',
                            label: '返拥管理',
                            id: 140001,
                            children: []
                        }

                    ]
                },
                {
                    img: require("@res/img/icon-yewu.png"),
                    label: "财务数据",
                    path: "/financialData",
                    id: 150000,
                    children: [
                        {
                            path: '/financialData/incomeDetails',
                            label: '收入详情',
                            id: 150001,
                            children: []
                        }

                    ]
                }
            ]
        };
    },
    computed: {
        ...mapGetters([
            'isCollapse'
        ])
    },
    created() {
        this.getMenuList(); //获取菜单
    },
    mounted() {
    },
    methods: {
        statusFlag: function(item, listInfo) {
            let status = !item.status;
            for (let list in listInfo) {
                listInfo[list].status = false;
            }
            item.status = status;
        },
        setActiveIndex(index) {
            this.activeIndex = index + '';
        },
        //获取菜单
        getMenuList() {
            ajax({
                url: 'auth/menuTree',
            }).fetch()
                .then(res => {
                    // console.log(res)
                    this.listInfo1 = res.data ? res.data : [];
                    // console.log(res.data)
                })
                .catch(error => {
                    console.log(error)
                })
        },
        handleOpen(key, keyPath) {
            // console.log(key, keyPath);
        },
        handleClose(key, keyPath) {
            console.log(key, keyPath);
        },
        Collapse() {
            // console.log(this.$store.getters.isCollapse);
            this.$store.dispatch('SETISCOLLAPSE', { isCollapse: this.$store.getters.isCollapse });
        },
        go_url(childrenList) {
            if (childrenList.childrenList.length == 0) {
                this.$router.push(childrenList.hash)
            }
        }
    }
    //.el-menu-item-group__title
};
</script>
<style rel="stylesheet/less" lang="less">
//左新的
.leftNav2 {
    transition: width .28s;
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    z-index: 11;
    height: 100%;
    background: #ffffff; // 头logo
    .left_login {
        width: 228px;
        height: 50px;
        background: #000;
        position: relative;
        &.Collapse2 {
            width: 64px;
            height: 50px;
            background: #000;
            .left_logo {
                img {
                    // transition: all .28s;
                    width: 64px;
                    height: 50px;
                }
            }
        }
        .collapseImg {
            position: absolute;
            right: 10px;
            top: 16px;
            img {
                width: 15px;
                height: 15px;
            }
            &.Collapse3 {
                position: absolute; // right: -155px;
                top: 16px;
            }
        }
    } // 导航
    .listBox {
        margin: 0 15px;
        padding-top: 15px;
        max-height: 100%;
        overflow-y: auto;
        /*三角箭头的颜色*/
        scrollbar-arrow-color: transparent;
        /*滚动条滑块按钮的颜色*/
        scrollbar-face-color: transparent;
        /*滚动条整体颜色*/
        scrollbar-highlight-color: transparent;
        /*滚动条阴影*/
        scrollbar-shadow-color: transparent;
        /*滚动条轨道颜色*/
        scrollbar-track-color: transparent;
        /*滚动条整体部分,必须要设置*/
        &::-webkit-scrollbar {
            width: 2px;
            height: 2px;
            background-color: transparent;
        }
        /*滚动条的轨道*/
        &::-webkit-scrollbar-track {
            box-shadow: none;
            background-color: transparent;
        }
         .el-menu {
             border: 0;
         }
        >.el-menu {
            >.el-submenu {
                position: relative; // title颜色
                >.el-submenu__title {
                    background: #1e282c;
                    color: #fff!important;
                    font-size: 12px!important;
                } //title加遮罩
                >.el-submenu__title::before {
                    content: "";
                    display: block;
                    width: 100%;
                    height: 100%;
                    background: rgba(80, 99, 119, 0.5);
                    position: absolute;
                    z-index: 1;
                    left: 0;
                    top: 0;
                } //导航打开遮罩消失
                &.is-opened {
                    >.el-submenu__title::before {
                        display: none;
                    }
                    >.el-submenu__title {
                        border-left: 3px solid #3c8dbc;
                    }
                } //二级背景和鼠标滑过颜色和字体颜色
                >.el-menu {
                    background: #2c3b41;
                    border-radius: 0;
                    >.el-menu-item-group {
                        background: #2c3b41!important;
                        >ul {
                            >.el-menu-item {
                                color: #b8c7ce;
                                background: #2c3b41!important;
                                font-size: 12px!important;
                            }
                            >.el-menu-item:hover {
                                color: #fff!important;
                                background: #2c3b41;
                            } //2级头
                            >.el-submenu {
                                >.el-submenu__title {
                                    color: #b8c7ce;
                                    font-size: 12px!important;
                                    background: #2c3b41!important;
                                }
                                >.el-submenu__title:hover {
                                    color: #fff!important;
                                    background: #2c3b41;
                                } // 三级
                                >.el-menu {
                                    background: #2c3b41;
                                    >.el-menu-item {
                                        color: #b8c7ce;
                                        background: #2c3b41!important;
                                        font-size: 12px!important;
                                    }
                                    >.el-menu-item:hover {
                                        color: #fff!important;
                                        background: #2c3b41;
                                    }
                                }
                            }
                        }
                    }
                }
            } //鼠标滑过title
            >.el-submenu:hover {
                >.el-submenu__title::before {
                    display: none;
                }
                >.el-submenu__title {
                    border-left: 3px solid #3c8dbc;
                }
            }
        }
        &.Collapse {
            height: 100%;
            border: none;
            overflow: auto;
            position: absolute;
            width: 64px;
            margin: 0;
            /*三角箭头的颜色*/
            scrollbar-arrow-color: transparent;
            /*滚动条滑块按钮的颜色*/
            scrollbar-face-color: transparent;
            /*滚动条整体颜色*/
            scrollbar-highlight-color: transparent;
            /*滚动条阴影*/
            scrollbar-shadow-color: transparent;
            /*滚动条轨道颜色*/
            scrollbar-track-color: transparent;
            /*滚动条整体部分,必须要设置*/
            &::-webkit-scrollbar {
                width: 2px;
                height: 2px;
                background-color: transparent;
            }
            /*滚动条的轨道*/
            &::-webkit-scrollbar-track {
                box-shadow: none;
                background-color: transparent;
            }
            /*滚动条的滑块按钮*/
            &::-webkit-scrollbar-thumb {
                border-radius: 0;
                background-color: transparent;
                box-shadow: none;
            }
            /*滚动条的上下两端的按钮*/
            &::-webkit-scrollbar-button {
                height: 0;
                background-color: transparent;
            }
        }
    }
    .nav_img {
        width: 24px;
        text-align: center;
        margin-right: 10px;
        display: inline-block;
    }
}
</style>

