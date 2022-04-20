<template>
    <div>
        <h1> Create an Account </h1>
        <p> <input type='text' placeholder="First name" v-model='firstname'/> </p>
        <p> <input type='text' placeholder="Last name" v-model='lastname'/> </p>
        <p> <input type='text' placeholder="Phone" v-model='phone'/> </p>
        <p> <input type='text' placeholder="Address" v-model='address'/> </p>
        <p> <input type='text' placeholder="Email" v-model='email'/> </p>
        <p> <input type='password' placeholder="Password" v-model='password'/> </p>
        <p> <button @click="register" class="button"> Register </button> </p>
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
const errMsg = ref() 


const register = () => {
  if(firstname.value === "" || containsNumber(firstname.value) || firstname.value.length < 4 ){
    if (firstname.value === "") errMsg.value='Firstname cannot be empty'
    else if (containsNumber(firstname.value)) errMsg.value='Firstname cannot contain numbers'
    else if (firstname.value.length < 4) errMsg.value='Firstname must be at least 4 characters'
    else errMsg.value='Please insert a proper firstname'
    showError(errMsg.value)
  } 
  else if (lastname.value === "" || containsNumber(lastname.value) || lastname.value.length < 5){
    if (lastname.value === "") errMsg.value='Lastname cannot be empty'
    else if (containsNumber(lastname.value)) errMsg.value='Lastname cannot contain numbers'
    else if (lastname.value.length < 5) errMsg.value='Lastname must be at least 5 characters'    
    else errMsg.value='Please insert a proper lastname'
    showError(errMsg.value)
  } 
  else if (phone.value === "" || isNaN(phone.value)  || phone.value.length < 10){
    if (phone.value === "") errMsg.value='Phone cannot be empty'
    else if (isNaN(phone.value)) errMsg.value='Phone must contain only numbers'
    else if (phone.value.length < 10) errMsg.value='Phone  must be at least 10 digits'    
    else errMsg.value='Please insert a proper phone number'
    showError(errMsg.value)    
  } 
  else if (address.value === "" || address.value.length < 8){
    if (address.value === "") errMsg.value='Address cannot be empty'
    else if (address.value.length < 5) errMsg.value='Address must be at least 8 characters'  
    else errMsg.value='Please insert a proper address'
    showError(errMsg.value)            
  }
  else{
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
          address:address.value,
          role:'user'
        })
        
      })
      .catch(error => {
        console.log(error.code)
        showError(error.message)
      });
    }
}

function containsNumber(str) {
  return /\d/.test(str);
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

