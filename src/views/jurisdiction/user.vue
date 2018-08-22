<template>
    <div class="app-container calendar-list-container ggg_user">
        <!-- 搜索条件 -->
        <el-form :inline="true" :model="params" ref="params" class="demo-form-inline" @keyup.enter.native="getTable('isseach')">
            <el-form-item label="当前页:" prop="pageIndex" v-show="false">
                <el-input v-model="params.pageIndex"></el-input>
            </el-form-item>
            <el-form-item label="行数:" prop="pageSize" v-show="false">
                <el-input v-model="params.pageSize"></el-input>
            </el-form-item>
            <el-form-item label="用户" prop="username">
                <el-input v-model="params.username" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="手机号" prop="phone">
                <el-input v-model="params.phone" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="search" @click="getTable('isseach')">查询</el-button>
                <el-button icon="setting" @click="reset('params')">重置</el-button>
            </el-form-item>
        </el-form>
        <el-button type="primary" @click="isShowAlert">新增</el-button>
        <div class="filter-container">
            <!--<div class="tableheader">用户</div>-->
            <el-table :data="dataList" v-loading="listLoading" border fit highlight-current-row style="width: 100%">
                <el-table-column align="center" label="用户">
                    <template slot-scope="scope">
                        {{scope.row.username}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="用户组">
                    <template slot-scope="scope">
                        <template v-for="(item, index) in  scope.row.authorities">
                            <span v-text="item.roleName" v-if="scope.row.authorities.length-1 == index"></span>
                            <span v-text="item.roleName + ','" v-else></span>
                        </template>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="手机号">
                    <template slot-scope="scope">
                        {{scope.row.phone}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="用户属性">
                    <template slot-scope="scope">
                        {{scope.row.loanTerm}}
                        <template v-for="(item, index) in  scope.row.authorities">
                            <span v-if="scope.row.authorities.length-1 == index">{{item.roleDesc | fileRoleDesc}}</span>
                            <span v-else>{{item.roleDesc | fileRoleDesc}}，</span>
                        </template>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="isShowAlert(scope.row, 2)">
                            修改
                        </el-button>
                        <el-button type="text" size="small" @click="deleteData(scope.row)">
                            删除
                        </el-button>
                        <el-button type="text" size="small" @click="isShowAlert(scope.row, 3)">
                            查看
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!-- 分页 -->
        <div v-if="total" class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentPageChange" :current-page.sync="params.page" :page-sizes="[10,20,30, 50]" :page-size="params.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>
        <!--弹框-->
        <el-dialog :title="title" :visible.sync="dialogVisible" width="30%" @keyup.enter.native="submitAlert('alertFrom')">
            <div>
                <el-form :rules="rules" ref="alertFrom" label-position="center" label-width="0px" :model="AlertData">
                    <table style="margin:0 auto;" class="table" cellspacing="0" cellpadding="0">
                        <tr>
                            <td>用户名</td>
                            <td>
                                <el-form-item prop="username">
                                    <el-input v-model="AlertData.username" placeholder="请输入" :disabled="disabled"></el-input>
                                </el-form-item>
                            </td>
                            <td>用户组</td>
                            <td>
                                <el-form-item prop="role">
                                    <el-select v-model="AlertData.role" multiple placeholder="请选择" :disabled="disabled">
                                        <el-option v-for="item in options" :key="item.roleId" :label="item.roleName" :value="item.roleId">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </td>
                        </tr>
                        <tr>
                            <td>密码</td>
                            <td>
                                <el-form-item prop="password">
                                    <el-input type="password" v-model="AlertData.password" placeholder="请输入" :disabled="disabled"></el-input>
                                </el-form-item>
                            </td>
                            <td>手机号</td>
                            <td>
                                <el-form-item prop="phone">
                                    <el-input v-model="AlertData.phone" placeholder="请输入" :disabled="disabled"></el-input>
                                </el-form-item>
                            </td>
                        </tr>
                    </table>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer" v-show="!disabled">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitAlert('alertFrom')" :loading="loading">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import ajax from '@utils/config';
import { validate } from '@src/utils/validation';
export default {
    data() {
        var phone = (rule, value, callback) => {
            if (!validate.validatPhone(value)) {
                callback(new Error('手机号号码格式不正确'));
                return false;
            }
            callback();
        };
        var role = (rule, value, callback) => {
            if (value && value.length == 0) {
                callback(new Error('请选择'));
                return false;
            }
            callback();
        };
        return {
            listLoading: true, //列表加载状态
            loading: false, //二次点击
            params: { //搜索条件
                limit: 10, //pageSize
                page: 1,
                username: '', //用户名字
                phone: ''
            },
            total: 0, //总页数
            dataList: [],
            title: '',
            dialogVisible: false, //修改弹窗出现
            disabled: false, //是否编辑
            options: [], //用户组
            AlertData: { //弹框表格数据
                roleId: '',
                username: '',
                phone: '',
                role: [],
                password: ''
            },
            rules: { //编辑列表验证
                username: [
                    { required: true, message: '请输入', trigger: 'blur' }
                ],
                role: [
                    { validator: role, trigger: 'blur' },
                ],
                phone: [
                    { required: true, message: '请输入', trigger: 'blur' },
                    { validator: phone, trigger: 'blur' },
                ],
            },
        }
    },
    computed: {
    },
    created() {
        this.getTable();
        this.getUser(); //用户组
    },
    mounted() {
    },
    methods: {
        getTable(isseach) {
            this.listLoading = true;
            if (isseach) {
                this.params.page = 1;
            }
            ajax({
                url: 'sysUser/page',
                optionParams: this.params
            }).post()
                .then(response => {
                    if (response.code === 200) {
                        this.dataList = response.data.records ? response.data.records : [];
                        this.total = response.data.total;
                    } else {
                        this.$message.warning(response.msg)
                    }
                    this.listLoading = false;
                })
                .catch(error => {
                    console.log(error);
                    this.listLoading = false;
                })
        },
        //获取用户组
        getUser(id) {
            this.listLoading = true;
            ajax({
                url: 'sysUserRole/rolePage',
                optionParams: {
                    limit: 999, //pageSize
                    page: 1,
                }
            }).post()
                .then(response => {
                    if (response.code === 200) {
                        this.options = response.data.records ? response.data.records : [];
                        console.log(this.options)
                    } else {
                        this.$message.warning(response.msg)
                    }
                })
                .catch(error => {
                    console.log(error);
                })
        },
        // 点击修改
        isShowAlert(item, isEdit) {
            this.dialogVisible = true; //弹窗出现
            this.loading = false; //二次提交按钮设置
            this.$nextTick(() => {
                this.$refs['alertFrom'].resetFields();//恢复表单及数据初始化状态
                if (isEdit) {
                    this.AlertData = JSON.parse(JSON.stringify(item))
                    let arr = [];
                    this.AlertData.authorities.map((item) => {
                        arr.push(item.roleId)
                    })
                    this.$set(this.AlertData, 'role', arr);
                }
            })
            //查看
            if (isEdit && isEdit == 3) {
                this.title = '查看';
                this.disabled = true;
            } else {
                this.title = "编辑";
                this.disabled = false;
            }
            if (!isEdit) {
                this.title = '新增';
                this.$set(this.AlertData, 'role', []);
                return false;
            }
        },
        handleSelect(item) {
            console.log(item.name);
            this.AlertData.groupId = item.name
        },
        // 提交弹框
        submitAlert(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let methods = '';
                    if (this.title === '编辑') {
                        methods = 'put'
                    } else {
                        methods = 'post';
                    }
                    this.loading = true; //二次提交按钮设置
                    ajax({
                        url: 'sysUser',
                        optionParams: this.AlertData
                    })[methods]()
                        .then(response => {
                            if (response.code === 200) {
                                this.$message.success(response.msg)
                                this.dialogVisible = false; //弹窗消失
                                this.getTable(); //更新列表
                            } else {
                                this.$message.warning(response.msg);
                                this.loading = false; //二次提交按钮设置
                            }
                        })
                        .catch(error => {
                            console.log(error);
                            this.loading = false; //二次提交按钮设置
                        })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        // 删除
        deleteData(row) {
            this.$confirm('确定要删除数据吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                //确认按钮
                ajax({
                    url: 'sysUser/' + row.userId,
                    optionParams: {}
                }).del()
                    .then(response => {
                        if (response.code === 200) {
                            this.$message.warning(response.msg)
                            this.getTable(); //更新列表
                        }
                    })
                    .catch(error => {
                        console.log(error)
                    })
            }).catch(() => {
                //取消
                //  this.$message.warning('取消')
            });
        },
        //重置
        reset(formName) {
            this.$refs[formName].resetFields(); //恢复表单及数据初始化状态
        },
        // 改变每一页的条数
        handleSizeChange(val) {
            this.params.limit = val;
            this.params.page = 1;
            this.getTable(); //更新列表
        },
        // 切换页码
        handleCurrentPageChange(val) {
            this.params.page = val;
            this.getTable(); //更新列表
        },
    },
    filters: {
        fileRoleDesc(value) {
            if (value) {
                if (value == 1) {
                    return '运营';
                } else if (value == 2) {
                    return '商务';
                } else if (value == 3) {
                    return '渠道';
                } else if (value == 4) {
                    return '超级管理员';
                } else {
                    return '';
                }
            }

        }

    }
}
</script>
<style lang="less" scoped>

</style>


