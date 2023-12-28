import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { setupRouter } from '../src/router'


const app = createApp(App)
app.use(ElementPlus)
setupRouter(app)
app.mount('#app')
