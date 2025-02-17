import DOMPurify from 'isomorphic-dompurify';

export const ArticleTitle = ({ text, level, size = 'medium', }: { 
  text: string,
  level: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6',
  size?: 'small' | 'medium' | 'large' | 'extra-large'
}) => {
  const tag: string = DOMPurify.sanitize(`<${level} class="article-title_${size}">${text}</${level}>`);

  return (
    <div dangerouslySetInnerHTML={{ __html: tag }} />
  );
};