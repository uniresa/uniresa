import { Redirect } from "expo-router";
import store, { RootState } from "@/redux/store";
import { Provider, useSelector } from "react-redux";

const EntryPoint = () => {
  const isLoggedIn = useSelector(
    (state: RootState) => state.userAuth.isLoggedIn
  );
  if (isLoggedIn) {
    return <Redirect href="/(tabs)/home" />;
  } else {
    return <Redirect href="/(auth)/welcome" />;
  }
};

export default function App() {
  return (
    <Provider store={store}>
      <EntryPoint />
    </Provider>
  );
}
