import { useRef } from 'react'
import {
  Button,
  Modal,
  ModalContent,
  ModalBody,
  ModalHeader,
  ModalFooter,
  ModalOverlay,
  ModalCloseButton,
  Center,
} from '@chakra-ui/react'

export default (props) => {
  let { isOpen, onClose, submitForm } = props
  const initialRef = useRef()
  const finalRef = useRef()

  return (
    <Modal
      closeOnOverlayClick={false}
      blockScrollOnMount={true}
      initialFocusRef={initialRef}
      finalFocusRef={finalRef}
      isOpen={isOpen}
      onClose={onClose}
    >
      <ModalOverlay />
      <ModalContent mt={['0', '3.75rem']} h={['100%', 'auto']} mb={0} borderRadius={0}>
        <ModalHeader bg='' color='red'>
          <Center>Titre</Center>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>Body</ModalBody>

        <ModalFooter>
          <Button type='button' isFullWidth={true} color='red' bg='white' mr={3} borderRadius={20} onClick={onClose}>
            Annuler
          </Button>
          <Button
            type='button'
            isFullWidth={true}
            color='white'
            bg='redLight'
            mr={3}
            borderRadius={20}
            onClick={submitForm}
          >
            Confirmer
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
