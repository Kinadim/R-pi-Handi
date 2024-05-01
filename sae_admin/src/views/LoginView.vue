<template>
	<div class="login">
		<div class="panel">
			<h1 class="title">CONNEXION</h1>
			<hr/>
			<div class="inputs">
				<div class="line">
					<input 
						type="text" 
						placeholder="login"
						v-model="email"
					/>
				</div>
				<div class="line">
					<input 
						type="password" 
						placeholder="mot de passe"
						v-model="password"
					/>
				</div>
			</div>
		<br/>
			<button @click="login">CONNECT</button>
		</div>
  </div>
</template>

<script>
import Base64 from 'crypto-js/enc-base64';
import SHA256 from "crypto-js/sha256";
import { useStore } from 'vuex'

export default {
	name: 'LoginView',
	beforeCreate() {
        // Get our store
        const store = useStore()
        // use store.commit to run any mutation. Below we are running the loadStore mutation
        store.commit('loadStore');
    },
	data(){
        return{
            email: "",
            password: ""
        }
    },
	components: {
	},
	mounted(){
	},
	methods: {
		async login(){
            let newObj = {
                mail: this.email,
                password: Base64.stringify(SHA256(this.password))
            };
			console.log(newObj)
            let response = await fetch('http://localhost:4000/admin/check', {
                                            method: 'POST',
                                            headers: {
                                                'Content-Type': 'application/json'
                                            },
                                            body: JSON.stringify(newObj)
                                        })
            response = await response.json()
            console.log(response)

            if(response.length !== 0 && response.connect ){
				this.$store.commit('addUser', response.object)
                console.log(this.$store.getters.user.firstname," is logged")
				this.$router.replace({ path: '/home' })
			}
            else{
                console.log("login ou mot de passe incorrect");
            }
        },
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@import "/src/style/style.css";
/* Palette */
/* #f7f7f2 */
/* #e4e6c3 */
/* #899878 */
/* #222725 */
/* #121113 */


.login {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100vh;
	width: 100vw;
	background-color: #88B2E3;
}


input {
	width: 100%;
	height: 30px;
	border-radius: 5px;
	border: 1px solid #ccc;
	padding: 5px;
	margin-bottom: 5%;
}

#noAccount {
	font-size: 0.8em;
	margin-bottom: 10%;
}


button {
    cursor: pointer;
    display: inline-block;
    background: #222725;
    color: white;
    font-size: 18px;
	border: 0;
    padding: 0.8rem 1.5rem;
  }
  
  button:focus {
    outline: none;
  }
  
  button:hover {
    transform: scale(0.98);
  }
  
</style>

