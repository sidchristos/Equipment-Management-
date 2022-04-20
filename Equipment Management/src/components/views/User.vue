<template>
<div>
    <h1> User Profile </h1>
    <div>
    <p><b>User ID: </b>{{ Userid }} <b>Role: </b>{{ Role }} </p>
      
      <div v-if="Edit"> 
        <p><b>Firstname: </b> {{ Firstname }} <b>Lastname: </b> {{ Lastname }} </p>
        <p><b>Address:</b> {{ Address }} </p>
        <p><b>Phone:</b> {{ Phone }} </p>
        <p><b>Email: </b> {{ Email }} </p>
        <p> <button @click='editbtn' class='button'> Edit </button> </p>
      </div>
      <div v-else>
        <table style="margin-left: auto; margin-right: auto; text-align: right;">
        <tr>
          <th> <b>Firstname: </b> </th>
          <th> <p> <input type='text' :value=Firstname id="fn" /> </p></th>
        </tr>
        <tr>
          <th> <b>Lastname: </b> </th>
          <th>  <p> <input type='text' :value=Lastname id="ln"/> </p></th>
        </tr>
        <tr>
          <th style="text-align: right;"> <b>Address:</b> </th>
          <th> <p> <input type='text' :value=Address id="ad"/> </p> </th>
        </tr>
        <tr>
          <th  style="text-align: right;"> <b>Phone:</b> </th>
          <th><p> <input type='text' :value=Phone id="ph"/> </p></th>
        </tr>
        <tr>
          <th style="text-align: right;"> <b>Email: </b> </th>
          <th> <p> <input type='text' :value=Email id="em"/> </p></th>
        </tr>
        </table>
        <p> 
          <button @click='cancelbtn' class='button'> Cancel </button> 
          <button @click='savebtn' class='button'> Save </button> 
        </p>
      </div>   

    </div>
</div>    
</template>

<script>
import { ref } from 'vue'
import firebase from "firebase/compat/app"
import { storeFB } from '../../config/firebase'
import 'firebase/compat/auth'
import { getAuth } from "firebase/auth"
import swal from 'sweetalert'

const auth = getAuth();
const user = auth.currentUser;
const userid = user.uid;
let User_data = "";
let Role= "";
const errMsg = ref() 

await storeFB.collection('users').doc(userid).get().then(snapshot  => {
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
        Role:User_data.role,
        Edit:true
    }},

  methods: {
      editbtn: function editbtn() {
        this.Edit = false
      },

      cancelbtn: function cancelbtn() {
        this.Edit = true
      },

      savebtn: function savebtn() {
        if (document.getElementById('fn').value === "" || containsNumber(document.getElementById('fn').value) || document.getElementById('fn').value.length < 4 ){
          if (document.getElementById('fn').value === "") errMsg.value='Firstname cannot be empty'
          else if (containsNumber(document.getElementById('fn').value)) errMsg.value='Firstname cannot contain numbers'
          else if (document.getElementById('fn').value.length < 4) errMsg.value='Firstname must be at least 4 characters'
          else errMsg.value='Please insert a proper firstname'
          showError(errMsg.value)
        } 
        else if (document.getElementById('ln').value=== "" || containsNumber(document.getElementById('ln').value) || document.getElementById('ln').value.length < 5){
          if (document.getElementById('ln').value === "") errMsg.value='Lastname cannot be empty'
          else if (containsNumber(document.getElementById('ln').value)) errMsg.value='Lastname cannot contain numbers'
          else if (document.getElementById('ln').value< 5) errMsg.value='Lastname must be at least 5 characters'    
          else errMsg.value='Please insert a proper lastname'
          showError(errMsg.value)
        } 
        else if (document.getElementById('ad').value === "" || document.getElementById('ad').value.length < 8){
          if (document.getElementById('ad').value === "") errMsg.value='Address cannot be empty'
          else if (document.getElementById('ad').value.length < 5) errMsg.value='Address must be at least 8 characters'  
          else errMsg.value='Please insert a proper address'
          showError(errMsg.value)            
        }
        else if (document.getElementById('ph').value === "" || isNaN(document.getElementById('ph').value)  || document.getElementById('ph').value.length < 10){
          if (document.getElementById('ph').value === "") errMsg.value='Phone cannot be empty'
          else if (isNaN(document.getElementById('ph').value)) errMsg.value='Phone must contain only numbers'
          else if (document.getElementById('ph').value.length < 10) errMsg.value='Phone  must be at least 10 digits'    
          else errMsg.value='Please insert a proper phone number'
          showError(errMsg.value)    
        } 
        else{
        storeFB.collection('users').doc(userid).set({
          email: document.getElementById('em').value,
          firstname:document.getElementById('fn').value,
          lastname:document.getElementById('ln').value,
          phone:document.getElementById('ph').value,
          address:document.getElementById('ad').value,
          role:User_data.role
        })
        this.Edit = true
        this.updateData()
        swal({
            title: "Success!",
            text: "User info have been saved",
            icon: "success",
            dangerMode: true
            });
        }
      },

      updateData: function updateData() {
           storeFB.collection('users')
                    .doc(userid)
                    .get()
                    .then(snapshot  => {
                      User_data = snapshot.data()  
                      this.Firstname=User_data.firstname
                      this.Lastname=User_data.lastname,
                      this.Address=User_data.address,
                      this.Phone=User_data.phone,
                      this.Email=User_data.email, 
                      this.role=User_data.email                   
                    })
                    .catch(error => {
                      console.log(error.code)
                      showError(error.code)
                    });
          
        }
  }, 
}

function showError(errorMSG){
  swal({
            title: "Ooops",
            text: errorMSG,
            icon: "error",
            dangerMode: true
            })
}

function containsNumber(str) {
  return /\d/.test(str);
}


</script>
