<template>
	<div>
		<div class='header' :style="headerBackground" :class="{'head_background': isCollapse}">
			<!-- <img :src="logo" class="logo"> 
																	      <h3>链钱信贷审批管理平台</h3> -->
			<div class="collapseImg" @click="Collapse()" :class="{Collapse3:isCollapse}">
				<img :src="collapseUrl" alt="">
			</div>
			<h3></h3>
			<ul class='rightBox'>
				<li class='usersBox right'>
					<span class="shuxian">
						<img :src="home_log" /> 欢迎，
						<strong>{{logname}}</strong>
					</span>
					<span @click="quit" style="cursor: pointer;">退出</span>
					<!-- <span></span> -->
				</li>
				<li class='searchBox right'>
					<!-- <img :src="search" class="search"> 
																	          <span>搜索</span> -->
					<span></span>
				</li>
				<li class=' right'>
					<!-- <img :src="news" class="news"> 
																	          <span>7</span> -->
					<span></span>
				</li>
				<li class=' right'>

				</li>
			</ul>
		</div>

	</div>
</template>

<script>
import Cookies from 'js-cookie';
import loginout from '@src/utils/loginout';
import { mapGetters } from 'vuex';
import baseURL from '@utils/baseURL.js'
export default {
	data() {
		return {
			headerBackground: {
				background: 'url(' + require("@res/img/head_background.png") + ') no-repeat',
				backgroundPosition: 'right'
			},
			collapseUrl: require("@res/img/icon-liebiao.png"),
			home_log: require("@res/img/home-log.png"),
			logname: ''
		}
	},
	computed: {
		...mapGetters([
			'isCollapse'
		])
	},
	created() {
		this.logname = Cookies.get('user');
	},
	methods: {
		Collapse() {
			// console.log(this.$store.getters.isCollapse);
			this.$store.dispatch('SETISCOLLAPSE', { isCollapse: this.$store.getters.isCollapse });
		},
		clickHandler() {
			alert(Date.now())
		},
		quit() {
			//localStorage.setItem("logname", "");
			// this.$router.push({
			// 	path: '/login'
			// });
			//window.location.reload();
			loginout(true)
		}
	}
}


</script>
<style rel="stylesheet/less" lang="less" scoped>
.head_background {
	transition: all .28s;
	background-size: 100% 100%!important;
}

.collapseImg {
	position: absolute;
	top: 16px;
	left: 240px;
	transition: all .28s;
	z-index: 2;
	img {
		width: 15px;
		height: 15px;
		cursor: pointer;
	}
	&.Collapse3 {
		left: 74px;
	}
}
</style>
