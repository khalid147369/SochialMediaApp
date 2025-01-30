import React, { useState ,useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {submitProfile} from '../features/userSlice'
import { PlusOutlined } from '@ant-design/icons';
import "../config"
import {
  Button,
  Form,
  Input,
  Upload,
} from 'antd';
import { backendUrl } from '../config';

const ProfileForm = ({ className }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
console.log(user.userName)
  const [userName, setUserName] = useState(user.userName || '');
  const [email, setEmail] = useState(user.email || '');
  const [password, setPassword] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [fileList, setFileList] = useState(user.avatar ? [{ url: `${backendUrl}${user.avatar}` }] : []);


  useEffect(()=>{setEmail(user.email);
setUserName(user.userName)
setFileList(user.avatar ? [{ url: `${backendUrl}${user.avatar}` }] : [])
  },[user])
  const handleChange = ({ fileList }) => setFileList(fileList);


  const handleSubmit = () => {
    dispatch(submitProfile({ userName , email, password, oldPassword, fileList }));
  };

  return (
    <div className={className} >
      <Form
        labelCol={{
          span: 4,
        }}
        wrapperCol={{
          span: 14,
        }}
        layout="horizontal"
        style={{
          maxWidth: 600,
        }}
      >
        <Form.Item label="Avatar" valuePropName="fileList" >
          <div className='flex items-center gap-14'>
            <Upload
              listType="picture-card"
              fileList={fileList}
              onChange={handleChange}
            >
              {fileList.length === 0 && <PlusOutlined />}
            </Upload>
            <h1 className='text-2xl font-bold'>Edit Profile</h1>
          </div>
        </Form.Item>
        <Form.Item label="UserName">
          <Input value={userName} onChange={(e) => setUserName(e.target.value)} />
        </Form.Item>
        <Form.Item 
          label="Email"
          rules={[
            {
              type: 'email',
              message: 'The input is not valid E-mail!',
            },
          ]}
        >
          <Input value={email} onChange={(e) => setEmail(e.target.value)} />
        </Form.Item>
        <Form.Item label="Old Password">
          <Input.Password value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
        </Form.Item>
        <Form.Item label="New Password">
          <Input.Password value={password} onChange={(e) => setPassword(e.target.value)} />
        </Form.Item>
        <Form.Item className=' ml-36'>
          <Button onClick={handleSubmit}>Update Profile</Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ProfileForm;