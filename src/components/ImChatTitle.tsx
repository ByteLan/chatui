import React, {memo, useEffect, useRef} from "react";
import {Collapse, Form, Tag, Toast} from '@douyinfe/semi-ui';
import {Flex} from "antd";
import {isEqual, toNumber} from "lodash";
import {hostAddr} from "../serverConfig.tsx";

const {Option} = Form.Select;

const ImChatTitle = memo(({chatTitle, modelList, onModelChange, onHistoryRoundChange, style, modelKey, historyRound, activeConversationKey }:{chatTitle?:string, modelList?:{key:string, name:string, property?: string[]}[], onModelChange?:(key:string)=>void, onHistoryRoundChange?:(round:number)=>void, style?:React.CSSProperties, modelKey?:string, historyRound?:number, activeConversationKey:string}) => {
    const newStyle = {
        width: '100%',
        ...style,
    }

    const modelSelectRef = useRef();
    const historyRoundSelectRef = useRef();
    const [modelValue, setModelValue] = React.useState("");
    const [modelFormDisabled, setModelFormDisabled] = React.useState(false);
    const [historyRoundFormDisabled, setHistoryRoundFormDisabled] = React.useState(false);


    function onHistoryRoundValueChange(newValue:any) {
        const oldValue = historyRound?historyRound:10;
        if(newValue!=null&&newValue.round!=null&&(typeof toNumber(newValue.round))=="number"&&onHistoryRoundChange&&toNumber(newValue.round)!=toNumber(historyRound)){
            setHistoryRoundFormDisabled(true);
            fetch(hostAddr+'ai_chat/api/set_conversation_selected_history_round',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    conversationId: activeConversationKey,
                    conversationSelectedHistoryRound: toNumber(newValue.round),
                })
            })
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    if(data.responseStatus === 'success'&&data.conversationSelectedHistoryRound) {
                        const opts = {
                            content: "[" + chatTitle + "] 修改携带上下文"+toNumber(data.conversationSelectedHistoryRound)+"轮成功！",
                            duration: 2,
                            stack: true,
                            theme: 'light',
                        }
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-expect-error
                        Toast.success(opts);
                        onHistoryRoundChange(toNumber(data.conversationSelectedHistoryRound));
                    }else{
                        const opts = {
                            content: "[" + chatTitle + "] 修改上下文轮数失败！请检查网络或尝试刷新页面！" + JSON.stringify(data),
                            duration: 3,
                            stack: true,
                            theme: 'light',
                        }
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-expect-error
                        Toast.error(opts);
                        onHistoryRoundChange(oldValue);
                        historyRoundSelectRef.current?.formApi.setValue("round", oldValue);
                    }
                    setHistoryRoundFormDisabled(false);
                })
                .catch((error) => {
                    const opts = {
                        content: "[" + chatTitle + "] 修改上下文轮数异常！请检查网络或尝试刷新页面！" + error,
                        duration: 3,
                        stack: true,
                        theme: 'light',
                    }
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-expect-error
                    Toast.error(opts);
                    onHistoryRoundChange(oldValue);
                    historyRoundSelectRef.current?.formApi.setValue("round", oldValue);
                    setHistoryRoundFormDisabled(false);
                });
        }else{
            setHistoryRoundFormDisabled(false);
        }
    }

    function onModelValueChange(newValue:any) {
        const oldValue = modelKey?modelKey:"default";
        if(newValue!=null&&newValue.modelName!=null&&typeof newValue.modelName=="string"&&onModelChange&&newValue.modelName!=modelKey){
            setModelFormDisabled(true);
            fetch(hostAddr+'ai_chat/api/set_conversation_selected_model',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    conversationId: activeConversationKey,
                    conversationSelectedModel: newValue.modelName,
                })
            })
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    if(data.responseStatus === 'success'&&data.conversationSelectedModel) {
                        const opts = {
                            content: "[" + chatTitle + "] 修改模型成功！",
                            duration: 2,
                            stack: true,
                            theme: 'light',
                        }
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-expect-error
                        Toast.success(opts);
                        onModelChange(data.conversationSelectedModel);
                    }else{
                        const opts = {
                            content: "[" + chatTitle + "] 修改模型失败！请检查网络或尝试刷新页面！" + JSON.stringify(data),
                            duration: 3,
                            stack: true,
                            theme: 'light',
                        }
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-expect-error
                        Toast.error(opts);
                        onModelChange(oldValue);
                        modelSelectRef.current?.formApi.setValue("modelName", oldValue);
                    }
                    setModelFormDisabled(false);
                })
                .catch((error) => {
                    const opts = {
                        content: "[" + chatTitle + "] 修改模型异常！请检查网络或尝试刷新页面！" + error,
                        duration: 3,
                        stack: true,
                        theme: 'light',
                    }
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-expect-error
                    Toast.error(opts);
                    onModelChange(oldValue);
                    modelSelectRef.current?.formApi.setValue("modelName", oldValue);
                    setModelFormDisabled(false);
                });
        }else{
            setModelFormDisabled(false);
        }
    }

    useEffect(()=>{
        modelSelectRef.current?.formApi.setValue("modelName", modelKey);
        modelList?.map(i=>{
            if(i.key==modelKey) {
                setModelValue(i.name);
            }
        })
    },[modelList, modelKey])
    useEffect(() => {
        historyRoundSelectRef.current?.formApi.setValue("round", historyRound);
    }, [historyRound]);

    if(chatTitle==null&&(modelList==null||modelList.length==0)){
        return <></>
    }

    const HeaderNode = memo(({chatTitle, modelValue}:{chatTitle?:string, modelValue?:string}) => {
        return (
            <div style={{width:'100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <span style={{marginLeft: 24}}>{chatTitle==null?"":chatTitle.length>8?chatTitle.substring(0,8)+"...":chatTitle}</span>
                {modelValue?<Tag color="violet" style={{ marginRight: 6 }}>
                    {modelValue}
                </Tag>:<></>}
            </div>
        )
    });

    return (
        <div style={newStyle}>
                <Collapse>
                    <Collapse.Panel
                        style={{paddingLeft: 2, paddingRight: 2, borderRadius:12 }}
                        header={<HeaderNode chatTitle={chatTitle} modelValue={modelValue} />}
                        itemKey="1"
                        disabled={modelList==null || modelList.length==0}
                        // extra={
                        //     <Tag color="violet" style={{ margin: 0 }}>
                        //         {modelValue}
                        //     </Tag>
                        // }
                    >
                        <Flex wrap justify='space-between' align='center'>
                            {modelList!=null&&modelList.length>0&&onModelChange!=null?(
                                <>
                                    <Form ref={modelSelectRef} onValueChange={onModelValueChange} style={{ minWidth:260 }} disabled={modelFormDisabled}>
                                        <Form.Select initValue={modelKey} defaultActiveFirstOption={true} field="modelName" label={{ text: '模型选择' }} style={{ minWidth:260 }}>
                                            {modelList.map((item)=>{return <Option value={item.key}>{item.name}</Option>})}
                                        </Form.Select>
                                    </Form>
                                    {onHistoryRoundChange!=null?(
                                        <Form ref={historyRoundSelectRef} onValueChange={onHistoryRoundValueChange} style={{ minWidth:260 }} disabled={historyRoundFormDisabled}>
                                            <Form.Select initValue={historyRound} field="round" label={{ text: '上下文历史轮数' }} style={{ minWidth:260 }}>
                                                <Option value={5}>5轮</Option>
                                                <Option value={10}>10轮</Option>
                                                <Option value={20}>20轮</Option>
                                                <Option value={50}>50轮</Option>
                                                <Option value={100}>100轮</Option>
                                            </Form.Select>
                                        </Form>
                                    ):(<></>)}
                                </>
                            ):(<></>)}
                        </Flex>
                    </Collapse.Panel>
                </Collapse>
        </div>
    )

}, (prevProps, nextProps) => {
    return prevProps.chatTitle==nextProps.chatTitle&&isEqual(prevProps.modelList,nextProps.modelList)&&prevProps.modelKey==nextProps.modelKey&&prevProps.historyRound==nextProps.historyRound&&prevProps.onModelChange==nextProps.onModelChange&&prevProps.onHistoryRoundChange==nextProps.onHistoryRoundChange;
});

export default ImChatTitle;