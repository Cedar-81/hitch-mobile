import { createUser } from "@/lib/apiServices/usersService";
import { account } from "@/lib/appwriteConfig";
import { User } from "@/lib/types";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ID, Models, Payload } from "react-native-appwrite";

interface AuthState {
  user: User | null;
  session: any | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  session: null,
  loading: false,
  error: null,
};

// ✅ Check Authentication
export const checkAuth = createAsyncThunk(
  "auth/checkAuth",
  async (_, { rejectWithValue }) => {
    try {
      const response = await account.get();
      return response;
    } catch (error) {
      const err = error as Error;
      return rejectWithValue(err.message || "Authentication failed");
    }
  }
);

// ✅ Sign Up
export const signup = createAsyncThunk(
  "auth/signup",
  async (
    {
      email,
      password,
      firstname,
      lastname,
    }: { email: string; password: string; firstname: string; lastname: string },
    { rejectWithValue }
  ) => {
    try {
      const name = `${firstname} ${lastname}`;
      const image = `https://robohash.org/${firstname}-${lastname}.png`;
      await account.create(ID.unique(), email, password, name); // Create user account
      const responseUser = await account.get(); // Fetch user details after sign-up
      console.log("\nresponse here: ", responseUser);
      try {
        const newUser = await createUser({
          firstname,
          lastname,
          email,
          image,
        });
        console.log("\nresponse new user: ", newUser);
      } catch (err) {
        console.log("error while creating user: ", err);
        const error = err as Error;
        return rejectWithValue(error.message || "New user creation failed");
      }

      return responseUser;
    } catch (error) {
      console.log("error during sign up: ", error);
      const err = error as Error;
      return rejectWithValue(err.message || "Sign up failed");
    }
  }
);

// ✅ Sign In
export const signin = createAsyncThunk(
  "auth/signin",
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      await account.createEmailPasswordSession(email, password);
      const responseUser = await account.get();
      console.log("response-user: ", responseUser);
      return responseUser;
    } catch (error) {
      const err = error as Error;
      return rejectWithValue(err.message || "Sign in failed");
    }
  }
);

// ✅ Sign Out
export const signout = createAsyncThunk(
  "auth/signout",
  async (_, { rejectWithValue }) => {
    try {
      await account.deleteSession("current");
      return null;
    } catch (error) {
      const err = error as Error;
      return rejectWithValue(err.message || "Sign out failed");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    updateUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // ✅ Check Auth
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.session = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ✅ Sign Up
      .addCase(signup.pending, (state) => {
        state.loading = true;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.session = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ✅ Sign In
      .addCase(signin.pending, (state) => {
        state.loading = true;
      })
      .addCase(signin.fulfilled, (state, action) => {
        state.session = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(signin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ✅ Sign Out
      .addCase(signout.pending, (state) => {
        state.loading = true;
      })
      .addCase(signout.fulfilled, (state) => {
        state.user = null;
        state.session = null;
        state.loading = false;
        state.error = null;
      })
      .addCase(signout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { updateUser } = authSlice.actions;

export default authSlice.reducer;
