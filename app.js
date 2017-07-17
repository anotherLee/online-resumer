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
        actionType:'register',
        formData:{
            email:'',
            username:'',
            password:''
        },
        currentUser: null

    },
    methods: {
        addTodo: function () {
            this.todoList.push({
                title: this.newTodo,
                createdAt: new Date(),
                done: false
            })
            this.newTodo = ''
        },
        removeTodo: function (index) {
            this.todoList.splice(index, 1)
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
            },(error)=>{
                alert('登陆失败')
            })
            this.clear()
        },
        getCurrentUser: function(){
            let id = AV.User.current().id
            let createdAt = AV.User.current().createdAt
            let username = AV.User.current().attributes.username
            return {id,createdAt,username}
        },
        clear: function(){
            this.formData.username = ''
            this.formData.email = ''
            this.formData.password = ''
        }

    },
    created: function () {
        window.onbeforeunload = () => {
            let dataString = JSON.stringify(this.todoList)
            window.localStorage.setItem('myTodos', dataString)
        }
        let oldDataString = window.localStorage.getItem('myTodos')
        let oldData = JSON.parse(oldDataString)
        this.todoList = oldData || []


    }
})
