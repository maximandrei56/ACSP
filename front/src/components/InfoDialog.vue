<template>
  <div>
    <v-layout row justify-left>
      <v-dialog v-model="item.idialog" fullscreen hide-overlay transition="dialog-bottom-transition">
        <template v-slot:activator="{ on }">
          <v-btn icon>
          <v-icon color="blue" dark v-on="on">info</v-icon>
          </v-btn>
        </template>
        <v-card>
          <v-toolbar color="blue">
            <v-btn icon color="blue" @click="item.idialog = false">
              <v-icon>close</v-icon>
            </v-btn>
            <v-toolbar-title>Static Analysis Report - {{item.name}}</v-toolbar-title>

          </v-toolbar>
          <v-tabs
            color="blue"
            slider-color="black"
            grow
           >
            <v-tab
              v-for="n in detections"
              :key="n"
            >
              <span style="color: black;">{{n}}</span>


            </v-tab>
            <v-tab-item
              v-for="(n,i) in detections"
              :key="n"
            >
              <v-card flat>
                <v-card-text v-show="i === 2">
                  <v-card-text v-show="!psalm">Sorry, this feature was not selected.</v-card-text>
                  <v-flex v-show="psalm" xs12 lg5 mb-3>
                    <v-expansion-panel popout>
                      <v-expansion-panel-content
                        v-for="(item,j) in psalm"
                        :key="j"
                      >
                        <template v-slot:actions>
                          <v-icon v-show="item.severity === 'error'" color="red">error</v-icon>
                          <v-icon v-show="item.severity === 'info'" color="orange">warning</v-icon>
                        </template>
                        <template v-slot:header>
                          <div>{{item.file}} line: {{item.line}}</div>
                        </template>
                        <v-card>
                          <v-card-text class="grey lighten-3">{{item.description}}</v-card-text>
                          <pre v-highlightjs="item.source"><code class="php"></code></pre>
                        </v-card>
                      </v-expansion-panel-content>
                    </v-expansion-panel>
                  </v-flex>
                </v-card-text>
                <v-card-text v-show="i === 1">
                  <v-card-text v-show="!psecio">Sorry, this feature was not selected.</v-card-text>
                  <v-flex v-show="psecio" xs12 lg5 mb-3>
                    <v-expansion-panel popout>
                      <v-expansion-panel-content
                        v-for="(item,j) in psecio"
                        :key="j"
                      >
                        <template v-slot:actions>
                          <v-icon color="red">error</v-icon>
                        </template>
                        <template v-slot:header>
                          <div>{{item.file}} line: {{item.line}}</div>
                        </template>
                        <v-card>
                          <v-card-text class="grey lighten-3">{{item.description}}</v-card-text>
                          <pre v-highlightjs="item.source"><code class="php"></code></pre>
                        </v-card>
                      </v-expansion-panel-content>
                    </v-expansion-panel>
                  </v-flex>
                </v-card-text>
                <v-card-text v-show="i === 0">
                  <v-card-text v-show="!(phploc instanceof Array)">Sorry, this feature was not selected.</v-card-text>
                  <v-treeview v-show="phploc instanceof Array" :items="phploc" transition hoverable open-on-click></v-treeview>
                </v-card-text>
              </v-card>
            </v-tab-item>
          </v-tabs>
        </v-card>
      </v-dialog>
    </v-layout>
  </div>
</template>

<script>
  export default {
    name: "InfoDialog",
    props: ['psecio', 'phploc', 'psalm', 'item'],
    data() {
      return {
        dialog: false,
        notifications: false,
        sound: true,
        widgets: false,
        detections: ['Project metrics', 'Security analyser', 'Bug finder']
      }
    }
  }
</script>

<style scoped>

</style>
