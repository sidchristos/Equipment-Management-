<template>
  <div>
    <h1> Equipment Profile </h1>
    <div v-if="Loading">
        <h2>Loading...</h2>
    </div>
    <div v-else> 
      <p> ID : {{url_data}} </p><hr>     
      <div v-if="Preview"> 
        <div>   
          <p> Name : {{inv.Name}} </p>
          <p> Location : {{inv.Location}} </p>
          <p> Category : {{inv.Category}} </p>
          <p> Owner_name : {{inv.Owner_name}} </p>
          <p> State : {{inv.State}} </p>
          <p> Created on : {{inv.DateI}} </p>
          <p> Description : {{inv.Description}} </p>
        </div> 
        <hr>
        <div>
          <details>
          <summary @click='getDataHistory' style="cursor: pointer;"><h1 style="cursor: pointer;">History +</h1></summary><br>
          <table class="HistoryTable">
            <tr> 
              <th >#</th><th>Date</th><th>Done by</th><th>Action</th>
            </tr>
            <tr v-for="(value,index) in history"  class="trHistory" v-bind:key="value">
              <td width="5%">{{ index+1 }}</td>
              <td width="20%">{{ value.date }}</td>
              <td width="25%">{{ value.createdby }} </td>
              <td width="20%">{{ value.type }}</td>
            </tr>
          </table>
          </details>
        </div>
        <br><hr><p>  <button @click='backbtn' class='button'> Back </button> <button @click='deletebtn' class='button'> Delete </button> <button @click='editbtn' class='button'> Edit </button></p>
      </div>
      <div v-else  class="form">
        <table style="margin-left: auto; margin-right: auto; text-align: right;">
          <tr>
            <th style="text-align: right;padding-right: 1%;"> <b>Name: </b> </th>
            <th> <p> <input type='text' :value=inv.Name id="nam" /> </p></th>
          </tr>
          <tr>
            <th  style="text-align: right;padding-right: 1%;"> <b>Owner_name:</b> </th>
            <th><p> <input type='text' :value=inv.Owner_name id="own"/> </p></th>
          </tr>          
          <tr>
            <th style="text-align: right;padding-right: 1%;"> <b>Location: </b> </th>
            <th><p> 
               <select v-model="inv.Location" >
                    <option disabled value="">Please select Location</option>
                    <option v-for="location in location" :value="location.value" v-bind:key="location">
                       {{ location.text }}
                    </option>
                </select>
            </p></th>
          </tr>
          <tr>
            <th style="text-align: right;padding-right: 1%;"> <b>Category:</b> </th>
            <th><p>                     
              <select v-model="inv.Category" >
                  <option disabled value="">Please select Category</option>
                  <option v-for="category in category" :value="category.value" v-bind:key="category">
                      {{ category.text }}
                  </option>
              </select> 
            </p></th>
          </tr>
          <tr>
            <th style="text-align: right;padding-right: 1%;"> <b>State: </b> </th>
            <th><p> 
                <select v-model="inv.State" >
                    <option disabled value="">Please select State</option>
                    <option v-for="state in state" :value="state.value" v-bind:key="state">
                        {{ state.text }}
                    </option>
                </select>
             </p></th>
          </tr>
          <tr>
            <th style="text-align: right; vertical-align: super;"> <b> Description: </b> </th>
            <th> <p> <textarea id="des"  :value=inv.Description rows="5" cols="50"> </textarea></p></th>
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
import { ref,defineComponent } from "vue";
import { storeFB } from '../../config/firebase'
import swal from 'sweetalert'

let Inv_data = "";
const errMsg = ref() 
var d = new Date();
const TimeAmPm = d.toLocaleTimeString('en-US', {
  hour: '2-digit',
  minute: '2-digit',
});
var datestring = d.getDate()  + "-" + (d.getMonth()+1) + "-" + d.getFullYear() + ", " + TimeAmPm;

