<template>
    <div>
        <h1> Dashboard </h1>
        <div>
            <!-- <div style="width: 250px; float: left; ">
                <Filters />    
            </div> -->
            <div>
                <TableEquipment />    
            </div>           
        </div>
    </div>
</template>

<script setup>
import firebase from "firebase/compat/app"
import { useRouter } from 'vue-router'
import { onBeforeUnmount } from 'vue'
import swal from 'sweetalert'
import Filters from '../views/Filters.vue'
import TableEquipment from '../views/TableEquipment.vue'

const router = useRouter()
const authListener = firebase.auth().onAuthStateChanged(function(user) {
    if (!user) { 

        swal({
            title: "Ooops",
            text: "You must be logged in to view dashboard. Redirecting to Login page",
            icon: "error",
            dangerMode: true
            });
        router.push('/sign-in')
    }else{
        const userid = user.uid;
        sessionStorage .setItem('local_uid', userid);
    }
});


onBeforeUnmount(() => {
    // clear up listener
    authListener()
})

  
</script>