<template>
    <div class="page">
        <div class="title">
            <h1> Liste de toutes les Personnes à Charges - {{ displayedData.length }} </h1>
            <button @click="saveToCSV">Exporter en CSV</button>
            <select v-model=filter @change="sortData">
                <option value=0>Trier par</option>
                <option value="id">ID</option>
                <option value="lastname">Nom de Famille</option>
                <option value="firstname">Prenom</option>
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
            <PacComp 
                :data="d"
                @pacDeleted="handlePacDeleted"
            />
        </div>
    </div>
</template>

<script>
import { defineComponent } from 'vue'
import PacComp from '@/components/PacComp.vue';
import CheckComp from '@/components/CheckComp.vue';
export default defineComponent({
    name: "PacView",
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
        PacComp, CheckComp
    },
    mounted(){
        this.refreshData();
    },
    methods:{
        async refreshData(){
            this.data = []
            let response = await fetch('https://sae-repihandi-api.onrender.com/pac')
            //let response = await fetch('http://localhost:4000/pac')
            response = await response.json()
            this.data = response
            this.displayedData = this.data
            console.log("pac : ",this.displayedData)
        },
        sortData(){
            console.log(this.filter)
            switch(this.filter){
                case "id":
                    this.displayedData.sort((a, b) => a.id - b.id)
                    break;
                case "lastname":
                    this.displayedData.sort(this.compareData)
                    break;
                case "birthdate":
                    this.displayedData.sort(this.compareData)
                    break;
                case "id_role":
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
            this.displayedData = this.displayedData.filter((user) => user.lastname.toLowerCase().includes(this.search.toLowerCase()) || 
                                                                     user.firstname.toLowerCase().includes(this.search.toLowerCase()
            ))
            if(this.search === "")
                this.displayedData = this.data
        },
        handlePacDeleted(pacId) {
            // Mettez à jour la liste après la suppression
            this.displayedData = this.displayedData.filter(pac => pac.id !== pacId);
        },
        saveToCSV(){
            const columns = []
            let obj = this.data[0]
            for(const property in obj){
                columns.push(property)
            }
            const csvString  = [ columns, ...this.data.map(item => [item.id, item.lastname,
                                item.firstname, item.description, item.birthdate, item.clean, item.mobility, item.talk, item.blind, item.epilepsy, item.deaf, item.id_user])]
            .map(e => e.join(",")) 
            .join("\n");
            console.log(csvString)


            let encodedUri = encodeURI("data:text/csv;charset=utf-8," + csvString);
            let link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            let date = new Date().toISOString()
            link.setAttribute("download", "pac-"+date.substring(0, 10)+".csv");
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