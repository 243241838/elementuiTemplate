<template>
    <div>
        <el-upload class="upload-demo" action="" :multiple="!isOne" v-loading="loading" :before-upload="beforeAvatarUpload" :on-preview="handlePreview" :on-remove="handleRemove" :on-success="handleSuccess" :onError="uploadError" :show-file-list="true" :file-list="fileList" list-type="picture">
            <el-button size="small" type="primary">点击上传</el-button>
            <!--<div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过10M</div>-->
        </el-upload>
        <input type="file" @change="uploadChange" multiple="multiple" v-if="false">
    </div>
</template>
<script>
import co from "co";
import OSS from "ali-oss";
export default {
    data() {
        return {
            fileList: [],
            loading: false,
            baseUrl: 'https://img.zhaogu168.com/',
        }
    },
    props: {
        dialogVisible: Boolean,
        isOne: Boolean,
        imgShow: String
    },
    watch: {
        dialogVisible: function(newValue, oldValue) {
            if (newValue) {
                if (this.imgShow) {
                    this.fileList = [
                        { name: '', url: this.baseUrl + this.imgShow }
                    ]
                } else {
                    console.log('a')
                    this.fileList = [];
                }

            }
        }
    },
    computed: {
    },
    created() {
        //初始化第一次用到要不显示不了默认图片
        if (this.imgShow) {
            this.fileList = [
                { name: '', url: this.baseUrl + this.imgShow }
            ]
            console.log(this.fileList)
        } else {
            this.fileList = [];
        }

    },
    mounted() {
    },
    methods: {
        uploadChange(event) {
            let input = event.srcElement ? event.srcElement : event.target;
            if (input.files.length > 0) {
                console.log(input.files)
                for (let i = 0; i < input.files.length; i++) {
                    this.beforeAvatarUpload(input.files[i])
                }
            }

        },
        //删除
        handleRemove(file, fileList) {
            if (file) {
                this.$emit('handleRemove', file.name)
                if (!this.isOne) {
                    this.fileList.map((item, index) => {
                        if (file.name == item.name) {
                            this.fileList.splice(index, 1)
                        }
                    })
                } else {
                    this.fileList = [];
                }
            }
        },
        //点击文件列表中已上传的文件时的钩子
        handlePreview(file) {
            console.log(file);
            // this.imgLength = file.length;
        },
        //上传之前格式大小校检
        beforeAvatarUpload(file) {
            this.loading = true;
            // console.log(file)
            // console.log('i-------')
            let fileName = file.name.split('.');
            const isLt2M = file.size / 1024 / 1024 < 10;
            if (file.type != 'image/jpeg' && file.type != 'image/png') {
                this.$message.error('上传的图片只能是 JPG、PNG 格式!');
                this.loading = false;
                return false;
            }
            if (!isLt2M) {
                this.$message.error('上传的图片大小超过 10MB 的将不在上传队列！');
                this.loading = false;
                return false;
            }
            const client = new OSS({
                region: "oss-cn-shanghai",
                accessKeyId: "LTAIR632dUFd2DhQ",
                accessKeySecret: "vBysGq1EM3Ti3vjmY5dyJmtKaACoDn",
                bucket: "ygg168"
            });
            // 上传
            let that = this;
            let name = 'sd/infoimg/' + this.getNowDate() + '/' + this.timestamp() + parseInt(Math.random() * 10000 + this.fileList.length) + '.' + fileName[fileName.length - 1];
            that.$emit('successLoad', name)
            co(function* () {
                let img = yield client.multipartUpload(name, file);
                if (that.isOne) {
                    that.fileList = [
                        {
                            name: name,
                            url: 'https://img.zhaogu168.com/' + name
                        }
                    ]
                } else {
                    that.fileList.push(
                        {
                            name: name,
                            url: 'https://img.zhaogu168.com/' + name
                        }
                    );
                }
                that.loading = false;
            }).catch(function(err) {
                that.loading = false;
                console.log(err);
            });
            return false;
        },
        getNowDate() {
            let d = new Date()
            let yue = '';
            let ri = '';
            if ((d.getMonth() + 1) < 10) {
                yue = ('0' + (d.getMonth() + 1))
            } else {
                yue = (d.getMonth() + 1)
            }
            if ((d.getDate()) < 10) {
                ri = ('0' + (d.getDate()))
            } else {
                ri = (d.getDate())
            }

            let dateTmp = (d.getFullYear()) + yue + ri
            return dateTmp;
        },
        timestamp() {
            let time = new Date();
            let y = time.getFullYear();
            let m = time.getMonth() + 1;
            let d = time.getDate();
            let h = time.getHours();
            let mm = time.getMinutes();
            let s = time.getSeconds();
            return '' + y + this.add0(m) + this.add0(d) + this.add0(h) + this.add0(mm) + this.add0(s);
        },

        add0(m) {
            return m < 10 ? '0' + m : m;
        },
        handleSuccess(response, file, fileList) {
            window.alert('a')
            this.$emit('successLoad', fileList);
        },
        // 上传错误
        uploadError(response, file, fileList) {
            this.$message.error('上传失败，请重试!');
        }
    },
    filters: {
    }
}
</script>
<style lang="less" scoped>

</style>


