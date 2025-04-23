import React, {useEffect, useRef, lazy, useCallback, useMemo, memo} from 'react';
import {
    // Attachments,
    // Prompts,
    // Bubble,
    // Sender,
    // Welcome,
    // useXAgent,
    // useXChat,
    ConversationsProps,
} from '@ant-design/x';

const Conversations = memo(lazy(() => import('@ant-design/x').then(module => ({ default: module.Conversations }))));
// const Bubble = lazy(() => import('@ant-design/x').then(module => ({ default: module.Bubble })));

import { createStyles } from 'antd-style';
import {
    // CloudUploadOutlined,
    // CommentOutlined,
    // EllipsisOutlined,
    // FireOutlined,
    // HeartOutlined,
    // PaperClipOutlined,
    PlusOutlined,
    RightOutlined,
    // ReadOutlined,
    // ShareAltOutlined,
    // SmileOutlined,
} from '@ant-design/icons';
import {type GetProp, Button, Modal, Row, Col, Input, Flex, FloatButton, Drawer} from 'antd';
import {SideSheet, Notification, Empty, Toast, MarkdownRender} from '@douyinfe/semi-ui';
import { IllustrationConstruction, IllustrationConstructionDark } from '@douyinfe/semi-illustrations';
import { JSX } from 'react/jsx-runtime';
import UserBar from "./components/UserBar.tsx";
// import Cookies from 'js-cookie';
import {hostAddr, hostWsAddr} from "./serverConfig.tsx";
import bit_logo from './assets/logo_01.svg';
import { DeleteOutlined, EditOutlined} from '@ant-design/icons';
import LazyImportSuspense from "@bytelan/silkroad-platform/src/LazyImportSuspense.tsx";
import {toNumber} from "lodash";
// import ImChatTitle from "./components/ImChatTitle.tsx";
const ImChatTitle = lazy(() => import('./components/ImChatTitle.tsx'));
// import ImChat from "./components/ImChat.tsx";
const ImChat = lazy(() => import('./components/ImChat.tsx'));

// const AnylogicSimulationDemoPage = lazy(() => import("./components/anylogic-simulation-demo/AnylogicSimulationDemoPage.tsx"));


// 隐藏菜单的媒体宽度
const hideMenuMediaWidth = 850;

const useStyle = createStyles(({token, css}) => {

    return {
        layout: css`
            width: 100%;
            min-width: 300px;
            height: 100%;
            min-height: 400px;
            //border-radius: ${token.borderRadius}px;
            display: flex;
            background: ${token.colorBgContainer};
            background-color: rgba(var(--semi-indigo-0), 1);
            font-family: AlibabaPuHuiTi, ${token.fontFamily}, sans-serif;

            .ant-prompts {
                color: ${token.colorText};
            }
        `,
        menu: css`
                //@media (min-width: ${hideMenuMediaWidth}px) {

            background: ${token.colorBgLayout}80;
            background-color: rgba(var(--semi-indigo-0), 1);
            width: 20%;
            max-width: 300px;
            height: 100%;
            display: flex;
            flex-direction: column;
            border-radius: ${token.borderRadius}px;
            //}
                // @media (max-width: ${hideMenuMediaWidth}px) {
                //     background: ${token.colorBgLayout}80;
            //     width: 0;
            //     visibility: hidden;
            //     height: 100%;
            //     display: flex;
            //     flex-direction: column;
                //     border-radius: ${token.borderRadius}px;
            // }

        `,
        conversations: css`
            padding: 0 12px;
            flex: 1;
            overflow-y: auto;
            list-style: none;
            ul , li {
                padding-inline-start: 0;
            }
        `,
        chat: css`
            height: calc(100% - 12px);
            width: calc(80% - 12px);
            margin: 0 auto;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            padding: 16px;
            padding-top: 6px;
            padding-bottom: 8px;
            gap: 6px;
            background-color: white;
            border-radius: 12px;
            margin-top: 6px;
            margin-bottom: 6px;
            margin-left: 6px;
            margin-right: 6px;
        `,
        messages: css`
            flex: 1;
            ////定义滚动条高宽及背景，高宽分别对应横竖滚动条的尺寸
            //::-webkit-scrollbar {
            //    width: 8px;
            //    height: 8px;
            //    background-color: rgba(0,0,0,.2);
            //}
            //
            ////定义滚动条轨道，内阴影+圆角
            //::-webkit-scrollbar-track
            //{
            //    -webkit-box-shadow:inset 0 0 6px rgba(0,0,0,0.3);
            //    border-radius:10px;
            //    background-color:#F5F5F5;
            //}
            ////定义滑块内阴影+圆角
            //::-webkit-scrollbar-thumb
            //{
            //    border-radius:10px;
            //    -webkit-box-shadow:inset 0 0 6px rgba(0,0,0,.3);
            //    background-color: #b3b3b3;
            //}
        `,
        placeholder: css`
            padding-top: 32px;
        `,
        sender: css`
            box-shadow: ${token.boxShadow};
        `,
        logo: css`
            display: flex;
            height: 72px;
            align-items: center;
            justify-content: start;
            padding: 0 24px;
            box-sizing: border-box;

            img {
                width: 24px;
                height: 24px;
                display: inline-block;
            }

            span {
                display: inline-block;
                margin: 0 8px;
                font-weight: bold;
                color: ${token.colorText};
                font-size: 16px;
            }
        `,
        addBtn: css`
            background: #1677ff0f;
            border: 1px solid #1677ff34;
            width: calc(100% - 24px);
            margin: 0 12px 2px 12px;
        `,
    };
});


const ConversationDateGroup = {
    Today: '一天内',
    Week: '近七天',
    Earlier: '更早',
}

function getConversationGroupByTimeStamp(timeStamp: string|number) {
    // timeStamp转long数字
    const time = toNumber(timeStamp);
    // 获得当前UNIX时间戳
    const nowTime = Date.now();
    const diff = nowTime - time;
    if(diff < 1000 * 60 * 60 * 24){
        return ConversationDateGroup.Today;
    }else if(diff < 1000 * 60 * 60 * 24 * 7){
        return ConversationDateGroup.Week;
    }else{
        return ConversationDateGroup.Earlier;
    }
}

