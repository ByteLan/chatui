import React, {useEffect, useRef} from 'react';
import {
    Attachments,
    Bubble,
    Conversations,
    Prompts,
    Sender,
    Welcome,
    useXAgent,
    useXChat,
} from '@ant-design/x';
import { createStyles } from 'antd-style';
import {
    CloudUploadOutlined,
    CommentOutlined,
    EllipsisOutlined,
    FireOutlined,
    HeartOutlined,
    PaperClipOutlined,
    PlusOutlined,
    ReadOutlined,
    // ShareAltOutlined,
    SmileOutlined,
} from '@ant-design/icons';
import { Badge, type GetProp, Space, Button} from 'antd';
import {MarkdownRender, SideSheet, Notification, Empty, Toast} from '@douyinfe/semi-ui';
import { IllustrationConstruction, IllustrationConstructionDark } from '@douyinfe/semi-illustrations';
import { JSX } from 'react/jsx-runtime';
import UserBar from "./components/UserBar.tsx";
import Cookies from 'js-cookie';
import {hostAddr, hostWsAddr} from "./serverConfig.tsx";
import bit_logo from './assets/logo_01.svg';

const renderTitle = (icon: React.ReactElement, title: string) => (
    <Space align="start">
        {icon}
        <span>{title}</span>
    </Space>
);

// const defaultConversationsItems = [
//     {
//         key: '1122',
//         label: 'Conversations 1',
//     },
//     {
//         key: '1011',
//         label: 'Conversations 2',
//     }
// ];

// 隐藏菜单的媒体宽度
const hideMenuMediaWidth = 850;

const useStyle = createStyles(({token, css}) => {

    return {
        layout: css`
            width: 100%;
            min-width: 300px;
            height: 100%;
            min-height: 400px;
            border-radius: ${token.borderRadius}px;
            display: flex;
            background: ${token.colorBgContainer};
            font-family: AlibabaPuHuiTi, ${token.fontFamily}, sans-serif;

            .ant-prompts {
                color: ${token.colorText};
            }
        `,
        menu: css`
                //@media (min-width: ${hideMenuMediaWidth}px) {

            background: ${token.colorBgLayout}80;
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
        `,
        chat: css`
            height: 100%;
            width: 80%;
            margin: 0 auto;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            padding: ${token.paddingLG}px;
            gap: 16px;

        `,
        messages: css`
            flex: 1;
            //定义滚动条高宽及背景，高宽分别对应横竖滚动条的尺寸
            ::-webkit-scrollbar {
                width: 8px;
                height: 8px;
                background-color: rgba(0,0,0,.2);
            }

            //定义滚动条轨道，内阴影+圆角
            ::-webkit-scrollbar-track
            {
                -webkit-box-shadow:inset 0 0 6px rgba(0,0,0,0.3);
                border-radius:10px;
                background-color:#F5F5F5;
            }
            //定义滑块内阴影+圆角
            ::-webkit-scrollbar-thumb
            {
                border-radius:10px;
                -webkit-box-shadow:inset 0 0 6px rgba(0,0,0,.3);
                background-color: #b3b3b3;
            }
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
            margin: 0 12px 24px 12px;
        `,
    };
});

const placeholderPromptsItems: GetProp<typeof Prompts, 'items'> = [
    {
        key: '1',
        label: renderTitle(<FireOutlined style={{color: '#FF4D4F'}}/>, '标题'),
        description: '描述',
        children: [
            {
                key: '1-1',
                description: `引导问题1`,
            },
            {
                key: '1-2',
                description: `引导问题2`,
            },
            {
                key: '1-3',
                description: `引导问题3`,
            },
        ],
    },
    {
        key: '2',
        label: renderTitle(<ReadOutlined style={{color: '#1890FF'}}/>, '评估供应链韧性'),
        description: '我可以帮助你评估供应链韧性，你可以尝试这样问：',
        children: [
            {
                key: '2-1',
                icon: <HeartOutlined/>,
                description: `生成供应链网络结构图`,
            },
            {
                key: '2-2',
                icon: <SmileOutlined/>,
                description: `我要对供应链结构进行仿真`,
            },
            {
                key: '2-3',
                icon: <CommentOutlined/>,
                description: `666`,
            },
        ],
    },
    {
        key: '3',
        label: renderTitle(<FireOutlined style={{color: '#FF4D4F'}}/>, '看这里'),
        description: '点下面按钮',
        children: [
            {
                key: '3-1',
                description: `帮助`,
            },
            {
                key: '3-2',
                description: `使用指导`,
            },
            {
                key: '3-3',
                description: `help`,
            },
        ],
    },
];

