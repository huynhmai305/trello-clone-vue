<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <v-card elevation="0">
      <v-card-title>
        <span class="headline">List name</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-text-field
                label="Stuff to do"
                v-model="list.title"
                required
              ></v-text-field>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="dialog = false">
          Close
        </v-btn>
        <v-btn color="blue darken-2" text @click="$emit('createList')"
          >Save</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: ["dialog", "list"],
};
</script>

<style></style>
