<template>
  <v-layout align-start>
    <v-flex>
      <v-toolbar flat color="white">
        <v-btn @click="pdfCreator()">
          <v-icon>print</v-icon>
        </v-btn>
        <v-toolbar-title>Loans</v-toolbar-title>
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
            <v-btn color="primary" dark class="mb-2" v-on="on">New</v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>
            <v-card-text>
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs12 sm6 md6>
                    <v-select v-model="bank" :items="banks" label="Bank">
                    </v-select>
                  </v-flex>
                  <v-flex xs12 sm12 md12>
                    <v-text-field
                      v-model="startDate"
                      label="Start Date"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6 md6>
                    <v-text-field
                      v-model="endDate"
                      label="End Date"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6 md6>
                    <v-text-field
                      v-model="account"
                      label="Account"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm12 md12>
                    <v-text-field
                      v-model="amount"
                      label="Amount"
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
              Approve Loan
            </v-card-title>
            <v-card-title class="headline" v-if="adAction == 2">
              Cancel Loan
            </v-card-title>
            <v-card-text>
              You are going to
              <span v-if="adAction == 1"><strong>Approbe</strong> </span>
              <span v-if="adAction == 2"><strong>Cancel</strong> </span> the
              loan with the bank <strong>{{ adName }}</strong>
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
                Approbe
              </v-btn>
              <v-btn
                v-if="adAction == 2"
                @click="deactivate()"
                color="orange darken-4"
                flat="flat"
              >
                Cancel Loan
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
      <v-btn color="error" danger class="mb-2" @click="removeLoans()"
        >Delete cancelled loans</v-btn
      >
      <v-data-table
        :headers="headers"
        :items="loans"
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
          <td>{{ props.item.bank.name }}</td>
          <td>{{ props.item.startDate }}</td>
          <td>{{ props.item.endDate }}</td>
          <td>{{ props.item.account }}</td>
          <td>{{ props.item.amount }}€</td>
          <td>
            <div v-if="props.item.status">
              <span class="green--text">Approbed</span>
            </div>
            <div v-else>
              <span class="red--text">Cancelled</span>
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
      loans: [],
      headers: [
        { text: "Options", value: "options", sortable: false },
        { text: "Bank", value: "bank.name", sortable: false },
        { text: "Start Date", value: "startDate", sortable: true },
        { text: "End Date", value: "endDate", sortable: true },
        { text: "Account", value: "account", sortable: false },
        { text: "Amount", value: "amount", sortable: false },
        { text: "Status", value: "status", sortable: false },
      ],
      editedIndex: -1,
      _id: "",
      bank: "",
      banks: [],
      startDate: "",
      endDate: "",
      account: "",
      amount: "",
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
    this.selectBank();
  },
  methods: {
    /**
     * @vuese
     * Method that creates a PDF document based on the properties of the Loan object.
     */
    pdfCreator() {
      var columns = [
        { title: "Bank", dataKey: "bank" },
        { title: "Start Date", dataKey: "startDate" },
        { title: "End Date", dataKey: "endDate" },
        { title: "Account", dataKey: "account" },
        { title: "Amount", dataKey: "amount" },
      ];
      var rows = [];
      this.loans.map(function (x) {
        rows.push({
          bank: x.bank.name,
          startDate: x.startDate,
          endDate: x.endDate,
          account: x.account,
          amount: x.amount,
        });
      });
      var doc = new jsPDF("p", "pt");
      doc.autoTable(columns, rows, {
        margin: { top: 60 },
        addPageContent: function (data) {
          doc.text("Loans List", 40, 30);
        },
      });
      doc.save("loans.pdf");
    },
    /**
     * @vuese
     * Method that selects the bank which the loan is requested from a query to the
     * API from the database and store the categories in an array.
     */
    selectBank() {
      let me = this;
      let arrayBanks = [];
      let header = { Token: this.$store.state.token };
      let config = { headers: header };
      axios
        .get("bank/list", config)
        .then(function (response) {
          arrayBanks = response.data;
          arrayBanks.map(function (x) {
            me.banks.push({ text: x.name, value: x._id });
          });
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    /**
     * @vuese
     * Method that outputs a list of all the loans in the database by means of a
     * request to the API.
     */
    list() {
      let me = this;
      let header = { Token: this.$store.state.token };
      let config = { headers: header };
      axios
        .get("loan/list", config)
        .then(function (response) {
          me.loans = response.data;
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
      this.startDate = "";
      this.endDate = "";
      this.account = 0;
      this.amount = 0;
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
      if (!this.bank) {
        this.validateMessage.push("Select a bank");
      }
      if (this.startDate.length > 64) {
        this.validateMessage.push("Insert a right Start Date");
      }
      if (this.endDate.length > 64) {
        this.validateMessage.push("Insert a right End Date");
      }
      if (this.amount < 0) {
        this.validateMessage.push("Introduce a valid amount");
      }
      if (this.validateMessage.length) {
        this.valida = 1;
      }
      return this.valida;
    },
    /**
     * @vuese
     * Method that saves loans in the database or edits them through an API request.
     */
    save() {
      let me = this;
      let header = { Token: this.$store.state.token };
      let config = { headers: header };
      if (this.validator()) {
        return;
      }
      if (this.editedIndex > -1) {
        //Edit loan
        axios
          .put(
            "loan/update",
            {
              _id: this._id,
              bank: this.bank,
              startDate: this.startDate,
              endDate: this.endDate,
              account: this.account,
              amount: this.amount,
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
        //Save loan
        axios
          .post(
            "loan/add",
            {
              bank: this.bank,
              startDate: this.startDate,
              endDate: this.endDate,
              account: this.account,
              amount: this.amount,
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
     * Method that assigns the properties of the Article object so that they can be edited.
     * @arg item:Object
     */
    editItem(item) {
      this._id = item._id;
      this.bank = item.bank._id;
      this.startDate = item.startDate;
      this.endDate = item.endDate;
      this.account = item.account;
      this.amount = item.amount;
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
      this.adName = item.bank.name;
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
     * Method that approbes a Loan through an API query.
     */
    activate() {
      let me = this;
      let header = { Token: this.$store.state.token };
      let config = { headers: header };
      axios
        .put("loan/activate", { _id: this.adId }, config)
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
     * Method that cancels a Loan through an API query.
     */
    deactivate() {
      let me = this;
      let header = { Token: this.$store.state.token };
      let config = { headers: header };
      axios
        .put("loan/deactivate", { _id: this.adId }, config)
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
     * Method that deletes cancelled loans.
     */
    removeLoans() {
      let me = this;
      let header = { Token: this.$store.state.token };
      let config = { headers: header };
      axios
        .delete("loan/removeLoans", config)
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
 <style>
#invoice {
  padding: 20px;
  font-family: Arial, sans-serif;
  font-size: 16px;
}

#logo {
  float: left;
  margin-left: 2%;
  margin-right: 2%;
}
#imagen {
  width: 100px;
}

#fact {
  font-size: 18px;
  font-weight: bold;
  text-align: center;
}

#data {
  float: left;
  margin-top: 0%;
  margin-left: 2%;
  margin-right: 2%;
}

#header {
  text-align: center;
  margin-left: 10px;
  margin-right: 10px;
  font-size: 16px;
}

section {
  clear: left;
}

#client {
  text-align: left;
}

#faclient {
  width: 40%;
  border-collapse: collapse;
  border-spacing: 0;
  margin-bottom: 15px;
}

#fa {
  color: #ffffff;
  font-size: 14px;
}

#facarticle {
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
  padding: 20px;
  margin-bottom: 15px;
}

#facarticle thead {
  padding: 20px;
  background: #2183e3;
  text-align: center;
  border-bottom: 1px solid #ffffff;
}

#thanks {
  text-align: center;
}
</style>
