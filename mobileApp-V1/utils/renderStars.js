import { MaterialCommunityIcons, FontAwesome } from "@expo/vector-icons";

const renderStars = (numberOfStars, localSize= 16) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <FontAwesome
        key={i}
        name={i <= numberOfStars ? "star" : "star-o"}
        size={localSize}
        color="#E89600"
      />
    );
  }
  return stars;
};

export default renderStars;
