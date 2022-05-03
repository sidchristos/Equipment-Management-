import  { createApp } from 'vue'
import App from './App.vue'
import router from './config/routes'
import { appFB } from './config/firebase'
import '../src/style.css'
//import 'bootstrap/dist/css/bootstrap.css'
//import 'bootstrap/dist/js/bootstrap.js'

const app = createApp(App)

app.use(router)
app.mount('#app')
