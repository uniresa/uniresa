import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { Property } from "@/typesDeclaration/types";
import { MaterialCommunityIcons, FontAwesome } from "@expo/vector-icons";

const PropertyCard = ({ property }: { property: Property }) => {
  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FontAwesome
          key={i}
          name={i <= property.rating ? "star" : "star-o"}
          size={16}
          color="#E89600"
        />
      );
    }
    return stars;
  };

  const renderReviewRating = () => {
    const circles = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= property.reviewsRating) {
        circles.push(
          <MaterialCommunityIcons
            key={i}
            name="circle"
            size={16}
            color="#07A872"
          />
        );
      } else if (i - property.reviewsRating < 1) {
        circles.push(
          <MaterialCommunityIcons
            key={i}
            name="circle-half-full"
            size={16}
            color="#07A872"
          />
        );
      } else {
        circles.push(
          <MaterialCommunityIcons
            key={i}
            name="circle-outline"
            size={16}
            color="#07A872"
          />
        );
      }
    }
    return circles;
  };

  return (
    <View className="flex flex-col p-4 items-start border border-spacing-2 border-neutrals-neutrals-n40 gap-2 rounded-lg">
      <TouchableOpacity className="flex flex-row items-center">
        <Image
          source={{ uri: property.propertyImage }}
          style={{ width: 290, height: 120, borderRadius: 8 }}
          resizeMode="cover"
        />
      </TouchableOpacity>
      <TouchableOpacity className="flex flex-col">
        <View className="flex flex-row items-center gap-2 justify-start">
          <Text className="text-lg font-semibold">{property.name}</Text>
          <View className="flex flex-row gap-2 items-center">
            {renderStars()}
          </View>
        </View>
        <View className="flex flex-row items-center justify-start">
          <View className="flex flex-row gap-2 items-center justify-start">
            <Image
              source={require("@/assets/icons/tripAdvisor.png")}
              style={{ width: 36, height: 20 }} // Adjusted the size for better alignment
              resizeMode="contain"
            />
            {renderReviewRating()}
          </View>
          <Text className="ml-2">{property.reviews} Commentaires</Text>
        </View>
        <Text>{property.distanceToPoint}</Text>
        <View className="flex flex-row gap-2 items-center">
          <Text className="font-lbold">Price:</Text>
          <Text className="line-through text-lg text-accents">
            {property.oldPrice}
          </Text>
          <Text className="font-lbold text-lg">{property.newPrice} Fcfa</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default PropertyCard;

// import { View, Text, Image } from "react-native";
// import React from "react";
// import { Property } from "@/typesDeclaration/types";

// // PropertyCard component to display property details in a card format.
// const PropertyCard = ({ property }: { property: Property }) => {
//   return (
//     <View className="flex flex-col p-4 items-center">
//       <View className="flex flex-row items-center gap-2">
//         <Image source={{ uri: property.image }} />
//       </View>
//       <View className="flex flex-col">
//         <View className="flex flex-row gap-4">
//           <Text className="text-lg font-semibold">{property.name}</Text>
//           <Text className="text-lg font-semibold">{property.rating}</Text>
//         </View>
//         <View className="flex flex-row">
//           <Text>{property.reviewsRating}</Text>
//           <Text>{property.reviews}</Text>
//         </View>
//         <Text>{property.distanceToPoint}</Text>
//         <View className="flex flex-col">
//           <Text>Price: {property.oldPrice}</Text>
//           <Text> {property.newPrice}</Text>
//         </View>
//       </View>
//     </View>
//   );
// };

// export default PropertyCard;
