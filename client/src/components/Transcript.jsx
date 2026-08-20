function Transcript({ messages = [] }) {
  return (
    <section className="transcript">

      <div className="section-header">
        <h2>Conversation</h2>

        <span>
          {messages.length} messages
        </span>
      </div>


      {/* =====================================
          EMPTY STATE
      ===================================== */}

      {messages.length === 0 ? (

        <div className="empty-conversation">

          <div className="empty-icon">
            💬
          </div>

          <h3>
            No conversation yet
          </h3>

          <p>
            Click "Start Call" to begin
            your health intake.
          </p>

        </div>

      ) : (

        /* ===================================
           MESSAGES
        =================================== */

        <div className="conversation-list">

          {messages.map(
            (message, index) => {

              // ------------------------------
              // ERROR
              // ------------------------------

              if (
                message.role ===
                "error"
              ) {

                return (
                  <div
                    key={index}
                    className="message error-message"
                  >

                    <div className="message-label">
                      ERROR
                    </div>

                    <div className="message-text">
                      {message.text}
                    </div>

                  </div>
                );
              }


              // ------------------------------
              // AI / USER MESSAGE
              // ------------------------------

              const isAI =
                message.role ===
                "assistant";


              return (
                <div
                  key={index}
                  className={`message ${
                    isAI
                      ? "ai-message"
                      : "user-message"
                  }`}
                >

                  <div className="message-label">

                    {isAI
                      ? "AI"
                      : "You"}

                  </div>


                  <div className="message-text">

                    {message.text}

                  </div>

                </div>
              );

            }
          )}

        </div>

      )}

    </section>
  );
}

export default Transcript;