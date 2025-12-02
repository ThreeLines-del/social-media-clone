import { useApolloClient, useMutation, useQuery } from "@apollo/client/react";
import { Ionicons } from "@expo/vector-icons";
import { useFormik } from "formik";
import { useState } from "react";
import { Image, Pressable, Text, TextInput, View } from "react-native";
import { Link, useNavigate } from "react-router-native";
import * as yup from "yup";
import { LOGIN, SIGNUP } from "../graphql/mutations";
import useAuthStorage from "../hooks/useAuthStorage";
import { CURRENT_USER } from "../graphql/queries";

const initialValues = {
  username: "",
  email: "",
  password: "",
};

const validationSchema = yup.object().shape({
  username: yup.string().required("username is required"),
  email: yup.string().email().required("email is required"),
  password: yup.string().required("password is required"),
});

const LoginPage = () => {
  const [isFocused, setIsFocused] = useState(false);
  const [isFocused2, setIsFocused2] = useState(false);
  const [mode, setMode] = useState("signUp");
  const navigate = useNavigate();

  const apolloClient = useApolloClient();
  const authStorage = useAuthStorage();
  const currentUser = useQuery<{
    me: {
      id: string;
      email: string;
      avatar: string;
    };
  }>(CURRENT_USER);

  const [login] = useMutation<
    { login: { token: string } },
    { email: string; password: string }
  >(LOGIN);

  const [register] = useMutation<
    { register: { token: string } },
    { username: string; email: string; password: string }
  >(SIGNUP);

  const onSubmit = async ({
    username,
    email,
    password,
  }: {
    username: string;
    email: string;
    password: string;
  }) => {
    if (mode === "signUp") {
      try {
        const data = await register({
          variables: {
            username,
            email,
            password,
          },
        });

        const token = data.data?.register.token;
        if (token) {
          await authStorage.setAccessToken(token);
        }

        apolloClient.resetStore();
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        const data = await login({
          variables: {
            email,
            password,
          },
        });

        const token = data.data?.login?.token;
        if (token) {
          await authStorage.setAccessToken(token);
        }

        apolloClient.resetStore();
      } catch (error) {
        console.log(error);
      }
    }

    navigate("/");
  };

  const signOut = async () => {
    authStorage.removeAccessToken();
    apolloClient.resetStore();
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });

  return (
    <View className="flex-1 items-center px-10 gap-10 pt-32">
      <Link
        className="absolute left-0 p-5"
        underlayColor={"transparent"}
        to={"../"}
      >
        <Ionicons name="arrow-back" size={22} />
      </Link>

      {currentUser.data?.me ? (
        <View className="w-full gap-10">
          <View className="flex flex-col gap-10 items-center">
            <Ionicons name="paper-plane-outline" size={40} />
            <Text className="text-3xl font-semibold">Sign out</Text>
          </View>
          <View className="items-center pt-3 w-full">
            <Image
              className="h-16 w-16 rounded-full"
              source={{ uri: currentUser.data.me.avatar }}
            />
          </View>
          <View className="items-center">
            <Text className="text-gray-600 font-semibold">
              {currentUser.data.me.email}
            </Text>
          </View>

          <Pressable
            onPress={signOut}
            className="border h-14 rounded-full justify-center items-center bg-gray-800"
          >
            <Text className="text-lg font-semibold text-white">Sign out</Text>
          </Pressable>
        </View>
      ) : (
        <View className="flex flex-col w-full gap-5">
          <View className="flex flex-col gap-10 items-center">
            <Ionicons name="paper-plane-outline" size={40} />
            <Text className="text-3xl font-semibold">
              {mode === "signUp" ? "Sign up" : "Sign in"}
            </Text>
          </View>

          <TextInput
            placeholder="username"
            className={`border h-14 rounded-full ${isFocused ? "border-blue-500" : "border-gray-400"}  text-lg px-5`}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            value={formik.values.username}
            onChangeText={formik.handleChange("username")}
          />
          {formik.touched.username && formik.errors.username && (
            <Text className="text-red-500 text-lg">
              {formik.errors.username}
            </Text>
          )}

          <TextInput
            placeholder="email"
            className={`border h-14 rounded-full ${isFocused ? "border-blue-500" : "border-gray-400"}  text-lg px-5`}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            value={formik.values.email}
            onChangeText={formik.handleChange("email")}
          />
          {formik.touched.email && formik.errors.email && (
            <Text className="text-red-500 text-lg">{formik.errors.email}</Text>
          )}

          <TextInput
            placeholder="password"
            className={`border h-14 rounded-full ${isFocused2 ? "border-blue-500" : "border-gray-400"} text-lg px-5`}
            onFocus={() => setIsFocused2(true)}
            onBlur={() => setIsFocused2(false)}
            value={formik.values.password}
            onChangeText={formik.handleChange("password")}
          />
          {formik.touched.password && formik.errors.password && (
            <Text className="text-red-500 text-lg">
              {formik.errors.password}
            </Text>
          )}

          <Pressable
            onPress={() => formik.handleSubmit()}
            className="border h-14 rounded-full justify-center items-center bg-gray-800"
          >
            <Text className="text-lg font-semibold text-white">Next</Text>
          </Pressable>

          {mode !== "signUp" && (
            <Pressable className="border h-14 rounded-full justify-center items-center">
              <Text className="text-lg font-semibold">Forgot password?</Text>
            </Pressable>
          )}

          {mode === "signUp" ? (
            <Text className="text-lg text-gray-400">
              Already have an account?{" "}
              <Text
                onPress={() => setMode("")}
                className="text-blue-400 font-semibold"
              >
                Sign in
              </Text>
            </Text>
          ) : (
            <Text className="text-lg text-gray-400">
              Don't have an account?{" "}
              <Text
                onPress={() => setMode("signUp")}
                className="text-blue-400 font-semibold"
              >
                Sign up
              </Text>
            </Text>
          )}
        </View>
      )}
    </View>
  );
};

export default LoginPage;
