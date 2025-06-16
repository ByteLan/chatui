// import LazyImportSuspense from "../../../../silkroad-platform/src/LazyImportSuspense.tsx";
import React, {lazy, memo, useEffect} from "react";
import ImChatTitle from "./ImChatTitle.tsx";
// const ImChatTitle = lazy(() => import('./ImChatTitle.tsx'));
import ImChat from "./ImChat.tsx";
// const ImChat = lazy(() => import('./ImChat.tsx'));

const ImWindow = memo(({
                             chatTitle,
                             messageItems,
                             styles,
                             activeKey,
                             appName,
                             appDescription,
                             modelKey,
                             modelList,
                             historyRound,
                             onHistoryRoundChange,
                             onModelChange,
                             onRequest,
                             checkRightSizeFn,
                             exampleSideChangeFn,
                             setRightNodeFn,
                             setDemoButtonNode,
                             style,
                             socketReconnecting
                         }: {
    chatTitle?: string,
    modelList?: { key: string, name: string, property?: string[] }[],
    onModelChange?: (key: string) => void,
    onHistoryRoundChange?: (round: number) => void,
    style?: React.CSSProperties,
    modelKey?: string,
    historyRound?: number,
    styles: any,
    messageItems: { key: string, loading: boolean, role: string, content: string }[],
    activeKey: string,
    checkRightSizeFn: (() => void) | undefined,
    setRightNodeFn: ((arg0: JSX.Element) => void) | undefined,
    onRequest: (nextContent: string) => void,
    exampleSideChangeFn: (() => void) | undefined,
    setDemoButtonNode: ((arg0: JSX.Element) => void) | undefined,
    appName?: string,
    appDescription?: string,
    socketReconnecting?: boolean })=>
{
    const defaultStyle: React.CSSProperties = {
        height: '100%',
        width: '100%',
        margin: 0,
        padding: 0,
        position: 'relative',
        flexDirection: 'column',
        display: 'flex',
        gap: 0,
        borderRadius: 12,
    }
    const newStyle = {...defaultStyle, ...style};

    return <div id="ImWindow" style={newStyle}>
        {(socketReconnecting!=undefined&&socketReconnecting)?
            (<div
                style={{ marginLeft:0, backgroundColor: 'rgba(var(--semi-pink-1), 1)', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' , borderRadius: newStyle.borderRadius}}
                // style={{ marginLeft:20, backgroundColor: 'rgba(var(--semi-pink-1), 1)' , width: 'calc(100% - 40px)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(var(--semi-red-7), 1)' , borderRadius: '6px'  }}
            >
                <p style={{margin: 0, color:'red'}}>长连接断开，重连中...</p>
            </div>) : (<></>)
        }
        <div style={{
            position: 'relative',
            margin: 0,
            marginTop: 0,
            marginBottom: 0,
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            minHeight: 0, // 防止flex溢出
            overflow: 'hidden', // 防止内容溢出
            width: '100%',
            padding: 0,
            paddingBottom: 0,
        }}>
            {/*悬浮标题*/}
            <div style={{
                position: 'absolute',
                zIndex: 100,
                width: '100%',
                backdropFilter: 'blur(6px)',
                background: 'rgba(255,255,255,0.7)',
                WebkitBackdropFilter: 'blur(6px)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                borderRadius: 12
            }}>
                <ImChatTitle chatTitle={chatTitle} onHistoryRoundChange={onHistoryRoundChange} onModelChange={onModelChange}
                             modelList={modelList} modelKey={modelKey} historyRound={historyRound}
                             activeConversationKey={activeKey}>
                </ImChatTitle>
            </div>
            {/*聊天内容*/}
                <ImChat
                    styles={styles}
                    style={{
                        height: '100%',
                        padding: 12,
                        gap: 6,
                        display: 'flex',
                        flexDirection: 'column',
                        overflowY: 'hidden',
                        overflowX: 'hidden',
                    }}
                    checkRightSizeF={checkRightSizeFn}
                    exampleSideChangeF={exampleSideChangeFn}
                    onRequest={onRequest}
                    activeKey={activeKey}
                    setRightNodeF={setRightNodeFn}
                    messageItems={messageItems}
                    setDemoButtonNode={setDemoButtonNode}
                    appName={appName}
                    appDescription={appDescription}
                    placeholderMargin={10}
                />

        </div>
    </div>
});

export default ImWindow;