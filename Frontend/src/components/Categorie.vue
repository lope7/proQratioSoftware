<template>
  <v-layout align-start>
    <v-flex>
      <v-toolbar flat color="white">
        <v-toolbar-title>Categories</v-toolbar-title>
        <v-divider class="mx-2" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-text-field
          class="text-xs-center"
          v-model="search"
          append-icon="search"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on }">
            <v-btn color="primary" dark class="mb-2" v-on="on">Add</v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>
            <v-card-text>
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs12 sm12 md12>
                    <v-text-field v-model="name" label="Name"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm12 md12>
                    <v-text-field
                      v-model="description"
                      label="Description"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm12 md12 v-show="valida">
                    <div
                      class="red--text"
                      v-for="v in validateMessage"
                      :key="v"
                      v-text="v"
                    ></div>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" flat @click="close">Cancel</v-btn>
              <v-btn color="blue darken-1" flat @click="save">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="adModal" max-width="290">
          <v-card>
            <v-card-title class="headline" v-if="adAction == 1">
              Activate Categorie
            </v-card-title>
            <v-card-title class="headline" v-if="adAction == 2">
              Deactivate Categorie
            </v-card-title>
            <v-card-text>
              You are going to
              <span v-if="adAction == 1"><strong>Activate</strong> </span>
              <span v-if="adAction == 2"><strong>Deactivate</strong></span> the
              categorie <strong>{{ adName }}</strong>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                @click="activateDeactivateClose()"
                color="green darken-1"
                flat="flat"
              >
                Cancel
              </v-btn>
              <v-btn
                v-if="adAction == 1"
                @click="activate()"
                color="orange darken-4"
                flat="flat"
              >
                Activate
              </v-btn>
              <v-btn
                v-if="adAction == 2"
                @click="deactivate()"
                color="orange darken-4"
                flat="flat"
              >
                Deactivate
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
      <v-btn color="error" danger class="mb-2" @click="removeCategories()"
        >Delete inactive categories</v-btn
      >

      <v-data-table
        :headers="headers"
        :items="categories"
        :search="search"
        class="elevation-1"
      >
        <template v-slot:items="props">
          <td class="justify-center layout px-0">
            <v-icon small class="mr-2" @click="editItem(props.item)">
              edit
            </v-icon>
            <template v-if="props.item.status">
              <v-icon small @click="activateDeactivateShow(2, props.item)">
                block
              </v-icon>
            </template>
            <template v-else>
              <v-icon small @click="activateDeactivateShow(1, props.item)">
                check
              </v-icon>
            </template>
          </td>
          <td>{{ props.item.name }}</td>
          <td>{{ props.item.description }}</td>
          <td>
            <div v-if="props.item.status">
              <span class="green--text">Active</span>
            </div>
            <div v-else>
              <span class="red--text">Inactive</span>
            </div>
          </td>
        </template>
        <template v-slot:no-data>
          <v-btn color="primary" @click="list()">Reset</v-btn>
        </template>
      </v-data-table>
    </v-flex>
  </v-layout>
