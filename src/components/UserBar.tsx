import {useEffect, useState} from 'react';
import { Avatar } from '@douyinfe/semi-ui';
import {Toast} from "@douyinfe/semi-ui";
import {Flex, Modal, Row, Col, Input} from "antd";
import {hostAddr} from "../serverConfig.tsx";
import Cookies from "js-cookie";


export default function UserBar({onLogin, loginState, loginUserName, setLoginState, setLoginUserName, setTempCkid}:{onLogin:()=>void, loginState:boolean, loginUserName:string|null, setLoginState:(state:boolean)=>void, setLoginUserName:(name:string)=>void, setTempCkid:(ckid:string)=>void}) {
    const [loginModalOpen, setLoginModalOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [loginOkTint, setLoginOkTint] = useState('');
    const [userNameStatus, setUserNameStatus] = useState('');
    const [passwordStatus, setPasswordStatus] = useState('');



    function login() {
        setLoginModalOpen(true);
    }

    function handleOk() {
        setUserNameStatus('');
        setPasswordStatus('');
        setLoginOkTint('');
        if(userName === ''||password === ''){
            if (password === ''){
                setPasswordStatus('error');
                setLoginOkTint(' 密码不能为空 ');
            }
            if(userName === ''){
                setUserNameStatus('error');
                setLoginOkTint(' 用户名不能为空 ');
            }
            return;
        }
        // console.log(userName, password);
        setConfirmLoading(true);
        fetch(hostAddr+'auth/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                userName: userName,
                password: password,
            })
        }).then(response => response.json())
            .then(data => {
            setConfirmLoading(false);
            if(data.responseStatus === 'loginSuccess'){
                setLoginModalOpen(false);
                setLoginUserName(data.userName);
                Cookies.set('localckid', data.setCkid);
                setLoginState(true);
                setTempCkid(data.setCkid);
                onLogin();
                const opts = {
                    content: "登录成功！欢迎 "+data.userName+" ！",
                    duration: 3,
                    stack: true,
                    theme: 'light',
                };
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                Toast.success(opts);
            }else{
                setLoginOkTint("登录失败！检查用户名和密码！");
            }
        })
            .catch((error) => {
                setConfirmLoading(false);
                console.error('Error:', error);
                setLoginOkTint("登录失败！"+error);
            });
        // setLoginModalOpen(false);
    }

    function handleCancel() {
        setLoginModalOpen(false);
    }



    function onAvatarClick() {
        setUserNameStatus('');
        setPasswordStatus('');
        setLoginOkTint('');
        login();
    }

    return (

        <div>
            <Flex align='center' style={{height: 64}}>
                <Avatar color="light-blue" style={{ margin: 4 }} alt='Taylor Joy' onClick={onAvatarClick}>
                    {loginState?loginUserName:'未登录'}
                </Avatar>
                <p onClick={onAvatarClick}>{loginState?loginUserName:'点击登录'}</p>
            </Flex>
            <Modal
                title="登录"
                open={loginModalOpen}
                onOk={handleOk}
                confirmLoading={confirmLoading}
                onCancel={handleCancel}
            >
                <Flex vertical={true}>
                    <Row>
                        <Col flex='80px'>用户名:</Col>
                        <Col flex='auto'><Input status={userNameStatus} value={userName} onChange={(e) => setUserName(e.target.value)}/></Col>
                    </Row>
                    <Row>
                        <Col flex='80px'>密码:</Col>
                        <Col flex='auto'><Input status={passwordStatus} value={password} onChange={(e) => setPassword(e.target.value)}/></Col>
                    </Row>
                    <p style={{color: 'red'}}>{loginOkTint}</p>
                </Flex>
            </Modal>
        </div>
    );

}