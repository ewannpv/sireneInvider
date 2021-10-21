export const maxLinesPerFiles = 10;
export const maxFileNumber = 10;
export const csvFilePath = "src/data/StockEtablissement_utf8.csv";
export const csvSampleDir = "src/data/sample/";
export const csvEditedDir = "src/data/edited/";
export const csvSamplePrefix = csvSampleDir + "sample-";
export const csvHeaderFilePath = csvSamplePrefix + '1.csv';
export const csvInformationsNeeded = [
  'siren',
  'nic',
  'siret',
  'dateCreationEtablissement',
  'dateDernierTraitementEtablissement',
  'typeVoieEtablissement',
  'libelleVoieEtablissement',
  'codePostalEtablissement',
  'libelleCommuneEtablissement',
  'codeCommuneEtablissement',
  'dateDebut',
  'etatAdministratifEtablissement',
]