<template>
    <el-card class="box-card">
        <!-- 1. 面包屑 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>首页</el-breadcrumb-item>
          <el-breadcrumb-item>用户管理</el-breadcrumb-item>
          <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 2. 搜索 -->
        <el-row class="searchRow">
            <el-col>
                <el-input
                @clear="loadUserList()"
                 clearable placeholder="请输入内容" v-model="query" class="inputSearch">
                    <el-button
                    @click="searchUser()"
                     slot="append" icon="el-icon-search"></el-button>
                </el-input>
                <el-button type="success" @click="showAddUserDia()">添加用户</el-button>
            </el-col>
        </el-row>
        <!-- 3. 表格 -->
        <el-table
            :data="tableData" 
            style="width: 100%">
            <el-table-column
            type="index"
                label="#"
                width="60">
            </el-table-column>
            <el-table-column
                prop="username"
                label="姓名"
                width="80">
            </el-table-column>
            <el-table-column
                prop="email"
                label="邮箱">
            </el-table-column>
            <el-table-column
                prop="mobile"
                label="电话">
            </el-table-column>
            
            <el-table-column
                label="创建时间">
                <!-- 如果单元格内显示的内容不是字符串（文本），
                 需要给被显示的内容外层包裹一个template-->
                 
                 <!-- template 内部要用数据  设置 slot-scope属性
                    该属性的值是要用数据create_time的数据源userlist-->
                <!-- slot-scope的值userlist其实就是el-table绑定的数据userlist
                  userlist.row -> 数组中的每个对象-->
                    
                <template slot-scope="scope">
                    {{scope.row.create_time | fmtdate}}
                </template>
            </el-table-column>
            
            <el-table-column
                label="用户状态">
                <template slot-scope="scope">
                    <el-switch
                    @change="changeMgState(scope.row)"
                      v-model="scope.row.mg_state"
                      active-color="#13ce66"
                      inactive-color="#ff4949">
                    </el-switch>
                </template>
            </el-table-column>
            
            <el-table-column
                prop="address"
                label="操作">
                <template slot-scope="scope">
                     <el-button 
                     size="mini" 
                     plain 
                     type="primary" 
                     icon="el-icon-edit" 
                     circle
                     @click="showEditUserDia(scope.row)">
                     </el-button>
                     
                     <el-button
                      size="mini"
                       plain 
                       type="danger" 
                       icon="el-icon-delete" 
                       circle 
                       @click="showDeleUserMsgBox(scope.row.id)">
                       </el-button>
                       
                      <el-button 
                      @click = "showSetUserRoleDia(scope.row)"
                      size="mini" 
                      plain type="success" 
                      icon="el-icon-check" 
                      circle></el-button>
                      
                </template>
            </el-table-column>
        </el-table>
        <!-- 4. 分页 -->
         <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="pagenum"
              :page-sizes="[2, 4, 6, 8]"
              :page-size="2"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total">
        </el-pagination>
        
        <!-- 对话框 -->
          <!-- 添加用户的对话框 -->
          <el-dialog title="添加用户" :visible.sync="dialogFormVisibleAdd">
            <el-form :model="form">
              <el-form-item label="用户名" label-width="100px">
                <el-input v-model="form.username" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="密码" label-width="100px">
                <el-input v-model="form.password" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="邮箱" label-width="100px">
                <el-input v-model="form.email" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="电话" label-width="100px">
                <el-input v-model="form.model" autocomplete="off"></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
              <el-button type="primary" @click="addUser()">确 定</el-button>
            </div>
          </el-dialog>
          
          <!-- 编辑用户的对话框 -->
          <el-dialog title="分配角色" :visible.sync="dialogFormVisibleEdit">
            <el-form :model="form">
              <el-form-item label="用户名" label-width="100px">
                <el-input disabled v-model="form.username" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="邮箱" label-width="100px">
                <el-input v-model="form.email" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="电话" label-width="100px">
                <el-input v-model="form.model" autocomplete="off"></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
              <el-button type="primary" @click="dialogFormVisibleEdit = false">确 定</el-button>
            </div>
          </el-dialog>
          
          <!-- 分配角色的对话框 -->
           <!-- 因为接口的原因删除的功能不完整，注释掉，另写一个有页面效果和视野效果的代码 -->
          <!-- <el-dialog title="分配角色" :visible.sync="dialogFormVisibleRol">
            <el-form :model="form">
              <el-form-item label="用户名" label-width="100px">
                {{currUsername}}
              </el-form-item>
              <el-form-item label="角色" label-width="100px"> -->
                  <!-- 
                    如果select的绑定的数据的值  和  option的value的一样，
                    就会显示该option的Label值
                   -->
               <!-- <el-select v-model="currRoleId">
                  <el-option label="请选择" :value="-1"></el-option> -->
                  <!-- <el-option label="区域二" value="beijing"></el-option> -->
                <!-- </el-select> -->
               <!-- <el-select v-model="currRoleId">
                    <el-option label="请选择" :value="-1"></el-option>
                    <el-option :label="item.roleName" :value="item.id" v-for="(item,i) in roles" :key="i"></el-option>
                </el-select> -->
                
           <!--   </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogFormVisibleRol = false">取 消</el-button>
              <el-button type="primary" @click="dialogFormVisibleRol = false">确 定</el-button> -->
              <el-dialog title="分配角色" :visible.sync="dialogFormVisibleRol">
                <el-form :model="form">
                  <el-form-item label="用户名" label-width="100px">
                    <el-input disabled v-model="form.username" autocomplete="off"></el-input>
                  </el-form-item>
                  <el-form-item label="角色" label-width="100px">
                    <el-select v-model="currRoleId" placeholder="请选择角色区域">
                      <el-option disabled label="请选择" :value="-1"></el-option>
                      <el-option label="主管" value="zhuguan"></el-option>
                      <el-option label="测试角色" value="ceshijuese"></el-option>
                      <el-option label="测试角色2" value="ceshijuese2"></el-option>
                      <el-option label="超级管理员" value="guanliyuan"></el-option>
                      <el-option label="test" value="test"></el-option>
                    </el-select>
                  </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                  <el-button @click="dialogFormVisibleRol = false">取 消</el-button>
                  <el-button type="primary" @click="setRole()">确 定</el-button>
                </div>
              </el-dialog>
            </div>
          </el-dialog>
    </el-card>
