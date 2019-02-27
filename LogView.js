import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, Clipboard } from 'react-native';
import CZScrollTab from 'react-native-cz-scroll-tab';

export default class LogView extends Component{

    /************************** 生命周期 **************************/
    constructor(props) {
        super(props);
        this.initializeParams();
        this.rewriteConsoleLogFunc();
        this.evaluateFunc();
    }
    /************************** 继承方法 **************************/
    /************************** 通知 **************************/
    /************************** 创建视图 **************************/
    /************************** 网络请求 **************************/
    /************************** 自定义方法 **************************/
    /*
    * 初始化参数
    * */
    initializeParams() {
        this.state = {
            show: false
        };
    }

    /*
    * 赋值存储Func
    * */
    evaluateFunc() {
        global.CZPanelFuncDic['LogView-show'] = this.show;
    }

    /*
    * 重写console.log，收集信息
    * */
    rewriteConsoleLogFunc() {
        let originRef = this;
        console.log = (function (originFunc) {
            return function (info) {
                if (!originRef.consolesDic) originRef.consolesDic = {};

                //只记录字符串
                if (typeof info == 'string') {
                    //是否存储到其它Tab
                    let otherKey = false;
                    if (info.indexOf('key***') == 0) {
                        let index = info.indexOf('***key');
                        if (index != -1) {
                            let key = info.substring(6, index);
                            let keyArr = originRef.consolesDic[key] ? originRef.consolesDic[key] : [];
                            keyArr.push(info.substr(12 + key.length, info.length - 12 - key.length));
                            originRef.consolesDic[key] = keyArr;
                            otherKey = true;
                        }
                    }

                    if (!otherKey) {
                        let consoleArr = originRef.consolesDic['console'] ? originRef.consolesDic['console'] : [];
                        consoleArr.push(info);
                        originRef.consolesDic['console'] = consoleArr;
                    }
                }
                originFunc.call(console, info);
            }
        })(console.log);
        console.log('');
    }

    /*
    * Cell文本长按事件
    * */
    _textOnLongPress(index) {
        const { showKey } = this.state;
        let item = this.consolesDic[showKey] ? (this.consolesDic[showKey][index] ? this.consolesDic[showKey][index] : '') : '';
        Clipboard.setString(item);
    }
    /************************** 子组件回调方法 **************************/
    /************************** 外部调用方法 **************************/
    /*
    * 显示当前视图
    * */
    show = () => {
        this.setState({
            show: true,
            showKey: ''
        });
    }

    /*
    * 隐藏当前视图
    * */
    hide() {
        this.setState({
            show: false
        });
    }
    /************************** List相关方法 **************************/
    _renderConsoleItem(item) {
        return (
            <View>
                <Text style={[styles.CellTextView]} onLongPress={this._textOnLongPress.bind(this, item.index)}>{item.item}</Text>
                <View style={[{height: 1, backgroundColor: '#999999'}]}></View>
            </View>
        )
    }
    /************************** Render中方法 **************************/
    //清除日志
    _clearConsole() {
        this.consolesDic = {};
        this.setState({
            showKey: ''
        });
    }

    //关闭当前日志视图
    _closeLogView() {
        this.hide();
        (global.CZPanelFuncDic['SwitchButtonView-shrinkSwitchButton'])();
    }

    //获取Tab列表数组
    _getTabDic() {
        const { consolesDic } = this;

        //顶部Tab
        let tabList = Object.keys(consolesDic);
        let tabArray = [];
        tabList.forEach( (value) => {
            tabArray.push({'name': value});
        });
        return tabArray;
    }

    //获取显示的Key值
    _getShowKey(value) {
        const { showKey } = this.state;
        if (showKey.length > 0) return showKey;
        else return value['name'] ? value['name'] : 'console';
    }

    //点击Tab事件
    _selectItemAtIndex(item, index) {
        this.setState({
            showKey: item['name']
        });
    }

    render() {
        const { show, showKey } = this.state;
        if (!show) return null;

        const { consolesDic } = this;

        //获取Tab列表数组
        let tabArray = this._getTabDic();
        //获取日志数组
        let list = consolesDic[this._getShowKey(tabArray[0] ? tabArray[0] : {})];


        return (
            <View style={[styles.MainView]}>
                <View style={[styles.LogTopView]}>
                    <TouchableOpacity onPress={this._clearConsole.bind(this)}>
                        <Text style={[{color: 'red', fontSize: 22}]}>Clear</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this._closeLogView.bind(this)}>
                        <View style={[styles.ExitButtonView]}>
                            <Image source={require('./images/exit_icon.png')} style={{width: 26, height: 26}}/>
                        </View>
                    </TouchableOpacity>
                </View>
                <CZScrollTab isScroll={true} style={{height: 50}} list={tabArray} normalTextStyles={{color: 'red', fontSize: 18}} selectedTextStyles={{color: 'red', fontSize: 22}} selectItemAtIndex={this._selectItemAtIndex.bind(this)}></CZScrollTab>
                <View style={[{flex: 1}]}>
                    <FlatList
                        style={[{flex: 1}]}
                        data={list}
                        renderItem={this._renderConsoleItem.bind(this)}
                    />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    MainView: {
        position: 'absolute',
        zIndex: 3992,
        backgroundColor: 'rgba(0,0,0,0.5)',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
    },

    LogTopView: {
        height: 80,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center'
    },

    ExitButtonView: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 60,
        height: 60,
        marginRight: 10
    },

    CellTextView: {
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 15,
        marginRight: 15,
        fontSize: 17,
        color: 'white'
    }
})