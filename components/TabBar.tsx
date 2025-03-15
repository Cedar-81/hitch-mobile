import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { COLORS } from "@/costants/colors";
import { Feather, MaterialCommunityIcons, Entypo } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { usePathname, useRouter } from "expo-router"; // ✅ Import router for manual navigation
import { useDispatch } from "react-redux";
import { updateLastRoute } from "@/redux/slices/createTripStepsSlice";

const TabBar: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const router = useRouter(); // ✅ Use router to manually navigate
  const dispatch = useDispatch();
  const currentRoute = usePathname();

  const icons: Record<string, (props: { color?: string }) => JSX.Element> = {
    index: (props) => (
      <Feather name="home" size={20} color={COLORS.white} {...props} />
    ),
    create: (props) => (
      <Entypo name="plus" size={20} color={COLORS.white} {...props} />
    ),
    tickets: (props) => (
      <MaterialCommunityIcons
        name="ticket-confirmation-outline"
        size={20}
        color={COLORS.white}
        {...props}
      />
    ),
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabbar}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label: string =
            typeof options.tabBarLabel === "string"
              ? options.tabBarLabel
              : options.title ?? route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            if (route.name === "create") {
              dispatch(updateLastRoute(`/(root)/(tabs)${currentRoute}`));
              // ✅ Manually push to the "create" route instead of treating it as a tab
              router.push("/(root)/(newtripsteps)/step1");
            } else {
              const event = navigation.emit({
                type: "tabPress",
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name, route.params);
              }
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: "tabLongPress",
              target: route.key,
            });
          };

          return (
            <TouchableOpacity
              key={route.name}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              onPress={onPress}
              onLongPress={onLongPress}
              style={[styles.tabbarItem, isFocused && styles.tabbarItemActive]}
            >
              {icons[route.name]?.({
                color: isFocused ? COLORS.primary : COLORS.white,
              }) || null}

              {isFocused && <Text style={styles.tabLabel}>{label}</Text>}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  tabbar: {
    position: "absolute",
    bottom: 30,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primary,
    color: COLORS.white,
    alignSelf: "center",
    gap: 30,
    paddingVertical: 8,
    paddingHorizontal: 8,
    width: "auto",
    borderRadius: 1000,
    borderCurve: "continuous",
    shadowColor: "black",
    shadowOffset: { width: 0, height: 30 },
    shadowRadius: 30,
    shadowOpacity: 0.1,
    borderWidth: 2,
    borderColor: COLORS.secondary,
  },
  tabbarItem: {
    width: 40,
    alignItems: "center",
  },
  tabbarItemActive: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 30,
    width: "auto",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    borderCurve: "continuous",
    backgroundColor: COLORS.white,
    paddingVertical: 10,
  },
  container: {
    position: "relative",
    // height: 90,
    // backgroundColor: "transparent",
  },
  tabLabel: {
    textAlignVertical: "center",
    fontFamily: "Rubik-Medium",
  },
});

export default TabBar;
