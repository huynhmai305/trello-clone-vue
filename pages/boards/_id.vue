<template>
  <div
    class="d-flex flex-column board"
    :style="
      board.image.downloadURL != ''
        ? `background-image: url(${board.image.downloadURL});background-size:cover;background-position:center center;`
        : board.color
        ? `background-color: ${board.color}`
        : ''
    "
  >
    <div class="d-flex align-center">
      <h1
        :style="board.image.downloadURL != '' ? `color: #fff` : ''"
        class="mr-6"
      >
        {{ board.title }}
      </h1>
      <v-icon
        @click="deleteBoard()"
        :style="board.image.downloadURL != '' ? `color: #fff` : ''"
      >
        mdi-delete-outline
      </v-icon>
    </div>
    <small :style="board.image.downloadURL != '' ? `color: #fff` : ''"
      >created {{ board.dateCreated | formatDate }}</small
    >
    <div class="d-flex pr-6 pt-3">
      <div class="d-flex pr-6">
        <div
          v-for="list in board.lists"
          :key="list.id"
          class="d-flex flex-column pr-6 list"
          @drop="drop($event, list.id)"
          @dragover="allowDrop($event)"
        >
          <div class="d-flex justify-space-between">
            <h4>{{ list.title }}</h4>
            <v-icon small @click="deleteList(list.id)">
              mdi-delete-outline
            </v-icon>
          </div>
          <v-card
            v-for="card in list.cards"
            :key="card.id"
            class="mt-3"
            @click="editCard(card)"
            :draggable="true"
            @dragover.prevent
            @dragstart="drag($event, card)"
          >
            <v-card-text>{{ card.title }}</v-card-text>
          </v-card>
          <!-- <dialog-card-edit
            :dialogEditCard="dialogEditCard"
            :currentCard="currentCard"
            @updateCard="updateCard()"
            @deleteCard="deleteCard()"
          /> -->
          <v-dialog v-model="dialogEditCard" persistent max-width="600px">
            <v-card elevation="0">
              <v-card-title>
                <span class="headline">{{ currentCard.title }}</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field
                        label="Edit title"
                        v-model="currentCard.title"
                        required
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="red darken-1" text @click="deleteCard()">
                  Delete
                </v-btn>
                <v-btn
                  color="blue darken-1"
                  text
                  @click="dialogEditCard = false"
                >
                  Close
                </v-btn>
                <v-btn color="blue darken-2" text @click="updateCard()">
                  Save
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-btn
            depressed
            class="mt-auto"
            @click="
              dialogCard = true;
              listId = list.id;
            "
          >
            Add card
          </v-btn>
          <dialog-card
            :dialogCard="dialogCard"
            :card="card"
            @createCard="createCard()"
          />
        </div>
      </div>
      <v-btn depressed @click="dialog = true" class="create-list">
        CREATE NEW LIST
      </v-btn>
      <dialog-list :dialog="dialog" :list="list" @createList="createList()" />
    </div>
  </div>
</template>

