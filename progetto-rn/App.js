import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import {useFonts} from 'expo-font';
import {fonts, globalStyles} from './styles/global';
import MyIcon, {IconNames} from './components/common/icons/MyIcon';
import MyLogo from './components/common/icons/MyLogo';
import MinimalistButton from './components/common/buttons/MinimalistButton';
import ButtonWithArrow from './components/common/buttons/ButtonWithArrow';
import LargeButton from './components/common/buttons/LargeButton';
import CreditCard from './components/common/other/CreditCard';
import Separator from './components/common/other/Separator';
import ProgressBar from './components/common/other/ProgressBar';
import FormField from './components/common/forms/FormField';
import {useForm} from 'react-hook-form';
import SelectNumber from './components/common/forms/SelectNumber';
import BottomModal from './components/navigation/BottomModal';

export default function App() {

  const [fontsLoaded] = useFonts({
    [fonts.regular]: require('./assets/fonts/UberMoveText-Regular.otf'),
    [fonts.medium]: require('./assets/fonts/UberMoveText-Medium.otf'),
    [fonts.bold]: require('./assets/fonts/UberMoveText-Bold.otf'),
    [fonts.logo]: require('./assets/fonts/Geologica-Medium.ttf'),
  });

  const ccInformation={
    number: '1234 5678 9012 3456',
    holder: 'Filippo Corti',
    expiryMonth: 12,
    expiryYear: 2026,
  }

  const { control, handleSubmit, formState: { errors }, } = useForm({
    defaultValues: {
        fName: "Filippo",
        lName: "Corti",
    }
  });

  return (
    <View style={globalStyles.container}>

      <Text style={[globalStyles.textBlack, globalStyles.textTitleBold]}>Hello</Text>
      <Text style={[globalStyles.textPrimary, globalStyles.textSmallRegular]}>Hello</Text>

      <MyLogo />

      <MinimalistButton text="NEW ACCOUNT" onPress={() => console.log("Pressed")}/>

      <ButtonWithArrow text="Order Again" onPress={() => console.log("Pressed")}/>

      <LargeButton text="I'll do it" onPress={() => console.log("Pressed")}/>
      <LargeButton text="Not now" gray={true} onPress={() => console.log("Pressed")}/>
      <LargeButton text="Order • €15.00" disabled={true} onPress={() => console.log("Pressed")}/>

      <CreditCard cardInformation={ccInformation}/>

      <Separator size={3} color={'#000'}/>

      <ProgressBar progress={80}/>

      <FormField
        name="lName"
        label="Last Name"
        control={control}
        error={errors.fName}
        validate={(fName) => false || "Last Name must be less than 15 characters long"}
        //editable={false}
        inputMode="numeric"
      />

      <SelectNumber min={1} max={12} />

      <BottomModal
        onConfirm={() => console.log("Confirmed")}
        title={"Problema"}
        text={"Sei sicuro di voler procedere ma più luyngo tipo 3 o 4 oppure nache 5 righe che servono ar iempire il cavollo di coso?"}
        confirmText={"I'll do it"}
        rejectText={"Not now"}
        openButtonText={"Order • €15.00"}
      />

      <StatusBar style="auto" />
    </View>
  );
}
