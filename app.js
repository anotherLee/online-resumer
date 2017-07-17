import bar from './bar'
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import './page.scss'

Vue.use(ElementUI)


var app = new Vue({
  el: '#app',
  data: {
    newTodo:'',
    todoList:[],
    a:-1
  },
  methods:{
    addTodo: function(){
      this.todoList.push({
        title: this.newTodo,
        createdAt: new Date(),
        done: false
      })
      this.newTodo = ''
    },
    removeTodo: function(index){
      this.todoList.splice(index,1)
    }

  },
  created: function(){
    window.onbeforeunload = ()=>{
      let dataString = JSON.stringify(this.todoList)
      window.localStorage.setItem('myTodos',dataString)
    }
    let oldDataString = window.localStorage.getItem('myTodos')
    let oldData = JSON.parse(oldDataString)
    this.todoList = oldData || []



  }
})

setInterval(function(){
  console.log(app.a)
},2000)