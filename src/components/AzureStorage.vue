<template>
  <v-container>
    <v-row align="center" justify="space-around">
      <v-btn x-large :loading="isSelecting" @click="onButtonClick">
        Subir archivo
      </v-btn>
      <input
        ref="uploader"
        class="d-none"
        type="file"
        accept="application/pdf"
        @change="onFileChanged"
      />
      <v-btn x-large @click="listFiles"> Listar archivos </v-btn>
    </v-row>
    <!--Archivos-->
    <v-row class="text-center">
      <v-col class="mb-4">
        <h1 class="display-2 font-weight-bold mb-3">
          Archivos
        </h1>
        <v-card class="mx-auto" max-width="300" tile>
          <v-list dense>
            <v-subheader>Archivos</v-subheader>
            <v-list-item-group v-model="selectedItem" color="primary">
              <v-list-item
                v-for="(item, i) in blobs"
                :key="i"
                @click="downloadFile(item)"
              >
                <v-list-item-content>
                  <v-list-item-title v-text="item"></v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script src="./AzureStorage.ts" lang="ts"></script>
