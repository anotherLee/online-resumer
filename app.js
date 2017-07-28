import bar from './bar'
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import './page.scss'
import AV from 'leancloud-storage'

Vue.use(ElementUI)

var APP_ID = 'aboJszqbrLt3tvFdbNmqozOx-gzGzoHsz';
var APP_KEY = 'vD6DjXUrNUflDeABzoR8jS01';

AV.init({
    appId: APP_ID,
    appKey: APP_KEY
});







var app = new Vue({
    el: '#app',
    data: {
        newTodo: '',
        todoList: [],
        classify:['all','completed','uncompleted','clearAll'],
        a:0,
        status:true,
        actionType:'register',
        formData:{
            email:'',
            username:'',
            password:''
        },
        currentUser: null

    },
    methods: {
        sort: function(){
            console.log('sort函数执行了')
            switch (this.a){
                case 0:
                     for(let i=0; i<this.todoList.length; i++){
                        this.todoList[i].status = 'show'
                    }
                    break;
                case 1:
                    for(let i=0; i<this.todoList.length; i++){
                        if(this.todoList[i].done === true){
                            this.todoList[i].status = 'show'
                        }else{
                            this.todoList[i].status = ''
                        }
                    }
                    break;
                case 2:
                    for(let i=0; i<this.todoList.length; i++){
                        if(this.todoList[i].done === false){
                            this.todoList[i].status = 'show'
                        }else{
                            this.todoList[i].status = ''
                        }
                    }
                    break;
                default:
                    this.todoList = []
                    this.a = 0
                    this.saveOrUpdateTodos()
            }
        },
        addTodo: function () {
            this.todoList.push({
                title: this.newTodo,
                createdAt: new Date(),
                done: false,
                status:'show'
            })
            this.newTodo = ''
            this.saveOrUpdateTodos()
        },
        removeTodo: function (index) {
            this.todoList.splice(index, 1)
            this.saveOrUpdateTodos()
        },
        register:function(){
            let user = new AV.User()
            user.setEmail(this.formData.email)
            user.setUsername(this.formData.username)
            user.setPassword(this.formData.password)
            user.signUp().then((loginedUser)=>{
                this.currentUser = this.getCurrentUser()
            }, (error)=>{
                alert('注册失败')
            })
            this.clear()
        },
        login: function(){
            AV.User.logIn(this.formData.email, this.formData.password).then((loginedUser)=>{
                this.currentUser = this.getCurrentUser()
                alert('你好，'+ this.currentUser.username)
                this.fetchTodos()
            },(error)=>{
                alert('登陆失败')
            })
            console.log('获取到了todos')
            this.clear()
        },
        getCurrentUser: function(){
            let current = AV.User.current()
            if(current){
                let id = current.id
                let createdAt = current.createdAt
                let username = current.attributes.username
                return {id,createdAt,username}
            }else{
                return null
            }

        },
        logout: function(){
            AV.User.logOut()
            this.currentUser = null
            window.location.reload()
        },
        saveTodos: function(){
            let dataString = JSON.stringify(this.todoList)
            var AVtodos = AV.Object.extend('AllTodos');
            var avTodos = new AVtodos();
            avTodos.set('content', dataString);

            var acl = new AV.ACL();   //新建一个ACL实例
            acl.setReadAccess(AV.User.current(),true);  //只有当前用户可读
            acl.setWriteAccess(AV.User.current(),true);  //只有当前用户可写
            avTodos.setACL(acl)       //将ACL的实例acl赋给avTodos对象，这样对avTodos的访问控制就设置了

            // 保存
            avTodos.save().then(function (todo) {
                console.log(todo)
                this.todoList.id = todo.id
                console.log('保存成功');
            }, function (error) {
                console.log('保存失败')
            });
        },
        updateTodos:function(){
            let dataString = JSON.stringify(this.todoList)
            let avTodos = AV.Object.createWithoutData('AllTodos',this.todoList.id)
            avTodos.set('content',dataString)
            console.log(2)
            avTodos.save().then(()=>{
                console.log('更新成功')
            })
        },
        saveOrUpdateTodos: function(){
            if(this.todoList.id){
                this.updateTodos()
                console.log(1)
            }else(
                this.saveTodos()
            )
            console.log('数据保存或更新了')
        },
        fetchTodos: function(){
            if(this.currentUser){
                var query = new AV.Query('AllTodos');
                query.find().then((todos)=>{
                    console.log(todos)
                    console.log(todos[0])
                    let avAllTodos = todos[0]
                    let id = avAllTodos.id
                    this.todoList = JSON.parse(avAllTodos.attributes.content)
                    console.log(this.todoList)
                    this.todoList.id = id
                }, function(error){
                    console.log(error)
                })
            }
        },
        clear: function(){
            this.formData.username = ''
            this.formData.email = ''
            this.formData.password = ''
        }

    },
    created: function () {
        // window.onbeforeunload = () => {
            // window.localStorage.setItem('myTodos', dataString)
        // }
        // let oldDataString = window.localStorage.getItem('myTodos')
        // let oldData = JSON.parse(oldDataString)
        // this.todoList = oldData || []

        this.currentUser = this.getCurrentUser()
        this.fetchTodos()


    }
})
