import React, { ReactNode } from 'react';

// Define the props interface
interface CustomTemplateRequestProps {
    requestText?: string; // Make requestText optional
    children?: ReactNode; // Allow children to be passed
}

const CustomTemplateRequest: React.FC<CustomTemplateRequestProps> = ({ requestText, children }) => {
    return (
        <div className="_3T4zuQ _1j41JQ BMOCzQ">
            <div
                className="kPk2aw BMOCzQ GsIi1Q EC2pjw"
                style={{ '--gms-pw': '16px' } as React.CSSProperties}
            >
                <span className="fFOiLQ _5Ob_nQ fM_HdA upnMoA">
                    {requestText && <>{requestText} </>}
                    {children}
                </span>
            </div>
        </div>
    );
};

export default CustomTemplateRequest;
