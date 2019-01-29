import React, { Component } from 'react';
import {View, Text, Image, StyleSheet, Animated, PanResponder, Dimensions, DeviceEventEmitter } from 'react-native';

export default class SwitchButtonView extends Component{

    SwitchButtonWidthHeight = 60;

    /************************** 生命周期 **************************/
    constructor(props) {
        super(props);
        this.initializeParams();
        this.evaluateFunc();
        this.createGesture();
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
            width: new Animated.Value(this.SwitchButtonWidthHeight),
            height: new Animated.Value(this.SwitchButtonWidthHeight),
            left: new Animated.Value(this.SwitchButtonWidthHeight/2),
            top: new Animated.Value(this.SwitchButtonWidthHeight/2),
            radius: new Animated.Value(this.SwitchButtonWidthHeight/2),
            show: true
        };
        //屏幕宽高
        this.SCREENW = Dimensions.get('window').width;
        this.SCREENH = Dimensions.get('window').height;
        //按钮相对于左上角的x,y
        this.switchButtonViewLeft = this.SwitchButtonWidthHeight/2;
        this.switchButtonViewTop = this.SwitchButtonWidthHeight/2;
        //是否删除Panel视图
        this.DeleteViewAmplify = false;
        //是否已显示删除视图
        this.isShowDeleteView = false;
    }

    /*
    * 赋值存储Func
    * */
    evaluateFunc() {
        global.CZPanelFuncDic['SwitchButtonView-shrinkSwitchButton'] = this.shrinkSwitchButton;
    }

    /*
    * 创建手势事件
    * */
    createGesture() {
        const { SCREENW, SCREENH } = this;
        //https://reactnative.cn/docs/0.51/panresponder/
        this._switchButtonPanResponder = PanResponder.create({
            // 要求成为响应者：
            onStartShouldSetPanResponder: (evt, gestureState) => true,
            onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
            onMoveShouldSetPanResponder: (evt, gestureState) => true,
            onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
            // 开始手势操作。给用户一些视觉反馈，让他们知道发生了什么事情！
            onPanResponderGrant: (evt, gestureState) => {
                this.isClicked = true;
                this.DeleteViewAmplify = false;
            },
            // 最近一次的移动距离为gestureState.move{X,Y}
            // 从成为响应者开始时的累计手势移动距离为gestureState.d{x,y}
            onPanResponderMove: (evt, gestureState) => {
                if (gestureState.dx < 5 && gestureState.dx > -5 && gestureState.dy < 5 && gestureState.dy > -5) {
                    this.isClicked = true;
                } else {
                    this.isClicked = false;
                    //移动SwitchButton视图
                    let left = this.switchButtonViewLeft + gestureState.dx;
                    let top = this.switchButtonViewTop + gestureState.dy;
                    this.refs.switchButtonView.setNativeProps({
                        left: left <= 0 ? 0 : left,
                        top: top <= 0 ? 0 : top
                    });

                    //显示删除视图
                    if (!this.isShowDeleteView) (global.CZPanelFuncDic['ExtraAreaView-show'])();

                    //判断放大or缩小删除视图
                    if (!this.DeleteViewAmplify && left >= (SCREENW - 60 - this.SwitchButtonWidthHeight) && top >= (SCREENH - 60 - this.SwitchButtonWidthHeight) ) {
                        this.DeleteViewAmplify = true;
                        (global.CZPanelFuncDic['ExtraAreaView-amplify'])();
                    } else if (this.DeleteViewAmplify && (left < (SCREENW - 60 - this.SwitchButtonWidthHeight) || top < (SCREENH - 60 - this.SwitchButtonWidthHeight)) ) {
                        this.DeleteViewAmplify = false;
                        (global.CZPanelFuncDic['ExtraAreaView-shrink'])();
                    }
                }
            },
            // 用户放开了所有的触摸点，且此时视图已经成为了响应者。
            // 一般来说这意味着一个手势操作已经成功完成。
            onPanResponderRelease: (evt, gestureState) => {
                if (this.isClicked) {
                    this.clickSwitchButton();
                } else {
                    this.switchButtonViewLeft += gestureState.dx;
                    this.switchButtonViewTop += gestureState.dy;
                }
                //显示 隐藏视图框
                (global.CZPanelFuncDic['ExtraAreaView-hide'])();
                this.isShowDeleteView = false;
                if (this.DeleteViewAmplify) {
                    DeviceEventEmitter.emit('CZPanelCloseAll');
                }
            }
        });
    }

    /*
    * 隐藏当前视图，显示LogView视图
    * */
    clickSwitchButton() {
        const { SCREENW, SCREENH } = this;
        //先动画扩大
        Animated.parallel([
            Animated.timing(this.state.width,{toValue: SCREENW,duration: 300}),
            Animated.timing(this.state.height,{toValue: SCREENH,duration: 300}),
            Animated.timing(this.state.left,{toValue: 0,duration: 300}),
            Animated.timing(this.state.top,{toValue: 0,duration: 300}),
            Animated.timing(this.state.radius,{toValue: 0,duration: 300})
        ]).start( () => {
            this.hide();
            (global.CZPanelFuncDic['LogView-show'])();
        });
    }

    /*
    * 显示当前视图，隐藏LogView视图
    * */
    shrinkSwitchButton = () => {
        this.setState({
            show: true
        }, () => {
            //缩小回以前尺寸
            Animated.parallel([
                Animated.timing(this.state.width,{toValue: this.SwitchButtonWidthHeight,duration: 300}),
                Animated.timing(this.state.height,{toValue: this.SwitchButtonWidthHeight,duration: 300}),
                Animated.timing(this.state.left,{toValue: this.switchButtonViewLeft,duration: 300}),
                Animated.timing(this.state.top,{toValue: this.switchButtonViewTop,duration: 300}),
                Animated.timing(this.state.radius,{toValue: this.SwitchButtonWidthHeight/2,duration: 300})
            ]).start();
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
    /************************** 子组件回调方法 **************************/
    /************************** 外部调用方法 **************************/
    /************************** List相关方法 **************************/
    /************************** Render中方法 **************************/
    render() {
        const { width, height, left, top, radius, show } = this.state;
        if (!show) return null;

        return (
            <Animated.View ref='switchButtonView' {...this._switchButtonPanResponder.panHandlers} style={[styles.MainView, {width: width, height: height, left: left, top: top, borderRadius: radius}]}>
                <Image source={require('./images/pikaqiu_icon.jpeg')} style={{width: 40, height: 40, borderRadius: 20}}/>
            </Animated.View>
        );
    }
}

const styles = StyleSheet.create({

    MainView: {
        position: 'absolute',
        zIndex: 3993,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center'
    }
})