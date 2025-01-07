import { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import * as Updates from 'expo-updates';
import { globalStyles } from '../../../../styles/global';
import LargeButton from '../buttons/LargeButton';
import colors from '../../../../styles/colors';
import MyError from '../../../../model/types/MyError';

/**
 * @param {MyError} error 
 * @param {Function} onNavigateTo 
 * @param {Function} onAskLocationPermission 
 */
export function handleErrorByType(
	error,
	onNavigateTo,
	onAskLocationPermission
) {
	switch (error.type) {
		case "NETWORK":
			console.log("Network error");
			Updates.reloadAsync();
			break;
		case "ACCOUNT_DETAILS":
			console.log("AccountDetails error");
			onNavigateTo("AccountStack", {screen: "AccountScreen"});
			break;
		case "POSITION_UNALLOWED":
			console.log("Position error");
			onAskLocationPermission();
			break;
	}
}

/**
* @param {{ 
*  	title: string,
*  	text: string,
*  	confirmText: string?,
* 	dismissText: string,
* 	onConfirm: Function?,
* 	onDismiss: Function
* }} props 
* @returns {JSX.Element}
*/
const BottomModal = ({
	title,
	text,
	confirmText, 
	dismissText,
	onConfirm,
	onDismiss
}) => {

	const [isModalVisible, setModalVisible] = useState(false);

	const toggleModal = () => setModalVisible(!isModalVisible);

	useEffect(() => {
		if (title && text) 
			toggleModal()
	}, [title, text])

	return (
		<View style={styles.container}>
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
						{ confirmText && <LargeButton text={confirmText} onPress={() => { toggleModal(); onConfirm(); }} /> }
						<LargeButton text={dismissText} gray={true} onPress={() => {toggleModal(); onDismiss();}} />
					</View>
				</View>
			</Modal>
		</View>
	);
};

export default BottomModal;

const styles = StyleSheet.create({
	container: {
		position: 'absolute',
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
		height: '37%',
		paddingBottom: 25,
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
		paddingHorizontal: 30,
		...globalStyles.textBlack,
		...globalStyles.textNormalRegular,
	},

	buttons: {
		paddingHorizontal: 20,
		gap: 10,
		marginBottom: 30,
	},

});