<script>
import { v4 as uuidv4 } from "uuid";
import DialogList from "@/components/DialogList";
import DialogCard from "@/components/DialogCard";
import DialogCardEdit from "@/components/DialogCardEdit";
// import { List, Card } from "@/types"
export default {
  components: {
    DialogList,
    DialogCard,
    DialogCardEdit,
  },
  data() {
    return {
      listId: "",
      list: {
        title: "",
      },
      card: {
        title: "",
      },
      currentCard: {},
      cardDraggedId: "",
      cardDraggedListId: "",
      dialog: false,
      dialogCard: false,
      dialogEditCard: false,
      drawer: false,
    };
  },

  async asyncData({ params }) {
    let boardRef = $nuxt.$fire.firestore
      .collection("users")
      .doc($nuxt.$fire.auth.currentUser.uid)
      .collection("boards")
      .doc(params.id);
    let boardData = {};
    await boardRef
      .get()
      .then((doc) => {
        if (doc.exists) {
          boardData = doc.data();
          boardData.id = doc.id;
        }
      })
      .catch((err) => {});
    return { board: boardData };
  },

  created() {
    let that = this;
    let tempId = this.board.id;
    let boardRef = $nuxt.$fire.firestore
      .collection("users")
      .doc($nuxt.$fire.auth.currentUser.uid)
      .collection("boards")
      .doc(tempId)
      .onSnapshot((doc) => {
        if (doc.exists) {
          that.board = doc.data();
          that.board.id = tempId;
        }
      });
  },

  methods: {
    allowDrop(e) {
      e.preventDefault();
    },

    drag(e, card) {
      this.currentCard = card;
    },

    drop(e, listId) {
      e.preventDefault();
      this.updateCardList(listId);
    },

    async updateCardList(newListId) {
      let that = this;
      let tempListIndex = -1;
      let tempCardIndex = -1;
      let newListIndex = -1;
      let tempListCount = 0;
      let tempCardCount = 0;

      for (const list of that.board.lists) {
        if (list.id === newListId) {
          newListIndex = tempListCount;
        }

        if (list.id === that.currentCard.listId) {
          tempListIndex = tempListCount;
          for (const card of list.cards) {
            if (card.id === that.currentCard.id) {
              tempCardIndex = tempCardCount;
            }
            tempCardCount++;
          }
        }
        tempListCount++;
      }

      // remove current card from current list
      that.board.lists[tempListIndex].cards.splice(tempCardIndex, 1);
      // add current card to new list
      that.currentCard.listId = newListId;
      that.board.lists[newListIndex].cards.push(that.currentCard);

      await that.updateBoard();
    },

    async deleteBoard() {
      let that = this;
      try {
        await that.$fire.firestore
          .collection("users")
          .doc(that.$fire.auth.currentUser.uid)
          .collection("boards")
          .doc(that.board.id)
          .delete()
          .then(() => {
            $nuxt.$router.push("/");
          })
          .catch((err) => {});
      } catch (error) {
        $nuxt.$router.push("/");
      }
    },

    async updateBoard() {
      let that = this;
      await that.$fire.firestore
        .collection("users")
        .doc(that.$fire.auth.currentUser.uid)
        .collection("boards")
        .doc(that.board.id)
        .update(that.board, { merge: true });
    },

    async createList() {
      let that = this;
      that.dialog = false;
      if (that.list.title != "") {
        that.list.id = uuidv4();
        that.list.cards = [];
        that.list.dateCreated = Date.now();
        if (that.board.lists) {
          that.board.lists.push(that.list);
        } else {
          that.board.lists = [];
          that.board.lists.push(that.list);
        }
        await that.updateBoard();
        that.list = {};
      }
    },

    async deleteList(listId) {
      let that = this;
      let index = -1;
      let count = 0;
      for (const list of that.board.lists) {
        if (list.id === listId) {
          index = count;
        }
        count++;
      }
      if (index > -1) {
        that.board.lists.splice(index, 1);
        await that.updateBoard();
      }
    },

    async createCard() {
      let that = this;
      that.dialogCard = false;
      if (that.card.title != "") {
        that.card.id = uuidv4();
        that.card.dateCreated = Date.now();
        that.card.listId = that.listId;
        if (that.board.lists) {
          let index = -1;
          let count = 0;
          for (const list of that.board.lists) {
            if (list.id === that.listId) {
              index = count;
            }
            count++;
          }
          if (index != -1) {
            if (that.board.lists[index].cards) {
              that.board.lists[index].cards.push(that.card);
            } else {
              that.board.lists[index].cards = [];
              that.board.lists[index].cards.push(that.card);
            }
          }
        }
        await that.updateBoard();
        that.card = {};
        that.listId = "";
      }
    },

    editCard(card) {
      this.dialogEditCard = true;
      this.currentCard = card;
    },

    async updateCard() {
      let that = this;
      that.dialogEditCard = false;
      for (const list of that.board.lists) {
        if (list.id == that.currentCard.listId) {
          for (const card of list.cards) {
            if (card.id === that.currentCard.id) {
              card = that.currentCard;
            }
          }
        }
      }
      await that.updateBoard();
    },

    async deleteCard() {
      let that = this;
      that.dialogEditCard = false;
      let i = 0;
      let j = 0;
      let index = {
        list: -1,
        card: -1,
      };
      for (const list of that.board.lists) {
        if (list.id == that.currentCard.listId) {
          for (const card of list.cards) {
            if (card.id === that.currentCard.id) {
              index.list = i;
              index.card = j;
            }
            j++;
          }
        }
        i++;
      }
      if (index.list > -1) {
        that.board.lists[index.list].cards.splice(index.card, 1);
        await that.updateBoard();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.board {
  padding: 12px;
  height: 100vh;
  overflow: scroll;
  .list {
    min-width: 250px;
    background-color: rgb(228 228 228 / 35%);
    padding: 25px;
    height: 500px;
    border-radius: 10px;
    margin-right: 10px;
  }
}
</style>
