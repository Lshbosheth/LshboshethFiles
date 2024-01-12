import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { setupRouter } from '@/router'
import '@/assets/iconfont/iconfont.css'
import '@/assets/iconfont/iconfont.js'


const app = createApp(App)
app.use(ElementPlus)
setupRouter(app)
app.mount('#app')
