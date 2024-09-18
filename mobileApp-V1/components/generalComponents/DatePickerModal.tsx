import { BookingDates } from "@/typesDeclaration/types";
import React, { useState, useEffect } from "react";
import {
  BottomModal,
  ModalButton,
  ModalContent,
  ModalFooter,
  ModalTitle,
  SlideAnimation,
} from "react-native-modals";
import { View, StyleSheet } from "react-native";
import {
  CalendarList,
  CalendarProps,
  LocaleConfig,
} from "react-native-calendars";
import moment from "moment";

// Locale configuration for French
LocaleConfig.locales["fr"] = {
  monthNames: [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ],
  monthNamesShort: [
    "Janv.",
    "Févr.",
    "Mars",
    "Avr.",
    "Mai",
    "Juin",
    "Juil.",
    "Août",
    "Sept.",
    "Oct.",
    "Nov.",
    "Déc.",
  ],
  dayNames: [
    "Dimanche",
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    "Samedi",
  ],
  dayNamesShort: ["D", "L", "M", "M", "J", "V", "S"],
  today: "Aujourd'hui",
};
// Set the locale to French
LocaleConfig.defaultLocale = "fr";

interface GuestPickerModalProps {
  isVisible: boolean;
  bookingDates: BookingDates;
  onClose: () => void;
  onConfirm: (bookingDates: BookingDates) => void;
}

const DatePickerModal: React.FC<GuestPickerModalProps> = ({
  isVisible,
  bookingDates,
  onClose,
  onConfirm,
}) => {
  const [selectedRange, setSelectedRange] = useState<BookingDates>({
    checkInDate: bookingDates.checkInDate,
    checkOutDate: bookingDates.checkOutDate,
  });
  const onDayPress: CalendarProps["onDayPress"] = (day) => {
    if (
      !selectedRange.checkInDate ||
      (selectedRange.checkInDate && selectedRange.checkOutDate)
    ) {
      setSelectedRange({ checkInDate: day.dateString, checkOutDate: "" });
    } else {
      setSelectedRange({ ...selectedRange, checkOutDate: day.dateString });
    }
  };

  const getDatesBetweenRange = (startDate: string, endDate: string) => {
    const range: { [key: string]: { color: string } } = {};
    let currentDate = moment(startDate).add(1, "day");

    while (currentDate.isBefore(moment(endDate), "day")) {
      range[currentDate.format("YYYY-MM-DD")] = { color: "lightgreen" };
      currentDate = currentDate.add(1, "day");
    }

    return range;
  };
  // Get current date to disable past dates
  const currentDate = moment().format("YYYY-MM-DD");

  return (
    <BottomModal
      swipeThreshold={200}
      swipeDirection={["up", "down"]}
      footer={
        <ModalFooter>
          <ModalButton
            text="Confirmer"
            style={{
              marginBottom: 16,
              backgroundColor: "#069494",
              marginRight: 20,
              marginLeft: 20,
              borderRadius: 24,
            }}
            textStyle={{ color: "#ffffff" }}
            onPress={() => {
              onConfirm(selectedRange);
              onClose();
            }}
          />
        </ModalFooter>
      }
      modalTitle={
        <ModalTitle
          title="Selectionnez vos dates"
          textStyle={{ color: "#333333", fontSize: 20, fontWeight: 700 }}
        />
      }
      modalAnimation={
        new SlideAnimation({
          slideFrom: "bottom",
        })
      }
      visible={isVisible}
      onTouchOutside={onClose}
      //   onBackdropPress={onClose}
    >
      <ModalContent style={{ width: "100%", height: 420 }}>
        {/* Dates Picker */}
        <View className="flex flex-row place-items-center justify-center m-4 text-center">
          <CalendarList
            style={{
              height: 360,
              width: "100%",
            }}
            theme={{
              backgroundColor: "#ffffff",
              calendarBackground: "#ffffff",
              textSectionTitleColor: "#333333",
              textSectionTitleDisabledColor: "#d9e1e8",
              selectedDayBackgroundColor: "#069494",
              selectedDayTextColor: "#ffffff",
              todayTextColor: "#00adf5",
              dayTextColor: "#333333",
              textDisabledColor: "#c0c0c0",
              monthTextColor: "#333333",
              textDayFontFamily: "monospace",
              textMonthFontFamily: "monospace",
              textDayHeaderFontFamily: "monospace",
              textDayFontWeight: "600",
              textMonthFontWeight: "bold",
              textDayHeaderFontWeight: "bold",
              textDayFontSize: 16,
              textMonthFontSize: 20,
              textDayHeaderFontSize: 16,
            }}
            horizontal={false} // Enable horizontal scroll
            pagingEnabled={true} // Snap between months
            firstDay={1} // Monday as the first day of the week
            showScrollIndicator={false} // Hide scroll indicator for better UX
            minDate={currentDate} // Prevent past dates from being selected
            markingType="period"
            markedDates={{
              [selectedRange.checkInDate]: {
                startingDay: true,
                color: "#069494",
                textColor: "#ffffff",
              },
              [selectedRange.checkOutDate]: {
                endingDay: true,
                color: "#069494",
                textColor: "#ffffff",
              },
              ...(selectedRange.checkInDate && selectedRange.checkOutDate
                ? getDatesBetweenRange(
                    selectedRange.checkInDate,
                    selectedRange.checkOutDate
                  )
                : {}),
            }}
            onDayPress={onDayPress}
            pastScrollRange={0} // Prevent scrolling back to previous months
            futureScrollRange={12} // Allow scrolling to 24 months in the future
          />
        </View>
      </ModalContent>
    </BottomModal>
  );
};

export default DatePickerModal;
