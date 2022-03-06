import { Button, Form, Input, PageHeader, Row } from 'antd';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Header() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.target.parentElement.children[0].blur();
    navigate(`/search?query=${query}`);
    setQuery('');
  };

  return (
    <PageHeader style={{ boxShadow: '0 4px 2px -2px gray', padding: 0 }}>
      <Row
        style={{
          alignItems: 'center',
          paddingBottom: '12px',
          justifyContent: 'space-between',
        }}
      >
        <Row style={{ alignItems: 'center' }}>
          <Link to='/'>
            <img
              src='https://pbs.twimg.com/profile_images/878250120587997184/siODyNVB_400x400.jpg'
              alt='university logo'
              style={{ width: 60, marginRight: 10 }}
            />
          </Link>
          <Form onSubmit={handleSubmit}>
            <Input
              placeholder='Search...'
              size='large'
              style={{ maxWidth: 300 }}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            ></Input>
            <button
              type='submit'
              onClick={handleSubmit}
              style={{ display: 'none' }}
            ></button>
          </Form>
        </Row>
        <Button
          type='primary'
          size='large'
          onClick={() => {
            navigate('/admin');
          }}
          style={{
            marginRight: '20px',
          }}
        >
          Admin
        </Button>
      </Row>
    </PageHeader>
  );
}
