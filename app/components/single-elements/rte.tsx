"use client";
import dynamic from 'next/dynamic';
import React, { useState, useMemo, useEffect } from 'react';

import 'react-quill-new/dist/quill.snow.css';

export default function RTE(props: {
  'aria-label': string,
  className?: string,
  'data-testid': string,
  getMainContent: (v: string) => void,
  setMainContent?: () => string,
}) {
  const [value, setValue] = useState('');
  const ReactQuill = useMemo(
    () => dynamic(() => import('react-quill-new'), { ssr: false }),
    []
  );

  useEffect(() => {
    if (props.setMainContent) {
      setValue(props.setMainContent());
    }
  }, []);

  useEffect(() => {
    props.getMainContent(value);
  }, [value]);

  return (
    <ReactQuill theme="snow" value={value} onChange={setValue}>
      <div
        aria-label={props['aria-label']}
        className={props.className}
        data-testid={props['data-testid']}
      />
    </ReactQuill>
  );
}
