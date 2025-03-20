import React from "react";

const UnitCountThree = () => {
  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <h1 style={styles.text}>Welcome to your portal</h1>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f8f9fa",
  },
  box: {
    padding: "100px",
    border: "2px dotted #333",
    borderRadius: "10px",
    textAlign: "center",
  },
  text: {
    fontSize: "20px",
    fontWeight: "bold",
    color: "#333",
  },
};

export default UnitCountThree;
