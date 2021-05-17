<template>
  <v-layout align-start>
    <v-flex>
      <v-toolbar flat color="white">
        <v-btn @click="pdfCreator()">
          <v-icon>print</v-icon>
        </v-btn>
        <v-toolbar-title>Articles</v-toolbar-title>
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
                  <v-flex xs12 sm6 md6>
                    <v-text-field v-model="code" label="Code"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6 md6>
                    <v-select
                      v-model="categorie"
                      :items="categories"
                      label="Categorie"
                    >
                    </v-select>
                  </v-flex>
                  <v-flex xs12 sm12 md12>
                    <v-text-field v-model="name" label="Name"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6 md6>
                    <v-text-field
                      type="number"
                      v-model="stock"
                      label="Stock"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6 md6>
                    <v-text-field v-model="pvp" label="PVP"></v-text-field>
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
              Activate Article
            </v-card-title>
            <v-card-title class="headline" v-if="adAction == 2">
              Deactivate Article
            </v-card-title>
            <v-card-text>
              You are going to
              <span v-if="adAction == 1"><strong>Activate</strong> </span>
              <span v-if="adAction == 2"><strong>Deactivate</strong> </span> the
              article <strong>{{ adName }}</strong>
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
      <v-btn color="error" danger class="mb-2" @click="removeArticles()"
        >Delete discontinued articles</v-btn
      >

      <v-data-table
        :headers="headers"
        :items="articles"
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
      articles: [],
      headers: [
        { text: "Options", value: "options", sortable: false },
        { text: "Code", value: "code", sortable: false },
        { text: "Name", value: "name", sortable: true },
        { text: "Categorie", value: "categorie.name", sortable: true },
        { text: "Stock", value: "stock", sortable: false },
        { text: "PVP", value: "pvp", sortable: false },
        { text: "Description", value: "description", sortable: false },
        { text: "Status", value: "status", sortable: false },
      ],
      editedIndex: -1,
      _id: "",
      categorie: "",
      categories: [],
      code: "",
      name: "",
      stock: "",
      pvp: "",
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
    this.selectCategorie();
  },
  methods: {
    /**
     * @vuese
     * Method that creates a PDF document based on the properties of the Article object.
     */
    pdfCreator() {
      var columns = [
        { title: "Name", dataKey: "name" },
        { title: "Code", dataKey: "code" },
        { title: "Categorie", dataKey: "categorie" },
        { title: "Stock", dataKey: "stock" },
        { title: "PVP", dataKey: "pvp" },
      ];
      var rows = [];
      this.articles.map(function (x) {
        rows.push({
          name: x.name,
          code: x.code,
          categorie: x.categorie.name,
          stock: x.stock,
          pvp: x.pvp,
        });
      });
      var doc = new jsPDF("p", "pt");
      doc.autoTable(columns, rows, {
        margin: { top: 60 },
        addPageContent: function (data) {
          doc.text("Articles List", 40, 30);
        },
      });
      doc.save("articles.pdf");
    },
    /**
     * @vuese
     * Method that selects the category of the article from a query to the
     * API from the database and store the categories in an array.
     */
    selectCategorie() {
      let me = this;
      let arrayCategories = [];
      let header = { Token: this.$store.state.token };
      let config = { headers: header };
      axios
        .get("categorie/list", config)
        .then(function (response) {
          arrayCategories = response.data;
          arrayCategories.map(function (x) {
            me.categories.push({ text: x.name, value: x._id });
          });
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    /**
     * @vuese
     * Method that outputs a list of all the articles in the database by means of a
     * request to the API.
     */
    list() {
      let me = this;
      let header = { Token: this.$store.state.token };
      let config = { headers: header };
      axios
        .get("article/list", config)
        .then(function (response) {
          me.articles = response.data;
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
      this.code = "";
      this.stock = 0;
      this.pvp = 0;
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
      if (!this.categorie) {
        this.validateMessage.push("Select the categorie");
      }
      if (this.code.length > 64) {
        this.validateMessage.push("Code musn´t have more than 64 characters");
      }
      if (this.name.length < 1 || this.name.length > 50) {
        this.validateMessage.push(
          "The article name must have 1-50 characters."
        );
      }
      if (this.description.length > 255) {
        this.validateMessage.push(
          "The description mustn´t have more than 255 characters."
        );
      }
      if (this.stock < 0) {
        this.validateMessage.push("Introduce a valid stock");
      }
      if (this.pvp < 0) {
        this.validateMessage.push("Introduce a valid price");
      }
      if (this.validateMessage.length) {
        this.valida = 1;
      }
      return this.valida;
    },
    /**
     * @vuese
     * Method that saves articles in the database or edits them through an API request.
     */
    save() {
      let me = this;
      let header = { Token: this.$store.state.token };
      let config = { headers: header };
      if (this.validator()) {
        return;
      }
      if (this.editedIndex > -1) {
        //Edit article
        axios
          .put(
            "article/update",
            {
              _id: this._id,
              categorie: this.categorie,
              code: this.code,
              name: this.name,
              stock: this.stock,
              pvp: this.pvp,
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
        //Save article
        axios
          .post(
            "article/add",
            {
              categorie: this.categorie,
              code: this.code,
              name: this.name,
              stock: this.stock,
              pvp: this.pvp,
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
     * Method that assigns the properties of the Article object so that they can be edited.
     * @arg item:Object
     */
    editItem(item) {
      this._id = item._id;
      this.categorie = item.categorie._id;
      this.code = item.code;
      this.name = item.name;
      this.stock = item.stock;
      this.pvp = item.pvp;
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
    activateDeactivateShow(action, item) {
      this.adModal = 1;
      this.adName = item.name;
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
     * Method that activates an article through an API query.
     */
    activate() {
      let me = this;
      let header = { Token: this.$store.state.token };
      let config = { headers: header };
      axios
        .put("article/activate", { _id: this.adId }, config)
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
     * Method that discontinue an article through an API query.
     */
    deactivate() {
      let me = this;
      let header = { Token: this.$store.state.token };
      let config = { headers: header };
      axios
        .put("article/deactivate", { _id: this.adId }, config)
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
     * Method that deletes all the inactive articles.
     */
    removeArticles() {
      let me = this;
      let header = { Token: this.$store.state.token };
      let config = { headers: header };
      axios
        .delete("article/removeArticles", config)
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
