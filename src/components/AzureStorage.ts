import { BlobServiceClient } from "@azure/storage-blob";
//import { generateSasToken } from "./sasToken.js";

const blobSasUrl =
  "http://127.0.0.1:10000/devstoreaccount1/test?sv=2018-03-28&ss=b&srt=sco&sp=racwdl&st=2020-12-29T16%3A40%3A48Z&se=2020-12-30T16%3A45%3A48Z&spr=https%2Chttp&sig=Z1W5%2F1Ef46STfMbCkBTX4KDSXtbvGesnGGFohNMHjSE%3D";
const blobSasUrl2 = "http://127.0.0.1:10000/devstoreaccount1/";
const containerName = "test";

export default {
  name: "AzureStorage",

  data: () => ({
    selectedFile: null,
    isSelecting: false,
    selectedItem: 1,
    blobs: [],
  }),

  computed: {},

  methods: {
    onButtonClick() {
      this.isSelecting = true;
      window.addEventListener(
        "focus",
        () => {
          this.isSelecting = false;
        },
        { once: true }
      );

      this.$refs.uploader.click();
    },

    onFileChanged(e) {
      if (!e.target.files[0].name.includes(".pdf")) {
        alert("Debe ser .pdf");
        return;
      }
      this.selectedFile = e.target.files[0];
      this.uploadFile();
    },
    
    async uploadFile() {
      const blobServiceClient = new BlobServiceClient(blobSasUrl);
      const containerClient = blobServiceClient.getContainerClient(containerName);
      var now = new Date();
      var date = [now.getMonth() + 1, now.getDate(), now.getFullYear()];
      var time = [now.getHours(), now.getMinutes(), now.getSeconds()];
      var dates = date.join("") + "_" + time.join("") + ".pdf";
      try {
        console.log("Uploading file");
        const promises = [];
        console.log(this.selectedFile);
        const blockBlobClient = containerClient.getBlockBlobClient(dates);
        promises.push(blockBlobClient.uploadBrowserData(this.selectedFile));

        await Promise.all(promises);
        alert("Done.");
        this.listFiles();
      } catch (error) {
        alert(error.message);
      }
    },

    async listFiles() {
      //generateSasToken();
      this.blobs = [];
      const blobServiceClient = new BlobServiceClient(blobSasUrl2);
      const containerClient = blobServiceClient.getContainerClient(containerName);

      /*let i = 1;
      let iter = await containerClient.listBlobsFlat();
      console.log(iter);
      for await (const blob of iter) {
        console.log(`Blob ${i++}: ${blob.name}`);
        this.blobs.push(blob.name);
      }
      console.log(this.blobs);*/

      let iter2 = containerClient.listBlobsByHierarchy("/", { prefix: "test/" });
      let entity = await iter2.next();
      while (!entity.done) {
        let item = entity.value;
        if (item.kind === "prefix") {
          console.log(`\tBlobPrefix: ${item.name}`);
        } else {
          console.log(`\tBlobItem: name - ${item.name}, last modified - ${item.properties.lastModified}`);
          this.blobs.push(item.name);
        }
        entity = await iter2.next();
      }

    },

    async downloadFile(blob) {
      const blobServiceClient = new BlobServiceClient(blobSasUrl2);
      const containerClient = blobServiceClient.getContainerClient(
        containerName
      );
      try {
        const blobName = blob;
        const blobClient = containerClient.getBlockBlobClient(blobName);
        const downloadBlockBlobResponse = await blobClient.download();
        const fileURL = URL.createObjectURL(
          await downloadBlockBlobResponse.blobBody
        );
        const link = document.createElement("a");
        link.href = fileURL;
        link.download = blobName;
        link.click();
        console.log("Done.");
      } catch (error) {
        console.log(error.message);
      }
    }
  },
};
