async function generateSasToken() {   
      
  
    try {
      var storage = require("azure-storage")
      var startDate = new Date();
      var expiryDate = new Date();
      startDate.setTime(startDate.getTime() - 5*60*1000);
      expiryDate.setTime(expiryDate.getTime() + 24*60*60*1000);
      var AccountSasConstants = storage.Constants.AccountSasConstants;
      var sharedAccessPolicy = {
        AccessPolicy: {
          Services: AccountSasConstants.Services.BLOB ,
          ResourceTypes: AccountSasConstants.Resources.SERVICE + 
                         AccountSasConstants.Resources.CONTAINER +
                         AccountSasConstants.Resources.OBJECT,
          Permissions: AccountSasConstants.Permissions.READ + 
                       AccountSasConstants.Permissions.ADD +
                       AccountSasConstants.Permissions.CREATE +
                       AccountSasConstants.Permissions.WRITE +
                       AccountSasConstants.Permissions.DELETE +
                       AccountSasConstants.Permissions.LIST,
          Protocols: AccountSasConstants.Protocols.HTTPSORHTTP,
          Start: startDate,
          Expiry: expiryDate
        }
        
      };
      const accountname ="devstoreaccount1";
      const key = "Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==";
      var sas =storage.generateAccountSharedAccessSignature(accountname,key,sharedAccessPolicy);
      console.log(sas);
      return sas;
    } catch (error) {
        console.log(error);
    }
}
export { generateSasToken }