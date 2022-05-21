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
import { storeFB } from '../../config/firebase'
import { collection, query, orderBy, startAfter, limit, getDocs } from "firebase/firestore";

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

    const doSearch = (offset, limit, order, sort) => {                                                                                 //TODO: PAGINATION
      console.log("   >>>doSearch< " + 'offset: '+ offset+ ' - limit: '+ limit+ ' - order: '+ order+ ' - sort: '+ sort)                //Log
      table3.isLoading = true;
      inventoryVariants=[];
      let i=0;
      let j=0;
      let DBsearch = storeFB.collection('inventory');
      table3.isReSearch = offset == undefined ? true : false; 
      console.log("   >>>isReSearch :  " + table3.isReSearch)                                                                          //Log

      const dosearch= DBsearch.orderBy(order, sort).limit(limit).get()
      dosearch.then(querySnapshot => { querySnapshot.forEach(doc => {
                  let dict = { ...doc.data(), InvID: doc.id, id:i+1};
                  inventoryVariants.push(dict);
                  i++
                });
                table3.rows =inventoryVariants;
                table3.sortable.order = order;
                table3.sortable.sort = sort;
                table3.isLoading = false;
      });

      //Test pagination
      var ref = DBsearch.orderBy(order, sort).startAt(offset).limit(limit).get()
      ref.then(querySnapshot => { querySnapshot.forEach(doc => {
                  let dict2 = { ...doc.data(), InvID: doc.id, id:j+1};
                  console.log(j+1+'-'+dict2.name)                                                                                      //Log
                  j++
          });
          console.log(">>>>>>>>>>>>>>>>>>>>END<<<<<<<<<<<<<<<<<<<<")
      });
      //Test
    };

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

