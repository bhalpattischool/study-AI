
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { cn } from "@/lib/utils";

interface MessageMarkdownContentProps {
  content: string;
  isTyping: boolean;
  isBot: boolean;
}

const MessageMarkdownContent: React.FC<MessageMarkdownContentProps> = ({ 
  content,
  isTyping,
  isBot
}) => {
  return (
    <div className={cn(
      "prose dark:prose-invert max-w-none w-full break-words overflow-hidden prose-p:my-1 prose-pre:my-2 prose-headings:mt-3 prose-headings:mb-2",
      "prose-pre:overflow-x-auto prose-code:whitespace-pre-wrap",
      isTyping && isBot && "after:content-['▎'] after:animate-pulse after:ml-0.5 after:text-purple-500"
    )}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({node, inline, className, children, ...props}) {
            const match = /language-(\w+)/.exec(className || '');
            
            return !inline && match ? (
              <SyntaxHighlighter
                language={match[1]}
                style={atomDark}
                PreTag="div"
                wrapLines={true}
                wrapLongLines={true}
                {...props}
                customStyle={{
                  borderRadius: '0.375rem',
                  overflowX: 'auto',
                  maxWidth: '100%'
                }}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code className={cn(className, "whitespace-pre-wrap")} {...props}>
                {children}
              </code>
            )
          },
          p({children}) {
            return <p className="whitespace-pre-wrap break-words">{children}</p>
          },
          a({children, href}) {
            return <a href={href} className="break-words" target="_blank" rel="noopener noreferrer">{children}</a>
          }
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MessageMarkdownContent;
