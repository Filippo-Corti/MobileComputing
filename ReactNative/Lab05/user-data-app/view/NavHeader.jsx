import {Button} from 'react-native'

export function getNavHeaderOptions(goBack, title, actionData) {
    return {
        headerTitle: title,
        headerStyle: {
            backgroundColor: '#000', // Set background color for the header
        },
        headerTitleStyle: {
            fontSize: 24,
            fontWeight: '700',
            color: '#FFFFFF',
            paddingVertical: 2,
        },
        headerBackVisible: goBack,
        headerTintColor: '#FFFFFF', // Set back button color
        headerRight: () => (
            <Button
                onPress={() => actionData.cb()}
                title={actionData.title}
            />
        ),
    }
}