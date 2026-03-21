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

        // 1. Handle Block Code (pre.ql-syntax)
        const codeBlocks = contentRef.current.querySelectorAll('pre.ql-syntax');
        codeBlocks.forEach((block) => {
            if (block.querySelector('.copy-code-btn')) return;

            const button = document.createElement('button');
            button.className = 'copy-code-btn';
            button.innerHTML = 'Copy';
            button.type = 'button';
            
            button.onclick = (e) => {
                e.stopPropagation();
                // Get text but remove the button text if it somehow gets included
                const code = block.innerText.replace('Copy', '').replace('Copied!', '').trim();
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

        // 2. Handle Inline Code (code tags not inside pre)
        const inlineCodes = contentRef.current.querySelectorAll(':not(pre) > code');
        inlineCodes.forEach((codeTag) => {
            if (codeTag.querySelector('.copy-inline-btn')) return;

            const iconSpan = document.createElement('span');
            iconSpan.className = 'copy-inline-btn';
            iconSpan.title = 'Copy code';
            iconSpan.innerHTML = '📋'; // Small clipboard emoji or icon
            
            iconSpan.onclick = (e) => {
                e.stopPropagation();
                // Copy ONLY the text before the icon
                const codeText = codeTag.innerText.replace('📋', '').replace('✓', '').trim();
                navigator.clipboard.writeText(codeText)
                    .then(() => {
                        const originalHtml = iconSpan.innerHTML;
                        iconSpan.innerHTML = '✓'; // Change to checkmark
                        iconSpan.classList.add('copied');
                        setTimeout(() => {
                            iconSpan.innerHTML = originalHtml;
                            iconSpan.classList.remove('copied');
                        }, 1500);
                    });
            };

            codeTag.appendChild(iconSpan);
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
