import { Query } from "react-native-appwrite";
import { DATABASE_ID, databases } from "../appwriteConfig";
import { NewUser, User } from "../types";

const COLLECTION_ID = "hitch-users";

// ✅ Create a User
export const createUser = async (userData: NewUser) => {
  try {
    return await databases.createDocument(
      DATABASE_ID,
      COLLECTION_ID,
      "unique()",
      userData
    );
  } catch (error) {
    console.error("Error creating user:", error);
    return null;
  }
};

// ✅ Fetch a User by ID
export const fetchUsers = async () => {
  try {
    const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID);

    if (response.documents.length === 0) {
      console.warn("No user found");
      return null;
    }

    return response;
  } catch (error) {
    console.error("Error fetching users: ", error);
    return null;
  }
};

export const FetchUserByEmail = async (email: string) => {
  try {
    const response = await fetchUsers();

    if (!response) throw new Error("Couldn't fetch user from database");

    console.log("\nrespons-user: ", response.documents);

    let user = response.documents.find((user) => user.email == email);

    if (!user) throw new Error(`No user with email: ${email}`);

    return user as User;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
};

// ✅ Update a User
export const updateUser = async (userId: string, userData: any) => {
  try {
    return await databases.updateDocument(
      DATABASE_ID,
      COLLECTION_ID,
      userId,
      userData
    );
  } catch (error) {
    console.error("Error updating user:", error);
    return null;
  }
};
