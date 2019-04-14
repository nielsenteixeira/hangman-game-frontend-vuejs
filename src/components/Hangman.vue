<template>
  <div id="app">
    <v-app id="inspire">
      <v-content>
        <v-container fluid fill-height>
          <v-layout align-center justify-center>
            <v-flex xs12 sm8 md6>
              <v-card class="elevation-12">
                <v-toolbar dark color="primary">
                  <v-toolbar-title>Jogo da forca</v-toolbar-title>
                  <v-spacer></v-spacer>
                </v-toolbar>
                <v-card-text>
                  <v-form ref="form">
                      <v-alert
                        v-model="msgsuccess"
                        dismissible
                        type="success"
                        >
                        Você acertou a palavra!
                    </v-alert>
                    <v-alert
                        v-model="msgerror"
                        dismissible
                        type="error"
                        >
                        Você perdeu! Palavra: {{answer}}
                    </v-alert>
                    <p>
                        {{wordLength}} letras
                    </p>
                    <v-text-field
                      v-model="word"
                      prepend-icon="accessibility"
                      name="word"
                      type="text"
                      readonly
                    ></v-text-field>
                     <v-text-field
                      v-model="character"
                      prepend-icon="send"
                      name="character"
                      label="Letra"
                      type="text"
                      readonly
                    ></v-text-field>
                    <v-text-field
                      v-model="playerLetters"
                      prepend-icon="done_all"
                      name="playerLetters"
                      label="Letras chutadas"
                      type="text"
                      readonly
                    ></v-text-field>
                     <v-text-field
                      v-model="attempts"
                      prepend-icon="check"
                      name="attempts"
                      label="Tentativas"
                      type="text"
                      readonly
                    ></v-text-field>
                     <keyboard
                        v-model="input"
                        @input="changed"
                        :layouts="[
                            'qwertyuiop|asdfghjkl|zxcvbnm|{apagar:backspace}'
                        ]"
                        :maxlength="1000"
                    ></keyboard>
                    <v-snackbar
                        v-model="snackbar"
                        :bottom="y === 'bottom'"
                        :left="x === 'left'"
                        :multi-line="mode === 'multi-line'"
                        :right="x === 'right'"
                        :timeout="timeout"
                        :top="y === 'top'"
                        :vertical="mode === 'vertical'"
                        >
                        {{ message }}
                        <v-btn
                            color="pink"
                            flat
                            @click="snackbar = false"
                        >
                            Close
                        </v-btn>
                    </v-snackbar>

                      <v-btn @click="check">{{button.text}}</v-btn>
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
import keyboard from 'vue-keyboard';
import axios from 'axios'
import router from '../router'

export default {
    name: 'Hangman',
    components: { keyboard },
    created () {
        this.startGame()
    },
    data() {
        return {
            snackbar: false,
            y: 'top',
            x: null,
            mode: '',
            timeout: 5000,
            message: '',

            msgsuccess: '',
            msgerror: '',
            wordLength: undefined,
            identifier: null,
            playerLetters: '',
            input: '',
            word: '',
            character: '',
            attempts: 6,
            win: false,
            button: {
                text: 'Verifica letra'
            },
            answer: ''
        }
    },
    methods: {
        changed(value) {
            this.character = value
            if(this.character.length > 1) {
                this.button.text = 'Chutar Palavra'
            } else {
                this.button.text = 'Verifica letra'
            }
        },
        buildWordTemplate (wordLength) {
            for (let  i = 0; i < wordLength; i++) {
                this.word += ' _ '
            }
        },
        playerWin() {
            this.win = true
            this.msgsuccess = true
            this.button.text = 'Novo Jogo'
        },
        playerLose (answer) {
            this.msgerror = true
            this.button.text = 'Novo Jogo',
            this.answer = answer
        },
        startGame() {
            axios.post('http://localhost:9000/hangman/start')
                .then((response) => {
                    this.wordLength = response.data.wordLength
                    this.identifier = response.data.identifier
                    this.buildWordTemplate(response.data.wordLength)
                })
        }, check() {
            if(this.button.text === 'Novo Jogo') {
                this.$router.go(0);
            } else {
                if(this.character) {
                    if(this.attempts > 0) {
                        if(this.character.length > 1) {
                                axios.post('http://localhost:9000/hangman/shot', {
                                identifier: this.identifier,
                                shot: this.character
                            })
                            .then((response) => {
                                if(response.data.win === true) {
                                    this.playerWin()
                                } else {
                                    this.playerLose(response.data.answer)
                                }
                            })
                        } else {
                            axios.post('http://localhost:9000/hangman/character', {
                                identifier: this.identifier,
                                character: this.character
                            })
                            .then((response) => {
                                this.character = ''
                                this.input = ''
                                this.playerLetters = response.data.playerLetters
                                this.word = response.data.playerWord
                                this.attempts = response.data.remainingAttempts
                                
                                if(this.attempts === 0) {
                                    this.playerLose(response.data.answer)
                                }
                                else if(response.data.win === true) {
                                    this.playerWin()
                                }
                            })
                        }
                    } else {
                        this.message = 'Número de tentativas esgotado!'
                        this.snackbar = true
                    }
                } else {
                    this.message = 'Informe uma letra!'
                    this.snackbar = true
                }
            }
        }
    }
}
</script>

<style>

</style>
