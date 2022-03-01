import { Modal, ModalContent } from '@chakra-ui/react'
import { useRef } from 'react'
import DepotRapide from './DepotRapide_AjouterVoeux'

export default (props) => {
  let { isOpen, onClose } = props
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
      size='full'
    >
      <ModalContent>
        <DepotRapide {...props} fromDashboard={true} onClose={onClose} />
      </ModalContent>
    </Modal>
  )
}
