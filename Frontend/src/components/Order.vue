<template>
  <v-layout align-start>
    <v-flex>
      <v-toolbar flat color="white">
        <v-toolbar-title>Orders</v-toolbar-title>
        <v-divider class="mx-2" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-text-field
          v-if="seeNew == 0"
          class="text-xs-center"
          v-model="search"
          append-icon="search"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          v-if="seeNew == 0"
          @click="showNew()"
          dark
          class="mb-2"
          >Add</v-btn
        >
        <v-dialog v-model="dialog" max-width="1000px">
          <v-card>
            <v-card-title>
              <span class="headline">Select an article</span>
            </v-card-title>
            <v-card-text>
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs12 sm12 md12 lg12 xl12>
                    <v-text-field
                      v-model="text"
                      @keyup.enter="articleList()"
                      class="text-xs-center"
                      append-icon="search"
                      label="Search"
                    ></v-text-field>
                    <template>
                      <v-data-table
                        :headers="headerArticles"
                        :items="articles"
                        class="elevation-1"
                      >
                        <template v-slot:items="props">
                          <td class="justify-center layout px-0">
                            <v-icon
                              small
                              class="mr-2"
                              @click="aggregateDetail(props.item)"
                            >
                              add
                            </v-icon>
                          </td>
                          <td>{{ props.item.code }}</td>
                          <td>{{ props.item.name }}</td>
                          <td>{{ props.item.categorie.name }}</td>
                          <td>{{ props.item.stock }}</td>
                          <td>{{ props.item.pvp }}</td>
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
                      </v-data-table>
                    </template>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" flat @click="close">Cancel</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="adModal" max-width="290">
          <v-card>
            <v-card-title class="headline" v-if="adAction == 1">
              Activate Purchase
            </v-card-title>
            <v-card-title class="headline" v-if="adAction == 2">
              Cancel Purchase
            </v-card-title>
            <v-card-text>
              You are going to <span v-if="adAction == 1">Activate </span>
              <span v-if="adAction == 2">Cancel </span> the purchase with
              <strong> number proof {{ adName }} </strong>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                @click="activateDeactivateClose()"
                color="green darken-1"
                flat="flat"
              >
                Go back
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
                Cancel purchase
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
      <v-btn color="error" danger class="mb-2" @click="removeOrders()"
        >Delete cancelled orders</v-btn
      >
      <v-data-table
        :headers="headers"
        :items="orders"
        :search="search"
        class="elevation-1"
        v-if="seeNew == 0"
      >
        <template v-slot:items="props">
          <td class="justify-center layout px-0">
            <v-icon small class="mr-2" @click="seeOrder(props.item)">
              info
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
          <td>{{ props.item.user.name }}</td>
          <td>{{ props.item.person.name }}</td>
          <td>{{ props.item.type_proof }}</td>
          <td>{{ props.item.number_proof }}</td>
          <td>{{ moment(props.item.createdAt).format("LL") }}</td>
          <td>
            <strong>{{ moment(props.item.createdAt).fromNow() }}</strong>
          </td>
          <td>{{ props.item.tax }}</td>
          <td>{{ props.item.total }}</td>
          <td>
            <div v-if="props.item.status">
              <span class="green--text">Accepted</span>
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
      <v-container grid-list-sm class="pa-4 white" v-if="seeNew">
        <v-layout row wrap>
          <v-flex xs12 sm4 md4 lg4 x14>
            <v-select
              v-model="type_proof"
              :items="documentsProof"
              label="Type Document Proof"
            >
            </v-select>
          </v-flex>
          <v-flex xs12 sm4 md4 lg4 x14>
            <v-text-field
              v-model="serial_proof"
              label="Serial Number"
            ></v-text-field>
          </v-flex>
          <v-flex xs12 sm4 md4 lg4 x14>
            <v-text-field
              v-model="number_proof"
              label="Number Document Proof"
            ></v-text-field>
          </v-flex>
          <v-flex xs12 sm8 md8 lg8 x18>
            <v-autocomplete :items="people" v-model="person" label="Provider">
            </v-autocomplete>
          </v-flex>
          <v-flex xs12 sm4 md4 lg4 x14>
            <v-text-field type="number" v-model="tax" label="Tax">
            </v-text-field>
          </v-flex>
          <v-flex xs12 sm8 md8 lg8 x8>
            <v-text-field
              v-model="code"
              label="Code"
              @keyup.enter="searchCode()"
            >
            </v-text-field>
          </v-flex>
          <v-flex xs12 sm2 md2 lg2 x12>
            <v-btn small fab dark color="info" @click="showModalArticles">
              <v-icon dark>list</v-icon>
            </v-btn>
          </v-flex>
          <v-flex xs12 sm2 md2 lg2 x12 v-show="articleError">
            <div class="red--text" v-text="articleError"></div>
          </v-flex>
          <v-flex xs12 sm12 md12 lg12 xl12>
            <template>
              <v-data-table
                :headers="headerDetails"
                :items="details"
                hide-actions
                class="elevation-1"
              >
                <template slot="items" slot-scope="props">
                  <td>
                    <v-icon
                      small
                      class="mr-2"
                      @click="deleteDetail(details, props.item)"
                    >
                      delete
                    </v-icon>
                  </td>
                  <td class="text-xs-center">{{ props.item.article }}</td>
                  <td class="text-xs-center">
                    <v-text-field
                      v-model="props.item.amount"
                      type="number"
                    ></v-text-field>
                  </td>
                  <td class="text-xs-center">
                    <v-text-field
                      v-model="props.item.price"
                      type="number"
                    ></v-text-field>
                  </td>
                  <td class="text-xs-center">
                    {{ props.item.amount * props.item.price }}€
                  </td>
                </template>
                <template slot="no-data">
                  <h4>Any article added</h4>
                </template>
              </v-data-table>
              <v-flex class="text-xs-right">
                <strong>Subtotal:</strong>
                {{ (subtotal = (total - totalTax).toFixed(2)) }}€
              </v-flex>
              <v-flex class="text-xs-right">
                <strong>Total Tax:</strong>
                {{ (totalTax = ((total * tax) / (1 + tax)).toFixed(2)) }}€
              </v-flex>
              <v-flex class="text-xs-right">
                <strong>Total:</strong> {{ (total = totalCalculator) }}€
              </v-flex>
            </template>
          </v-flex>
          <v-flex xs12 sm12 md12 v-show="valida">
            <div
              class="red--text"
              v-for="v in validateMessage"
              :key="v"
              v-text="v"
            ></div>
          </v-flex>
          <v-flex xs12 sm12 md12 lg12 xl12>
            <v-btn color="blue darken-1" flat @click.native="hideNew()"
              >Cancel</v-btn
            >
            <v-btn color="info" v-if="seeDetail == 0" @click.native="save()"
              >Save</v-btn
            >
          </v-flex>
        </v-layout>
      </v-container>
    </v-flex>
  </v-layout>
