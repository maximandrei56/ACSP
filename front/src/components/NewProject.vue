<template>
  <div>
    <!--first component------------------------------------------------------------------------------------------------------>

    <div v-show="componentCnt === 0">
      <md-empty-state>
        <md-field>
          <label class="pnLabel">Project name</label>
          <md-input v-model="projectName"></md-input>
        </md-field>

        <md-button class="md-primary md-raised" @click.native="next()">
          Next
        </md-button>

      </md-empty-state>
    </div>

    <!--second component------------------------------------------------------------------------------------------------------>

    <div v-show="componentCnt === 1">

      <v-content>

        <input type="file" id="file" ref="file" accept=".zip"
               v-on:change="onFileUpload()"/>

      </v-content>

      <md-button class="md-primary md-raised" @click.native="back()">
        BACK
      </md-button>

      <md-button class="md-primary md-raised" @click.native="next()">
        Next
      </md-button>

    </div>

    <!--third component------------------------------------------------------------------------------------------------------>

    <div v-show="componentCnt === 2">
      <md-empty-state>

        <md-switch v-model="staticAnalysis.phpstan">discover bugs</md-switch>
        <md-switch v-model="staticAnalysis.phploc">gather metrics</md-switch>
        <md-switch v-model="staticAnalysis.phpmd">mess detector</md-switch>

      </md-empty-state>
      <md-button class="md-primary md-raised" @click.native="back()">
        BACK
      </md-button>

      <md-button class="md-primary md-raised" @click.native="finish()">
        Finish
      </md-button>
    </div>

    <!--fourth component------------------------------------------------------------------------------------------------------>

    <div v-show="componentCnt === 3">
      <md-progress-spinner :md-diameter="60" :md-stroke="10" md-mode="indeterminate"></md-progress-spinner>
    </div>

    <!--fifth component------------------------------------------------------------------------------------------------------>

    <div v-show="componentCnt === 4">
      <v-layout v-show="successResponse" row justify-center>
        <v-dialog v-model="dialog" persistent max-width="290">
          <v-card>
            <v-card-title class="headline green--text">Success</v-card-title>
            <v-card-text>Congratulations! You have successfully added your project.</v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" flat @click="dialog = false; componentCnt = 0">ADD ONE MORE</v-btn>
              <router-link to="/MyProjects">
              <v-btn color="blue darken-1" flat @click="dialog = false">MY PROJECTS</v-btn>
              </router-link>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-layout>

      <v-layout v-show="!successResponse" row justify-center>
        <v-dialog v-model="dialog" persistent max-width="290">
          <v-card>
            <v-card-title class="headline red--text">Error</v-card-title>
            <v-card-text>Oops, something went wrong. :(</v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" flat @click="dialog = false; componentCnt = 0">RETRY</v-btn>
              <router-link to="/MyProjects">
              <v-btn color="blue darken-1" flat @click="dialog = false">MY PROJECTS</v-btn>
              </router-link>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-layout>
    </div>

  </div>

</template>

<script>
  export default {
    name: "NewProject",
    data: () => ({
      dialog: false,
      file: null,
      componentCnt: 0,
      projectName: '',
      successResponse: false,
      staticAnalysis: {
        'phploc': false,
        'phpmd': false,
        'phpstan': false

      }
    }),
    methods: {
      onFileUpload($ev) {
        this.file = this.$refs.file.files[0];
      },
      back() {
        this.componentCnt -= 1
      },
      next() {
        this.componentCnt += 1
      },
      finish() {
        this.next();

        let formData = new FormData();
        /*
            Add the form data we need to submit
        */
        formData.append('file', this.file);

        /*
          Make the request to the POST /fileUpload in backend server.
        */
        this.axios.post('http://localhost:3001/fileUpload',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              'projectName': this.projectName,
              'userName': 'admin'
            }
          }
        ).then((response) => {
          console.log('SUCCESS!!', response);

          this.componentCnt += 1;
          this.dialog = true;
          this.successResponse = true;
        })
          .catch(() => {
            console.log('FAILURE!!');

            this.componentCnt += 1;
            this.dialog = true;
            this.successResponse = false;
          });
      }
    }
  }
</script>

<style scoped>
  .pnLabel {
    left: 2.18em
  }
</style>
