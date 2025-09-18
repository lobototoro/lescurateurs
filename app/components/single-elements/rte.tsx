"use client";
import dynamic from 'next/dynamic';
import React, { useState, useMemo } from 'react';

import 'react-quill-new/dist/quill.snow.css';

export default function RTE() {
  const [value, setValue] = useState('');
  const ReactQuill = useMemo(
    () => dynamic(() => import('react-quill-new'), { ssr: false }),
    []
  );

  return (
    <ReactQuill theme="snow" value={value} onChange={setValue}>
      <div style={{ height: '400px' }} />
    </ReactQuill>
  );
}
