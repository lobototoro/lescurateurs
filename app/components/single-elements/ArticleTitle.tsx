import DOMPurify from 'isomorphic-dompurify';
import { Alegreya } from 'next/font/google';

const alegreya = Alegreya({
  subsets: ['latin'],
  display: 'swap',
});

export const ArticleTitle = ({ text, level, size = 'medium', color = 'white' }: { 
  text: string,
  level: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6',
  color?: 'white' | 'black' | 'primary' | 'secondary',
  size?: 'small' | 'medium' | 'large' | 'extra-large'
}) => {
  const tag: string = DOMPurify.sanitize(`<${level} class="${alegreya.className} article-title_${size} article-title_${color}">${text}</${level}>`);

  return (
    <div dangerouslySetInnerHTML={{ __html: tag }} />
  );
};