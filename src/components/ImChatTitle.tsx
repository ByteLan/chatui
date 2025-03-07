import React, {useEffect, useRef} from "react";
import {Collapse, Form, Tag} from '@douyinfe/semi-ui';
import {Flex} from "antd";

const {Option} = Form.Select;

export default function ImChatTitle({chatTitle, modelList, onModelChange, onHistoryRoundChange, style, modelKey, historyRound }:{chatTitle?:string, modelList?:{key:string, name:string, property?: string[]}[], onModelChange?:(key:string)=>void, onHistoryRoundChange?:(round:number)=>void, style?:React.CSSProperties, modelKey?:string, historyRound?:number}) {
    const newStyle = {
        width: '100%',
        ...style,
    }

    const modelSelectRef = useRef();
    const historyRoundSelectRef = useRef();
    const [modelValue, setModelValue] = React.useState("");

    function onModelValueChange(newValue:any) {
        if(newValue!=null&&newValue.modelName!=null&&typeof newValue.modelName=="string"){
            onModelChange?.(newValue.modelName);
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



    return (
        <div style={newStyle}>
                <Collapse>
                    <Collapse.Panel style={{paddingLeft: 18}} header={chatTitle==null?"":chatTitle.length>8?chatTitle.substring(0,8)+"...":chatTitle} itemKey="1" disabled={modelList==null || modelList.length==0} extra={
                        <Tag color="violet" style={{ margin: 0 }}>
                            {modelValue}
                        </Tag>
                    }>
                        <Flex wrap justify='space-between' align='center'>
                            {modelList!=null&&modelList.length>0&&onModelChange!=null?(
                                <>
                                    <Form ref={modelSelectRef} onValueChange={onModelValueChange} style={{ minWidth:260 }}>
                                        <Form.Select initValue={modelKey} defaultActiveFirstOption={true} field="modelName" label={{ text: '模型选择' }} style={{ minWidth:260 }} >
                                            {modelList.map((item)=>{return <Option value={item.key}>{item.name}</Option>})}
                                        </Form.Select>
                                    </Form>
                                    {onHistoryRoundChange!=null?(
                                        <Form ref={historyRoundSelectRef} onValueChange={(newValue)=>{onHistoryRoundChange(newValue.round)}} style={{ minWidth:260 }}>
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

}