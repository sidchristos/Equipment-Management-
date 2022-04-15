<template>
<div>
    <h1> User Profile </h1>
    <div>
    <p><b>User ID: </b>{{ Userid }} </p>
      <div v-if="Edit"> 
        <p><b>Firstname: </b>{{ Firstname }} <b>Lastname: </b>{{ Lastname }}</p>
        <p><b>Address:</b> {{ Address }} </p>
        <p><b>Phone:</b> {{ Phone }} </p>
        <p><b>Email: </b>{{ Email }} </p>
        <p> <button @click='editbtn' class='button'> Edit </button> </p>
      </div>
      <div v-else>
        <p> <input type='text' :value=Firstname id="fn" /> </p>
        <p> <input type='text' :value=Lastname id="ln"/> </p>
        <p> <input type='text' :value=Address id="ad"/> </p>
        <p> <input type='text' :value=Phone id="ph"/> </p>
        <p> <input type='text' :value=Email id="em"/> </p>
        <p> 
          <button @click='cancelbtn' class='button'> Cancel </button> 
          <button @click='savebtn' class='button'> Save </button> 
        </p>
      </div>    
    </div>
</div>    
</template>

<script>
import firebase from "firebase/compat/app"
import { storeFB } from '../../config/firebase'
import 'firebase/compat/auth'
import swal from 'sweetalert'

const user = firebase.auth().currentUser;
const userid = user.uid;
let User_data = "";

await storeFB.collection('users')
                  .doc(userid)
                  .get()
                  .then(snapshot  => {
                    User_data = snapshot.data()                
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

export default {
  data() {
    return {
        Userid:userid,
        Firstname:User_data.firstname,
        Lastname:User_data.lastname,
        Address:User_data.address,
        Phone:User_data.phone,
        Email:User_data.email,
        Edit:true,

    }},
  methods: {
      editbtn: function editbtn() {
        this.Edit = false
      },

      cancelbtn: function savebtn() {
        this.Edit = true
      },

      savebtn: function savebtn() { 
        storeFB.collection('users').doc(userid).set({
          email: document.getElementById('em').value,
          firstname:document.getElementById('fn').value,
          lastname:document.getElementById('ln').value,
          phone:document.getElementById('ph').value,
          address:document.getElementById('ad').value
        })
        this.Edit = true
        this.updateData()
        swal({
            title: "Success!",
            text: "User info have been saved",
            icon: "success",
            dangerMode: true
            });
      },

      updateData: function myMethod() {
           storeFB.collection('users')
                    .doc(userid)
                    .get()
                    .then(snapshot  => {
                      User_data = snapshot.data()  
                      this.Firstname=User_data.firstname
                      this.Lastname=User_data.lastname,
                      this.Address=User_data.address,
                      this.Phone=User_data.phone,
                      this.Email=User_data.email                    
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
  },

};

</script>
