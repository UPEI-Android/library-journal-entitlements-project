import React from 'react';
import { API_URL } from '../util';
import { Layout, Row, Col, Card, Spin, Button, Avatar, Alert } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import Header from '../components/header';
import AdminSetupForm from '../components/admin/setup-form';
import AdminLoginForm from '../components/admin/login-form';
import StyleContext from '../util/styleContext';
import { useNavigate } from 'react-router-dom';
import StyleConfigurationSection from '../components/admin/config-style';
import FileModificationSection from '../components/admin/config-files';

export default function Admin() {
  const [error, setError] = React.useState(undefined);
  const [loggingOut, setLoggingOut] = React.useState(false);
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [adminSetup, setAdminSetup] = React.useState(false);
  const [loadingPage, setLoadingPage] = React.useState(true);
  const [loginMessage, setLoginMessage] = React.useState('');
  const styleConfig = React.useContext(StyleContext);
  const navigate = useNavigate();

  React.useEffect(() => {
    const fetchAdminStatus = async () => {
      const res = await fetch(`${API_URL}/admin/setup`);
      if (res.status === 200) {
        setAdminSetup(true);
        if (sessionStorage.getItem('adminKey')) {
          const resValid = await fetch(
            `${API_URL}/admin/valid-token?adminKey=${sessionStorage.getItem(
              'adminKey'
            )}`
          );
          if (resValid.status === 401) {
            setLoginMessage('Admin session has expired. Please login again.');
            setLoggedIn(false);
          } else {
            setLoggedIn(true);
          }
        }
      }
      setLoadingPage(false);
    };
    setError(undefined);
    fetchAdminStatus();
  }, []);

  const logout = async () => {
    if (!sessionStorage.getItem('adminKey')) navigate('/');

    setError(undefined);
    setLoggingOut(true);
    try {
      const res = await fetch(
        `${API_URL}/admin/logout?adminKey=${sessionStorage.getItem('adminKey')}`
      );
      setLoggingOut(false);
      if (res.status === 200 || res.status === 401) {
        sessionStorage.removeItem('adminKey');
        navigate('/');
      } else {
        setError('Failed to logout.');
      }
    } catch (error) {
      setLoggingOut(false);
      setError('Failed to logout');
    }
  };

  return (
    <Layout>
      <Header />
      <Layout.Content style={{ padding: '0 2vw' }}>
        <Col span={24} md={{ span: 12, offset: 6 }} style={{ display: 'flex' }}>
          {!loggedIn && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: '10vh',
                width: '100%',
              }}
            >
              {loadingPage && <Spin tip='Loading...' size='large' />}
              {!loadingPage && (
                <Card
                  style={{
                    boxShadow: '5px 8px 24px 5px rgba(208, 216, 243, 0.6)',
                    maxWidth: '700px',
                    minWidth: '300px',
                    width: '100%',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      flexDirection: 'column',
                      marginBottom: '20px',
                    }}
                  >
                    <Avatar
                      style={{
                        backgroundColor: styleConfig?.color
                          ? styleConfig.color
                          : '#1890ff',
                        marginBottom: '20px',
                      }}
                      size={100}
                      icon={<UserOutlined />}
                    />
                    <h1>{adminSetup ? 'Admin Login' : 'Admin Setup'}</h1>
                  </div>
                  {adminSetup ? (
                    <AdminLoginForm
                      loginMessage={loginMessage}
                      setLoginMessage={setLoginMessage}
                      setLoggedIn={setLoggedIn}
                    />
                  ) : (
                    <AdminSetupForm
                      setAdminSetup={setAdminSetup}
                      setLoginMessage={setLoginMessage}
                    />
                  )}
                </Card>
              )}
            </div>
          )}
          {loggedIn && (
            <Col span={24} style={{ marginTop: '30px' }}>
              <Row justify='space-between'>
                <h1>Admin Page</h1>
                <Button
                  size='large'
                  shape='round'
                  onClick={logout}
                  loading={loggingOut}
                >
                  Logout
                </Button>
              </Row>
              {error && (
                <Alert
                  type='error'
                  message={error}
                  showIcon
                  style={{ marginBottom: '10px' }}
                />
              )}
              <FileModificationSection
                setLoggedIn={setLoggedIn}
                setLoginMessage={setLoginMessage}
              />
              <StyleConfigurationSection
                setLoggedIn={setLoggedIn}
                setLoginMessage={setLoginMessage}
              />
            </Col>
          )}
        </Col>
      </Layout.Content>
    </Layout>
  );
}
