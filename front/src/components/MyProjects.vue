<template>
  <div class="unselectable">

    <div v-show="showFirstLoader">
      <md-progress-spinner :md-diameter="60" :md-stroke="10" md-mode="indeterminate"></md-progress-spinner>
    </div>

    <div v-show="!showFirstLoader">
      <!--<v-flex class="text-xs-center">-->
      <!--<v-icon-->
      <!--x-large-->
      <!--class="material-icons blue&#45;&#45;text"-->
      <!--@click="initialize()" v-on="on"-->
      <!--&gt;-->
      <!--refresh-->
      <!--</v-icon>-->
      <!--</v-flex>-->
      <v-dialog v-model="dialog" max-width="500px">


        <v-card>
          <v-card-title>
            <span class="headline">New project</span>
          </v-card-title>

          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12 sm6 md4>
                  <v-text-field v-model="projectName" label="Project name*" required></v-text-field>
                </v-flex>
              </v-layout>

              <v-layout wrap>
                <v-flex xs12 sm6 md4>
                  <input type="file" id="file" ref="file" accept=".zip"
                  />
                </v-flex>
              </v-layout>

            </v-container>
            <v-spacer></v-spacer>
            <span class="subheading"><b>Static analysis:</b></span>
            <v-empty></v-empty>
            <v-layout column>
              <v-tooltip top>
                <template v-slot:activator="{ on }">
                <span v-on="on">
                <md-switch v-model="staticTools.psalm" v-bind:style="{width: '15em'}">bug analyser</md-switch>
                </span>
                </template>
                <span>{{bugsToolTip}}</span>
              </v-tooltip>
              <v-tooltip top>
                <template v-slot:activator="{ on }">
                <span v-on="on">
                  <md-switch v-model="staticTools.phploc" v-bind:style="{width: '15em'}">metrics analyser</md-switch>
                </span>
                </template>
                <span>{{metricsToolTip}}</span>
              </v-tooltip>
              <v-tooltip top>
                <template v-slot:activator="{ on }">
                <span v-on="on">
                <md-switch v-model="staticTools.psecio" v-bind:style="{width: '15em'}">security analyser</md-switch>
                </span>
                </template>
                <span>{{securityToolTip}}</span>
              </v-tooltip>

            </v-layout>

          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat @click="onClose">Close</v-btn>
            <v-btn color="blue darken-1" flat @click="onCreate()">Create</v-btn>
          </v-card-actions>

        </v-card>

      </v-dialog>
      <!--indeterminate dialog-->
      <v-dialog
        v-model="dialogWait"
        hide-overlay
        persistent
        width="300"
      >
        <v-card
          color="primary"
        >
          <v-card-text>
            {{loadingText}}
            <v-progress-linear
              indeterminate
              color="blue"
              class="mb-0"
            ></v-progress-linear>
          </v-card-text>
        </v-card>
      </v-dialog>


      <v-container>
        <!--&lt;!&ndash;<v-toolbar-title></v-toolbar-title>&ndash;&gt;-->
        <!--<v-divider-->
        <!--class="mx-2"-->
        <!--inset-->
        <!--vertical-->
        <!--&gt;</v-divider>-->
        <!--<v-spacer></v-spacer>-->


        <!--&lt;!&ndash;<template v-slot:activator="{ on }">&ndash;&gt;-->
        <v-btn color="blue" dark class="mb-2" @click="dialog=true" round>New Project
          <v-icon
            medium
            class="mr-2"
            @click=""
          >
            add_circle
          </v-icon>
        </v-btn>
        <!--&lt;!&ndash;</template>&ndash;&gt;-->
      </v-container>

      <v-data-table
        :headers="headers"
        :items="projectList"
        :no-data-text="noDataText"
        :expand="expand"
        item-key="tag"
        dark
        class="elevation-1"
      >

        <template v-slot:items="props">
          <tr @click="props.expanded = !props.expanded">
            <td class="text-xs-left">{{ props.item.name }}</td>
            <td class="text-xs-left">
              <!--<v-icon-->
              <!--medium-->
              <!--class="mr-2 blue&#45;&#45;text"-->
              <!--&gt;-->
              <!--info-->
              <!--</v-icon>-->
              <info-dialog :item="props.item" :psecio="props.item.detect.psecio" :psalm="props.item.detect.psalm"
                           :phploc="props.item.detect.phploc"></info-dialog>
            </td>
            <td class="text-xs-left">{{ props.item.status }}</td>
            <td class="justify-left layout px-0">
              <v-tooltip top nudge-top=45>
                <template v-slot:activator="{ on }">
                  <v-icon
                    medium
                    class="material-icons blue--text"
                    @click="restartProject(props.item)" v-on="on"
                    :disabled="dialogWait"
                  >
                    refresh
                  </v-icon>
                </template>

                <span>{{refreshBtnText}}</span>
              </v-tooltip>

              <v-tooltip top nudge-top=45>
                <template v-slot:activator="{ on }">
                  <v-icon
                    medium
                    class="material-icons green--text"
                    @click="runProject(props.item)" v-on="on"
                    :disabled="dialogWait"
                  >
                    play_circle_filled
                  </v-icon>
                </template>

                <span>{{playBtnText}}</span>
              </v-tooltip>
              <v-tooltip top nudge-top=45>
                <template v-slot:activator="{ on }">
                  <v-icon
                    medium
                    class="material-icons orange--text"
                    @click="stopProject(props.item)" v-on="on"
                    :disabled="dialogWait"
                  >
                    pause_circle_filled
                  </v-icon>
                </template>

                <span>{{pauseBtnText}}</span>
              </v-tooltip>
              <v-tooltip top nudge-top=45>
                <template v-slot:activator="{ on }">
                  <v-icon
                    medium
                    class="red--text"
                    @click="deleteProject(props.item)" v-on="on"
                    :disabled="dialogWait"
                  >
                    delete
                  </v-icon>
                </template>

                <span>{{deleteBtnText}}</span>
              </v-tooltip>
            </td>
          </tr>
        </template>
        <template v-slot:expand="props">
          <v-card flat v-show="props.item.status === 'running'">
            <v-layout column wrap justify-space-around>
              <v-card-text>
                Your application is exposed here
                <v-btn fab color="#424242" small :href="props.item.app_expose" target="_blank">
                  <v-icon
                    class="material-icons blue--text"
                  >
                    cloud_done
                  </v-icon>
                </v-btn>

              </v-card-text>
              <v-card-text v-bind:style="{paddingTop: 0}">
                Live profiler metrics here:
                <v-btn fab color="#424242" small :href="props.item.webgrind_expose" target="_blank">
                  <v-icon
                    class="material-icons blue--text"
                  >
                    cloud_done
                  </v-icon>
                </v-btn>
              </v-card-text>
              <!--<v-flex>-->
              <!--<v-card dark color="secondary">-->
              <!--<v-card-text class="px-0">6</v-card-text>-->
              <!--</v-card>-->
              <!--</v-flex>-->
              <!--<v-flex>-->
              <!--<v-card dark color="secondary">-->
              <!--<v-card-text class="px-0">6</v-card-text>-->
              <!--</v-card>-->
              <!--</v-flex>-->

            </v-layout>
            <!--<v-container grid-list-md text-xs-center>-->
            <!--<v-layout row wrap>-->
            <!--<v-flex xs2>-->
            <!--<v-card-text>-->
            <!--Your application is exposed-->
            <!--</v-card-text>-->
            <!--<v-card-text>-->
            <!--Live profiler metrics-->
            <!--<a href="props.item.app_expose">here.</a>-->
            <!--</v-card-text>-->
            <!--</v-flex></v-layout></v-container>-->

          </v-card>
        </template>
      </v-data-table>
    </div>

  </div>
