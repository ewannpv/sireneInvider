export const maxLinesPerFiles = 250;
export const maxFileNumber = 10;
export const csvFilePath = "src/data/StockEtablissement_utf8.csv";
export const csvSampleDir = "src/data/sample/";
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