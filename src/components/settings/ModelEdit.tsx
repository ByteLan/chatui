import {Form, Modal, Toast} from "@douyinfe/semi-ui";
import {useCallback, useEffect, useRef, useState} from "react";
import {hostAddr} from "../../serverConfig.tsx";

export interface ModelEditProps {
    mode: 'create' | 'edit',
    modelKey?: string,
    // modelName?: string,
    // modelType?: string,
    // modelDescription?: string,
    // modelSortOrder?: number,
    // modelOpenAiUrl?: string,
    // modelOpenAiKey?: string,
    // modelOpenAiName?: string,
    // modelOpenAiPrompt?: string,
    modalVisible: boolean,
    onModalVisibleChange: (visible: boolean)=>void,
}

export default function ModelEdit(props: ModelEditProps) {
    const [formDisable, setFormDisable] = useState<boolean>(props.mode === 'edit');
    const formApiRef = useRef(null);
    const [modalHandling, setModalHandling] = useState<boolean>(false);
    const initialValuesRef = useRef({
        modelKey: '',
        modelName: '',
        modelDescription: '',
        modelSortOrder: 0,
        modelType: 'openai',
        openaiModelUrl: '',
        openaiModelKey: '',
        openaiModelName: '',
        openaiModelPrompt: '',
    });

    useEffect(() => {
        if(props.modalVisible){
            setModalHandling(false);
            initialValuesRef.current = {
                modelKey: '',
                modelName: '',
                modelDescription: '',
                modelSortOrder: 0,
                modelType: 'openai',
                openaiModelUrl: '',
                openaiModelKey: '',
                openaiModelName: '',
                openaiModelPrompt: '',
            };
            setFormDisable(props.mode === 'edit');
            if(props.mode === 'edit'){
                // setFormDisable(true);
                if(props.modelKey == null || formApiRef.current == null){
                    const opts = {
                        content: "修改模型错误，模型Key不存在",
                        duration: 3,
                        stack: true,
                        theme: 'light',
                    };
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-expect-error
                    Toast.error(opts);
                    props.onModalVisibleChange(false);
                }
                handleGetModelParams(props.modelKey);
            }else if(props.mode === 'create'){
                return;
            }
        }
    }, [props.modalVisible]);

    const handleOk = useCallback(
        () => {
            setModalHandling(true);
            if(props.mode === 'create'){
                if(formApiRef.current == null){
                    const opts = {
                        content: "创建模型错误，系统异常",
                        duration: 3,
                        stack: true,
                        theme: 'light',
                    };
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-expect-error
                    Toast.error(opts);
                    setModalHandling(false);
                    return;
                }
                const values = formApiRef.current.getValues();
                const modelInfo = {"openaiModelPrompt":"","modelDescription":""};
                for (const key of Object.keys(values)) {
                    modelInfo[key] = values[key];
                }
                fetch(hostAddr+"ai_chat/api/create_tenant_openai_model",{
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify({"modelInfo": modelInfo})
                }).then((data)=>data.json())
                   .then((data)=>{
                        if(data.responseStatus == "success"){
                            const opts = {
                                content: "创建模型成功",
                                duration: 3,
                                stack: true,
                                theme: 'light',
                            };
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            // @ts-expect-error
                            Toast.success(opts);
                            props.onModalVisibleChange(false);
                            setModalHandling(false);
                        }else{
                            throw new Error(data.responseStatus);
                        }
                    }).catch((err)=>{
                        console.error(err);
                        // props.onModalVisibleChange(false);
                        const opts = {
                            content: "创建模型失败"+err,
                            duration: 3,
                            stack: true,
                            theme: 'light',
                        };
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-expect-error
                        Toast.error(opts);
                        setModalHandling(false);
                    }).finally(()=>{
                        setModalHandling(false);
                    })

            }else{
                if(props.modelKey == null || formApiRef.current == null) {
                    const opts = {
                        content: "修改模型错误，系统异常",
                        duration: 3,
                        stack: true,
                        theme: 'light',
                    };
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-expect-error
                    Toast.error(opts);
                    setModalHandling(false);
                    return;
                }
                const values = formApiRef.current.getValues();
                // 找出values和initialValuesRef.current中不同的字段，放入Array中
                const updateModelArray = [];
                const updateOpenaiParamsArray = [];
                // console.log(values);
                // 如果values没有"modelDescription"字段，那么就加上
                if(!Object.prototype.hasOwnProperty.call(values, "modelDescription")){
                    values.modelDescription = "";
                }
                if(!Object.prototype.hasOwnProperty.call(values, "openaiModelPrompt")){
                    values.openaiModelPrompt = "";
                }
                for (const key of Object.keys(values)) {
                    if (values[key] !== initialValuesRef.current[key]) {
                        if(key.startsWith('openai')){
                            updateOpenaiParamsArray.push({
                                updateItem: key,
                                updateContent: values[key],
                            });
                        }else{
                            updateModelArray.push({
                                updateItem: key,
                                updateContent: values[key],
                            });
                        }
                    }
                }
                if(updateModelArray.length === 0 && updateOpenaiParamsArray.length === 0){
                    const opts = {
                        content: "没有需要修改的内容",
                        duration: 3,
                        stack: true,
                        theme: 'light',
                    };
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-expect-error
                    Toast.info(opts);
                    setModalHandling(false);
                    return;
                }
                const fetchBody = {
                    "oldModelKey": props.modelKey,
                    "updateTenantModelArray": updateModelArray,
                    "updateModelParamsArray": updateOpenaiParamsArray,
                }
                Modal.info({
                    title: '确认修改模型？',
                    content: <div style={{display: 'flex', flexDirection: 'column'}}>
                        <span>将执行以下修改：</span>
                        {updateModelArray.map((item)=>{
                            return <span key={item.updateItem}>{item.updateItem}: {item.updateContent}</span>
                        })}
                        {updateOpenaiParamsArray.map((item)=>{
                            return <span key={item.updateItem}>{item.updateItem}: {item.updateContent}</span>
                        })}
                    </div>,
                    okText: '确认',
                    cancelText: '取消',
                    onCancel: () => {
                        setModalHandling(false);
                    },
                    onOk: () => {
                        fetch(hostAddr+"ai_chat/api/update_tenant_openai_model_params",{
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            credentials: 'include',
                            body: JSON.stringify(fetchBody)
                        }).then((data)=>data.json())
                            .then((data)=>{
                                if(data.responseStatus == "success"){
                                    const opts = {
                                        content: "修改模型成功"+JSON.stringify(data),
                                        duration: 3,
                                        stack: true,
                                        theme: 'light',
                                    };
                                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                    // @ts-expect-error
                                    Toast.success(opts);
                                    props.onModalVisibleChange(false);
                                    setModalHandling(false);
                                }else{
                                    throw new Error(data.responseStatus);
                                }
                            }).catch((err)=>{
                            console.error(err);
                            // props.onModalVisibleChange(false);
                            const opts = {
                                content: "修改模型失败"+err,
                                duration: 3,
                                stack: true,
                                theme: 'light',
                            };
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            // @ts-expect-error
                            Toast.error(opts);
                            setModalHandling(false);
                        }).finally(()=>{
                            setModalHandling(false);
                        })
                    }
                });


            }
        },[props]
    )
    const handleCancel = useCallback(
        () => {
            props.onModalVisibleChange(false);
        },[props]
    )
    const handleGetModelParams = useCallback((modelKey)=>{
        fetch(hostAddr+"ai_chat/api/get_tenant_openai_model_params",{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                "modelKey": modelKey,
            })
        }).then((data)=>data.json())
            .then((data)=>{
                if(data.responseStatus == "success"){
                    if(formApiRef.current == null){
                        throw new Error("formApiRef is null");
                    }
                    formApiRef.current.setValues({
                        modelKey: data.modelKey,
                        modelName: data.modelName,
                        modelDescription: data.modelDescription,
                        modelSortOrder: data.sortOrder,
                        modelType: data.modelType,
                        openaiModelUrl: data.openaiModelUrl,
                        openaiModelKey: data.openaiModelKey,
                        openaiModelName: data.openaiModelName,
                        openaiModelPrompt: data.openaiModelPrompt,
                    })
                    initialValuesRef.current = {
                        modelKey: data.modelKey,
                        modelName: data.modelName,
                        modelDescription: data.modelDescription,
                        modelSortOrder: data.sortOrder,
                        modelType: data.modelType,
                        openaiModelUrl: data.openaiModelUrl,
                        openaiModelKey: data.openaiModelKey,
                        openaiModelName: data.openaiModelName,
                        openaiModelPrompt: data.openaiModelPrompt,
                    };
                    setFormDisable(false);
                }else{
                    throw new Error(data.responseStatus);
                }

            }).catch((err)=>{
                console.error(err);
                props.onModalVisibleChange(false);
                const opts = {
                    content: "模型参数获取失败"+err,
                    duration: 3,
                    stack: true,
                    theme: 'light',
                };
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                Toast.error(opts);
            })
    },[props])


    function getFormApi(formApi){
        formApiRef.current = formApi;
    }

    return (
        <Modal
            title={props.mode==='create' ? '创建模型' : '编辑模型'}
            visible={props.modalVisible}
            onOk={()=>{
                formApiRef.current?.submitForm();
            }}
            onCancel={handleCancel}
            maskClosable={false}
            style={{height: '80%', width: '80%'}}
            bodyStyle={{
                overflow: 'auto',
            }}
            confirmLoading={modalHandling}
        >
            <div>
                <Form disabled={formDisable} getFormApi={getFormApi} onSubmit={handleOk}>
                    {
                        (formState)=>{
                            return (
                                <>
                                    <Form.Input field='modelKey'
                                                label="模型Key（用于平台API调用）"
                                                placeholder={'用于平台API调用'}
                                                rules={[{max:50, message:"模型Key长度不能超过50个字符"},{required: true, message: '模型Key不能为空'}]}></Form.Input>
                                    <Form.Input field='modelName'
                                                rules={[{max:50, message:"模型名称长度不能超过50个字符"},{required: true, message: '模型名称不能为空'}]}
                                                label="模型名称"></Form.Input>
                                    <Form.Input field='modelDescription'
                                                rules={[{max:200, message:"模型描述长度不能超过200个字符"}]}
                                                label="模型描述"></Form.Input>
                                    <Form.InputNumber field='modelSortOrder'
                                                      label="模型排序"
                                                      rules={[{required: true, message: '模型排序不能为空'}]}
                                                      initValue={1}></Form.InputNumber>
                                    <Form.RadioGroup field="modelType" label='模型类型' initValue={"openai"}>
                                        <Form.Radio value="openai">OpenAI</Form.Radio>
                                        <Form.Radio value="openai-ma1">OpenAI+</Form.Radio>
                                    </Form.RadioGroup>
                                    {(formState.values.modelType === 'openai' || formState.values.modelType === 'openai-ma1') ? (
                                        <>
                                            <p>OpenAI模型参数配置：</p>
                                            <Form.Input field='openaiModelUrl'
                                                        rules={[{required: true, message: 'API URL不能为空'},{max:200, message:"API URL长度不能超过200个字符"}]}
                                                        label="API URL"></Form.Input>
                                            <Form.Input field='openaiModelKey'
                                                        rules={[{required: true, message: 'API Key不能为空'},{max:200, message:"API Key长度不能超过200个字符"}]}
                                                        label="API Key （配置后不可见，注意保存）"></Form.Input>
                                            <Form.Input field='openaiModelName'
                                                        rules={[{max:50, message:"模型名称长度不能超过50个字符"},{required: true, message: '模型名称不能为空'}]}
                                                        label="Model Name"></Form.Input>
                                            <Form.TextArea field='openaiModelPrompt'
                                                           rules={[{max:2000, message:"模型Prompt长度不能超过2000个字符"}]}
                                                           label="Model Prompt"></Form.TextArea>
                                        </>
                                    ):(
                                        <>
                                            <p>未知模型参数，请选择。</p>
                                        </>
                                    )}
                                </>

                            )
                        }
                    }
                </Form>
            </div>
        </Modal>
    )
}