</template>
<script>
import axios from "axios";
export default {
  data() {
    return {
      dialog: false,
      search: "",
      categories: [],
      headers: [
        { text: "Options", value: "options", sortable: false },
        { text: "Name", value: "name", sortable: true },
        { text: "Description", value: "description", sortable: false },
        { text: "Status", value: "status", sortable: false },
      ],
      editedIndex: -1,
      _id: "",
      name: "",
      description: "",
      valida: 0,
      validateMessage: [],
      adModal: 0,
      adAction: 0,
      adName: "",
      adId: "",
    };
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New register" : "Edit register";
    },
  },
  watch: {
    dialog(val) {
      val || this.close();
    },
  },
  created() {
    this.list();
  },
  methods: {
    /**
     * @vuese
     * Method that outputs a list of all the categories in the database by means of a
     * request to the API.
     */
    list() {
      let me = this;
      let header = { Token: this.$store.state.token };
      let config = { headers: header };
      axios
        .get("categorie/list", config)
        .then(function (response) {
          me.categories = response.data;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    /**
     * @vuese
     * Method that clears all selected fields.
     */
    clean() {
      this._id = "";
      this.name = "";
      this.description = "";
      this.valida = 0;
      this.validateMessage = [];
      this.editedIndex = -1;
    },
    /**
     * @vuese
     * Method used to validate all the selected fields.
     */
    validator() {
      this.valida = 0;
      this.validateMessage = [];
      if (this.name.length < 1 || this.name.length > 50) {
        this.validateMessage.push("Name must have 1-50 characters.");
      }
      if (this.description.length > 255) {
        this.validateMessage.push(
          "Description mustn´t have more than 255 characters."
        );
      }
      if (this.validateMessage.length) {
        this.valida = 1;
      }
      return this.valida;
    },
    /**
     * @vuese
     * Method that saves categories in the database or edits them through an API request.
     */
    save() {
      let me = this;
      let header = { Token: this.$store.state.token };
      let config = { headers: header };
      if (this.validator()) {
        return;
      }
      if (this.editedIndex > -1) {
        //Edit categorie
        axios
          .put(
            "categorie/update",
            {
              _id: this._id,
              name: this.name,
              description: this.description,
            },
            config
          )
          .then(function (response) {
            me.clean();
            me.close();
            me.list();
          })
          .catch(function (error) {
            console.log(error);
          });
      } else {
        //Save categorie
        axios
          .post(
            "categorie/add",
            {
              name: this.name,
              description: this.description,
            },
            config
          )
          .then(function (response) {
            me.clean();
            me.close();
            me.list();
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    },
    /**
     * @vuese
     * Method that assigns the properties of the Categorie object so that they can be edited.
     * @arg item:Object
     */
    editItem(item) {
      this._id = item._id;
      this.name = item.name;
      this.description = item.description;
      this.dialog = true;
      this.editedIndex = 1;
    },
    /**
     * @vuese
     * Method that displays the modal window when the user clicks on the enable or disable method.
     * @arg action:Number
     * @arg item: Object
     */
    activateDeactivateShow(accion, item) {
      this.adModal = 1;
      this.adName = item.name;
      this.adId = item._id;
      if (accion == 1) {
        this.adAction = 1;
      } else if (accion == 2) {
        this.adAction = 2;
      } else {
        this.adModal = 0;
      }
    },
    /**
     * @vuese
     * Method that close the modal window when the user clicks on the enable or disable method.
     */
    activateDeactivateClose() {
      this.adModal = 0;
    },
    /**
     * @vuese
     * Method that activates an article through an API query.
     */
    activate() {
      let me = this;
      let header = { Token: this.$store.state.token };
      let config = { headers: header };
      axios
        .put("categorie/activate", { _id: this.adId }, config)
        .then(function (response) {
          me.adModal = 0;
          me.adAction = 0;
          me.adName = "";
          me.adId = "";
          me.list();
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    /**
     * @vuese
     * Method that deactivates a categorie through an API query.
     */
    deactivate() {
      let me = this;
      let header = { Token: this.$store.state.token };
      let config = { headers: header };
      axios
        .put("categorie/deactivate", { _id: this.adId }, config)
        .then(function (response) {
          me.adModal = 0;
          me.adAction = 0;
          me.adName = "";
          me.adId = "";
          me.list();
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    /**
     * @vuese
     * Method that deletes all the inactive categories.
     */
    removeCategories() {
      let me = this;
      let header = { Token: this.$store.state.token };
      let config = { headers: header };
      axios
        .delete("categorie/removeCategories", config)
        .then(function (response) {
          me.adModal = 0;
          me.adAction = 0;
          me.adName = "";
          me.adId = "";
          me.list();
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    /**
     * @vuese
     * Method to close the modal window.
     */
    close() {
      this.dialog = false;
    },
  },
};
</script>
