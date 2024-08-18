import { Redirect, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

const conditionsLayout = () => {
  return (
    <>
    <Stack>
      <Stack.Screen
        name="notifications"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="connection"
        options={{
          headerShown: false,
        }}
      />
    </Stack>

    {/* <Loader isLoading={loading} /> */}
    <StatusBar backgroundColor="#161622" style="light" />
  </>
  )
}

export default conditionsLayout 


// import { Loader } from "../../components";
// import { useGlobalContext } from "../../context/GlobalProvider";


  // const { loading, isLogged } = useGlobalContext();

  // if (!loading && isLogged) return <Redirect href="/home" />;