</template>

<script>
  import InfoDialog from "@/components/InfoDialog";

  export default {
    name: "MyProjects",
    components: {InfoDialog},
    created() {
      this.initialize(() => this.showFirstLoader = false);
    },

    data: () => ({
      dialogWait: false,
      showFirstLoader: true,
      expand: false,
      projectName: '',
      loadingText: 'Please stand by.',
      securityToolTip: "This with check for security vulnerabilities",
      messToolTip: "Mess analyser",
      metricsToolTip: "This will gather metrics from your project",
      bugsToolTip: "This will try to find bugs in your codebase",
      noDataText: "You don't have any project.",
      refreshBtnText: "Restart",
      playBtnText: "Start",
      pauseBtnText: "Stop",
      deleteBtnText: "Remove",
      staticTools: {
        'phpmd': false,
        'phploc': false,
        'phpstan': false,
        'security': false
      },
      dialog: false,
      headers: [
        {
          text: 'Project name',
          align: 'left',
          sortable: false,
          value: 'name'
        },
        {text: 'Latest analysis', sortable: false},
        {text: 'Status', value: 'status', sortable: false},
        {text: 'Actions', value: 'name2', sortable: false}
      ],
      'projectList': [],
    }),
    methods: {
      initialize(cb) {
        this.projectList = [];

        this.axios.get('http://localhost:3001/listProjects',
          {
            headers: {
              'Content-Type': 'application/json',
              'userName': 'admin'
            }
          }
        ).then((response) => {
          console.log('SUCCESS!!', response);

          this.projectList = response.data.projects;

          this.projectList.forEach(prod => this.$set(prod, "idialog", false));
          console.log(this.projectList, '.................');
          cb();
        })
          .catch(() => {
            console.log('FAILURE!!');
          });
      },
      restartProject(item) {
        this.dialogWait = true;
        this.loadingText = 'Restarting your application...';
        var url = `http://localhost:3000/restart/tag=` + item.tag;

        this.axios.get(url).then((response) => {
          console.log('SUCCESS!!', response);
          this.initialize(() => {
          });
        })
          .catch(() => {
            console.log('FAILURE!!');
          })
          .finally(() => this.dialogWait = false);
      },
      stopProject(item) {
        this.dialogWait = true;
        this.loadingText = 'Stopping your application...';
        var url = `http://localhost:3000/stop/tag=` + item.tag;

        this.axios.get(url).then((response) => {
          console.log('SUCCESS!!', response);
          this.initialize(() => {
          });
        })
          .catch(() => {
            console.log('FAILURE!!');
          })
          .finally(() => this.dialogWait = false);
      },
      runProject(item) {
        this.dialogWait = true;
        this.loadingText = 'Starting your application...';
        console.log(this.loadingText);
        var url = `http://localhost:3000/run/tag=` + item.tag;

        this.axios.get(url).then((response) => {
          console.log('SUCCESS!!', response);
          this.initialize(() => {
          });
        })
          .catch(() => {
            console.log('FAILURE!!');
          })
          .finally(() => this.dialogWait = false);
      },
      infoProject(item) {
        console.log(item);
      },
      deleteProject(item) {
        this.dialogWait = true;
        const safety = confirm('Are you sure you want to remove this project ? This operation is permanent!');

        if (!safety) {
          return this.dialogWait = false;
        }
        this.loadingText = 'Removing your application...';
        var url = `http://localhost:3000/destroy/tag=` + item.tag;

        this.axios.get(url).then((response) => {
          console.log('SUCCESS!!', response);
          this.axios.get('http://localhost:3001/deleteProject',
            {
              headers: {
                'Content-Type': 'application/json',
                'userName': 'admin',
                'projectName': item.name,
                'tag': item.tag,
                'path': item.path
              }
            }
          ).then((response) => {
            console.log('SUCCESS!!', response);
            this.initialize(() => {
              this.dialogWait = false
            });

          })
            .catch(() => {
              console.log('FAILURE!!, docker');
            });
        })
          .catch(() => {
            console.log('FAILURE!!');
            this.dialogWait = false;
          });
      },
      onClose() {
        this.dialog = false;
        this.projectName = '';
        this.$refs.file.value = '';
        this.staticTools = {
          'phploc': false,
          'psalm': false,
          'psecio': false
        }
      },
      onCreate() {

        this.dialogWait = true;
        this.loadingText = 'Creating your application...';
        this.file = this.$refs.file.files[0];

        let formData = new FormData();
        /*
            Add the form data we need to submit
        */
        formData.append('file', this.file);
        console.log(this.file, this.projectname);
        /*
          Make the request to the POST /fileUpload in backend server.
        */
        this.axios.post('http://localhost:3001/fileUpload',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              'projectName': this.projectName,
              'userName': 'admin',
              'psalm': this.staticTools.psalm,
              'psecio': this.staticTools.psecio,
              'phploc': this.staticTools.phploc
            }
          }
        ).then((response) => {
          console.log('SUCCESS!!', response);

          this.initialize(() => this.dialogWait = false);

        })
          .catch(() => {
            console.log('FAILURE!!');

            this.dialogWait = false;
          })
          .finally(() => this.onClose());
      }
    }
  }

</script>

<style scoped>
  .unselectable {
    -moz-user-select: -moz-none;
    -khtml-user-select: none;
    -webkit-user-select: none;

    /*
      Introduced in IE 10.
      See http://ie.microsoft.com/testdrive/HTML5/msUserSelect/
    */
    -ms-user-select: none;
    user-select: none;
  }
</style>
