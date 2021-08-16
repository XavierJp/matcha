import { CloseCircleLine, SearchLine } from '../../theme/components/icons'

const filters = ['searchFormulaire', 'statutFilter', 'siretFilter', 'libelleFilter', 'origineFilter', 'niveauFilter']

const facetDefinition = [
  {
    componentId: `statutFilter`,
    dataField: 'offres.statut.keyword',
    nestedField: 'offres',
    title: 'Statut(s)',
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
    title: 'Libelle(s)',
    filterLabel: 'Libelle(s)',
    sortBy: 'asc',
    helpTextSection: '',
    showSearch: true,
    showCount: true,
  },
  {
    componentId: `niveauFilter`,
    dataField: 'offres.niveau.keyword',
    nestedField: 'offres',
    title: 'Niveau(s)',
    filterLabel: 'Niveau(s)',
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
    sortBy: 'asc',
    helpTextSection: '',
    showSearch: true,
    showCount: true,
  },
]

const dataSearchDefinition = {
  componentId: 'searchFormulaire',
  dataField: ['raison_sociale', 'siret', 'nom', 'prenom', 'email'],
  fieldWeights: [4, 1, 2, 2, 3],
  // URLParams: true,
  queryFormat: 'and',
  placeholder: "Rechercher par nom d'entreprise, siret, nom, prénom ou email",
  showClear: true,
  clearIcon: <CloseCircleLine boxSize={4} />,
  icon: <SearchLine color='bluefrance.500' boxSize={5} />,
}

export default { filters, facetDefinition, dataSearchDefinition }
