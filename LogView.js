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
                if (originRef.consoles) {
                    //目前只收集字符串类型数据
                    if (typeof info == 'string' && info.length > 0) originRef.consoles.push(info);
                } else {
                    originRef.consoles = [];
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
        let item = this.consoles[index];
        Clipboard.setString(item);
    }
    /************************** 子组件回调方法 **************************/
    /************************** 外部调用方法 **************************/
    /*
    * 显示当前视图
    * */
    show = () => {
        this.setState({
            show: true
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
    _closeLogView() {
        this.hide();
        (global.CZPanelFuncDic['SwitchButtonView-shrinkSwitchButton'])();
    }

    render() {
        const { show } = this.state;
        if (!show) return null;

        const { consoles } = this;

        return (
            <View style={[styles.MainView]}>
                <View style={[styles.LogTopView]}>
                    <TouchableOpacity onPress={this._closeLogView.bind(this)}>
                        <View style={[styles.ExitButtonView]}>
                            <Image source={require('./images/exit_icon.png')} style={{width: 26, height: 26}}/>
                        </View>
                    </TouchableOpacity>
                </View>
                <CZScrollTab style={{height: 50}} list={[{'name': 'console'}, {'name': 'http'}]} normalTextStyles={{color: 'red', fontSize: 18}} selectedTextStyles={{color: 'red', fontSize: 22}}></CZScrollTab>
                <View style={[{flex: 1}]}>
                    <FlatList
                        style={[{flex: 1}]}
                        data={consoles}
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