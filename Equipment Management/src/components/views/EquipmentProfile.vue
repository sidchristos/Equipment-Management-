<template>
  <div class="form">
    <h1> Equipment Profile </h1>
    <div>      
      <div v-if="Preview">     
        <p> ID : {{url_data}} </p><hr>
        <p> Name : {{Name}} </p>
        <p> Location : {{Location}} </p>
        <p> Category : {{Category}} </p>
        <p> Owner_name : {{Owner_name}} </p>
        <p> State : {{State}} </p>
        <p> Date : {{DateI}} </p>
        <p> Description : {{Description}} </p>
        <br><p> <button @click='editbtn' class='button'> Edit </button> </p>
      </div>
      <div v-else>
        <p> ID : {{url_data}} </p>
        <table style="margin-left: auto; margin-right: auto; text-align: right;">
          <tr>
            <th style="text-align: right;padding-right: 1%;"> <b>Name: </b> </th>
            <th> <p> <input type='text' :value=Name id="nam" /> </p></th>
          </tr>
          <tr>
            <th  style="text-align: right;padding-right: 1%;"> <b>Owner_name:</b> </th>
            <th><p> <input type='text' :value=Owner_name id="own"/> </p></th>
          </tr>          
          <tr>
            <th style="text-align: right;padding-right: 1%;"> <b>Location: </b> </th>
            <th><p> 
               <select v-model="Location" >
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
              <select v-model="Category" >
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
                <select v-model="State" >
                    <option disabled value="">Please select State</option>
                    <option v-for="state in state" :value="state.value" v-bind:key="state">
                        {{ state.text }}
                    </option>
                </select>
             </p></th>
          </tr>
          <tr>
            <th style="text-align: right; vertical-align: super;"> <b> Description: </b> </th>
            <th> <p> <textarea id="des"  :value=Description rows="5" cols="50"> </textarea></p></th>
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
import { defineComponent } from "vue";
import firebase from "firebase/compat/app"
import { storeFB } from '../../config/firebase'
import swal from 'sweetalert'

let Inv_data = "";
export default defineComponent({
  name: "Equipment Profile-component",

  data(){
   return{
      url_data: null,
      Preview:true,
      Category:null,
      DateI:null,
      Description:'No description',
      Location:null,
      Name:null,
      Owner:null,     
      Owner_name:null, 
      State:null, 
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
                      this.Category=Inv_data.category,
                      this.DateI=Inv_data.date,
                      this.Location=Inv_data.location,
                      this.Name=Inv_data.name, 
                      this.Owner=Inv_data.owner,
                      this.Owner_name=Inv_data.owner_name,
                      this.State=Inv_data.state
                      if ( Inv_data.description != null){
                            this.Description=Inv_data.description
                      }                           
                    })
                    .catch(error => {
                      console.log(error.code)
                      this.showError(error.code)
                    })
                    .finally(() => {
                      this.Preview = true           
                    });
          
      },

      editbtn: function editbtn() {
        this.Preview = false
      },
      
      savebtn: function savebtn() {
        alert(" Save() under construction")
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
    },
});
</script>
