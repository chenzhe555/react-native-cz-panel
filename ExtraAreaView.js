import React, { Component } from 'react';
import { View,Text, StyleSheet, Image, Animated } from 'react-native';

export default class ExtraAreaView extends Component{

    /************************** 生命周期 **************************/
    constructor(props) {
        super(props);
        this.initializeParams();
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
            scale: new Animated.Value(1),
            show: false
        };
        this.test = false;
    }

    /*
    * 赋值存储Func
    * */
    evaluateFunc() {
        global.CZPanelFuncDic['ExtraAreaView-show'] = this.show;
        global.CZPanelFuncDic['ExtraAreaView-hide'] = this.hide;
        global.CZPanelFuncDic['ExtraAreaView-amplify'] = this.amplify;
        global.CZPanelFuncDic['ExtraAreaView-shrink'] = this.shrink;
    }

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
    hide = () => {
        this.setState({
            show: false
        });
    }

    /*
    * 动画扩大
    * */
    amplify = () => {
        Animated.timing(this.state.scale,{toValue: 1.2}, 100).start();
    }

    /*
    * 动画缩小
    * */
    shrink = () => {
        Animated.timing(this.state.scale,{toValue: 1}, 100).start();
    }
    /************************** 子组件回调方法 **************************/
    /************************** 外部调用方法 **************************/
    /************************** List相关方法 **************************/
    /************************** Render中方法 **************************/

    render() {
        const { scale, show } = this.state;
        if (!show) return null;

        return (
            <Animated.View style={[styles.MainView, {transform: [{scale: scale}]}]}>
                <View style={[styles.ContentView]}>
                    <Image source={require('./images/delete_btn.png')} style={[styles.DeleteButtonView]}/>
                    <Text style={[styles.TextView]}>取消浮窗</Text>
                </View>
            </Animated.View>
        )
    }
}

const styles = StyleSheet.create({
    MainView: {
        position: 'absolute',
        zIndex: 3991,
        backgroundColor: 'red',
        width: 160,
        height: 160,
        borderRadius: 80,
        marginRight: -80,
        marginBottom: -80,
        right: 0,
        bottom: 0
    },

    ContentView: {
        width: 80,
        height: 80,
        alignItems: 'center',
        justifyContent: 'center'
    },

    DeleteButtonView: {
        width: 30,
        height: 30,
        marginLeft: 15,
        marginTop: 10
    },

    TextView: {
        fontSize: 13,
        color: '#999999',
        marginTop: 5,
        marginLeft: 15
    }
})