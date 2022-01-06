<template>
  <v-container>
    <div class="my-3">
      <v-dialog v-model="dialog" max-width="355" persistent>
        <v-container class="d-block">
          <v-row no-gutters justify="space-between" align="center">
            <v-row no-gutters>
              <h3>Add Board</h3>
            </v-row>
            <v-icon @click="dialog = false">mdi-close</v-icon>
          </v-row>
          <v-form ref="form" v-model="valid">
            <div class="d-flex flex-column">
              <v-text-field
                type="text"
                name="title"
                v-model="board.title"
                label="Board title"
                :rules="[(v) => !!v || 'Board title is required']"
                required
              ></v-text-field>
              <v-btn
                v-if="enableColor === false"
                @click="enableColor = true"
                depressed
                >Choose board color
              </v-btn>
              <br />
              <v-color-picker
                v-if="enableColor === true"
                v-model="board.color"
                dot-size="25"
                hide-inputs
                swatches-max-height="100"
              ></v-color-picker>
              <div
                class="d-flex flex-column align-center justify-center upload-block"
                @click="chooseImage"
                :style="`background-image: url('${
                  board.image.downloadURL ? board.image.downloadURL : ''
                }');height: 150px;background-size: cover;background-position: center`"
              >
                <template v-if="!fileToUpload || fileToUpload.progress == 0">
                  <v-icon>mdi-camera</v-icon>
                  <p class="mb-0">Add a board background</p>
                  <input
                    type="file"
                    accept="jpg, jpeg, png"
                    ref="boardBackground"
                    multiple
                    color="#f66f26"
                    buffer-value="0"
                    @click="onFileClicked($event)"
                    @change="onFileSelected($event)"
                    class="d-none"
                  />
                </template>
                <template
                  v-else-if="
                    fileToUpload.progress > 0 && fileToUpload.progress < 100
                  "
                >
                  <div class="text-center">
                    <v-progress-circular
                      :size="50"
                      color="green"
                      indeterminate
                    ></v-progress-circular>
                  </div>
                </template>
              </div>
              <br />
              <v-btn :disabled="!valid" color="primary" @click="createBoard">
                Submit
              </v-btn>
            </div>
          </v-form>
        </v-container>
      </v-dialog>
      <div class="d-flex align-center justify-space-between">
        <h1>My Boards</h1>
        <v-btn small depressed @click="addBoard">ADD BOARD</v-btn>
      </div>
      <div class="d-flex flex-wrap align-center">
        <p v-if="boards.length === 0">You have no boards yet</p>
        <v-card
          :style="
            board.image.downloadURL != ''
              ? `background-image: url(${board.image.downloadURL})`
              : ''
          "
          @click="$router.push('/boards/' + board.id)"
          class="mello-board-title"
          v-for="board in boards"
          :key="board.id"
        >
          <v-card-title
            :style="board.image.downloadURL != '' ? 'color: #ffffff' : ''"
          >
            {{ board.title }}
          </v-card-title>
          <v-card-subtitle
            :style="board.image.downloadURL != '' ? 'color: #ffffff' : ''"
          >
            created {{ board.dateCreated | formatDate }}
          </v-card-subtitle>
        </v-card>
      </div>
      <v-snackbar
        :timeout="3000"
        v-model="snackbar"
        absolute
        bottom
        color="primary"
      >
        {{ snackbarText }}
      </v-snackbar>
    </div>
  </v-container>
</template>

<script>
import { v4 as uuidv4 } from "uuid";
export default {
  async asyncData() {
    let boardRef = $nuxt.$fire.firestore
      .collection("users")
      .doc($nuxt.$fire.auth.currentUser.uid)
      .collection("boards");
    let boardData = [];
    await boardRef
      .get()
      .then((querySnapshot) => {
        if (querySnapshot.docs.length > 0) {
          try {
            for (const doc of querySnapshot.docs) {
              let data = doc.data();
              data.id = doc.id;
              boardData.push(data);
            }
          } catch (err) {}
        }
      })
      .catch((error) => {});
    return { boards: boardData };
  },
  data() {
    return {
      dialog: false,
      enableColor: false,
      snackbar: false,
      valid: false,
      snackbarText: "No error message",
      board: {
        id: 1,
        title: "",
        color: "",
        image: {
          name: "",
          originalName: "",
          downloadURL: "",
          uuid: "",
        },
        dateCreated: "",
      },
      fileToUpload: null,
      currentImageId: "",
    };
  },
  created() {
    let that = this;
    $nuxt.$fire.firestore
      .collection(`users/${$nuxt.$fire.auth.currentUser.uid}/boards/`)
      .onSnapshot((querySnapshot) => {
        if (querySnapshot.docs.length > 0) {
          that.boards = [];
          try {
            for (const doc of querySnapshot.docs) {
              let data = doc.data();
              data.id = doc.id;
              that.boards.push(data);
            }
          } catch (error) {}
        }
      });
  },
  methods: {
    addBoard() {
      this.currentImageId = uuidv4();
      this.dialog = true;
    },

    createBoard() {
      let that = this;
      if (this.$refs.form.validate()) {
        this.board.dateCreated = Date.now();
        this.$fire.firestore
          .collection("users")
          .doc(this.$fire.auth.currentUser.uid)
          .collection("boards")
          .doc(this.currentImageId)
          .set(this.board)
          .then((docRef) => {
            that.dialog = false;
            that.$refs.form.reset();
            that.snackbarText = "Successfully create your board";
            that.snackbar = true;
          })
          .catch((err) => {});
      }
    },

    chooseImage() {
      this.$refs["boardBackground"].click();
    },

    onFileClicked(e) {
      e.target.value = "";
    },

    onFileSelected(event) {
      try {
        let file = event.target.files[0];
        this.fileToUpload = {
          file,
          originalName: file.name,
          loading: false,
          progress: 0,
          success: false,
          error: false,
          previewPath: "",
          uuid: uuidv4(),
        };
        this.uploadFiles();
      } catch (error) {}
    },

    uploadFiles() {
      const itemFileName =
        this.fileToUpload.uuid + "-" + this.fileToUpload.file.name;
      const itemName = `images/${this.$fire.auth.currentUser.uid}/boards/${this.currentImageId}/${itemFileName}`;
      const itemRef = this.$fire.storage.ref().child(itemName);
      const itemMeta = {
        customMetadata: {
          owner: this.$fire.auth.currentUser.uid,
        },
      };

      // action upload
      const task = itemRef.put(this.fileToUpload.file, itemMeta);
      return task.on(
        "state_changed",
        // handle progress
        (progress) => {
          this.fileToUpload.progress =
            (progress.bytesTransferred + progress.totalBytes) * 100;
        },
        // handle unsuccessful
        (error) => {
          this.fileToUpload.failed = true;
          this.fileToUpload.error = error;
          return false;
        },
        // handle successful on complete
        async () => {
          const url = await task.snapshot.ref.getDownloadURL().catch((e) => {});
          this.board.image = {
            name: itemFileName,
            originalName: this.fileToUpload.file.name,
            downloadURL: url,
            uuid: this.fileToUpload.uuid,
          };
        }
      );
    },
  },
};
</script>

<style lang="scss">
.v-dialog {
  border-radius: 15px;
  background-color: $white;
  padding: 15px;
}
.upload-block {
  border: 2px dashed #adadad;
  padding: 30px;
  border-radius: 15px;
  margin-bottom: 20px;
}
</style>
