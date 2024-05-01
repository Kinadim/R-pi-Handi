
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createStore } from 'vuex'

const store = createStore({
    state () {
        return {
            user: { id: undefined, mail: undefined }
            
        }
    },
    getters: {
        user (state) {
            return state.user;
        }
    },
    mutations: {
      addUser(state, newUser) {
        if(newUser.id !== undefined && newUser.mail !== undefined && typeof newUser.mail == 'string') {
            state.user = newUser
          }
      },
  
      loadStore() {
        if(localStorage.getItem('store')) {
            try {
                this.replaceState(JSON.parse(localStorage.getItem('store')));
            }
            catch(e) {
                console.log('Could not initialize store', e);
            }
        }
    }
  
    }
  });
  
  store.subscribe((mutation, state) => {
    localStorage.setItem('store', JSON.stringify(state));
  })

const app = createApp(App)

app.use(router)
app.use(store);
app.mount('#app')