</template>

<script>
    export default {
        data() {
            return {
                query: '',
                // 表格绑定的数据
                UserList: [],
                //  分页相关的数据
                total: -1,
                pagenum: 1,
                pagesize: 2,
                // 添加对话框的属性
                dialogFormVisibleAdd: false,
                // 编辑对话框的属性
                dialogFormVisibleEdit: false,
                // 分配角色对话框的属性
                dialogFormVisibleRol: false,
                // 添加用户的表单数据
                form: {
                    username: '',
                    password: '',
                    email: '',
                    model: ''
                },
                
                // 因为 接口的原因  只能手动的写  如果接口成功的话要将上面的             :data="userlist" 
                tableData: [{
                            username: '王俊琪',
                            email: '00002555@qq.com',
                            mobile: '1561632-656',
                            create_time: '2020-08-11',                           
                          },
                          {
                            username: '哈哈哈哈',
                            email: '1155615.com',
                            mobile: '54643',
                            create_time: '2020-08-12',           
                           },
                         {
                           username: '嘻嘻嘻',
                           email: '0846155@qq.com',
                           mobile: '135151516',
                           create_time: '2020-08-13',           
                          },
                         {
                           username: '呵呵呵',
                           email: '6995255@qq.com',
                           mobile: '03262-656',
                           create_time: '2020-08-11',           
                          },
                          ]
            }
            //  分配角色
            currRoleId: -1
            currUserId: -1
            currUsername: ''
            // 保存所有角色数据
            roles: []
            
        },
        created() {
            this.getUserList()
        },
        methods: {
            // 添加用户 ---  显示对话框
            showAddUserDia() {
                this.dialogFormVisibleAdd = true
            },
            // 添加用户  --- 发送请求
            async addUser() {
                // 2.关闭对话框
                this.dialogFormVisibleAdd = false
                
                const res = await this.$http.post('users', this.form)
                console.log(res)
                const {
                    meta: { status, msg },
                    data
                } = res.data
                if (status === 201) {
                    // 1. 提示成功
                    this.$messag.success(msg)
                    // 3. 更新视图
                    this.getUserList()
                    // 4. 清空文本框
                    // this.form.username = ""
                    this.form = {}
                } else{
                    this.$messag.warning(msg)
                }
            },
            // 清空搜索框  重新获取数据
            loadUserList() {
                this.getUserList()
            },
            // 搜索用户
            searchUser() {
                // 按照input 绑定 query 参数  发请求
                this.getUserList()
            },
            // 删除用户  -  打开消息盒子（config）
            // 因为接口的原因删除的功能不完整，注释掉，另写一个有页面效果和视野效果的代码
            // showDeleUserMsgBox(userId) {
            //     this.$confirm('此操作将删除用户, 是否继续?', '提示', {
            //               confirmButtonText: '确定',
            //               cancelButtonText: '取消',
            //               type: 'warning'
            //             })
            //             .then(async() => {
            //                 // 发送删除的请求   :id ----   用户  id
            //                 //  1. data中找 userId
            //                 //  2. 把userId以shoeDeleteUseerMsgBox参数形式传进来
            //                 const res = await this.$http.delete('user/${userId}')
            //                 console.log(res)
            //                 if (res.data.meta.status === 200) {
            //                     //  更新视图
            //                     this.getUserList()
            //                     // 提示
            //                     this.$message({
            //                       type: 'success',
            //                       message: 'res.data.meta.msg'
            //                 })
                          
            //               }
            //             })
            //             .catch(() => {
            //               this.$message({
            //                 type: 'info',
            //                 message: '已取消删除'
            //               });          
            //             });
            // },
            showDeleUserMsgBox(userId) {
                 this.$confirm('此操作将删除用户, 是否继续?', '提示', {
                          confirmButtonText: '确定',
                          cancelButtonText: '取消',
                          type: 'warning'
                        }).then(() => {
                          this.$message({
                            type: 'success',
                            message: '删除成功!'
                          });
                        }).catch(() => {
                          this.$message({
                            type: 'info',
                            message: '已取消删除'
                          });          
                        });
            },
            // 编辑用户 -> 显示对话框
            showEditUserDia(user) {
                console.log(user)
                this.form = user
                // 获取用户数据
                this.dialogFormVisibleEdit = true
            },
            // 修改状态
            async changeMgState(user) {
                // 发送请求
                //  users/:uId/state/:type
                const res = await this.$http.put(
                // 1. mg_state = false
                // 2. 点开关  ->  mg_state = true
                'users/${user.id}/state/${user.ms_state}'
                )
                console.log(res)
            },
            // 分配角色 -> 打开对话框
            // async showSetUserRoleDia(user) {
            //     this.currUsername = user.username
            //      给currUserId赋值
                    // this.currUserId = user.id
            //      // 获取所有的角色
            //      const res1 = await this.$http.get('roles')
            //      // console.log(res1)
            //      this.roles = res1.data.data
            //      // 获取当前用户的角色ID->rid
            //      const res = await this.$http.get('users/${user.id}')
            //      this.currRoleId = res.data.data.rid
            //     this.dialogFormVisibleRol = true
            // },
            showSetUserRoleDia(user) {
                // 给currUserId赋值
                this.currUserId = user.id
                this.form = user
                this.dialogFormVisibleRol = true
            },
            // 角色分配  -  发送请求
            async setRole() {
                // users/:id/role
                //:id  要修改的用户的id值
                // 请求体中 rid  修改的新值角色id
                const res = await this.$http.put('users/:${this.currUserId}/role',{rid: this.currRoleId})
                console.log(res)
                //  关闭对话框
                this.dialogFormVisibleRol = false
            },
            // 获取用户列表的请求
            async getUserList() {
                // query  查询参数  可以为空
                //  pagenum  当前页码  不能为空
                //   pagesize   每页显示的条数   不能为空
                
                
                // 需要授权的 API ，必须在请求头中使用 Authorization 字段提供 token 令牌
                const AUTH_TOKEN = localStorage.getItem('token')
                this.$http.defaults.headers.common['Authorization'] = AUTH_TOKEN
                
                const res = await this.$http.get(
                    `users?query=${this.query}$pagenum=${this.pagenum}$pagesize=${
                        this.$pagesize}`)
                    console.log(res)
                    const {
                        meta: { status, msg},
                        data: { users, total }
                    } = res.data
                    if (status === 200) {
                        // 1. 给表格数据赋值
                        this.userlist = users
                        // 2. 给total 赋值
                        this.total = total
                        // 3. 提示
                        this.$message.success(msg)
                    } else {
                        //  提示
                        this.$message.warning(msg)
                    }
            },
            // 分页
             handleSizeChange(val) {
                    console.log(`每页 ${val} 条`);
                    this.pagesize = val
                    // this.pagenum = 1
                    this.getUserList()
                  },
                  handleCurrentChange(val) {
                    console.log(`当前页: ${val}`);
                    this.pagesize = val
                    this.getUserList()
                  }
        }
    }
</script>

<style>
    .box-card {
        height: 100%;
    }
    .inputSearch {
        width: 300px;
    }
    .searchRow {
        margin-top: 15px;
    }
</style>
