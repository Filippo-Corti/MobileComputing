import Profile from './view/Profile';
import EditProfile from './view/EditProfile';
import {getNavHeaderOptions} from './RootNavHeader';
import { navigationRef } from './RootNavigation';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PropTypes from 'prop-types';

const propTypes = {
    user: PropTypes.string.isRequired,
    setReloadRequired: PropTypes.func.isRequired,
}


const Stack = createNativeStackNavigator();

export default RootStack = ({ user, setReloadRequired }) => {

  const handleEditProfile = () => {
    navigationRef.navigate("EditProfile");
  }

  const handleUpdateProfileData = async (newUserData) => {
    setReloadRequired(true);
    return await ViewModel.updateUserData(USER_ID, newUserData);
  }

  const profileOptions = getNavHeaderOptions(false, "Welcome Back", {title: "Edit Profile", cb: handleEditProfile});
  const editOptions = getNavHeaderOptions(true, "Edit Profile", {title: "Save"});

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Profile"
        options={{
          ...profileOptions,
          animation: 'slide_from_right',
          animationDuration: 500,
        }}
      >
        {() => <Profile user={user} />}
      </Stack.Screen>
      <Stack.Screen
        name="EditProfile"
        options={{
          ...editOptions,
          animation: 'slide_from_right',
          animationDuration: 500,
        }}
      >
        {() => <EditProfile user={user} handleSave={(v) => handleUpdateProfileData(v)}/>}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

RootStack.propTypes = propTypes;