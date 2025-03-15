import { RootState } from "@/redux/store";
import { usePathname, useRouter } from "expo-router";
import { View, Text, TouchableOpacity } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { COLORS } from "@/costants/colors";
import { goToStep } from "@/redux/slices/createTripStepsSlice";
import { useEffect } from "react";

export default function StepIndicator() {
  const router = useRouter();
  const dispatch = useDispatch();
  const pathname = usePathname();

  const { steps, currentStep } = useSelector(
    (state: RootState) => state.create_trip_steps
  );

  useEffect(() => {
    const match = pathname.match(/step(\d+)/); // Extracts the number from "/step3"
    if (match) {
      const stepId = parseInt(match[1], 10);
      dispatch(goToStep(stepId)); // Update Redux state
    }
  }, [pathname]);

  return (
    <View style={{ flexDirection: "row", alignItems: "center", padding: 13 }}>
      {steps.map((step, index) => (
        <View
          key={step.id}
          style={{ flexDirection: "row", alignItems: "center" }}
        >
          {/* Step Number */}
          <TouchableOpacity
            onPress={() => {
              dispatch(goToStep(step.id)); // Update Redux state
              const route = `/(root)/(newtripsteps)/step${step.id}`;
              // @ts-ignore
              router.push(route); // Navigate to the step
            }}
          >
            <Text
              style={{
                borderWidth:
                  step.state === "completed"
                    ? 1
                    : step.state === "untouched"
                    ? 1
                    : 0,
                borderRadius: 6,
                borderColor:
                  step.state === "completed"
                    ? COLORS.secondary
                    : step.state === "untouched"
                    ? COLORS.gray
                    : "transparent",
                backgroundColor:
                  step.id === currentStep ? COLORS.secondary : "transparent",
                padding: 6,
                height: 30,
                width: 30,
                textAlign: "center",
                fontFamily: "Rubik-Medium",
                color:
                  step.state === "completed"
                    ? COLORS.secondary
                    : step.id === currentStep
                    ? COLORS.white
                    : COLORS.darkGray,
                fontSize: 12,
              }}
            >
              {step.id}
            </Text>
          </TouchableOpacity>

          {/* Horizontal Line (except for last item) */}
          {index < steps.length - 1 && (
            <View
              style={{
                height: 2,
                width: 20,
                backgroundColor:
                  index < steps.findIndex((s) => s.id === currentStep)
                    ? COLORS.primary
                    : COLORS.gray, // Primary for completed steps, Gray otherwise
                marginHorizontal: 5,
              }}
            />
          )}
        </View>
      ))}
    </View>
  );
}
