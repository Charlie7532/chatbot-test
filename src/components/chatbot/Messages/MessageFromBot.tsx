import CanvaLogo from '@/components/CanvaLogo';
import React, { ReactNode, ReactElement } from 'react';

// Define the props interface
interface MessageFromBotProps {
    message?: string; // Optional message prop
    children?: ReactNode; // Optional children prop
}

const MessageFromBot: React.FC<MessageFromBotProps> = ({ message, children }) => {
    // Function to check if children contain a <p> element and wrap it with the desired class
    const renderChildrenWithClass = (children: ReactNode): ReactNode => {
        return React.Children.map(children, (child) => {
            if (React.isValidElement(child) && child.type === 'p') {
                // Clone the <p> element and add the class
                return React.cloneElement(child as ReactElement<{ className?: string }>, {
                    className: `${child.props.className || ''} fFOiLQ _5Ob_nQ fM_HdA upnMoA`,
                });
            }
            return child; // Return the child as is if it's not a <p> element
        });
    };

    return (
        <div className="_3T4zuQ SCjFjg BMOCzQ">
            <div className="x6XCCg" style={{ '--69qs7g': '8px', '--3kYYrw': 'start' } as React.CSSProperties}>
                <div className="JyB_vw" style={{ '--8ZV4pQ': '8px', '--5kmWhA': 'flex-end' } as React.CSSProperties}>
                    <CanvaLogo />
                    <div className="yYw_FA">
                        <div className="x6XCCg" style={{ '--69qs7g': '0px', '--3kYYrw': 'stretch' } as React.CSSProperties}>
                            <div className="_7cYPtw Pw056w BMOCzQ zPPL6g EC2pjw" style={{ '--gms-pw': '16px' } as React.CSSProperties}>
                                <div className="x6XCCg" style={{ '--69qs7g': '12px' } as React.CSSProperties}>
                                    <div className="x6XCCg" style={{ '--69qs7g': '8px' } as React.CSSProperties}>
                                        {message || renderChildrenWithClass(children)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="BMOCzQ EC2pjw" style={{ '--sW1q4A': '32px' } as React.CSSProperties}>
                    <div className="x6XCCg" style={{ '--69qs7g': '4px' } as React.CSSProperties}>
                        <div className="k3zO6A">
                            <div className="YTRpDQ" style={{ '--4oFB4A': '12px', '--cgyfzQ': 'start', '--_nyLbw': 'center' } as React.CSSProperties}>
                                <span className="rWcFsA">Need help? </span>
                                <span aria-hidden="true" className="mN_t1g">Chat with our support team</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MessageFromBot;
