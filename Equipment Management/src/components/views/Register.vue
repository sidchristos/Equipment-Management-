<template>
    <div>
        <h1> Create an Account </h1>
        <p> <input type='text' placeholder="Email" v-model='email'/> </p>
        <p> <input type='password' placeholder="Password" v-model='password'/> </p>
        <p> <input type='text' placeholder="First name" v-model='firstname'/> </p>
        <p> <input type='text' placeholder="Last name" v-model='lastname'/> </p>
        <p> <input type='text' placeholder="Phone" v-model='phone'/> </p>
        <p> <input type='text' placeholder="Address" v-model='address'/> </p>
        <p> <button @click="register" class="button"> Submit </button> </p>
    </div>
</template>

<script setup>
import '../views/style.css'
import { ref } from 'vue'
import firebase from "firebase/compat/app";
import { useRouter } from 'vue-router' 
import swal from 'sweetalert';
import { storeFB } from '../../config/firebase'

const router = useRouter() 
const email = ref('')
const password = ref('')
const firstname = ref('')
const lastname = ref('')
const phone = ref('')
const address = ref('')

const register = () => {
  //TODO case of errors
  firebase
    .auth() 
    .createUserWithEmailAndPassword(email.value, password.value) 
    .then((data) => {

      console.log('Successfully registered!');
      router.push('/dashboard')
      
      return storeFB.collection('users').doc(data.user.uid).set({
        uid: data.user.uid,
        email: data.user.email,
        firstname:firstname.value,
        lastname:lastname.value,
        phone:phone.value,
        address:address.value
      })
      
    })
    .catch(error => {
      console.log(error.code)
       swal({
            title: "Ooops",
            text: error.message,
            icon: "error",
            dangerMode: true
            });
    });
}
</script>

