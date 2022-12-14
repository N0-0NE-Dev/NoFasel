<h1 align="center">NoFasel</h1>

<p align="center" >
<img src="https://i.imgur.com/NvLCO9U.png" width="100px" height="100px">
</p>

A streaming app with zero ads built in react native with [scrapers](https://github.com/N0-0NE-Dev/no-fasel-scrapers) built in python. No Fasel requires no premissons or accounts and is free to use forever (or as long as fasel is operating.

## Features:

✅ Watchlist System  
✅ Latest Movies, Series, Animes & More...  
✅ Fast Video Player (With Double-tap To Seek)  
✅ Daily Content Updates  
✅ No Extra Permissions Needed  
✅ No Account Needed  
✅ Light & Dark Themes

## Screenshots:

   <p float="left">
      <img src="https://i.imgur.com/SwPY24el.png" /> 
      <img src="https://i.imgur.com/aCm9vOWl.png" /> 
      <img src="https://i.imgur.com/SY76kbKl.png" /> 
      <img src="https://i.imgur.com/5l3L5Mvl.png" /> 
      <img src="https://i.imgur.com/CATSRhLl.png" /> 
      <img src="https://i.imgur.com/hWfGkWal.png" /> 
      <img src="https://i.imgur.com/tSySR0fl.png" /> 
      <img src="https://i.imgur.com/pIDzfW0l.png" /> 
      <img src="https://i.imgur.com/bEkYPZBl.png" /> 
      <img src="https://i.imgur.com/7A7fDtml.png" />
   </p>

## Download:

Go to [releases](https://github.com/N0-0NE-Dev/NoFasel/releases) page and download the latest release.

Note: The playstore might flag the app as "unsafe", eventhough No Fasel connects to no external servers. No Fasel only ever connects to GitHub to grab the [latest](https://github.com/N0-0NE-Dev/no-fasel-scrapers/tree/main/output) content files, imgur or imgpile to load the content posters and to fasel or akwam to get the HLS sources. So, choose install anyway when prompted. You can also check the VirusTotal report [here](https://www.virustotal.com/gui/file/47db01d2ed0aaf16812474aafa754e553dc7423e2b0bd3f0676cf9d9bf066fd6/behavior).

## Building Instructions

### Prerequisite

You must have node 16, jdk 11 and android studio downloaded and configured according to the react native guide found [here](https://reactnative.dev/docs/environment-setup).

### Steps

1. Clone the repository:<br />

   ```
   git clone https://github.com/N0-0NE-Dev/NoFasel
   ```

2. Install the dependencies:<br />

   ```
   npm install
   ```

3. Generate a release keystore:<br />

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

6. Change the directory to the android folder and run:<br />

   ```
   gradlew assembleRelease
   ```

   to build the release apk or:

   ```
   gradlew assembleDebug
   ```

   to build the development client.

7. You can find the apk file in `./android/build/outputs/apk/release` or `./android/build/outputs/apk/debug` depending on which command you used.
