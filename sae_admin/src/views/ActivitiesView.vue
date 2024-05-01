<template>
    <div class="page">
        <div class="title">
            <h1> Liste de toutes les Activités - {{ displayedData.length }} </h1>
            <button @click="saveToCSV">Exporter en CSV</button>
            <select v-model=filter @change="sortData">
                <option value=0>Trier par</option>
                <option value="id">ID</option>
                <option value="name">Nom</option>
                <option value="start">Date de Début</option>
            </select>
            <input 
                type="text"
                v-model=search 
                placeholder="Rechercher" 
                @input="filterData"
            />
        </div>
        <div 
            class="list" 
            v-for="d in displayedData" 
            v-bind:key="d.id"
        >
            <ActivityComp 
                :data="d"
                @activityDeleted="handleActivityDeleted"
            />
        </div>
    </div>
</template>

<script>
import { defineComponent } from 'vue'
import ActivityComp from '@/components/ActivitiesComp.vue';
import CheckComp from '@/components/CheckComp.vue';
export default defineComponent({
    name: "ActivitiesView",
    /*props: {
        data: Array
    },*/
    data(){
        return{
            data: [],
            displayedData: [],
            filter: 0,
            search: "",
            displayModal: false,
            textModal: ""
        }
    },
    components:{
        ActivityComp, CheckComp
    },
    mounted(){
        this.refreshData();
    },
    methods:{
        async refreshData(){
            this.data = []
            let response = await fetch('https://sae-repihandi-api.onrender.com/activities')
            //let response = await fetch('http://localhost:4000/activities')
            response = await response.json()
            this.data = response
            this.displayedData = this.data
            console.log("act : ",this.displayedData)
        },
        sortData(){
            console.log(this.filter)
            switch(this.filter){
                case "id":
                    this.displayedData.sort((a, b) => a.id - b.id)
                    break;
                case "name":
                    this.displayedData.sort(this.compareData)
                    break;
                case "start":
                    this.displayedData.sort(this.compareData)
                    break;
                default:
                    break;
            }     
        },
        compareData(a, b){
            if(a[this.filter] < b[this.filter])
                return -1
            if(a[this.filter] > b[this.filter])
                return 1
            return 0
        },
        filterData(){
            console.log(this.search)
            this.displayedData = this.displayedData.filter((activity) => activity.name.toLowerCase().includes(this.search.toLowerCase()) || 
                                                                         activity.description.includes(this.search.toLowerCase()))
            if(this.search === "")
                this.displayedData = this.data
        },
        handleActivityDeleted(activityId) {
            // Mettez à jour la liste après la suppression
            this.displayedData = this.displayedData.filter(activity => activity.id !== activityId);
        },
        saveToCSV(){
            const columns = []
            let obj = this.data[0]
            for(const property in obj){
                columns.push(property)
            }
            const csvString  = [ columns, ...this.data.map(item => [item.id, item.name,
                                item.description, item.start, item.end, item.id_user, item.capacity,item.address, item.postalcode])]
            .map(e => e.join(",")) 
            .join("\n");
            console.log(csvString)


            let encodedUri = encodeURI("data:text/csv;charset=utf-8," + csvString);
            let link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            let date = new Date().toISOString()
            link.setAttribute("download", "activite-"+date.substring(0, 10)+".csv");
            document.body.appendChild(link); // Required for FF

            link.click(); // This will download the data file named "my_data.csv".
        }
    }
})
</script>
<style lang="scss" scoped>
@import "/src/style/style.css";
.title{
    display: grid;
    grid-template-columns: 45% auto auto auto;
    input {
        height:30px;
        position:relative;
        top:20px;
    }
    select{
        height:35px;
        position:relative;
        top:20px;
        margin-right: 5px;
    }
    button { 
        height:35px;
        position:relative;
        top:20px;
        margin-right: 5px;
    }
}
</style>