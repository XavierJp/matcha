module.exports = {
  POURVUE: "Pourvue",
  ANNULEE: "Annulée",
  KEY_GENERATOR_PARAMS: ({ length, symbols, numbers }) => {
    return {
      length: length ?? 50,
      strict: true,
      numbers: numbers ?? true,
      symbols: symbols ?? true,
      lowercase: true,
      uppercase: false,
      excludeSimilarCharacters: true,
      exclude: '!"_%£$€*¨^=+~ß(){}[]§;,./:`@#&|<>?"',
    };
  },
  etat_etablissements: {
    ACTIF: "actif",
    FERME: "fermé",
  },
  ENTREPRISE: "ENTREPRISE",
  CFA: "CFA",
  REGEX: {
    SIRET: /^([0-9]{9}|[0-9]{14})$/,
    GEO: /^(-?\d+(\.\d+)?),\s*(-?\d+(\.\d+)?)$/,
    TELEPHONE: /^[0-9]{10}$/,
  },
};
