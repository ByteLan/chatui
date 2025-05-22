import { Prompts, Welcome} from "@ant-design/x";
import React, {lazy} from "react";
import {Button, Flex, type GetProp, Space} from "antd";
import {Collapse, MarkdownRender, Col, Row, Popover} from "@douyinfe/semi-ui";
import LazyImportSuspense from "@bytelan/silkroad-platform/src/LazyImportSuspense.tsx";
import {
    // CloudUploadOutlined,
    CommentOutlined,
    EllipsisOutlined,
    FireOutlined,
    HeartOutlined,
    // PaperClipOutlined,
    ReadOutlined,
    SmileOutlined
} from "@ant-design/icons";
// import ImChatTitle from "./ImChatTitle.tsx";
// import ImChatSender from "./ImChatSender.tsx";
// import Bubble from "@ant-design-local/x/components/bubble/index.tsx";
import {Bubble} from "@ant-design/x";
const ImChatSender = lazy(() => import("./ImChatSender.tsx"));
const AnylogicSimulationDemoPage = lazy(() => import("../components/anylogic-simulation-demo/AnylogicSimulationDemoPage.tsx"));
const SimulationStarter = lazy(() => import("@bytelan/silkroad-platform/src/platform-pages/simulation-pages/SimulationStarter.tsx"));
const OverviewPage = lazy(() => import("@bytelan/silkroad-platform/src/platform-pages/OverviewPage.tsx"));

import { isEqual } from 'lodash';

// import rehypeKatex from 'rehype-katex';
import rehypeMathjax from 'rehype-mathjax'
import remarkMath from 'remark-math';

// import MyTable from "./table.tsx";
import MessageCardVChart from "./MessageCardVChart.tsx";

let setRightNodeFn: ((arg0: JSX.Element) => void) | undefined;
let exampleSideChangeFn: (() => void) | undefined;
let checkRightSize: (() => void) | undefined;
let activeKeyPublic:string|undefined;

const renderTitle = (icon: React.ReactElement, title: string) => (
    <Space align="start">
        {icon}
        <span>{title}</span>
    </Space>
);

const openLinkInNewTab = (url:string) => {
    window.open(url, '_blank');
}

const placeholderPromptsItems: GetProp<typeof Prompts, 'items'> = [
    // {
    //     key: '1',
    //     label: renderTitle(<FireOutlined style={{color: '#FF4D4F'}}/>, '标题'),
    //     description: '描述',
    //     children: [
    //         {
    //             key: '1-1',
    //             description: `引导问题1`,
    //         },
    //         {
    //             key: '1-2',
    //             description: `引导问题2`,
    //         },
    //         {
    //             key: '1-3',
    //             description: `引导问题3`,
    //         },
    //     ],
    // },
    {
        key: '2',
        label: renderTitle(<ReadOutlined style={{color: '#1890FF'}}/>, '供应链韧性助手'),
        description: '你可以尝试这样问：',
        children: [
            {
                key: '2-1',
                icon: <HeartOutlined/>,
                description: `打开供应链仿真推演`,
            },
            {
                key: '2-2',
                icon: <SmileOutlined/>,
                description: `分析供应链韧性`,
            },
            {
                key: '2-3',
                icon: <CommentOutlined/>,
                description: `生成供应链网络结构图`,
            },
        ],
    },
    {
        key: '3',
        label: renderTitle(<FireOutlined style={{color: '#FF4D4F'}}/>, '平台功能'),
        description: '打开其他功能面板：',
        children: [
            {
                key: 'func-overview',
                description: `供应链全景`,
            },
            {
                key: 'func-sim',
                description: `仿真环境`,
            },
            {
                key: 'func-neograph',
                description: '供应链孪生',
            }
        ],
    },
];


// 解决重复渲染BubbleList
// const BubbleListMemo = React.memo(({messageItems, styles, roles, placeholderNode}:{messageItems:{
//         key: string
//         loading: boolean
//         role: string
//         content: string
//     }[], styles:any, roles:any, placeholderNode:any}) => (
//     <Bubble.List
//         // items={messageItems.length > 0 ? messageItems : [{ content: placeholderNode, variant: 'borderless' }]}
//         items={[{ content: placeholderNode, variant: 'borderless' }, ...messageItems]}
//         roles={roles}
//         className={styles.messages}
//     />
// ));

