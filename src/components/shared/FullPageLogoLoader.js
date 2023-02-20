import React from "react";

function FullPageLogoLoader() {
  return (
    <div className="logo-loader">
      <img src={require("Assets/img/loading.gif")} alt="loading ..." />
    </div>
  );
}

export default FullPageLogoLoader;
