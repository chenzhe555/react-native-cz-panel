
# react-native-cz-panel

## Getting started

`$ npm install react-native-cz-panel --save`

### Mostly automatic installation

`$ react-native link react-native-cz-panel`

### Manual installation


#### iOS

1. In XCode, in the project navigator, right click `Libraries` ➜ `Add Files to [your project's name]`
2. Go to `node_modules` ➜ `react-native-cz-panel` and add `RNCzPanel.xcodeproj`
3. In XCode, in the project navigator, select your project. Add `libRNCzPanel.a` to your project's `Build Phases` ➜ `Link Binary With Libraries`
4. Run your project (`Cmd+R`)<

#### Android

1. Open up `android/app/src/main/java/[...]/MainActivity.java`
  - Add `import com.chenzhe.panel.RNCzPanelPackage;` to the imports at the top of the file
  - Add `new RNCzPanelPackage()` to the list returned by the `getPackages()` method
2. Append the following lines to `android/settings.gradle`:
  	```
  	include ':react-native-cz-panel'
  	project(':react-native-cz-panel').projectDir = new File(rootProject.projectDir, 	'../node_modules/react-native-cz-panel/android')
  	```
3. Insert the following lines inside the dependencies block in `android/app/build.gradle`:
  	```
      compile project(':react-native-cz-panel')
  	```


## Usage
```javascript
import RNCzPanel from 'react-native-cz-panel';

// TODO: What to do with the module?
RNCzPanel;
```
  