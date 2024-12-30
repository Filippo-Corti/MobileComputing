import { useRef, useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import Modal from 'react-native-modal';
import {globalStyles} from '../../../styles/global';
import LargeButton from '../common/buttons/LargeButton';

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
            <View style={styles.texts}>
                <Text style={styles.modalTitle}>{title}</Text>
                <Text style={styles.modalText}>{text}</Text>
            </View>
            <View style={styles.buttons}>
                <LargeButton text={confirmText} onPress={() => {toggleModal(); onConfirm()}}/>
                <LargeButton text={rejectText} gray={true} onPress={toggleModal}/>
            </View>
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
      height: '35%',
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
    },

    texts: {
      flexGrow: 1,
    },

    modalTitle: {
        textAlign: 'center',
        marginVertical: 20,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.gray,
        ...globalStyles.textBlack,
        ...globalStyles.textSubtitleBold,
    },

    modalText: {
        paddingBottom: 25,
        paddingHorizontal: 30,
        ...globalStyles.textBlack,
        ...globalStyles.textNormalRegular,
    },

    buttons: {
        paddingHorizontal: 20,
        gap: 10,
        marginBottom: 10,
    },

  });