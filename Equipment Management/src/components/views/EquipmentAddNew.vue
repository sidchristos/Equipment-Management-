<template>
  <div class="form">
    <h1> Add new Equipment </h1>
    <table style="margin-left: auto; margin-right: auto; text-align: right;">
            <tr>
              <th style="text-align: right; padding-right: 1%;"> <b>Name: </b> </th>
              <th> <p> <input type='text' v-model="Name" /> </p></th>
            </tr>
            <tr>
              <th style="text-align: right; padding-right: 1%;"> <b>Category: </b> </th>
              <th> <p> 
                      <select v-model="Category" >
                        <option disabled value="">Please select category</option>
                        <option>Electronics</option>
                        <option>Hardware</option>
                        <option>Software</option>
                      </select>
              </p></th>
            </tr>
            <tr>
              <th style="text-align: right; padding-right: 1%;"> <b>Location:</b> </th>
              <th> <p> 
                      <select v-model="Location" >
                        <option disabled value="">Please select Location</option>
                        <option>Office</option>
                        <option>Storage room</option>
                        <option>Hall</option>
                      </select>
              </p></th>
            </tr>
            <tr>
              <th style="text-align: right; padding-right: 1%;"> <b>State:</b> </th>
              <th> <p> 
                      <select v-model="State" >
                        <option disabled value="">Please select State</option>
                        <option>Active</option>
                        <option>Maintance</option>
                        <option>Not working</option>
                      </select>
              </p></th>
            </tr>         
            <tr>
              <th style="text-align: right; vertical-align: super;"> <b> Description: </b> </th>
              <th> <p> <textarea  rows="5" cols="50" v-model="Description"> </textarea></p></th>
            </tr>
      </table>
      <p> 
        <button @click='cancelbtn' class='button'> Cancel </button> 
        <button @click='savebtn' class='button'> Save </button> 
      </p>
  </div>
</template>

<script>
import { defineComponent, ref } from "vue";
import firebase from "firebase/compat/app"
import { storeFB } from '../../config/firebase'
import 'firebase/compat/auth'
import { getAuth } from "firebase/auth"
import swal from 'sweetalert'

const userid = getAuth().currentUser.uid;
const errMsg = ref() 
var d = new Date();
var datestring = d.getDate()  + "-" + (d.getMonth()+1) + "-" + d.getFullYear() 


export default defineComponent({
  name: 'Edit',
  data() {
    return {
        Owner:userid,
        Name:null,
        Category:null,
        Location:null,
        Description:null,     
        Date:datestring,
        State:null
    }
  },

  methods: {
      cancelbtn: function cancelbtn() {
        this.$router.push({ path: '/dashboard', replace: true })
      },
      savebtn: function savebtn() {
        if( this.Name == null){
          this.showError("Please enter a Name")
        }else if( this.Name.length > 20){
          this.showError("Name cannot be more than 20 chars")
        }else if( this.Category == null){
          this.showError("Please choose a category")
        }else if( this.Location == null){
          this.showError("Please choose a location")
        }else if( this.State == null){
          this.showError("Please choose a state")
        }else{
          try{
            storeFB.collection('inventory').doc().set({
                            owner: this.Owner,
                            name:this.Name,
                            category:this.Category,
                            location:this.Location,
                            description:this.Description,
                            date:this.Date,
                            state:this.State,
                            owner_name:this.getOwnerName()
              })
              swal({
                            title: "Success!",
                            text: "New Equipment has been added to the database!",
                            icon: "success",
                            dangerMode: true
              });
              this.clearData()
              this.$router.push({ path: '/dashboard', replace: true })
          } catch (error) {
            this.showError(error.value)
          }  
        }      
      },
      clearData:function clearData(){
            this.Name= null,
            this.Category= null,
            this.Location= null,
            this.Description= null
      },
      showError:function showError(errorMSG){
        swal({
                  title: "Ooops",
                  text: errorMSG,
                  icon: "error",
                  dangerMode: true
                  })
      }, 
  },
  
  setup() {
    var OwnerName=''
    const getOwnerName = ( ) => {
      storeFB.collection('users').doc(userid).get().then(snapshot  => {
                             OwnerName = snapshot.data().firstname +' '+ snapshot.data().lastname  
                          })
                          .catch(error => {
                            console.log(error.code)
                          });
                          return OwnerName
    }
    return {
      getOwnerName,
      OwnerName
    };
  },
  
  created() {
    this.getOwnerName()
  },
})
</script>
