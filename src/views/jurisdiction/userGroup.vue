<template>
    <div class="app-container calendar-list-container ggg_user">
        <el-button type="primary" @click="isShowAlert('alertFrom')">新增</el-button>
        <div class="filter-container">
            <!--<div class="tableheader">用户</div>-->
            <el-table :data="TableList" v-loading="listLoading" border fit highlight-current-row style="width: 100%">
                <el-table-column align="center" label="用户组名称">
                    <template slot-scope="scope">
                        {{scope.row.roleName}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="备注">
                    <template slot-scope="scope">
                        {{scope.row.remark}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="创建时间">
                    <template slot-scope="scope">
                        {{scope.row.createTime}}
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
            <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentPageChange" :current-page.sync="params.page" :page-sizes="[10,20,30, 50]" :page-size="params.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>
        <!--弹框-->
        <el-dialog :title="title" :visible.sync="dialogVisible" width="30%" @keyup.enter.native="submitAlert('alertFrom')">
            <div>
                <el-form :rules="rules" ref="alertFrom" label-position="center" label-width="0px" :model="AlertData">
                    <table style="margin:0 auto;" class="table" cellspacing="0" cellpadding="0">
                        <tr>
                            <td>用户组名称</td>
                            <td>
                                <el-form-item prop="roleName">
                                    <el-input v-model="AlertData.roleName" placeholder="请输入用户组名称" :disabled="disabled"></el-input>
                                </el-form-item>
                            </td>
                            <td>备注</td>
                            <td>
                                <el-form-item prop="remark">
                                    <el-input v-model="AlertData.remark" placeholder="请输入备注" :disabled="disabled"></el-input>
                                </el-form-item>
                            </td>
                        </tr>
                        <tr>
                            <td>用户属性</td>
                            <td>
                                <el-form-item prop="roleDesc">
                                    <el-select v-model="AlertData.roleDesc" placeholder="请选择" :disabled="disabled">
                                        <el-option label="运营" value="1"></el-option>
                                        <el-option label="商务" value="2"></el-option>
                                        <el-option label="渠道" value="3"></el-option>
                                        <el-option label="超级管理员" value="4"></el-option>
                                    </el-select>
                                </el-form-item>
                            </td>
                            <td></td>
                            <td></td>
                        </tr>
                    </table>

                </el-form>
            </div>
            <el-row :gutter="100" style="margin: 0 auto; padding:10px 30px;">
                <el-col :span="10">
                    <div class="grid-content">
                        <div style="padding:10px 0;">分配权限</div>
                        <el-tree :data="treeData" show-checkbox node-key="id" default-expand-all ref="shopTree" :disabled="disabled"></el-tree>
                    </div>
                </el-col>
                <el-col :span="10">
                    <div class="grid-content">
                        <div style="padding:10px 0;">可用时间</div>
                        <el-tree :data="data" show-checkbox node-key="id" ref="timeTree" :disabled="disabled"></el-tree>
                    </div>
                </el-col>
            </el-row>
            <span slot="footer" class="dialog-footer" v-show="!disabled">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitAlert('alertFrom')" :loading="loading">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import ajax from '@utils/config';
export default {
    data() {
        return {
            listLoading: false, //列表加载状态
            loading: false, //防止二次操作
            params: { //搜索条件
                limit: 10, //pageSize
                page: 1,
            },
            total: 0,
            treeData: [],//树形主结构
            TableList: [], // 表格数据格式
            groupId: '', //保留用户组id 删除和编辑时用，更新列表
            dialogVisible: false, //修改弹窗出现
            disabled: false, //是否编辑
            title: '', // 弹框title
            AlertData: { //弹框表格数据
                roleName: '',
                remark: '',
                roleDesc: '',
                days: [],
                menuIds: [],
            },
            data: [//弹框树形数据
                {
                    id: 2,
                    label: '星期一',
                },
                {
                    id: 3,
                    label: '星期二',
                },
                {
                    id: 4,
                    label: '星期三',
                },
                {
                    id: 5,
                    label: '星期四',
                },
                {
                    id: 6,
                    label: '星期五',
                },
                {
                    id: 7,
                    label: '星期六',
                },
                {
                    id: 1,
                    label: '星期日',
                }
            ],
            rules: { //编辑列表验证
                roleName: [
                    { required: true, message: '请输入用户组名称', trigger: 'blur' }
                ],
                roleDesc: [
                    { required: true, message: '请选择', trigger: 'change' }
                ]
            }
        }
    },
    computed: {
    },
    created() {
    },
    mounted() {
        this.getTable(); //获取列表
        this.getMenuList(); //获取菜单
    },
    methods: {
        //获取表格数据
        getTable(id) {
            this.listLoading = true;
            ajax({
                url: 'sysUserRole/rolePage',
                optionParams: this.params
            }).post()
                .then(response => {
                    if (response.code === 200) {
                        this.TableList = response.data.records ? response.data.records : [];
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
        //获取菜单
        getMenuList() {
            this.contentLoading = true;
            ajax({
                url: 'auth/allMenuTree',
                optionParams: {}
            }).fetch()
                .then(response => {
                    if (response.code === 200) {
                        this.treeData = response.data ? response.data : [];
                        this.isDisabledTree(this.treeData, false)
                    } else {
                        this.$message.warning(response.msg)
                    }
                    this.contentLoading = false;
                })
                .catch(error => {
                    console.log(error)
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
                    this.$refs.shopTree.setCheckedKeys(this.AlertData.menuIds);
                    this.$refs.timeTree.setCheckedKeys(this.AlertData.days);
                }

            })
            //查看
            if (isEdit && isEdit == 3) {
                this.title = '查看';
                this.disabled = true;
                this.isDisabledTree(this.treeData, true);
                this.isDisabledTree(this.data, true);
            } else {
                this.title = "编辑";
                this.disabled = false;
                this.isDisabledTree(this.treeData, false);
                this.isDisabledTree(this.data, false);
            }
            if (!isEdit) {
                this.title = '新增';
                this.$nextTick(() => {
                    this.$refs.shopTree.setCheckedKeys([]);
                    this.$refs.timeTree.setCheckedKeys([1, 2, 3, 4, 5, 6, 7]);
                })
                return false;
            }
        },
        // 提交弹框
        submitAlert(formName) {
            let array = this.$refs.shopTree.getCheckedKeys();
            let array2 = [];
            array.map((item) => {
                if (typeof item != 'string') {
                    array2.push(item)
                }
            })
            console.log(this.$refs.shopTree.getCheckedKeys())
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    if (this.$refs.shopTree.getCheckedKeys().length === 0) {
                        this.$message.warning('请选择分配权限');
                        return false;
                    }
                    let methods = '';
                    if (this.title === '编辑') {
                        methods = 'put'
                    } else {
                        methods = 'post';
                    }
                    this.loading = true; //二次提交按钮设置
                    this.AlertData.menuIds = this.$refs.shopTree.getCheckedKeys();
                    this.AlertData.days = this.$refs.timeTree.getCheckedKeys()
                    ajax({
                        url: 'sysUserRole',
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
        //树形是否能编辑
        isDisabledTree(array, boole) {
            array.map((item) => {
                this.$set(item, 'disabled', boole);
                if (item.children && item.children.length > 0) {
                    this.isDisabledTree(item.children, boole)
                }
            })
        },
        // 删除
        deleteData(row) {
            console.log(row)
            this.$confirm('确定要删除数据吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                //确认按钮
                ajax({
                    url: 'sysUserRole/' + row.roleId,
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
    }
}
</script>
<style lang="less" scoped>

</style>


