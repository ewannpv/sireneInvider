export const maxLinesPerFiles = 1000;
export const maxFileNumber = 999;
export const chunkSize = 64 * 1024 * 1024;
export const csvFilePath = "src/data/StockEtablissement_utf8.csv";
export const csvSampleDir = "src/data/sample/";
export const csvEditedDir = "src/data/edited/";
export const csvSamplePrefix = csvSampleDir + "sample-";
export const csvInformationsNeeded = [
  "siren",
  "nic",
  "siret",
  "dateCreationEtablissement",
  "dateDernierTraitementEtablissement",
  "typeVoieEtablissement",
  "libelleVoieEtablissement",
  "codePostalEtablissement",
  "libelleCommuneEtablissement",
  "codeCommuneEtablissement",
  "dateDebut",
  "etatAdministratifEtablissement",
];