// let setRightNodeFn: ((arg0: JSX.Element) => void) | undefined;
// let exampleSideChangeFn: (() => void) | undefined;
let windowChatSize: number[] = [1,0];
let setChatSizeString: (size: string) => void | undefined;
let setSubPageSizeFn: (size: string) => void | undefined;
// let handleResizePublic: () => void | undefined;

function checkRightSize():void{
    // console.log(windowChatSize);
    if (windowChatSize[1]>20){
        return
    }
    // const opts = {
    //     duration: 3,
    //     position: 'bottomRight',
    //     content: '请将鼠标移到窗口右侧，出现调整光标后将右侧隐藏页面拉开。',
    //     title: '右侧边栏未展开',
    // };
    // Notification.warning({ ...opts, position: 'bottomRight' })
    const opts = {
        duration: 5,
        position: 'bottomRight',
        content: '您可以通过拖动中间的分隔条来改变大小或关闭。',
        title: '已展开右侧边栏',
    };
    Notification.warning({ ...opts, position: 'bottomRight' })
    if(setChatSizeString !== undefined && setSubPageSizeFn !== undefined){
        // console.log("setChatSizeString 45%");
        setChatSizeString('40%');
        setSubPageSizeFn('60%');
        windowChatSize[1] = 21;
        // console.warn("handrsz: "+handleResizePublic);
        // if(handleResizePublic !== undefined) {
        //     console.warn("in handlersz")
        //     handleResizePublic();
        // }
    }
}



function convertRole(messageUid:string, messageType:string){
    if(messageUid.startsWith("-")){
        return messageType=='ai_mdx'?'aiMdx':'ai';
    }else{
        return 'local';
    }
}

function convertLoading(messageUid:string, messageStatus:string){
    return messageUid.startsWith("-") && !messageStatus.startsWith('ai_complete');
}


