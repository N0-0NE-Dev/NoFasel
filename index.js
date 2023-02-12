import { registerRootComponent } from "expo";
import { I18nManager } from "react-native";
import App from "./App";

I18nManager.forceRTL(false);
I18nManager.allowRTL(false);

registerRootComponent(App);