const senderPromptsItems: GetProp<typeof Prompts, 'items'> = [
    {
        key: '1',
        description: 'help',
        icon: <FireOutlined style={{color: '#FF4D4F'}}/>,
    },
    {
        key: '2',
        description: '使用指导',
        icon: <ReadOutlined style={{color: '#1890FF'}}/>,
    },
];

const mdComponentMyButton:React.FC<{
    children: string;
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}> = ({children, onClick}) => {
    return <Button onClick={onClick}> {children} </Button>
}

let setRightNodeFn: ((arg0: JSX.Element) => void) | undefined;
let exampleSideChangeFn: (() => void) | undefined;
let windowChatSize: number[] = [1,0];
let setChatSizeString: (size: string) => void | undefined;
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
    if(setChatSizeString !== undefined){
        // console.log("setChatSizeString 45%");
        setChatSizeString('30%');
        windowChatSize[1] = 21;
        // console.warn("handrsz: "+handleResizePublic);
        // if(handleResizePublic !== undefined) {
        //     console.warn("in handlersz")
        //     handleResizePublic();
        // }
    }
}

const mdComponentIFrameButton:React.FC<{
    children: string;
    src: string
}> = ({ children, src }) => {
    return <Button onClick={()=> {
        checkRightSize()
        if (setRightNodeFn === undefined){
            return
        }
        setRightNodeFn(<iframe src = {src} width="100%" height="100%"></iframe>)
    }}> {children} </Button>
}

const mdComponentExampleSideSheetShow:React.FC<{
    children: string
}> = ({ children }) => {
    return <Button onClick={()=> {
        if (exampleSideChangeFn === undefined){
            return
        }
        exampleSideChangeFn()
    }}>{children}</Button>
}

// const mdComponents = {};
const mdxComponents = {
    'MyButton':mdComponentMyButton,
    'IFrameButton':mdComponentIFrameButton,
    'ExampleSideSheetShow':mdComponentExampleSideSheetShow
};



const semiMarkdownRender = (content?: string) => {
    return <MarkdownRender raw={content} components={{...MarkdownRender.defaultComponents,...mdxComponents}} />
};

const semiPureMarkdownRender = (content?: string) => {
    return <MarkdownRender raw={content} format="md" />
}

const roles: GetProp<typeof Bubble.List, 'roles'> = {
    ai: {
        placement: 'start',
        // typing: { step: 300, interval: 1 },
        styles: {
            content: {
                borderRadius: 16,
            },
        },
        messageRender: semiPureMarkdownRender,
    },
    local: {
        placement: 'end',
        variant: 'shadow',
        // messageRender: semiPureMarkdownRender,
    },
    aiMdx: {
        placement: 'end',
        // typing: { step: 300, interval: 1 },
        styles: {
            content: {
                borderRadius: 16,
            },
        },
        messageRender: semiMarkdownRender,
    }
};