// ), (prevProps, nextProps) => {
//     // 只在消息变化时重新渲染
//     return isEqual(prevProps.messageItems , nextProps.messageItems);
// });

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
function mdComponentMyButton({children, onClick}){
    return <Button onClick={onClick}> {children} </Button>
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
function mdComponentIFrameButton({children, src}){
    // console.warn("in mdComponentIFrameButton");
    // console.warn(setRightNodeFn)
    return <Button onClick={()=> {
        checkRightSize?.()
        if (setRightNodeFn === undefined){
            return
        }
        setRightNodeFn(<iframe src = {src} width="100%" height="100%"></iframe>)
    }}> {children} </Button>
}


// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
function mdComponentExampleSideSheetShow({children}){
    return <Button onClick={()=> {
        if (exampleSideChangeFn === undefined){
            return
        }
        exampleSideChangeFn()
    }}>{children}</Button>
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
function mdComponentAnylogicSimulationDemoButton({children, src}){
    return <Button onClick={()=> {
        checkRightSize?.()
        if (setRightNodeFn === undefined){
            return
        }
        if(src == null){
            setRightNodeFn(
                <LazyImportSuspense><AnylogicSimulationDemoPage simAddr="https://bytelan.cn/"/></LazyImportSuspense>
            )
        }else{
            setRightNodeFn(
                <LazyImportSuspense><AnylogicSimulationDemoPage simAddr={src}/></LazyImportSuspense>
            )
        }
    }}> {children} </Button>
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
function mdComponentSimulationStarter({children, src}:{children:any, src:string}){
    return <Button onClick={()=> {
        checkRightSize?.()
        if (setRightNodeFn === undefined){
            return
        }
        if(src == null || src =="") {
            setRightNodeFn(
                <LazyImportSuspense><SimulationStarter src="demo3" activeConversationKey={activeKeyPublic}/></LazyImportSuspense>
            )
        }else{
            setRightNodeFn(
                <LazyImportSuspense><SimulationStarter src={src} activeConversationKey={activeKeyPublic}/></LazyImportSuspense>
            )
        }
    }
    }>{children}</Button>
}

function mdButtonOverviewShow({children}:{children:any}){
    return <Button onClick={()=> {
        checkRightSize?.()
        if (setRightNodeFn === undefined){
            return
        }
        setRightNodeFn(
            <LazyImportSuspense><OverviewPage activeConversationKey={activeKeyPublic} /></LazyImportSuspense>
        )
    }}>{children}</Button>
}

function mdVChart({children, src, title}:{children?:any, src?:string, title?:string}){
    return <MessageCardVChart dataSrc={src} title={title}>{children}</MessageCardVChart>
}

// function mdTable({children}:{children:any}){
//     return <MyTable>{children}</MyTable>
// }

const mdxComponents = {
    'MyButton':mdComponentMyButton,
    'IFrameButton':mdComponentIFrameButton,
    'AnylogicSimulationDemoButton':mdComponentAnylogicSimulationDemoButton,
    'ExampleSideSheetShow':mdComponentExampleSideSheetShow,
    'AnylogicSimulationDemo2Button':mdComponentSimulationStarter,
    'MessageCardVChart':mdVChart,
    'ButtonOverviewShow':mdButtonOverviewShow
};

const mdComponents = {}

const MemoSemiMarkdownRenderMemo = React.memo(({content}:{content?:string}) => {
    // 将content中>开头的行提取出来
    if(content!=null && content.length>0){
        const contentArr = content.split("\n");
        let contentReasoning = "";
        let contentOthers = "";
        let i=0;
        for(i=0; i<contentArr.length; i++){
            if(contentArr[i].startsWith(">")){
                contentReasoning += contentArr[i] + "\n";
            }else{
                break;
            }
        }
        if(i>0){
            for(let j=i; j<contentArr.length; j++){
                contentOthers += contentArr[j] + "\n";
            }
            return (
                <>
                    <Collapse>
                        <Collapse.Panel header="思考过程" itemKey="1">
                            <MarkdownRender raw={contentReasoning} format="mdx" components={{...MarkdownRender.defaultComponents, ...mdxComponents}}/>
                        </Collapse.Panel>
                    </Collapse>
                    <MarkdownRender raw={contentOthers} format="mdx" components={{...MarkdownRender.defaultComponents, ...mdxComponents}}/>
                </>
            )
        }else{
            return <MarkdownRender raw={content} format="mdx" components={{...MarkdownRender.defaultComponents, ...mdxComponents}}/>
        }

    }
    return <MarkdownRender raw={content} format="mdx" components={{...MarkdownRender.defaultComponents, ...mdxComponents}}/>
        // <MarkdownRender raw={content} format="mdx" components={{...MarkdownRender.defaultComponents,...mdxComponents}} />
}, (prevProps, nextProps) => {
    return isEqual(prevProps, nextProps);
});


const semiMarkdownRender = (content?: string) => {
    return <MemoSemiMarkdownRenderMemo content={content} />;
    // return <MarkdownRender raw={content} format="mdx" components={{...MarkdownRender.defaultComponents,...mdxComponents}} />
    // return <div>123</div>
};

const MemoSemiPureMarkdownRender = React.memo(({content, openReasoning}:{content?:string, openReasoning?:boolean}) => {
    // 将content中>开头的行提取出来
    if(content!=null && content.length>0){
        const contentArr = content.split("\n");
        let contentReasoning = "";
        let contentOthers = "";
        let i=0;
        for(i=0; i<contentArr.length; i++){
            if(contentArr[i].startsWith(">")){
                contentReasoning += contentArr[i] + "\n";
            }else{
                break;
            }
        }
        if(i>0){
            for(let j=i; j<contentArr.length; j++){
                contentOthers += contentArr[j] + "\n";
            }
            return (
                <>
                    <Collapse defaultActiveKey={openReasoning?"1":undefined}>
                        <Collapse.Panel header="思考过程" itemKey="1">
                            <MarkdownRender raw={contentReasoning} format="md" components={{...MarkdownRender.defaultComponents, ...mdComponents}} remarkPlugins={[remarkMath]} rehypePlugins={[rehypeMathjax]}/>
                        </Collapse.Panel>
                    </Collapse>
                    <MarkdownRender raw={contentOthers} format="md" components={{...MarkdownRender.defaultComponents, ...mdComponents}} remarkPlugins={[remarkMath]} rehypePlugins={[rehypeMathjax]}/>
                </>
            )
        }else{
            return <MarkdownRender raw={content} format="md" components={{...MarkdownRender.defaultComponents, ...mdComponents}} remarkPlugins={[remarkMath]} rehypePlugins={[rehypeMathjax]}/>
        }

    }
    return <MarkdownRender raw={content} format="md" components={{...MarkdownRender.defaultComponents, ...mdComponents}} remarkPlugins={[remarkMath]} rehypePlugins={[rehypeMathjax]}/>
}, (prevProps, nextProps) => {
    return isEqual(prevProps, nextProps);
});


const semiPureMarkdownRender = (content?: string) => {
    return <MemoSemiPureMarkdownRender content={content} />;
    // return <MarkdownRender raw={content} format="md" />
};

const semiPureMarkdownRenderProcessing = (content?: string) => {
    return <MemoSemiPureMarkdownRender content={content} openReasoning={true} />;
}


const ImChat = React.memo(function ImChatF({styles, messageItems, activeKey, checkRightSizeF, setRightNodeF, onRequest, exampleSideChangeF, setDemoButtonNode}: {styles: any, messageItems: { key: string , loading: boolean , role: string , content: string }[], activeKey: string, checkRightSizeF: (() => void) | undefined, setRightNodeF: ((arg0: JSX.Element) => void) | undefined, onRequest: (nextContent: string) => void, exampleSideChangeF: (() => void) | undefined, setDemoButtonNode: ((arg0: JSX.Element) => void) | undefined}) {
    checkRightSize = checkRightSizeF;
    setRightNodeFn = setRightNodeF;
    exampleSideChangeFn = exampleSideChangeF;
    activeKeyPublic = activeKey;
    // console.warn(checkRightSizeF,setRightNodeF,exampleSideChangeF);
    // console.warn(checkRightSize,setRightNodeFn,exampleSideChangeFn);

    const roles: GetProp<typeof Bubble.List, 'roles'> = {
        ai: {
            placement: 'start',
            shape: 'corner',
            // typing: { step: 300, interval: 1 },
            styles: {
                content: {
                    borderRadius: 16,
                    backgroundColor: 'rgba(var(--semi-grey-0), 1)',
                },
            },
            messageRender: semiPureMarkdownRender,
        },
        aiProcessing: {
            placement: 'start',
            shape: 'corner',
            // typing: { step: 300, interval: 1 },
            styles: {
                content: {
                    borderRadius: 16,
                    backgroundColor: 'rgba(var(--semi-grey-0), 1)',
                },
            },
            messageRender: semiPureMarkdownRenderProcessing,

        },
        local: {
            placement: 'end',
            variant: 'shadow',
            shape: 'corner',
            styles: {
                content: {
                    borderRadius: 16,
                    backgroundColor: 'rgba(var(--semi-blue-1), 1)',
                },
            },
            // messageRender: semiPureMarkdownRender,
        },
        aiMdx: {
            placement: 'start',
            shape: 'corner',
            // typing: { step: 300, interval: 1 },
            styles: {
                content: {
                    borderRadius: 16,
                    backgroundColor: 'rgba(var(--semi-grey-0), 1)',
                },
            },
            messageRender: semiMarkdownRender,
        },
    };

    const onPromptsItemClick: GetProp<typeof Prompts, 'onItemClick'> = React.useCallback((info) => {
        if(info.data.key.startsWith('func-')){
            if(info.data.key == 'func-overview') {
                checkRightSize?.()
                if (setRightNodeFn === undefined){
                    return
                }
                setRightNodeFn(
                    <LazyImportSuspense><OverviewPage activeConversationKey={activeKeyPublic} /></LazyImportSuspense>
                )
            }else if(info.data.key == 'func-sim') {
                checkRightSize?.()
                if (setRightNodeFn === undefined){
                    return
                }
                setRightNodeFn(
                    <LazyImportSuspense><SimulationStarter src="demo3" activeConversationKey={activeKeyPublic}/></LazyImportSuspense>
                )
            }else if(info.data.key == 'func-neograph') {
                checkRightSize?.()
                if (setRightNodeFn === undefined){
                    return
                }
                setRightNodeFn(<iframe src = 'http://ai.bitcs.bbyte.cn/xchat/neograph.html' style={{width: '100%', height: '100%', border: 'none', outline: 'none', boxSizing: 'border-box', margin: 0, padding: 0}}></iframe>)
            }
        }else{
            onRequest(info.data.description as string);
        }

    }, [onRequest]);


    const placeholderNode = React.useMemo(() => (
        <Space direction="vertical" size={16} className={styles.placeholder}>
            <Welcome
                variant="borderless"
                // icon="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*s5sNRo5LjfQAAAAAAAAAAAAADgCCAQ/fmt.webp"
                title="你好，丝路大模型！"
                description="供应链韧性大模型"
                extra={
                    <Space>
                        {/*<Button icon={<ShareAltOutlined />} />*/}
                        <Button icon={<EllipsisOutlined />} onClick={()=>openLinkInNewTab("https://www.bytelan.cn/")}/>
                    </Space>
                }
            />
            <Prompts
                title="选择功能或向大模型发送消息"
                items={placeholderPromptsItems}
                onItemClick={onPromptsItemClick}
                styles={{list:{overflow: 'auto'}, subList:{overflow: 'auto'}}}
            />
        </Space>
    ), [onPromptsItemClick, styles.placeholder]);



    React.useEffect(() => {
        setDemoButtonNode?.(
            <>
                <Popover position="top"
                         showArrow
                         trigger="hover"
                         style={{
                             // backgroundColor: 'rgba(var(--semi-blue-4),1)',
                             borderColor: 'rgba(var(--semi-blue-4),1)',
                             borderStyle: 'solid',
                             // color: 'var(--semi-color-white)',
                         }}
                         content={<Flex vertical>
                             {mdComponentIFrameButton({children: "Iframe主页", src: "https://www.bytelan.cn/"})}
                             {mdComponentExampleSideSheetShow({children: "使用指南"})}
                             {mdButtonOverviewShow({children: "Overview"})}
                             {mdComponentSimulationStarter({children: "Sim-3", src: "demo3"})}
                             {mdComponentSimulationStarter({children: "Sim-2", src: "demo2"})}
                             {mdComponentAnylogicSimulationDemoButton({children: "Sim-old", src: null})}
                         </Flex>}>
                    <Button>调试选项</Button>
                </Popover>
            </>
        );

        return () => {
            // 清理副作用
            setDemoButtonNode?.(<> </>);
        };
    }, [setDemoButtonNode,activeKey]);

    // 对messageItem中的元素，根据key去重
    const uniqueMessageItems = React.useMemo(() => {
        const seenKeys = new Set();
        return messageItems.filter(item => {
            if (seenKeys.has(item.key)) {
                return false;
            }
            seenKeys.add(item.key);
            return true;
        });
    }, [messageItems]);

    return (
        <>
            {/*<BubbleListMemo messageItems={messageItems} roles={roles} styles={styles} placeholderNode={placeholderNode}/>*/}

            <Bubble.List
                // items={messageItems.length > 0 ? messageItems : [{ content: placeholderNode, variant: 'borderless' }]}
                items={[{ content: placeholderNode, variant: 'borderless',  }, ...uniqueMessageItems]}
                roles={roles}
                className={styles.messages}
            />

            {/*<Bubble.List*/}
            {/*    items={messageItems.length > 0 ? messageItems : [{ content: placeholderNode, variant: 'borderless' }]}*/}
            {/*    roles={roles}*/}
            {/*    className={styles.messages}*/}
            {/*/>*/}
            <LazyImportSuspense>
                <ImChatSender onRequest={onRequest} activeKey={activeKey} styles={styles} />
            </LazyImportSuspense>
            {/*<Prompts styles={{item:{paddingTop:2, paddingBottom:2}}} items={senderPromptsItems} onItemClick={onPromptsItemClick} />*/}
            {/*<Sender*/}
            {/*    value={inputContent}*/}
            {/*    header={senderHeader}*/}
            {/*    onSubmit={onSubmit}*/}
            {/*    onChange={setInputInputContent}*/}
            {/*    prefix={attachmentsNode}*/}
            {/*    loading={false}*/}
            {/*    className={styles.sender}*/}
            {/*/>*/}
        </>
    )
});

export default ImChat;