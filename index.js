import React, {Component} from 'react';
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity, Animated, FlatList, DeviceEventEmitter } from 'react-native';
import CZPackElement from 'react-native-cz-pack-element';
import SwitchButtonView from './SwitchButtonView';
import LogView from './LogView';
import ExtraAreaView from './ExtraAreaView';

/*
* zIndex: 3991,3992,3993
* */
//存储各种Func
global.CZPanelFuncDic = {};
export default class CZPanel extends Component{


    /************************** 生命周期 **************************/
    constructor(props) {
        super(props);
        this.initializeParams();
        this.initializeViews();
        this.registNotification();
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

    }

    /*
    * 初始化视图
    * */
    initializeViews() {
        this.extraAreaView = new CZPackElement(<ExtraAreaView></ExtraAreaView>);
        this.switchButtonView = new CZPackElement(<SwitchButtonView></SwitchButtonView>);
        this.logView = new CZPackElement(<LogView></LogView>);
    }

    /*
    * 注册移除通知
    * */
    registNotification() {
        this.closeAllView = DeviceEventEmitter.addListener('CZPanelCloseAll', () => {
            if (this.switchButtonView) this.switchButtonView.destoryElement();
            if (this.logView) this.logView.destoryElement();
            if (this.extraAreaView) this.extraAreaView.destoryElement();
            if (this.closeAllView) this.closeAllView.remove();
        });
    }

    /************************** 子组件回调方法 **************************/
    /************************** 外部调用方法 **************************/
    /************************** List相关方法 **************************/
    /************************** Render中方法 **************************/

}

const styles = StyleSheet.create({
    MainView: {
        position: 'absolute',
        zIndex: 10000,
        backgroundColor: 'red',
        width: 0,
        height: 0
    },

    SwitchButtonView: {
        backgroundColor: 'rgba(0,0,0,0.5)'
    },

    PanelView: {
        backgroundColor: 'rgba(0,0,0,0.5)'
    },

    PanelTopView: {
        height: 80,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center'
    },

    CenterStyle: {
        justifyContent: 'center',
        alignItems: 'center'
    }
})

