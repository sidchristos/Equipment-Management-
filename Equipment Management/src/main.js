import { createApp } from 'vue'
import App from './App.vue'
import router from './config/routes'
import { appFB } from './config/firebase'
import '../src/components/views/style.css'



const app = createApp(App)

app.use(router)

app.mount('#app')