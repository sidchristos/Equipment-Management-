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
      comment=":has-checkbox=true"
      comment2="@return-checked-rows=updateCheckedRows"
    >
      <template v-slot:name="data" >
          <router-link :to='{ name: "equipmentProfile",  params: { id: data.value.name }}'>
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
    </table-lite>
  </div>
</template>

<script>
import { defineComponent, reactive } from "vue";
import TableLite from "./TableLite.vue";
import router from "../../config/routes.js"



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


export default defineComponent({
  name: "App",

  components: {
    TableLite
  },
  methods: {
      AddNewbtn: function AddNewbtn() {
        this.$router.push({ path: '/equipmentAddNew', replace: true })
      },
  },
  setup() {
    const table3 = reactive({
      isLoading: false,
      isReSearch: false,
      columns: [
        {
          label: "ID",
          field: "id",
          width: "3%",
          sortable: true,
          isKey: true,
        },
        {
          label: "Location",
          field: "location",
          width: "10%",
          sortable: true,
        },
        {
          label: "Name",
          field: "name",
          width: "10%",
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
          width: "10%",
          sortable: true,
        },     
        {
          label: "Owner",
          field: "owner",
          width: "10%",
          sortable: true,
        },            
      ],
      rows: sampleData1(0, 10),
      totalRecordCount: 20,
      sortable: {
        order: "id",
        sort: "asc",
      },
      messages: {
        pagingInfo: "Showing {0}-{1} of {2}",
        pageSizeChangeLabel: "Row count:",
        gotoPageLabel: "Go to page:",
        noDataAvailable: "No data",
      },
    });

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

    return {
      table3,
      doSearch
    };
  },
});
</script>