</template>
<script>
import axios from "axios";
var moment = require("moment");
export default {
  data() {
    return {
      moment: moment,
      dialog: false,
      search: "",
      orders: [],
      headers: [
        { text: "Options", value: "options", sortable: false },
        { text: "User", value: "user.name", sortable: true },
        { text: "Provider", value: "person.name", sortable: true },
        { text: "Document Proof", value: "type_proof", sortable: true },
        { text: "Number Proof", value: "number_proof", sortable: false },
        { text: "Date", value: "createdAt", sortable: false },
        { text: "", value: "serial_proof", sortable: false },
        { text: "Tax", value: "tax", sortable: false },
        { text: "Total", value: "total", sortable: false },
        { text: "Status", value: "status", sortable: false },
      ],
      _id: "",
      person: "",
      people: [],
      type_proof: "",
      documentsProof: ["Factura", "Ticket", "Recibo de compra", "Comprobante"],
      serial_proof: "",
      number_proof: "",
      tax: 0.21,
      code: "",
      headerDetails: [
        { text: "Delete", value: "delete", sortable: false },
        { text: "Article", value: "article", sortable: false },
        { text: "Amount", value: "amount", sortable: false },
        { text: "Price", value: "price", sortable: false },
        { text: "Sub Total", value: "subtotal", sortable: false },
      ],
      details: [],
      seeNew: 0,
      articleError: null,
      total: 0,
      subtotal: 0,
      totalTax: 0,
      articles: [],
      text: "",
      headerArticles: [
        { text: "Select", value: "select", sortable: false },
        { text: "Code", value: "code", sortable: false },
        { text: "Name", value: "name", sortable: true },
        { text: "Categorie", value: "categorie.name", sortable: true },
        { text: "Stock", value: "stock", sortable: false },
        { text: "PVP", value: "pvp", sortable: false },
        { text: "Description", value: "description", sortable: false },
        { text: "Status", value: "status", sortable: false },
      ],
      seeDetail: 0,
      valida: 0,
      validateMessage: [],
      adModal: 0,
      adAction: 0,
      adName: "",
      adId: "",
    };
  },
  computed: {
    totalCalculator: function () {
      let result = 0.0;
      for (var i = 0; i < this.details.length; i++) {
        result = result + this.details[i].amount * this.details[i].price;
      }
      return result;
    },
  },
  watch: {
    dialog(val) {
      val || this.close();
    },
  },
  created() {
    this.list();
    this.selectProvider();
  },
  methods: {
    /**
     * @vuese
     * Method that selects the supplier from which the order is made.
     */
    selectProvider() {
      let me = this;
      let arrayPeople = [];
      let header = { Token: this.$store.state.token };
      let config = { headers: header };
      axios
        .get("person/providerList", config)
        .then(function (response) {
          arrayPeople = response.data;
          arrayPeople.map(function (x) {
            me.people.push({ text: x.name, value: x._id });
          });
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    /**
     * @vuese
     * Method that searches the article its identification code.
     */
    searchCode() {
      let me = this;
      me.articleError = null;
      let header = { Token: this.$store.state.token };
      let config = { headers: header };
      axios
        .get("article/queryBarCode?code=" + this.code, config)
        .then(function (response) {
          me.aggregateDetail(response.data);
        })
        .catch(function (error) {
          me.articleError = "Article not found";
        });
    },
    /**
     * @vuese
     * Method that adds to the purchase details.
     * @arg data
     */
    aggregateDetail(data) {
      this.articleError = null;
      if (this.findArticle(data._id) == true) {
        this.articleError = "The article already has been registered";
      } else {
        this.details.push({
          _id: data._id,
          article: data.name,
          amount: 1,
          price: data.pvp,
        });
        this.code = "";
      }
    },
    /**
     * @vuese
     * Method that searches an article by its identifier.
     * @arg id
     */
    findArticle(id) {
      let v = 0;
      for (var i = 0; i < this.details.length; i++) {
        if (this.details[i]._id == id) {
          v = true;
        }
      }
      return v;
    },
    /**
     * @vuese
     * Method that removes order details.
     * @arg arr : Array
     * @arg item : Object
     */
    deleteDetail(arr, item) {
      let index = arr.indexOf(item);
      if (index != -1) {
        arr.splice(index, 1);
      }
    },
    /**
     * @vuese
     * Method that outputs a list of all the articles in the database by means of a
     * request to the API.
     */
    articleList() {
      let me = this;
      let header = { Token: this.$store.state.token };
      let config = { headers: header };
      axios
        .get("article/list?value=" + this.text, config)
        .then(function (response) {
          me.articles = response.data;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    /**
     * @vuese
     * Method that allows you to see the details of the order.
     * @arg id
     */
    detailsList(id) {
      let me = this;
      let header = { Token: this.$store.state.token };
      let config = { headers: header };
      axios
        .get("order/query?_id=" + id, config)
        .then(function (response) {
          me.details = response.data.details;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    /**
     * @vuese
     * Method that allows you to see the order.
     * @arg item
     */
    seeOrder(item) {
      this.clean();
      this.type_proof = item.type_proof;
      this.serial_proof = item.serial_proof;
      this.number_proof = item.number_proof;
      this.person = item.person._id;
      this.tax = item.tax;
      this.detailsList(item._id);
      this.seeNew = 1;
      this.seeDetail = 1;
    },
    /**
     * @vuese
     * Method that shows the modal of the order.
     */
    showModalArticles() {
      this.dialog = 1;
    },
    /**
     * @vuese
     * Method that outputs a list of all the orders in the database by means of a
     * request to the API.
     */
    list() {
      let me = this;
      let header = { Token: this.$store.state.token };
      let config = { headers: header };
      axios
        .get("order/list", config)
        .then(function (response) {
          me.orders = response.data;
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
      this.type_proof = "";
      this.serial_proof = "";
      this.number_proof = "";
      this.tax = 0.21;
      this.code = "";
      this.total = 0;
      this.subtotal = 0;
      this.totalTax = 0;
      this.details = [];
      this.seeNew = 0;
      this.valida = 0;
      this.validateMessage = [];
      this.seeDetail = 0;
    },
    /**
     * @vuese
     * Method used to validate all the selected fields.
     */
    validator() {
      this.valida = 0;
      this.validateMessage = [];

      if (!this.person) {
        this.validateMessage.push("Select a provider.");
      }
      if (!this.type_proof) {
        this.validateMessage.push("Select a type proof.");
      }
      if (!this.number_proof) {
        this.validateMessage.push("Insert a number proof");
      }
      if (!this.tax || this.tax < 0 || this.tax > 1) {
        this.validateMessage.push("Insert a valid percentage tax");
      }
      if (this.details.length <= 0) {
        this.validateMessage.push("Insert at least one article");
      }
      if (this.validateMessage.length) {
        this.valida = 1;
      }
      return this.valida;
    },
    /**
     * @vuese
     * Method that allow to see the new order modal window.
     */
    showNew() {
      this.seeNew = 1;
    },
    /**
     * @vuese
     * Method that allow to hide the new order modal window.
     */
    hideNew() {
      this.seeNew = 0;
      this.clean();
    },
    /**
     * @vuese
     * Method that saves orders in the database or edits them through an API request.
     */
    save() {
      let me = this;
      let header = { Token: this.$store.state.token };
      let config = { headers: header };
      if (this.validator()) {
        return;
      }
      //Save orders
      axios
        .post(
          "order/add",
          {
            person: this.person,
            user: this.$store.state.user._id,
            type_proof: this.type_proof,
            serial_proof: this.serial_proof,
            number_proof: this.number_proof,
            tax: this.tax,
            total: this.total,
            details: this.details,
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
    },
    /**
     * @vuese
     * Method that displays the modal window when the user clicks on the enable or disable method.
     * @arg action:Number
     * @arg item: Object
     */
    activateDeactivateShow(action, item) {
      this.adModal = 1;
      this.adName = item.number_proof;
      this.adId = item._id;
      if (action == 1) {
        this.adAction = 1;
      } else if (action == 2) {
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
     * Method that approbes an order through an API query.
     */
    activate() {
      let me = this;
      let header = { Token: this.$store.state.token };
      let config = { headers: header };
      axios
        .put("order/activate", { _id: this.adId }, config)
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
     * Method that cancels an order through an API query.
     */
    deactivate() {
      let me = this;
      let header = { Token: this.$store.state.token };
      let config = { headers: header };
      axios
        .put("order/deactivate", { _id: this.adId }, config)
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
     * Method that deletes cancelled orders.
     */
    removeOrders() {
      let me = this;
      let header = { Token: this.$store.state.token };
      let config = { headers: header };
      axios
        .delete("order/removeOrders", config)
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