<template>
  <div>
    <div v-show="dialogHistory">
      <md-progress-spinner :md-diameter="60" :md-stroke="10" md-mode="indeterminate"></md-progress-spinner>
    </div>

    <v-container>
      <v-btn color="blue" dark class="mb-2" @click="refreshHistory()" round>Refresh
        <v-icon
          medium
          class="mr-2"
          @click=""
        >
          refresh
        </v-icon>
      </v-btn>
    </v-container>
    <v-data-table
      :headers="headers"
      :items="elements"
      :expand="expand"
      :must-sort=true
      :custom-sort="customSort"
      item-key="name"
      dark
      v-show="!dialogHistory"
    >
      <template v-slot:items="props">
        <tr @click="props.expanded = !props.expanded">
          <td class="text-xs-left">
            <v-icon
              v-show="props.item.operation === 'remove'"
              medium
              class="red--text"
            >
              delete
            </v-icon>
            <v-icon
              v-show="props.item.operation === 'create'"
              medium
              class="green--text"
            >
              add_circle
            </v-icon>
            {{ props.item.operation }}
          </td>
          <td class="text-xs-left">{{props.item.time}}</td>
          <td class="text-xs-left">{{ props.item.name }}</td>
        </tr>
      </template>
      <template v-slot:expand="props">
        <v-card flat v-for="it in props.item.expandKeys" v-bind:key="it">
          <v-card-text>{{it}}: {{props.item.expandValue[it]}} ms</v-card-text>
        </v-card>
      </template>
    </v-data-table>
  </div>
</template>

<script>
  import InfoDialog from "@/components/InfoDialog";

  export default {
    name: "History",
    components: {InfoDialog},
    created() {
      this.dialogHistory = true;

      this.axios.get('http://localhost:3001/listLogs',
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      ).then((response) => {
        console.log('SUCCESS!!', response);

        this.elements = response.data;

        this.elements.forEach(prod => {
          this.$set(prod, "expanded", false);
          this.$set(prod, "time", (new Date(prod.time)).toGMTString());
          this.$set(prod, "expandKeys", Object.keys(prod.expandValue));
        });
        this.dialogHistory = false;
      })
        .catch(() => {
          this.dialog = false;
          console.log('FAILURE!!');
        });
    },
    methods: {
      customSort(items, index, isDesc) {
        items.sort((a, b) => {
          let ka = new Date(a.time).getTime();
          let kb = new Date(b.time).getTime();

          return ka <= kb;
        });

        if (!isDesc) {
          items = items.reverse();
        }
        console.log(items.map((el) => el.time));
        return items;
      },
      refreshHistory() {
        this.dialogHistory = true;

        this.axios.get('http://localhost:3001/listLogs',
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        ).then((response) => {
          console.log('SUCCESS!!', response);

          this.elements = response.data;

          this.elements.forEach(prod => {
            this.$set(prod, "expanded", false);
            this.$set(prod, "time", (new Date(prod.time)).toGMTString());
            this.$set(prod, "expandKeys", Object.keys(prod.expandValue));

          });
          this.dialogHistory = false;
        })
          .catch(() => {
            this.dialog = false;
            console.log('FAILURE!!');
          });
      }
    },
    data() {
      return {
        dialogHistory: false,
        expand: false,
        headers: [
          {
            text: 'Operation',
            sortable: false,
            value: 'operation'
          },
          {
            text: 'Time',
            value: 'time'
          },
          {
            text: 'Project name',
            sortable: false,
            value: 'name'
          },

        ],
        elements: [
          {
            name: 'Coliw',
            operation: 'create',
            time: 10,
            expandValue: 'expanded',
            expanded: false
          }

        ]
      }
    }
  }
</script>

<style scoped>

</style>
