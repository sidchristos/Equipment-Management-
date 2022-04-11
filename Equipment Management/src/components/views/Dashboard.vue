<template>
    <h1> Dashboard </h1>
</template>

<script setup>
import firebase from "firebase/compat/app"
import { useRouter } from 'vue-router'
import { onBeforeUnmount } from 'vue'
const router = useRouter()
const authListener = firebase.auth().onAuthStateChanged(function(user) {
    if (!user) { // not logged in
        alert('You must be logged in to view this page. Redirecting to the Home page')
        router.push('/')
    }
});
onBeforeUnmount(() => {
    // clear up listener
    authListener()
})
  
</script>