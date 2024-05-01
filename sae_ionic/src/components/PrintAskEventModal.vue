<template>
<ion-page class="main_page" style="overflow-y: auto;">
    <ion-header>
      <ion-toolbar>
        <ion-title>RépiHandi</ion-title>
      </ion-toolbar>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button @click="back">retour</ion-button>
        </ion-buttons>
        <h1 class="centrer">Information</h1>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding tout">
      <div>
        <hr>
        <div>
        <h2><b>{{ eventData.title }}</b></h2>   
      </div>
      <hr>
      <ion-item v-if="user.id != eventData.id_user">
          <ion-input placeholder="Entrer le nom de l'évènement" v-model="eventName" maxlength="32"></ion-input>
      </ion-item>
      <div class="cote">
        <div>
          <h2>{{ (eventData.start).toLocaleDateString("fr-FR", {weekday: "long", day: "numeric", month: "long", year: "numeric",}) }}</h2>
        </div>
      <hr>
        <div>  
          <h2>Heure de l'évènement</h2>
          <h2>{{ (eventData.start).toTimeString().substring(0, 9) }} - {{ (eventData.end).toTimeString().substring(0, 9) }}</h2>
        </div>
      <hr>
        <div>  
          <h2>Nombre de bénéficiaires : {{ eventData.capacity }}</h2>
        </div> 
      <hr> 
      </div>
      </div>
        <ion-button expand="block" class="custom-button" color="danger" :strong="true" @click="supprimer" v-if="user.id == eventData.id_user">Supprimer la demande</ion-button>
        <ion-button expand="block" class="custom-button" :strong="true" @click="support" v-else>Prendre en charge l'activité</ion-button>
    </ion-content>
  </ion-page>
</template>
  
  <script lang="ts">
  import { IonPage, IonButton, modalController,IonSelect, IonSelectOption,IonItem, IonList, IonInput } from '@ionic/vue';
  import { defineComponent, ref } from 'vue';
  import { useStore } from 'vuex';
  export default defineComponent({
    components: { IonItem, IonList, IonSelect, IonSelectOption, IonInput, IonPage, IonButton },
    beforeCreate() {
        // Get our store
        const store = useStore()
        // use store.commit to run any mutation. Below we are running the loadStore mutation
        store.commit('loadStore');
        
    },
  data() {
    return {
      pacito : [],
      currentPAC: '',
      PACs: [],
      userPACs: [],
      user: this.$store.getters.user,
      eventDescrip: "",
      selectCapacite:0,
      numberOfPAC:5,
      eventName: ""
    }
  },
  props: {
    eventData: {
      required: true,
    },
  },
  mounted(){
        this.refreshData();
  },
  methods: {
    handleChange(cap){
            this.selectCapacite = cap;
    },

    compareWith(o1, o2) {
      return o1 && o2 ? o1.id === o2.id : o1 === o2;
    },
    /**
    * Asynchronously refreshes data by fetching user-specific PACs and PACs associated with the current event.
    * Filter out user-specific PACs that are already associated with the current event.
    */
    async refreshData(){
      let response = await fetch('https://sae-repihandi-api.onrender.com/pac/user/'+ this.$store.getters.user.id);
      response = await response.json();
      this.userPACs = response;

      response = await fetch('https://sae-repihandi-api.onrender.com/pac/activities/' + this.eventData.id);
      response = await response.json();
      this.PACs = response;

      this.userPACs = this.userPACs.filter((userPac) => !this.PACs.some(pac => JSON.stringify(userPac) === JSON.stringify(pac)));
      

      
    },

/**
 * Asynchronously handles activity support.
 */
 async support(){
            let nom_event =this.eventName;
            //let date_event = this.bar;
            if (!nom_event) {
                alert('Le nom de l\'évènement est obligatoire.');
                return;
            }
            
            //date_event = date_event.substring(0, 10);

            let desc_event = "Nature de l'activité encore à définir";
            let start_event = this.eventData.start;
            let end_event = this.eventData.end;
            let capacit_event = this.eventData.capacity;

            let start_event_date = new Date(start_event)
            let end_event_date = new Date(end_event)
            start_event_date.setHours(start_event_date.getHours() + 1)
            end_event_date.setHours(end_event_date.getHours() + 1)

            //let adresse_event = event_adresse.value;
            //let codePostal_event = codePostal.value;
            
            const newEvent2 = {
                id:this.eventData.id,
                start: start_event_date.toISOString(),
                end: end_event_date.toISOString(),
                name: nom_event,
                description: desc_event,
                capacity: capacit_event,
                content: 0 + ' / ' + capacit_event,
                address:"la maison de répit",
                postalcode: "13200",
                class: 'pink-event',
                id_user: this.$store.getters.user.id,
                request: false
                //iduser: 4
            }
            const sent = await fetch('https://sae-repihandi-api.onrender.com/activities', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newEvent2)
            });
            modalController.dismiss({},'confirm');
        },
  /**
   * Asynchronously handles the deletion of an activity.
   */
    async supprimer(){
      const sent = await fetch('https://sae-repihandi-api.onrender.com/activities/'+this.eventData.id, {method: 'DELETE'});
      modalController.dismiss({},'confirm');
    }
  },

  
  setup(props) {
    const event_Name = ref('');

    const back = () => modalController.dismiss(null, 'cancel');

    return {
      back,
    };
  },
});
  </script>
<style scoped>
.main_page {
    background: url('../../public/img/background.png') no-repeat center center fixed;
    background-size: cover;
}
ion-page {
    height: 100%;
}

ion-content {
    --background: none;
}

ion-toolbar {
    --background: #88B2E3;
    text-align: center; /* Centrer le contenu de ion-toolbar */
}

ion-title {
    color: white;
    font-size: 1.5em; /* Ajuste la taille du texte du titre */
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2); /* Ajoute une ombre sous ion-title */
}

h1{
    color: white;
}

ion-item {
    --background: #f8f8f8; /* Couleur de fond de l'item */
    --border-radius: 10px; /* Bordure de l'item */
    --border-color: #007bff; /* Couleur de la bordure de l'item */
    --padding-start: 10px; /* Espacement à gauche de l'item */
    --padding-end: 10px; /* Espacement à droite de l'item */
    --padding-top: 10px; /* Espacement en haut de l'item */
    --padding-bottom: 10px; /* Espacement en bas de l'item */
    margin-left: 10px; /* Espacement à gauche de l'item */
    margin-right: 10px; /* Espacement à droite de l'item */
    margin-top: 10px; /* Espacement en haut de l'item */
    margin-bottom: 10px; /* Espacement en bas de l'item */
}
div{
  text-align: center;
  background: #f8f8f8; /* Couleur de fond de l'item */
  border-radius: 10px;
  margin-left: 10px; /* Espacement à gauche de l'item */
  margin-right: 10px; /* Espacement à droite de l'item */
  margin-top: 10px; /* Espacement en haut de l'item */
  margin-bottom: 10px; /* Espacement en bas de l'item */
}

.cote{
  text-align: start;
  margin-left: 10px;
}
ion-button {
    color: rgb(70, 43, 169); /* Couleur du texte du bouton */
    --background: white; /* Couleur de fond du bouton */
    --border-color: white; /* Couleur de la bordure du bouton */
    border-radius: 10px;;
}

ion-button:hover {
    --background: #0056b3; /* Couleur de fond du bouton au survol */
}

ion-input {
  --background: transparent;
  color: black;
}

ion-textarea {
    color: black;
}
.tdout{
  /*max-width: 360px; */
  height: 560px;
}

.centrer{
  text-align: center;

}


</style>
  