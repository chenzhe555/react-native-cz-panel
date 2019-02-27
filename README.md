
## Manual installation

npm install react-native-cz-panel --save

###依赖库

npm install react-native-cz-pack-element --save

npm install react-native-cz-scroll-tab --save
	

## Usage
###  1.引入组件
```
import PanelView from 'react-native-cz-panel';

//Root的componentDidMount中初始化日志视图
this.panelView = new PanelView();
```

###  2.使用方法(目前只支持收集字符串类型)
```
全局只要做到第一部初始化即可。只是收集日志信息的话，需要做特殊处理：
正常的是 console.log('这里是日志1')，这种会显示在Console视图下；
如果想分开查看，使用console.log('key***Custom***key' + '这里是日志2')，这种会显示在Custom视图下。
```
