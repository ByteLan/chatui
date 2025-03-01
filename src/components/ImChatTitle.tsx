import React, {useEffect, useRef} from "react";
import { Collapse, Form } from '@douyinfe/semi-ui';
import {Flex} from "antd";

const {Option} = Form.Select;

export default function ImChatTitle({chatTitle, modelList, onModelChange, onHistoryRoundChange, style, modelName, historyRound }:{chatTitle?:string, modelList?:{key:string, name:string, property?: string[]}[], onModelChange?:(key:string)=>void, onHistoryRoundChange?:(round:number)=>void, style?:React.CSSProperties, modelName?:string, historyRound?:number}) {
    const newStyle = {
        width: '100%',
        ...style,
    }

    const modelSelectRef = useRef();
    const historyRoundSelectRef = useRef();

    function onModelValueChange(newValue:any) {
        if(newValue!=null&&newValue.modelName!=null&&typeof newValue.modelName=="string"){
            if(typeof newValue.modelName=="string"){
                onModelChange?.(newValue.modelName);
            }
        }
    }

    useEffect(()=>{
        modelSelectRef.current?.formApi.setValue("modelName", modelName);
    },[modelName])
    useEffect(() => {
        historyRoundSelectRef.current?.formApi.setValue("round", historyRound);
    }, [historyRound]);

    if(chatTitle==null&&(modelList==null||modelList.length==0)){
        return <></>
    }



    return (
        <div style={newStyle}>
                <Collapse>
                    <Collapse.Panel header={chatTitle==null?"":chatTitle.length>9?chatTitle.substring(0,9)+"...":chatTitle} itemKey="1" disabled={modelList==null || modelList.length==0}>
                        <Flex wrap justify='space-between' align='center'>
                            {modelList!=null&&modelList.length>0&&onModelChange!=null?(
                                <>
                                    <Form ref={modelSelectRef} onValueChange={onModelValueChange} style={{ minWidth:300 }}>
                                        <Form.Select initValue={modelName} defaultActiveFirstOption={true} field="modelName" label={{ text: '模型选择', optional: true }} style={{ minWidth:300 }} >
                                            {modelList.map((item)=>{return <Option value={item.key}>{item.name}</Option>})}
                                        </Form.Select>
                                    </Form>
                                    {onHistoryRoundChange!=null?(
                                        <Form ref={historyRoundSelectRef} onValueChange={(newValue)=>{onHistoryRoundChange(newValue.round)}} style={{ minWidth:300 }}>
                                            <Form.Select initValue={historyRound} field="round" label={{ text: '上下文历史轮数', optional: true }} style={{ minWidth:300 }}>
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