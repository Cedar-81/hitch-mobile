import { Client, Account, Databases } from "react-native-appwrite";
import { Platform } from "react-native";

const endpoint = process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT ?? "";
const project = process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID ?? "";
const ios = process.env.EXPO_PUBLIC_APPWRITE_BUNDLE_ID ?? "";
const android = process.env.EXPO_PUBLIC_APPWRITE_PACKAGE_NAME ?? "";
const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DB_ID ?? "";

const client = new Client().setEndpoint(endpoint).setProject(project);

switch (Platform.OS) {
  case "ios":
    client.setPlatform(ios);
    break;
  case "android":
    client.setPlatform(android);
    break;
}

const account = new Account(client);
const databases = new Databases(client);

export { client, account, DATABASE_ID, databases };
