import React from 'react';
import { PageHeader } from 'antd';
import ComingSoon from 'components/ComingSoon';
import Head from 'next/head';
import Image from 'next/image';
import dashboardImage from '../public/consulting.jpg';
import { bgWrap } from '@styles/dashboard.module.css';

function Dashboard() {
  return (
    <div style={{ position: 'relative', height: '85vh' }}>
      <Head>
        <title>Dashboard</title>
      </Head>
      <PageHeader style={{ zIndex: 100}} title="Home Dashboard"></PageHeader>

      <Image
        alt="Dashboard Image"
        src={'/consulting.png'}
        layout="fill"
        objectFit="cover"
        quality={100}
        style={{
          position: 'fixed',
          height: '100vh',
          width: '100vw',
          overflow: 'hidden',
          zIndex: -1,
        }}
      />
      {/* <ComingSoon title="Dashboard Feature Is Coming Soon!" /> */}
    </div>
  );
}

export default Dashboard;
