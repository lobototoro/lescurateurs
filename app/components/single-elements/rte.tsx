"use client";
import dynamic from 'next/dynamic';
import React, { useState, useMemo, useEffect } from 'react';

import 'react-quill-new/dist/quill.snow.css';
import './rte.css';

export default function RTE(props: {
  'field-id': string,
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
        id={props['field-id']}
        aria-label={props['aria-label']}
        className={`custom-text-area ${props.className}`}
        data-testid={props['data-testid']}
      />
    </ReactQuill>
  );
}
