import{Dimensions} from 'react-native'
export const { width: deviceV } = Dimensions.get("window");
export const { height: deviceH } = Dimensions.get("window");
export const DEVICE_WIDTH = 428
export const DEVICE_HEIGHT = 926

export const ignoreMsg:string[] = [
    'Constants.installationId has been deprecated in favor of generating and storing your own ID.',
    'Constants.deviceId has been deprecated in favor of generating and storing your own ID. This API will be removed in SDK 44',
    'Constants.linkingUrl has been renamed to Constants.linkingUri. Consider using the Linking API directly'
]