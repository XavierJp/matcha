import { escapeDiacritics } from '../../common/utils/downloadUtils'
import { CloseCircleLine, SearchLine } from '../../theme/components/icons'
import moment from 'moment'

const filters = [
  'searchFormulaire',
  'statutFilter',
  'siretFilter',
  'libelleFilter',
  'origineFilter',
  'niveauFilter',
  'contratFilter',
]
const excludedFields = ['events', 'mailing']

const exportableColumns = [
  {
    Header: 'Raison Social',
    accessor: 'raison_sociale',
    exportable: true,
    formatter: (value) => escapeDiacritics(value),
  },
  {
    Header: 'Siret',
    accessor: 'siret',
    exportable: true,
  },
  {
    Header: 'Adresse Postal',
    accessor: 'adresse',
    exportable: true,
    formatter: (value) => escapeDiacritics(value),
  },
  {
    Header: 'Prenom',
    accessor: 'prenom',
    exportable: true,
    formatter: (value) => escapeDiacritics(value),
  },
  {
    Header: 'Nom',
    accessor: 'nom',
    exportable: true,
    formatter: (value) => escapeDiacritics(value),
  },
  {
    Header: 'Telephone',
    accessor: 'telephone',
    exportable: true,
  },
  {
    Header: 'Email',
    accessor: 'email',
    exportable: true,
  },
  {
    Header: 'Origine',
    accessor: 'origine',
    exportable: true,
  },
  {
    Header: 'Statut',
    accessor: 'offres',
    exportable: true,
    formatter: (values) => {
      return values.map((x, i) => {
        return {
          Statut: escapeDiacritics(x.statut),
          Type: escapeDiacritics(x.type),
          Metier: escapeDiacritics(x.libelle),
          Niveau: escapeDiacritics(x.niveau),
          Date_debut_apprentissage: x.date_debut_apprentissage
            ? moment(x.date_debut_apprentissage).format('YYYY-MM-DD')
            : 'NA',
          Date_expiration: moment(x.date_expiration).format('YYYY-MM-DD'),
        }
      })
    },
  },
  {
    Header: 'Type de contrat',
    accessor: 'offres.type',
    exportable: true,
    formatter: (value) => escapeDiacritics(value),
  },
  {
    Header: 'Metier',
    accessor: 'offres.libelle',
    exportable: true,
    formatter: (value) => escapeDiacritics(value),
  },
  {
    Header: 'Niveau',
    accessor: 'offres.niveau',
    exportable: true,
    formatter: (value) => escapeDiacritics(value),
  },
  {
    Header: "Date de debut d'apprentissage",
    accessor: 'offres.date_debut_apprentissage',
    exportable: true,
    formatter: (value) => moment(value).format('YYYY-MM-DD'),
  },
  {
    Header: "Date d'expiration",
    accessor: 'offres.date_expiration',
    exportable: true,
    formatter: (value) => moment(value).format('YYYY-MM-DD'),
  },
]

const facetDefinition = [
  {
    componentId: `statutFilter`,
    dataField: 'offres.statut.keyword',
    nestedField: 'offres',
    title: 'Statut(s) de(s) offre(s)',
    filterLabel: 'Statut(s)',
    sortBy: 'asc',
    helpTextSection: '',
    showSearch: false,
    showCount: true,
  },
  {
    componentId: `siretFilter`,
    dataField: 'siret.keyword',
    title: 'Siret(s)',
    filterLabel: 'Siret(s)',
    sortBy: 'asc',
    helpTextSection: '',
    showSearch: true,
    showCount: true,
  },
  {
    componentId: `libelleFilter`,
    dataField: 'offres.libelle.keyword',
    nestedField: 'offres',
    title: 'Métier(s)',
    filterLabel: 'Métier(s)',
    sortBy: 'asc',
    helpTextSection: '',
    showSearch: true,
    showCount: true,
  },
  {
    componentId: `niveauFilter`,
    dataField: 'offres.niveau.keyword',
    nestedField: 'offres',
    title: 'Niveau(x)',
    filterLabel: 'Niveau(x)',
    sortBy: 'asc',
    helpTextSection: '',
    showSearch: false,
    showCount: true,
  },
  {
    componentId: `contratFilter`,
    dataField: 'offres.type.keyword',
    nestedField: 'offres',
    title: 'Type(s) de contrat',
    filterLabel: 'Type(s) de contrat',
    sortBy: 'asc',
    helpTextSection: '',
    showSearch: false,
    showCount: true,
  },
  {
    componentId: `origineFilter`,
    dataField: 'origine.keyword',
    title: 'Origine(s)',
    filterLabel: 'Origine(s)',
    selectAllLabel: 'Toutes',
    sortBy: 'asc',
    helpTextSection: '',
    showSearch: true,
    showCount: true,
  },
]

const dataSearchDefinition = {
  componentId: 'searchFormulaire',
  dataField: ['raison_sociale', 'siret', 'email'],
  fieldWeights: [4, 2, 2],
  excludeFields: excludedFields,
  queryFormat: 'and',
  placeholder: "Rechercher par nom d'entreprise, siret ou email",
  showClear: true,
  clearIcon: <CloseCircleLine boxSize={4} />,
  icon: <SearchLine color='bluefrance.500' boxSize={5} />,
  debounce: 1000,
}

export default { filters, facetDefinition, dataSearchDefinition, exportableColumns, excludedFields }
