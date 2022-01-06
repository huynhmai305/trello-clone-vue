<template>
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
        <v-btn color="red darken-1" text @click="$emit('deleteCard')">
          Delete
        </v-btn>
        <v-btn color="blue darken-1" text @click="dialogEditCard = false">
          Close
        </v-btn>
        <v-btn color="blue darken-2" text @click="$emit('updateCard')">
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: ["currentCard", "dialogEditCard"],
};
</script>

<style></style>
