import DOMPurify from 'isomorphic-dompurify';
import { Alegreya } from 'next/font/google';

const alegreya = Alegreya({
  subsets: ['latin'],
  display: 'swap',
});

export const ArticleTitle = ({
  text,
  level,
  size = 'medium',
  color = 'white',
  spacings = '',
  link,
}: { 
  text: string,
  level: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6',
  color?: 'white' | 'black' | 'primary' | 'secondary',
  size?: 'small' | 'medium' | 'large' | 'extra-large',
  spacings?: string | '',
  link?: string,
}) => {
  const tag: string = DOMPurify.sanitize(`<${level} class="${alegreya.className} article-title_${size} article-title_${color} ${spacings}">${text}</${level}>`);

  if (link) {
    const urlLink = DOMPurify.sanitize(`<a href="${link}" target="_blank" class="is-primary">${tag}</a>`);
    
    return (
      <div dangerouslySetInnerHTML={{ __html: urlLink }} />  
    )
  }
 
  return (
    <div dangerouslySetInnerHTML={{ __html: tag }} />
  );
};