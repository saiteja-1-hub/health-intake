function StatusBadge({ isConnected, status }) {
  let displayStatus = status;

  if (!isConnected) {
    displayStatus = "DISCONNECTED";
  }

  return (
    <div className="status-container">
      <span>WebSocket: </span>

      <strong>
        {isConnected ? "Connected" : "Disconnected"}
      </strong>

      <div className="status">
        Status: <strong>{displayStatus}</strong>
      </div>
    </div>
  );
}

export default StatusBadge;