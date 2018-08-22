<template>
    <div class="app-container calendar-list-container ggg_user">
        <img  :src="img">
        <img class="img1a"  :src="img1">
    </div>
        
</template>
<script>
export default {
    data() {
        return {
            img: require('@res/img/huanying.png'),
             img1: require('@res/img/huanybeij.png'),
        }
    },
    computed: {
    },
    created() {
    },
    mounted() {
    	
    },
    methods: {
    	
    
    },
    filters: {
    }
}
</script>
<style lang="less" scoped>
.ggg_user {
    img{
        margin:auto;
        position: absolute;
        left:0;
        right:0;
        top:-50%;
        bottom:0;
        width:100%;
    }
    .img1a{
        width: 40%;
        top:30%; 
    }
}
</style>


