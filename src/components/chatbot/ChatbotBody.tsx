import ChatbotFooter from "./ChatbotFooter"
import ChatbotContent from "./ChatbotContetn"

const ChatbotBody = () => {
    return (
        <div className="NoN2AA _5_MXiw" style={{ zIndex: 1 }}>
            <div className="cD74fQ">
                <div className="theme light">
                    <div className=""
                        style={{
                            position: 'fixed',
                            right: 50,
                            bottom: 80,
                            visibility: 'visible',
                        }}
                    >
                        <div aria-label="Assistant panel" id=":r9p:" role="dialog" tabIndex={-1} className="PF9Flw _0X0PUQ">
                            <div className="NsDoSw BMOCzQ ESGcVw WvC7Pg rCi29A">
                                <ChatbotContent />
                                <ChatbotFooter />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default ChatbotBody;