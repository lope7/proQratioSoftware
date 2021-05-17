<template>
  <v-layout align-start>
    <v-flex>
      <v-toolbar flat color="white">
        <v-btn @click="pdfCreator()">
          <v-icon>print</v-icon>
        </v-btn>
        <v-toolbar-title>Providers</v-toolbar-title>
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
                  <v-flex xs12 sm6 md6>
                    <v-select
                      v-model="document_type"
                      :items="documents"
                      label="Document Type"
                    >
                    </v-select>
                  </v-flex>
                  <v-flex xs12 sm6 md6>
                    <v-text-field
                      v-model="document_num"
                      label="Number Document"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6 md6>
                    <v-text-field
                      v-model="address"
                      label="Address"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6 md6>
                    <v-text-field v-model="phone" label="Phone"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6 md6>
                    <v-text-field v-model="email" label="Email"></v-text-field>
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
              Activate Provider
            </v-card-title>
            <v-card-title class="headline" v-if="adAction == 2">
              Deactivate Provider
            </v-card-title>
            <v-card-text>
              You are going to
              <span v-if="adAction == 1"><strong> Activate </strong> </span>
              <span v-if="adAction == 2"><strong> Deactivate </strong> </span>
              the provider <strong>{{ adName }}</strong>
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
      <v-data-table
        :headers="headers"
        :items="people"
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
          <td>{{ props.item.type }}</td>
          <td>{{ props.item.document_type }}</td>
          <td>{{ props.item.document_num }}</td>
          <td>{{ props.item.address }}</td>
          <td>{{ props.item.phone }}</td>
          <td>{{ props.item.email }}</td>
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
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
export default {
  data() {
    return {
      dialog: false,
      search: "",
      people: [],
      headers: [
        { text: "Options", value: "options", sortable: false },
        { text: "Name", value: "name", sortable: true },
        { text: "Type", value: "type", sortable: true },
        { text: "Document", value: "document_type", sortable: true },
        { text: "Document number", value: "document_num", sortable: false },
        { text: "Address", value: "address", sortable: false },
        { text: "Phone", value: "phone", sortable: false },
        { text: "Email", value: "email", sortable: false },
        { text: "Status", value: "status", sortable: false },
      ],
      editedIndex: -1,
      _id: "",
      name: "",
      type: "Proveedor",
      document_type: "",
      documents: ["CIF", "Otro"],
      document_num: "",
      address: "",
      phone: "",
      email: "",
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
     * Method that creates a PDF document based on the properties of the Person object
     * in this case provider.
     */
    pdfCreator() {
      var columns = [
        { title: "Name", dataKey: "name" },
        { title: "Document", dataKey: "document_type" },
        { title: "Document Number", dataKey: "document_num" },
        { title: "Address", dataKey: "address" },
        { title: "Phone", dataKey: "phone" },
        { title: "Email", dataKey: "email" },
      ];
      var rows = [];
      this.people.map(function (x) {
        rows.push({
          name: x.name,
          document_type: x.document_type,
          document_num: x.document_num,
          address: x.address,
          phone: x.phone,
          email: x.email,
        });
      });
      var doc = new jsPDF("p", "pt");
      doc.autoTable(columns, rows, {
        margin: { top: 60 },
        addPageContent: function (data) {
          doc.text("Provider List", 40, 30);
        },
      });
      doc.save("providers.pdf");
    },
    /**
     * @vuese
     * Method that outputs a list of all the providers in the database by means of a
     * request to the API.
     */
    list() {
      let me = this;
      let header = { Token: this.$store.state.token };
      let config = { headers: header };
      axios
        .get("person/providerList", config)
        .then(function (response) {
          me.people = response.data;
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
      this.document_num = "";
      this.address = "";
      this.phone = "";
      this.email = "";
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
      if (this.document_num.length > 20) {
        this.validateMessage.push(
          "Document number mustn´t have more than 20 characters."
        );
      }
      if (this.address.length > 70) {
        this.validateMessage.push(
          "Address mustn´t have more than 20 characters."
        );
      }
      if (this.phone.length > 20) {
        this.validateMessage.push(
          "Telephone number mustn´t have more than 20 characters."
        );
      }
      if (this.email.length > 50) {
        this.validateMessage.push("Esmail must have les than 50 characters.");
      }
      if (this.validateMessage.length) {
        this.valida = 1;
      }
      return this.valida;
    },
    /**
     * @vuese
     * Method that saves providers in the database or edits them through an API request.
     */
    save() {
      let me = this;
      let header = { Token: this.$store.state.token };
      let config = { headers: header };
      if (this.validator()) {
        return;
      }
      if (this.editedIndex > -1) {
        //Edit client
        axios
          .put(
            "person/update",
            {
              _id: this._id,
              type: this.type,
              name: this.name,
              document_type: this.document_type,
              document_num: this.document_num,
              address: this.address,
              phone: this.phone,
              email: this.email,
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
        //Save client
        axios
          .post(
            "person/add",
            {
              type: this.type,
              name: this.name,
              document_type: this.document_type,
              document_num: this.document_num,
              address: this.address,
              phone: this.phone,
              email: this.email,
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
     * Method that assigns the properties of the Person object so that they can be edited.
     * @arg item:Object
     */
    editItem(item) {
      this._id = item._id;
      this.role = item.role;
      this.name = item.name;
      this.document_type = item.document_type;
      this.document_num = item.document_num;
      this.address = item.address;
      this.phone = item.phone;
      this.email = item.email;
      this.password = item.password;
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
     * Method that activates a provider through an API query.
     */
    activate() {
      let me = this;
      let header = { Token: this.$store.state.token };
      let config = { headers: header };
      axios
        .put("person/activate", { _id: this.adId }, config)
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
     * Method that deactivates a provider through an API query.
     */
    deactivate() {
      let me = this;
      let header = { Token: this.$store.state.token };
      let config = { headers: header };
      axios
        .put("person/deactivate", { _id: this.adId }, config)
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
     * Method that deletes all the inactive people in the system of the company.
     */
    removeAll() {
      let me = this;
      let header = { Token: this.$store.state.token };
      let config = { headers: header };
      axios
        .delete("person/removeAll", config)
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