<template>
    <div class='container'>
    <nav>
        <router-link to="/"> Home </router-link> |
        <span> 
            <router-link to="/dashboard"> Dashboard </router-link> |
        </span>
        <span v-if="isLoggedIn"> 
            <router-link :to='{ name: "user",  params: { id: uid_id }}'> User Profile </router-link>
            <button @click="signOut" id="logout-button"> Logout <span class="glyphicon glyphicon-log-out"></span></button> 
        </span>
        <span v-else>
            <router-link to="/register"> Register </router-link> |
            <router-link to="/sign-in"> Login </router-link>
        </span>
        </nav>
        <hr style="border: 0; height: 0; box-shadow: 0 0 10px 1px black;">
        <router-view />
    </div>
</template>

<script setup>
import { ref, watchEffect } from 'vue' 
import  firebase from "firebase/compat/app"
import 'firebase/compat/auth'
import { useRouter } from 'vue-router'
import swal from 'sweetalert';
const router = useRouter()
const isLoggedIn = ref(true)
let uid_id = ref('null')

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      isLoggedIn.value = true 
      uid_id.value=firebase.auth().currentUser.uid
    } else {
      isLoggedIn.value = false 

    }
})

const signOut = () => {
  firebase.auth().signOut()
  console.log('Successfully logged out!');
  swal({
            title: "Success!",
            text: "You have successfully been logged out",
            icon: "success",
            dangerMode: true
            });
  router.push('/sign-in')
}
</script>