export default defineComponent({
  name: "Equipment Profile-component",

  data(){
   return{
      url_data: null,
      Preview:true,
      DateH:datestring,
      Loading:true,

      inv:[
            {Category:null},
            {DateI:null},
            {Description:null},
            {Location:null},
            {Name:null},
            {Owner:null},     
            {Owner_name:null}, 
            {State:null},
      ], 
      category: [
          { text: 'Electronics', value: 'Electronics' },
          { text: 'Hardware', value: 'Hardware' },
          { text: 'Software', value: 'Software' }
      ],
      location: [
          { text: 'Office', value: 'Office' },
          { text: 'Storage room', value: 'Storage room' },
          { text: 'Hall', value: 'Hall' }
      ],        
      state: [
          { text: 'Active', value: 'Active' },
          { text: 'Maintance', value: 'Maintance' },
          { text: 'Not working', value: 'Not working' }
      ],
      history:[
      ]
    };
  },

  methods: {
      getData: function getData() {
          storeFB.collection('inventory')
                    .doc( this.url_data )
                    .get()
                    .then(snapshot  => {
                      Inv_data = snapshot.data()  
                      this.inv.Category=Inv_data.category,
                      this.inv.DateI=Inv_data.date,
                      this.inv.Location=Inv_data.location,
                      this.inv.Name=Inv_data.name, 
                      this.inv.Owner=Inv_data.owner,
                      this.inv.Owner_name=Inv_data.owner_name,
                      this.inv.State=Inv_data.state
                      if ( Inv_data.description !== null){
                            this.inv.Description=Inv_data.description
                      }else{
                        this.inv.Description='No description'
                      }                         
                    })
                    .catch(error => {
                      console.log(error.code)
                      this.showError(error.code)
                    })
                    .finally(() => {
                      this.Preview = true  
                      this.Loading = false         
                    });
          
      },

      getDataHistory: function getDataHistory(){
        let i=0;
        this.history=[];
        storeFB.collection('inventory').doc(this.url_data).collection('history').orderBy('date', 'asc')
               .get().then(Snapshot => { Snapshot.forEach(doc => {
                      let dict = { ...doc.data(), id:i+1};
                      this.history.push(dict)
                      })
                    })
                    .catch(error => {
                      console.log(error.code)
                      this.showError(error.code)
                    })        

      },    

      editbtn: function editbtn() {
        this.Preview = false
      },

      backbtn: function editbtn() {
        this.$router.push({ path: '/dashboard', replace: true });
      },

      deletebtn: function editbtn() {
          var swal_text = "Equipment : "+ this.inv.Name + ", was deleted successfully"
          var docID = this.url_data
          var d_router=this.$router
          swal({
                title: "Are you sure?",
                text: "You will not be able to recover your data",
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
                      var docRef = storeFB.collection("inventory").doc(docID);
                      docRef.delete();
                      d_router.push({ path: '/dashboard', replace: true });
                  });
                } 
              })
      },
      
      savebtn: function savebtn() {
          if(document.getElementById('nam').value < 4){
              errMsg.value='Name must be at least 4 characters'
              this.showError(errMsg.value)
          }else if(document.getElementById('own').value == ""){
              errMsg.value="Please insert owner's name"
              this.showError(errMsg.value)
          }else{
            storeFB.collection('inventory').doc(this.url_data).set({
              name:document.getElementById('nam').value,
              owner_name:document.getElementById('own').value,
              description:document.getElementById('des').value,            
              category:this.inv.Category,
              location:this.inv.Location,
              state:this.inv.State,
              owner:this.inv.Owner,
              date:this.inv.DateI
            }).then(docRef => {
              console.log(this.DateH,sessionStorage.local_uid)
                  storeFB.collection('inventory').doc(this.url_data).collection('history').doc().set({
                    date:this.DateH,
                    createdby:sessionStorage.local_uid,
                    type:'Edited'
                  })
            }) 
            this.getData();
            this.getDataHistory();
            swal({
              title: "Success!",
              text: "Equipment info have been saved",
              icon: "success",
              dangerMode: true
            });  
          }  
      },

      cancelbtn: function cancelbtn() {
        this.Preview = true
      },

      showError: function showError(errorMSG){
        swal({
                  title: "Ooops",
                  text: errorMSG,
                  icon: "error",
                  dangerMode: true
                  })
      },

  },

  mounted(){
     this.url_data=this.$route.params.id;
     this.getData()
     this.getDataHistory()
    },
});
</script>
