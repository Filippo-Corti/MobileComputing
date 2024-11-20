import { useRef, useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import Modal from 'react-native-modal';
import {globalStyles} from '../../styles/global';

export default BottomModal = ({onConfirm, title, text, confirmText, rejectText, openButtonText}) => {

    const [isModalVisible, setModalVisible] = useState(false);

    const toggleModal = () => setModalVisible(!isModalVisible);

    return (
      <View style={styles.container}>
        <LargeButton text={openButtonText}  onPress={toggleModal}/>
        <Modal
          isVisible={isModalVisible}
          onBackdropPress={toggleModal} 
          style={styles.bottomModal}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{title}</Text>
            <Text style={styles.modalText}>{text}</Text>
            <LargeButton text={confirmText} onPress={onConfirm}/>
            <LargeButton text={rejectText} gray={true} onPress={toggleModal}/>
          </View>
        </Modal>
      </View>
    );
};


const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },

    bottomModal: {
      justifyContent: 'flex-end',
      margin: 0,
    },

    modalContent: {
      backgroundColor: colors.white,
      height: '40%',
      padding: 20,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
    },

    modalTitle: {

    },

    modalText: {
    },
  });