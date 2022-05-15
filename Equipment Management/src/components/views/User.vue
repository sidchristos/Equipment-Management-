<template>
<div>
    <h1> User Profile </h1>
    <div>      
      <div v-if="Preview"> 
        <div class="user-profile py-4">
          <div class="container">
            <div class="row">
              <div class="col-lg-4">
                <div class="card shadow-sm">
                  <div class="card-header bg-transparent text-center">
                    <div class="Img_container">
                      <img class="profile_img" v-bind:src="Avatar" alt="Avatar Pic" >
                        <div class="middle">
                          <label class="Img_edit_button" v-if="uploadValue == 0">
                            <input type="file" id=uploader @change="editImgbtn" accept="image/*"/>Edit
                          </label>
                          <div v-if="uploadValue != 0">
                            <p>Progress: {{uploadValue.toFixed()+"%"}} <progress id="progress" class="progress" :value="uploadValue" max="100" ></progress>  </p>
                          </div>
                        </div>
                    </div>
                    <h3 style="color:Black;">{{ Firstname }} {{ Lastname }}</h3>
                  </div>
                  <div class="card-body">
                    <p class="mb-0"><strong class="pr-1">User ID: </strong> {{ Userid }}</p>
                    <p class="mb-0"><strong class="pr-1">Role: </strong> {{ Role }}</p>
                    <p> <span id="SpecialSpan" style='color:red; font-size: large;' onmouseover="this.style.cursor='pointer'" onmouseout="this.style.cursor='default'" @click="DeleteAcc">
                      <b><u>Delete account</u></b>
                    </span> </p>
                  </div>
                </div>
              </div>
              <div class="col-lg-8">
                <div class="card shadow-sm">
                  <div class="card-header bg-transparent border-0">
                    <h3 class="mb-0"><i class="far fa-clone pr-1"></i>General Information</h3>
                  </div>
                  <div class="card-body pt-0">
                    <table class="table table-bordered">
                      <tr>
                        <th width="30%"> Address </th>
                        <td width="2%">:</td>
                        <td>{{ Address }}</td>
                      </tr>
                      <tr>
                        <th width="30%"> Phone </th>
                        <td width="2%">:</td>
                        <td>{{ Phone }}</td>
                      </tr>
                      <tr>
                        <th width="30%"> Email </th>
                        <td width="2%">:</td>
                        <td>{{ Email }}</td>
                      </tr>
                    </table>
                  </div>
                </div>
                <div class="card shadow-sm">
                  <div class="card-header bg-transparent border-0">
                    <h3 class="mb-0"><i class="far fa-clone pr-1"></i>Other Information</h3>
                  </div>
                  <div class="card-body pt-0">
                    <p style="text-align: left;"> {{Information}} </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      <br><p> <button @click='editbtn' class='button'> Edit </button> </p>
      </div>
      <div v-else>
        <p><b>User ID: </b>{{ Userid }} <b>Role: </b>{{ Role }} </p>
        <table style="margin-left: auto; margin-right: auto; text-align: right;">
          <tr>
            <th style="text-align: right;padding-right: 1%;"> <b>Firstname: </b> </th>
            <th> <p> <input type='text' :value=Firstname id="fn" /> </p></th>
          </tr>
          <tr>
            <th style="text-align: right;padding-right: 1%;"> <b>Lastname: </b> </th>
            <th>  <p> <input type='text' :value=Lastname id="ln"/> </p></th>
          </tr>
          <tr>
            <th style="text-align: right;padding-right: 1%;"> <b>Address:</b> </th>
            <th> <p> <input type='text' :value=Address id="ad"/> </p> </th>
          </tr>
          <tr>
            <th  style="text-align: right;padding-right: 1%;"> <b>Phone:</b> </th>
            <th><p> <input type='text' :value=Phone id="ph"/> </p></th>
          </tr>
          <tr>
            <th style="text-align: right;padding-right: 1%;"> <b>Email: </b> </th>
            <th> <p> <input type='text' :value=Email id="em"/> </p></th>
          </tr>
          <tr>
            <th style="text-align: right; vertical-align: super;"> <b>Other Information: </b> </th>
            <th> <p> <textarea id="inf"  :value=Information rows="5" cols="50"> </textarea></p></th>
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
import { ref , defineComponent} from 'vue'
import firebase from "firebase/compat/app"
import { storeFB } from '../../config/firebase'
import 'firebase/compat/auth'
import { getAuth,updateEmail,onAuthStateChanged   } from "firebase/auth"
import swal from 'sweetalert'
import router from "../../config/routes";

