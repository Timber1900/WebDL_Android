import { PermissionsAndroid } from 'react-native';

export default async function requestPermissions() {
  try {
    const writePermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        title: "WebDL Write Permission",
        message:
          "WebDL needs access to storage" +
          "so you can download videos.",
        buttonNeutral: "Ask Me Later",
        buttonNegative: "Cancel",
        buttonPositive: "OK"
      }
    );


    const readPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      {
        title: "WebDL Read Permission",
        message:
          "WebDL needs access to storage" +
          "so you can download videos.",
        buttonNeutral: "Ask Me Later",
        buttonNegative: "Cancel",
        buttonPositive: "OK"
      }
    );

    return (writePermission === PermissionsAndroid.RESULTS.GRANTED) && (readPermission === PermissionsAndroid.RESULTS.GRANTED)
  } catch (err) {
    console.warn(err);
    return false
  }
}