function FullChatApp ({rightNodeFn, innerRef, chatSizeConst, setChatSize, chatSize}: { rightNodeFn: (node: JSX.Element) => void, innerRef: any, chatSizeConst: number[], setChatSize: any, chatSize: any }) {
    setRightNodeFn = rightNodeFn;
    windowChatSize = chatSizeConst;
    setChatSizeString = setChatSize;
    const [tempCkid, setTempCkid] = React.useState('');
    const [userName, setUserName] = React.useState('');
    const [loginState, setLoginState] = React.useState(false);
    const [messageItems, setMessageItems] = React.useState<{key:string,loading:boolean,role:string,content:string}[]>([]);
    const [conversationItems, setConversationItems] = React.useState<{key:string,label:string}[]>([]);
    const [isCreatingConversation, setIsCreatingConversation] = React.useState(false);

    // ==================== Style ====================
    const { styles } = useStyle();

    // ==================== State ====================
    const [headerOpen, setHeaderOpen] = React.useState(false);

    const [inputContent, setInputInputContent] = React.useState('');

    // const [conversationsItems, setConversationsItems] = React.useState(defaultConversationsItems);

    const [activeKey, setActiveKey] = React.useState("");
    const activeKeyRef = useRef(activeKey);
    const [messageContentReplacementTitle, setMessageContentReplacementTitle] = React.useState("请先登录");
    const messageContentReplacementTitleRef = useRef(messageContentReplacementTitle);

    const [attachedFiles, setAttachedFiles] = React.useState<GetProp<typeof Attachments, 'items'>>(
        [],
    );

    const [menuWidth, setMenuWidth] = React.useState('20%');// 初始宽度
    const [chatWidth, setChatWidth] = React.useState('80%');// 初始宽度
    const [menuVisible, setMenuVisible] = React.useState('visible');
    const layoutRef = React.useRef<HTMLDivElement>(null);


    const [exampleSideVisible, setEexampleSideVisible] = React.useState(false);
    const exampleSideChange = () => {
        setEexampleSideVisible(!exampleSideVisible);
    };

    exampleSideChangeFn = exampleSideChange;

    useEffect(() => {
        activeKeyRef.current = activeKey;
    }, [activeKey]);

    useEffect(() => {
        messageContentReplacementTitleRef.current = messageContentReplacementTitle;
    }, [messageContentReplacementTitle]);

    // 使用 useRef 存储 socket 对象
    const socketRef = useRef<WebSocket | null>(null);
    useEffect(() => {
        function updateMessage(messageId:string, messageContent:string, conversationId:string, messageStatus:string, messageUid:string, messageType:string){
            console.log("updateMessage: "+messageId+" "+messageContent+" "+conversationId+" "+messageStatus+" "+messageUid+" "+activeKeyRef.current);
            if(activeKeyRef.current != null && activeKeyRef.current != '' && activeKeyRef.current == conversationId){
                // const newMessageItems = messageItems.map((item) => {
                //     if(item.key === messageId){
                //         return {
                //             key: item.key,
                //             loading: messageUid.startsWith("-") && !messageStatus.startsWith('ai_complete'),
                //             role: messageUid.startsWith("-")?'ai':'local',
                //             content: messageContent,
                //         }
                //     }else{
                //         return item;
                //     }
                // });
                setMessageItems(prevMessageItems => {
                    const newMessageItems = prevMessageItems.map((item) => {
                        if(item.key == messageId){
                            return {
                                key: item.key,
                                loading: messageUid.startsWith("-") && !messageStatus.startsWith('ai_complete'),
                                role: messageUid.startsWith("-")?(messageType==='ai_mdx'?'ai_mdx':'ai'):'local',
                                content: messageContent,
                            }
                        }else{
                            return item;
                        }
                    });
                    console.info("update newMessageItems: "+newMessageItems);
                    return newMessageItems;
                });
            }
        }
        if(loginState==false||tempCkid == ''){
            socketRef.current?.close();
            socketRef.current = null;
        }else{
            if(socketRef.current != null){
                socketRef.current.close();
                socketRef.current = null;
            }
            socketRef.current = new WebSocket(hostWsAddr+'ai_chat/ws');
            socketRef.current.onopen = () => {
                console.log('ws opened');
                socketRef.current?.send(JSON.stringify({
                    requestType: 'setActiveCkid',
                    activeCkid: tempCkid,
                }));
            }
            socketRef.current.onmessage = (event) => {
                console.info("onMessage: "+event.data);
                try{
                    if (event.data != null){
                        const jd = JSON.parse(event.data);
                        if(jd.responseType !=null && jd.responseType == 'updateMessageWithMessageIdAndConversationId') {
                            updateMessage(jd.messageId, jd.updateMessageContent, jd.conversationId, jd.messageStatus, jd.messageUid, jd.messageType);
                        }
                    }
                }catch (e) {
                    console.error("onMessageError: "+e);
                }


            }
            socketRef.current.onclose = () => {

            }
            socketRef.current.onerror = () => {

            }

        }
        return () => {
            console.log('close socket, tempCkid changed:'+tempCkid);
            socketRef.current?.close();
            socketRef.current = null;
        }
    }, [tempCkid, loginState]);

    function onLoginOption(){
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
                    return {
                        key: item.conversationId,
                        label: item.conversationName
                    }
                }));
            }else{
                setMessageContentReplacementTitle("读取会话列表失败，请刷新页面重试\n"+data);
            }
        }).catch((error) => {
            console.error('Error:', error);
            setMessageContentReplacementTitle("读取会话列表失败，请刷新页面重试\n"+error);
        });
    }

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
        // 读取cookies中的userid
        const userIdValue = Cookies.get('localckid');
        if(userIdValue !== undefined){
            // http请求
            fetch(hostAddr+'auth/api/ckidCheck',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "ckid": userIdValue
                })
            }).then(response => {
                return response.json();
            })
            .then(data => {
                if (data.responseStatus == 'ckidCheckSuccess') {
                    Cookies.set('localckid',data.newCkid);
                    setTempCkid(data.newCkid);
                    setUserName(data.userName);
                    setLoginState(true);
                    onLoginOption();
                }
            }).catch((error) => {
                console.error('Error:', error);
            });
        }
    }, []);


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
                if (data.responseStatus == 'success') {
                    setMessageItems(data.messageList.map((item) => {
                        return {
                            key: item.messageId,
                            loading: item.uid.startsWith("-") && !item.messageStatus.startsWith('ai_complete'),
                            role: item.uid.startsWith("-")?(item.messageType==='ai_mdx'?'ai_mdx':'ai'):'local',
                            content: item.messageContent,
                        }
                    }));
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

    const handleResize = () => {
        console.warn(layoutRef.current);
        if (layoutRef.current) {
            console.warn(layoutRef.current.offsetWidth);
            const layoutWidth = layoutRef.current.offsetWidth;
            // 根据.layout的宽度设置menu的宽度逻辑
            if (layoutWidth > hideMenuMediaWidth) {
                setMenuWidth('20%');
                setChatWidth('80%');
                setMenuVisible('visible');
            } else {
                setMenuWidth('0');
                setChatWidth('98%');
                setMenuVisible('hidden');
            }
        }
    };

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

    useEffect(() => {
        handleResize();
    }, [chatSizeConst]);

    useEffect(() => {
        handleResize();
    }, [chatSize]);

    // ==================== Event ====================
    function onRequest(nextContent: string) {
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
        fetch(hostAddr+'ai_chat/api/send_message',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                conversationId: activeKey,
                messageContent: nextContent
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
                setMessageItems([
                    ...messageItems,
                    ...data.appendMessages.map((item) => {
                        return {
                            key: item.messageId,
                            loading: item.uid.startsWith("-") && !item.messageStatus.startsWith('ai_complete'),
                            role: item.uid.startsWith("-")?(item.messageType==='ai_mdx'?'ai_mdx':'ai'):'local',
                            // role: item.uid.startsWith("-")?'ai':'local',
                            content: item.messageContent,
                        }
                    }),
                ]);
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
    }

    const onSubmit = (nextContent: string) => {
        if (!nextContent) return;
        onRequest(nextContent);
        setInputInputContent('');
        console.info("onSubmit, activeKey: "+activeKey);
    };

    const onPromptsItemClick: GetProp<typeof Prompts, 'onItemClick'> = (info) => {
        onRequest(info.data.description as string);
    };

    // const onAddConversation = () => {
    //     setConversationsItems([
    //         ...conversationsItems,
    //         {
    //             key: `${conversationsItems.length}`,
    //             label: `New Conversation ${conversationsItems.length}`,
    //         },
    //     ]);
    //     setActiveKey(`${conversationsItems.length}`);
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

    const onConversationClick: GetProp<typeof Conversations, 'onActiveChange'> = (key) => {
        setActiveKey(key);
        console.log('onConversationClick', key, "activeKey: ", activeKey);
    };

    const handleFileChange: GetProp<typeof Attachments, 'onChange'> = (info) =>
        setAttachedFiles(info.fileList);

    const openLinkInNewTab = (url:string) => {
        window.open(url, '_blank');
    }

    // ==================== Nodes ====================
    const placeholderNode = (
        <Space direction="vertical" size={16} className={styles.placeholder}>
            <Welcome
                variant="borderless"
                icon="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*s5sNRo5LjfQAAAAAAAAAAAAADgCCAQ/fmt.webp"
                title="你好，这是一个Chat Demo"
                description="Base on Ant Design, Semi Design."
                extra={
                    <Space>
                        {/*<Button icon={<ShareAltOutlined />} />*/}
                        <Button icon={<EllipsisOutlined />} onClick={()=>openLinkInNewTab("https://www.bytelan.cn/")}/>
                    </Space>
                }
            />
            <Prompts
                title="这是一个默认的提示词面板，发送消息后会自动消失。"
                items={placeholderPromptsItems}
                styles={{
                    list: {
                        width: '100%',
                    },
                    item: {
                        flex: 1,
                    },
                }}
                onItemClick={onPromptsItemClick}
            />
        </Space>
    );

    // const items: GetProp<typeof Bubble.List, 'items'> = messages.map(({ id, message, status }) => ({
    //     key: id,
    //     loading: status === 'loading',
    //     role: status === 'local' ? 'local' : 'ai',
    //     content: message,
    // }));

    const attachmentsNode = (
        <Badge dot={attachedFiles.length > 0 && !headerOpen}>
            <Button type="text" icon={<PaperClipOutlined />} onClick={() => setHeaderOpen(!headerOpen)} />
        </Badge>
    );

    const senderHeader = (
        <Sender.Header
            title="Attachments"
            open={headerOpen}
            onOpenChange={setHeaderOpen}
            styles={{
                content: {
                    padding: 0,
                },
            }}
        >
            <Attachments
                beforeUpload={() => false}
                items={attachedFiles}
                onChange={handleFileChange}
                placeholder={(type) =>
                    type == 'drop'
                        ? { title: 'Drop file here' }
                        : {
                            icon: <CloudUploadOutlined />,
                            title: 'Upload files',
                            description: 'Click or drag files to this area to upload',
                        }
                }
            />
        </Sender.Header>
    );

    const logoNode = (
        <div className={styles.logo}>
            <img
                src={bit_logo}
                draggable={false}
                alt="logo"
            />
            <span>BIT</span>
        </div>
    );

    // ==================== Render =================
    const example_side_text:string = "<IFrameButton src=\"https://www.bytelan.cn/\">显示主页</IFrameButton>";
    return (
        <div className={styles.layout} ref={layoutRef}>
            <div className={styles.menu} style={{ width: menuWidth, visibility: menuVisible }}>
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
                    New Conversation
                </Button>
                {/* 🌟 会话管理 */}
                <Conversations
                    // items={conversationsItems}
                    items={conversationItems}
                    className={styles.conversations}
                    activeKey={activeKey}
                    onActiveChange={onConversationClick}
                />
                {mdComponentIFrameButton({children: "弹出主页", src: "https://www.bytelan.cn/"})}
                {mdComponentIFrameButton({children: "弹出BIT邮箱", src: "https://mail.bit.edu.cn/"})}
                {mdComponentExampleSideSheetShow({children: "弹出示例侧边栏"})}
                <UserBar onLogin={onLoginOption} loginState={loginState} loginUserName={userName} setLoginState={setLoginState} setLoginUserName={setUserName} setTempCkid={setTempCkid}></UserBar>
            </div>
            <div className={styles.chat} style={{ width: chatWidth}}>
                {
                    (messageContentReplacementTitle == "")?(
                        <>
                            <Bubble.List
                                items={messageItems.length > 0 ? messageItems : [{ content: placeholderNode, variant: 'borderless' }]}
                                roles={roles}
                                className={styles.messages}
                            />
                            <Prompts items={senderPromptsItems} onItemClick={onPromptsItemClick} />
                            <Sender
                                value={inputContent}
                                header={senderHeader}
                                onSubmit={onSubmit}
                                onChange={setInputInputContent}
                                prefix={attachmentsNode}
                                loading={false}
                                className={styles.sender}
                            />
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
            <SideSheet title="滑动侧边栏示例" visible={exampleSideVisible} onCancel={exampleSideChange}>
                <p>你可以在对话框输入以下内容，尝试渲染Markdown和JSX，这些内容都是AI返回到会话的。</p>
                <p>{example_side_text}</p>
            </SideSheet>
        </div>
    );
}

export default FullChatApp
