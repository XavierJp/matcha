import { DataSearch, ReactiveBase, ReactiveList, SelectedFilters } from '@appbaseio/reactivesearch'
import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Container,
  Flex,
  Grid,
  GridItem,
  Heading,
  Link,
  Stack,
  Text,
  useToast,
} from '@chakra-ui/react'
import { memo, useEffect, useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import useAuth from '../../common/hooks/useAuth'
import { willExpire } from '../../common/utils/dateUtils'
import { AnimationContainer, Layout } from '../../components'
import ExportButton from '../../components/ExportButton/ExportButton'
import Facet from '../../components/Facet/Facet'
import { BlocNote, Edit2Fill, ExclamationCircle } from '../../theme/components/icons'
import constants from './admin.constants'
import EmptySpace from './components/EmptySpace'
import './search.css'

export default memo(() => {
  const { filters, facetDefinition, dataSearchDefinition, exportableColumns, excludedFields } = constants
  const [filterVisible, setFilterVisible] = useState()
  const [auth] = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
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
  }

  return (
    <AnimationContainer>
      <Layout background='beige'>
        <Container maxW='container.xl' py={4}>
          <Flex justifyContent='space-between' alignItems='center'>
            <Breadcrumb spacing='4px' textStyle='xs'>
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
              onClick={() => navigate(`/${auth.scope === 'all' ? 'matcha' : auth.scope}/`)}
            >
              Nouvelle entreprise
            </Button>
          </Flex>
          <div className='search-page'>
            <ReactiveBase url={`${process.env.REACT_APP_BASE_URL}/es/search`} app='formulaires'>
              <Grid templateColumns={filterVisible ? '1fr 3fr' : '1fr'} gap={3} pt={3}>
                {filterVisible && (
                  <>
                    <GridItem>
                      <Text fontWeight='700'>RECHERCHER</Text>
                    </GridItem>
                    <GridItem sx={{ margin: '0 .7em' }}>
                      <div className='search-container'>
                        <DataSearch {...dataSearchDefinition} defaultQuery={queryFilter} />
                      </div>
                    </GridItem>
                  </>
                )}
                {filterVisible && (
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
                )}
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
                    renderNoResults={() => {
                      setFilterVisible(false)
                      return <EmptySpace />
                    }}
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
                      setFilterVisible(true)

                      let active = offres.filter((x) => x.statut === 'Active').length
                      let expire = offres.filter((x) => {
                        if (x.statut === 'Active') {
                          return willExpire(x.date_expiration)
                        }
                      }).length

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
                                <Heading textStyle='h3' size='md' pb={2}>
                                  {formulaire.raison_sociale}
                                </Heading>
                                <Text fontSize='16px' variant='outline'>
                                  SIRET : {formulaire.siret}
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
                                  {active} {active > 1 ? 'offres' : 'offre'}
                                </Text>
                                <Text> actuellement en ligne</Text>
                              </Flex>
                              {expire > 0 && (
                                <Flex align='center'>
                                  <ExclamationCircle color='bluefrance.500' mr={2} w='20px' h='20px' />
                                  <Text pr={1} fontWeight={700}>
                                    {expire} {expire > 1 ? 'offres' : 'offre'}
                                  </Text>
                                  <Text> expirent bientôt</Text>
                                </Flex>
                              )}
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
    </AnimationContainer>
  )
})
