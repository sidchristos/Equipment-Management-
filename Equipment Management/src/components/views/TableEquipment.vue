<template>
  <div>
    <div class="Btndiv">
      <button @click='AddNewbtn' class='buttonAddNew'> Add new Equipment <span class="glyphicon glyphicon-plus" style="float:right;  margin-right: 10px; margin-left: 20px; margin-top: 3px;"></span></button> 
    </div>
    <table-lite
      :is-slot-mode="true"
      :is-loading="table3.isLoading"
      :is-re-search="table3.isReSearch"
      :columns="table3.columns"
      :rows="table3.rows"
      :total="table3.totalRecordCount"
      :sortable="table3.sortable"
      :messages="table3.messages"
      @do-search="doSearch"
      @is-finished="table3.isLoading = false"
    >
      <template v-slot:name="data" >
          <router-link :to='{ name: "equipmentProfile",  params: { id: data.value.InvID }}'>
            <slot></slot>
            {{ data.value.name }}
          </router-link>
      </template>
      <template v-slot:location="data">
          <router-link :to='{ name: "locationProfile",  params: { id: data.value.location }}'>
            <slot></slot>
            {{ data.value.location }}
          </router-link>
      </template>
      <template v-slot:state="data" >
            <slot></slot>
            <div v-if="data.value.state =='Active'" style="color: green;"> <span class="glyphicon glyphicon-ok"></span>  {{ data.value.state }} </div>
            <div v-else-if="data.value.state =='Maintance'" style="color: orange;"><span class="glyphicon glyphicon-minus"></span>  {{ data.value.state }} </div>
            <div v-else-if="data.value.state =='Not working'" style="color: red;"><span class="glyphicon glyphicon-remove"></span>  {{ data.value.state }} </div>
      </template>
    </table-lite>
  </div>
</template>

<script>
import { defineComponent, reactive, onMounted  } from "vue";
import TableLite from "./TableLite.vue";
import firebase from "firebase/compat/app"
import { storeFB } from '../../config/firebase'
import { collection, query, orderBy, startAfter, limit, getDocs } from "firebase/firestore"
import * as firestore from "firebase/firestore";

/* OLD SAMPLE
const sampleData1 = (offst, limit) => {
  offst = offst + 1;
  let data = [];
  for (let i = offst; i <= limit; i++) {
    data.push({
      id: i,
      location:"Office",
      name: "TEST" + i,
      category: "Electronics",
      state: "Active",
      owner: "Christos Stefanou"
    });
  }
  return data;
};

const sampleData2 = (offst, limit) => {
  let data = [];
  for (let i = limit; i > offst; i--) {
    data.push({
      id: i,
      location:"Storage room",
      name: "TESTY" + i,
      category: "Hardware",
      state: "Maintance",
      owner: "Giorgos Papadopoulos"
    });
  }
  return data;
};
*/


export default defineComponent({
  name: "App",
  data: function() {
    return {
    }
  },
  components: {
    TableLite
  },
  methods: {
      AddNewbtn: function AddNewbtn() {
        this.$router.push({ path: '/equipmentAddNew', replace: true })
      },

  },
  setup() {
  let inventoryVariants = [];

    const table3 = reactive({
      isLoading: false,
      isReSearch: false,
      columns: [
        {
          label: "#",
          field: "id",
          width: "3%",
          isKey: true,
        },
                {
          label: "Equipment name",
          field: "name",
          width: "30%",
          sortable: true,
        },
        {
          label: "Location",
          field: "location",
          width: "20%",
          sortable: true,
        },
        {
          label: "Category",
          field: "category",
          width: "10%",
          sortable: true,
        },
        {
          label: "State",
          field: "state",
          width: "17%",
          sortable: true,
        },     
        {
          label: "Owner",
          field: "owner_name",
          width: "20%",
          sortable: true,
        },            
      ],
      rows: [],
      totalRecordCount: 0,
      sortable: {
        order: "name",
        sort: "asc",
      },
      messages: {
        pagingInfo: "Showing {0}-{1} of {2}",
        pageSizeChangeLabel: "Row count:",
        gotoPageLabel: "Go to page:",
        noDataAvailable: "Loading data..",
      },
    });

    const getData = ( ) => {
      table3.isLoading = true;
      let i=0;
      
      let DB = storeFB.collection('inventory');
      DB.orderBy('name', 'asc').get().then(querySnapshot => {
        querySnapshot.forEach(doc => {
                  let dict = { ...doc.data(), InvID: doc.id, id:i+1};
                  inventoryVariants.push(dict);
                  i++
                });
                table3.rows =inventoryVariants.slice(0,10);
                table3.totalRecordCount = i;
                table3.sortable.order = "name";
                table3.sortable.sort = "asc";
                table3.isLoading = false;
      });
    };

    const doSearch = (offset, limit, order, sort) => {
              console.log("doSearch :  " + offset, limit, order, sort)               //Log
      table3.isLoading = true;
      inventoryVariants=[];
      let i=0;
      let DBsearch = storeFB.collection('inventory');
                      console.log("isReSearch 1 :  " + table3.isReSearch)                     //Log
      table3.isReSearch = offset == undefined ? true : false;
                console.log("isReSearch 2 :  " + table3.isReSearch)                     //Log
      DBsearch.orderBy(order, sort).limit(limit).get().then(querySnapshot => {
        querySnapshot.forEach(doc => {
                  let dict = { ...doc.data(), InvID: doc.id, id:i+1};
                  inventoryVariants.push(dict);
                  i++
                });
                table3.rows =inventoryVariants;
                table3.sortable.order = order;
                table3.sortable.sort = sort;
                table3.isLoading = false;
      });
    };

    /* OLD SAMPLE
    const doSearch = (offset, limit, order, sort) => {
      table3.isLoading = true;
      setTimeout(() => {
        table3.isReSearch = offset == undefined ? true : false;
        if (offset >= 10 || limit >= 20) {
          limit = 20;
        }
        if (sort == "asc") {
          table3.rows = sampleData1(offset, limit);
        } else {
          table3.rows = sampleData2(offset, limit);
        }
        table3.totalRecordCount = 20;
        table3.sortable.order = order;
        table3.sortable.sort = sort;
      }, 600);
    };
    */

    return {
      table3,
      doSearch,
      getData
    };
  },
  created() {
    //console.log("Created")
    this.getData()
  },
  mounted(){ 
    //console.log("Mounted")
  }
});
</script>

