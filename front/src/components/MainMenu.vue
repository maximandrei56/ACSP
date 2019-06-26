<template>
  <div>
    <v-layout justify-center>
      <v-btn-toggle v-model="tab" light mandatory
                    v-bind:style="{'background-color': '#2196f3!important', 'border-color': 'black'}">
        <v-btn flat round value="1" v-bind:style="{'color': 'white'}">MY PROJECTS</v-btn>
        <v-btn flat round value="2" v-bind:style="{'color': 'white'}">HISTORY</v-btn>
      </v-btn-toggle>

    </v-layout>

    <my-projects v-show="tab==='1'"></my-projects>
    <history v-show="tab=='2'"></history>
  </div>
</template>

<script>
  import MyProjects from "@/components/MyProjects";
  import History from "@/components/History";

  export default {
    name: "MainMenu",
    components: {History, MyProjects},
    data() {
      return {
        tab: "1"
      }
    },
    methods: {
      next() {
        console.log('dsds')
      }
    }
  }
</script>

<style scoped>

</style>
