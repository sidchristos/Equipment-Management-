<template>
    <h1> Dashboard </h1>
</template>

<script setup>
import firebase from "firebase/compat/app"
import { useRouter } from 'vue-router'
import { onBeforeUnmount } from 'vue'
import swal from 'sweetalert';

const router = useRouter()
const authListener = firebase.auth().onAuthStateChanged(function(user) {
    if (!user) { 
        swal({
            title: "Ooops",
            text: "You must be logged in to view this page. Redirecting to Homepage",
            icon: "error",
            dangerMode: true
            });
        router.push('/')
    }
});
onBeforeUnmount(() => {
    // clear up listener
    authListener()
})
  
</script>

<style scoped>
.sweet-alert button.cancel{
  background-color: yellow;
  color: black
}
</style>