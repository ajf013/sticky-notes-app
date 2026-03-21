import React, { useEffect, useRef } from 'react';
import DOMPurify from 'dompurify';

const NoteContent = ({ html, style }) => {
    const contentRef = useRef(null);

    const createMarkup = (htmlContent) => {
        return {
            __html: DOMPurify.sanitize(htmlContent, {
                ADD_CLASSES: {
                    '*': ['ql-syntax', 'ql-clipboard']
                },
                ADD_ATTR: ['spellcheck', 'data-language', 'class']
            })
        };
    };

    useEffect(() => {
        if (!contentRef.current) return;

        const codeBlocks = contentRef.current.querySelectorAll('pre.ql-syntax');
        
        codeBlocks.forEach((block) => {
            // Check if button already exists to avoid duplicates
            if (block.querySelector('.copy-code-btn')) return;

            const button = document.createElement('button');
            button.className = 'copy-code-btn';
            button.innerHTML = 'Copy';
            button.type = 'button';
            
            button.onclick = (e) => {
                e.stopPropagation();
                const code = block.innerText.replace('Copy', '').trim();
                navigator.clipboard.writeText(code)
                    .then(() => {
                        button.innerHTML = 'Copied!';
                        button.classList.add('copied');
                        setTimeout(() => {
                            button.innerHTML = 'Copy';
                            button.classList.remove('copied');
                        }, 2000);
                    })
                    .catch((err) => {
                        console.error('Failed to copy code: ', err);
                        button.innerHTML = 'Error';
                    });
            };

            block.style.position = 'relative';
            block.appendChild(button);
        });
    }, [html]);

    return (
        <div 
            ref={contentRef}
            dangerouslySetInnerHTML={createMarkup(html)} 
            style={style} 
        />
    );
};

export default NoteContent;