const auth = getAuth();
onAuthStateChanged(auth, (user) => {
  if (user) {
    const userid = user.uid;
    sessionStorage .setItem('local_uid', userid);
  }
});

let User_data = "";
const errMsg = ref() 

export default defineComponent({
  data() {
    return {
        Userid:sessionStorage .local_uid,
        Firstname:null,
        Lastname:null,
        Address:null,
        Phone:null,
        Email:null,
        Role:null,
        Information:null,
        Avatar:null,
        Preview:true,
        picture: null,
        imageData: null,
        uploadValue: 0
    }
  },

  methods: {
      editbtn: function editbtn() {
        this.Preview = false
      },

      cancelbtn: function cancelbtn() {
        this.Preview = true
      },

      editImgbtn: function editImgbtn(event) {
      var pattern = /image-*/;
      this.uploadValue=0;
      this.picture=null;
      this.imageData = event.target.files[0];
        if( this.imageData.size > 2097152){
          this.showError("Maximun file size is 2MB, try an other image")
        }else  if (! this.imageData.type.match(pattern)){
          this.showError("Only images can be uploaded")
        }
        else{
          const storageRef=firebase.storage().ref(`${this.imageData.name}`).put(this.imageData);
            
            storageRef.on(`state_changed`,snapshot=>{
              this.uploadValue = 1;
            }, 
            error=>{
              console.log(error.message)
            },
            ()=>{
              storageRef.snapshot.ref.getDownloadURL().then((url)=>{
                this.Avatar =url
                storeFB.collection('users').doc(sessionStorage .local_uid).set({
                    email:User_data.email,
                    firstname:User_data.firstname,
                    lastname:User_data.lastname,
                    phone:User_data.phone,
                    address:User_data.address,
                    information:User_data.information,
                    role:User_data.role,
                    avatar:url
                })
                setTimeout(() => { this.uploadValue=25; }, "300")
                setTimeout(() => { this.uploadValue=50; }, "400")
                setTimeout(() => { this.uploadValue=75; }, "500")
                this.getData()
                setTimeout(() => { this.uploadValue=100; }, "800")
                setTimeout(() => { this.uploadValue=0; }, "2000")
              });
            });
        }
      },

      savebtn: function savebtn() {
        if (document.getElementById('fn').value === "" || containsNumber(document.getElementById('fn').value) || document.getElementById('fn').value.length < 4 ){
          if (document.getElementById('fn').value === "") errMsg.value='Firstname cannot be empty'
          else if (containsNumber(document.getElementById('fn').value)) errMsg.value='Firstname cannot contain numbers'
          else if (document.getElementById('fn').value.length < 4) errMsg.value='Firstname must be at least 4 characters'
          else errMsg.value='Please insert a proper firstname'
          this.showError(errMsg.value)
        } 
        else if (document.getElementById('ln').value=== "" || containsNumber(document.getElementById('ln').value) || document.getElementById('ln').value.length < 5){
          if (document.getElementById('ln').value === "") errMsg.value='Lastname cannot be empty'
          else if (containsNumber(document.getElementById('ln').value)) errMsg.value='Lastname cannot contain numbers'
          else if (document.getElementById('ln').value< 5) errMsg.value='Lastname must be at least 5 characters'    
          else errMsg.value='Please insert a proper lastname'
          this.showError(errMsg.value)
        } 
        else if (document.getElementById('ad').value === "" || document.getElementById('ad').value.length < 8){
          if (document.getElementById('ad').value === "") errMsg.value='Address cannot be empty'
          else if (document.getElementById('ad').value.length < 5) errMsg.value='Address must be at least 8 characters'  
          else errMsg.value='Please insert a proper address'
          this.showError(errMsg.value)            
        }
        else if (document.getElementById('ph').value === "" || isNaN(document.getElementById('ph').value)  || document.getElementById('ph').value.length < 10){
          if (document.getElementById('ph').value === "") errMsg.value='Phone cannot be empty'
          else if (isNaN(document.getElementById('ph').value)) errMsg.value='Phone must contain only numbers'
          else if (document.getElementById('ph').value.length < 10) errMsg.value='Phone  must be at least 10 digits'    
          else errMsg.value='Please insert a proper phone number'
          this.showError(errMsg.value)    
        } 
        else if (document.getElementById('em').value === "" || !document.getElementById('em').value.includes('@') || !document.getElementById('em').value.includes('.') ){
          if (document.getElementById('em').value === "") errMsg.value='Email address cannot be empty'
          else if (!document.getElementById('em').value.includes('@') || !document.getElementById('em').value.includes('.')) errMsg.value='The email address is badly formatted'    
          else errMsg.value='Please insert a proper email address'
          this.showError(errMsg.value)    
        } 
        else{
          updateEmail( auth.currentUser, document.getElementById('em').value).then(() => {
                      storeFB.collection('users').doc(sessionStorage .local_uid).set({
                        email: document.getElementById('em').value,
                        firstname:document.getElementById('fn').value,
                        lastname:document.getElementById('ln').value,
                        phone:document.getElementById('ph').value,
                        address:document.getElementById('ad').value,
                        information:document.getElementById('inf').value,
                        role:User_data.role,
                        avatar:User_data.avatar
                      })
                      this.getData()
                      swal({
                          title: "Success!",
                          text: "User info have been saved",
                          icon: "success",
                          dangerMode: true
                          });
            }).catch((error) => {
              console.log(error.code)
              this.showError(error.code) 
            });
        }
      },

      getData: function getData() {
          storeFB.collection('users')
                    .doc(sessionStorage.local_uid)
                    .get()
                    .then(snapshot  => {
                      User_data = snapshot.data()  
                      this.Firstname=User_data.firstname,
                      this.Lastname=User_data.lastname,
                      this.Address=User_data.address,
                      this.Phone=User_data.phone,
                      this.Email=User_data.email, 
                      this.Information=User_data.information,
                      this.role=User_data.role,
                      this.Avatar=User_data.avatar                              
                    })
                    .catch(error => {
                      console.log(error.code)
                      this.showError(error.code)
                    })
                    .finally(() => {
                      this.Preview = true           
                    });
          
      },

      showError: function showError(errorMSG){
        swal({
                  title: "Ooops",
                  text: errorMSG,
                  icon: "error",
                  dangerMode: true
                  })
      },

      DeleteAcc: function DeleteAcc() {
        var user = firebase.auth().currentUser;
        var swal_text = "User : "+ this.Firstname + " "+ this.Lastname +", was deleted successfully"
          swal({
                title: "Are you sure?",
                text: "You will not be able to recover your account",
                icon: "warning",
                buttons: [
                  'Cancel',
                  'Accept'
                ],
                dangerMode: true,
              }).then(function(isConfirm) {
                if (isConfirm) {
                  swal({
                    title: 'Deleted!',
                    text: swal_text,
                    icon: 'success',
                    dangerMode: true
                  }).then(function() {
                      user.delete().then(function() {
                        var docRef = storeFB.collection("users").doc(sessionStorage .local_uid)
                        docRef.delete()
                        router.push({ path: '/', replace: true })
                    }).catch(function(error) {
                      console.log(error)
                    });
                  });
                } 
              })
      },

  }, 

  mounted(){
    this.getData()
  }

})

function containsNumber(str) {
  return /\d/.test(str);
}

</script>
