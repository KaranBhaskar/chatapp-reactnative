import { Link } from "expo-router";
import { Pressable, Text } from "react-native";

const variants = {
  primary: "bg-fern",
  secondary: "bg-mist",
  danger: "bg-coral",
};

const textVariants = {
  primary: "text-white",
  secondary: "text-ink",
  danger: "text-white",
};

function ButtonBase({ label, variant = "primary", className = "", ...props }) {
  return (
    <Pressable
      className={`min-h-12 items-center justify-center rounded-lg px-4 ${variants[variant]} ${className}`}
      {...props}>
      <Text className={`text-sm font-bold ${textVariants[variant]}`}>{label}</Text>
    </Pressable>
  );
}

export function Button({ href, ...props }) {
  if (href) {
    return (
      <Link href={href} asChild>
        <ButtonBase {...props} />
      </Link>
    );
  }

  return <ButtonBase {...props} />;
}
