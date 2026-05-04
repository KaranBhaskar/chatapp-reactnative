import { SafeAreaView } from "react-native-safe-area-context";

export function Screen({ children, className = "" }) {
  return <SafeAreaView className={`flex-1 bg-slate-50 px-5 py-4 ${className}`}>{children}</SafeAreaView>;
}