function FullChatApp ({rightNodeFn, innerRef, chatSizeConst, setChatSize, chatSize, setSubPageSize}: { rightNodeFn: (node: JSX.Element) => void, innerRef: React.MutableRefObject<{ handleResize: () => void } | null>, chatSizeConst: number[], setChatSize: any, chatSize: any, setSubPageSize: any }) {
    // setRightNodeFn = rightNodeFn;
    windowChatSize = chatSizeConst;
    setChatSizeString = setChatSize;
    setSubPageSizeFn = setSubPageSize;
    const [appName, setAppName] = React.useState('丝路大模型');
    const [tempCkid, setTempCkid] = React.useState('');
    const [userName, setUserName] = React.useState('');
    const [loginState, setLoginState] = React.useState(false);
    const [messageItems, setMessageItems] = React.useState<{key:string,loading:boolean,role:string,content:string}[]>([]);
    const [conversationItems, setConversationItems] = React.useState<{key:string,label:string,group:string}[]>([]);
    const conversationItemsRef = useRef(conversationItems);
    const [isCreatingConversation, setIsCreatingConversation] = React.useState(false);
    const [demoButtonNode, setDemoButtonNode] = React.useState<JSX.Element|null>(<></>);
    // const [menuPlacement, setMenuPlacement] = React.useState<'Default'|'Drawer'>('Default');
    const [menuDrawerOpen, setMenuDrawerOpen] = React.useState(false);

    const [socketReconnecting, setSocketReconnecting] = React.useState(false);
    const socketReconnectingRef = useRef(socketReconnecting);
    useEffect(() => {
        socketReconnectingRef.current = socketReconnecting;
    }, [socketReconnecting]);
    const socketReconnectCountRef = useRef(0);
    const [modelList, setModelList] = React.useState<{key:string, name:string, property?: string[]}[]>([{key: "default", name: "多智能体（默认）"},{key: "DeepseekR1Ali", name: "Deepseek R1 - 阿里云"},{key: "DeepseekR1AliSilkroad", name: "Deepseek R1 - 供应链专家"},{key: "QwenMax", name: "千问Max - 效果出众"},{key: "QwenTurbo", name: "千问Turbo - 速度最快"},{key: "QwenLong", name: "千问Long - 适合长文本"},{key: "oldMa", name: "多智能体（非流式，弃用）"}]);
    const modelListRef = useRef(modelList);
    useEffect(() => {
        modelListRef.current = modelList;
    }, [modelList]);

    // ==================== Style ====================
    const { styles } = useStyle();

    // ==================== State ====================
    // const [headerOpen, setHeaderOpen] = React.useState(false);
    //
    // const [inputContent, setInputInputContent] = React.useState('');


    const [activeKey, setActiveKey] = React.useState("");
    const activeKeyRef = useRef(activeKey);
    const [chatTitle, setChatTitle] = React.useState<string>("");
    const [messageContentReplacementTitle, setMessageContentReplacementTitle] = React.useState("请先登录");
    const messageContentReplacementTitleRef = useRef(messageContentReplacementTitle);

    const [modelName, setModelName] = React.useState<string>("default");
    const [historyRound, setHistoryRound] = React.useState<number>(10);

    // const [attachedFiles, setAttachedFiles] = React.useState<GetProp<typeof Attachments, 'items'>>(
    //     [],
    // );

    const [menuWidth, setMenuWidth] = React.useState('20%');// 初始宽度
    const [chatWidth, setChatWidth] = React.useState('80%');// 初始宽度
    const [menuVisible, setMenuVisible] = React.useState<'visible'|'hidden'>('visible');
    const layoutRef = React.useRef<HTMLDivElement>(null);

    // Modal rename
    const renameName = useRef('');
    // const [renameName, setRenameName] = React.useState('');
    // const [renameConversationKey, setRenameConversationKey] = React.useState('');

    useEffect(() => {
        activeKeyRef.current = activeKey;
    }, [activeKey]);

    useEffect(() => {
        messageContentReplacementTitleRef.current = messageContentReplacementTitle;
    }, [messageContentReplacementTitle]);

    useEffect(() => {
        conversationItemsRef.current = conversationItems;
    }, [conversationItems]);

    useEffect(() => {
        // 找到当前activeKey在ConversationItemsRef.current中对应的label
        conversationItems.findIndex((item) => {
            if(item.key == activeKey){
                if(item.label == null){
                    setChatTitle("");
                }else{
                    setChatTitle(item.label);
                }
                return true;
            }
        });
    }, [activeKey,conversationItems]);

    const setModelNameDefault = React.useCallback(() => {
        // 获取网址参数中的modelName
        const urlParams = new URLSearchParams(window.location.search);
        const modelNameParam = urlParams.get('modelName');
        if(modelNameParam){
            modelListRef.current.map((item) => {
                if(item.key == modelNameParam){
                    setModelName(modelNameParam);
                }
            });
        }
        // setModelName("default");
    }, []);


    const menuConfig: ConversationsProps['menu'] = useCallback((conversation) => ({
        items: [
            {
                label: '重命名会话',
                key: 'editName',
                icon: <EditOutlined />,
            },
            {
                label: '删除会话',
                key: 'deleteConversation',
                icon: <DeleteOutlined />,
                danger: true,
            },
        ],
        onClick: (menuInfo) => {
            if(menuInfo.key === 'editName'){
                Modal.confirm({
                    title: '重命名会话',
                    maskClosable: true,
                    content: (
                        <Flex vertical={true}>
                            <p>重命名会话：{conversation.label}</p>
                            <Row>
                                <Col flex='80px'>新名称：</Col>
                                <Col flex='auto'><Input onChange={(e) => renameName.current = e.target.value}/></Col>
                            </Row>
                        </Flex>
                    ),
                    onOk() {
                        return new Promise((resolve, reject) => {
                            fetch(hostAddr+'ai_chat/api/rename_conversation',{
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                credentials: 'include',
                                body: JSON.stringify({
                                    conversationId: conversation.key,
                                    newConversationName: renameName.current
                                })
                            }).then(response => {
                                return response.json();
                            }).then(data => {
                                if (data.responseStatus == 'success') {
                                    const newConversationItems = conversationItems.map((item) => {
                                        if(item.key == conversation.key){
                                            // if(activeKey==conversation.key){
                                            //     setChatTitle(renameName.current);
                                            // }
                                            return {
                                                key: item.key,
                                                label: renameName.current,
                                                group: ConversationDateGroup.Today
                                            }
                                        }else{
                                            return item;
                                        }
                                    });
                                    const index = newConversationItems.findIndex((item) => item.key == conversation.key);
                                    if(index == -1){
                                        console.error('重命名会话失败！本地列表错误！ '+conversation.key+' '+conversation.label+' '+renameName.current+' '+data);
                                        reject();
                                    }else{
                                        const thisItem = newConversationItems[index];
                                        newConversationItems.splice(index, 1);
                                        setConversationItems([thisItem, ...newConversationItems]);
                                        const opts = {
                                            content: "["+renameName.current+"] 重命名成功！",
                                            duration: 3,
                                            stack: true,
                                            theme: 'light',
                                        }
                                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                        // @ts-expect-error
                                        Toast.success(opts);
                                        resolve();
                                    }
                                }else{
                                    console.error('重命名会话失败！返回错误 '+conversation.key+' '+conversation.label+' '+renameName.current+' '+data);
                                    reject();
                                }
                            }).catch(() => {
                                reject();
                            })
                        }).catch(() => {
                            console.error('重命名会话失败！ '+conversation.key+' '+conversation.label+' '+renameName.current);
                            const opts = {
                                content: "[重命名会话] 失败！ "+conversation.key+" "+conversation.label+" "+renameName.current,
                                duration: 3,
                                stack: true,
                                theme: 'light',
                            }
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            // @ts-expect-error
                            Toast.error(opts);
                            // Promise.reject();
                        })
                    },
                });
            }else if(menuInfo.key === 'deleteConversation'){
                Modal.confirm({
                    title: '确认删除？',
                    maskClosable: true,
                    content: '确认删除会话：'+conversation.label,
                    onOk() {
                        return new Promise((resolve, reject) => {
                            fetch(hostAddr+'ai_chat/api/delete_conversation',{
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                credentials: 'include',
                                body: JSON.stringify({
                                    conversationId: conversation.key
                                })
                            }).then(response => {
                                return response.json();
                            }).then(data => {
                                if (data.responseStatus == 'success') {
                                    // const newConversationItems = conversationItems.map((item) => {
                                    //     if(item.key != conversation.key){
                                    //         return item;
                                    //     }else{
                                    //         return null;
                                    //     }
                                    // });
                                    // console.warn("deleteConversation");
                                    // console.warn(newConversationItems);
                                    const indexToDelete = conversationItemsRef.current.findIndex((item) => item.key == conversation.key);
                                    if(indexToDelete == -1){
                                        console.error('删除会话失败！本地列表错误！ '+conversation.key+' '+conversation.label+' '+data);
                                        reject();
                                    }
                                    conversationItemsRef.current.splice(indexToDelete, 1);
                                    setConversationItems([...conversationItemsRef.current]);
                                    setActiveKey('');
                                    const opts = {
                                        content: "["+conversation.label+"] 删除成功！",
                                        duration: 3,
                                        stack: true,
                                        theme: 'light',
                                    }
                                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                    // @ts-expect-error
                                    Toast.success(opts);
                                    resolve();
                                }else{
                                    // console.error('删除会话失败！ '+conversation.key+' '+conversation.label+' '+data);
                                    // const opts = {
                                    //     content: "[删除会话] 请求异常！ "+conversation.key+" "+conversation.label+" "+data,
                                    //     duration: 3,
                                    //     stack: true,
                                    //     theme: 'light',
                                    // }
                                    // // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                    // // @ts-expect-error
                                    // Toast.error(opts);
                                    reject();
                                }
                            }).catch(() => {
                                reject();
                            });
                            // throw new Error('删除会话失败！ '+conversation.key+' '+conversation.label);等效于reject();
                        }).catch(() => {
                            console.log('删除会话失败！ '+conversation.key+' '+conversation.label);
                            const opts = {
                                content: "[删除会话] 失败！ "+conversation.key+" "+conversation.label,
                                duration: 3,
                                stack: true,
                                theme: 'light',
                            }
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            // @ts-expect-error
                            Toast.error(opts);
                        });
                    },
                });


            }else{
                const opts = {
                    content: "[menu] 未知操作",
                    duration: 3,
                    stack: true,
                    theme: 'light',
                }
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                Toast.warning(opts);
            }
            console.info(`Click ${conversation.key} - ${menuInfo.key}`);
        },
    }),[conversationItems]);


    const [exampleSideVisible, setEexampleSideVisible] = React.useState(false);
    const exampleSideChange = () => {
        setEexampleSideVisible(!exampleSideVisible);
    };

    // exampleSideChangeFn = exampleSideChange;

    // 使用 useRef 存储 socket 对象
    const socketRef = useRef<WebSocket | null>(null);
    useEffect(() => {
        function updateMessage(messageId:string, messageContent:string, conversationId:string, messageStatus:string, messageUid:string, messageType:string){
            console.log("updateMessage: "+messageId+" "+messageContent+" "+conversationId+" "+messageStatus+" "+messageUid+" "+activeKeyRef.current);
            if(activeKeyRef.current != null && activeKeyRef.current != '' && activeKeyRef.current == conversationId){
                setMessageItems(prevMessageItems => {
                    let hasItem = false;
                    let newMessageItems = prevMessageItems.map((item) => {
                        if(item.key == messageId){
                            hasItem = true;
                            //role: messageUid.startsWith("-")?(messageType=='ai_mdx'?'aiMdx':'ai'):'local',
                            return {
                                key: item.key,
                                loading: convertLoading(messageUid, messageStatus),
                                // loading: messageUid.startsWith("-") && !messageStatus.startsWith('ai_complete'),
                                role: convertRole(messageUid, messageType),
                                content: messageContent,
                            }
                        }else{
                            return item;
                        }
                    });
                    if(!hasItem){
                        newMessageItems = [...prevMessageItems, {
                            key: messageId,
                            loading: convertLoading(messageUid, messageStatus),
                            role: convertRole(messageUid, messageType),
                            content: messageContent,
                        }]
                    }
                    console.info(newMessageItems);
                    return newMessageItems;
                });
            }
        }

        function updateStreamMessage(messageId:string, messageContent:string, conversationId:string){
            if(activeKeyRef.current != null && activeKeyRef.current != '' && activeKeyRef.current == conversationId){
                setMessageItems(prevMessageItems => {
                    let hasItem = false;
                    let newMessageItem = prevMessageItems.map((item) => {
                        if(item.key == messageId){
                            hasItem = true;
                            return {
                                key: item.key,
                                loading: false,
                                role: 'aiProcessing',
                                content: item.content+messageContent,
                            }
                        }else{
                            return item;
                        }
                    })
                    if (!hasItem){
                        newMessageItem = [...prevMessageItems, {
                            key: messageId,
                            loading: false,
                            role: 'aiProcessing',
                            content: messageContent,
                        }]
                    }
                    return newMessageItem;
                });
            }
        }

        function createNewMessage(messageId:string, messageContent:string, conversationId:string, messageStatus:string, messageUid:string, messageType:string){
            console.log("createMessage: "+messageId+" "+messageContent+" "+conversationId+" "+messageStatus+" "+messageUid+" "+activeKeyRef.current);
            if(activeKeyRef.current != null && activeKeyRef.current != '' && activeKeyRef.current == conversationId) {
                setMessageItems(prevMessageItems => {
                    return [...prevMessageItems, {
                        key: messageId,
                        loading: convertLoading(messageUid, messageStatus),
                        role: convertRole(messageUid, messageType),
                        content: messageContent,
                    }]
                });
            }
        }

        function updateConversationName(conversationId:string, newConversationName:string){
            console.log("fun updateConversationName: "+conversationId+" "+newConversationName);
            const newConversationItems = conversationItemsRef.current.map((item) => {
                if(item.key == conversationId){
                    return {
                        key: item.key,
                        label: newConversationName,
                        group: item.group
                    }
                }else{
                    return item;
                }
            });
            setConversationItems(newConversationItems);
        }

        let heartbeatInterval: NodeJS.Timeout;

        function connectSocket(){
            socketReconnectingRef.current = false;

            function setReconnect(){
                if(socketReconnectingRef.current==true){
                    return;
                }
                socketReconnectCountRef.current += 1;
                if(socketReconnectCountRef.current > 20){
                    socketReconnectCountRef.current = 15;
                }
                socketReconnectingRef.current = true;
                // socketReconnectCountRef.current = 0;
                setSocketReconnecting(true);
                setTimeout(() => {
                    connectSocket();
                }, 1000+socketReconnectCountRef.current*2000);
                console.log('ws REconnecting');
            }

            if(loginState==false||tempCkid == ''){
                socketReconnectingRef.current = true;
                socketRef.current?.close();
                socketRef.current = null;
            }else{
                if(socketRef.current != null){
                    socketReconnectingRef.current = true;
                    socketRef.current.close();
                    socketRef.current = null;
                }
                socketRef.current = new WebSocket(hostWsAddr+'ai_chat/ws');

                socketRef.current.onopen = () => {
                    socketReconnectCountRef.current = 0;
                    setSocketReconnecting(false);
                    socketReconnectingRef.current = false;
                    console.log('ws opened');
                    socketRef.current?.send(JSON.stringify({
                        requestType: 'setActiveCkid',
                        activeCkid: tempCkid,
                    }));
                    heartbeatInterval = setInterval(() => {
                        socketRef.current?.send('{}');
                    }, 20000);
                }

                socketRef.current.onmessage = (event) => {
                    console.info("onMessage: "+event.data);
                    try{
                        if (event.data != null){
                            const jd = JSON.parse(event.data);
                            if(jd.responseType !=null) {
                                if(jd.responseType == 'updateMessageWithMessageIdAndConversationId'){
                                    updateMessage(jd.messageId, jd.updateMessageContent, jd.conversationId, jd.messageStatus, jd.messageUid, jd.messageType);
                                }else if(jd.responseType == 'updateConversationName'){
                                    updateConversationName(jd.conversationId, jd.updateNewConversationName);
                                }else if(jd.responseType == 'createNewMessage'){
                                    createNewMessage(jd.messageId, jd.updateMessageContent, jd.conversationId, jd.messageStatus, jd.messageUid, jd.messageType)
                                }else if(jd.responseType == 'updateStreamMessage') {
                                    updateStreamMessage(jd.messageId, jd.updateStreamMessageContent, jd.conversationId);
                                }
                            }
                        }
                    }catch (e) {
                        console.error("onMessageError: "+e);
                    }
                }

                socketRef.current.onclose = () => {
                    if(socketReconnectingRef.current==true){return}
                    clearInterval(heartbeatInterval);
                    console.error('ws on close');
                    setReconnect();
                }

                socketRef.current.onerror = () => {
                    if(socketReconnectingRef.current==true){return}
                    clearInterval(heartbeatInterval);
                    console.error('ws on error');
                    setReconnect();
                }
            }
        }

        connectSocket();


        return () => {
            console.log('close socket, tempCkid changed:'+tempCkid);
            socketReconnectingRef.current=true;
            clearInterval(heartbeatInterval);
            if(socketRef.current != null){
                socketRef.current.onclose = null;
                socketRef.current.onerror = null;
                socketRef.current.close();
                socketRef.current = null;
            }

        }
    }, [tempCkid, loginState]);

    const onLoginOption = useCallback(() => {
        setMessageItems([]);
        setConversationItems([]);
        setMessageContentReplacementTitle("请先选择一个会话或新建一个会话");
        fetch(hostAddr+'ai_chat/api/query_conversation_list',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: '{}'
        }).then(response => {
            return response.json();
        }).then(data => {
            if (data.responseStatus == 'success') {
                setConversationItems(data.conversationList.map((item) => {
                    const timeStamp = item.conversationLastUpdateTimeStamp;
                    return {
                        key: item.conversationId,
                        label: item.conversationName,
                        group: getConversationGroupByTimeStamp(timeStamp),
                    }
                }));
                import('./components/ImChat.tsx');
                import('./components/ImChatTitle.tsx');
                import('./components/ImChatSender.tsx');
            }else{
                setMessageContentReplacementTitle("读取会话列表失败，请刷新页面重试\n"+data);
            }
        }).catch((error) => {
            console.error('Error:', error);
            setMessageContentReplacementTitle("读取会话列表失败，请刷新页面重试\n"+error);
        });
    }, []);

    // ==================== Runtime ====================
    // const [agent] = useXAgent({
    //     request: async ({ message }, { onSuccess }) => {
    //         if (message === 'hello') {
    //             onSuccess('Hello! How can I help you?');
    //             // return;
    //         }
    //         if (message ==="help" || message ==="帮助" || message==="使用指导"){
    //             onSuccess(`## 支持Markdown和JSX混写 \n\n参考[SemiDesignMarkdown渲染器说明](https://semi.design/zh-CN/plus/markdownrender)\n\n注意： \\{\\} \\<\\> 等JSX符号需要转译，即实际传入的需要为 \\\\\\{ \\\\\\} \\\\\\< \\\\\\> \n\n图片示例：\\!\\[test picture\\](https://semi.design/dsm_manual/content/introduction/start/start-intro.png)\n\n点击图片可以放大\n\n![test picture](https://semi.design/dsm_manual/content/introduction/start/start-intro.png)\n\n直接在 Markdown 中书写 JSX ，例如写一个按钮：\n\n<MyButton onClick={()=>alert("一个弹窗")}>JS默认弹窗</MyButton>   <ExampleSideSheetShow>弹出侧边栏，查看示例语句</ExampleSideSheetShow>   点击按钮可以弹窗\n\n<IFrameButton src="https://mail.bit.edu.cn/">显示BIT邮箱</IFrameButton>   <IFrameButton src="https://www.bytelan.cn/">显示主页</IFrameButton>   点按钮可以在右侧显示网页\n\n你可以在下方输入框尝试输入Markdown格式和JSX内容，注意不要让 \\{\\} \\<\\> 等JSX符号单独出现，否则会崩溃`);
    //         }
    //
    //         // onSuccess(`### Mock success return.\n\n对话框输入help可查看帮助\n\n## You said: \n\n${message.replace(`\\`,`\\\\`).replace(`<`,`\\<`).replace(`>`,`\\>`).replace(`{`,`\\{`).replace(`}`,`\\}`)}`)
    //         onSuccess(`### Mock success return.\n\n对话框输入help可查看帮助\n\n## You said: \n\n${message}`)
    //
    //     },
    // });

    // const { onRequest, messages, setMessages } = useXChat({
    //     agent,
    // });



    useEffect(() => {
        // http请求
        fetch(hostAddr+'auth/api/ckidCheck',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: "{}"
        }).then(response => {
            return response.json();
        })
            .then(data => {
                if (data.responseStatus == 'ckidCheckSuccess') {
                    // Cookies.set('localckid',data.newCkid, { expires: 3 });
                    setTempCkid(data.newCkid);
                    setUserName(data.userName);
                    setLoginState(true);
                    onLoginOption();
                }
            }).catch((error) => {console.error('Error:', error);});
    }, []);

    // =========消息收取=========
    useEffect(() => {
        if (activeKey !== undefined && activeKey !== ""){
            setMessageContentReplacementTitle("");
            // 这里应该要取历史消息，或者放入一个开场欢迎语
            // setMessages([]);
            fetch(hostAddr+'ai_chat/api/query_conversation_messages',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    conversationId: activeKey
                })
            }).then(response => {
                return response.json();
            }).then(data => {
                if (data.responseStatus == 'success' && data.messageList!=null) {
                    setMessageItems(data.messageList.map((itemObj:unknown) => {
                        // console.log("role  ",item.uid.startsWith("-")?(item.messageType=='ai_mdx'?'aiMdx':'ai'):'local');
                        // role: item.uid.startsWith("-")?(item.messageType=='ai_mdx'?'aiMdx':'ai'):'local',
                        if(itemObj != null && itemObj!= undefined && itemObj instanceof Object && 'uid' in itemObj && 'messageContent' in itemObj && 'messageStatus' in itemObj && 'messageType' in itemObj && 'messageId' in itemObj){
                            const item = itemObj as {messageId:string, messageContent:string, messageStatus:string, uid:string, messageType:string};
                            return {
                                key: item.messageId,
                                loading: convertLoading(item.uid, item.messageStatus),
                                // loading: item.uid.startsWith("-") && !item.messageStatus.startsWith('ai_complete'),
                                role: convertRole(item.uid, item.messageType),
                                content: item.messageContent,
                            }
                        }
                    }).filter((item:unknown) => item !== undefined));

                    if(data.conversationSelectedHistoryRound){
                        const hr = toNumber(data.conversationSelectedHistoryRound);
                        if(hr && hr>0 && hr<201){
                            setHistoryRound(hr);
                        }else{
                            setHistoryRound(10);
                        }
                    }else{
                        setHistoryRound(10);
                    }

                    if(data.conversationSelectedModel){
                        let flag = false;
                        modelListRef.current.map((item) => {
                            if(item.key == data.conversationSelectedModel){
                                flag = true;
                            }
                        });
                        if(flag){
                            setModelName(data.conversationSelectedModel);
                        }else{
                            setModelName('default');
                        }
                    }else{
                        setModelName('default');
                    }
                    setModelNameDefault();
                }else{
                    setMessageContentReplacementTitle("读取消息列表失败，请刷新页面重试\n"+data);
                }
            }).catch((error) => {
                console.error('Error:', error);
                setMessageContentReplacementTitle("读取消息列表失败，请刷新页面重试\n"+error);
            })
        }else{
            if(messageContentReplacementTitleRef.current == ""){
                setMessageContentReplacementTitle("请选择一个会话或新建一个会话");
            }
        }
    }, [activeKey]);

    // const menuPlacementRef = React.useRef(menuPlacement);
    // useEffect(() => {
    //     menuPlacementRef.current = menuPlacement;
    // }, [menuPlacement]);


    const handleResize = useCallback(() => {
        // console.warn(layoutRef.current);
        if (layoutRef.current) {
            // console.warn(layoutRef.current.offsetWidth);
            const layoutWidth = layoutRef.current.offsetWidth;
            // 根据.layout的宽度设置menu的宽度逻辑
            if (layoutWidth > hideMenuMediaWidth) {
                setMenuWidth('20%');
                setChatWidth('max(calc(80% - 12px) , calc(100% - 312px))');
                // if(menuVisible!='visible'){
                //     setMenuVisible('visible');
                // }
                setMenuVisible('visible');
                // setMenuPlacement('Default');
                // menuPlacementRef.current = 'Default';
                setMenuDrawerOpen(false);
            } else {
                // if(menuPlacementRef.current == 'Drawer'){
                //     return;
                // }
                setMenuWidth('0');
                setChatWidth('calc(100% - 12px)');
                setMenuVisible('hidden');
            }
        }
    }, []);

    const onClickOpenMenu = useCallback(() => {
        // setMenuPlacement('Drawer');
        // menuPlacementRef.current = 'Drawer';
        // setMenuWidth('100%');
        setMenuDrawerOpen(true);
        // setMenuVisible('visible');
    }, []);
    
    const onClickCloseMenu = useCallback(() => {
        // setMenuPlacement('Default');
        // menuPlacementRef.current = 'Default';
        setMenuDrawerOpen(false);
        handleResize();
    }, [handleResize]);

    // handleResizePublic = handleResize;

    React.useImperativeHandle(innerRef, () => ({
        handleResize
    }))


    useEffect(() => {

        window.addEventListener('resize', handleResize);
        // 初始执行一次
        handleResize();
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // useEffect(() => {
    //     handleResize();
    // }, [chatSizeConst]);

    useEffect(() => {
        handleResize();
    }, [chatSize]);

    // ==================== Event ====================
    const onRequest = useCallback((nextContent: string)=> {
        if(activeKey == null || activeKey == ''){
            const opts = {
                content: "请先选择一个会话或新建一个会话（控件异常）",
                duration: 3,
                stack: true,
                theme: 'light',
            };
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            Toast.error(opts);
            return
        }
        if (loginState == false || tempCkid == '' ) {
            const opts = {
                content: "请先登录！（控件异常）",
                duration: 3,
                stack: true,
                theme: 'light',
            };
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            Toast.error(opts);
            return
        }
        fetch(hostAddr+'ai_chat/api/query_message',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                conversationId: activeKey,
                messageContent: nextContent,
                modelName: modelName,
                historyRound: historyRound
            })
        }).then(response => {
            return response.json();
        }).then(data => {
            if (data.responseStatus == 'success') {
                // data.appendMessages.map((item) => {
                //     setMessageItems([
                //         ...messageItems,
                //         {
                //             key: item.messageId,
                //             loading: item.uid.startsWith("-") && !item.messageStatus.startsWith('ai_complete'),
                //             role: item.uid.startsWith("-")?'ai':'local',
                //             content: item.messageContent,
                //         },
                //         {
                //
                //         }
                //     ]);
                // })
                setMessageItems((prev)=>{
                    // 找到prev中是否包含key==item.messageId的元素
                    const hasItem = prev.find((item) => item.key == data.appendMessages[0].messageId);
                    if(hasItem){
                        // 如果有，则不添加
                        return prev;
                    }else{
                        return (
                            [
                                ...prev,
                                ...data.appendMessages.map((item) => {
                                    return {
                                        key: item.messageId,
                                        loading: convertLoading(item.uid, item.messageStatus),
                                        // loading: item.uid.startsWith("-") && !item.messageStatus.startsWith('ai_complete'),
                                        role: convertRole(item.uid, item.messageType),
                                        // role: item.uid.startsWith("-")?(item.messageType=='ai_mdx'?'aiMdx':'ai'):'local',
                                        // role: item.uid.startsWith("-")?'ai':'local',
                                        content: item.messageContent,
                                    }
                                }),
                            ])
                    }
                });
                // 将当前Conversation更新到最上面
                const index = conversationItems.findIndex((item) => item.key == activeKey);
                if(index != -1){
                    const upConversationItem = conversationItems[index];
                    upConversationItem.group = ConversationDateGroup.Today;
                    conversationItems.splice(index, 1);
                    setConversationItems([
                        upConversationItem,
                        ...conversationItems
                    ]);
                }
            }else{
                const opts = {
                    content: "发送消息失败！"+data,
                    duration: 0,
                    stack: true,
                    theme: 'light',
                };
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                Toast.error(opts);
            }
        }).catch((error) => {
            console.error('Error:', error);
            const opts = {
                content: "发送消息异常！"+error,
                duration: 0,
                stack: true,
                theme: 'light',
            };
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            Toast.error(opts);
        })
    },[activeKey, conversationItems, historyRound, loginState, modelName, tempCkid]);

    // const onSubmit = (nextContent: string) => {
    //     if (!nextContent) return;
    //     onRequest(nextContent);
    //     setInputInputContent('');
    //     console.info("onSubmit, activeKey: "+activeKey);
    // };

    // const onPromptsItemClick: GetProp<typeof Prompts, 'onItemClick'> = (info) => {
    //     onRequest(info.data.description as string);
    // };

    function onAddConversation(){
        if(loginState == false || tempCkid == ''){
            const opts = {
                content: "请先登录！",
                duration: 3,
                stack: true,
                theme: 'light',
            };
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            Toast.error(opts);
            return
        }
        setIsCreatingConversation(true);
        fetch(hostAddr+'ai_chat/api/create_conversation',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: '{}'
        }).then(response => {
            return response.json();
        }).then(data => {
            if (data.responseStatus == 'success') {
                setConversationItems([
                    {
                        key: data.conversationId,
                        label: data.conversationName,
                        group: ConversationDateGroup.Today
                    },
                    ...conversationItems,
                ]);

                setActiveKey(data.conversationId);
                console.warn("setActiveKey: "+data.conversationId+"    activeKey: "+activeKey);
            }else{
                const opts = {
                    content: "新建会话失败！"+data,
                    duration: 0,
                    stack: true,
                    theme: 'light',
                };
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                Toast.error(opts);
            }
            setIsCreatingConversation(false);
        }).catch((error) => {
            console.error('Error:', error);
            const opts = {
                content: "新建会话异常！"+error,
                duration: 0,
                stack: true,
                theme: 'light',
            };
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            Toast.error(opts);
            setIsCreatingConversation(false);
        });
        // setIsCreatingConversation(false);

    }

    const onConversationClick: GetProp<typeof Conversations, 'onActiveChange'> = useCallback((key) => {
        setActiveKey(key);
        setMenuDrawerOpen(false);
        console.log('onConversationClick', key, "oldActiveKey: ", activeKey);
    }, [activeKey]);

    // const handleFileChange: GetProp<typeof Attachments, 'onChange'> = (info) =>
    //     setAttachedFiles(info.fileList);

    // const openLinkInNewTab = (url:string) => {
    //     window.open(url, '_blank');
    // }

    // ==================== Nodes ====================

    const logoNode = (
        <div className={styles.logo}>
            <img
                src={bit_logo}
                draggable={false}
                alt="logo"
            />
            <span>{appName}</span>
        </div>
    );

    // ==================== Render =================
    //const example_side_text:string = "<IFrameButton src=\"https://www.bytelan.cn/\">显示主页</IFrameButton>";


    useEffect(() => {
        console.warn("modelName changed: "+modelName);
    }, [modelName]);

    useEffect(() => {
        console.warn("historyRound changed: "+historyRound);
    }, [historyRound]);

    return (
        <div className={styles.layout} ref={layoutRef}>
            {/*<MenuRender />*/}
            <div className={styles.menu} style={{ width: menuWidth, visibility: menuVisible }} >
                {/* 🌟 Logo */}
                {logoNode}
                {/* 🌟 添加会话 */}
                <Button
                    onClick={onAddConversation}
                    type="link"
                    className={styles.addBtn}
                    icon={<PlusOutlined />}
                    loading={isCreatingConversation}
                >
                    创建新会话
                </Button>
                {/* 🌟 会话管理 */}
                <LazyImportSuspense style={{ width: '100%', flex: 1}}>
                    <Conversations
                        items={conversationItems}
                        className={styles.conversations}
                        activeKey={activeKey}
                        onActiveChange={onConversationClick}
                        menu={menuConfig}
                        groupable
                        styles={useMemo(()=>({item: {paddingInlineStart: 12}}), [])}
                    />
                </LazyImportSuspense>
                {demoButtonNode==null?(<></>):(demoButtonNode)}
                {/*{mdComponentIFrameButton({children: "弹出主页", src: "https://www.bytelan.cn/"})}*/}
                {/*{mdComponentIFrameButton({children: "弹出BIT邮箱", src: "https://mail.bit.edu.cn/"})}*/}
                {/*{mdComponentExampleSideSheetShow({children: "弹出示例侧边栏"})}*/}
                {/*{mdComponentAnylogicSimulationDemoButton({children: "AnylogicDemo", src: null})}*/}
                <UserBar onLogin={onLoginOption} loginState={loginState} loginUserName={userName} setLoginState={setLoginState} setLoginUserName={setUserName} setTempCkid={setTempCkid}></UserBar>
            </div>
            <Drawer
                title={appName}
                placement="left"
                closable={true}
                onClose={onClickCloseMenu}
                width={300}
                open={menuDrawerOpen}
                getContainer={false}
                styles={{body:{padding:0}}}
            >
                <div className={styles.menu} style={{ width: 300 }} >
                    {/* 🌟 Logo */}
                    {/*{logoNode}*/}
                    {/* 🌟 添加会话 */}
                    <Button
                        onClick={onAddConversation}
                        type="link"
                        className={styles.addBtn}
                        icon={<PlusOutlined />}
                        loading={isCreatingConversation}
                        style={{marginTop:10}}
                    >
                        创建新会话
                    </Button>
                    {/* 🌟 会话管理 */}
                    <LazyImportSuspense style={{ width: '100%', flex: 1}}>
                        <Conversations
                            items={conversationItems}
                            className={styles.conversations}
                            activeKey={activeKey}
                            onActiveChange={onConversationClick}
                            menu={menuConfig}
                            groupable
                            styles={useMemo(()=>({item: {paddingInlineStart: 12}}), [])}
                        />
                    </LazyImportSuspense>
                    {demoButtonNode==null?(<></>):(demoButtonNode)}
                    <UserBar onLogin={onLoginOption} loginState={loginState} loginUserName={userName} setLoginState={setLoginState} setLoginUserName={setUserName} setTempCkid={setTempCkid}></UserBar>
                </div>
            </Drawer>
            <FloatButton
                shape="circle"
                type="primary"
                style={{ top:12, left:12 , height: 35, width: 35, visibility: (menuVisible==='hidden' && !menuDrawerOpen)?'visible':'hidden'}}
                tooltip={<div>展开列表</div>}
                onClick={onClickOpenMenu}
                icon={<RightOutlined />} />
            <div className={styles.chat} style={{ width: chatWidth}}>
                {messageContentReplacementTitle==""?(<LazyImportSuspense style={{height:50}}>
                    <ImChatTitle chatTitle={chatTitle} onHistoryRoundChange={setHistoryRound} onModelChange={setModelName} modelList={modelList} modelKey={modelName} historyRound={historyRound} activeConversationKey={activeKey}></ImChatTitle>
                </LazyImportSuspense>):(<></>)}


                {socketReconnecting?(<div style={{ marginLeft:20, backgroundColor: 'rgba(var(--semi-pink-1), 1)' , width: 'calc(100% - 40px)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(var(--semi-red-7), 1)' , borderRadius: '6px'  }}><p style={{margin: 0}}>长连接断开，消息接收可能异常，重连中...您也可以尝试刷新页面...</p></div>):(<></>)}
                {
                    (messageContentReplacementTitle == "")?(
                        <>
                            {/*<Bubble.List*/}
                            {/*    items={messageItems.length > 0 ? messageItems : [{ content: placeholderNode, variant: 'borderless' }]}*/}
                            {/*    roles={roles}*/}
                            {/*    className={styles.messages}*/}
                            {/*/>*/}
                            {/*<Prompts items={senderPromptsItems} onItemClick={onPromptsItemClick} />*/}
                            {/*<Sender*/}
                            {/*    value={inputContent}*/}
                            {/*    header={senderHeader}*/}
                            {/*    onSubmit={onSubmit}*/}
                            {/*    onChange={setInputInputContent}*/}
                            {/*    prefix={attachmentsNode}*/}
                            {/*    loading={false}*/}
                            {/*    className={styles.sender}*/}
                            {/*/>*/}
                            <LazyImportSuspense>
                                <ImChat
                                    styles={styles}
                                    checkRightSizeF={checkRightSize}
                                    exampleSideChangeF={exampleSideChange}
                                    onRequest={onRequest}
                                    activeKey={activeKey}
                                    setRightNodeF={rightNodeFn}
                                    messageItems={messageItems}
                                    setDemoButtonNode={setDemoButtonNode}
                                >
                                </ImChat>
                            </LazyImportSuspense>
                        </>
                        ):(
                            <>
                                <Empty
                                    image={<IllustrationConstruction style={{ width: 150, height: 150 }} />}
                                    darkModeImage={<IllustrationConstructionDark style={{ width: 150, height: 150 }} />}
                                    title={messageContentReplacementTitle}
                                    style={{height: '100%', width: '100%'}}
                                />
                            </>
                        )
                }

            </div>
            <SideSheet title="交互界面说明" visible={exampleSideVisible} onCancel={exampleSideChange} width='80%'>
                <MarkdownRender format="md" raw={`
## 特殊JSX组件

当大模型返回以下内容时，会渲染特定组件

\`\`\`text
// VChart图表
(silkroad://chat.messagecard.vchart/数据id/图表标题)
// 新版仿真
(silkroad://chat.messagecard.startsimulation2/)
// 旧版仿真
(https://anylogic-test.bitcs-silkroad-oe.bbyte.cn/anylogic/platform/demo-test/startRun/1)
\`\`\`

## 模型指定

您可以通过在网址参数中加入modelName来指定默认使用模型，例如

\`\`\`text
.../chat/?modelName=DeepseekR1Ali
\`\`\`

支持的模型如下

\`\`\`json
[{key: "default", name: "多智能体（默认）"},
{key: "DeepseekR1Ali", name: "Deepseek R1 - 阿里云"},
{key: "DeepseekR1AliSilkroad", name: "Deepseek R1 - 供应链专家"},
{key: "QwenMax", name: "千问Max - 效果出众"},
{key: "QwenTurbo", name: "千问Turbo - 速度最快"},
{key: "QwenLong", name: "千问Long - 适合长文本"},
{key: "oldMa", name: "多智能体（非流式，弃用）"}]
\`\`\``}/>
            </SideSheet>
        </div>
    );
}

export default FullChatApp
