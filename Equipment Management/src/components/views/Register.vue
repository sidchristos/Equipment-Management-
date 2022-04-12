<template>
    <h1> Create an Account </h1>
    <p> <input type='text' placeholder="Email" v-model='email'/> </p>
    <p> <input type='password' placeholder="Password" v-model='password'/> </p>
    <p> <button @click="register" class="button"> Submit </button> </p>
</template>

<script setup>
import '../views/style.css'
import { ref } from 'vue'
import firebase from "firebase/compat/app";
import { useRouter } from 'vue-router' 
const email = ref('')
const password = ref('')
const router = useRouter() 
const register = () => {
  firebase
    .auth() 
    .createUserWithEmailAndPassword(email.value, password.value) 
    .then((data) => {
      console.log('Successfully registered!');
      router.push('/dashboard')
    })
    .catch(error => {
      console.log(error.code)
      alert(error.message);
    });
}
</script>

