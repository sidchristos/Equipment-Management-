<template>
  <div>
    <h1> Location Profile </h1>
    <p> ID : {{url_data}} </p>
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "Location Profile-component",
  mounted(){
     this.url_data=this.$route.params.id;
    },
  data(){
   return{
     url_data: null
    };
  }
});
</script>
