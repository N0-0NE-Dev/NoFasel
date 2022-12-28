# Building Instructions

## Prerequisites:

You must have node 16, jdk 11 and android studio downloaded and configured according to the react native guide found [here](https://reactnative.dev/docs/environment-setup).

## Steps:

1. Clone the repository:

   ```
   git clone https://github.com/N0-0NE-Dev/NoFasel
   ```

2. Install the dependencies:

   ```
   npm install
   ```

3. Generate a release keystore:

   ```
   keytool -genkey -v -keystore your_key_name.keystore -alias your_key_alias -keyalg RSA -keysize 2048 -validity 10000
   ```

   Change `your_key_name` and `your_key_alias` to whatever you want. If you already have a keystore you use to sign apps skip this step.

4. Move the generated (or existing) keystore to `./android/app`.

5. In `./android/app` create a file named `keystore.properties` with the following content:

   ```
   storePassword=PUT_YOUR_KEYSTORE_PASSWORD_HERE
   keyPassword=PUT_YOUR_KEYSTORE_PASSWORD_HERE
   keyAlias=PUT_YOUR_KEYSTORE_ALIAS_HERE
   storeFile=PUT_YOUR_KEYSTORE_FILE_NAME_HERE
   ```

6. Change the directory to the android:

   To build the release apk run:

   ```
   gradlew assembleRelease
   ```

   To build the development client run:

   ```
   gradlew assembleDebug
   ```

7. You can find the apk file in `./android/build/outputs/apk/release` or `./android/build/outputs/apk/debug` depending on which command you used.
