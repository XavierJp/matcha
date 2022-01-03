import { memo, useEffect } from 'react'
import { ReactiveBase, DataSearch, ReactiveList, SelectedFilters } from '@appbaseio/reactivesearch'
import { Layout } from '../../components'
import {
  Badge,
  Box,
  Container,
  Flex,
  Grid,
  GridItem,
  Text,
  Button,
  Link,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  useToast,
  Stack,
} from '@chakra-ui/react'
import { NavLink, useLocation, useHistory } from 'react-router-dom'

import constants from './admin.constants'
import Facet from '../../components/Facet/Facet'

import './search.css'

import { Edit2Fill, ExclamationCircle, BlocNote } from '../../theme/components/icons'
import useAuth from '../../common/hooks/useAuth'
import ExportButton from '../../components/ExportButton/ExportButton'
import EmptySpace from './components/EmptySpace'
import { willExpire } from '../../common/utils/dateUtils'

export default memo(() => {
  const { filters, facetDefinition, dataSearchDefinition, exportableColumns, excludedFields } = constants
  const [auth] = useAuth()
  const location = useLocation()
  const history = useHistory()
  const toast = useToast()

  useEffect(() => {
    if (location.state?.newUser) {
      toast({
        title: 'Vérification réussi',
        description: 'Votre adresse mail a été validé avec succès.',
        position: 'top-right',
        status: 'success',
        duration: 7000,
        isClosable: true,
      })
    }
  }, [])

  const queryFilter = () => {
    if (auth.scope === 'all') return {}

    return {
      query: {
        match_phrase_prefix: {
          origine: auth.scope,
        },
      },
    }

    // return {
    //   query: {
    //     regexp: {
    //       origine: { value: `${auth.scope}*`, flags: 'ALL', case_insensitive: true, max_determinized_states: 100000 },
    //     },
    //   },
    // }
  }

  return (
    <Layout background='beige'>
      <Container maxW='container.xl' py={4}>
        <Flex justifyContent='space-between' alignItems='center'>
          <Breadcrumb spacing='4px' textStyle='xs' mb={3}>
            <BreadcrumbItem isCurrentPage>
              <BreadcrumbLink href='#' textStyle='xs'>
                Administration des offres
              </BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>

          <Button
            variant='primary'
            size='sm'
            mr={3}
            onClick={() =>
              history.push(`/${auth.scope === 'all' ? 'matcha' : auth.scope}/`, {
                mandataire: true,
                gestionnaire: auth.siret,
              })
            }
          >
            Nouvelle entreprise
          </Button>
        </Flex>
        <div className='search-page'>
          <ReactiveBase url={`${process.env.REACT_APP_BASE_URL}/es/search`} app='formulaires'>
            <Grid templateColumns='1fr 3fr' gap={3} pt={3}>
              <GridItem>
                <Text fontWeight='700'>RECHERCHER</Text>
              </GridItem>
              <GridItem sx={{ margin: '0 .7em' }}>
                <div className='search-container'>
                  <DataSearch {...dataSearchDefinition} defaultQuery={queryFilter} />
                </div>
              </GridItem>
              <GridItem>
                <Text fontWeight='700'>FILTRER</Text>
                {auth.permissions.isAdmin
                  ? facetDefinition.map((f, i) => {
                      return (
                        <Facet
                          key={i}
                          title={f.title}
                          filterLabel={f.filterLabel}
                          filters={filters}
                          selectAllLabel={f.selectAllLabel}
                          sortBy={f.sortBy}
                          componentId={f.componentId}
                          dataField={f.dataField}
                          nestedField={f.nestedField}
                          showSearch={f.showSearch}
                          showCount={f.showCount}
                          defaultQuery={queryFilter}
                          excludeFields={excludedFields}
                        />
                      )
                    })
                  : facetDefinition
                      .filter((x) => x.componentId !== 'origineFilter')
                      .map((f, i) => {
                        return (
                          <Facet
                            key={i}
                            title={f.title}
                            filterLabel={f.filterLabel}
                            filters={filters}
                            selectAllLabel={f.selectAllLabel}
                            sortBy={f.sortBy}
                            componentId={f.componentId}
                            dataField={f.dataField}
                            nestedField={f.nestedField}
                            showSearch={f.showSearch}
                            showCount={f.showCount}
                            defaultQuery={queryFilter}
                            excludeFields={excludedFields}
                          />
                        )
                      })}
              </GridItem>
              <GridItem m={3}>
                <SelectedFilters clearAllLabel='Supprimer tous' />
                <ReactiveList
                  componentId='resultsFormulaire'
                  dataField='_id'
                  pagination={true}
                  innerClass={{ pagination: 'search-pagination' }}
                  loader='Chargement des résultats..'
                  size={5}
                  react={{
                    and: filters,
                  }}
                  excludeFields={excludedFields}
                  defaultQuery={queryFilter}
                  scrollOnChange={false}
                  URLParams={true}
                  renderNoResults={() => <EmptySpace />}
                  renderResultStats={(stats) => {
                    return (
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          flexGrow: '1',
                        }}
                      >
                        <Text fontSize='sm'>
                          {stats.displayedResults} formulaires sur {stats.numberOfResults}
                        </Text>
                        <ExportButton
                          index='formulaires'
                          filters={filters}
                          defaultQuery={queryFilter}
                          columns={exportableColumns
                            .filter((c) => c.exportable)
                            .map((c) => ({ header: c.Header, fieldName: c.accessor, formatter: c.formatter }))}
                        />
                      </div>
                    )
                  }}
                  renderItem={({ offres, ...formulaire }) => {
                    let active = offres.filter((x) => x.statut === 'Active')
                    let expire = offres.filter((x) => {
                      if (x.statut === 'Active') {
                        return willExpire(x.date_expiration)
                      }
                    })

                    return (
                      <Link as={NavLink} to={`/formulaire/${formulaire.id_form}`} variant='card' key={formulaire._id}>
                        <Box bg='none' key={formulaire._id}>
                          <Flex
                            key={formulaire._id}
                            textStyle='sm'
                            justifyContent='space-between'
                            alignItems='flex-start'
                          >
                            <Box>
                              <Badge
                                sx={{
                                  backgroundColor: '#E3E3FD',
                                  borderRadius: '8px',
                                  paddingX: '10px',
                                  marginBottom: '8px',
                                }}
                              >
                                {formulaire.raison_sociale}
                              </Badge>
                              <Text fontSize='16px' variant='outline'>
                                SIRET: {formulaire.siret}
                              </Text>
                            </Box>
                            <Flex align='center'>
                              <Edit2Fill mr={3} color='bluefrance.500' />
                              <Link
                                fontSize='16px'
                                as={NavLink}
                                to={`/formulaire/${formulaire.id_form}`}
                                color='bluefrance.500'
                              >
                                Voir les offres
                              </Link>
                            </Flex>
                          </Flex>
                          <Stack direction='row' spacing={3} mt={10}>
                            <Flex align='center'>
                              <BlocNote color='bluefrance.500' w='18px' h='20px' mr={2} />
                              <Text pr={1} fontWeight={700}>
                                {active.length} offres
                              </Text>
                              <Text> actuellement en ligne</Text>
                            </Flex>
                            <Flex align='center'>
                              <ExclamationCircle color='bluefrance.500' mr={2} w='20px' h='20px' />
                              <Text pr={1} fontWeight={700}>
                                {expire.length} offres
                              </Text>
                              <Text> expirent bientôt</Text>
                            </Flex>
                          </Stack>
                        </Box>
                      </Link>
                    )
                  }}
                />
              </GridItem>
            </Grid>
          </ReactiveBase>
        </div>
      </Container>
    </Layout>
  )
})
