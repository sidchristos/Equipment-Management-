<template>
<div>
    <h1> Login to Your Account </h1>
    <p> <input type='text' placeholder="Email" v-model='email'/> </p>
    <p> <input type='password' placeholder="Password" v-model='password'/> </p>
    <p> <button @click="signIn" class='button'> Submit </button> </p>
</div>
</template>

<script setup>
import { ref } from 'vue'
import firebase from "firebase/compat/app";
import { useRouter } from 'vue-router'
import swal from 'sweetalert';
import { storeFB } from '../../config/firebase'


const email = ref('')
const password = ref('')
const errMsg = ref() 
const router = useRouter() 

const signIn = () => { 
  firebase
    .auth()
    .signInWithEmailAndPassword(email.value, password.value) 
    .then((data) => {
      console.log('Successfully logged in!');
      router.push('/Dashboard') 
    })
    .catch(error => {
      switch (error.code) {
        case 'auth/invalid-email':
          errMsg.value = 'Invalid email'
          showError(errMsg.value)
          break
        case 'auth/user-not-found':
            errMsg.value = 'No account with that email was found'
            showError(errMsg.value)           
            break
        case 'auth/wrong-password':
            errMsg.value = 'Incorrect password'
            showError(errMsg.value)         
            break  
        default:
            errMsg.value = 'Email or password was incorrect'
            showError(errMsg.value)
            break
      }
    });
}
function showError(errorMSG){
  swal({
            title: "Ooops",
            text: errorMSG,
            icon: "error",
            dangerMode: true
            });
}
</script>

