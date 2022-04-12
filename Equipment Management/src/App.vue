<template>

  <div class='container'>
    <nav>
      <router-link to="/"> Home </router-link> |
      <span> 
        <router-link to="/dashboard"> Dashboard </router-link> |
      </span>
      <span v-if="isLoggedIn"> 
        <button @click="signOut" id="logout-button"> Logout <span class="glyphicon glyphicon-log-out"></span></button> 
      </span>
      <span v-else>
        <router-link to="/register"> Register </router-link> |
        <router-link to="/sign-in"> Login </router-link>
      </span>
    </nav>
    <router-view />
  </div>
</template>

<script setup>
import { ref, watchEffect } from 'vue' 
import  firebase from "firebase/compat/app"
import 'firebase/compat/auth'
import { useRouter } from 'vue-router'
const router = useRouter()
const isLoggedIn = ref(true)

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      isLoggedIn.value = true 
    } else {
      isLoggedIn.value = false 
    }
})
const signOut = () => {
  firebase.auth().signOut()
  router.push('/')
}
</script>

