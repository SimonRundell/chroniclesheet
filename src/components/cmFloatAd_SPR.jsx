/**
 * CMFloatAd
 *
 * Floating branding banner – hover to expand full contact details.
 * Modified for Exeter College by Simon Rundell, Dept of Cybersecurity and Digital Technologies.
 *
 * @param {Object} props
 * @param {string} [props.color='#334155']   - Text / icon colour.
 * @param {string} [props.bgColor='#f8fafc'] - Banner background colour.
 * @returns {JSX.Element}
 * @license CC BY-NC-SA 4.0 https://creativecommons.org/licenses/by-nc-sa/4.0/
 */

import { useState, useEffect } from 'react';

const CM_LOGO =
  'data:image/png;base64,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';

export default function CMFloatAd_SPR({ color = '#334155', bgColor = '#f8fafc' }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile,  setIsMobile]  = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const currentYear = new Date().getFullYear();

  const bannerStyle = {
    position:        'fixed',
    bottom:          '10px',
    right:           '20px',
    width:           'max-content',
    maxWidth:        isHovered ? (isMobile ? '95%' : '75%') : '60px',
    height:          isMobile && isHovered ? 'auto' : '60px',
    minHeight:       isMobile && isHovered ? '80px' : '60px',
    padding:         '10px',
    backgroundColor: bgColor,
    color,
    fontSize:        isMobile ? 'xx-small' : 'x-small',
    whiteSpace:      isMobile && isHovered ? 'normal' : 'nowrap',
    overflow:        'hidden',
    transition:      'max-width 0.8s ease-in-out, height 0.4s ease-in-out',
    display:         'flex',
    alignItems:      isMobile && isHovered ? 'flex-start' : 'center',
    justifyContent:  'flex-start',
    cursor:          'pointer',
    flexDirection:   isMobile && isHovered ? 'column' : 'row',
    lineHeight:      isMobile ? '1.2' : 'normal',
    zIndex:          1000,
    border:          isHovered ? '1px solid #cbd5e1' : 'none',
    borderRadius:    '6px',
    boxShadow:       isHovered ? '0 2px 8px rgba(0,0,0,0.12)' : 'none',
  };

  const contentStyle = {
    display:       'flex',
    alignItems:    isMobile && isHovered ? 'flex-start' : 'center',
    gap:           '5px',
    flexDirection: isMobile && isHovered ? 'column' : 'row',
    width:         '100%',
  };

  return (
    <div
      style={bannerStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={contentStyle}>
        <img alt="cm-logo" src={CM_LOGO} height="40" width="40" style={{ flexShrink: 0, borderRadius: '50%', objectFit: 'cover' }} />
        {!isMobile && isHovered && (
          <span>
            &nbsp;&nbsp;&copy; {currentYear} Designed and Created by Simon Rundell, CodeMonkey Design Ltd, Plymouth UK:  | eMail:{' '}
            <a href="mailto:simon@codemonkey.design" style={{ color, textDecoration: 'none' }}>
              simon@codemonkey.design
            </a>
          </span>
        )}
        {isMobile && isHovered && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', fontSize: 'xx-small', lineHeight: '1.2' }}>
            <span>&copy; {currentYear} Simon Rundell, CodeMonkey Design Ltd, Plymouth UK.</span>
            <span>Exeter College, Hele Road, Exeter EX4 4JS.</span>
            <a href="mailto:simon@codemonkey.design" style={{ color, textDecoration: 'none' }}>
              simon@codemonkey.design
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
