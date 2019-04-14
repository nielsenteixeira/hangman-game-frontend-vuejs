<template>
  <div id="app">
    <v-app id="inspire">
      <v-content>
        <v-container fluid fill-height>
          <v-layout align-center justify-center>
            <v-flex xs12 sm8 md4>
              <v-card class="elevation-12">
                <v-toolbar dark color="primary">
                  <v-toolbar-title>Login</v-toolbar-title>
                  <v-spacer></v-spacer>
                </v-toolbar>
                <v-card-text>
                  <v-form ref="form" v-model="valid" lazy-validation>
                    <v-text-field
                      v-model="login"
                      prepend-icon="person"
                      required
                      name="login"
                      label="Login"
                      type="text"
                      :rules="loginRules"
                    ></v-text-field>
                    <v-text-field
                      v-model="password"
                      prepend-icon="lock"
                      required
                      name="password"
                      label="Password"
                      id="password"
                      type="password"
                      :rules="passwordRules"
                    ></v-text-field>

                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn :disabled="!valid" @click="validate">Login</v-btn>
                    </v-card-actions>
                  </v-form>
                </v-card-text>
              </v-card>
            </v-flex>
          </v-layout>
        </v-container>
      </v-content>
    </v-app>
  </div>
</template>

<script>
import axios from 'axios'
export default {
    name: 'Login',
    data: () => ({
        valid: true,
        login: "",
        loginRules: [
        v => !!v || "Favor informar o Login"
        ],
        password: "",
        passwordRules: [
        v => !!v || "Favor informar a senha"
        ]
    }),

    methods: {
        data() {
            return {
                    login: '',
                    password: ''
                }
        },
        validate() {
        if (this.$refs.form.validate()) {
            this.snackbar = true;

            axios.post('http://localhost:9000/auth', {login: this.login, password: this.password })
                .then(() => {
                    alert('Login com sucesso! Para visualizar o JWT inspecionar o cabeçalho da resposta.')
                    //router.push({name: 'Hangman'})
                })
                .catch(err => { 
                    if (err.response && err.response.status === 401) {
                        alert('Usuário ou senha inválidos');
                    } else if (err.request) {
                        alert('Erro de rede!')
                    } else {
                        alert('Erro: ' + err.message)
                    }
                })
            }
        }
    }
};
</script>

<style>
</style>
